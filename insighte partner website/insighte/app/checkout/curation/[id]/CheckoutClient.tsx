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
  HelpCircle,
  Package,
  Layers,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CurationCheckoutClient({ 
  curation 
}: { 
  curation: any 
}) {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock processing for premium feel
  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Navigate to success
      window.location.href = `/checkout/success?type=curation&id=${curation.id}`;
    }, 2000);
  };

  return (
    <div className="bg-[#111224] text-white min-h-screen font-sans selection:bg-[#d3c4b5]/30">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative">
        {/* Background Accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d3c4b5]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#c8c4db]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex items-center gap-2 mb-12 text-zinc-500 text-xs font-black uppercase tracking-widest animate-fade-in">
          <Link href="/services" className="hover:text-[#D3C4B5] transition-colors">Pathways</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-400">Checkout Signature</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* LEFT COLUMN - Checkout Flow */}
          <div className="lg:col-span-2 space-y-12 animate-fade-in-up">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-8 py-2 text-[10px] font-black uppercase tracking-widest">
                  Secure Onboarding
                </Badge>
                <div className="h-1.5 w-1.5 rounded-full bg-[#BACCB3] blur-[1px] animate-pulse" />
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] font-manrope">
                Unlock your <br/>
                <span className="text-[#D3C4B5]">Care Pathway</span>
              </h1>
            </div>

            <div className="vessel-high bg-[#191A2D] p-12 md:p-16 space-y-16 border border-white/5 rounded-3xl overflow-hidden relative">
              {/* Glass Reflection */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              {/* PARENT INFORMATION */}
              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#BACCB3]/20 flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#BACCB3]" />
                  </div>
                  <h3 className="text-2xl font-black font-manrope tracking-tighter uppercase italic text-zinc-600">Lighthouse Account</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D3C4B5]">Guardian Name</p>
                    <Input placeholder="Midhun Noble" className="h-16 w-full rounded-full bg-white/5 border border-white/10 px-8 text-sm focus:border-[#D3C4B5]/40 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D3C4B5]">Direct Signal (Email)</p>
                    <Input placeholder="midhun@insighte.com" className="h-16 w-full rounded-full bg-white/5 border border-white/10 px-8 text-sm focus:border-[#D3C4B5]/40 transition-all" />
                  </div>
                </div>
              </div>

              {/* PAYMENT ARCHITECTURE */}
              <div className="space-y-10 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#D3C4B5]/20 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-[#D3C4B5]" />
                    </div>
                    <h3 className="text-2xl font-black font-manrope tracking-tighter uppercase italic text-zinc-600">Financial Bridge</h3>
                  </div>
                  <div className="flex h-10 items-center rounded-full bg-white/5 px-4 border border-white/10">
                    <Lock className="h-3 w-3 text-zinc-500 mr-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">256-Bit SSL</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: "razorpay", label: "Razorpay (UPI/Card)", icon: <CreditCard className="h-5 w-5" /> },
                    { id: "netbanking", label: "Direct Vault Flow", icon: <ShieldCheck className="h-5 w-5" /> }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id)}
                      className={cn(
                        "flex items-center justify-between px-10 h-20 rounded-[32px] transition-all duration-500 border group",
                        paymentMethod === opt.id 
                          ? "bg-[#D3C4B5] text-[#382F24] border-transparent shadow-2xl scale-[1.02]" 
                          : "bg-white/5 text-zinc-400 border-white/5 hover:border-white/20"
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                      <div className={cn("group-hover:scale-110 transition-transform", paymentMethod === opt.id ? "text-[#382F24]" : "text-zinc-600")}>
                        {opt.icon}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-10 rounded-[40px] bg-[#111224] border border-white/5 space-y-6">
                  <div className="flex items-start gap-6">
                     <div className="mt-1">
                        <ShieldAlert className="h-6 w-6 text-[#BACCB3]" />
                     </div>
                     <div className="space-y-2">
                        <p className="text-sm font-bold text-white">Trust Assurance Policy</p>
                        <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                          Insighte protects your developmental investment. We use industry-leading encryption and 
                          advanced fraud protection to ensure your sanctuary remains private.
                        </p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Summary Pane */}
          <div className="lg:col-span-1 space-y-8 animate-fade-in-up stagger-2">
            <div className="vessel bg-[#191A2D] p-10 space-y-12 border border-white/5 rounded-[40px] sticky top-32">
              <div className="space-y-2">
                <Badge className="bg-[#D3C4B5]/10 text-[#D3C4B5] border-none rounded-full px-4 py-1 text-[8px] font-black uppercase tracking-widest mb-4">
                  Invoice Architecture
                </Badge>
                <h2 className="text-4xl font-extrabold font-manrope tracking-tighter leading-none">Investment <br/>Summary</h2>
              </div>
              
              <div className="space-y-8">
                <div className="flex gap-6 items-center">
                  <div className="h-24 w-24 rounded-3xl overflow-hidden bg-[#111224] border border-white/10 flex-shrink-0 relative group">
                    {curation.image_url ? (
                      <Image src={curation.image_url} fill alt={curation.title} className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#d3c4b5]/20 to-[#c8c4db]/10">
                        <Package className="w-8 h-8 text-[#D3C4B5]" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold font-manrope tracking-tighter text-white">{curation.title}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">{curation.category}</p>
                  </div>
                </div>

                <div className="space-y-5 pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Program Tier</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Institutional Quality</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Access Type</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Full Pathway Unlock</span>
                  </div>
                  {curation.features && (
                    <div className="pt-4 space-y-3">
                      {curation.features.slice(0, 3).map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-[#BACCB3]" />
                          <span className="text-[10px] text-zinc-400 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-10 border-t border-white/5 flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D3C4B5]">One-Time Invest</p>
                    <p className="text-5xl font-extrabold font-manrope text-white">₹{curation.price.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-500 mb-2 italic">INR</p>
                </div>

                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="h-24 w-full rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-xs hover:shadow-glow shadow-[#D3C4B5]/20 active:scale-[0.98] group transition-all relative overflow-hidden"
                >
                  <span className={cn("relative z-10 flex items-center justify-center", isProcessing ? "opacity-0" : "opacity-100 transition-opacity duration-300")}>
                    Authorize Signature <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {isProcessing && (
                     <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-6 h-6 border-2 border-[#382F24] border-t-transparent rounded-full animate-spin"></div>
                     </div>
                  )}
                </Button>
                
                <p className="text-[10px] text-zinc-600 font-bold text-center leading-relaxed italic">
                  By authorizing, you confirm adherence to the <br/>
                  <span className="text-zinc-500 underline underline-offset-4 cursor-pointer">Sanctuary Terms of Service</span>
                </p>
              </div>
            </div>

            <div className="vessel bg-white/5 p-12 space-y-6 flex flex-col items-center text-center rounded-[40px] border border-white/5">
              <div className="w-12 h-12 rounded-full bg-[#111224] border border-white/10 flex items-center justify-center">
                <HelpCircle className="h-6 w-6 text-zinc-500" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Concierge Support</h4>
              <p className="text-xs font-medium text-zinc-500 italic leading-relaxed">
                Need verification on this pathway? <br/>Our architects are standing by for a high-priority signal.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3] hover:text-white pt-4 transition-colors">Start Encrypted Chat</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
