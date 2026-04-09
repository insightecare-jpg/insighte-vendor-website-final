"use client";

import React from "react";
import { Zap, CheckCircle2, ChevronRight, Target, BrainCircuit, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickInsight({ bullets, theme = "light" }: { bullets: string[]; theme?: string }) {
  if (!bullets || bullets.length === 0) return null;

  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "p-16 mb-24 border rounded-[56px] shadow-2xl animate-fade-in group relative overflow-hidden",
      isDark ? "bg-white/5 border-white/5" : "bg-[#E8F4F1] border-[#BACCB3]/40"
    )}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12 relative z-10">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className={cn("h-5 w-5", isDark ? "text-[#D3C4B5]" : "text-[#008080]")}>
                 <BrainCircuit size={24} className="transition-transform group-hover:scale-110" />
              </div>
              <span className={cn("text-[10px] font-black uppercase tracking-[0.5em]", isDark ? "text-white/40" : "text-[#008080]")}>Section Case Study</span>
           </div>
           <h3 className={cn("text-4xl md:text-5xl font-sans font-black tracking-tighter uppercase italic leading-none", isDark ? "text-white" : "text-[#1A1A1A]")}>Curated Essentials</h3>
        </div>
        
        <div className="flex flex-wrap gap-4">
           {[
             { icon: Target, label: 'Precision', color: isDark ? '#D3C4B5' : '#008080' },
             { icon: Lightbulb, label: 'Insight', color: isDark ? '#4FD1C5' : '#008080' }
           ].map((badge, bidx) => (
             <div key={bidx} className={cn("h-12 px-8 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-all hover:scale-105", isDark ? "border-white/10 bg-white/5 text-white" : "border-[#BACCB3]/30 bg-white/50 text-[#1A1A1A]")}>
                <badge.icon size={14} style={{ color: badge.color }} /> {badge.label}
             </div>
           ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {bullets.map((bullet, idx) => (
          <div key={idx} className={cn(
            "flex gap-6 p-8 rounded-[32px] border transition-all hover:scale-[1.02] group/item",
            isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white/60 border-[#BACCB3]/20 hover:bg-white/80"
          )}>
            <div className={cn("h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-xl", isDark ? "bg-white/10 text-white" : "bg-[#008080]/10 text-[#008080]")}>
               <ChevronRight size={18} strokeWidth={4} />
            </div>
            <p className={cn("text-base font-medium leading-relaxed italic", isDark ? "text-white/90" : "text-[#1A1A1A]")}>{bullet}</p>
          </div>
        ))}
      </div>

      {/* Decorative Blob */}
      <div className={cn("absolute -bottom-20 -right-20 w-80 h-80 blur-[100px] opacity-20 transition-colors", isDark ? "bg-[#D3C4B5]" : "bg-[#008080]")} />
    </div>
  );
}
