"use client";

import React, { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Settings2, 
  ArrowLeft,
  Share2,
  BookmarkCheck,
  Clock,
  Calendar,
  ShieldCheck,
  Activity,
  Maximize2,
  Play,
  MessageCircle,
  Camera,
  Globe,
  Send,
  Copy,
  Link as LinkIcon,
  Star,
  Rocket,
  Brain,
  Palette,
  Music,
  CheckCircle2,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { AudioDose } from "./AudioDose";
import { QuickInsight } from "./QuickInsight";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export type ReadingTheme = "light" | "sepia" | "dark";

export default function BlogPostClient({ post }: { post: any }) {
  const [theme, setTheme] = useState<ReadingTheme>("dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [activeShare, setActiveShare] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const FloatingProp = ({ icon: Icon, delay = 0, className = "" }: { icon: any, delay?: number, className?: string }) => (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ 
        y: [0, -20, 0],
        opacity: theme === 'dark' ? [0.05, 0.15, 0.05] : [0.1, 0.3, 0.1],
        rotate: [0, 10, -10, 0]
      }}
      transition={{ 
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay }
      }}
      className={cn("fixed z-0 select-none pointer-events-none transition-opacity duration-1000", className)}
    >
      <Icon size={120} strokeWidth={0.5} />
    </motion.div>
  );

  const themeStyles = {
    light: {
      bg: "bg-[#F9F8F6]",
      text: "text-[#1A1A1A]",
      header: "bg-[#F9F8F6]/95 backdrop-blur-3xl border-[#BACCB3]/30",
      contentLine: "bg-zinc-200",
      sidebarBg: "bg-white/50 border-[#BACCB3]/20",
      accent: "text-[#008080]",
      accentBg: "bg-[#008080]",
      blockquote: "bg-[#E8F4F1] border-[#008080]",
      callout: "bg-white border-[#BACCB3]/50",
      footer: "bg-white border-zinc-100",
    },
    sepia: {
      bg: "bg-[#F4E9D8]",
      text: "text-[#5C4033]",
      header: "bg-[#F4E9D8]/95 backdrop-blur-3xl border-[#D3C4B5]/30",
      contentLine: "bg-[#D3C4B5]",
      sidebarBg: "bg-[#EADDC9] border-[#D3C4B5]/20",
      accent: "text-[#8B4513]",
      accentBg: "bg-[#8B4513]",
      blockquote: "bg-[#EADDC9] border-[#8B4513]",
      callout: "bg-[#FDF6E3] border-[#D3C4B5]/50",
      footer: "bg-[#FDF6E3] border-[#D3C4B5]/20",
    },
    dark: {
      bg: "bg-[#0A0B1A]",
      text: "text-[#F1F3F5]",
      header: "bg-[#0A0B1A]/95 backdrop-blur-3xl border-white/5",
      contentLine: "bg-[#1A2A4A]",
      sidebarBg: "bg-[#16172B]/60 border-white/5 shadow-2xl",
      accent: "text-[#D3C4B5]",
      accentBg: "bg-[#D3C4B5]",
      blockquote: "bg-white/5 border-[#D3C4B5]",
      callout: "bg-[#16172B] border-white/5",
      footer: "bg-[#060B1A] border-white/5",
    },
  };

  const st = themeStyles[theme];

  const shareActions = [
    { icon: Globe, label: 'LinkedIn', action: 'linkedin' },
    { icon: Send, label: 'X / Twitter', action: 'twitter' },
    { icon: MessageCircle, label: 'WhatsApp', action: 'whatsapp' },
    { icon: Camera, label: 'Instagram', action: 'instagram' },
    { icon: Copy, label: 'Copy Link', action: 'copy' },
  ];

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
    }
    return null;
  };

  const getPodcastEmbed = (url?: string) => {
    if (!url) return null;
    if (url.includes('podcasts.apple.com')) {
      return url.replace('podcasts.apple.com', 'embed.podcasts.apple.com');
    }
    return null;
  };

  const handleShare = (action: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Expert Masterclass: ${post.title_en} from Insighte Wisdom Hub`;
    
    if (action === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (action === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (action === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`, '_blank');
    } else if (action === 'instagram') {
      // Instagram doesn't have a direct share URL like others, copy link is the standard surrogate
      navigator.clipboard.writeText(url);
      setActiveShare('Post Link Copied!');
      toast({
        title: "Instagram Propagator",
        description: "Link copied for your Story or Bio.",
        variant: "default"
      });
    } else if (action === 'copy') {
      navigator.clipboard.writeText(url);
      setActiveShare('Link Copied!');
    }
    
    if (action !== 'instagram') {
      setTimeout(() => setActiveShare(null), 2000);
    }
    setIsShareOpen(false);
  };

  return (
    <div className={cn("min-h-screen font-serif transition-colors duration-500", st.bg, st.text)}>
      {/* Cinematic Sticky Header */}
      <div className={cn("fixed top-0 left-0 right-0 h-[80px] border-b z-[100] flex items-center justify-between px-10 transition-all", st.header)}>
         <div className="flex items-center gap-8">
            <Link href="/blog">
               <button className={cn("h-10 px-6 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:bg-white hover:text-black transition-all italic", theme === 'dark' ? 'border-white/10 text-white' : 'border-[#BACCB3]/50 text-zinc-600')}>
                  <ArrowLeft size={14} /> Back to Catalog
               </button>
            </Link>
            <div className={cn("h-6 w-px hidden md:block opacity-20", st.contentLine)} />
            <div className={cn("flex items-center gap-3 text-[10px] font-black uppercase tracking-widest italic opacity-60", st.accent)}>
               <span className="hidden md:inline">Current Lesson:</span>
               <span className={cn("truncate max-w-[200px] md:max-w-none transition-colors", theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]')}>{post.title_en}</span>
            </div>
         </div>
         
         <div className="flex items-center gap-8">
            {/* Theme Toggle */}
            <div className="flex bg-white/5 p-1 rounded-full border border-white/5 gap-1">
               <button onClick={() => setTheme("dark")} className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", theme === "dark" ? "bg-white text-black shadow-md" : "text-white/40 hover:text-white")}>
                  <Moon size={16} />
               </button>
               <button onClick={() => setTheme("sepia")} className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", theme === "sepia" ? "bg-[#D3C4B5] text-[#5C4033] shadow-md" : "text-white/40 hover:text-[#5C4033]")}>
                  <BookOpen size={16} />
               </button>
               <button onClick={() => setTheme("light")} className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all", theme === "light" ? "bg-white text-[#1A1A1A] shadow-md" : "text-white/40 hover:text-[#1A1A1A]")}>
                  <Sun size={16} />
               </button>
            </div>
         </div>
      </div>

      <main className="pt-[180px] pb-40">
        <div className="max-w-[720px] mx-auto px-6 relative">
          
           {/* Media Section: Video/Podcast Integration */}
           {(post.video_url || post.podcast_url) && (
              <div className="mb-24 scale-[1.02] shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-[56px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-3xl animate-fade-in">
                {post.video_url && getEmbedUrl(post.video_url) ? (
                   <div className="aspect-video w-full">
                      <iframe 
                        src={getEmbedUrl(post.video_url) as string}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                   </div>
                ) : post.podcast_url && getPodcastEmbed(post.podcast_url) ? (
                   <div className="p-10">
                      <iframe 
                        allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" 
                        frameBorder="0" 
                        height="175" 
                        style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', background: 'transparent' }} 
                        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" 
                        src={getPodcastEmbed(post.podcast_url) as string}
                      />
                   </div>
                ) : null}
              </div>
           )}

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
             {/* Left Sidebar - Clinical Audio & Logic */}
             <div className="lg:col-span-4 space-y-12">
                <div className={cn("lg:sticky lg:top-32 h-fit p-12 rounded-[56px] border border-white/5 backdrop-blur-3xl transition-all", st.sidebarBg)}>
                   <div className="space-y-4 mb-10">
                     <div className="flex items-center gap-3">
                        <div className={cn("h-1.5 w-6 rounded-full", st.accentBg)} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">Insighte Audio Core</span>
                     </div>
                     <h3 className="text-3xl font-sans font-black tracking-tighter uppercase italic">Listen to Masterclass</h3>
                   </div>
                   <AudioDose text={post.content_markdown} title={post.title_en} theme={theme} />
                </div>

               {/* Sharing & Registry */}
               <div className={cn("p-10 border rounded-[56px] space-y-8 backdrop-blur-3xl transition-all", st.sidebarBg)}>
                  <div className="space-y-4">
                     <button className={cn("w-full flex items-center justify-center gap-4 px-8 h-16 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl group", theme === 'dark' ? 'bg-white text-black' : 'bg-[#1A1A1A] text-white')}>
                       <BookmarkCheck size={20} fill="currentColor" strokeWidth={3} /> Add to Sanctuary
                     </button>
                     
                     <div className="relative">
                        <button 
                          onClick={() => setIsShareOpen(!isShareOpen)}
                          className={cn("w-full flex items-center justify-center gap-4 px-8 h-16 rounded-full border text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all group", theme === 'dark' ? 'border-white/10 text-white' : 'border-black/10 text-black')}
                        >
                          <Share2 size={18} className={cn("transition-transform", isShareOpen && "rotate-45")} /> Propagate Insight
                        </button>

                        <AnimatePresence>
                          {isShareOpen && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: -10 }}
                              exit={{ opacity: 0, scale: 0.9, y: 10 }}
                              className={cn("absolute bottom-full left-0 right-0 mb-4 p-4 rounded-[32px] border flex flex-col gap-2 shadow-2xl", theme === 'dark' ? 'bg-[#16172B] border-white/10' : 'bg-white border-black/10')}
                            >
                               {shareActions.map((item, idx) => (
                                 <button 
                                   key={idx}
                                   onClick={() => handleShare(item.action)}
                                   className={cn("flex items-center gap-4 p-4 rounded-2xl transition-all w-full", theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5')}
                                 >
                                    <item.icon size={16} className={st.accent} />
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", theme === 'dark' ? 'text-white/60' : 'text-black/60')}>{item.label}</span>
                                 </button>
                               ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                  </div>

                  <div className={cn("pt-8 border-t", theme === 'dark' ? 'border-white/5' : 'border-black/5')}>
                     <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest opacity-30">
                           <span>Sequence ID</span>
                           <span className="italic">INS-{post.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div className="h-10 px-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[8px] font-black uppercase tracking-widest text-[#D3C4B5]">
                           Clinical Release Ready
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* ARTICLE CONTENT */}
          <div className="space-y-12 mb-32">
            <div className="flex items-center gap-4">
               <span className={cn("text-[10px] font-black uppercase tracking-[0.5em] italic", st.accent)}>Advanced Masterclass Experience</span>
               <div className={cn("h-px flex-grow opacity-10", st.contentLine)} />
            </div>
            
            <h1 className={cn("text-5xl md:text-7xl font-sans font-extrabold tracking-tighter leading-[1.1] uppercase italic transition-colors drop-shadow-2xl", theme === 'dark' ? 'text-white' : 'text-[#1A1A1A]')}>
              {post.title_en}
            </h1>

            <div className="flex items-center gap-10 pt-10">
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-zinc-800 border border-white/10 overflow-hidden grayscale group hover:grayscale-0 transition-all duration-700">
                    <img src={`https://i.pravatar.cc/100?u=${post.id}`} alt="Instructor" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-xs font-bold uppercase tracking-widest leading-none mb-1 text-white">Clinical Instructor</span>
                     <span className="text-[9px] font-bold text-[#D3C4B5] italic uppercase tracking-widest">Lead Care Specialist</span>
                  </div>
               </div>
               <div className="h-8 w-px bg-white/10" />
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                  <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </div>
            </div>
          </div>

          {/* MAIN BODY */}
          <div className="space-y-32">
            {/* Playful Floating Decorations */}
            <FloatingProp icon={Brain} className="top-[20vh] -left-[40vw]" delay={0} />
            <FloatingProp icon={Rocket} className="top-[40vh] -right-[40vw]" delay={2} />
            <FloatingProp icon={Star} className="top-[60vh] -left-[35vw]" delay={1} />
            <FloatingProp icon={Palette} className="top-[80vh] -right-[35vw]" delay={3} />
            <FloatingProp icon={Compass} className="top-[100vh] -left-[42vw]" delay={0.5} />

            <QuickInsight bullets={post.summary_bullets} theme={theme} />

            <article className={cn(
               "prose prose-zinc max-w-none prose-p:text-[1.4rem] prose-p:font-serif prose-p:leading-[1.9] prose-p:mb-16 prose-headings:font-sans prose-headings:font-extrabold prose-headings:tracking-tighter prose-headings:uppercase prose-headings:italic animate-fade-in-up",
               theme === 'dark' ? 'prose-invert prose-p:text-[#CBD5E0] prose-headings:text-white' : 'prose-p:text-inherit prose-headings:text-black'
            )}>
               <ReactMarkdown
                 components={{
                   blockquote: ({ node, ...props }) => (
                     <blockquote className={cn("my-20 p-16 border-l-8 rounded-[48px] relative italic not-prose shadow-2xl transition-all", st.blockquote)}>
                        <p className={cn("text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-[1.1] relative z-10 uppercase transition-colors", theme === 'dark' ? 'text-white' : 'text-black')}>{props.children}</p>
                     </blockquote>
                   ),
                   strong: ({ node, children, ...props }) => {
                     const textContent = React.Children.toArray(children).join("");
                     const isClinicalDose = textContent.includes("Clinical Dose:");
                     
                     if (isClinicalDose) {
                       const cleanText = textContent.replace("Clinical Dose:", "").trim();
                       return (
                         <div className={cn("my-24 p-12 rounded-[56px] border shadow-2xl relative overflow-hidden group hover:border-[#D3C4B5] transition-all not-prose bg-[#16172B]")}>
                             <div className="absolute top-0 right-0 w-64 h-64 bg-[#D3C4B5]/5 rounded-bl-[120px] -mr-20 -mt-20 group-hover:scale-110 transition-transform" />
                             <div className="flex items-center gap-6 mb-8 relative z-10">
                                <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center">
                                   <Play size={18} fill="currentColor" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#D3C4B5]">Instructor Insight</span>
                             </div>
                             <div className="relative z-10">
                                <p className="text-2xl md:text-3xl font-sans font-black italic underline decoration-white/20 underline-offset-[12px] leading-[1.3] tracking-tighter text-white">{cleanText}</p>
                             </div>
                         </div>
                       );
                     }
                     return <strong className="font-sans font-black uppercase tracking-tighter text-white" {...props}>{children}</strong>;
                   }
                 }}
               >
                 {post.content_markdown}
               </ReactMarkdown>
            </article>

            {/* UP NEXT CUE */}
            <div className="pt-24 border-t border-white/5">
               <div className="flex flex-col items-center text-center space-y-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">Up Next in Masterclass</span>
                  <Link href="/blog">
                     <button className="group flex flex-col items-center gap-4">
                        <span className="text-4xl md:text-6xl font-sans font-extrabold tracking-tighter uppercase italic text-white group-hover:text-[#D3C4B5] transition-colors underline decoration-white/10 group-hover:decoration-[#D3C4B5]/40 underline-offset-[20px] transition-all duration-700">Explore Entire Catalog</span>
                        <ArrowLeft className="rotate-180 w-12 h-12 mt-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-4 transition-all" />
                     </button>
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* COMPACT CLINICAL UNIVERSE FOOTER */}
      <footer className={cn("py-32 px-10 md:px-24 transition-colors duration-500", st.footer)}>
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-32">
            <div className="space-y-6">
               <h4 className={cn("text-[10px] font-black uppercase tracking-[0.5em]", st.accent)}>Discovery</h4>
               <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest opacity-40">
                  <li className="hover:opacity-100 cursor-pointer transition-colors italic">Research Archive</li>
                  <li className="hover:opacity-100 cursor-pointer transition-colors italic">Clinical Papers</li>
                  <li className="hover:opacity-100 cursor-pointer transition-colors italic">Resource Mapping</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className={cn("text-[10px] font-black uppercase tracking-[0.5em]", st.accent)}>Operations</h4>
               <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest opacity-40">
                  <li className="hover:opacity-100 cursor-pointer transition-colors italic">Protocol Registry</li>
                  <li className="hover:opacity-100 cursor-pointer transition-colors italic">Deployment Guide</li>
                  <li className="hover:opacity-100 cursor-pointer transition-colors italic">Global Impact</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className={cn("text-[10px] font-black uppercase tracking-[0.5em]", st.accent)}>Sanctuary</h4>
               <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest opacity-40">
                  <li className="hover:opacity-100 cursor-pointer transition-colors italic">Member Sequence</li>
                  <li className="hover:opacity-100 cursor-pointer transition-colors italic">Insighte Vault</li>
                  <li className="hover:opacity-100 cursor-pointer transition-colors italic">Peer Verification</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h4 className={cn("text-[10px] font-black uppercase tracking-[0.5em]", st.accent)}>Verification</h4>
               <div className={cn("p-6 rounded-[24px] border-2 border-dashed border-zinc-400/10 space-y-4 transition-colors", theme === 'dark' ? 'bg-white/5' : 'bg-[#F9F8F6]')}>
                  <div className="flex items-center gap-3">
                     <ShieldCheck size={16} className={st.accent} />
                     <span className="text-[9px] font-black uppercase tracking-widest">Clinical Node Verified</span>
                  </div>
                  <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest italic leading-tight">Insighte Documentation v2.1.0-STABLE</p>
                  <Activity size={14} className={cn("animate-pulse", st.accent)} />
               </div>
            </div>
         </div>
         <div className="mt-32 pt-12 border-t border-zinc-400/10 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.5em] opacity-40">
            <span>© 2026 INSIGHTE ARCHIVE</span>
            <span className="italic">NEURO-DIVERSE SOVEREIGNTY</span>
         </div>
      </footer>
    </div>
  );
}
