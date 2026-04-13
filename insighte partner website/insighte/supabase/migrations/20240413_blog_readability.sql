-- Add editorial and engagement columns to blog_posts
-- Created: 2024-04-13 for Blog Readability & UX Rebuild

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS key_takeaways text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS audio_url text,
  ADD COLUMN IF NOT EXISTS audio_duration_seconds int,
  ADD COLUMN IF NOT EXISTS podcast_embed_url text,
  ADD COLUMN IF NOT EXISTS topic_tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS whatsapp_share_text text,
  ADD COLUMN IF NOT EXISTS author_bio text,
  ADD COLUMN IF NOT EXISTS author_avatar_url text,
  ADD COLUMN IF NOT EXISTS audience text DEFAULT 'entire_hub'
    CHECK (audience IN ('entire_hub','parent_sanctuary','clinical_pro'));

-- Engagement Tracking
CREATE TABLE IF NOT EXISTS public.blog_post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  user_agent text,
  referrer text
);

-- Index for fast view counting
CREATE INDEX IF NOT EXISTS idx_blog_views_post 
  ON public.blog_post_views(post_id, viewed_at DESC);

-- RLS for view tracking
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert view records" ON public.blog_post_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can count views" ON public.blog_post_views FOR SELECT USING (true);
