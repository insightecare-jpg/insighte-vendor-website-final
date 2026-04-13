-- 1. Create Profile for Bypass User
INSERT INTO profiles (user_id, full_name, role)
VALUES ('00000000-0000-0000-0000-000000000000', 'Insighte Dev User', 'client')
ON CONFLICT (user_id) DO NOTHING;

-- 2. Create Child Profile for Dashboard preview
INSERT INTO child_profiles (parent_id, full_name, age, primary_concern)
VALUES ('00000000-0000-0000-0000-000000000000', 'Arav Junior', 6, 'Speech Delay')
ON CONFLICT DO NOTHING;

-- 3. Create Partner Profile for Provider Bypass
INSERT INTO partners (user_id, name, slug, verified, city, category)
VALUES ('00000000-0000-0000-0000-000000000000', 'Dr. Dev Specialist', 'dev-specialist', true, 'Bangalore', 'insighte')
ON CONFLICT (user_id) DO NOTHING;

-- 4. Mock Booking
INSERT INTO bookings (client_id, provider_id, start_time, status)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  (SELECT id FROM partners WHERE user_id = '00000000-0000-0000-0000-000000000000' LIMIT 1),
  NOW() + interval '1 day',
  'confirmed'
WHERE EXISTS (SELECT 1 FROM partners WHERE user_id = '00000000-0000-0000-0000-000000000000');
