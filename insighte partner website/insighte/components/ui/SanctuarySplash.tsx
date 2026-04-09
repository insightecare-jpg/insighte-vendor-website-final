"use client";

import React, { useState, useEffect } from "react";
import { Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SanctuarySplash() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1200);

    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111224] transition-all duration-700 ease-in-out px-6",
      fadeOut ? "opacity-0 pointer-events-none scale-110" : "opacity-100"
    )}>
      {/* AMBIENT GLOW */}
      <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-gradient-to-t from-[#BACCB3]/5 to-transparent blur-[120px]" />
      
      <div className="relative space-y-12 flex flex-col items-center animate-fade-in-up">
         {/* THE LOGO RING */}
         <div className="relative h-48 w-48 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#BACCB3] opacity-5 blur-[80px] rounded-full animate-pulse" />
            <div className="h-24 w-24 rounded-full border-2 border-[#D3C4B5]/20 flex items-center justify-center relative rotate-animation">
               <div className="absolute top-0 -translate-y-1/2 left-1/2 -translateX-1/2 h-4 w-4 rounded-full bg-[#D3C4B5] shadow-glow" />
               <Heart className="h-10 w-10 text-[#D3C4B5] fill-current" />
            </div>
            <div className="absolute -inset-10 border border-white/5 rounded-full rotate-counter-animation opacity-30 scale-110" />
         </div>

         <div className="space-y-4 text-center">
            <h1 className="text-4xl font-extrabold font-manrope tracking-tighter uppercase text-white">
               Insighte
            </h1>
            <div className="flex items-center gap-3 justify-center">
               <div className="h-1 w-1 rounded-full bg-zinc-800" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Initializing Momentum</p>
               <div className="h-1 w-1 rounded-full bg-zinc-800" />
            </div>
         </div>
         
         <div className="pt-20">
            <div className="h-[2px] w-64 bg-white/5 rounded-full relative overflow-hidden">
               <div className="absolute inset-y-0 left-0 bg-[#BACCB3] transition-all duration-1000 ease-out animate-progress-flow w-1/3" />
            </div>
         </div>
      </div>

      <style jsx>{`
        @keyframes rotate {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
        }
        @keyframes rotate-counter {
           from { transform: rotate(360deg); }
           to { transform: rotate(0deg); }
        }
        @keyframes progress-flow {
           0% { left: -100%; width: 50%; }
           100% { left: 100%; width: 50%; }
        }
        .rotate-animation {
           animation: rotate 10s linear infinite;
        }
        .rotate-counter-animation {
           animation: rotate-counter 15s linear infinite;
        }
        .animate-progress-flow {
           animation: progress-flow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
