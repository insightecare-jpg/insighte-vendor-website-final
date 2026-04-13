
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTables() {
  const { data, error } = await supabase
    .from('partners') // We know this one exists
    .select('id')
    .limit(1);

  if (error) {
     console.error("Partner error:", error);
  } else {
     console.log("Partners table OK");
  }

  const { data: pData, error: pError } = await supabase
    .from('programs')
    .select('id')
    .limit(1);

  if (pError) {
     console.error("Programs error:", pError);
  } else {
     console.log("Programs table OK, found:", pData.length);
  }
}

checkTables();
