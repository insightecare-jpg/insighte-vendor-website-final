-- Normalize Program Types for Catalog Filtering
-- Target: public.programs

DO $$ 
BEGIN
    -- Add type column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'type') THEN
        ALTER TABLE public.programs ADD COLUMN type TEXT DEFAULT 'core_service';
    END IF;
END $$;

-- Update existing programs with types for the Sanctuary Catalog
UPDATE public.programs SET type = 'core_service' WHERE category IN ('Therapy', 'Clinical', 'Education');
UPDATE public.programs SET type = 'training' WHERE name ILIKE '%Training%' OR name ILIKE '%Certification%';
UPDATE public.programs SET type = 'support_group' WHERE category = 'Support' OR name ILIKE '%Group%';
UPDATE public.programs SET type = 'course' WHERE name ILIKE '%Course%' OR name ILIKE '%Masterclass%';

-- Specific Mapping for Seeded Data
UPDATE public.programs SET type = 'core_service' WHERE name IN (
    'Applied Behavior Analysis (ABA)',
    'Special Education',
    'Speech & Language Therapy',
    'Occupational Therapy (OT)',
    'Shadow Teaching',
    'Early Intervention'
);

UPDATE public.programs SET type = 'support_group' WHERE name = 'Counselling & Psychotherapy';
