import React from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogPostClient from "../components/BlogPostClient";

export const dynamic = "force-dynamic";

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;
  
  const supabase = await createClient();
  
  let { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) {
    // Fallback to local high-fidelity content if DB fetch fails (resilience against seeding issues)
    const localBlogs: any[] = [
      {
        "id": "big-emotions",
        "title_en": "When Big Emotions Arise: Managing Triggers",
        "slug": "big-emotions-managing-triggers",
        "category": "Educator Insights",
        "summary_bullets": [
          "Mapping sensory triggers by age",
          "The 15-minute co-regulation rule",
          "Sensory-first classroom design"
        ],
        "content_markdown": "# Navigating the Emotional Storm\n\nEvery child experiences big emotions, but when children learn to recognise and manage their emotional triggers, they gain a powerful sense of control.\n\n## Understanding the 'Why'\n\nBefore we can manage a trigger, we must understand its source. For many neurodiverse children, what looks like a 'meltdown' is actually a sensory overload or a communication breakdown.\n\n### The 15-Minute Rule\n\nWhen a child is in the midst of a big emotion, their logical brain is offline. Co-regulation—staying calm yourself to help them calm down—is the priority. Wait at least 15 minutes after the dust has settled before trying to 'talk' about what happened.\n\n> Clinical Dose: Co-regulation is not just about stopping the behavior; it is about building the neurological bridge between dysregulation and safety.",
        "status": "published",
        "content_type": "podcast",
        "reading_time_minutes": 6,
        "cover_image_url": "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=2940&auto=format&fit=crop",
        "created_at": new Date().toISOString(),
        "key_takeaways": [
          "Wait 15 minutes before talking after a big emotion",
          "Co-regulation builds the neurological bridge to safety",
          "Map sensory triggers by age for better intervention"
        ],
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "author_name": "Insighte Expert"
      },
      {
        "id": "social-cues",
        "title_en": "A Neuroaffirmative Method: Social Cues Without Masking",
        "slug": "social-cues-without-masking",
        "category": "Parent Sanctuary",
        "summary_bullets": [
          "Emotional literacy vs. scripts",
          "Justification-based learning",
          "Advocating against 'masking' exhaustion"
        ],
        "content_markdown": "# Authenticity is the Goal\n\nUnderstanding social cues requires a nuanced, affirming approach. For too long, 'social skills' meant teaching children to hide their true selves to make others comfortable.\n\n## The Neuroaffirmative Shift\n\nWe focus on **Emotional Literacy**. Instead of 'Look me in the eye,' we ask, 'How do you feel when you're overwhelmed?'",
        "status": "published",
        "content_type": "video",
        "video_url": "https://www.youtube.com/watch?v=RIsV65JkHms",
        "reading_time_minutes": 7,
        "cover_image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop",
        "created_at": new Date().toISOString(),
        "author_name": "Insighte Expert"
      }
    ];

    const fallbackPost = localBlogs.find(b => b.slug === slug);
    if (!fallbackPost) notFound();
    post = fallbackPost;
  }

  // Fetch related posts (same category)
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("id, slug, title_en, cover_image_url, reading_time_minutes")
    .eq("category", post.category)
    .neq("id", post.id)
    .eq("status", "published")
    .limit(3);

  return <BlogPostClient post={post} relatedPosts={relatedPosts || []} />;
}
