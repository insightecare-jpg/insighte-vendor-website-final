-- Migration: Add Academic and Professional Experience Columns to Partners
-- Target: public.partners

DO $$ 
BEGIN
    -- 1. Academic Experience (JSONB Array)
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'academic_experience') THEN
        ALTER TABLE public.partners ADD COLUMN academic_experience JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- 2. Professional Experience (JSONB Array)
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'professional_experience') THEN
        ALTER TABLE public.partners ADD COLUMN professional_experience JSONB DEFAULT '[]'::jsonb;
    END IF;

    -- 3. Coordinates for spatial presence (JSONB)
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'coords') THEN
        ALTER TABLE public.partners ADD COLUMN coords JSONB;
    END IF;
END $$;

COMMENT ON COLUMN public.partners.academic_experience IS 'Structured JSON array of degrees and certifications.';
COMMENT ON COLUMN public.partners.professional_experience IS 'Structured JSON array of past roles and organizations.';
COMMENT ON COLUMN public.partners.coords IS 'Precise spatial coordinates {lat, lng} for local search matching.';
