-- 0005_comms_and_support.sql
-- Communications, support, notifications, and auditing.

-- 1. Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raised_by UUID NOT NULL REFERENCES public.users(id),
    category TEXT CHECK (category IN ('billing', 'technical', 'scheduling', 'other')) DEFAULT 'other',
    subject TEXT NOT NULL,
    status TEXT CHECK (status IN ('open', 'in-progress', 'resolved')) DEFAULT 'open',
    assigned_to UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Ticket Messages (threaded)
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id),
    body TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Notifications (bell icon / realtime)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Audit Logs (for admin actions)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES public.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Cancellation Policies
CREATE TABLE IF NOT EXISTS public.cancellation_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    hours_notice_required INTEGER NOT NULL DEFAULT 24,
    refund_percentage INTEGER CHECK (refund_percentage BETWEEN 0 AND 100) DEFAULT 100,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(provider_id)
);

-- 6. Digital Resources (linked to services)
CREATE TABLE IF NOT EXISTS public.digital_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.users(id), -- added for easier RLS
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    is_free BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Testimonials (Enhanced reviews)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES public.users(id),
    client_id UUID NOT NULL REFERENCES public.users(id),
    booking_id UUID, -- Optional link to specific booking
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    content TEXT,
    is_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cancellation_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = raised_by);
CREATE POLICY "Users see their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public approved testimonials readable" ON public.testimonials FOR SELECT USING (is_approved = true);

-- Migration of existing reviews into testimonials
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reviews') THEN
        INSERT INTO public.testimonials (provider_id, client_id, rating, content, is_approved, created_at)
        SELECT 
            p.user_id, -- assuming we can map this
            u.id, -- client id
            r.rating,
            r.content,
            true, -- auto-approve legacy reviews
            r.created_at
        FROM public.reviews r
        JOIN public.profiles p ON p.user_id = r.provider_id -- link via existing relations if possible
        JOIN public.users u ON u.id = r.parent_id -- mapping parent to user/client
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
