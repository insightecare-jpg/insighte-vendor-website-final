import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogs() {
  console.log("Checking blog posts...");
  const { data, error } = await supabase.from('blog_posts').select('*');
  if (error) {
    console.error("Error fetching blogs:", error);
  } else {
    console.log("Total Blogs:", data.length);
    data.forEach(blog => {
      console.log(`- ${blog.slug}: ${blog.title_en || blog.title} (Cover: ${blog.cover_image_url || 'MISSING'})`);
    });
  }
}

checkBlogs().catch(console.error);
