"use client";

import React, { useEffect } from "react";
import { ArticleLayout } from "../_components/article/ArticleLayout";
import { ArticleHero } from "../_components/article/ArticleHero";
import { ArticleBody } from "../_components/article/ArticleBody";
import { ArticleFooter } from "../_components/article/ArticleFooter";
import { ArticleSidebar } from "../_components/article/ArticleSidebar";

interface BlogPostClientProps {
  post: any;
  relatedPosts?: any[];
}

export default function BlogPostClient({ post, relatedPosts = [] }: BlogPostClientProps) {
  // View tracking
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch("/api/blog/view", {
          method: "POST",
          body: JSON.stringify({ post_id: post.id }),
          headers: { "Content-Type": "application/json" }
        });
      } catch (e) {
        // Silent error for analytics tracking
      }
    };
    trackView();
  }, [post.id]);

  return (
    <ArticleLayout 
      post={post} 
      relatedPosts={relatedPosts}
      hero={<ArticleHero post={post} />}
      sidebar={<ArticleSidebar post={post} relatedPosts={relatedPosts} />}
    >
      <div className="space-y-20">
        <ArticleBody content={post.content_markdown || ""} />
        <ArticleFooter article={post} />
      </div>
    </ArticleLayout>
  );
}
