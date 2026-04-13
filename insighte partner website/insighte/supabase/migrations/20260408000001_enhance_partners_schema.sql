-- ============================================================
-- Migration: Enhance partners schema for search & card display
-- Created: 2026-04-08
-- ============================================================

-- 1. New columns --------------------------------------------------

-- Cached booking count for social proof (sorted by popularity)
ALTER TABLE partners ADD COLUMN IF NOT EXISTS booking_count integer NOT NULL DEFAULT 0;

-- Structured specialization tags (separate from free-text services array)
-- e.g. ['Speech Delay', 'Stuttering', 'Articulation']
ALTER TABLE partners ADD COLUMN IF NOT EXISTS specializations text[] NOT NULL DEFAULT '{}';

-- Denormalized city for fast geo filtering
ALTER TABLE partners ADD COLUMN IF NOT EXISTS city text;

-- Age group targeting (matches search filter values)
-- e.g. ['Toddlers (2-4)', 'Pre-Primary (4-6)', 'Primary (6-10)']
ALTER TABLE partners ADD COLUMN IF NOT EXISTS age_groups text[] NOT NULL DEFAULT '{}';

-- Mode of operation (Online / Home / In-Clinic)
ALTER TABLE partners ADD COLUMN IF NOT EXISTS mode text;

-- Tagline (short headline shown on card)
ALTER TABLE partners ADD COLUMN IF NOT EXISTS tagline text;

-- Featured flag for hero sections
ALTER TABLE partners ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- 2. Backfill city from location --------------------------------
UPDATE partners
SET city = TRIM(SPLIT_PART(location, ',', 1))
WHERE city IS NULL AND location IS NOT NULL AND location <> '';

-- 3. Performance indexes -----------------------------------------
CREATE INDEX IF NOT EXISTS idx_partners_city            ON partners(city);
CREATE INDEX IF NOT EXISTS idx_partners_booking_count   ON partners(booking_count DESC);
CREATE INDEX IF NOT EXISTS idx_partners_specializations ON partners USING GIN(specializations);
CREATE INDEX IF NOT EXISTS idx_partners_age_groups      ON partners USING GIN(age_groups);
CREATE INDEX IF NOT EXISTS idx_partners_approval        ON partners(approval_status);

-- 4. Recreate search_partners RPC --------------------------------
-- Returns all columns needed by ProviderCard and specialists page.
CREATE OR REPLACE FUNCTION search_partners(
  search_term       text      DEFAULT '',
  selected_specs    text[]    DEFAULT NULL,
  selected_modes    text[]    DEFAULT NULL,
  selected_ages     text[]    DEFAULT NULL,
  target_city       text      DEFAULT NULL,
  require_available boolean   DEFAULT false
)
RETURNS TABLE (
  id                uuid,
  slug              text,
  name              text,
  avatar_url        text,
  category          text,
  specializations   text[],
  services          text[],
  experience_years  integer,
  location          text,
  city              text,
  mode              text,
  session_modes     text[],
  rating            numeric,
  review_count      integer,
  first_session_price integer,
  is_featured       boolean,
  booking_count     integer,
  age_groups        text[],
  bio               text,
  tagline           text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.slug,
    p.name,
    p.avatar_url,
    p.category,
    p.specializations,
    p.services,
    p.experience_years,
    p.location,
    p.city,
    p.mode,
    p.session_modes,
    p.rating,
    p.review_count,
    p.first_session_price,
    p.is_featured,
    p.booking_count,
    p.age_groups,
    p.bio,
    p.tagline
  FROM partners p
  WHERE
    p.approval_status = 'APPROVED'
    AND (
      (search_term IS NULL OR search_term = '')
      OR p.name               ILIKE '%' || search_term || '%'
      OR p.category           ILIKE '%' || search_term || '%'
      OR p.bio                ILIKE '%' || search_term || '%'
      OR p.specializations::text ILIKE '%' || search_term || '%'
      OR p.services::text     ILIKE '%' || search_term || '%'
    )
    AND (
      selected_specs IS NULL
      OR p.category = ANY(selected_specs)
      OR p.services        && selected_specs
      OR p.specializations && selected_specs
    )
    AND (
      selected_modes IS NULL
      OR p.session_modes && selected_modes
      OR p.mode = ANY(selected_modes)
    )
    AND (
      selected_ages IS NULL
      OR p.age_groups && selected_ages
    )
    AND (
      target_city IS NULL
      OR p.city     ILIKE target_city
      OR p.location ILIKE '%' || target_city || '%'
    )
  ORDER BY
    p.is_featured    DESC,
    p.booking_count  DESC,
    p.rating         DESC NULLS LAST;
END;
$$;

-- 5. RLS: allow anonymous read of approved partners -------------
-- (only if not already set)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'partners' AND policyname = 'approved_partners_public_read'
  ) THEN
    ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
    CREATE POLICY approved_partners_public_read
      ON partners FOR SELECT
      USING (approval_status = 'APPROVED');
  END IF;
END $$;
