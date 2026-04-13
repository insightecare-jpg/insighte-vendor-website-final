-- ============================================================
-- Migration: E2E Bypass Identities (Standardized UUIDs)
-- Seeding valid UUIDs to support instant testing in sanctuary.
-- ==========================================

-- Insert mock profile for bypass
INSERT INTO public.profiles (id, full_name, role)
VALUES 
('00000000-0000-0000-0000-000000000000', 'Sanctuary Explorer (Dev)', 'admin')
ON CONFLICT (id) DO UPDATE SET full_name = 'Sanctuary Explorer (Dev)', role = 'admin';

-- Insert mock partner for bypass tests
INSERT INTO public.partners (id, user_id, name, category, bio, approval_status, is_active)
VALUES 
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Dr. Aradhana Sharma (Bypass)', 'Behavioral Architecture', 'Specializing in neuro-affirmative clinical flows.', 'PENDING', true)
ON CONFLICT (id) DO NOTHING;

-- Insert mock learner for bypass tests
INSERT INTO public.child_profiles (id, parent_id, name, age, diagnoses)
VALUES 
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'Aarav (Bypass)', 8, ARRAY['ADHD'])
ON CONFLICT (id) DO NOTHING;
