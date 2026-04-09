"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, HeartPulse, UserPlus, Briefcase, Award, Globe, Sparkles, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PartnersPage() {
  return (
    <div className="flex min-h-screen-safe flex-col bg-zinc-950">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-24 px-4 sm:px-6 overflow-hidden">
           <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full max-w-[1200px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
           
           <div className="mx-auto max-w-7xl flex flex-col items-center text-center">
              <Badge variant="outline" className="mb-6 py-2 px-5 font-black tracking-widest text-xs uppercase bg-primary/10 text-primary border-primary/20 backdrop-blur-md">
                <Zap className="mr-2 h-4 w-4 animate-pulse" /> Join the Vanguard
              </Badge>
              <h1 className="text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-9xl leading-[0.95] mb-8">
                 Scale your <br /><span className="text-zinc-500">Kindness.</span>
              </h1>
              <p className="max-w-2xl text-lg font-medium text-zinc-400 leading-relaxed mb-12">
                 Join the top 1% of clinical psychologists and special educators. Get access to an institutional scale platform, verified leads, and world-class management tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                 <Button size="lg" className="h-16 rounded-2xl bg-white text-black px-12 font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    Apply as Provider
                 </Button>
                 <Button size="lg" variant="ghost" className="h-16 rounded-2xl border border-white/10 bg-white/5 text-white px-12 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                    Center Partnership <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
              </div>
           </div>
        </section>

        {/* PARTNERSHIP STATS */}
        <section className="py-24 px-4 sm:px-6 relative z-10">
           <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {[
                   { label: "Families Waiting", val: "500+", icon: <Users className="h-6 w-6" /> },
                   { label: "Active Studios", val: "10+", icon: <Briefcase className="h-6 w-6 text-primary" /> },
                   { label: "Cities Presence", val: "15+", icon: <Globe className="h-6 w-6 text-accent" /> },
                   { label: "Payout Standards", val: "Top 5%", icon: <Award className="h-6 w-6 text-success" /> }
                 ].map((stat, i) => (
                   <div key={i} className="flex flex-col gap-4 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 shadow-inner">
                         {stat.icon}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-3xl font-black text-white tracking-tighter">{stat.val}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* WHY JOIN INSIGHTE? */}
        <section className="py-32 px-4 sm:px-6 border-t border-white/5">
           <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                 <div className="relative aspect-square rounded-[64px] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                    <Image 
                      src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200" 
                      alt="Provider Excellence" 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/20 to-transparent" />
                    <div className="absolute bottom-12 left-12 p-8 rounded-[32px] bg-white/5 backdrop-blur-3xl border border-white/10 max-w-xs shadow-2xl">
                       <h4 className="text-xl font-black text-white mb-4">Institutional Credibility.</h4>
                       <p className="text-sm font-medium text-zinc-400">Join the most respected network in the children's care industry.</p>
                    </div>
                 </div>

                 <div className="flex flex-col gap-12">
                    <div>
                       <h2 className="text-4xl sm:text-6xl font-black text-white leading-[0.95] tracking-tighter mb-8">Built for <br /><span className="text-zinc-500">Excellence.</span></h2>
                       <p className="text-lg font-medium text-zinc-400 leading-relaxed max-w-lg">
                          We don't just find you leads; we provide the entire operational backbone so you can focus on the child.
                       </p>
                    </div>

                    <div className="flex flex-col gap-6">
                       {[
                         { title: "Automated Billing & Payouts", desc: "Never track a payment again. Instant billing and verified ledger tracking." },
                         { title: "Smart Scheduling", desc: "Our proprietary engine manages your availability with precision across cities." },
                         { title: "Global Recognition", desc: "Be part of the Insighte vanguard, featured across premium family centers." }
                       ].map((feat, i) => (
                         <div key={i} className="flex gap-6 items-start group">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                               <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                               <h4 className="text-lg font-black text-white tracking-tight">{feat.title}</h4>
                               <p className="text-sm font-medium text-zinc-500">{feat.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CTA FOR REGISTRATION */}
        <section className="py-32 px-4 sm:px-6">
           <div className="mx-auto max-w-7xl relative overflow-hidden rounded-[48px] bg-primary p-12 sm:p-24 text-center shadow-[0_40px_100px_rgba(79,103,240,0.4)]">
              <div className="absolute top-0 right-0 h-full w-1/2 bg-white/5 skew-x-12 translate-x-1/2 -z-0" />
              <div className="relative z-10 flex flex-col items-center gap-10">
                 <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none italic">The future of <br/>care is here.</h2>
                 <p className="text-lg sm:text-xl font-medium text-white/80 max-w-xl mx-auto">
                   Start your partnership application today and someone from our clinical board will reach out within 48 hours.
                 </p>
                 <Button size="lg" className="h-16 rounded-2xl bg-black text-white px-12 font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all shadow-2xl">
                   Start Application Now
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { Users } from "lucide-react";
