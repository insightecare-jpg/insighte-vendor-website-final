"use client";

import React from "react";
import Link from "next/link";
import { Copy, X, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface Article {
  title_en: string;
  slug: string;
  author_name: string;
  author_avatar_url?: string;
  author_bio?: string;
  topic_tags?: string[];
}

export function ArticleFooter({ article }: { article: Article }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${article.title_en} — ${url}`);
    window.open(`whatsapp://send?text=${text}`, "_blank");
  };

  return (
    <footer className="pt-20 space-y-20 border-t border-white/5">
      {/* Author Card */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden bg-white/5 flex-shrink-0">
          <img 
            src={article.author_avatar_url || `https://i.pravatar.cc/100?u=${article.slug}`} 
            alt={article.author_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4 flex-grow">
          <div className="space-y-1">
            <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{article.author_name}</h4>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Insighte Expert Community</p>
          </div>
          {article.author_bio && (
            <p className="text-sm text-zinc-500 leading-relaxed font-medium italic max-w-xl">
              {article.author_bio}
            </p>
          )}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-accent transition-colors"
          >
            View all articles <Send size={12} />
          </Link>
        </div>
      </div>

      {/* Tags & Share */}
      <div className="space-y-10 group">
        {article.topic_tags && article.topic_tags.length > 0 && (
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Topics in this article</span>
            <div className="flex flex-wrap gap-2">
              {article.topic_tags.map((tag) => (
                <Link 
                  key={tag}
                  href={`/blog?topic=${tag}`}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#D3C4B5] hover:bg-white/10 transition-all"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Share this wisdom</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={copyLink}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all"
              aria-label="Copy link"
            >
              <Copy size={18} />
            </button>
            <button 
              onClick={shareWhatsApp}
              className="px-6 h-12 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center gap-3 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
              aria-label="Share on WhatsApp"
            >
              <MessageCircle size={18} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp</span>
            </button>
            <button 
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all"
              aria-label="Share on Twitter"
            >
              <X size={18} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
