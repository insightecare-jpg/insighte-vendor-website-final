-- ============================================================
-- Migration: Learner Identities (child_profiles)
-- Core registry for neuro-affirmative clinical profiles.
-- ==========================================

CREATE TABLE IF NOT EXISTS public.child_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER,
    diagnoses TEXT[] DEFAULT '{}'::text[],
    clinical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage their children" ON public.child_profiles
    FOR ALL USING (auth.uid() = parent_id);

CREATE POLICY "Partners can view booked children" ON public.child_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.child_id = child_profiles.id 
            AND bookings.provider_id = (SELECT id FROM partners WHERE user_id = auth.uid())
        )
    );
