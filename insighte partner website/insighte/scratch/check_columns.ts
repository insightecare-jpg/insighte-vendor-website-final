import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'blog_posts' });
  if (error) {
    // If RPC doesn't exist, try raw query if possible, or just list a few rows
    console.error("RPC Error:", error.message);
    const { data: rows, error: rowsError } = await supabase.from("blog_posts").select("*").limit(5);
    if (!rowsError && rows) {
       const allKeys = new Set<string>();
       rows.forEach(r => Object.keys(r).forEach(k => allKeys.add(k)));
       console.log("All keys found in first 5 rows:", Array.from(allKeys));
    }
    return;
  }
  console.log("Columns from RPC:", data);
}

check();
