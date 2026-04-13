-- 20240411_programs_blog.sql
-- Enriches programs and blog_posts schema for institutional governance and editorial CMS.

-- 1. ENRICH PROGRAMS TABLE
ALTER TABLE public.programs 
  ADD COLUMN IF NOT EXISTS type text DEFAULT 'core_service'
    CHECK (type IN ('core_service', 'training', 'course', 'support_group')),
  ADD COLUMN IF NOT EXISTS subtitle text,
  ADD COLUMN IF NOT EXISTS hero_image_url text,
  ADD COLUMN IF NOT EXISTS icon_emoji text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS impact_stat text,
  ADD COLUMN IF NOT EXISTS impact_label text,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  -- For trainings and events:
  ADD COLUMN IF NOT EXISTS event_date timestamptz,
  ADD COLUMN IF NOT EXISTS event_end_date timestamptz,
  ADD COLUMN IF NOT EXISTS event_location text,
  ADD COLUMN IF NOT EXISTS event_mode text CHECK (event_mode IN ('online','in-person','hybrid')),
  ADD COLUMN IF NOT EXISTS seats_total int,
  ADD COLUMN IF NOT EXISTS seats_remaining int,
  ADD COLUMN IF NOT EXISTS event_status text DEFAULT 'upcoming'
    CHECK (event_status IN ('upcoming','live','completed','cancelled')),
  ADD COLUMN IF NOT EXISTS registration_link text,
  ADD COLUMN IF NOT EXISTS payment_link text,
  ADD COLUMN IF NOT EXISTS fee int,
  ADD COLUMN IF NOT EXISTS fee_currency text DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS is_free boolean DEFAULT false,
  -- For courses:
  ADD COLUMN IF NOT EXISTS external_enroll_url text,
  ADD COLUMN IF NOT EXISTS course_duration text,
  ADD COLUMN IF NOT EXISTS course_audience text,
  ADD COLUMN IF NOT EXISTS course_format text,
  -- For support groups:
  ADD COLUMN IF NOT EXISTS frequency text,
  ADD COLUMN IF NOT EXISTS schedule_label text,
  ADD COLUMN IF NOT EXISTS member_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS intake_type text CHECK (intake_type IN ('open','rolling','closed')) DEFAULT 'open';

-- 2. PROGRAM FACILITATORS
CREATE TABLE IF NOT EXISTS public.program_facilitators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
  name text NOT NULL,
  bio text,
  avatar_url text,
  role text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 3. PROGRAM MODULES (Curriculum)
CREATE TABLE IF NOT EXISTS public.program_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_minutes int,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. ENRICH BLOG POSTS TABLE
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS excerpt text,
  ADD COLUMN IF NOT EXISTS content_type text DEFAULT 'article'
    CHECK (content_type IN ('article','video','podcast')),
  ADD COLUMN IF NOT EXISTS audience text DEFAULT 'entire_hub'
    CHECK (audience IN ('entire_hub','parent_sanctuary','clinical_pro')),
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS author_avatar_url text,
  ADD COLUMN IF NOT EXISTS author_role text,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- 5. RLS UPDATES
ALTER TABLE public.program_facilitators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Facilitators are readable by everyone" ON public.program_facilitators FOR SELECT USING (true);
CREATE POLICY "Modules are readable by everyone" ON public.program_modules FOR SELECT USING (true);

CREATE POLICY "Admins can manage facilitators" ON public.program_facilitators FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "Admins can manage modules" ON public.program_modules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- 6. SEED INITIAL DATA (Programs)
-- Core Services
INSERT INTO public.programs (name, description, type, icon_emoji, tags, impact_stat, impact_label, display_order)
VALUES 
('Home Therapy', 'Personalized neuro-affirming therapy (Special Ed, ABA, Speech) delivered in the comfort and safety of your own home.', 'core_service', '🏠', ARRAY['At-Home', 'Personalized', 'Daily Reports'], '1,200+', 'families supported in Bangalore', 1),
('Shadow Teachers', 'Classroom support specialists who work alongside your child in mainstream schools, facilitating learning without singling them out.', 'core_service', '🎓', ARRAY['In-School', 'Daily support', 'IEP aligned'], '60+', 'shadow teachers across Bangalore & Delhi', 2),
('Counselling & Therapy', 'Licensed child psychologists and therapists helping with anxiety, school transitions, emotional regulation, trauma, and family dynamics.', 'core_service', '💬', ARRAY['ADHD', 'Anxiety', 'Behavioural', 'Family therapy'], '57+', 'counsellors · Available online & in-person', 3),
('Special Education', 'Identifying specific learning needs through clinical diagnosis and creating actionable, personalized learning strategies for the classroom.', 'core_service', '🏫', ARRAY['IEP', 'Academic Support', 'Diagnostics'], '500+', 'outcome-based IEPs created', 4)
ON CONFLICT (name) DO UPDATE SET 
  type = EXCLUDED.type, 
  icon_emoji = EXCLUDED.icon_emoji, 
  tags = EXCLUDED.tags, 
  impact_stat = EXCLUDED.impact_stat, 
  impact_label = EXCLUDED.impact_label;

-- Courses
INSERT INTO public.programs (name, description, type, icon_emoji, course_format, course_audience, course_duration, is_featured, tags)
VALUES 
('Understanding Your Neurodiverse Child', 'Science-backed strategies for supporting ADHD, autism, and learning differences at home and school.', 'course', '🧠', 'Online', 'For Parents', '6 weeks', true, ARRAY['Most enrolled']),
('Early Speech Stimulation at Home', 'Practical activities to build language skills in children aged 1–4 with speech delays.', 'course', '🗣️', 'Online', 'For Parents', '4 weeks', false, ARRAY['New']),
('IEP Planning Masterclass', 'Build effective, legally compliant IEPs with clear goals, accommodations, and progress tracking.', 'course', '✏️', 'Live sessions', 'For Educators', '2 days', false, ARRAY[]),
('Social Skills Through Drama', 'Drama-based group program building conversation, empathy, and social confidence.', 'course', '🎭', 'In-person', 'Ages 6–14', 'Bangalore', false, ARRAY['Limited spots'])
ON CONFLICT (name) DO UPDATE SET 
  type = EXCLUDED.type, 
  course_format = EXCLUDED.course_format, 
  course_duration = EXCLUDED.course_duration;

-- Support Groups
INSERT INTO public.programs (name, description, type, icon_emoji, schedule_label, member_count, intake_type, tags)
VALUES 
('Parent Circle — Bangalore', 'A safe space for parents of neurodiverse children to share stories, strategies, and find community.', 'support_group', '🤝', 'Every 2nd Saturday · In-person', 180, 'open', ARRAY[]),
('Online Parents Support Group', 'Virtual peer support for parents across India. Moderated by a licensed counsellor.', 'support_group', '💻', 'Every Wednesday · 8 PM IST', 340, 'open', ARRAY[]),
('Educator Community Hub', 'Shadow teachers, special educators, and counsellors sharing resources and getting peer support.', 'support_group', '🎓', 'Monthly workshop + Slack community', 90, 'open', ARRAY[]),
('Adolescent Peer Group (13–17)', 'A therapist-facilitated group where teens build social skills, express themselves, and feel understood.', 'support_group', '🌱', 'Saturdays · In-person, Bengaluru', 24, 'rolling', ARRAY[])
ON CONFLICT (name) DO UPDATE SET 
  type = EXCLUDED.type, 
  schedule_label = EXCLUDED.schedule_label, 
  member_count = EXCLUDED.member_count;
