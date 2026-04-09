"use client";

import React from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Play, Share2, Globe, Send, MessageCircle, Link as LinkIcon, Sparkles, ChevronRight, CheckCircle2, Star, Tent, Rocket, Brain, Music, Video, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CinematicHeroProps {
  view: "all" | "parents" | "professionals";
  coverMetadata: any;
  topics: any[];
  isShareOpen: boolean;
  setIsShareOpen: (open: boolean) => void;
}

const FloatingProp = ({ icon: Icon, delay = 0, className = "" }: { icon: any, delay?: number, className?: string }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ 
      y: [0, -20, 0],
      opacity: [0.2, 0.5, 0.2],
      rotate: [0, 10, -10, 0]
    }}
    transition={{ 
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay },
      rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className={cn("absolute z-10 text-white/20 select-none pointer-events-none", className)}
  >
    <Icon size={48} strokeWidth={1} />
  </motion.div>
);

export function CinematicHero({ view, coverMetadata, topics, isShareOpen, setIsShareOpen }: CinematicHeroProps) {
  return (
    <section className="relative h-[95vh] w-full overflow-hidden flex items-end p-8 lg:p-20 group">
      {/* Background Cinematic layer */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={view}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0 bg-[#0A0B1A]"
        >
          {/* Playful Floating Elements */}
          <FloatingProp icon={Brain} className="top-1/4 left-[10%] " delay={0} />
          <FloatingProp icon={Rocket} className="top-1/3 right-[15%]" delay={1.5} />
          <FloatingProp icon={Star} className="bottom-1/4 left-[20%]" delay={0.5} />
          <FloatingProp icon={Palette} className="bottom-1/3 right-[10%]" delay={2} />
          <FloatingProp icon={Music} className="top-[15%] left-[40%]" delay={1} />

          <img 
            src={coverMetadata.image} 
            className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-[0%] group-hover:scale-105 transition-all duration-[3000ms] opacity-50"
            alt="Hero Background"
          />
          {/* Multi-layered gradients for cinematic feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B1A] via-[#0A0B1A]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B1A] via-transparent to-transparent" />
          
          {/* Playful Grain/Noise Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
      </AnimatePresence>

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-start gap-12">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-6"
        >
           <div className="flex items-center gap-3">
              <div className="h-10 px-5 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#D3C4B5] transition-all cursor-pointer">
                 <Play size={14} fill="currentColor" /> Watch Trailer
              </div>
              <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                 <CheckCircle2 size={16} />
              </div>
           </div>
           <div className="h-px w-20 bg-white/20 hidden md:block" />
           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">{coverMetadata.issue} — {coverMetadata.date}</span>
        </motion.div>

        <motion.div
           key={`${view}-title`}
           initial={{ y: 40, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="space-y-6"
        >
           <h1 className="text-[10vw] lg:text-[8rem] font-sans font-extrabold tracking-tighter leading-[0.85] uppercase italic text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] selection:bg-[#8b7ff0] selection:text-white">
              {coverMetadata.title}<br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.6)' }}>
                {coverMetadata.titleAccent}
              </span>
           </h1>
           <p className="text-xl md:text-4xl font-manrope font-light text-white/90 max-w-4xl italic leading-[1.1] tracking-tight">
              {coverMetadata.subtitle}
           </p>
        </motion.div>

        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.8 }}
           className="flex flex-wrap gap-12 border-t border-white/10 pt-10"
        >
           <div className="flex flex-col gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D3C4B5]">Current Edition Highlights</span>
              <div className="flex gap-10">
                 {topics.map((topic, idx) => (
                   <Link key={topic.slug} href={`#${topic.slug}`} className="group flex items-center gap-4">
                      <span className="text-3xl font-sans font-black italic text-white/10 group-hover:text-white/40 transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                      <div className="flex flex-col">
                         <span className="text-xs font-black uppercase tracking-widest text-white group-hover:text-[#D3C4B5] transition-colors">{topic.title}</span>
                         <span className="text-[9px] font-bold text-white/30">{topic.count} Lessons</span>
                      </div>
                   </Link>
                 ))}
              </div>
           </div>
        </motion.div>
      </div>

      {/* Sharing Dock (Netflix Style Bottom Right) */}
      <div className="absolute right-12 bottom-12 z-50 flex items-center gap-6">
         <div className="flex flex-col items-end gap-2 pr-6 border-r border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Share Insight</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/30 italic">Propagate clinical wisdom</span>
         </div>
         
         <div className="relative group/share">
            <button 
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="w-16 h-16 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all shadow-2xl relative z-10"
            >
               <Share2 size={24} className={cn("transition-transform", isShareOpen && "rotate-45")} />
            </button>

            <AnimatePresence>
               {isShareOpen && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20, scale: 0.8 }}
                   animate={{ opacity: 1, y: -20, scale: 1 }}
                   exit={{ opacity: 0, y: 20, scale: 0.8 }}
                   className="absolute bottom-full right-0 mb-8 p-4 bg-white/10 backdrop-blur-[60px] rounded-[40px] border border-white/20 flex flex-col gap-3 shadow-[0_40px_100px_rgba(0,0,0,0.8)] min-w-[220px]"
                 >
                    {[
                      { icon: MessageCircle, label: 'WhatsApp', color: '#25D366', action: 'whatsapp' },
                      { icon: Globe, label: 'LinkedIn', color: '#0077B5', action: 'linkedin' },
                      { icon: Send, label: 'X (Twitter)', color: '#000000', action: 'twitter' },
                    ].map((item, id) => (
                      <button 
                        key={id}
                        onClick={() => {
                           const url = typeof window !== 'undefined' ? window.location.href : '';
                           const text = `Expert Masterclass: ${coverMetadata.title} from Insighte Wisdom Hub`;
                           if (item.action === 'whatsapp') window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, '_blank');
                           if (item.action === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                           if (item.action === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                           setIsShareOpen(false);
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-[24px] hover:bg-white hover:text-black transition-all group/btn"
                      >
                         <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover/btn:bg-zinc-100 group-hover/btn:border-transparent transition-all">
                            <item.icon size={18} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </button>
                    ))}
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </section>
  );
}
