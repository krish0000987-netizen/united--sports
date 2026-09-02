-- ============================================================================
-- UnitedAthletes CMS - Content migration from the existing static website
-- Migrates branding, navigation, homepage sections, footer, and programmes
-- ============================================================================

-- ----------------------------------------
-- 1. Site settings → existing website values
-- ----------------------------------------
UPDATE site_settings
SET
  site_name = 'UnitedAthletes for India Foundation',
  description = 'UnitedAthletes for India Foundation bridges talent and opportunity with sports facilities, equipment, guidance and support for athletes across India.',
  email = 'contact@unitedathletes.org',
  phone = '+91 85278 77688',
  address = '384A, Nyay Khand 3, Indirapuram, Ghaziabad, Uttar Pradesh – 201014',
  whatsapp = '918527877688',
  logo_url = '/assets/logo-circle.png',
  primary_color = '#0B1D3A',
  secondary_color = '#C9A227',
  updated_at = now();

-- ----------------------------------------
-- 2. Navigation → match the existing website header
-- ----------------------------------------
DELETE FROM navigation_items;

INSERT INTO navigation_items (label, href, is_external, is_active, display_order) VALUES
  ('Home', '/', false, true, 1),
  ('About', '/about', false, true, 2),
  ('Programmes', '/programmes', false, true, 3),
  ('Get Involved', '/get-involved', false, true, 4),
  ('News', '/news', false, true, 5),
  ('Events', '/events', false, true, 6),
  ('Athletes', '/athletes', false, true, 7),
  ('Gallery', '/gallery', false, true, 8),
  ('Contact', '/contact', false, true, 9);

-- ----------------------------------------
-- 3. Homepage sections → sections of the existing homepage
--    title = heading line 1, description = gold heading line 2,
--    subtitle = eyebrow label, content = JSON extras
-- ----------------------------------------
DELETE FROM homepage_sections;

INSERT INTO homepage_sections (section_key, title, subtitle, description, content, is_visible, display_order) VALUES
  (
    'hero',
    'Empowering Athletes.',
    'UnitedAthletes for India Foundation',
    'Enabling Dreams.',
    '{"background_image": "/assets/hero-athletes.jpg", "subtitle": "We bridge the gap between talent and opportunity — providing the facilities, equipment, guidance and support systems athletes across India need to reach their full potential.", "cta_text": "Get Involved", "cta_url": "/get-involved", "stats": [{"k": "14+", "v": "Sporting disciplines"}, {"k": "6", "v": "Core programmes"}, {"k": "1", "v": "Athlete-first promise"}]}'::jsonb,
    true, 1
  ),
  (
    'mission',
    'To empower athletes by providing the right',
    'Our Mission',
    NULL,
    '{}'::jsonb,
    true, 2
  ),
  (
    'about',
    'A platform built around the athlete',
    'About UnitedAthletes',
    'UnitedAthletes is dedicated to supporting athletes across India by creating opportunities for them to pursue their sporting ambitions. We work to bridge the gap between talent and opportunity by providing access to sports facilities, equipment, resources and a supportive ecosystem that enables athletes to grow.',
    '{}'::jsonb,
    true, 3
  ),
  (
    'what_we_do',
    'Everything an athlete needs to keep going',
    'What We Do',
    NULL,
    '{}'::jsonb,
    true, 4
  ),
  (
    'events',
    'Upcoming events',
    'Events',
    'Mark your calendar — meets, trials, and community gatherings.',
    '{}'::jsonb,
    true, 5
  ),
  (
    'sports',
    NULL,
    'Sports',
    'UnitedAthletes supports athletes across multiple sporting disciplines and aims to create opportunities for athletes from diverse sporting backgrounds.',
    '{}'::jsonb,
    true, 6
  ),
  (
    'news',
    'Latest news & updates',
    'News',
    'The latest news, updates, and insights from the UnitedAthletes community.',
    '{}'::jsonb,
    true, 7
  ),
  (
    'cta',
    'Your talent deserves',
    'Call to Action',
    'an opportunity.',
    '{"background_image": "/assets/facility.jpg"}'::jsonb,
    true, 8
  );

-- ----------------------------------------
-- 4. Footer sections & links → match the existing website footer
-- ----------------------------------------
DELETE FROM footer_links;
DELETE FROM footer_sections;

INSERT INTO footer_sections (title, display_order, is_active) VALUES
  ('Explore', 1, true),
  ('Get Involved', 2, true);

INSERT INTO footer_links (section_id, label, href, is_external, display_order)
SELECT s.id, l.label, l.href, false, l.ord
FROM footer_sections s
JOIN (VALUES
  ('Explore', 'Home', '/', 1),
  ('Explore', 'About Us', '/about', 2),
  ('Explore', 'Programmes', '/programmes', 3),
  ('Explore', 'News', '/news', 4),
  ('Explore', 'Contact', '/contact', 5),
  ('Get Involved', 'Ways to Support', '/get-involved', 1),
  ('Get Involved', 'Events', '/events', 2),
  ('Get Involved', 'Athletes', '/athletes', 3),
  ('Get Involved', 'Gallery', '/gallery', 4)
) AS l(section, label, href, ord) ON l.section = s.title;

-- ----------------------------------------
-- 5. Programmes → the six programmes from the existing website
-- ----------------------------------------
INSERT INTO programmes (title, slug, description, image, content, status, display_order) VALUES
  ('Athlete Development Programme', 'athlete-development-programme',
   'Supporting athletes with resources, guidance and opportunities designed to help them progress in their sporting journey.',
   '/assets/para-athlete.jpg',
   '<p>Supporting athletes with resources, guidance and opportunities designed to help them progress in their sporting journey.</p>',
   'published', 1),
  ('Sports Facility Access', 'sports-facility-access',
   'Helping athletes gain access to suitable sports facilities and training environments.',
   '/assets/facility.jpg',
   '<p>Helping athletes gain access to suitable sports facilities and training environments.</p>',
   'published', 2),
  ('Sports Equipment Support', 'sports-equipment-support',
   'Providing access to essential sports equipment and resources that athletes require for training and development.',
   '/assets/equipment.jpg',
   '<p>Providing access to essential sports equipment and resources that athletes require for training and development.</p>',
   'published', 3),
  ('Emerging Athlete Support', 'emerging-athlete-support',
   'Identifying and supporting promising athletes who need greater access to opportunities and resources.',
   '/assets/hero-athletes.jpg',
   '<p>Identifying and supporting promising athletes who need greater access to opportunities and resources.</p>',
   'published', 4),
  ('Community Sports Initiatives', 'community-sports-initiatives',
   'Building stronger sporting communities by connecting athletes, coaches, organisations, supporters and sports enthusiasts.',
   '/assets/community.jpg',
   '<p>Building stronger sporting communities by connecting athletes, coaches, organisations, supporters and sports enthusiasts.</p>',
   'published', 5),
  ('Athlete Opportunity Platform', 'athlete-opportunity-platform',
   'Creating a platform where athletes can discover opportunities, connect with the sporting ecosystem and work toward their goals.',
   '/assets/support.jpg',
   '<p>Creating a platform where athletes can discover opportunities, connect with the sporting ecosystem and work toward their goals.</p>',
   'published', 6)
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------
-- 6. CMS pages → about + get-involved (published, manageable in admin)
-- ----------------------------------------
INSERT INTO pages (title, slug, excerpt, content, featured_image, status, meta_title, meta_description) VALUES
  (
    'About UnitedAthletes',
    'about',
    'An athlete-focused organisation committed to creating a stronger ecosystem for athletes across India.',
    '<h2>Talent can come from anywhere</h2><p>UnitedAthletes for India Foundation is an athlete-focused organisation committed to creating a stronger ecosystem for athletes across India. We believe that talent can come from anywhere, but access to opportunities, facilities, equipment and support can determine how far that talent goes.</p><p>Our goal is to help athletes focus on what matters most — training, competing, improving and achieving their dreams.</p>',
    '/assets/support.jpg',
    'published',
    'About Us | UnitedAthletes for India Foundation',
    'UnitedAthletes for India Foundation is an athlete-focused organisation building a stronger sporting ecosystem across India.'
  ),
  (
    'Get Involved',
    'get-involved',
    'Sport has the power to transform lives. Join the UnitedAthletes movement.',
    '<h2>Choose how you want to make a difference</h2><p>Support athlete development, provide sports equipment, back facilities, partner with us, or support an athlete directly. Every contribution becomes training time, gear, and a chance to compete.</p>',
    '/assets/community.jpg',
    'published',
    'Get Involved | UnitedAthletes for India Foundation',
    'Support athlete development, provide sports equipment, back facilities, partner with us, or support an athlete directly.'
  )
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------
-- 7. Activity log the migration
-- ----------------------------------------
INSERT INTO activity_logs (admin_user_id, admin_email, action, entity_type, description)
VALUES (NULL, 'system@migration', 'migrate', 'cms', 'Migrated existing website content into CMS (settings, navigation, homepage, footer, programmes, pages)');
