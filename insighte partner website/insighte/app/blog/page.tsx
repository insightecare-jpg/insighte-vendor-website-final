import React from "react";
import { createClient } from "@/lib/supabase/server";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

interface Post {
  id: string;
  slug: string;
  title_en: string;
  summary_bullets: string[];
  category: string;
  reading_time_minutes: number;
  peer_reviewed_status: boolean;
  cover_image_url?: string;
  is_professional: boolean;
  video_url?: string;
  podcast_url?: string;
  content_markdown?: string;
}

export default async function BlogListing() {
  const supabase = await createClient();
  
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title_en, summary_bullets, category, reading_time_minutes, peer_reviewed_status, cover_image_url, is_professional, video_url, podcast_url, content_markdown")
    .eq("status", "published")
    .order("created_at", { ascending: false }) as { data: Post[] | null };

  return <BlogClient initialPosts={posts || []} />;
}
