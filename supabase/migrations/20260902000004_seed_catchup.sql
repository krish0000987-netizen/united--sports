-- ============================================================================
-- UnitedAthletes CMS — Seed catch-up + missing tables.
-- The original seed migration was recorded as applied on this remote but its
-- rows are missing (it referenced a `categories` table that did not exist).
-- This migration creates anything missing and seeds all CMS content.
-- Idempotent: safe to run repeatedly.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Missing tables
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL UNIQUE DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, athlete_id)
);

CREATE INDEX IF NOT EXISTS idx_team_athletes_team ON team_athletes(team_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "admins_manage_categories" ON categories;
CREATE POLICY "admins_manage_categories" ON categories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE team_athletes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_team_athletes" ON team_athletes;
CREATE POLICY "public_read_team_athletes" ON team_athletes FOR SELECT USING (true);
DROP POLICY IF EXISTS "admins_manage_team_athletes" ON team_athletes;
CREATE POLICY "admins_manage_team_athletes" ON team_athletes
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- updated_at triggers
DROP TRIGGER IF EXISTS categories_updated_at ON categories;
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- 2. Seed content (idempotent)
-- ---------------------------------------------------------------------------

-- Categories
INSERT INTO categories (name, slug, description) VALUES
  ('News', 'news', 'Latest news and announcements from UnitedAthletes'),
  ('Events', 'events', 'Event coverage and recaps'),
  ('Training', 'training', 'Training tips and programme updates'),
  ('Athlete Stories', 'athlete-stories', 'Inspiring stories from our athletes'),
  ('Community', 'community', 'Community programmes and initiatives')
ON CONFLICT (slug) DO NOTHING;

-- The remote articles table carries an FK to articles_categories (legacy table).
-- Repoint it to our categories table so category_id writes validate correctly.
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_category_id_fkey;
ALTER TABLE articles ADD CONSTRAINT articles_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL NOT VALID;

-- Ensure gallery has alt_text (older remote shape lacks it)
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS alt_text TEXT;

-- Navigation (only if empty)
INSERT INTO navigation_items (label, href, is_external, is_active, display_order)
SELECT * FROM (VALUES
  ('Home', '/', false, true, 1),
  ('About', '/about', false, true, 2),
  ('Programmes', '/programmes', false, true, 3),
  ('Get Involved', '/get-involved', false, true, 4),
  ('News', '/news', false, true, 5),
  ('Events', '/events', false, true, 6),
  ('Athletes', '/athletes', false, true, 7),
  ('Gallery', '/gallery', false, true, 8),
  ('Contact', '/contact', false, true, 9)
) AS v(label, href, is_external, is_active, display_order)
WHERE NOT EXISTS (SELECT 1 FROM navigation_items);

-- Footer sections + links (only if empty)
INSERT INTO footer_sections (title, display_order, is_active)
SELECT * FROM (VALUES ('Explore', 1, true), ('Get Involved', 2, true)) AS v(title, display_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM footer_sections);

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
) AS l(section, label, href, ord) ON l.section = s.title
WHERE NOT EXISTS (SELECT 1 FROM footer_links);

-- Programmes (existing website content)
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

-- Athletes
INSERT INTO athletes (name, slug, sport, category, nationality, biography, achievements, status, display_order) VALUES
  ('Aarav Sharma', 'aarav-sharma', 'Football', 'Senior', 'India',
   'A creative midfielder known for exceptional vision and passing accuracy. Aarav has captained state-level teams and is pursuing professional football.',
   'State Champion 2024, All-India Inter-University Best Midfielder 2023', 'published', 0),
  ('Priya Patel', 'priya-patel', 'Cricket', 'Senior', 'India',
   'A right-arm pace bowler with a deadly yorker. Priya represents the national women''s cricket team and is a role model for aspiring cricketers.',
   'National Team Member, Best Bowler Award 2024', 'published', 1),
  ('Rohan Singh', 'rohan-singh', 'Basketball', 'Junior', 'India',
   'An explosive point guard with elite court vision. Rohan has been drafted for the national youth basketball camp.',
   'Junior National Selection 2025, MVP State Championship 2024', 'published', 2),
  ('Ananya Iyer', 'ananya-iyer', 'Athletics', 'Senior', 'India',
   'A 400m specialist with a sub-52 second personal best. Ananya is targeting a spot at the upcoming Asian Games.',
   'National 400m Champion 2024, Asian Games Qualifier', 'published', 3),
  ('Kabir Khan', 'kabir-khan', 'Football', 'Junior', 'India',
   'A technically gifted striker with a sharp eye for goal. Kabir led his school team to three consecutive titles.',
   'Inter-School Top Scorer 2024, U-17 State Selection', 'published', 4),
  ('Meera Reddy', 'meera-reddy', 'Swimming', 'Senior', 'India',
   'A freestyle and butterfly specialist holding multiple national records in her age group.',
   'National Record Holder 100m Butterfly, Junior Asian Medalist', 'published', 5),
  ('Vikram Joshi', 'vikram-joshi', 'Tennis', 'Senior', 'India',
   'A versatile all-court player with strong baseline game and tactical intelligence.',
   'National Ranking #4 Singles, ITF Junior Title 2023', 'published', 6),
  ('Saanvi Mehta', 'saanvi-mehta', 'Athletics', 'Junior', 'India',
   'A promising long-distance runner who has rapidly progressed through state rankings.',
   'U-18 National Cross Country Champion 2024', 'published', 7)
ON CONFLICT (slug) DO NOTHING;

-- Teams
INSERT INTO teams (name, slug, sport, description, status, display_order) VALUES
  ('United Football Club', 'united-football-club', 'Football',
   'Our flagship football team competing in regional and national leagues. Known for attacking football and developing young talent.', 'published', 0),
  ('United Cricket XI', 'united-cricket-xi', 'Cricket',
   'Competing across T20, ODI, and multi-day formats at state and national level tournaments.', 'published', 1),
  ('United Basketball', 'united-basketball', 'Basketball',
   'A fast-paced basketball programme fielding teams in senior and junior divisions.', 'published', 2),
  ('United Athletics', 'united-athletics', 'Athletics',
   'Fielding athletes across sprints, middle distance, jumps, and throws at major meets.', 'published', 3),
  ('United Swim Team', 'united-swim-team', 'Swimming',
   'Competitive swimmers representing UnitedAthletes at state and national championships.', 'published', 4),
  ('United Tennis Academy', 'united-tennis-academy', 'Tennis',
   'A development-focused tennis team preparing juniors for national and international circuits.', 'published', 5)
ON CONFLICT (slug) DO NOTHING;

-- Rosters
INSERT INTO team_athletes (team_id, athlete_id, display_order)
SELECT t.id, a.id, x.ord
FROM (VALUES
  ('united-football-club', 'aarav-sharma', 0),
  ('united-football-club', 'kabir-khan', 1),
  ('united-cricket-xi', 'priya-patel', 0),
  ('united-basketball', 'rohan-singh', 0),
  ('united-athletics', 'ananya-iyer', 0),
  ('united-athletics', 'saanvi-mehta', 1),
  ('united-swim-team', 'meera-reddy', 0),
  ('united-tennis-academy', 'vikram-joshi', 0)
) AS x(team_slug, athlete_slug, ord)
JOIN teams t ON t.slug = x.team_slug
JOIN athletes a ON a.slug = x.athlete_slug
ON CONFLICT DO NOTHING;

-- Testimonials
INSERT INTO testimonials (name, slug, role, quote, status, display_order) VALUES
  ('Rajesh Kumar', 'rajesh-kumar', 'Parent',
   'UnitedAthletes has transformed my son. The coaches care deeply about each athlete''s development, both on and off the field. We''ve seen incredible growth in confidence and skill.',
   'published', 0),
  ('Sneha Desai', 'sneha-desai', 'Former Athlete',
   'Training with UnitedAthletes gave me the discipline and skills to compete at the national level. The coaches believed in me when I needed it most.',
   'published', 1),
  ('Coach Vikram Nair', 'coach-vikram-nair', 'Head Coach — Football',
   'The culture here is special. Athletes push each other to be better every day. It is a privilege to be part of their journey.',
   'published', 2),
  ('Lakshmi Rao', 'lakshmi-rao', 'Parent',
   'From the moment we joined, our daughter felt welcomed. The community is supportive, inclusive, and committed to excellence.',
   'published', 3),
  ('Arjun Menon', 'arjun-menon', 'Athlete',
   'The training intensity and attention to detail is unmatched. I have grown as an athlete and as a person here.',
   'published', 4)
ON CONFLICT (slug) DO NOTHING;

-- Events
INSERT INTO events (title, slug, description, event_date, start_time, end_time, location, status) VALUES
  ('United Sports Summer Camp 2026', 'united-sports-summer-camp-2026',
   'A two-week intensive summer camp covering football, cricket, basketball, and athletics. Open to athletes aged 8-18.',
   '2026-12-15', '09:00', '16:00', 'United Sports Complex, Mumbai', 'published'),
  ('Inter-Academy Football Tournament', 'inter-academy-football-tournament',
   'Annual invitational football tournament featuring top academy teams from across the region.',
   '2027-01-22', '10:00', '18:00', 'Central Stadium, Mumbai', 'published'),
  ('Junior Athletics Meet', 'junior-athletics-meet',
   'A development-focused athletics meet for athletes aged 12-17. Events include sprints, middle distance, jumps, and relays.',
   '2027-02-10', '08:00', '14:00', 'United Sports Complex', 'published'),
  ('United Sports Annual Gala', 'united-sports-annual-gala',
   'Celebrating our athletes, coaches, and community with awards, performances, and a charity auction.',
   '2027-03-05', '18:00', '23:00', 'Grand Ballroom, Mumbai', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Articles (News)
INSERT INTO articles (title, slug, excerpt, content, status, published_at, category_id) VALUES
  ('UnitedAthletes Launches New Junior Development Programme',
   'unitedathletes-launches-new-junior-development-programme',
   'A structured pathway for athletes aged 6-12 to develop fundamental movement skills across multiple sports.',
   '<p>UnitedAthletes is proud to announce the launch of our new Junior Development Programme, designed to give young athletes the strongest possible foundation. The programme focuses on fundamental movement skills, coordination, and sport-specific basics in a fun and supportive environment.</p><p>The Junior Development Programme runs year-round with weekly sessions led by certified coaches. Athletes will be introduced to football, cricket, basketball, and athletics, with opportunities to specialise as they progress.</p><p>Registration is now open for athletes aged 6-12. Limited spots available.</p>',
   'published', NOW() - INTERVAL '1 day',
   (SELECT id FROM categories WHERE slug = 'news' LIMIT 1)),
  ('Priya Patel Selected for National Cricket Squad',
   'priya-patel-selected-for-national-cricket-squad',
   'UnitedAthletes athlete Priya Patel has been selected to represent India in the upcoming international cricket series.',
   '<p>We are thrilled to share that Priya Patel, our very own pace bowling sensation, has been selected for the national women''s cricket squad for the upcoming international series. Priya has been a key member of our cricket programme for the past three years and her dedication and skill have earned her this incredible opportunity.</p><p>Priya will join the national camp next month before the series begins. The entire UnitedAthletes family wishes her the very best.</p>',
   'published', NOW() - INTERVAL '3 day',
   (SELECT id FROM categories WHERE slug = 'athlete-stories' LIMIT 1)),
  ('Community Outreach: Free Coaching Clinics in Local Schools',
   'community-outreach-free-coaching-clinics-in-local-schools',
   'UnitedAthletes coaches are delivering free weekly coaching clinics to students in underserved communities.',
   '<p>As part of our commitment to making sport accessible, UnitedAthletes coaches are now running free weekly coaching clinics in five local schools. The programme focuses on basic skills, teamwork, and the joy of physical activity.</p><p>Over 200 students are already enrolled, and the response from schools, parents, and students has been overwhelmingly positive. We are proud to play a role in building healthier, more active communities.</p>',
   'published', NOW() - INTERVAL '5 day',
   (SELECT id FROM categories WHERE slug = 'community' LIMIT 1)),
  ('5 Tips to Improve Your Sprint Technique',
   '5-tips-to-improve-your-sprint-technique',
   'Practical tips from our athletics coaches to help you run faster and reduce injury risk.',
   '<p>Whether you are training for the 100m or just want to feel quicker on the field, sprint technique matters. Here are five practical tips from our athletics coaches:</p><ul><li>Drive your arms powerfully — arms and legs work together.</li><li>Lean slightly forward from the ankles, not the waist.</li><li>Strike the ground with your front foot under your hips, not out in front.</li><li>Keep your head still and your gaze fixed forward.</li><li>Practice starts — the first 10 metres make or break a sprint.</li></ul><p>Consistent technique work beats raw talent over time. Train smart.</p>',
   'published', NOW() - INTERVAL '7 day',
   (SELECT id FROM categories WHERE slug = 'training' LIMIT 1)),
  ('UnitedAthletes Hosts Annual Coaches Workshop',
   'unitedathletes-hosts-annual-coaches-workshop',
   'Our annual coaches workshop brought together 40 coaches from across the region for two days of learning and collaboration.',
   '<p>Last weekend, UnitedAthletes hosted its annual Coaches Workshop, bringing together 40 coaches from partner academies and clubs for two days of intensive learning.</p><p>Topics included athlete development frameworks, injury prevention, sport psychology, and modern training methodologies. The workshop was led by UnitedAthletes head coaches alongside guest speakers from national-level programmes.</p><p>We are committed to investing in our coaching community — better coaches mean better experiences for every athlete.</p>',
   'published', NOW() - INTERVAL '9 day',
   (SELECT id FROM categories WHERE slug = 'events' LIMIT 1))
ON CONFLICT (slug) DO NOTHING;

-- Gallery (using existing site assets so nothing looks broken)
INSERT INTO gallery (title, slug, image_url, alt_text, category, status, display_order) VALUES
  ('Training under the lights', 'training-under-the-lights', '/assets/hero-athletes.jpg', 'Athletes training under golden stadium lights', 'Training', 'published', 0),
  ('Coach and athlete', 'coach-and-athlete', '/assets/support.jpg', 'A coach and a young athlete clasping hands at sunset', 'Community', 'published', 1),
  ('Ready to compete', 'ready-to-compete', '/assets/equipment.jpg', 'Premium sports equipment on a dark surface', 'Equipment', 'published', 2),
  ('Facility night session', 'facility-night-session', '/assets/facility.jpg', 'Modern indoor sports arena lit at night', 'Facilities', 'published', 3),
  ('Community huddle', 'community-huddle', '/assets/community.jpg', 'Athletes standing together in a huddle', 'Community', 'published', 4),
  ('Para-athlete in action', 'para-athlete-in-action', '/assets/para-athlete.jpg', 'Para-athlete sprinting on the track', 'Training', 'published', 5),
  ('About our athletes', 'about-our-athletes', '/assets/about-athlete.jpg', 'Indian badminton player mid-smash under a spotlight', 'Training', 'published', 6)
ON CONFLICT (slug) DO NOTHING;

-- Activity log entry
INSERT INTO activity_logs (admin_user_id, admin_email, action, entity_type, entity_id, description)
VALUES (NULL, 'system@seed', 'seed', 'cms', NULL, 'Seeded CMS content (categories, navigation, footer, programmes, athletes, teams, testimonials, events, articles, gallery)');
