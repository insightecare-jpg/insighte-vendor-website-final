"use client";

import React from "react";
import { AudioPlayer } from "./AudioPlayer";
import { KeyTakeaways } from "./KeyTakeaways";
import { RelatedArticles } from "./RelatedArticles";

interface ArticleSidebarProps {
  post: any;
  relatedPosts: any[];
}

export function ArticleSidebar({ post, relatedPosts }: ArticleSidebarProps) {
  return (
    <aside className="sticky top-40 space-y-10">
      {/* Audio Section */}
      {(post.audio_url || post.podcast_embed_url) && (
        <div className="space-y-4">
          {post.audio_url ? (
            <AudioPlayer url={post.audio_url} title={post.title_en} />
          ) : (
            <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/20">
               <iframe 
                src={post.podcast_embed_url} 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy" 
              />
            </div>
          )}
        </div>
      )}

      {/* Key Takeaways */}
      {post.key_takeaways && post.key_takeaways.length > 0 && (
        <KeyTakeaways takeaways={post.key_takeaways} />
      )}

      {/* Related Content */}
      {relatedPosts.length > 0 && (
        <RelatedArticles posts={relatedPosts} />
      )}
    </aside>
  );
}
