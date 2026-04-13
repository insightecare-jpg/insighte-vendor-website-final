"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Next.js middleware handles routing after this
  revalidatePath("/", "layout");
  redirect("/");
}

export async function register(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string; // 'client' or 'provider'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        app_role: role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Instead of auto-redirect, we might need email verification
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "Email already taken" };
  }
  
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  } else {
    // If double-opt in is enabled in Supabase (default)
    redirect("/verify");
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
