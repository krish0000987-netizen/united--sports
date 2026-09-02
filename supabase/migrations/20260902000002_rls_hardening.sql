-- ============================================================================
-- UnitedAthletes CMS - Security hardening
-- 1. Lock down profiles table (previously world-readable from legacy project)
-- 2. Admin-only article tag relations
-- ============================================================================

-- ----------------------------------------
-- profiles: only the owner or admins can read; only super_admin can manage
-- ----------------------------------------
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (public.is_super_admin());

CREATE POLICY "Super admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can delete profiles" ON profiles
  FOR DELETE USING (public.is_super_admin());

-- ----------------------------------------
-- articles_tags_rel: admin-only (no public read needed)
-- ----------------------------------------
DROP POLICY IF EXISTS "Public can read article tag relations" ON articles_tags_rel;
