"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  ArrowRight,
  LayoutDashboard,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function BookingConfirmationSanctuary() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#111224] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-64 pb-32">
        <div className="flex flex-col items-center justify-center text-center space-y-20">
           {/* THE RESONANCE RING ARCHITECTURE */}
           <div className="relative h-80 w-80 flex items-center justify-center animate-fade-in-up">
              <div className="absolute inset-0 bg-[#BACCB3]/10 blur-[100px] rounded-full animate-pulse" />
              <div className="h-48 w-48 rounded-full border-2 border-[#BACCB3]/40 flex items-center justify-center relative rotate-animation">
                 <div className="absolute top-0 -translate-y-1/2 left-1/2 -translateX-1/2 h-4 w-4 rounded-full bg-[#BACCB3] shadow-glow" />
                 <CheckCircle2 className="h-20 w-20 text-[#BACCB3] animate-bounce-subtle" />
              </div>
              <div className="absolute -inset-10 border border-white/5 rounded-full rotate-counter-animation opacity-20" />
           </div>

           <div className="space-y-6 animate-fade-in-up stagger-1">
              <div className="flex items-center justify-center gap-3">
                 <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-8 py-2 text-[10px] font-black uppercase tracking-widest">
                    Resonance Established
                 </Badge>
                 <div className="h-1.5 w-1.5 rounded-full bg-[#BACCB3] blur-[1px] animate-pulse" />
              </div>
              <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-[0.85] font-manrope">
                 Moment <br/>
                 <span className="text-zinc-600">Reserved.</span>
              </h1>
              <p className="text-2xl text-zinc-500 font-medium max-w-2xl mx-auto italic pt-8 leading-relaxed">
                 You have successfully secured a therapeutic moment with Dr. Aradhana. The architectural flow of progress begins now.
              </p>
           </div>

           {/* DETAILS VESSEL */}
           <div className="vessel-high bg-[#191A2D] p-12 md:p-20 w-full max-w-4xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-16 animate-fade-in-up stagger-2">
              <div className="space-y-12">
                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D3C4B5]">Path Details</h3>
                    <div className="space-y-2">
                       <p className="text-3xl font-extrabold font-manrope">Mar 29 — 11:30 AM</p>
                       <p className="text-md text-zinc-500 font-bold tracking-tight">Clinical Language Mapping architecture</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D3C4B5]">Care Architect</h3>
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-16 rounded-3xl overflow-hidden bg-[#111224] border border-white/10 flex-shrink-0 relative">
                          <Image src="/avatars/provider1.png" fill alt="Provider" className="object-cover" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-xl font-bold font-manrope tracking-tighter">Dr. Aradhana Sharma</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">Senior SLP</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-12 bg-white/5 p-12 rounded-[48px] border border-white/10 flex flex-col justify-center">
                 <p className="text-lg text-zinc-400 font-medium italic leading-relaxed">
                   "A calendar manifest has been dispatched to your sanctuary email. Please review the clinical prep-file before resonance."
                 </p>
                 <div className="flex items-center gap-4 text-white/40">
                    <ShieldCheck className="h-5 w-5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Sanctuary Grade Encrypted Transaction</span>
                 </div>
              </div>
           </div>

           {/* ACTIONS HUB */}
           <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl animate-fade-in-up stagger-3">
              <Link href="/dashboard" className="flex-1">
                 <Button className="h-24 w-full rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-xs hover:shadow-glow shadow-[#D3C4B5]/10 group transition-all">
                    Access My Sanctuary <LayoutDashboard className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                 </Button>
              </Link>
              <Link href="/messages" className="flex-1">
                 <Button variant="ghost" className="h-24 w-full rounded-full bg-white/5 text-white font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    Message Lab <MessageSquare className="h-5 w-5 opacity-40 shadow-inner" />
                 </Button>
              </Link>
           </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes rotate {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
        }
        @keyframes rotate-counter {
           from { transform: rotate(360deg); }
           to { transform: rotate(0deg); }
        }
        .rotate-animation {
           animation: rotate 20s linear infinite;
        }
        .rotate-counter-animation {
           animation: rotate-counter 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
