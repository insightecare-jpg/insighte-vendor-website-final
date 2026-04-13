-- ============================================================
-- Migration: Unify Expert Profiles & Add Clinical Sections
-- Created: 2026-04-12
-- ============================================================

-- 1. Add missing clinical sections to partners ------------------
ALTER TABLE partners ADD COLUMN IF NOT EXISTS about text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS approach text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS parent_insights jsonb DEFAULT '[]'::jsonb;

-- 2. Backfill 'about' from 'bio' if about is empty ---------------
UPDATE partners SET about = bio WHERE about IS NULL OR about = '';

-- 3. Update search_partners RPC to include new columns ---------
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
  tagline           text,
  about             text,
  approach          text,
  parent_insights   jsonb
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
    p.tagline,
    p.about,
    p.approach,
    p.parent_insights
  FROM partners p
  WHERE
    (p.approval_status = 'APPROVED' OR p.approval_status = 'LIVE')
    AND (
      (search_term IS NULL OR search_term = '')
      OR p.name               ILIKE '%' || search_term || '%'
      OR p.category           ILIKE '%' || search_term || '%'
      OR p.bio                ILIKE '%' || search_term || '%'
      OR p.about              ILIKE '%' || search_term || '%'
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

-- 4. Update RLS to allow reading LIVE status --------------------
DROP POLICY IF EXISTS approved_partners_public_read ON partners;
CREATE POLICY gallery_visibility_read
  ON partners FOR SELECT
  USING (approval_status IN ('APPROVED', 'LIVE'));
