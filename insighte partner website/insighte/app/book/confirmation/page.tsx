"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, ArrowRight, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Guest';
  const email = searchParams.get('email') || 'your email';

  return (
    <div className="min-h-screen bg-[#111224] text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-12">
        {/* SUCCESS AVATAR */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="h-32 w-32 rounded-full bg-[#BACCB3]/10 border border-[#BACCB3]/20 flex items-center justify-center relative">
             <CheckCircle2 className="h-16 w-16 text-[#BACCB3]" />
             <div className="absolute inset-0 rounded-full border-2 border-[#BACCB3] animate-ping opacity-20" />
          </div>
        </motion.div>

        {/* MESSAGE */}
        <div className="text-center space-y-4">
          <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest italic">
            Institutional Receipt // Authorized
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black font-manrope tracking-tighter italic uppercase leading-tight">
            Moment <br/> <span className="text-[#D3C4B5]">Reserved.</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
            Your clinical encounter with the specialist is confirmed. 
            An institutional receipt has been dispatched to <span className="text-white font-bold">{email}</span>.
          </p>
        </div>

        {/* NUDGE CARD */}
        <div className="vessel bg-[#1D1E31]/50 p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 h-32 w-32 bg-[#BACCB3]/5 blur-[50px] rounded-full group-hover:scale-150 transition-all duration-1000" />
           <div className="flex items-center gap-4 mb-2">
              <Sparkles className="h-5 w-5 text-[#BACCB3]" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">Claim Your Sanctuary</h4>
           </div>
           <p className="text-xs font-medium text-zinc-400 leading-relaxed">
             A temporary profile has been initialized for <span className="text-white font-bold">{name}</span>. 
             Set your password now to synchronize with your progress reports and session clocks.
           </p>
           <div className="flex flex-col gap-3 pt-4">
              <Button asChild className="h-14 rounded-2xl bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                 <Link href={`/auth/parent/signup?email=${encodeURIComponent(email)}`}>
                    Setup Access Sanctuary <ArrowRight className="ml-2 h-4 w-4" />
                 </Link>
              </Button>
              <Button variant="ghost" asChild className="h-14 text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all">
                 <Link href="/">Back to Marketplace</Link>
              </Button>
           </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-center opacity-40">
           <ShieldCheck className="h-4 w-4 text-zinc-600" />
           <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">Institutional Security Protocol v2.1</span>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  );
}
