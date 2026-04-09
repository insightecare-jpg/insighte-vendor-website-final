"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, ArrowLeft, ShieldCheck, Heart, 
  Brain, Zap, Sparkles, User, Users, CheckCircle2,
  MapPin, Video, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const AGE_OPTIONS = [
  { id: "toddlers", label: "Toddlers (2-4)", icon: <User className="h-5 w-5" />, mapped: "Toddlers (2-4)" },
  { id: "pre-primary", label: "Pre-Primary (4-6)", icon: <User className="h-6 w-6" />, mapped: "Pre-Primary (4-6)" },
  { id: "primary", label: "Primary (6-10)", icon: <Users className="h-6 w-6" />, mapped: "Primary (6-10)" },
  { id: "adolescents", label: "Teen & Adult (10+)", icon: <Users className="h-7 w-7" />, mapped: "Adolescents (10+)" }
];

const CONCERN_OPTIONS = [
  { id: "speech", label: "Speech & Language", desc: "Communication, articulation, or delayed speech.", icon: <Sparkles className="h-6 w-6" />, params: { category: "Speech Therapy" } },
  { id: "behavior", label: "Behavior & Emotions", desc: "Meltdowns, defiance, or emotional regulation.", icon: <Heart className="h-6 w-6" />, params: { category: "Behavior Therapy" } },
  { id: "learning", label: "Academics & Learning", desc: "Reading, writing, or school inclusion support.", icon: <Brain className="h-6 w-6" />, params: { category: "Special Education" } },
  { id: "motor", label: "Physical & Motor", desc: "Clumsiness, sensory needs, or fine motor skills.", icon: <Activity className="h-6 w-6" />, params: { category: "Occupational Therapy" } }
];

const CITIES = ["Bangalore", "Delhi", "Mumbai", "Kochi", "Trivandrum", "Chennai", "Hyderabad", "Pune"];

export default function GuidedTriageClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [answers, setAnswers] = useState({
    ageGroup: "",
    concernId: "",
    mode: "",
    city: "Bangalore"
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSelectAge = (mapped: string) => {
    setAnswers(prev => ({ ...prev, ageGroup: mapped }));
    setTimeout(nextStep, 300);
  };

  const handleSelectConcern = (id: string) => {
    setAnswers(prev => ({ ...prev, concernId: id }));
    setTimeout(nextStep, 300);
  };

  const handleSelectModeAndSubmit = (mode: string, selectedCity?: string) => {
    const finalAnswers = { ...answers, mode, city: selectedCity || answers.city };
    setAnswers(finalAnswers);
    
    // Trigger Analysis state
    setStep(4);
    setIsAnalyzing(true);
  };

  useEffect(() => {
    if (step === 4 && isAnalyzing) {
      // Execute redirect mapping after a dramatic pause
      const timer = setTimeout(() => {
        const concern = CONCERN_OPTIONS.find(c => c.id === answers.concernId);
        const p = new URLSearchParams();
        
        if (answers.ageGroup) p.set("ageGroup", answers.ageGroup);
        if (concern && concern.params.category) p.set("category", concern.params.category);
        if (answers.mode) p.set("mode", answers.mode);
        if (answers.mode === "offline" && answers.city) p.set("city", answers.city);

        router.replace(`/specialists?${p.toString()}`);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [step, isAnalyzing, answers, router]);

  // UI Components per step
  return (
    <div className="flex min-h-screen-safe flex-col bg-[#0d0f1a] font-sans text-white h-screen">
      {/* Header */}
      <header className="flex h-20 items-center justify-between px-6 border-b border-white/5 bg-[#0d0f1a]/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-[#e8e2d8] p-[5px] rounded-full flex items-center justify-center -ml-1">
            <Heart className="w-[18px] h-[18px] text-[#0d0f1a] fill-current" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#f0ece4]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Insighte
          </span>
        </div>
        <button onClick={() => router.push('/specialists')} className="text-xs font-black uppercase tracking-widest text-[#5a5466] hover:text-white transition-colors">
          Exit Search
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 pt-24 pb-12 w-full max-w-2xl mx-auto m-auto mt-[10vh]">
        
        {!isAnalyzing && (
          <div className="w-full flex items-center gap-2 mb-12">
            {[1, 2, 3].map(ind => (
              <div 
                key={ind} 
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                  step >= ind ? "bg-[#8b7ff0]" : "bg-white/10"
                )}
              />
            ))}
          </div>
        )}

        <div className="w-full relative min-h-[400px] flex flex-col justify-center">
          
          {/* STEP 1: AGE */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tighter" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                Who is this for?
              </h1>
              <p className="text-[#8a8591] mb-10 text-sm sm:text-base leading-relaxed">
                We'll tailor the specialists based on the child's developmental stage.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AGE_OPTIONS.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => handleSelectAge(opt.mapped)}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group",
                      answers.ageGroup === opt.mapped 
                        ? "bg-[#8b7ff0]/10 border-[#8b7ff0] shadow-[0_0_20px_rgba(139,127,240,0.2)]" 
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/20"
                    )}
                  >
                    <div className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                      answers.ageGroup === opt.mapped ? "bg-[#8b7ff0] text-[#0d0f1a]" : "bg-white/5 text-[#8b7ff0] group-hover:bg-white/10"
                    )}>
                      {opt.icon}
                    </div>
                    <span className="font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CONCERN */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col">
              <button onClick={prevStep} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#5a5466] hover:text-white transition-all w-fit mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tighter" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                What is your primary concern?
              </h1>
              <p className="text-[#8a8591] mb-10 text-sm sm:text-base leading-relaxed">
                Select the area where your child needs the most support right now.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {CONCERN_OPTIONS.map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => handleSelectConcern(opt.id)}
                    className={cn(
                      "flex items-center gap-5 p-5 rounded-3xl border transition-all text-left group",
                      answers.concernId === opt.id 
                        ? "bg-[#8b7ff0]/10 border-[#8b7ff0] shadow-[0_0_20px_rgba(139,127,240,0.2)]" 
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/20"
                    )}
                  >
                    <div className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-colors",
                      answers.concernId === opt.id ? "bg-[#8b7ff0] text-[#0d0f1a]" : "bg-[#0d0f1a] border border-white/10 text-[#8b7ff0] shadow-inner group-hover:border-white/20"
                    )}>
                      {opt.icon}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold tracking-tight text-lg text-white/95">{opt.label}</span>
                      <span className="text-xs text-[#8a8591] leading-relaxed group-hover:text-white/60">{opt.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: MODE */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col h-full">
              <button onClick={prevStep} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#5a5466] hover:text-white transition-all w-fit mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tighter" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                How would you prefer sessions?
              </h1>
              <p className="text-[#8a8591] mb-10 text-sm sm:text-base leading-relaxed">
                Both modes are proven to be highly effective. Choose what works best for your schedule.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleSelectModeAndSubmit("online")}
                    className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-[#8b7ff0]/50 transition-all text-center group h-[240px]"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b7ff0]/20 to-transparent border border-[#8b7ff0]/30 text-[#c5b8f8] shadow-[0_0_20px_rgba(139,127,240,0.2)]">
                      <Video className="h-8 w-8" />
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                      <span className="font-bold tracking-tight text-xl text-white">Online Video</span>
                      <span className="text-xs text-[#8a8591] leading-relaxed max-w-[200px]">Flexible and immediately available from home.</span>
                    </div>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-4 p-8 rounded-3xl border border-white/5 bg-white/[0.02] h-[240px]">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d9e75]/20 to-transparent border border-[#1d9e75]/30 text-[#5DCAA5] shadow-[0_0_20px_rgba(29,158,117,0.1)]">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="font-bold tracking-tight text-xl text-white">In-Person</span>
                    </div>
                    <span className="text-xs text-[#8a8591] mb-2 leading-relaxed">Available in select cities.</span>
                    
                    <select 
                      value={answers.city}
                      onChange={(e) => setAnswers(prev => ({...prev, city: e.target.value}))}
                      className="w-full bg-[#111224] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#8b7ff0] appearance-none"
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <button 
                      onClick={() => handleSelectModeAndSubmit("offline", answers.city)}
                      className="mt-auto w-full py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                    >
                      Find in {answers.city}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: ANALYZING (Loading Match) */}
          {step === 4 && (
            <div className="animate-in zoom-in-95 duration-700 flex flex-col items-center justify-center text-center absolute inset-0">
              <div className="relative flex items-center justify-center mb-10">
                {/* Antigravity Ripple Effect */}
                <div className="absolute inset-0 rounded-full bg-[#8b7ff0] opacity-20 blur-[30px] animate-pulse" />
                <div className="relative h-24 w-24 rounded-full border-2 border-[#8b7ff0]/30 border-t-[#8b7ff0] border-r-[#8b7ff0] animate-spin flex items-center justify-center shadow-[0_0_60px_rgba(139,127,240,0.5)]">
                  <div className="h-16 w-16 rounded-full bg-[#0d0f1a] flex items-center justify-center animate-spin-reverse">
                    <Sparkles className="h-6 w-6 text-[#8b7ff0]" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-black mb-4 tracking-tighter text-white" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                Matching you with the<br/>perfect specialist...
              </h2>
              <p className="text-[#8a8591] text-sm max-w-xs mx-auto animate-pulse flex flex-col gap-2">
                <span>Mapping requirements</span>
                <span className="text-[#8b7ff0] font-bold">Scanning availability</span>
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
