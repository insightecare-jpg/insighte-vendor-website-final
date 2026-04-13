-- ============================================================
-- Migration: Parent Sanctuary Identity Registry (v1)
-- Description: Renames child_profiles to children, adds CLI coding architecture.
-- ============================================================

-- 1. Standardize Tables ----------------------------------------

-- Rename child_profiles to children if exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'child_profiles') AND 
     NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'children') THEN
    ALTER TABLE public.child_profiles RENAME TO children;
  END IF;
END $$;

-- 2. Add Identity Codes ----------------------------------------

-- Client Code for Parents (Profiles)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS client_code TEXT UNIQUE;

-- Child Code for Children
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS child_code TEXT UNIQUE;
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS avatar_colors TEXT[] DEFAULT ARRAY['#D3C4B5', '#111224'];

-- 3. Trigger for Client Code -----------------------------------

CREATE OR REPLACE FUNCTION generate_client_code()
RETURNS TRIGGER AS $$
DECLARE
    new_code TEXT;
    seq_num INTEGER;
BEGIN
    IF NEW.role = 'PARENT' AND NEW.client_code IS NULL THEN
        -- Get next sequence number
        SELECT COALESCE(MAX(CAST(SUBSTRING(client_code, 5) AS INTEGER)), 1000) + 1 
        INTO seq_num 
        FROM public.profiles 
        WHERE client_code LIKE 'CLI-%';
        
        new_code := 'CLI-' || seq_num;
        NEW.client_code := new_code;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_client_code ON public.profiles;
CREATE TRIGGER trg_generate_client_code
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION generate_client_code();

-- 4. Trigger for Child Code ------------------------------------

CREATE OR REPLACE FUNCTION generate_child_code()
RETURNS TRIGGER AS $$
DECLARE
    p_code TEXT;
    c_count INTEGER;
    ext CHAR;
BEGIN
    -- Get parent's client_code
    SELECT client_code INTO p_code FROM public.profiles WHERE id = NEW.user_id;
    
    -- If parent has no code, generate one or fallback
    IF p_code IS NULL THEN
        p_code := 'CLI-TEMP';
    END IF;

    -- Count existing children for this parent
    SELECT COUNT(*) INTO c_count FROM public.children WHERE user_id = NEW.user_id;
    
    -- Extension A, B, C...
    ext := CHR(65 + c_count); -- 65 is 'A'
    
    NEW.child_code := p_code || '-' || ext;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_child_code ON public.children;
CREATE TRIGGER trg_generate_child_code
    BEFORE INSERT ON public.children
    FOR EACH ROW
    EXECUTE FUNCTION generate_child_code();

-- 5. Backfill Existing -----------------------------------------
DO $$
DECLARE
    r RECORD;
    c_code TEXT;
    idx INTEGER;
BEGIN
    -- Backfill Parents
    FOR r IN SELECT id FROM public.profiles WHERE role = 'PARENT' AND client_code IS NULL LOOP
        SELECT COALESCE(MAX(CAST(SUBSTRING(client_code, 5) AS INTEGER)), 1000) + 1 INTO idx FROM public.profiles WHERE client_code LIKE 'CLI-%';
        UPDATE public.profiles SET client_code = 'CLI-' || idx WHERE id = r.id;
    END LOOP;

    -- Backfill Children
    FOR r IN SELECT id, user_id FROM public.children WHERE child_code IS NULL LOOP
        SELECT client_code INTO c_code FROM public.profiles WHERE id = r.user_id;
        SELECT COUNT(*) INTO idx FROM public.children WHERE user_id = r.user_id AND child_code IS NOT NULL;
        UPDATE public.children SET child_code = c_code || '-' || CHR(65 + idx) WHERE id = r.id;
    END LOOP;
END $$;
