
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listTables() {
  const { data, error } = await supabase.rpc('get_tables'); // Hope this exists
  if (error) {
    // Try a direct select from pg_catalog if we have permissions
    const { data: d2, error: e2 } = await supabase.from('information_schema.tables').select('table_name').eq('table_schema', 'public');
    if (e2) {
      console.error(e2);
      return;
    }
    console.log(d2.map(t => t.table_name));
  } else {
    console.log(data);
  }
}

listTables();
