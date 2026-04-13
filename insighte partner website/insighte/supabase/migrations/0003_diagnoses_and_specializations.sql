-- 0003_diagnoses_and_specializations.sql
-- Master data for diagnoses, programs, and audit approvals.

-- 1. Diagnoses catalog
CREATE TABLE IF NOT EXISTS public.diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Child Link to Diagnoses
CREATE TABLE IF NOT EXISTS public.child_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
    diagnosis_id UUID NOT NULL REFERENCES public.diagnoses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(child_id, diagnosis_id)
);

-- 3. Programs (categories/types of therapy)
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Provider Approvals Audit
CREATE TABLE IF NOT EXISTS public.provider_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES public.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. RLS
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Diagnoses are readable by everyone" ON public.diagnoses FOR SELECT USING (true);
CREATE POLICY "Programs are readable by everyone" ON public.programs FOR SELECT USING (true);

-- Migration of existing children diagnoses string to the new many-to-many model
DO $$ 
DECLARE
    child_rec RECORD;
    diag_id UUID;
BEGIN
    FOR child_rec IN SELECT id, diagnosis FROM public.children WHERE diagnosis IS NOT NULL LOOP
        -- Simple check/insert diagnosis
        INSERT INTO public.diagnoses (name) VALUES (child_rec.diagnosis) ON CONFLICT (name) DO NOTHING;
        SELECT id INTO diag_id FROM public.diagnoses WHERE name = child_rec.diagnosis;
        INSERT INTO public.child_diagnoses (child_id, diagnosis_id) VALUES (child_rec.id, diag_id) ON CONFLICT DO NOTHING;
    END LOOP;
END $$;
