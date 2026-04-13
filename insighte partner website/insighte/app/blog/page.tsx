import React from "react";
import { createClient } from "@/lib/supabase/server";
import BlogClient from "./BlogClient";

export const dynamic = "force-dynamic";

export interface Post {
  id: string;
  slug: string;
  title_en: string;
  excerpt?: string;
  summary_bullets: string[];
  category: string;
  reading_time_minutes: number;
  peer_reviewed_status: boolean;
  cover_image_url?: string;
  is_professional: boolean;
  content_type: 'article' | 'video' | 'podcast';
  audience: 'entire_hub' | 'parent_sanctuary' | 'clinical_pro';
  video_url?: string;
  podcast_url?: string;
  is_featured: boolean;
  author_name?: string;
  author_avatar_url?: string;
  published_at: string;
  // New editorial fields
  key_takeaways?: string[];
  audio_url?: string;
  audio_duration_seconds?: number;
  podcast_embed_url?: string;
  topic_tags?: string[];
  whatsapp_share_text?: string;
  author_bio?: string;
  content_markdown?: string;
}

export default async function BlogListing() {
  const supabase = await createClient();
  
  const { data: posts } = await supabase
    .from("blog_posts")
    .select(`
      id, slug, title_en, excerpt, summary_bullets, category, 
      reading_time_minutes, peer_reviewed_status, cover_image_url, 
      is_professional, content_type, audience, video_url, 
      podcast_url, is_featured, author_name, author_avatar_url, published_at,
      key_takeaways, audio_url, audio_duration_seconds, podcast_embed_url,
      topic_tags, whatsapp_share_text, author_bio, content_markdown
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#0a0b1c]">
      <BlogClient initialPosts={(posts as Post[]) || []} />
    </div>
  );
}
