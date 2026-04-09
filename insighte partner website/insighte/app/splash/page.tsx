"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SplashScreen() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Smooth progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push("/onboarding");
          }, 800);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen-safe w-full flex-col items-center justify-center bg-zinc-950 px-6 font-sans overflow-hidden">
      {/* Deep atmospheric glow - The 'Antigravity' pulse */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[160px] animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-accent/5 blur-[100px]" />
      
      {/* Insighte Brand Logo Centerpiece - Dramatic Scale */}
      <div className="flex flex-col items-center gap-10 animate-fade-in-up">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-[40px] bg-primary text-white shadow-[0_0_120px_rgba(79,103,240,0.4)] transition-transform hover:scale-110 duration-700">
           <Heart className="h-16 w-16 fill-white stroke-[2.5] animate-pulse" />
           {/* Cinematic ring animation */}
           <div className="absolute inset-0 rounded-[40px] border-2 border-primary animate-ping-slow opacity-20" />
           <div className="absolute -inset-4 rounded-[48px] border border-white/10 opacity-40 animate-spin-slow" />
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-6xl font-black tracking-tighter text-white sm:text-8xl">
            Insighte
          </h1>
          <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600 italic">Antigravity Care Platform</p>
        </div>
      </div>

      {/* Progress Indicator - Premium loading style */}
      <div className="absolute bottom-24 flex w-full max-w-xs flex-col items-center gap-6 opacity-80 animate-fade-in-up stagger-3">
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/5 border border-white/5 shadow-inner">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_20px_rgba(79,103,240,0.6)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex w-full items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-700 italic">
          <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Secure Intake</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Institutional Metadata */}
      <div className="absolute bottom-10 flex items-center gap-6 text-[8px] font-black uppercase tracking-widest text-zinc-800 animate-fade-in-up stagger-4">
         <span className="flex items-center gap-2 underline underline-offset-4 decoration-primary/20">Vanguard v1.0.4</span>
         <span className="h-1 w-1 rounded-full bg-zinc-800" />
         <span className="flex items-center gap-2">Built for Excellence</span>
      </div>
    </div>
  );
}
