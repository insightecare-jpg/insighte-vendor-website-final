-- ============================================================
-- Migration: Admin Families Final Schema Alignment
-- Bridging gaps for clinical registry and dense admin dashboard.
-- ==========================================

-- 1. Enrich Child Profiles for demographic precision
ALTER TABLE IF EXISTS public.child_profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS services_needed UUID[] DEFAULT '{}'::uuid[];

-- 2. Enrich Services for clinical categorization
ALTER TABLE IF EXISTS public.services 
ADD COLUMN IF NOT EXISTS category TEXT;

-- 3. Enrich Partners for location-based filtering
ALTER TABLE IF EXISTS public.partners 
ADD COLUMN IF NOT EXISTS location_label TEXT;

-- 3. Enrich Package Purchases for easier tracking
ALTER TABLE IF EXISTS public.package_purchases 
ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('active', 'expiring_soon', 'expired', 'exhausted')) DEFAULT 'active';

-- 4. Enrich Bookings for cancellation tracking
ALTER TABLE IF EXISTS public.bookings 
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- 5. Helper Function: Calculate Age from DOB
CREATE OR REPLACE FUNCTION public.calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN date_part('year', age(birth_date));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. Trigger to auto-update package status on sessions_remaining change
CREATE OR REPLACE FUNCTION public.update_package_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sessions_remaining <= 0 THEN
        NEW.status := 'exhausted';
    ELSIF NEW.expires_at < now() THEN
        NEW.status := 'expired';
    ELSIF NEW.expires_at < now() + interval '7 days' THEN
        NEW.status := 'expiring_soon';
    ELSE
        NEW.status := 'active';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_package_status ON public.package_purchases;
CREATE TRIGGER tr_update_package_status
BEFORE INSERT OR UPDATE OF sessions_remaining, expires_at ON public.package_purchases
FOR EACH ROW EXECUTE FUNCTION public.update_package_status();
