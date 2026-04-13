-- 0006_schema_alignment.sql
-- Finalizing schema alignment for booking lifecycle and provider services.

-- 1. Enrich existing services table to match provider_services scope
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES public.programs(id),
ADD COLUMN IF NOT EXISTS rate INTEGER, -- minor units
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
ADD COLUMN IF NOT EXISTS session_duration_minutes INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS session_mode TEXT CHECK (session_mode IN ('online', 'in-person', 'both')) DEFAULT 'online',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Enrich existing bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS cancelled_by UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS package_purchase_id UUID REFERENCES public.package_purchases(id),
ADD COLUMN IF NOT EXISTS meet_link TEXT;

-- Backfill scheduled_at from start_time
UPDATE public.bookings SET scheduled_at = start_time WHERE scheduled_at IS NULL;

-- 3. Sessions (The actual delivered therapy record)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    meet_link TEXT,
    provider_notes TEXT,
    client_visible_summary TEXT,
    recording_url TEXT,
    notes_submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Session Notes (Detailed clinical records)
CREATE TABLE IF NOT EXISTS public.session_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    observations TEXT,
    goals TEXT,
    next_steps TEXT,
    attachments TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Booking Attendance
CREATE TABLE IF NOT EXISTS public.booking_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('present', 'absent', 'late')) DEFAULT 'present',
    marked_by UUID NOT NULL REFERENCES public.users(id),
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Availability Slots (Standardizing the existing slots table)
-- We'll add day_of_week and start/end time columns if missing to match the "weekly grid" requirement.
ALTER TABLE public.slots
ADD COLUMN IF NOT EXISTS day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
ADD COLUMN IF NOT EXISTS start_time_only TIME,
ADD COLUMN IF NOT EXISTS end_time_only TIME,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 7. RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own sessions" ON public.sessions 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.bookings b 
        WHERE b.id = booking_id AND (b.client_id = auth.uid() OR b.provider_id = auth.uid())
    )
);
