"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, Share2, Music, ListCheck } from "lucide-react";
import Link from "next/link";
import { ReadingProgress } from "./ReadingProgress";
import { MobileSupplementary } from "./MobileSupplementary";
import { AudioPlayer } from "./AudioPlayer";
import { KeyTakeaways } from "./KeyTakeaways";
import { RelatedArticles } from "./RelatedArticles";
import { cn } from "@/lib/utils";

interface ArticleLayoutProps {
  children: React.ReactNode;
  hero: React.ReactNode;
  sidebar: React.ReactNode;
  post: any;
  relatedPosts: any[];
}

export function ArticleLayout({ children, hero, sidebar, post, relatedPosts }: ArticleLayoutProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B1A] text-text-primary">
      <Navbar />
      <ReadingProgress />

      {/* Sticky Top Bar (Article Specific) */}
      <div className={cn(
        "fixed top-0 left-0 right-0 h-20 z-[105] flex items-center justify-between px-6 md:px-12 bg-[#0A0B1A]/80 backdrop-blur-xl border-b border-white/5 transition-transform duration-300",
        isScrolled ? "translate-y-0" : "-translate-y-full"
      )}>
        <Link href="/blog" className="flex items-center gap-2 group">
          <ArrowLeft size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-all">The Hub</span>
        </Link>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 truncate max-w-[200px] md:max-w-[400px]">
          {post.title_en}
        </span>
        <button className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-all">
          <Share2 size={16} />
        </button>
      </div>

      <main className="pt-32 pb-40 max-w-7xl mx-auto px-6">
        {/* Back Link (Initial) */}
        {!isScrolled && (
          <Link href="/blog" className="inline-flex items-center gap-2 mb-12 group">
            <ArrowLeft size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-all">Back to The Hub</span>
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 xl:gap-24">
          <div className="space-y-16">
            {hero}
            <div className="max-w-[680px] lg:mx-auto">
              {children}
            </div>
          </div>

          <div className="hidden lg:block">
            {sidebar}
          </div>

          {/* Mobile Supplementary Sections */}
          <div className="lg:hidden space-y-2 mt-8">
            {(post.audio_url || post.podcast_embed_url) && (
              <MobileSupplementary label="Listen to this article" icon={<Music size={18} />}>
                {post.audio_url ? (
                  <AudioPlayer url={post.audio_url} title={post.title_en} />
                ) : (
                  <iframe src={post.podcast_embed_url} width="100%" height="152" frameBorder="0" loading="lazy" />
                )}
              </MobileSupplementary>
            )}

            {post.key_takeaways && post.key_takeaways.length > 0 && (
              <MobileSupplementary label="Key Takeaways" icon={<ListCheck size={18} />}>
                <KeyTakeaways takeaways={post.key_takeaways} />
              </MobileSupplementary>
            )}

            {relatedPosts.length > 0 && (
              <div className="pt-12 space-y-6">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Keep Reading</span>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedPosts.slice(0, 2).map(p => (
                      <Link key={p.slug} href={`/blog/${p.slug}`} className="group space-y-4">
                         <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 bg-white/5">
                            <img src={p.cover_image_url} alt={p.title_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                         </div>
                         <h4 className="text-sm font-bold uppercase italic tracking-tight text-white group-hover:text-accent transition-colors line-clamp-2">{p.title_en}</h4>
                      </Link>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
