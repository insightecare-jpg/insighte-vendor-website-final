-- Migration: Ensure Partners Table Consistency
-- Aligning avatar_url and other core identity columns.

DO $$ 
BEGIN
    -- 1. Rename profile_image to avatar_url if avatar_url is missing but profile_image exists
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'profile_image') AND 
       NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.partners RENAME COLUMN profile_image TO avatar_url;
    END IF;

    -- 2. Add avatar_url if it still doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.partners ADD COLUMN avatar_url TEXT;
    END IF;

    -- 3. Ensure other expected columns from ProviderCard are present
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'is_verified') THEN
        ALTER TABLE public.partners ADD COLUMN is_verified BOOLEAN DEFAULT false;
    END IF;
    
    -- Backfill is_verified from verified if exists
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'verified') AND 
       EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'partners' AND column_name = 'is_verified') THEN
        UPDATE public.partners SET is_verified = verified WHERE is_verified IS NULL;
    END IF;

END $$;
