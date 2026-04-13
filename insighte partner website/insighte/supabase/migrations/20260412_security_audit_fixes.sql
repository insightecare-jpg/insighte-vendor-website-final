-- Migration: Security Audit & RLS Hardening
-- Targets: learners, partners, services, kyc_records, payouts
-- Goal: Fix broken RLS policies and unify provider identity access.

-- 1. HARDEN PARTNERS ACCESS -----------------------
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners can view own record" ON public.partners;
CREATE POLICY "Partners can view own record" ON public.partners
FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Partners can update own record" ON public.partners;
CREATE POLICY "Partners can update own record" ON public.partners
FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- 2. HARDEN LEARNERS (REGISTRY) -------------------
ALTER TABLE public.learners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners can manage own learners" ON public.learners;
CREATE POLICY "Partners can manage own learners" ON public.learners
FOR ALL TO authenticated
USING (
  provider_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
);

-- 3. HARDEN SERVICES (OFFERINGS) ------------------
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners can manage own services" ON public.services;
CREATE POLICY "Partners can manage own services" ON public.services
FOR ALL TO authenticated
USING (
  provider_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
);

-- 4. HARDEN KYC RECORDS (SENSITIVE) ----------------
ALTER TABLE public.kyc_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners manage own KYC" ON public.kyc_records;
CREATE POLICY "Partners manage own KYC" ON public.kyc_records
FOR ALL TO authenticated
USING (
  provider_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
);

-- 5. HARDEN PAYOUTS (FINANCIAL) --------------------
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Partners view own payouts" ON public.payouts;
CREATE POLICY "Partners view own payouts" ON public.payouts
FOR SELECT TO authenticated
USING (
  provider_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
);

-- 6. AUDIT FIX: Synchronize Legacy Providers table (if possible)
-- Ensure providers table also follows user_id logic if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'providers') THEN
        ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Providers view own record" ON public.providers;
        -- Assuming providers 'id' might be linked to partners 'id' or has its own user_id
        -- We harden it by checking if the user owns a partner record that matches
        CREATE POLICY "Providers view own record" ON public.providers
        FOR SELECT TO authenticated
        USING (
           id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
        );
    END IF;
END $$;
