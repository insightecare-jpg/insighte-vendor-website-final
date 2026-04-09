-- Add meeting_link to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS meeting_link TEXT;

-- Add gamification fields to providers
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;

-- Create session_notes table if not already correctly structured
-- (Note: public.sessions exists but let's ensure it's robust)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sessions') THEN
        CREATE TABLE public.sessions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
            notes TEXT,
            recommendations TEXT,
            internal_clinical_notes TEXT,
            created_at TIMESTAMPTZ DEFAULT now()
        );
    END IF;
END $$;

-- Enable RLS for the new columns/tables
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policies for sessions
DROP POLICY IF EXISTS "Providers can manage their session notes" ON public.sessions;
CREATE POLICY "Providers can manage their session notes" ON public.sessions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE public.bookings.id = public.sessions.booking_id
            AND public.bookings.provider_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE public.bookings.id = public.sessions.booking_id
            AND public.bookings.provider_id = auth.uid()
        )
    );

-- Refresh the views if any (not applicable here)
