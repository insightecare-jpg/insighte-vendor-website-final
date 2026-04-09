"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  CreditCard, 
  ArrowRight, 
  ArrowDownCircle, 
  FileText, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Zap, 
  History, 
  Settings,
  MoreVertical,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const MOCK_INVOICES = [
  { id: "INV-001", date: "28 Mar 2026", service: "Special Education", amount: "1,200 INR", status: "PAID" },
  { id: "INV-002", date: "20 Mar 2026", service: "Shadow Teaching", amount: "8,400 INR", status: "PAID" },
  { id: "INV-003", date: "15 Mar 2026", service: "Parent Coaching", amount: "2,000 INR", status: "PAID" },
  { id: "INV-004", date: "10 Mar 2026", service: "Diagnostic Intake", amount: "0 INR", status: "COMPLIMENTARY" },
];

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen-safe flex-col bg-zinc-950 font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 px-4 pt-32 pb-32 sm:px-6">
        <div className="mx-auto max-w-7xl animate-fade-in-up">
           
           {/* HEADER - BILLING INFRASTRUCTURE */}
           <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-6">
                 <Badge variant="outline" className="w-fit py-1.5 px-4 font-black tracking-widest text-[9px] uppercase bg-white/5 text-zinc-400 border-white/10 backdrop-blur-md">
                    <CreditCard className="mr-2 h-3.5 w-3.5 text-success" /> Secure Care Wallet
                 </Badge>
                 <h1 className="text-5xl font-black leading-tight tracking-tighter text-white sm:text-7xl lg:text-9xl">
                    Payout <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/70 to-white/30 italic">Matrix.</span>
                 </h1>
                 <p className="text-xl font-medium text-zinc-500 max-w-2xl leading-relaxed">
                    View your institutional ledger, download clinical invoices, and manage your automated payment protocols.
                 </p>
              </div>

              <div className="flex items-center gap-4">
                 <Button className="h-20 rounded-[32px] bg-white text-black px-12 text-xs font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                    <ArrowDownCircle className="mr-3 h-5 w-5 group-hover:-translate-y-1 transition-transform" /> Add Care Funds
                 </Button>
              </div>
           </div>

           {/* BILLING GRID */}
           <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-12 animate-fade-in-up stagger-2">
              
              {/* PRIMARY FEED - WALLET STATS */}
              <div className="flex flex-col gap-10 lg:col-span-8">
                 
                 <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <Card className="group relative overflow-hidden rounded-[56px] border border-white/5 bg-white/[0.02] p-12 transition-all hover:bg-white/[0.04] shadow-2xl">
                       <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-primary/10 blur-[100px] transition-colors group-hover:bg-primary/20" />
                       <div className="mb-10 flex flex-col gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Available Balance</span>
                          <span className="text-7xl font-black tracking-tighter text-white">8,400 <span className="text-2xl opacity-20">INR</span></span>
                       </div>
                       <Button variant="ghost" className="h-14 w-full rounded-2xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                          Automated Protocol Enabled
                       </Button>
                    </Card>

                    <Card className="group relative overflow-hidden rounded-[56px] border border-white/5 bg-zinc-900/50 p-12 transition-all hover:bg-zinc-900/70 shadow-2xl backdrop-blur-3xl">
                       <div className="mb-10 flex flex-col gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Active Payout Shield</span>
                          <span className="text-5xl font-black tracking-tighter text-white italic">Razorpay Vanguard</span>
                       </div>
                       <div className="flex items-center gap-4 py-4 px-6 rounded-3xl bg-success/5 border border-success/10 text-success text-[10px] font-black uppercase tracking-widest">
                          <ShieldCheck className="h-5 w-5 fill-success/5" /> Verified Ledger
                       </div>
                       <Button variant="link" className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all self-start">Manage Payment Methods —{">"}</Button>
                    </Card>
                 </div>

                 {/* INVOICE TABLE ARCHITECTURE */}
                 <Card className="rounded-[56px] border border-white/5 bg-white/[0.01] p-12 shadow-inner overflow-hidden">
                    <div className="mb-12 flex items-center justify-between">
                       <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Institutional Ledger</h3>
                       <Button variant="outline" className="h-10 rounded-full border border-white/10 bg-white/5 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white hover:text-black">Request Full Audit</Button>
                    </div>

                    <div className="flex flex-col gap-4">
                       {MOCK_INVOICES.map(invoice => (
                          <div key={invoice.id} className="group flex flex-col md:flex-row md:items-center gap-6 rounded-[32px] border border-transparent p-6 transition-all hover:border-white/10 hover:bg-white/[0.02] cursor-pointer">
                             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-white/10 text-zinc-600 transition-all group-hover:bg-primary group-hover:text-white">
                                <FileText className="h-6 w-6" />
                             </div>
                             
                             <div className="flex flex-1 flex-col gap-1">
                                <div className="flex items-center gap-3">
                                   <span className="text-xl font-black tracking-tighter text-white">{invoice.service}</span>
                                   <Badge variant="outline" className="h-5 border-white/5 bg-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-500 italic">{invoice.id}</Badge>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 italic">{invoice.date}</span>
                             </div>

                             <div className="flex items-center justify-between md:justify-end gap-12">
                                <span className="text-2xl font-black tracking-tighter text-white italic">{invoice.amount}</span>
                                <div className="flex items-center gap-4">
                                   <Badge className={cn(
                                     "h-7 rounded-full px-4 text-[8px] font-black uppercase tracking-widest border-none",
                                      invoice.status === "PAID" ? "bg-success/10 text-success" : "bg-primary/20 text-primary"
                                   )}>
                                      {invoice.status}
                                   </Badge>
                                   <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl bg-white/5 border border-white/5 text-zinc-600 hover:text-white hover:bg-white/10 transition-all">
                                      <Download className="h-4 w-4" />
                                   </Button>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </Card>
              </div>

              {/* ASIDE - QUICK OPTIONS */}
              <aside className="lg:col-span-4 sticky top-28 flex flex-col gap-10">
                 
                 <Card className="rounded-[56px] border border-white/5 bg-zinc-900/50 p-12 shadow-2xl backdrop-blur-xl">
                    <h3 className="mb-10 text-2xl font-black uppercase tracking-tighter text-white">Tax Protocols.</h3>
                    <div className="flex flex-col gap-8">
                       <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Financial Integration</span>
                          <h4 className="text-2xl font-black text-white italic">TDS Management</h4>
                       </div>
                       <p className="text-sm font-medium text-zinc-500 leading-relaxed">Automatic GST/TDS calculation linked to your medical insurance claim profile.</p>
                       <Button className="h-16 w-full rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-xl">
                          Link Medical Profile
                       </Button>
                    </div>
                 </Card>
                 
                 <div className="rounded-[56px] bg-primary p-12 text-white relative overflow-hidden group border border-white/10 cursor-pointer shadow-2xl shadow-primary/20">
                    <Sparkles className="mb-8 h-12 w-12 text-white fill-white/10 animate-pulse" />
                    <h4 className="text-4xl font-black leading-[0.9] tracking-tighter text-white uppercase italic">Subscription?</h4>
                    <p className="mt-4 text-md font-medium text-white/60 leading-relaxed max-w-sm">Institutional families benefit from 15% lower payouts on long-term cognitive modules.</p>
                    <Button className="mt-8 h-20 w-full rounded-[30px] bg-white text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all">
                       Explore Elite Memberships
                    </Button>
                 </div>
              </aside>

           </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
