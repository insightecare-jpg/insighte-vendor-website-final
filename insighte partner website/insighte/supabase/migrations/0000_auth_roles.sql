-- 0000_auth_roles.sql

-- Enable the JWT extension if not already present (Supabase usually has this)
-- But primarily we'll create the JWT hook function.

-- This hook is called by GoTrue just before a token is issued.
-- It reads the role from public.users and injects it as `app_role` at the root of the JWT.
CREATE OR REPLACE FUNCTION public.set_app_role(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  -- Ensure public.users table exists although it might be created in the next migration.
  -- We use exception handling in case the table doesn't exist yet during early signup.
  BEGIN
    SELECT role INTO user_role FROM public.users WHERE id = (event->>'user_id')::uuid;
  EXCEPTION WHEN undefined_table THEN
    user_role := 'client';
  END;

  claims := event->'claims';

  IF user_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{app_role}', to_jsonb(user_role));
  ELSE
    -- Default to client if no role found
    claims := jsonb_set(claims, '{app_role}', '"client"');
  END IF;

  -- Update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  -- Return the modified or original event
  RETURN event;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_app_role(jsonb) TO supabase_auth_admin;

-- Instructions for the user or automated script:
-- Tell GoTrue to use this hook:
-- You must go to your Supabase Dashboard -> Authentication -> Hooks
-- and assign `public.set_app_role` to the Custom Access Token (JWT) Hook.
