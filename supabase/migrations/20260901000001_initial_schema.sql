-- ============================================================================
-- United Sports CMS - Database Schema Migration
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. Add admin role columns to existing profiles table
-- ============================================================================

-- Add user_id column to link with auth.users (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='user_id') THEN
    ALTER TABLE profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add is_active column (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='is_active') THEN
    ALTER TABLE profiles ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- ============================================================================
-- 2. CMS Tables
-- ============================================================================

-- ----------------------------------------
-- site_settings: Global website configuration
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'United Sports',
  logo_url TEXT,
  favicon_url TEXT,
  description TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  whatsapp TEXT,
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#0B1D3A',
  secondary_color TEXT DEFAULT '#C9A227',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- pages: Static pages content
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- articles_categories
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS articles_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- articles_tags
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS articles_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- articles
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES articles_categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles_tags_rel (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES articles_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- ----------------------------------------
-- events
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL DEFAULT '00:00',
  end_time TIME NOT NULL DEFAULT '23:59',
  location TEXT,
  featured_image TEXT,
  registration_url TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- programmes
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS programmes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  content TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- athletes
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  photo TEXT,
  sport TEXT,
  category TEXT,
  biography TEXT,
  achievements TEXT,
  nationality TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'retired')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- teams
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sport TEXT,
  description TEXT,
  logo TEXT,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- testimonials
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  role TEXT,
  photo TEXT,
  quote TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- gallery
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  slug TEXT UNIQUE,
  image_url TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- enquiries
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- activity_logs
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID,
  admin_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- homepage_sections: Configurable homepage section content
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- navigation_items: Header navigation management
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
  is_external BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- footer_sections: Footer column management
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS footer_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS footer_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES footer_sections(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  is_external BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_site_settings_updated_at ON site_settings(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_programmes_slug ON programmes(slug);
CREATE INDEX IF NOT EXISTS idx_programmes_status ON programmes(status);
CREATE INDEX IF NOT EXISTS idx_programmes_display_order ON programmes(display_order);
CREATE INDEX IF NOT EXISTS idx_athletes_slug ON athletes(slug);
CREATE INDEX IF NOT EXISTS idx_athletes_status ON athletes(status);
CREATE INDEX IF NOT EXISTS idx_athletes_display_order ON athletes(display_order);
CREATE INDEX IF NOT EXISTS idx_teams_slug ON teams(slug);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_display_order ON teams(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_slug ON testimonials(slug);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_status ON gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_navigation_items_order ON navigation_items(display_order);
CREATE INDEX IF NOT EXISTS idx_footer_sections_order ON footer_sections(display_order);
CREATE INDEX IF NOT EXISTS idx_footer_links_section ON footer_links(section_id);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON homepage_sections(display_order);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles_tags_rel ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;

-- Helper function to check if a user is an admin/editor
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'admin', 'editor')
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ----------------------------------------
-- site_settings: Public read, admin write
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- pages
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read published pages" ON pages;
CREATE POLICY "Public can read published pages" ON pages FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage pages" ON pages;
CREATE POLICY "Admins can manage pages" ON pages FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- articles_categories
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read categories" ON articles_categories;
CREATE POLICY "Public can read categories" ON articles_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON articles_categories;
CREATE POLICY "Admins can manage categories" ON articles_categories FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- articles_tags
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read tags" ON articles_tags;
CREATE POLICY "Public can read tags" ON articles_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage tags" ON articles_tags;
CREATE POLICY "Admins can manage tags" ON articles_tags FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- articles
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read published articles" ON articles;
CREATE POLICY "Public can read published articles" ON articles FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage articles" ON articles;
CREATE POLICY "Admins can manage articles" ON articles FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- articles_tags_rel
-- ----------------------------------------
DROP POLICY IF EXISTS "Admins can manage article tags" ON articles_tags_rel;
CREATE POLICY "Admins can manage article tags" ON articles_tags_rel FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- events
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read events" ON events;
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- programmes
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read published programmes" ON programmes;
CREATE POLICY "Public can read published programmes" ON programmes FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Admins can manage programmes" ON programmes;
CREATE POLICY "Admins can manage programmes" ON programmes FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- athletes
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read active athletes" ON athletes;
CREATE POLICY "Public can read active athletes" ON athletes FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage athletes" ON athletes;
CREATE POLICY "Admins can manage athletes" ON athletes FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- teams
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read active teams" ON teams;
CREATE POLICY "Public can read active teams" ON teams FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage teams" ON teams;
CREATE POLICY "Admins can manage teams" ON teams FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- testimonials
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read active testimonials" ON testimonials;
CREATE POLICY "Public can read active testimonials" ON testimonials FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- gallery
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read active gallery" ON gallery;
CREATE POLICY "Public can read active gallery" ON gallery FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;
CREATE POLICY "Admins can manage gallery" ON gallery FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- enquiries
-- ----------------------------------------
DROP POLICY IF EXISTS "Admins can manage enquiries" ON enquiries;
CREATE POLICY "Admins can manage enquiries" ON enquiries FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public can submit enquiries" ON enquiries;
CREATE POLICY "Public can submit enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- ----------------------------------------
-- activity_logs: Admins only
-- ----------------------------------------
DROP POLICY IF EXISTS "Admins can manage activity logs" ON activity_logs;
CREATE POLICY "Admins can manage activity logs" ON activity_logs FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- homepage_sections
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read homepage sections" ON homepage_sections;
CREATE POLICY "Public can read homepage sections" ON homepage_sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage homepage sections" ON homepage_sections;
CREATE POLICY "Admins can manage homepage sections" ON homepage_sections FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- navigation_items
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read navigation items" ON navigation_items;
CREATE POLICY "Public can read navigation items" ON navigation_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage navigation items" ON navigation_items;
CREATE POLICY "Admins can manage navigation items" ON navigation_items FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- footer_sections
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read footer sections" ON footer_sections;
CREATE POLICY "Public can read footer sections" ON footer_sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage footer sections" ON footer_sections;
CREATE POLICY "Admins can manage footer sections" ON footer_sections FOR ALL USING (public.is_admin());

-- ----------------------------------------
-- footer_links
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read footer links" ON footer_links;
CREATE POLICY "Public can read footer links" ON footer_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage footer links" ON footer_links;
CREATE POLICY "Admins can manage footer links" ON footer_links FOR ALL USING (public.is_admin());

-- ============================================================================
-- Triggers: Update updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_site_settings_updated_at ON site_settings;
CREATE TRIGGER handle_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_pages_updated_at ON pages;
CREATE TRIGGER handle_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_articles_categories_updated_at ON articles_categories;
CREATE TRIGGER handle_articles_categories_updated_at BEFORE UPDATE ON articles_categories FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_articles_tags_updated_at ON articles_tags;
CREATE TRIGGER handle_articles_tags_updated_at BEFORE UPDATE ON articles_tags FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_articles_updated_at ON articles;
CREATE TRIGGER handle_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_events_updated_at ON events;
CREATE TRIGGER handle_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_programmes_updated_at ON programmes;
CREATE TRIGGER handle_programmes_updated_at BEFORE UPDATE ON programmes FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_athletes_updated_at ON athletes;
CREATE TRIGGER handle_athletes_updated_at BEFORE UPDATE ON athletes FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_teams_updated_at ON teams;
CREATE TRIGGER handle_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_testimonials_updated_at ON testimonials;
CREATE TRIGGER handle_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_gallery_updated_at ON gallery;
CREATE TRIGGER handle_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_enquiries_updated_at ON enquiries;
CREATE TRIGGER handle_enquiries_updated_at BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_navigation_items_updated_at ON navigation_items;
CREATE TRIGGER handle_navigation_items_updated_at BEFORE UPDATE ON navigation_items FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_footer_sections_updated_at ON footer_sections;
CREATE TRIGGER handle_footer_sections_updated_at BEFORE UPDATE ON footer_sections FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_footer_links_updated_at ON footer_links;
CREATE TRIGGER handle_footer_links_updated_at BEFORE UPDATE ON footer_links FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_homepage_sections_updated_at ON homepage_sections;
CREATE TRIGGER handle_homepage_sections_updated_at BEFORE UPDATE ON homepage_sections FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================================
-- Initial data: Site settings
-- ============================================================================

INSERT INTO site_settings (id, site_name, description, email, phone, address, whatsapp, primary_color, secondary_color)
VALUES (
  uuid_generate_v4(),
  'United Sports',
  'United Sports - Your premier sports community for athletes, programmes, events and teams.',
  'info@unitedsports.com',
  '+1 (555) 123-4567',
  '123 Sports Avenue, City, State',
  '+1 (555) 123-4567',
  '#0B1D3A',
  '#C9A227'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- Seed: Default homepage sections
-- ============================================================================

INSERT INTO homepage_sections (section_key, title, subtitle, description, is_visible, display_order) VALUES
  ('hero', 'Hero Slideshow', 'Main hero section at the top of the homepage', 'Manage the hero slides shown on the homepage', true, 1),
  ('programmes', 'Programmes', 'Our Sports Programmes', 'Featured training programmes', true, 2),
  ('athletes', 'Featured Athletes', 'Our Top Athletes', 'Showcase featured athletes', true, 3),
  ('events', 'Upcoming Events', 'Don''t Miss Our Events', 'Upcoming and recent events', true, 4),
  ('news', 'Latest News', 'News & Updates', 'Recent articles and blog posts', true, 5),
  ('testimonials', 'Testimonials', 'What Our Community Says', 'User testimonials', true, 6),
  ('cta', 'Call to Action', 'Join Us', 'Get involved section', true, 7)
ON CONFLICT (section_key) DO NOTHING;

-- ============================================================================
-- Seed: Default navigation items
-- ============================================================================

INSERT INTO navigation_items (label, href, is_external, is_active, display_order) VALUES
  ('Home', '/', false, true, 1),
  ('Programmes', '/programmes', false, true, 2),
  ('Events', '/events', false, true, 3),
  ('Athletes', '/athletes', false, true, 4),
  ('Teams', '/teams', false, true, 5),
  ('News', '/news', false, true, 6),
  ('Gallery', '/gallery', false, true, 7),
  ('Contact', '/contact', false, true, 8)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Seed: Default footer sections
-- ============================================================================

INSERT INTO footer_sections (title, display_order, is_active) VALUES
  ('Quick Links', 1, true),
  ('Resources', 2, true),
  ('Connect', 3, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- End of migration
-- ============================================================================