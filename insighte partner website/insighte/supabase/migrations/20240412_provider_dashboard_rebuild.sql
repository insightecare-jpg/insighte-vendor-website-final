-- ============================================================
-- Migration: Provider Dashboard Complete Rebuild
-- Created: 2024-04-12
-- ============================================================

-- 1. SESSION CLOCK (Clinical Integrity Layer) -----------------------
CREATE TABLE IF NOT EXISTS public.session_clock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  -- Clock in
  provider_clock_in timestamptz,
  client_clock_in_confirm timestamptz,
  clock_in_status text DEFAULT 'pending' 
    CHECK (clock_in_status IN ('pending','confirmed','disputed')),
  -- Clock out  
  provider_clock_out timestamptz,
  client_clock_out_confirm timestamptz,
  client_confirm_deadline timestamptz, -- provider_clock_out + 90 seconds
  clock_out_status text DEFAULT 'pending'
    CHECK (clock_out_status IN ('pending','auto_confirmed','client_confirmed','disputed')),
  -- Duration
  actual_duration_minutes int, -- computed on close
  billable boolean DEFAULT false,
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. SESSION NOTES V2 (Clinical Narrative) --------------------------
CREATE TABLE IF NOT EXISTS public.session_notes_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES public.users(id),
  visibility text DEFAULT 'private'
    CHECK (visibility IN ('private','client')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. PROVIDER KYC (Compliance Architecture) -------------------------
CREATE TABLE IF NOT EXISTS public.provider_kyc (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  -- Identity
  full_legal_name text,
  date_of_birth date,
  pan_number text,
  aadhaar_last4 text,
  -- Docs (Storage URLs)
  pan_doc_url text,
  aadhaar_doc_url text,
  degree_doc_url text,
  certification_doc_url text,
  -- Bank details
  account_name text,
  account_number text,
  ifsc_code text,
  bank_name text,
  -- Status machine
  kyc_status text DEFAULT 'not_started'
    CHECK (kyc_status IN 
      ('not_started','submitted','under_review','approved','rejected')),
  rejection_reason text,
  reviewed_by uuid REFERENCES public.users(id),
  reviewed_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. PROFILE STATUS MACHINE -----------------------------------------
DO $$ 
BEGIN
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_status text DEFAULT 'draft' CHECK (profile_status IN ('draft','pending_review','live','paused','suspended'));
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_submitted_at timestamptz;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_approved_at timestamptz;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_approved_by uuid REFERENCES public.users(id);
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS privacy_accepted_at timestamptz;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_online_available boolean DEFAULT true;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_offline_available boolean DEFAULT false;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS service_pincodes text[];
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS service_cities text[];
END $$;

-- 5. CLIENT INVITATIONS ---------------------------------------------
CREATE TABLE IF NOT EXISTS public.client_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.users(id),
  email text NOT NULL,
  client_id uuid REFERENCES public.users(id), -- null until sign up
  booking_id uuid REFERENCES public.bookings(id),
  token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  status text DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','expired')),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

-- 6. PROVIDER CREDENTIALS (Academic Matrix) -------------------------
CREATE TABLE IF NOT EXISTS public.provider_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.users(id),
  type text CHECK (type IN ('degree','certification','award','membership')),
  title text NOT NULL,
  institution text,
  year_obtained int,
  doc_url text,
  is_verified boolean DEFAULT false,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 7. USER LOCATION METADATA -----------------------------------------
DO $$ 
BEGIN
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS location_pincode text;
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS location_area text;
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS location_city text;
END $$;

-- 8. SERVICE REGIONS (Bangalore/Delhi/Kerala Baseline) --------------
CREATE TABLE IF NOT EXISTS public.service_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  area_name text NOT NULL,
  UNIQUE(city, area_name)
);

-- Seed Bangalore Areas
INSERT INTO public.service_regions (city, area_name) VALUES
('Bangalore', 'Cantonment area'), ('Bangalore', 'Domlur'), ('Bangalore', 'Indiranagar'),
('Bangalore', 'Jeevanbheemanagar'), ('Bangalore', 'Malleswaram'), ('Bangalore', 'K.R. Market'),
('Bangalore', 'Sadashivanagar'), ('Bangalore', 'Seshadripuram'), ('Bangalore', 'Shivajinagar'),
('Bangalore', 'Ulsoor'), ('Bangalore', 'Vasanth Nagar'), ('Bangalore', 'Bellandur'),
('Bangalore', 'CV Raman Nagar'), ('Bangalore', 'Hoodi'), ('Bangalore', 'Krishnarajapuram'),
('Bangalore', 'Mahadevapura'), ('Bangalore', 'Marathahalli'), ('Bangalore', 'Varthur'),
('Bangalore', 'Whitefield'), ('Bangalore', 'Banaswadi'), ('Bangalore', 'HBR Layout'),
('Bangalore', 'Horamavu'), ('Bangalore', 'Kalyan Nagar'), ('Bangalore', 'Kammanahalli'),
('Bangalore', 'Lingarajapuram'), ('Bangalore', 'Ramamurthy Nagar'), ('Bangalore', 'Hebbal'),
('Bangalore', 'Jalahalli'), ('Bangalore', 'Mathikere'), ('Bangalore', 'Peenya'),
('Bangalore', 'R. T. Nagar'), ('Bangalore', 'Vidyaranyapura'), ('Bangalore', 'Yelahanka'),
('Bangalore', 'Yeshwanthpur'), ('Bangalore', 'Bommanahalli'), ('Bangalore', 'Bommasandra'),
('Bangalore', 'BTM Layout'), ('Bangalore', 'Electronic City'), ('Bangalore', 'HSR Layout'),
('Bangalore', 'Koramangala'), ('Bangalore', 'Madiwala'), ('Bangalore', 'Banashankari'),
('Bangalore', 'Basavanagudi'), ('Bangalore', 'Girinagar'), ('Bangalore', 'J. P. Nagar'),
('Bangalore', 'Jayanagar'), ('Bangalore', 'Kumaraswamy Layout'), ('Bangalore', 'Padmanabhanagar'),
('Bangalore', 'Uttarahalli'), ('Bangalore', 'Anjanapura'), ('Bangalore', 'Arekere'),
('Bangalore', 'Begur'), ('Bangalore', 'Gottigere'), ('Bangalore', 'Hulimavu'),
('Bangalore', 'Kothnur'), ('Bangalore', 'Basaveshwaranagar'), ('Bangalore', 'Kamakshipalya'),
('Bangalore', 'Kengeri'), ('Bangalore', 'Mahalakshmi Layout'), ('Bangalore', 'Nagarbhavi'),
('Bangalore', 'Nandini Layout'), ('Bangalore', 'Nayandahalli'), ('Bangalore', 'Rajajinagar'),
('Bangalore', 'Rajarajeshwari Nagar'), ('Bangalore', 'Vijayanagar'),
('Delhi', 'Central Delhi'), ('Delhi', 'South Delhi'), ('Delhi', 'North Delhi'), ('Delhi', 'West Delhi'),
('Kerala', 'Kochi'), ('Kerala', 'Trivandrum'), ('Kerala', 'Calicut')
ON CONFLICT DO NOTHING;

-- 9. RLS POLICIES ----------------------------------------------------
ALTER TABLE public.session_clock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_notes_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own session clock" ON public.session_clock 
FOR SELECT USING (EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booking_id AND (bookings.provider_id = (SELECT id FROM partners WHERE id = auth.uid()) OR bookings.parent_id = auth.uid())));

CREATE POLICY "Providers can manage own notes" ON public.session_notes_v2 
FOR ALL USING (provider_id = auth.uid());

CREATE POLICY "KYC is private" ON public.provider_kyc 
FOR ALL USING (provider_id = auth.uid());
