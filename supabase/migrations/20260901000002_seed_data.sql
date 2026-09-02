-- ============================================
-- SEED DATA
-- ============================================

-- Site Settings
INSERT INTO site_settings (
  site_name, description, email, phone, address, whatsapp,
  facebook_url, instagram_url, youtube_url, twitter_url, linkedin_url,
  footer_text, primary_color, secondary_color
) VALUES (
  'United Sports',
  'Empowering athletes through world-class training, community, and competition. United Sports brings together programs, athletes, teams, and events that build champions.',
  'info@unitedsports.org',
  '+91 98765 43210',
  'United Sports Complex, Mumbai, Maharashtra, India',
  '+919876543210',
  'https://facebook.com/unitedsports',
  'https://instagram.com/unitedsports',
  'https://youtube.com/@unitedsports',
  'https://twitter.com/unitedsports',
  'https://linkedin.com/company/unitedsports',
  '© 2026 United Sports. Empowering athletes, building champions.',
  '#0B1D3A',
  '#FF6B00'
) ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (name, slug, description) VALUES
  ('News', 'news', 'Latest news and announcements from United Sports'),
  ('Events', 'events', 'Event coverage and recaps'),
  ('Training', 'training', 'Training tips and program updates'),
  ('Athlete Stories', 'athlete-stories', 'Inspiring stories from our athletes'),
  ('Community', 'community', 'Community programs and initiatives')
ON CONFLICT (slug) DO NOTHING;

-- Navigation Items
INSERT INTO navigation_items (label, href, type, display_order, is_active) VALUES
  ('Home', '/', 'link', 0, true),
  ('Programmes', '/programmes', 'link', 1, true),
  ('Athletes', '/athletes', 'link', 2, true),
  ('Teams', '/teams', 'link', 3, true),
  ('Events', '/events', 'link', 4, true),
  ('News', '/news', 'link', 5, true),
  ('Gallery', '/gallery', 'link', 6, true),
  ('About', '/about', 'link', 7, true),
  ('Contact', '/contact', 'link', 8, true)
ON CONFLICT DO NOTHING;

-- Homepage Sections
INSERT INTO homepage_sections (section_key, title, subtitle, description, is_visible, display_order, content) VALUES
  ('hero', 'Where Champions Are Built', 'Welcome to United Sports',
   'Empowering athletes through world-class training, community, and competition.',
   true, 0,
   '{"cta_text": "Explore Programmes", "cta_href": "/programmes", "secondary_cta_text": "Join Our Team", "secondary_cta_href": "/contact"}'::jsonb),
  ('programmes', 'Our Programmes', 'Training for Every Stage',
   'From beginner to elite, our programs are designed to develop athletes at every level.',
   true, 1, '{"limit": 6}'::jsonb),
  ('athletes', 'Our Athletes', 'Champions in the Making',
   'Meet the dedicated athletes who represent United Sports across every discipline.',
   true, 2, '{"limit": 8}'::jsonb),
  ('teams', 'Our Teams', 'United on the Field',
   'Explore the teams competing under the United Sports banner.',
   true, 3, '{"limit": 6}'::jsonb),
  ('events', 'Upcoming Events', 'Be Part of the Action',
   'Stay updated with the latest competitions, camps, and community events.',
   true, 4, '{"limit": 3}'::jsonb),
  ('testimonials', 'What Our Community Says', 'Stories of Growth',
   'Hear from athletes, parents, and coaches who are part of the United Sports family.',
   true, 5, '{"limit": 6}'::jsonb),
  ('cta', 'Ready to Begin Your Journey?', 'Join United Sports Today',
   'Become part of a community committed to excellence, character, and athletic achievement.',
   true, 6, '{"button_text": "Get Started", "button_href": "/contact"}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;

-- Footer Sections
INSERT INTO footer_sections (title, display_order, is_active) VALUES
  ('Quick Links', 0, true),
  ('Programmes', 1, true),
  ('Connect', 2, true)
ON CONFLICT DO NOTHING;

INSERT INTO footer_links (section_id, label, href, display_order, is_external)
SELECT s.id, l.label, l.href, l.display_order, l.is_external
FROM footer_sections s
CROSS JOIN (VALUES
  -- Quick Links
  ('Home'::text, '/'::text, 0::int, false::bool),
  ('About', '/about', 1, false),
  ('News', '/news', 2, false),
  ('Contact', '/contact', 3, false)
) AS l(label, href, display_order, is_external)
WHERE s.title = 'Quick Links'
ON CONFLICT DO NOTHING;

INSERT INTO footer_links (section_id, label, href, display_order, is_external)
SELECT s.id, l.label, l.href, l.display_order, l.is_external
FROM footer_sections s
CROSS JOIN (VALUES
  ('Football'::text, '/programmes/football'::text, 0::int, false::bool),
  ('Cricket', '/programmes/cricket', 1, false),
  ('Basketball', '/programmes/basketball', 2, false),
  ('Athletics', '/programmes/athletics', 3, false)
) AS l(label, href, display_order, is_external)
WHERE s.title = 'Programmes'
ON CONFLICT DO NOTHING;

INSERT INTO footer_links (section_id, label, href, display_order, is_external)
SELECT s.id, l.label, l.href, l.display_order, l.is_external
FROM footer_sections s
CROSS JOIN (VALUES
  ('Facebook'::text, 'https://facebook.com/unitedsports'::text, 0::int, true::bool),
  ('Instagram', 'https://instagram.com/unitedsports', 1, true),
  ('YouTube', 'https://youtube.com/@unitedsports', 2, true)
) AS l(label, href, display_order, is_external)
WHERE s.title = 'Connect'
ON CONFLICT DO NOTHING;

-- Programmes
INSERT INTO programmes (title, slug, description, content, status, display_order) VALUES
  ('Football', 'football',
   'Develop technical skills, tactical awareness, and physical conditioning through our structured football programme.',
   'Our football programme covers fundamentals for beginners through to advanced tactical play for competitive athletes. Trainers are former professional players dedicated to developing the next generation.',
   'published', 0),
  ('Cricket', 'cricket',
   'Master batting, bowling, and fielding with coaches who have played at the highest levels.',
   'From net sessions to match play, our cricket programme prepares athletes for every format of the game. We focus on technique, mental toughness, and team dynamics.',
   'published', 1),
  ('Basketball', 'basketball',
   'Build endurance, agility, and basketball IQ with our comprehensive basketball training.',
   'Our basketball programme develops shooting, ball-handling, defense, and team play. Suitable for players of all ages and skill levels.',
   'published', 2),
  ('Athletics', 'athletics',
   'Train across track and field disciplines including sprints, distance, jumps, and throws.',
   'Our athletics programme emphasizes speed, strength, and event-specific technique. Coaches include former national-level competitors.',
   'published', 3),
  ('Swimming', 'swimming',
   'Learn stroke technique, endurance, and competitive racing in our swim programme.',
   'From water confidence to competitive strokes, our certified coaches guide swimmers through every milestone.',
   'published', 4),
  ('Tennis', 'tennis',
   'Develop footwork, stroke mechanics, and match strategy with experienced tennis coaches.',
   'Our tennis programme caters to recreational players through competitive juniors, with personalized development pathways.',
   'published', 5)
ON CONFLICT (slug) DO NOTHING;

-- Athletes
INSERT INTO athletes (name, slug, sport, category, nationality, biography, achievements, status, display_order) VALUES
  ('Aarav Sharma', 'aarav-sharma', 'Football', 'Senior', 'India',
   'A creative midfielder known for exceptional vision and passing accuracy. Aarav has captained state-level teams and is pursuing professional football.',
   'State Champion 2024, All-India Inter-University Best Midfielder 2023', 'active', 0),
  ('Priya Patel', 'priya-patel', 'Cricket', 'Senior', 'India',
   'A right-arm pace bowler with a deadly Yorker. Priya represents the national women''s cricket team and is a role model for aspiring cricketers.',
   'National Team Member, Best Bowler Award 2024', 'active', 1),
  ('Rohan Singh', 'rohan-singh', 'Basketball', 'Junior', 'India',
   'An explosive point guard with elite court vision. Rohan has been drafted for the national youth basketball camp.',
   'Junior National Selection 2025, MVP State Championship 2024', 'active', 2),
  ('Ananya Iyer', 'ananya-iyer', 'Athletics', 'Senior', 'India',
   'A 400m specialist with sub-52 second personal best. Ananya is targeting a spot at the upcoming Asian Games.',
   'National 400m Champion 2024, Asian Games Qualifier', 'active', 3),
  ('Kabir Khan', 'kabir-khan', 'Football', 'Junior', 'India',
   'A technically gifted striker with a sharp eye for goal. Kabir led his school team to three consecutive titles.',
   'Inter-School Top Scorer 2024, U-17 State Selection', 'active', 4),
  ('Meera Reddy', 'meera-reddy', 'Swimming', 'Senior', 'India',
   'A freestyle and butterfly specialist holding multiple national records in her age group.',
   'National Record Holder 100m Butterfly, Junior Asian Medalist', 'active', 5),
  ('Vikram Joshi', 'vikram-joshi', 'Tennis', 'Senior', 'India',
   'A versatile all-court player with strong baseline game and tactical intelligence.',
   'National Ranking #4 Singles, ITF Junior Title 2023', 'active', 6),
  ('Saanvi Mehta', 'saanvi-mehta', 'Athletics', 'Junior', 'India',
   'A promising long-distance runner who has rapidly progressed through state rankings.',
   'U-18 National Cross Country Champion 2024', 'active', 7)
ON CONFLICT (slug) DO NOTHING;

-- Teams
INSERT INTO teams (name, slug, sport, description, status, display_order) VALUES
  ('United Football Club', 'united-football-club', 'Football',
   'Our flagship football team competing in regional and national leagues. Known for attacking football and developing young talent.', 'active', 0),
  ('United Cricket XI', 'united-cricket-xi', 'Cricket',
   'Competing across T20, ODI, and multi-day formats at state and national level tournaments.', 'active', 1),
  ('United Basketball', 'united-basketball', 'Basketball',
   'A fast-paced basketball program fielding teams in senior and junior divisions.', 'active', 2),
  ('United Athletics', 'united-athletics', 'Athletics',
   'Fielding athletes across sprints, middle distance, jumps, and throws at major meets.', 'active', 3),
  ('United Swim Team', 'united-swim-team', 'Swimming',
   'Competitive swimmers representing United Sports at state and national championships.', 'active', 4),
  ('United Tennis Academy', 'united-tennis-academy', 'Tennis',
   'A development-focused tennis team preparing juniors for national and international circuits.', 'active', 5)
ON CONFLICT (slug) DO NOTHING;

-- Team Athletes (roster)
INSERT INTO team_athletes (team_id, athlete_id, display_order)
SELECT t.id, a.id, 0
FROM teams t, athletes a
WHERE t.slug = 'united-football-club' AND a.slug = 'aarav-sharma'
ON CONFLICT DO NOTHING;

INSERT INTO team_athletes (team_id, athlete_id, display_order)
SELECT t.id, a.id, 1
FROM teams t, athletes a
WHERE t.slug = 'united-football-club' AND a.slug = 'kabir-khan'
ON CONFLICT DO NOTHING;

INSERT INTO team_athletes (team_id, athlete_id, display_order)
SELECT t.id, a.id, 0
FROM teams t, athletes a
WHERE t.slug = 'united-cricket-xi' AND a.slug = 'priya-patel'
ON CONFLICT DO NOTHING;

INSERT INTO team_athletes (team_id, athlete_id, display_order)
SELECT t.id, a.id, 0
FROM teams t, athletes a
WHERE t.slug = 'united-basketball' AND a.slug = 'rohan-singh'
ON CONFLICT DO NOTHING;

INSERT INTO team_athletes (team_id, athlete_id, display_order)
SELECT t.id, a.id, 0
FROM teams t, athletes a
WHERE t.slug = 'united-athletics' AND a.slug = 'ananya-iyer'
ON CONFLICT DO NOTHING;

INSERT INTO team_athletes (team_id, athlete_id, display_order)
SELECT t.id, a.id, 1
FROM teams t, athletes a
WHERE t.slug = 'united-athletics' AND a.slug = 'saanvi-mehta'
ON CONFLICT DO NOTHING;

INSERT INTO team_athletes (team_id, athlete_id, display_order)
SELECT t.id, a.id, 0
FROM teams t, athletes a
WHERE t.slug = 'united-swim-team' AND a.slug = 'meera-reddy'
ON CONFLICT DO NOTHING;

INSERT INTO team_athletes (team_id, athlete_id, display_order)
SELECT t.id, a.id, 0
FROM teams t, athletes a
WHERE t.slug = 'united-tennis-academy' AND a.slug = 'vikram-joshi'
ON CONFLICT DO NOTHING;

-- Testimonials
INSERT INTO testimonials (name, role, quote, status, display_order) VALUES
  ('Rajesh Kumar', 'Parent',
   'United Sports has transformed my son. The coaches care deeply about each athlete''s development, both on and off the field. We''ve seen incredible growth in confidence and skill.',
   'active', 0),
  ('Sneha Desai', 'Former Athlete',
   'Training at United Sports gave me the discipline and skills to compete at the national level. The coaches believed in me when I needed it most.',
   'active', 1),
  ('Coach Vikram Nair', 'Head Coach - Football',
   'The culture here is special. Athletes push each other to be better every day. It is a privilege to be part of their journey.',
   'active', 2),
  ('Lakshmi Rao', 'Parent',
   'From the moment we joined, our daughter felt welcomed. The community at United Sports is supportive, inclusive, and committed to excellence.',
   'active', 3),
  ('Arjun Menon', 'Athlete',
   'The training intensity and attention to detail at United Sports is unmatched. I have grown as an athlete and as a person here.',
   'active', 4)
ON CONFLICT DO NOTHING;

-- Events
INSERT INTO events (title, slug, description, event_date, start_time, end_time, location, status) VALUES
  ('United Sports Summer Camp 2026', 'united-sports-summer-camp-2026',
   'A two-week intensive summer camp covering football, cricket, basketball, and athletics. Open to athletes aged 8-18.',
   '2026-05-15', '09:00', '16:00', 'United Sports Complex, Mumbai', 'upcoming'),
  ('Inter-Academy Football Tournament', 'inter-academy-football-tournament',
   'Annual invitational football tournament featuring top academy teams from across the region.',
   '2026-07-22', '10:00', '18:00', 'Central Stadium, Mumbai', 'upcoming'),
  ('Junior Athletics Meet', 'junior-athletics-meet',
   'A development-focused athletics meet for athletes aged 12-17. Events include sprints, middle distance, jumps, and relays.',
   '2026-09-10', '08:00', '14:00', 'United Sports Complex', 'upcoming'),
  ('United Sports Annual Gala', 'united-sports-annual-gala',
   'Celebrating our athletes, coaches, and community with awards, performances, and a charity auction.',
   '2026-12-05', '18:00', '23:00', 'Grand Ballroom, Mumbai', 'upcoming')
ON CONFLICT (slug) DO NOTHING;

-- Articles (News)
INSERT INTO articles (title, slug, excerpt, content, status, published_at, category_id) VALUES
  ('United Sports Launches New Junior Development Programme',
   'united-sports-launches-new-junior-development-programme',
   'A structured pathway for athletes aged 6-12 to develop fundamental movement skills across multiple sports.',
   'United Sports is proud to announce the launch of our new Junior Development Programme, designed to give young athletes the strongest possible foundation. The programme focuses on fundamental movement skills, coordination, and sport-specific basics in a fun and supportive environment.

The Junior Development Programme runs year-round with weekly sessions led by certified coaches. Athletes will be introduced to football, cricket, basketball, and athletics, with opportunities to specialise as they progress.

Registration is now open for athletes aged 6-12. Limited spots available.',
   'published', NOW(),
   (SELECT id FROM categories WHERE slug = 'news' LIMIT 1)),
  ('Priya Patel Selected for National Cricket Squad',
   'priya-patel-selected-for-national-cricket-squad',
   'United Sports athlete Priya Patel has been selected to represent India in the upcoming international cricket series.',
   'We are thrilled to share that Priya Patel, our very own pace bowling sensation, has been selected for the national women''s cricket squad for the upcoming international series. Priya has been a key member of our cricket programme for the past three years and her dedication and skill have earned her this incredible opportunity.

Priya will join the national camp next month before the series begins. The entire United Sports family wishes her the very best.',
   'published', NOW(),
   (SELECT id FROM categories WHERE slug = 'athlete-stories' LIMIT 1)),
  ('Community Outreach: Free Coaching Clinics in Local Schools',
   'community-outreach-free-coaching-clinics-in-local-schools',
   'United Sports coaches are delivering free weekly coaching clinics to students in underserved communities.',
   'As part of our commitment to making sport accessible, United Sports coaches are now running free weekly coaching clinics in five local schools. The programme focuses on basic skills, teamwork, and the joy of physical activity.

Over 200 students are already enrolled, and the response from schools, parents, and students has been overwhelmingly positive. We are proud to play a role in building healthier, more active communities.',
   'published', NOW(),
   (SELECT id FROM categories WHERE slug = 'community' LIMIT 1)),
  ('5 Tips to Improve Your Sprint Technique',
   '5-tips-to-improve-your-sprint-technique',
   'Practical tips from our athletics coaches to help you run faster and reduce injury risk.',
   'Whether you are training for the 100m or just want to feel quicker on the field, sprint technique matters. Here are five practical tips from our athletics coaches:

1. Drive your arms powerfully. Arms and legs work together — strong arm drive produces strong leg drive.
2. Lean slightly forward from the ankles, not the waist. A forward lean engages the right muscles.
3. Strike the ground with your front foot under your hips, not out in front.
4. Keep your head still and your gaze fixed forward.
5. Practice starts. The first 10 metres make or break a sprint.

Consistent technique work beats raw talent over time. Train smart.',
   'published', NOW(),
   (SELECT id FROM categories WHERE slug = 'training' LIMIT 1)),
  ('United Sports Hosts Annual Coaches Workshop',
   'united-sports-hosts-annual-coaches-workshop',
   'Our annual coaches workshop brought together 40 coaches from across the region for two days of learning and collaboration.',
   'Last weekend, United Sports hosted its annual Coaches Workshop, bringing together 40 coaches from partner academies and clubs for two days of intensive learning.

Topics included athlete development frameworks, injury prevention, sport psychology, and modern training methodologies. The workshop was led by United Sports head coaches alongside guest speakers from national-level programmes.

We are committed to investing in our coaching community — better coaches mean better experiences for every athlete.',
   'published', NOW(),
   (SELECT id FROM categories WHERE slug = 'events' LIMIT 1))
ON CONFLICT (slug) DO NOTHING;
