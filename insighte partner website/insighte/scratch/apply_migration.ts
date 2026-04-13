import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function apply() {
  const sql = "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS key_takeaways text[] DEFAULT '{}';";
  // Just testing one column first to see if RPC works
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.error("Migration Error:", error.message);
  } else {
    console.log("Migration test successful.");
  }
}
apply();
