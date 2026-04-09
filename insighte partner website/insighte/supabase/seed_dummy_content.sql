-- ONE-STOP HYBRID SCRIPT: Tables + Policies + Seed Data
-- Run this in your Supabase SQL Editor

-- ==========================================
-- 1. SETUP TABLES (IDEMPOTENT)
-- ==========================================

-- COURSES (LMS)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_link TEXT,
    facilitators JSONB DEFAULT '[]'::jsonb,
    is_live BOOLEAN NOT NULL DEFAULT false,
    status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    target_audience TEXT[] DEFAULT '{}'::text[],
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- COURSE MODULES
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_type TEXT CHECK (content_type IN ('video', 'text', 'assignment', 'quiz')) DEFAULT 'text',
    content_url TEXT,
    content_text TEXT,
    order_index INTEGER DEFAULT 0,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- BLOG POSTS
DO $$ BEGIN
    CREATE TABLE IF NOT EXISTS public.blog_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title_en TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary_bullets TEXT[] DEFAULT '{}'::text[],
        category TEXT,
        reading_time_minutes INTEGER DEFAULT 5,
        peer_reviewed_status BOOLEAN DEFAULT false,
        cover_image_url TEXT,
        is_professional BOOLEAN DEFAULT false,
        video_url TEXT,
        podcast_url TEXT,
        content_markdown TEXT,
        media_urls JSONB DEFAULT '{}'::jsonb,
        html_content TEXT,
        status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );
EXCEPTION WHEN others THEN null;
END $$;

-- 2. SECURITY (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Select Policies (Public Access)
DROP POLICY IF EXISTS "Public courses are readable" ON public.courses;
CREATE POLICY "Public courses are readable" ON public.courses FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public course modules are readable" ON public.course_modules;
CREATE POLICY "Public course modules are readable" ON public.course_modules FOR SELECT USING (
    course_id IN (SELECT id FROM public.courses WHERE status = 'published')
);

DROP POLICY IF EXISTS "Public blog posts readable" ON public.blog_posts;
CREATE POLICY "Public blog posts readable" ON public.blog_posts FOR SELECT USING (status = 'published');

-- ==========================================
-- 3. SEED DUMMY DATA
-- ==========================================

-- Clean existing seed data to avoid unique constraint errors on slug
DELETE FROM public.blog_posts WHERE slug IN ('mastering-shadow-support', 'sensory-dysregulation-guide', 'clinical-autism-diagnostics');
DELETE FROM public.courses WHERE slug IN ('early-intervention-masterclass', 'shadow-teacher-certification-l1');

-- Insert Dummy Blog Posts
INSERT INTO public.blog_posts (title_en, slug, content_markdown, category, reading_time_minutes, cover_image_url, video_url, podcast_url, status, summary_bullets)
VALUES 
(
  'Mastering Shadow Support in Mainstream Schools',
  'mastering-shadow-support',
  '## The Bridge to Radical Inclusion

Shadow teaching is not just about supervision; it is about fading support as the child gains autonomy. In this masterclass, we explore the tactical nuances of inclusive education.

### Clinical Dose: 
**A shadow teacher is successful only when they make themselves redundant.**

### Key Takeaways
- IEP integration
- Social scripting
- Peer advocacy

Shadow teachers act as the clinical bridge between the school classroom and the home therapy team.',
  'Shadow Teaching',
  8,
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2844&auto=format&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://podcasts.apple.com/us/podcast/id123456789',
  'published',
  ARRAY['Fading support techniques', 'Data-driven advocacy', 'Peer meditation']
),
(
  'Sensory Dysregulation: A Practical Parent Guide',
  'sensory-dysregulation-guide',
  '## Understanding the Sensory Storm

When a child experiences a sensory meltdown, the goal is regulatory safety, not behavioral compliance. We break down the neurological triggers and home strategies.

### Clinical Dose:
**Regulation must always precede education. A dysregulated brain cannot learn.**',
  'Parenting',
  12,
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=3040&auto=format&fit=crop',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  NULL,
  'published',
  ARRAY['Neurological trigger mapping', 'Co-regulation basics', 'Post-meltdown recovery']
),
(
  'Clinical Advances in Autism Diagnostics',
  'clinical-autism-diagnostics',
  '## Beyond the Label

Modern diagnostics favor neuro-divergent profiles over static checklists. High-fidelity clinical research is now focusing on strengths-based assessments.',
  'Clinical',
  15,
  'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=2940&auto=format&fit=crop',
  NULL,
  'https://podcasts.apple.com/us/podcast/id987654321',
  'published',
  ARRAY['Strength-based reporting', 'Sensory profile integration', 'ADHD comorbidity']
);

-- Insert Dummy Courses
INSERT INTO public.courses (title, slug, description, price, is_live, status, cover_image_url, payment_link)
VALUES
(
  'Early Intervention Masterclass',
  'early-intervention-masterclass',
  'A comprehensive 8-week program for parents of children aged 0-5. Learn therapist-approved techniques to stimulate speech, social, and motor development at home.',
  4999,
  true,
  'published',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2786&auto=format&fit=crop',
  'https://buy.stripe.com/test_dummy'
),
(
  'Shadow Teacher Certification (Level 1)',
  'shadow-teacher-certification-l1',
  'Become a professional classroom support specialist. This accredited course covers IEP implementation, classroom management, and neuro-affirmative ethics.',
  12500,
  true,
  'published',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop',
  'https://buy.stripe.com/test_dummy'
);
