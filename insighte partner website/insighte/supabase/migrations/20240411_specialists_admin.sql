-- ============================================================
-- Migration: Admin Specialists Full Redesign
-- Date: 2024-04-11
-- ============================================================

-- 1. Governance flags on users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_at timestamptz,
  ADD COLUMN IF NOT EXISTS suspended_at timestamptz,
  ADD COLUMN IF NOT EXISTS suspended_reason text,
  ADD COLUMN IF NOT EXISTS suspended_by uuid REFERENCES public.users(id);

-- 2. Institutional tiering on partners
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS tier text DEFAULT 'partner' 
    CHECK (tier IN ('insighte', 'premium', 'partner')),
  ADD COLUMN IF NOT EXISTS location_label TEXT;

-- 3. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_partners_approval_status 
  ON public.partners(approval_status) WHERE approval_status = 'PENDING_REVIEW';

CREATE INDEX IF NOT EXISTS idx_users_role_is_featured 
  ON public.users(role, is_featured) WHERE role = 'PROVIDER';

-- 4. Audit Log entry for the redesign activation
COMMENT ON TABLE public.partners IS 'Consolidated specialist registry supporting Institutional Governance Hub v2';
