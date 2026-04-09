"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;

  if (!email || !password || !fullName) {
    return { error: "Email, password, and name are required." };
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
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Context missing fallback
          }
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phone,
      }
    }
  });

  if (error) {
    // Transform blunt technical errors into empathetic, supportive microcopy
    let friendlyError = error.message;
    
    if (error.message.toLowerCase().includes("invalid")) {
      friendlyError = "We couldn't quite verify that email address. Could you double-check it for any small typos?";
    } else if (error.message.toLowerCase().includes("already registered")) {
      friendlyError = "It looks like you're already part of the Insighte community! You can try signing in instead.";
    } else if (password.length < 6) {
      friendlyError = "To keep your account secure within the sanctuary, please use a password with at least 6 characters.";
    } else if (error.message.toLowerCase().includes("rate limit")) {
      friendlyError = "We're receiving a lot of requests right now. Please take a small breath and try again in a moment.";
    }

    return { error: friendlyError };
  }

  // Redirect to onboarding after successful signup
  redirect("/onboarding");
}
