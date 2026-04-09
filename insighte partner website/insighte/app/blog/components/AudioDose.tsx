"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Headphones, Volume2, Timer, FastForward, Globe, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

type VoiceLocale = "en-IN" | "en-US";

export function AudioDose({ text, title, theme = "light" }: { text: string; title: string, theme?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(0.8);
  const [locale, setLocale] = useState<VoiceLocale>("en-IN");
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    if (typeof window !== "undefined") {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getBestVoice = (loc: VoiceLocale) => {
    const voices = voicesRef.current;
    
    // For en-IN: look for patterns common in Indian voices
    if (loc === "en-IN") {
      const inPatterns = ["Heera", "Rishi", "Neerja", "Premium", "Enhanced", "IN", "India", "Ravi", "Sangeeta"];
      const bestIn = voices.find(v => (v.lang.includes("en-IN") || v.lang.includes("hi-IN")) && inPatterns.some(p => v.name.includes(p)));
      if (bestIn) return bestIn;
    }

    // For en-US: look for high-quality English (US) voices
    if (loc === "en-US") {
      const usPatterns = ["Samantha", "Alex", "Premium", "Enhanced", "Natural", "Google", "Microsoft", "US", "Daniel", "Serena"];
      const bestUs = voices.find(v => v.lang.includes("en-US") && usPatterns.some(p => v.name.includes(p)));
      if (bestUs) return bestUs;
    }

    // Fallbacks
    return (
      voices.find(v => v.lang.startsWith(loc)) ||
      voices.find(v => v.lang.startsWith("en-GB")) ||
      voices.find(v => v.lang.startsWith("en")) ||
      voices[0]
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined" && text) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      u.pitch = 1.0;
      u.lang = locale;
      u.onend = () => {
        setIsPlaying(false);
        setHasEnded(true);
      };
      
      const voice = getBestVoice(locale);
      if (voice) u.voice = voice;

      setUtterance(u);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, rate, locale]);

  const togglePlayback = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused && !hasEnded) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.cancel();
        if (utterance) window.speechSynthesis.speak(utterance);
        setHasEnded(false);
      }
      setIsPlaying(true);
    }
  };

  const cycleRate = () => {
    const rates = [0.8, 1.0, 1.2, 1.5];
    const nextIdx = (rates.indexOf(rate) + 1) % rates.length;
    setRate(rates[nextIdx]);
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rates[nextIdx];
      u.lang = locale;
      u.voice = getBestVoice(locale) || null;
      u.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  const toggleLocale = () => {
    const nextLocale = locale === "en-IN" ? "en-US" : "en-IN";
    setLocale(nextLocale);
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      u.lang = nextLocale;
      u.voice = getBestVoice(nextLocale) || null;
      u.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={cn(
      "flex items-center gap-6 p-6 rounded-[32px] border shadow-2xl transition-all group max-w-sm",
      isDark ? "bg-white/5 border-white/5" : "bg-[#E8F4F1] border-[#BACCB3]/30"
    )}>
      <button 
        onClick={togglePlayback}
        className={cn(
          "h-14 w-14 flex-shrink-0 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl",
          isDark ? "bg-white text-black" : "bg-[#1A1A1A] text-white"
        )}
      >
        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
           <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isDark ? "bg-[#D3C4B5]" : "bg-[#008080]")} />
           <span className={cn("text-[9px] font-black uppercase tracking-[0.3em]", isDark ? "text-white/40" : "text-[#1A1A1A]/40")}>Audio Masterclass</span>
        </div>
        <p className={cn("text-xs font-bold truncate italic uppercase tracking-widest", isDark ? "text-white" : "text-[#1A1A1A]")}>{locale === 'en-IN' ? 'Native Insight' : 'Global Precision'}</p>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleLocale}
          title="Switch Accent"
          className={cn(
            "h-12 w-12 rounded-2xl border flex items-center justify-center transition-all group/lang",
            isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white/50 border-[#BACCB3]/20 text-[#1A1A1A] hover:bg-white"
          )}
        >
          <Languages size={18} className="opacity-40 group-hover/lang:opacity-100 group-hover/lang:rotate-12 transition-all" />
        </button>

        <button 
          onClick={cycleRate}
          className={cn(
            "h-12 px-5 rounded-2xl border flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter transition-all whitespace-nowrap",
            isDark ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white/50 border-[#BACCB3]/20 text-[#1A1A1A] hover:bg-white"
          )}
        >
          <Timer size={16} className="opacity-40" /> {rate}x
        </button>
      </div>
    </div>
  );
}
