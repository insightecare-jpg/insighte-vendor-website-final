-- 0001_enrich_users.sql
-- Incremental evolution of the users table to match the new multi-sided platform scope.

-- 1. Add missing columns to public.users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS country TEXT, -- ISO 3166-1
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Migrate roles to the new lowercase standard specified in the mission.
-- Roles: PARENT -> client, PROVIDER -> provider, ADMIN -> admin
DO $$ 
BEGIN
    UPDATE public.users 
    SET role = 'client' 
    WHERE role = 'PARENT';

    UPDATE public.users 
    SET role = 'provider' 
    WHERE role = 'PROVIDER';

    UPDATE public.users 
    SET role = 'admin' 
    WHERE role = 'ADMIN';

    -- Handle case where roles might already be lowercase but mismatch (e.g. 'parent' vs 'client')
    UPDATE public.users SET role = 'client' WHERE role = 'parent';
END $$;

-- 3. Update the constraint to reflect the new roles
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'provider', 'client'));

-- 4. Enable RLS on users if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. Basic user policies (refined later in RLS migration)
DROP POLICY IF EXISTS "Users can view their own record" ON public.users;
CREATE POLICY "Users can view their own record" ON public.users 
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users 
FOR ALL USING (
    (auth.jwt() ->> 'app_role' = 'admin') OR 
    (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
);
