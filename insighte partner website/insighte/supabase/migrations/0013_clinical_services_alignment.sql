-- ============================================================
-- Migration: Clinical Services Alignment
-- Adding 'category' column to ensure institutional parity.
-- ==========================================

ALTER TABLE IF EXISTS public.services 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing data if any
UPDATE public.services 
SET category = 'Speech & Communication' 
WHERE title ILIKE '%Speech%';

UPDATE public.services 
SET category = 'Behavioral Architecture' 
WHERE title ILIKE '%Behavior%' OR title ILIKE '%ABA%';

UPDATE public.services 
SET category = 'Sensory Mapping' 
WHERE title ILIKE '%Occupational%';
