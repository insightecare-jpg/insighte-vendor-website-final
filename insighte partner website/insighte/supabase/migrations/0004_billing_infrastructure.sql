-- 0004_billing_infrastructure.sql
-- Financial layer for packages, invoices, payments, and payouts.

-- 1. Packages (Bundled sessions)
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES public.programs(id),
    name TEXT NOT NULL,
    session_count INTEGER NOT NULL,
    price INTEGER NOT NULL, -- minor units (e.g. cents/paise)
    currency TEXT DEFAULT 'INR',
    validity_days INTEGER DEFAULT 365,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Package Purchases (Tracking usage)
CREATE TABLE IF NOT EXISTS public.package_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES public.packages(id),
    client_id UUID NOT NULL REFERENCES public.users(id),
    sessions_total INTEGER NOT NULL,
    sessions_remaining INTEGER NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID, -- Optional link to specific booking
    package_purchase_id UUID REFERENCES public.package_purchases(id),
    client_id UUID NOT NULL REFERENCES public.users(id),
    provider_id UUID NOT NULL REFERENCES public.users(id),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT CHECK (status IN ('draft', 'approved', 'sent', 'paid')) DEFAULT 'draft',
    stripe_invoice_id TEXT,
    due_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    line_items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Payments (Stripe records)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id),
    stripe_payment_intent_id TEXT UNIQUE,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Payouts (Provider transfers)
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.users(id),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    stripe_transfer_id TEXT UNIQUE,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    released_by UUID REFERENCES public.users(id), -- Admin who released payout
    released_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Refunds
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id),
    amount INTEGER NOT NULL,
    reason TEXT,
    stripe_refund_id TEXT UNIQUE,
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

-- Basic access: Users see their own financial records
CREATE POLICY "Clients see their invoices" ON public.invoices FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Providers see their invoices" ON public.invoices FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Clients see their purchases" ON public.package_purchases FOR SELECT USING (auth.uid() = client_id);
