-- ============================================================
-- Insighte Backend Sovereignty — Final Implementation (RAZORPAY)
-- Created: 2024-04-13
-- Aligned with "Sanctuary" Schema: parent_id, uppercase roles
-- ============================================================

-- 1. FOUNDATIONAL INFRASTRUCTURE ----------------------------

-- Programs (Core Service Areas)
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    type TEXT DEFAULT 'core_service' CHECK (type IN ('core_service', 'training', 'course', 'support_group')),
    icon_emoji TEXT,
    tags TEXT[] DEFAULT '{}'::text[],
    impact_stat TEXT,
    impact_label TEXT,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Master Packages (Bundled sessions)
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.programs(id),
    name TEXT NOT NULL,
    session_count INTEGER NOT NULL,
    price INTEGER NOT NULL, -- price in paise
    currency TEXT DEFAULT 'INR',
    validity_days INTEGER DEFAULT 365,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. CORE TABLE SCHEMA REFINEMENTS --------------------------

-- USERS ENRICHMENT
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS family_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Promote insightecare@gmail.com to admin (UPPERCASE ROLE)
UPDATE public.users 
SET role = 'ADMIN', is_approved = true 
WHERE email = 'insightecare@gmail.com';

-- PINCODE AREAS (Master Data)
CREATE TABLE IF NOT EXISTS public.pincode_areas (
    pincode TEXT PRIMARY KEY,
    area_name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- CHILDREN ENRICHMENT
ALTER TABLE public.children
ADD COLUMN IF NOT EXISTS child_code TEXT,
ADD COLUMN IF NOT EXISTS total_sessions_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS progress_streak INTEGER DEFAULT 0;

-- SESSION CLOCK (Real-time tracking)
CREATE TABLE IF NOT EXISTS public.session_clock (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    provider_clock_in TIMESTAMPTZ,
    client_clock_in_confirm TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'closed', 'auto_closed')),
    provider_clock_out TIMESTAMPTZ,
    client_clock_out_confirm TIMESTAMPTZ,
    actual_duration_minutes INTEGER,
    billable BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- INVOICES & PAYMENTS (Razorpay Optimized)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id),
    parent_id UUID NOT NULL REFERENCES public.parents(id), -- FIXED: client_id -> parent_id
    provider_id UUID NOT NULL REFERENCES public.partners(id), -- FIXED: providers -> partners
    amount INTEGER NOT NULL, -- in paise
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'cancelled', 'refunded')),
    razorpay_order_id TEXT UNIQUE,
    pdf_url TEXT,
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id),
    method TEXT DEFAULT 'razorpay',
    external_id TEXT UNIQUE, -- Razorpay Payment ID
    external_order_id TEXT, -- Razorpay Order ID
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL,
    signature TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PACKAGES PURCHASES
CREATE TABLE IF NOT EXISTS public.package_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES public.packages(id),
    parent_id UUID NOT NULL REFERENCES public.parents(id), -- FIXED: client_id -> parent_id
    sessions_remaining INTEGER NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'completed')),
    razorpay_order_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    performer_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SUPABASE AUTH & ROLE SYSTEM -----------------------------

CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN') THEN
    UPDATE public.users SET role = 'ADMIN' WHERE id = target_user_id;
    INSERT INTO public.audit_logs (performer_id, action, entity_type, entity_id)
    VALUES (auth.uid(), 'promote_to_admin', 'user', target_user_id);
  ELSE
    RAISE EXCEPTION 'Only admins can promote other users';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_auth_user_jwt()
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  user_role text;
  is_approved boolean;
BEGIN
  SELECT role, is_approved INTO user_role, is_approved
  FROM public.users WHERE id = auth.uid();
  RETURN json_build_object(
    'app_role', COALESCE(user_role, 'PARENT'), -- Default to PARENT
    'is_approved', COALESCE(is_approved, false)
  );
END;
$$;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES -----------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['users', 'bookings', 'invoices', 'package_purchases', 'audit_logs', 'programs']) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Admin full access" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Admin full access" ON public.%I FOR ALL USING (auth.jwt() ->> ''app_role'' = ''ADMIN'')', t);
  END LOOP;
END $$;

CREATE POLICY "Users read own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Involved read bookings" ON public.bookings FOR SELECT USING (auth.uid() IN (parent_id, provider_id));
CREATE POLICY "Programs are readable by everyone" ON public.programs FOR SELECT USING (true);

-- 5. EXTENSIBLE SPECIALIZATION -------------------------------
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS sub_category TEXT,
ADD COLUMN IF NOT EXISTS service_tags TEXT[] DEFAULT '{}'::text[];

CREATE OR REPLACE FUNCTION search_experts(
  search_term       text      DEFAULT '',
  cat_filter        text      DEFAULT NULL,
  city_filter       text      DEFAULT NULL
)
RETURNS SETOF public.partners
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.partners
  WHERE 
    (search_term = '' OR name ILIKE '%' || search_term || '%' OR bio ILIKE '%' || search_term || '%')
    AND (cat_filter IS NULL OR category = cat_filter OR sub_category = cat_filter OR service_tags && ARRAY[cat_filter])
    AND (city_filter IS NULL OR city = city_filter)
    AND approval_status IN ('APPROVED', 'LIVE')
  ORDER BY is_featured DESC, rating DESC NULLS LAST;
END;
$$;
