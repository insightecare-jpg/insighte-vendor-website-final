"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Zap, Share2, Globe, Send, Link as LinkIcon, ChevronDown, Sparkles, Video, Play, Headphones, BookOpen, CheckCircle2, Star, Rocket, Brain, Palette, Music, Clock, Waves, ArrowRight as LucideArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopicFilter } from "./_components/listing/TopicFilter";

interface Post {
  id: string;
  slug: string;
  title_en: string;
  excerpt?: string;
  summary_bullets: string[];
  category: string;
  reading_time_minutes: number;
  peer_reviewed_status: boolean;
  cover_image_url?: string;
  is_professional: boolean;
  content_type: 'article' | 'video' | 'podcast';
  audience: 'entire_hub' | 'parent_sanctuary' | 'clinical_pro';
  video_url?: string;
  podcast_url?: string;
  is_featured: boolean;
  author_name?: string;
  author_avatar_url?: string;
  published_at: string;
  topic_tags?: string[];
  podcast_embed_url?: string;
}
export default function BlogClient({ initialPosts }: { initialPosts: Post[] }) {
  const [view, setView] = useState<"all" | "parents" | "professionals">("all");
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<"all" | "video" | "podcast" | "article">("all");
  const [activeTopic, setActiveTopic] = useState("all");
  const [visibleCount, setVisibleCount] = useState(9);

  // Enhancing posts with metadata for Netflix feel
  const enrichedPosts = useMemo(() => {
    return initialPosts || [];
  }, [initialPosts]);

  const fallbackPosts: Post[] = [
    {
      id: "fallback-1",
      title_en: "Our Inclusive Education Network: Schools Supporting Neurodiverse Learners",
      slug: "inclusive-education-network-india",
      category: "Educator Wisdom",
      excerpt: "Building a strong inclusive ecosystem where children with diverse learning profiles thrive across IB, IGCSE, and CBSE schools.",
      summary_bullets: [
        "Partnerships with 50+ leading schools",
        "Seamless shadow teacher integration",
        "Inclusion consulting for institutions"
      ],
      reading_time_minutes: 5,
      peer_reviewed_status: true,
      cover_image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2800&auto=format&fit=crop",
      is_professional: true,
      content_type: "article",
      audience: "entire_hub",
      is_featured: true,
      published_at: new Date().toISOString()
    },
    {
      id: "fallback-2",
      title_en: "A Neuroaffirmative Method: Social Cues Without Masking",
      slug: "social-cues-without-masking",
      category: "Parent Sanctuary",
      excerpt: "Understanding social cues requires a nuanced, affirming approach that honors the unique way autistic children engage with their environment.",
      summary_bullets: [
        "Emotional literacy vs. scripts",
        "Justification-based learning",
        "Advocating against 'masking' exhaustion"
      ],
      reading_time_minutes: 7,
      peer_reviewed_status: true,
      cover_image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop",
      is_professional: false,
      content_type: "video",
      video_url: "https://www.youtube.com/watch?v=RIsV65JkHms",
      audience: "parent_sanctuary",
      is_featured: true,
      published_at: new Date().toISOString()
    },
    {
      id: "fallback-3",
      title_en: "When Big Emotions Arise: Managing Triggers",
      slug: "big-emotions-managing-triggers",
      category: "Educator Insights",
      excerpt: "Every child experiences big emotions, but when children learn to recognise and manage their emotional triggers, they gain a powerful sense of control.",
      summary_bullets: [
        "Mapping sensory triggers by age",
        "The 15-minute co-regulation rule",
        "Sensory-first classroom design"
      ],
      reading_time_minutes: 6,
      peer_reviewed_status: true,
      cover_image_url: "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=2940&auto=format&fit=crop",
      is_professional: true,
      content_type: "podcast",
      audience: "entire_hub",
      is_featured: false,
      published_at: new Date().toISOString(),
      topic_tags: ["Sensory", "Regulation", "Classroom"],
      podcast_embed_url: "https://open.spotify.com/embed/episode/774W7Y8o3t0cZy9XfS1n0X"
    }
  ];

  const filteredPosts = useMemo(() => {
    const basePosts = enrichedPosts.length > 0 ? enrichedPosts : fallbackPosts;
    let results = basePosts;

    if (query) {
      results = results.filter(p => 
        p.title_en.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (view === "parents") {
      results = results.filter(p => p.audience === 'parent_sanctuary' || p.audience === 'entire_hub');
    } else if (view === "professionals") {
      results = results.filter(p => p.audience === 'clinical_pro' || p.audience === 'entire_hub');
    }

    if (format !== "all") {
      results = results.filter(p => p.content_type === format);
    }

    if (activeTopic !== "all") {
      results = results.filter(p => p.topic_tags?.includes(activeTopic) || p.category === activeTopic);
    }

    return results;
  }, [enrichedPosts, view, query, format, activeTopic]);

  const allTopics = useMemo(() => {
    const basePosts = enrichedPosts.length > 0 ? enrichedPosts : fallbackPosts;
    const tags = new Set<string>();
    basePosts.forEach(p => {
      p.topic_tags?.forEach(t => tags.add(t));
      if (p.category) tags.add(p.category);
    });
    return Array.from(tags).sort();
  }, [enrichedPosts]);

  // Catalog segments for Netflix feel
  // Catalog segments for Netflix feel - handling missing is_featured and audience columns
  const editorialPicks = filteredPosts.slice(0, 12);
  const trendingLessons = filteredPosts.some(p => (p as any).is_featured) 
    ? filteredPosts.filter(p => (p as any).is_featured).slice(0, 8)
    : filteredPosts.slice(0, 8); // Fallback to latest posts
  
  const clinicalSeries = filteredPosts.filter(p => (p as any).audience === 'clinical_pro').length > 0
    ? filteredPosts.filter(p => (p as any).audience === 'clinical_pro').slice(0, 8)
    : filteredPosts.filter(p => p.category.toLowerCase().includes('educator') || p.is_professional).slice(0, 8);

  const parentResources = filteredPosts.filter(p => (p as any).audience === 'parent_sanctuary').length > 0
    ? filteredPosts.filter(p => (p as any).audience === 'parent_sanctuary').slice(0, 8)
    : filteredPosts.filter(p => !p.is_professional).slice(0, 8);

  // Magazine Cover Content mapping
  const coverMetadata = {
    all: {
      title: "Mastering",
      titleAccent: "Independence",
      subtitle: "Learn the clinical secrets of neuro-affirming care and child potential from the world's leading specialists.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop",
      issue: "SPRING CATALOG",
      date: "2026 EDITION",
    },
    parents: {
      title: "The Parent",
      titleAccent: "Sanctuary",
      subtitle: "Cinematic lessons on navigating milestones, advocacy, and nurturing sensory-rich environments.",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2786&auto=format&fit=crop",
      issue: "PARENTING MASTERCLASS",
      date: "VOL. 2",
    },
    professionals: {
      title: "Clinical",
      titleAccent: "Pro-Series",
      subtitle: "Advanced executive coaching and high-fidelity research synchronized for outcome-based care.",
      image: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=2940&auto=format&fit=crop",
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
    <div className="min-h-screen bg-[#0A0B1A] text-[#e1e0fa] font-sans selection:bg-[#8b7ff0] selection:text-white">
      <Navbar />

      <main className="pt-32 pb-60">
        {/* ─── ENLIGHTENED HERO SECTION ───────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 mb-24 text-center space-y-8 relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-[#8b7ff015] blur-3xl" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-[#D3C4B5] mb-4">
              <Sparkles size={12} className="animate-pulse" /> The Wisdom Hub
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.85] mix-blend-plus-lighter">
              Connection <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D3C4B5] via-white to-[#BACCB3]">Before Correction.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-zinc-400 font-medium italic">
              Honest insights, educator wisdom, and parent stories designed to foster inclusion and autonomy—without the clinical jargon.
            </p>
          </motion.div>

          {/* Search & Filter Hub */}
          <div className="max-w-4xl mx-auto pt-12">
            <div className="p-8 md:p-12 rounded-[3.5rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/10 shadow-3xl space-y-10 group">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-grow group/input">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within/input:text-[#8b7ff0] transition-colors" />
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search wisdom..." 
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl pl-16 pr-8 text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-[#8b7ff0]/10 outline-none transition-all placeholder:text-zinc-700"
                  />
                </div>
                <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/5 no-scrollbar overflow-x-auto">
                  {(['all', 'article', 'video', 'podcast'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormat(t)}
                      className={cn(
                        "px-6 h-12 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        format === t ? "bg-white text-black shadow-xl" : "text-zinc-500 hover:text-zinc-300"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {(['all', 'parents', 'professionals'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => { setView(v); setActiveTopic("all"); }}
                      className={cn(
                        "px-8 h-12 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                        view === v 
                          ? "bg-[#D3C4B5]/10 border-[#D3C4B5] text-[#D3C4B5]" 
                          : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                      )}
                    >
                      {v === 'all' ? 'Entire Hub' : v === 'parents' ? 'Parent Sanctuary' : 'Educator Insights'}
                    </button>
                  ))}
                </div>

                <TopicFilter 
                  topics={allTopics} 
                  activeTopic={activeTopic} 
                  onTopicChange={setActiveTopic} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── BLOG FEED ──────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6">
          {filteredPosts.length > 0 ? (
            <div className="space-y-16 text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {filteredPosts.slice(0, visibleCount).map((post, idx) => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className="group relative flex flex-col h-full rounded-[3rem] bg-zinc-900/30 border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#8b7ff0]/30 hover:bg-[#8b7ff005]"
                  >
                    {/* Image Header */}
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={(post.cover_image_url && post.cover_image_url.trim() !== "") ? post.cover_image_url : `https://images.unsplash.com/photo-${idx % 2 === 0 ? '1503454537195-1dcabb73ffb9' : '1503676260728-1c00da094a0b'}?q=80&w=2800&auto=format&fit=crop`} 
                        alt={post.title_en}
                        className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                      
                      {/* Podcast Overlay */}
                      {post.content_type === 'podcast' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-[#D3C4B5]">
                            <Waves size={32} strokeWidth={1} className="animate-pulse" />
                          </div>
                        </div>
                      )}

                      <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#D3C4B5]">
                        {post.category}
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8 md:p-10 flex flex-col flex-grow space-y-6">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        {post.content_type === 'podcast' ? <Headphones size={14} className="text-[#8b7ff0]" /> : <Clock size={14} className="text-[#8b7ff0]" />}
                        {post.content_type === 'podcast' ? `${post.reading_time_minutes} MIN LISTEN` : `${post.reading_time_minutes} MIN READ`}
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-[#D3C4B5] transition-colors line-clamp-2">
                        {post.title_en}
                      </h3>
                      <p className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-3 italic opacity-80">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                             <img src={post.author_avatar_url || `https://i.pravatar.cc/100?u=${post.id}`} alt="Author" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                            {post.author_name || 'Educator Wisdom'}
                          </span>
                        </div>
                        <span className="text-[#8b7ff0] group-hover:translate-x-1.5 transition-transform">
                          <ArrowRight size={20} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredPosts.length > visibleCount && (
                <button
                  onClick={() => setVisibleCount(prev => prev + 9)}
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-white/60 transition-colors group mx-auto"
                >
                  Load more articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          ) : (
            <div className="py-40 text-center space-y-8">
               <div className="h-48 w-48 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mx-auto animate-pulse">
                  <BookOpen className="h-20 w-20 text-white/20" />
               </div>
               <div className="space-y-4">
                 <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Nothing here yet</h3>
                 <p className="text-zinc-500 font-medium italic">Try a different topic or audience.</p>
               </div>
               <button 
                 onClick={() => { setQuery(""); setView("all"); setActiveTopic("all"); }}
                 className="h-16 px-12 bg-white text-black uppercase font-black tracking-widest text-xs rounded-full hover:bg-[#D3C4B5] transition-all active:scale-95"
               >
                 Refresh Catalog
               </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

const ArrowRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);
