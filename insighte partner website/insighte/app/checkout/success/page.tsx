"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  Calendar, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  return (
    <div className="bg-[#111224] text-white min-h-screen font-sans">
      <Navbar />
      
      <main className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-center relative overflow-hidden">
        {/* Abstract Success Particles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#BACCB3]/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

        <div className="relative z-10 space-y-16 animate-fade-in">
          {/* Success Icon Mastery */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#BACCB3] blur-[40px] opacity-20 scale-150 animate-pulse"></div>
              <div className="w-28 h-28 rounded-[40px] bg-[#BACCB3]/20 border border-[#BACCB3]/30 flex items-center justify-center relative rotate-12 group hover:rotate-0 transition-transform duration-700">
                <CheckCircle2 className="w-12 h-12 text-[#BACCB3]" />
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#BACCB3]">Secure Transaction Finalized</p>
              <h1 className="text-6xl md:text-8xl font-black font-manrope tracking-tighter leading-none italic uppercase">
                Welcome <br/> <span className="text-zinc-600">to the Sanctuary</span>
              </h1>
            </div>
          </div>

          {/* INFORMATION HUB */}
          <div className="vessel-high bg-[#191A2D] p-12 md:p-16 border border-white/5 rounded-[48px] space-y-12 text-left relative group">
             {/* Subtle Glass Line */}
             <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#BACCB3] via-[#D3C4B5] to-transparent opacity-40"></div>

             <div className="space-y-8">
               <h3 className="text-3xl font-black font-manrope tracking-tighter uppercase italic text-zinc-500">Next-Step Protocol</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                       <Calendar className="w-5 h-5 text-[#D3C4B5]" />
                     </div>
                     <p className="text-sm font-bold">Initiation Scheduled</p>
                   </div>
                   <p className="text-xs text-zinc-400 leading-relaxed italic ml-14">
                     An initiation signal has been sent. Your care architect will connect within 2 clinical hours to refine your specific pathway details.
                   </p>
                 </div>

                 <div className="space-y-4">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                       <ShieldCheck className="w-5 h-5 text-[#D3C4B5]" />
                     </div>
                     <p className="text-sm font-bold">Encrypted Credentials</p>
                   </div>
                   <p className="text-xs text-zinc-400 leading-relaxed italic ml-14">
                      Check your secure direct vault (email) for your official Sanctuary credentials and access token.
                   </p>
                 </div>
               </div>
             </div>

             <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-[#111224] border border-white/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#D3C4B5]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">Care Manifest</p>
                    <p className="text-lg font-bold font-manrope tracking-tighter">Order #INS-{Math.floor(Math.random() * 90000) + 10000}</p>
                  </div>
               </div>
               
               <Button className="h-16 px-10 rounded-full bg-white/5 text-zinc-400 font-black uppercase tracking-widest text-[10px] border border-white/5 hover:border-white/20 transition-all gap-3 group">
                 <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" /> Download Invoice
               </Button>
             </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 pt-12 animate-fade-in stagger-3">
             <Link href="/parent/dashboard" className="group">
                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">Immediate Access</p>
                      <p className="text-base font-bold font-manrope tracking-tighter text-white group-hover:text-[#BACCB3] transition-colors">Enter Parent Sanctuary</p>
                   </div>
                   <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#BACCB3] transition-all">
                      <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform" />
                   </div>
                </div>
             </Link>

             <Link href="/specialists" className="group">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#D3C4B5] transition-all">
                      <Sparkles className="w-5 h-5 group-hover:scale-125 transition-transform" />
                   </div>
                   <div className="text-left">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">Secondary Discovery</p>
                      <p className="text-base font-bold font-manrope tracking-tighter text-white group-hover:text-[#D3C4B5] transition-colors">Refine Specialist Selection</p>
                   </div>
                </div>
             </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="bg-[#111224] min-h-screen text-white flex items-center justify-center font-manrope uppercase font-black tracking-widest italic">Syncing Sanctuary Protocols...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
