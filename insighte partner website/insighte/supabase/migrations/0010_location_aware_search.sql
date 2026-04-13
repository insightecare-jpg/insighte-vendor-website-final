-- ============================================================
-- Migration: Location-Aware Marketplace Discovery
-- Prioritizes local specialists before global fallback.
-- ============================================================

CREATE OR REPLACE FUNCTION search_partners_v2(
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
  location_score    integer
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
    (CASE 
      WHEN target_city IS NOT NULL AND p.city ILIKE target_city THEN 100 
      WHEN target_city IS NOT NULL AND p.location ILIKE '%' || target_city || '%' THEN 80
      WHEN p.mode = 'Online' THEN 50
      ELSE 0 
    END) as location_score
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
  ORDER BY
    (CASE 
      WHEN target_city IS NOT NULL AND p.city ILIKE target_city THEN 1 
      WHEN target_city IS NOT NULL AND p.location ILIKE '%' || target_city || '%' THEN 2
      ELSE 3 
    END) ASC,
    p.is_featured    DESC,
    p.booking_count  DESC,
    p.rating         DESC NULLS LAST;
END;
$$;
