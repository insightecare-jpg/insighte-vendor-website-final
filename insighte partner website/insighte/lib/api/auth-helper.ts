import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

/**
 * INSIGHTE AUTH HELPER
 * Resolves the active investigator (real or bypass).
 */
export async function getEffectiveUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return { 
        id: user.id, 
        role: user.app_metadata?.app_role as string,
        isBypass: false 
    };
  }

  // Check for Dev Bypass
  if (process.env.NODE_ENV === 'development') {
    const cookieStore = await cookies();
    const devRole = cookieStore.get('insighte-dev-role')?.value;
    
    if (devRole) {
      return { 
          id: '00000000-0000-0000-0000-000000000000', 
          role: devRole,
          isBypass: true 
      };
    }
  }

  return null;
}
