
-- Fix: Re-create the programs table if missing
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    type TEXT DEFAULT 'core_service' CHECK (type IN ('core_service', 'training', 'course', 'support_group')),
    icon_emoji TEXT,
    tags TEXT[] DEFAULT '{}'::text[],
    impact_stat TEXT,
    impact_label TEXT,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Programs are readable by everyone" ON public.programs FOR SELECT USING (true);
