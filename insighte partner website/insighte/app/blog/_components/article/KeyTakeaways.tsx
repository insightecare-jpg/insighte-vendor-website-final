"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface KeyTakeawaysProps {
  takeaways: string[];
}

export function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-sans">Key Takeaways</span>
      </div>

      <ul className="space-y-4">
        {takeaways.map((item, idx) => (
          <li key={idx} className="flex gap-3 text-sm leading-relaxed text-zinc-300 font-sans">
            <ArrowRight size={14} className="mt-1 flex-shrink-0 text-accent/60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
