-- Initial Migration: Sanctuary Schema Baseline
-- Created: 2026-04-02
-- This matches the current riukjenrqfdsbvsessmk project state.

-- 1. ENUMS & TYPES
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('PARENT', 'PROVIDER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USERS (Link to Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('PARENT', 'PROVIDER', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. PARENTS
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. CHILDREN
CREATE TABLE IF NOT EXISTS public.children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER,
    goals TEXT,
    diagnosis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. PROVIDERS
CREATE TABLE IF NOT EXISTS public.providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    bio TEXT,
    languages TEXT[],
    profile_image TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    slug TEXT UNIQUE,
    education JSONB DEFAULT '[]'::jsonb,
    work_experience JSONB DEFAULT '[]'::jsonb,
    specializations TEXT[] DEFAULT '{}'::text[],
    age_groups TEXT[] DEFAULT '{}'::text[],
    city TEXT,
    area TEXT,
    rate INTEGER DEFAULT 1800,
    location_type TEXT[] DEFAULT '{}'::text[],
    availability_timing TEXT[] DEFAULT '{}'::text[],
    mode TEXT DEFAULT 'In-Person',
    experience_years INTEGER DEFAULT 5
);

-- 6. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    type TEXT DEFAULT '1:1 Call',
    description TEXT,
    reply_time TEXT,
    is_popular BOOLEAN DEFAULT false,
    rating DECIMAL DEFAULT 5.0,
    UNIQUE(provider_id, title)
);

-- 7. SLOTS
CREATE TABLE IF NOT EXISTS public.slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('available', 'booked', 'blocked')) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
    parent_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
    child_id UUID REFERENCES public.children(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('upcoming', 'completed', 'cancelled')) DEFAULT 'upcoming',
    payment_status TEXT CHECK (payment_status IN ('paid', 'pending', 'refunded')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. CURATIONS
CREATE TABLE IF NOT EXISTS public.curations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    category TEXT,
    image_url TEXT,
    features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. RLS POLICIES
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public providers are readable" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Public services are readable" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public slots are readable" ON public.slots FOR SELECT USING (true);
CREATE POLICY "Public reviews are readable" ON public.reviews FOR SELECT USING (true);
