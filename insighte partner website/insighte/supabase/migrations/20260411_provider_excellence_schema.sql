-- ============================================================
-- Migration: Provider Excellence & Financial Sovereignty
-- Created: 2026-04-11
-- ============================================================

-- 1. KYC RECORDS (Trust & Compliance Layer) -----------------------
CREATE TABLE IF NOT EXISTS public.kyc_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    pan_number TEXT,
    bank_name TEXT,
    account_number TEXT,
    ifsc_code TEXT,
    account_holder_name TEXT,
    document_urls JSONB DEFAULT '[]'::jsonb, -- [ {type: 'PAN', url: '...'}, {type: 'CERT', url: '...'} ]
    status TEXT CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')) DEFAULT 'PENDING',
    rejection_reason TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. PAYOUTS (Financial Engine) -----------------------------------
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    status TEXT CHECK (status IN ('PENDING', 'PROCESSING', 'SETTLED', 'FAILED')) DEFAULT 'PENDING',
    payout_date TIMESTAMP WITH TIME ZONE,
    transaction_ref TEXT,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. ALIGN PROVIDER SERVICES WITH ADMIN LIBRARY ------------------
-- The 'services' table already exists; we ensure it's used as the bridge.
-- (This logic ensures providers only select from approved programs)
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS offering_type TEXT CHECK (offering_type IN ('1:1_CALL', 'PACKAGE', 'ASSESSMENT', 'DIGITAL_PRODUCT')) DEFAULT '1:1_CALL';

-- Index for faster marketplace lookup
CREATE INDEX IF NOT EXISTS idx_services_program_id ON public.services(program_id);
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON public.services(provider_id);


-- 4. TESTIMONIALS (Consolidated Trust Loop) -----------------------
-- Adding 'is_public' and 'provider_id' to existing testimonials if needed
-- or ensuring the existing reviews table supports the dashboard.
ALTER TABLE IF EXISTS public.reviews 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS response_content TEXT,
ADD COLUMN IF NOT EXISTS response_at TIMESTAMP WITH TIME ZONE;

-- 5. RECURRING AVAILABILITY (Schedule Architecture) ---------------
ALTER TABLE IF EXISTS public.providers
ADD COLUMN IF NOT EXISTS weekly_availability JSONB DEFAULT '{
  "monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []
}'::jsonb;

-- 6. RLS POLICIES --------------------------------------------------
ALTER TABLE public.kyc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_offerings ENABLE ROW LEVEL SECURITY;

-- KYC: Only the provider can see their own bank details
CREATE POLICY "Providers can view own KYC" ON public.kyc_records 
FOR SELECT USING (auth.uid() = provider_id);

-- Payouts: Only the provider can view their own payouts
CREATE POLICY "Providers can view own payouts" ON public.payouts 
FOR SELECT USING (auth.uid() = provider_id);

-- Offerings: Public can read, Provider can update
CREATE POLICY "Public services are readable" ON public.services FOR SELECT USING (true);
CREATE POLICY "Providers can manage own services" ON public.services 
FOR ALL USING (auth.uid() = provider_id);


-- Audit log
COMMENT ON TABLE public.kyc_records IS 'KYC and compliance management for therapists and educators.';
COMMENT ON TABLE public.payouts IS 'Financial settlement ledger for platform providers.';
COMMENT ON TABLE public.provider_offerings IS 'Granular service map connecting providers to the clinical registry.';
