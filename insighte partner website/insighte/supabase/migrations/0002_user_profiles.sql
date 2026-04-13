-- 0002_user_profiles.sql
-- Unified profiles table for all roles (client, provider, admin).

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    avatar_url TEXT,
    specialisations TEXT[] DEFAULT '{}'::text[],
    languages TEXT[] DEFAULT '{"en"}'::text[],
    location_lat FLOAT8,
    location_lng FLOAT8,
    location_label TEXT,
    years_experience INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles 
FOR SELECT USING (is_public = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Migration of existing provider data into profiles
DO $$ 
BEGIN
    -- Only run if providers table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'providers') THEN
        INSERT INTO public.profiles (user_id, bio, avatar_url, languages, specialisations, years_experience, location_label, is_public)
        SELECT 
            u.id, 
            p.bio, 
            p.profile_image, 
            COALESCE(p.languages, '{"en"}'::text[]), 
            COALESCE(p.specializations, '{}'::text[]), 
            COALESCE(p.experience_years, 0),
            concat_ws(', ', p.area, p.city),
            p.verified -- assume verified means public for now
        FROM public.providers p
        JOIN public.users u ON lower(u.email) = lower(p.name) -- best guess for matching if they share name/email or if we can link by ID
        -- Note: If existing project uses UUID for p.id that matches u.id, use that instead.
        -- Assuming p.id might not match u.id based on previous migration logic.
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END $$;
