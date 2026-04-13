import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function listBlogs() {
  const { data, error } = await supabase.from("blog_posts").select("slug, title_en");
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  console.log("Blogs in DB:", data);
}

listBlogs();
