"use client";

import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

interface RelatedPost {
  title_en: string;
  slug: string;
  cover_image_url?: string;
  reading_time_minutes: number;
}

interface RelatedArticlesProps {
  posts: RelatedPost[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Keep Reading</span>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group flex gap-4 items-start"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
              <img 
                src={post.cover_image_url || "/api/placeholder/48/48"} 
                alt={post.title_en}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="space-y-1.5 min-w-0">
              <h4 className="text-xs font-bold leading-tight text-white group-hover:text-accent transition-colors line-clamp-2 uppercase italic tracking-tight">
                {post.title_en}
              </h4>
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <Clock size={10} /> {post.reading_time_minutes} MIN READ
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
