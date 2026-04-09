"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, Filter, Zap, Share2, Globe, Send, Link as LinkIcon, ChevronDown, Sparkles, Video, Play, Headphones, BookOpen, CheckCircle2, Star, Rocket, Brain, Palette, Music } from "lucide-react";
import { WisdomFilter } from "./components/WisdomFilter";
import { CinematicHero } from "./components/netflix-style/CinematicHero";
import { ContentRail } from "./components/netflix-style/ContentRail";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  content_type?: "video" | "audio" | "article";
  video_url?: string;
  podcast_url?: string;
}

export default function BlogClient({ initialPosts }: { initialPosts: Post[] }) {
  const [view, setView] = useState<"all" | "parents" | "professionals">("all");
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<"all" | "video" | "audio" | "article">("all");
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Enhancing posts with metadata for Netflix feel
  const enrichedPosts = useMemo(() => {
    return (initialPosts || []).map((p) => {
      let type: "video" | "audio" | "article" = "article";
      if (p.video_url) type = "video";
      else if (p.podcast_url) type = "audio";
      
      return {
        ...p,
        content_type: type
      };
    });
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    let results = enrichedPosts;

    if (query) {
      results = results.filter(p => 
        p.title_en.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (view === "parents") {
      results = results.filter(p => !p.is_professional);
    } else if (view === "professionals") {
      results = results.filter(p => p.is_professional);
    }

    if (format !== "all") {
      results = results.filter(p => p.content_type === format);
    }

    return results;
  }, [enrichedPosts, view, query, format]);

  // Catalog segments for Netflix feel
  const editorialPicks = filteredPosts.slice(0, 6);
  const trendingLessons = filteredPosts.slice(3, 9);
  const clinicalSeries = filteredPosts.filter(p => p.is_professional).slice(0, 6);
  const parentResources = filteredPosts.filter(p => !p.is_professional).slice(0, 6);

  // Magazine Cover Content mapping
  const coverMetadata = {
    all: {
      title: "Mastering",
      titleAccent: "Independence",
      subtitle: "Learn the clinical secrets of neuro-affirming care and child potential from the world's leading specialists.",
      image: "/images/blog/wisdom_hub_playful_hero_bg_v2_1775501953564.png",
      issue: "SPRING CATALOG",
      date: "2026 EDITION",
    },
    parents: {
      title: "The Parent",
      titleAccent: "Sanctuary",
      subtitle: "Cinematic lessons on navigating milestones, advocacy, and nurturing sensory-rich environments.",
      image: "/images/blog/parent_resources_cover_v2_1775501689599.png",
      issue: "PARENTING MASTERCLASS",
      date: "VOL. 2",
    },
    professionals: {
      title: "Clinical",
      titleAccent: "Pro-Series",
      subtitle: "Advanced executive coaching and high-fidelity research synchronized for outcome-based care.",
      image: "/images/blog/professional_research_cover_v2_1775501714036.png",
      issue: "PROFESSIONAL CATALOG",
      date: "Q2 2026",
    }
  }[view];

  const topics = [
    { title: "Neuroscience", count: 12, slug: "neuroscience" },
    { title: "Special Ed", count: 8, slug: "special-education" },
    { title: "Therapies", count: 15, slug: "therapies" }
  ];

  return (
    <div className="min-h-screen bg-[#0A0B1A] text-[#e1e0fa] font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main>
        {/* CINEMATIC HERO SECTION */}
        <CinematicHero 
          view={view} 
          coverMetadata={coverMetadata} 
          topics={topics}
          isShareOpen={isShareOpen}
          setIsShareOpen={setIsShareOpen}
        />

        <div className="max-w-7xl mx-auto px-6 relative -mt-32 z-20 space-y-32 pb-60">
          {/* SEARCH & FILTER OVERLAY */}
          <div className="flex flex-col gap-10 p-10 bg-[#16172B]/60 backdrop-blur-[80px] rounded-[64px] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group/filter">
             {/* Playful background blobs for header */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#4FD1C5]/5 blur-[80px] -mr-20 -mt-20 group-hover/filter:bg-[#4FD1C5]/10 transition-all duration-1000" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6B6B]/5 blur-[80px] -ml-20 -mb-20 group-hover/filter:bg-[#FF6B6B]/10 transition-all duration-1000" />
             
             <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
                <div className="relative w-full md:w-[500px] h-20 group">
                  <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-500 w-6 h-6 transition-colors group-focus-within:text-white" />
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Explore the Wisdom Library..." 
                    className="w-full h-full bg-white/5 rounded-full pl-22 pr-8 text-sm font-black uppercase tracking-widest border border-white/5 outline-none focus:ring-8 focus:ring-white/5 transition-all placeholder:text-zinc-600"
                  />
                </div>
                
                <WisdomFilter currentView={view} onViewChange={setView} />
             </div>

             <div className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-white/5">
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Mode of Insight:</span>
                   <div className="flex gap-2">
                      {[
                        { id: 'all', icon: Sparkles, label: 'Everything' },
                        { id: 'video', icon: Play, label: 'Watch' },
                        { id: 'audio', icon: Headphones, label: 'Hear' },
                        { id: 'article', icon: BookOpen, label: 'Read' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setFormat(m.id as any)}
                          className={cn(
                            "h-12 px-6 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all",
                            format === m.id ? "bg-white text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
                          )}
                        >
                           <m.icon size={14} />
                           {m.label}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="hidden lg:flex items-center gap-8">
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">{filteredPosts.length}</span>
                      <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">Curation Count</span>
                   </div>
                   <div className="h-8 w-px bg-white/10" />
                   <div className="flex -space-x-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-[#16172B] bg-zinc-800 overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?u=${i + 20}`} alt="User" />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* CONTENT RAILS */}
          {filteredPosts.length > 0 ? (
            <div className="space-y-4 md:space-y-0">
               {/* Editorial Picks */}
               <ContentRail 
                 title="Editorial Picks" 
                 subtitle="Our specialists curate the most impactful clinical research for immediate home application."
                 posts={editorialPicks}
                 accentColor="#4FD1C5"
               />

               {/* Research Ticker */}
               <div className="py-20 border-y border-white/5 overflow-hidden">
                  <div className="flex items-center gap-20 animate-scroll-rtl opacity-30">
                     {Array.from({ length: 8 }).map((_, i) => (
                       <div key={i} className="flex items-center gap-8 whitespace-nowrap">
                          <CheckCircle2 size={12} className="text-[#BACCB3]" />
                          <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white">
                            {['ADHD SYNCHRONICITY', 'MULTI-SENSORY PATHWAYS', 'NEURO-AFFIRMATIVE AI'][i % 3]} — CERTIFIED CLINICAL DATA
                          </span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Trending Rows */}
               <ContentRail 
                 title="Trending Narratives" 
                 subtitle="The lessons and research shaping neuro-diverse conversations globally."
                 posts={trendingLessons}
                 accentColor="#D3C4B5"
               />

               {/* Specific Catalogs */}
               {view !== 'parents' && (
                 <ContentRail 
                   title="Clinical Master Series" 
                   subtitle="High-density professional tracks for caregivers and health workers."
                   posts={clinicalSeries}
                   accentColor="#FF6B6B"
                 />
               )}

               {view !== 'professionals' && (
                 <ContentRail 
                   title="Parental Navigation" 
                   subtitle="Practical steps for family growth, sensory sanctuary, and joyful advocacy."
                   posts={parentResources}
                   accentColor="#BACCB3"
                 />
               )}
            </div>
          ) : (
            <div className="py-40 text-center space-y-8">
               <div className="h-48 w-48 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mx-auto animate-pulse">
                  <Filter className="h-20 w-20 text-white/20" />
               </div>
               <div className="space-y-4">
                 <h3 className="text-4xl font-manrope font-bold text-white uppercase italic tracking-tighter">Catalog Entry Not Found</h3>
                 <p className="text-zinc-500 font-medium italic">Adjust your filters to discover more clinical wisdom.</p>
               </div>
               <button 
                 onClick={() => { setQuery(""); setView("all"); }}
                 className="h-14 px-10 bg-white text-black uppercase font-black tracking-widest text-xs rounded-full hover:bg-[#D3C4B5] transition-all"
               >
                 Refresh Catalog
               </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes scroll-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-rtl {
          display: flex;
          animation: scroll-rtl 60s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
