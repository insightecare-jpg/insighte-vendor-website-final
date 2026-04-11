"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Headphones, BookOpen, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Post {
  id: string;
  slug: string;
  title_en: string;
  category: string;
  reading_time_minutes: number;
  cover_image_url?: string;
  content_type?: "video" | "audio" | "article";
}

interface ContentRailProps {
  title: string;
  subtitle?: string;
  posts: Post[];
  accentColor?: string;
}

export function ContentRail({ title, subtitle, posts, accentColor = "#D3C4B5" }: ContentRailProps) {
  return (
    <section className="py-16 space-y-8 overflow-hidden">
      <div className="flex items-end justify-between px-4 md:px-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-8 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Insighte Originals</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tighter uppercase italic text-white flex items-center gap-4">
            {title}
            <ChevronRight className="w-8 h-8 opacity-20" />
          </h2>
          {subtitle && (
            <p className="text-sm font-medium text-zinc-500 max-w-xl italic">{subtitle}</p>
          )}
        </div>
        
        <Link href={`#${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
          View All
        </Link>
      </div>

      <div className="relative group">
        <div className="flex gap-6 overflow-x-auto pb-12 pt-4 px-4 md:px-0 no-scrollbar snap-x scroll-smooth">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex-none w-[320px] md:w-[450px] snap-start"
            >
              <Link href={`/blog/${post.slug}`} className="block group/card relative aspect-video rounded-[32px] overflow-hidden border border-white/5 bg-[#191a2d]">
                <img 
                  src={post.cover_image_url && post.cover_image_url.startsWith('http') ? post.cover_image_url : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop"} 
                  className="w-full h-full object-cover transition-all duration-700 grayscale-[40%] group-hover/card:grayscale-0 group-hover/card:scale-110 opacity-60 group-hover/card:opacity-100"
                  alt={post.title_en}
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent group-hover/card:opacity-40 transition-opacity" />

                {/* Content Type Badge */}
                <div className="absolute top-6 left-6 z-10">
                   <div className="h-10 px-5 rounded-full bg-black/60 backdrop-blur-3xl border border-white/10 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-[#D3C4B5] group-hover/card:bg-[#D3C4B5] group-hover/card:text-[#111224] transition-all">
                      {post.content_type === 'video' ? <Play size={14} fill="currentColor" /> : post.content_type === 'audio' ? <Headphones size={14} /> : <BookOpen size={14} />}
                      {post.content_type || 'Article'}
                   </div>
                </div>

                {/* Info Block */}
                <div className="absolute bottom-6 left-6 right-6 z-10 space-y-3">
                  <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-white/40">
                     <span>{post.category}</span>
                     <div className="w-1 h-1 rounded-full bg-zinc-700" />
                     <span>{post.reading_time_minutes} Mins</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-manrope font-extrabold text-white leading-tight uppercase italic group-hover/card:text-[#D3C4B5] transition-colors line-clamp-1">
                    {post.title_en}
                  </h3>
                </div>

                {/* Cinematic Hover Reveal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all scale-95 group-hover/card:scale-100">
                   <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                      <Play size={20} className="ml-1" fill="currentColor" />
                   </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
