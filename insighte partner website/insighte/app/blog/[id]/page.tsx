import React from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogPostClient from "../components/BlogPostClient";

export const dynamic = "force-dynamic";

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.id;
  
  const supabase = await createClient();
  
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*, author:providers(*)")
    .eq("slug", slug)
    .single();

  if (!post) {
    notFound();
  }

  // Inject metadata into post for use in client
  const enrichedPost = {
    ...post,
    // Add any server-side logic here if needed
  };

  return <BlogPostClient post={enrichedPost} />;
}
