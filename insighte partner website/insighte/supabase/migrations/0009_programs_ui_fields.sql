-- 0009_programs_ui_fields.sql
-- Adding UI-specific fields to programs to support high-fidelity catalog rendering.

ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Optional: If we want to store a 'typical starting price' for the program at the catalog level.
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS base_price_description TEXT;
