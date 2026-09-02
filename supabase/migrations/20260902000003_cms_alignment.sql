-- ============================================================================
-- UnitedAthletes CMS — Schema/code alignment migration
-- ===========================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Makes the database match what the application code expects:
--   * homepage_hero / homepage_featured tables (admin homepage editor)
--   * unified draft/published/archived statuses on every CMS table
--   * `profiles` as the single admin-profile table (admin_profiles alias)
--   * activity_logs.admin_user_id references auth user id
--   * storage bucket "media" + public read / admin write policies
--   * is_admin() / is_super_admin() SQL helpers used by RLS
--   * auto-provision of a profile row for every new auth user
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. SQL helper functions used by RLS policies
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.is_active = true
      AND profiles.role IN ('super_admin', 'admin', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.is_active = true
      AND profiles.role = 'super_admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. profiles = admin profile table. Expose the code's expected name via view.
--    The live profiles table has full_name (not name) plus extra columns;
--    the view projects only what the admin UI needs.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.admin_profiles AS
  SELECT id, user_id, full_name, email, role, is_active, created_at, updated_at
  FROM public.profiles;

-- ---------------------------------------------------------------------------
-- 3. Status alignment: every CMS table uses draft | published | archived
-- ---------------------------------------------------------------------------

-- events: seed data used upcoming/live/completed/cancelled; code uses published
UPDATE events SET status = 'published' WHERE status IN ('upcoming', 'live', 'completed');
UPDATE events SET status = 'archived' WHERE status = 'cancelled';
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check
  CHECK (status IN ('draft', 'published', 'archived'));

-- athletes: seed data used active/inactive/retired
UPDATE athletes SET status = 'published' WHERE status IN ('active');
UPDATE athletes SET status = 'draft' WHERE status IN ('inactive');
UPDATE athletes SET status = 'archived' WHERE status IN ('retired');
ALTER TABLE athletes DROP CONSTRAINT IF EXISTS athletes_status_check;
ALTER TABLE athletes ADD CONSTRAINT athletes_status_check
  CHECK (status IN ('draft', 'published', 'archived'));

-- teams: seed data used active/inactive
UPDATE teams SET status = 'published' WHERE status = 'active';
UPDATE teams SET status = 'draft' WHERE status = 'inactive';
ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_status_check;
ALTER TABLE teams ADD CONSTRAINT teams_status_check
  CHECK (status IN ('draft', 'published', 'archived'));

-- testimonials: seed data used active/inactive/archived
UPDATE testimonials SET status = 'published' WHERE status = 'active';
UPDATE testimonials SET status = 'draft' WHERE status = 'inactive';
ALTER TABLE testimonials DROP CONSTRAINT IF EXISTS testimonials_status_check;
ALTER TABLE testimonials ADD CONSTRAINT testimonials_status_check
  CHECK (status IN ('draft', 'published', 'archived'));

-- gallery: seed data used active/inactive/archived
UPDATE gallery SET status = 'published' WHERE status = 'active';
UPDATE gallery SET status = 'draft' WHERE status = 'inactive';
ALTER TABLE gallery DROP CONSTRAINT IF EXISTS gallery_status_check;
ALTER TABLE gallery ADD CONSTRAINT gallery_status_check
  CHECK (status IN ('draft', 'published', 'archived'));

-- ---------------------------------------------------------------------------
-- 4. Homepage tables (used by /admin/homepage and the public homepage)
-- ---------------------------------------------------------------------------

-- updated_at trigger function (re-created defensively; the base migration's
-- copy may not exist if earlier migrations were partially applied)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TABLE IF NOT EXISTS homepage_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL DEFAULT '',
  subheading TEXT DEFAULT '',
  button_text TEXT DEFAULT '',
  button_url TEXT DEFAULT '',
  background_image TEXT DEFAULT '',
  overlay_opacity NUMERIC NOT NULL DEFAULT 0.5 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS homepage_hero_updated_at ON homepage_hero;
CREATE TRIGGER homepage_hero_updated_at BEFORE UPDATE ON homepage_hero
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE IF NOT EXISTS homepage_featured (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES homepage_sections(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('programmes','athletes','events','articles','testimonials','gallery')),
  content_ids UUID[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS homepage_featured_updated_at ON homepage_featured;
CREATE TRIGGER homepage_featured_updated_at BEFORE UPDATE ON homepage_featured
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE homepage_hero ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_homepage_hero" ON homepage_hero;
CREATE POLICY "public_read_homepage_hero" ON homepage_hero
  FOR SELECT USING (is_enabled = true);
DROP POLICY IF EXISTS "admins_manage_homepage_hero" ON homepage_hero;
CREATE POLICY "admins_manage_homepage_hero" ON homepage_hero
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE homepage_featured ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_homepage_featured" ON homepage_featured;
CREATE POLICY "public_read_homepage_featured" ON homepage_featured
  FOR SELECT USING (true);
DROP POLICY IF EXISTS "admins_manage_homepage_featured" ON homepage_featured;
CREATE POLICY "admins_manage_homepage_featured" ON homepage_featured
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Seed hero from the migrated homepage 'hero' section content (idempotent)
INSERT INTO homepage_hero (heading, subheading, button_text, button_url, background_image, overlay_opacity, is_enabled, display_order)
SELECT
  COALESCE(NULLIF(s.title, ''), 'Empowering Athletes.'),
  COALESCE(s.description, ''),
  COALESCE(s.content->>'cta_text', 'Get Involved'),
  COALESCE(s.content->>'cta_url', '/get-involved'),
  COALESCE(s.content->>'background_image', '/assets/hero-athletes.jpg'),
  0.5,
  true,
  0
FROM homepage_sections s
WHERE s.section_key = 'hero'
  AND NOT EXISTS (SELECT 1 FROM homepage_hero LIMIT 1);

-- ---------------------------------------------------------------------------
-- 5. Activity log: admin_user_id now stores the auth user id (NOT profiles.id).
--    The old FK referenced profiles(id) and broke inserts from the app.
-- ---------------------------------------------------------------------------
ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_admin_user_id_fkey;
ALTER TABLE activity_logs
  ADD CONSTRAINT activity_logs_admin_user_id_fkey
  FOREIGN KEY (admin_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- 6. Storage bucket "media" — public read, admin-only write
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media', 'media', true, 10485760,
  ARRAY['image/png','image/jpeg','image/gif','image/webp','image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read media" ON storage.objects;
CREATE POLICY "Public read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admins upload media" ON storage.objects;
CREATE POLICY "Admins upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins update media" ON storage.objects;
CREATE POLICY "Admins update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins delete media" ON storage.objects;
CREATE POLICY "Admins delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. Auto-provision a profile row for every new auth user.
--    The first ever user becomes super_admin; everyone else editor.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role, is_active)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    CASE WHEN NOT EXISTS (SELECT 1 FROM public.profiles) THEN 'super_admin' ELSE 'editor' END,
    true
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for users created before this trigger existed
INSERT INTO public.profiles (user_id, email, role, is_active)
SELECT u.id, u.email,
  CASE WHEN NOT EXISTS (SELECT 1 FROM public.profiles) THEN 'super_admin' ELSE 'editor' END,
  true
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- 8. Replace legacy RLS policies with is_admin()-based ones (role-aware)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "admins_manage_articles" ON articles;
CREATE POLICY "admins_manage_articles" ON articles
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_manage_events" ON events;
CREATE POLICY "admins_manage_events" ON events
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "public_read_published_events" ON events;
CREATE POLICY "public_read_published_events" ON events
  FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "admins_manage_programmes" ON programmes;
CREATE POLICY "admins_manage_programmes" ON programmes
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "public_read_active_athletes" ON athletes;
CREATE POLICY "public_read_published_athletes" ON athletes
  FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "admins_manage_athletes" ON athletes;
CREATE POLICY "admins_manage_athletes" ON athletes
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "public_read_active_teams" ON teams;
CREATE POLICY "public_read_published_teams" ON teams
  FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "admins_manage_teams" ON teams;
CREATE POLICY "admins_manage_teams" ON teams
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "public_read_active_testimonials" ON testimonials;
CREATE POLICY "public_read_published_testimonials" ON testimonials
  FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "admins_manage_testimonials" ON testimonials;
CREATE POLICY "admins_manage_testimonials" ON testimonials
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "public_read_active_gallery" ON gallery;
CREATE POLICY "public_read_published_gallery" ON gallery
  FOR SELECT USING (status = 'published');
DROP POLICY IF EXISTS "admins_manage_gallery" ON gallery;
CREATE POLICY "admins_manage_gallery" ON gallery
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Editors cannot manage admin profiles or activity logs
DROP POLICY IF EXISTS "admins_manage_profiles" ON profiles;
CREATE POLICY "admins_manage_profiles" ON profiles
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "admins_manage_activity_logs" ON activity_logs;
CREATE POLICY "admins_insert_activity_logs" ON activity_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admins_read_activity_logs" ON activity_logs;
CREATE POLICY "admins_read_activity_logs" ON activity_logs
  FOR SELECT USING (public.is_admin());

-- Site settings: admin updates, everyone reads
DROP POLICY IF EXISTS "admins_manage_site_settings" ON site_settings;
CREATE POLICY "admins_manage_site_settings" ON site_settings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------------------
-- 9. Homepage sections RLS: public sees visible, admins see everything
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "public_read_homepage_sections" ON homepage_sections;
CREATE POLICY "public_read_homepage_sections" ON homepage_sections
  FOR SELECT USING (is_visible = true);
CREATE POLICY "admins_read_all_homepage_sections" ON homepage_sections
  FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "admins_manage_homepage_sections" ON homepage_sections;
CREATE POLICY "admins_manage_homepage_sections" ON homepage_sections
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
