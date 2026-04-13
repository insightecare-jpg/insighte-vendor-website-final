
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY // Need service role for DDL if enabled, but let's try anon/anon with check
);

async function fixSchema() {
  // Use RPC or just try a select to confirm
  const { error } = await supabase.from('partners').select('is_featured').limit(1);
  if (error && error.message.includes('column "is_featured" does not exist')) {
    console.log("Column missing. We need a migration or superuser access.");
  } else if (error) {
    console.error(error);
  } else {
    console.log("Column exists.");
  }
}

fixSchema();
