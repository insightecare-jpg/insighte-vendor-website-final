import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get("next") ?? "/";
  const appRole = searchParams.get("app_role");

  if (code) {
    const supabase = await createClient();
    const { error, data: { user } } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && user) {
      // If we have an appRole from the sign-in attempt, we might want to update user metadata
      // if it's their first time or if they are signing up.
      // However, usually RLS or triggers handle this.
      
      const role = user.app_metadata?.app_role;
      
      if (role === "admin") return NextResponse.redirect(`${origin}/admin/dashboard`);
      if (role === "provider") return NextResponse.redirect(`${origin}/provider/dashboard`);
      return NextResponse.redirect(`${origin}/parent/dashboard`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
