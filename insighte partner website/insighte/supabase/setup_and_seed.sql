-- setup_and_seed.sql
-- Run this in your Supabase SQL Editor to initialize everything

-- 1. Create Tables
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

-- 2. Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public courses are readable" ON public.courses;
CREATE POLICY "Public courses are readable" ON public.courses FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public course modules are readable" ON public.course_modules;
CREATE POLICY "Public course modules are readable" ON public.course_modules FOR SELECT USING (
    course_id IN (SELECT id FROM public.courses WHERE status = 'published')
);

DROP POLICY IF EXISTS "Public blog posts readable" ON public.blog_posts;
CREATE POLICY "Public blog posts readable" ON public.blog_posts FOR SELECT USING (status = 'published');

-- 3. Seed Data
DELETE FROM public.blog_posts WHERE slug IN ('mastering-shadow-support', 'sensory-dysregulation-guide', 'clinical-autism-diagnostics');
DELETE FROM public.courses WHERE slug IN ('early-intervention-masterclass', 'shadow-teacher-certification-l1');

INSERT INTO public.blog_posts (title_en, slug, content_markdown, category, reading_time_minutes, cover_image_url, video_url, podcast_url, status, summary_bullets)
VALUES 
('Mastering Shadow Support', 'mastering-shadow-support', '## Shadow Support Content...', 'Shadow Teaching', 8, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, 'published', ARRAY['IEP Integration']),
('Sensory Guide', 'sensory-dysregulation-guide', '## Sensory Content...', 'Parenting', 12, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b', NULL, NULL, 'published', ARRAY['Trigger Mapping']);

INSERT INTO public.courses (title, slug, description, price, is_live, status, cover_image_url, payment_link)
VALUES
('Early Intervention Masterclass', 'early-intervention-masterclass', 'Description...', 4999, true, 'published', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9', '#'),
('Shadow Teacher Certification', 'shadow-teacher-certification-l1', 'Description...', 12500, true, 'published', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3', '#');

-- Verify
SELECT count(*) FROM public.courses;
SELECT count(*) FROM public.blog_posts;
