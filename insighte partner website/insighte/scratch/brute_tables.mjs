
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listAllTables() {
  const { data, error } = await supabase.rpc('get_table_names'); // If exists
  if (error) {
     // Try a simple brute force check of common names
     const tables = ['programs', 'program', 'services', 'service', 'categories', 'pillars'];
     for (const t of tables) {
       const { error: e } = await supabase.from(t).select('id').limit(1);
       if (!e) console.log(`Table ${t} exists!`);
       else console.log(`Table ${t} error: ${e.message}`);
     }
  } else {
     console.log(data);
  }
}

listAllTables();
