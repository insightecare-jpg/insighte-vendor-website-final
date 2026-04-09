"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            const cookieStoreSync = cookieStore;
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStoreSync.set(name, value, options)
            );
          } catch (error) {
            // Context missing fallback
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch role to redirect correctly
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (profile?.role === "PROVIDER") {
    redirect("/provider/dashboard");
  } else if (profile?.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (profile?.role === "PARENT") {
    redirect("/parent/dashboard");
  }

  redirect("/");
}
