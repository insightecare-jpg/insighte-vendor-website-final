"use client";

import React from "react";
import { Sparkles, Clock, Calendar } from "lucide-react";

interface ArticleHeroProps {
  post: any;
}

export function ArticleHero({ post }: ArticleHeroProps) {
  const isVideo = post.content_type === 'video';
  const isPodcast = post.content_type === 'podcast';

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
    }
    return null;
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-[#BACCB3]">
          <Sparkles size={10} /> {post.category || 'Expert Wisdom'}
        </div>
        
        <h1 
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          className="text-[clamp(1.75rem,5vw,2.75rem)] md:text-[clamp(2rem,5vw,3rem)] leading-[1.1] tracking-tight text-white uppercase italic"
        >
          {post.title_en}
        </h1>

        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-white/5">
                <img 
                  src={post.author_avatar_url || `https://i.pravatar.cc/100?u=${post.id}`} 
                  alt={post.author_name} 
                  className="w-full h-full object-cover"
                />
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
               {post.author_name || 'Educator Wisdom'}
             </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 tabular-nums">
             <div className="flex items-center gap-1.5">
               <Clock size={12} className="text-[#BACCB3]" /> {post.reading_time_minutes} MIN {isPodcast ? 'LISTEN' : 'READ'}
             </div>
             <div className="flex items-center gap-1.5">
               <Calendar size={12} className="text-[#BACCB3]" /> {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}
             </div>
          </div>
        </div>
      </div>

      {/* Hero Media */}
      <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-3xl bg-black/20 overflow-hidden">
        {isVideo && post.video_url ? (
          <div className="aspect-video w-full">
            <iframe 
              src={getEmbedUrl(post.video_url) as string} 
              className="w-full h-full" 
              allowFullScreen 
            />
          </div>
        ) : (
          <div className="aspect-[16/9] md:aspect-[21/9] w-full relative">
            <img 
              src={post.cover_image_url || `https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2800&auto=format&fit=crop`} 
              alt={post.title_en} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
