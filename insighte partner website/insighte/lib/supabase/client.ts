import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== "undefined") {
      console.error("Supabase environment variables missing. Client not initialized.");
    }
    return null as any; // Using `as any` to avoid breaking existing usages, but client will be null checked in a cleaner way if we wanted
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
