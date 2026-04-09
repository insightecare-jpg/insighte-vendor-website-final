-- Adds tables and policies for Media-Rich Blog and LMS Courses
-- Created: 2026-04-09

-- 1. COURSES (LMS)
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

-- 2. COURSE MODULES
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

-- 3. ENSURE BLOG POSTS UPGRADE (If table exists, just try to alter. If it doesn't, create it.)
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

-- Try adding columns just in case the table existed without them
DO $$ BEGIN
    ALTER TABLE public.blog_posts ADD COLUMN html_content TEXT;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE public.blog_posts ADD COLUMN media_urls JSONB DEFAULT '{}'::jsonb;
EXCEPTION WHEN duplicate_column THEN null;
END $$;

-- 4. RLS POLICIES FOR COURSES
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public courses are readable" ON public.courses FOR SELECT USING (status = 'published');
CREATE POLICY "Public course modules are readable" ON public.course_modules FOR SELECT USING (
    course_id IN (SELECT id FROM public.courses WHERE status = 'published')
);

-- Admin policies (assuming role = ADMIN managed elsewhere, or simple bypass for local)
-- For demonstration/local use we will allow all authenticated users to manage courses if they are ADMIN
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "Admins can manage course modules" ON public.course_modules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
);
