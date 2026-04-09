"use client";

import React from "react";
import Link from "next/link";
import { Clock, CheckCircle2, Headphones, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  slug: string;
  title_en: string;
  summary_bullets: string[];
  category: string;
  reading_time_minutes: number;
  peer_reviewed_status: boolean;
  cover_image_url?: string;
  is_professional: boolean;
}

export function BentoGrid({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 grid-rows-2 gap-6 h-auto lg:h-[800px] mb-24 animate-fade-in-up">
      {/* Featured / Largest Item */}
      <div className="lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-[48px] border border-white/5 bg-[#191a2d]">
        <Link href={`/blog/${posts[0]?.slug}`} className="block h-full group">
          <img 
            src={posts[0]?.cover_image_url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop"} 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
            alt={posts[0]?.title_en}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111224] via-transparent to-transparent"></div>
          <div className="absolute bottom-0 p-12 space-y-6">
            <div className="flex gap-3">
              {posts[0]?.peer_reviewed_status && (
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BACCB3]/20 border border-[#BACCB3]/30 text-[#BACCB3] text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                   <CheckCircle2 size={10} /> Clinical Gold Standard
                </div>
              )}
              <div className="px-4 py-1.5 rounded-full bg-white/5 text-white/50 text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                 {posts[0]?.category}
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl font-manrope font-extrabold tracking-tighter text-white leading-tight uppercase italic group-hover:text-[#D3C4B5] transition-colors">
              {posts[0]?.title_en}
            </h2>
            <div className="flex items-center gap-6 text-[#C8C5CD] text-[10px] font-black uppercase tracking-widest opacity-60">
               <div className="flex items-center gap-2"> <Clock size={12} /> {posts[0]?.reading_time_minutes} MIN READ</div>
               <div className="flex items-center gap-2"> <Headphones size={12} /> AUDIO DOSE READY</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Item 2 */}
      <div className="lg:col-span-2 lg:row-span-1 relative group overflow-hidden rounded-[48px] border border-white/5 bg-[#1D1E31]/40 hover:bg-[#1D1E31] transition-all p-10 flex flex-col justify-between">
        <Link href={`/blog/${posts[1]?.slug}`} className="space-y-6">
           <div className="flex justify-between items-start">
             <div className="px-4 py-1.5 rounded-full bg-[#C8C4DB]/10 text-[#C8C4DB] text-[9px] font-black uppercase tracking-widest transition-colors">
                 {posts[1]?.category}
             </div>
             <ArrowUpRight className="text-[#C8C4DB] group-hover:translate-x-2 transition-transform" size={24} />
           </div>
           <h3 className="text-3xl font-manrope font-bold text-white uppercase italic leading-tight">{posts[1]?.title_en}</h3>
           <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
             <Clock size={12} /> {posts[1]?.reading_time_minutes} MIN READ
           </div>
        </Link>
      </div>

      {/* Item 3 */}
      <div className="lg:col-span-1 lg:row-span-1 overflow-hidden transition-all rounded-[48px] border border-white/5 bg-[#24253B] p-10 group relative">
       <Link href={`/blog/${posts[2]?.slug}`} className="h-full flex flex-col justify-between">
          <div className="w-12 h-12 rounded-2xl bg-[#D3C4B5]/10 flex items-center justify-center text-[#D3C4B5] transition-transform group-hover:scale-110">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-xl font-manrope font-extrabold text-white uppercase italic mt-8 leading-tight">{posts[2]?.title_en}</h4>
          <div className="mt-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Research Note</div>
       </Link>
      </div>

      {/* Item 4 - High Density Interaction */}
      <div className="lg:col-span-1 lg:row-span-1 overflow-hidden transition-all rounded-[48px] border-2 border-dashed border-[#BACCB3]/20 hover:border-[#BACCB3]/50 p-10 group flex flex-col justify-center items-center text-center space-y-4">
          <div className="text-[#BACCB3] font-black text-[9px] uppercase tracking-[0.3em]">Direct Connection</div>
          <p className="text-sm italic font-medium text-zinc-500 leading-relaxed">
            Every clinical post includes an AI Summarizer for busy parents.
          </p>
          <div className="h-10 px-6 rounded-full bg-[#BACCB3]/10 text-[#BACCB3] text-[10px] font-black uppercase tracking-widest flex items-center justify-center">
            Zero Barriers
          </div>
      </div>
    </section>
  );
}
