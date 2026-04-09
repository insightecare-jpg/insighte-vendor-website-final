"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Play, CheckCircle2, BookmarkPlus, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  slug: string;
  title_en: string;
  category: string;
  reading_time_minutes: number;
  peer_reviewed_status: boolean;
  cover_image_url?: string;
  is_professional: boolean;
}

export function ArticleCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col bg-[#191a2d]/40 rounded-[48px] p-8 space-y-8 border border-white/5 hover:translate-y-[-8px] transition-all duration-700 hover:bg-[#27283c] shadow-xl relative overflow-hidden">
      {/* Visual Header */}
      <div className="aspect-[16/10] rounded-[32px] overflow-hidden border border-white/5 relative">
        <img 
          src={post.cover_image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop"} 
          alt={post.title_en} 
          className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
        />
        
        {/* Floating Utilities */}
        <div className="absolute top-6 left-6 flex gap-2">
           {post.peer_reviewed_status && (
             <div className="h-8 px-4 rounded-full bg-[#BACCB3]/20 text-[#BACCB3] border border-[#BACCB3]/30 backdrop-blur-md text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={10} /> Certified Insight
             </div>
           )}
        </div>

        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0">
           <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-[#D3C4B5] hover:text-[#382F24] transition-all">
             <BookmarkPlus size={16} />
           </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#111224]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all pointer-events-none">
           <div className="h-12 w-12 rounded-full bg-[#D3C4B5] text-[#382F24] flex items-center justify-center shadow-2xl">
              <Play size={18} className="ml-1" />
           </div>
        </div>
      </div>
      
      {/* Content Flow */}
      <div className="space-y-6 flex-grow">
        <div className="flex items-center justify-between">
          <div className="px-5 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-[#BACCB3] opacity-80 group-hover:opacity-100 transition-all group-hover:border-[#BACCB3]/20">
            {post.category}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-colors">
            <Clock size={12} /> {post.reading_time_minutes} MINS
          </div>
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-2xl font-manrope font-extrabold tracking-tighter text-[#f0e0d0] group-hover:text-white transition-colors line-clamp-2 uppercase italic leading-tight decoration-[#D3C4B5]/0 group-hover:decoration-[#D3C4B5]/40 underline underline-offset-8 decoration-2 duration-500">
            {post.title_en}
          </h3>
        </Link>
      </div>

      {/* Footer Interface */}
      <div className="pt-8 border-t border-white/5 flex items-center justify-between">
        <Link 
          href={`/blog/${post.slug}`}
          className="text-[#D3C4B5] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group/btn"
        >
          Access Protocol <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-2 transition-transform" />
        </Link>

        <button className="text-zinc-600 hover:text-[#D3C4B5] transition-colors">
           <Share2 size={16} />
        </button>
      </div>
    </article>
  );
}

export function ArticleSchema({ post }: { post: Post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title_en,
    "image": [
      post.cover_image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop"
    ],
    "datePublished": new Date().toISOString(),
    "author": [{
        "@type": "Organization",
        "name": "Insighte Wisdom Hub",
        "url": "https://insighte.ac"
    }]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
