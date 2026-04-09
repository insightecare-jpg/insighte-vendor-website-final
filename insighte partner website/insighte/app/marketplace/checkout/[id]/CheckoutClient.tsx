"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  CreditCard,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CheckoutClient({ 
  provider, 
  date, 
  slot 
}: { 
  provider: any, 
  date: string, 
  slot: string 
}) {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const price = provider.services?.[0]?.price || 1800;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
       {/* LEFT COLUMN --- FINALIZATION ARCHITECTURE */}
       <div className="lg:col-span-2 space-y-12 animate-fade-in-up stagger-1">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-8 py-2 text-[10px] font-black uppercase tracking-widest">
                   Finalize Resonance
                </Badge>
                <div className="h-1.5 w-1.5 rounded-full bg-[#BACCB3] blur-[1px] animate-pulse" />
             </div>
             <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] font-manrope">
                Confirm your <br/>
                <span className="text-zinc-600">Sanctuary Bond</span>
             </h1>
          </div>

          <div className="vessel-high bg-[#191A2D] p-12 md:p-16 space-y-16 border border-white/5">
             {/* CONTACT INFO */}
             <div className="space-y-10">
                <h3 className="text-2xl font-black font-manrope tracking-tighter uppercase italic text-zinc-700">Account Architecture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D3C4B5]">Full Identity</p>
                      <Input placeholder="Midhun Noble" className="h-16 w-full rounded-full bg-white/5 border-none px-8 text-sm" />
                   </div>
                   <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D3C4B5]">Email Signal</p>
                      <Input placeholder="midhun@example.com" className="h-16 w-full rounded-full bg-white/5 border-none px-8 text-sm" />
                   </div>
                </div>
             </div>

             {/* PAYMENT ARCHITECTURE */}
             <div className="space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black font-manrope tracking-tighter uppercase italic text-zinc-700">Payment Logic</h3>
                   <div className="flex h-10 items-center rounded-full bg-white/5 px-2 border border-white/10">
                      <Lock className="h-3 w-3 text-zinc-700 mr-2" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">Encrypted</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                     { id: "razorpay", label: "Razorpay (Cards/UPI)", icon: <CreditCard className="h-5 w-5" /> },
                     { id: "netbanking", label: "Direct Net Banking", icon: <ShieldCheck className="h-5 w-5" /> }
                   ].map(opt => (
                     <button 
                       key={opt.id}
                       onClick={() => setPaymentMethod(opt.id)}
                       className={cn(
                         "flex items-center justify-between px-10 h-20 rounded-[32px] transition-all duration-700 border",
                         paymentMethod === opt.id 
                           ? "bg-[#D3C4B5] text-[#382F24] border-transparent shadow-2xl scale-[1.03]" 
                           : "bg-white/5 text-zinc-600 border-white/5 hover:border-white/10"
                       )}
                     >
                        <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                        {opt.icon}
                     </button>
                   ))}
                </div>

                <div className="p-8 rounded-[32px] bg-[#111224] border border-white/5 space-y-4">
                   <div className="flex items-center gap-4 text-zinc-600">
                      <ShieldAlert className="h-5 w-5 text-amber-500/40" />
                      <p className="text-xs font-bold leading-relaxed">
                        Your payment is secured by Sanctuary Logic. We do not store full card information on our vessels.
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* RIGHT COLUMN --- SUMMARY INVOICE */}
       <div className="lg:col-span-1 space-y-12 animate-fade-in-up stagger-2">
          <div className="vessel bg-[#191A2D] p-10 space-y-12 border border-white/5">
             <h2 className="text-3xl font-extrabold font-manrope tracking-tighter underline decoration-2 decoration-[#D3C4B5]/20 underline-offset-8">Care Summary</h2>
             
             <div className="space-y-8">
                <div className="flex gap-6">
                   <div className="h-20 w-20 rounded-3xl overflow-hidden bg-[#111224] border border-white/10 flex-shrink-0 relative">
                      <Image src={provider.profile_image || "/avatars/provider1.png"} fill alt="Provider" className="object-cover" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xl font-bold font-manrope tracking-tighter">{provider.name}</p>
                      <p className="text-xs font-black uppercase tracking-widest text-[#BACCB3]">{provider.category} Specialization</p>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex items-center justify-between text-zinc-600">
                      <span className="text-[10px] font-black uppercase tracking-widest">Resonance Interval</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Mar {date} — {slot}</span>
                   </div>
                   <div className="flex items-center justify-between text-zinc-600">
                      <span className="text-[10px] font-black uppercase tracking-widest">Session Type</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Clinical Flow (60m)</span>
                   </div>
                   <div className="flex items-center justify-between text-zinc-600">
                      <span className="text-[10px] font-black uppercase tracking-widest">Platform Fee</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">No Platform Fee</span>
                   </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                   <p className="text-xs font-black uppercase tracking-widest text-[#D3C4B5]">Total Care Worth</p>
                   <p className="text-4xl font-extrabold font-manrope text-white">₹{price}</p>
                </div>

                <Link href="/book/confirmation">
                  <Button className="h-24 w-full rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-xs hover:shadow-glow shadow-[#D3C4B5]/10 active:scale-95 group transition-all">
                     Authorize Payment <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
             </div>
          </div>

          <div className="vessel bg-white/5 p-10 space-y-6 flex flex-col items-center text-center">
             <HelpCircle className="h-8 w-8 text-zinc-800" />
             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Need Sanctuary Assistance?</h4>
             <p className="text-xs font-medium text-zinc-600 italic">Our patient care architects are standing by to assist with your finalization.</p>
             <button className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3] hover:text-white pt-4">Start High-Priority Chat</button>
          </div>
       </div>
    </div>
  );
}
