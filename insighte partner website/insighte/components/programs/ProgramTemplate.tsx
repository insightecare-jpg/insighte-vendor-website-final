"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
  ArrowRight, CheckCircle2, Star, ShieldCheck, 
  MapPin, Clock, Users, ArrowUpRight, MessageCircle 
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
}

interface Benefit {
  title: string;
  description: string;
}

interface ProgramTemplateProps {
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  services: string[];
  features: Feature[];
  process: string[];
  benefits: Benefit[];
  experts: any[];
  accentColor: string;
}

export default function ProgramTemplate({
  title, subtitle, heroImage, description, services, features, process, benefits, experts, accentColor
}: ProgramTemplateProps) {
  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white selection:bg-[#8b7ff0] selection:text-white">
      <Navbar />
      
      <main className="pt-24 pb-40">
        {/* HERO SECTION */}
        <section className="relative h-[70vh] flex items-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src={heroImage} alt={title} className="w-full h-full object-cover opacity-30 grayscale-[30%]" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1a] via-[#0d0f1a]/60 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f1a] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-3xl"
             >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest mb-6" style={{ color: accentColor }}>
                   <Star size={14} fill="currentColor" /> {subtitle}
                </div>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase italic mb-8 leading-[0.9]">
                   {title.split(' ').map((word, i) => (
                     <span key={i} className={i % 2 !== 0 ? "text-transparent" : ""} style={i % 2 !== 0 ? { WebkitTextStroke: '1px rgba(255,255,255,0.3)' } : {}}>{word} </span>
                   ))}
                </h1>
                <p className="text-xl text-zinc-400 font-medium max-w-xl leading-relaxed">
                   {description}
                </p>
             </motion.div>
          </div>
        </section>

        {/* SERVICES & FEATURES */}
        <section className="px-6 max-w-7xl mx-auto -mt-32 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             {/* Main Info Card */}
             <div className="lg:col-span-8 p-12 lg:p-16 rounded-[4rem] bg-zinc-900/50 backdrop-blur-3xl border border-white/10 shadow-3xl space-y-16">
                <div className="space-y-10">
                   <div className="space-y-2">
                      <span className="text-[10px] font-black text-[#8b7ff0] uppercase tracking-[0.4em]">Scope</span>
                      <h2 className="text-4xl font-black uppercase tracking-tighter italic">Clinical <span className="text-zinc-500">Provisions.</span></h2>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map(svc => (
                        <div key={svc} className="flex items-center gap-5 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all group">
                           <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#8b7ff0]/10 text-[#8b7ff0] group-hover:scale-110 transition-transform">
                              <CheckCircle2 size={20} />
                           </div>
                           <span className="text-xs font-black uppercase tracking-widest text-[#D3C4B5]">{svc}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-10 pt-16 border-t border-white/5">
                   <div className="space-y-2">
                       <span className="text-[10px] font-black text-[#5DCAA5] uppercase tracking-[0.4em]">Mechanics</span>
                       <h2 className="text-4xl font-black uppercase tracking-tighter italic">Core <span className="text-zinc-500">Framework.</span></h2>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {features.map(f => (
                        <div key={f.title} className="space-y-4">
                           <h4 className="font-black text-white uppercase text-xs tracking-[0.2em] italic border-b border-white/5 pb-2 inline-block">{f.title}</h4>
                           <p className="text-zinc-400 text-sm leading-relaxed font-medium italic opacity-80">{f.description}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Side Action Card */}
             <div className="lg:col-span-4 p-12 rounded-[4rem] bg-white text-black flex flex-col justify-between shadow-4xl transform lg:rotate-1">
                <div className="space-y-10">
                   <div className="h-20 w-20 rounded-[2rem] bg-black text-white flex items-center justify-center shadow-2xl">
                      <ShieldCheck size={40} />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-5xl font-black uppercase tracking-tighter italic leading-[0.8]">
                         Initiate <br/><span className="text-zinc-400">Intake.</span>
                      </h3>
                      <p className="font-medium text-zinc-600 italic">
                         Connect with our clinical lead to map this program to your child's specific IEP goals.
                      </p>
                   </div>
                </div>

                <div className="space-y-4 pt-16">
                   <Link href="/book" className="w-full h-20 rounded-[2rem] bg-black text-white font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-[#8b7ff0] transition-all shadow-xl group active:scale-95">
                      Secure Slot <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                   </Link>
                   <button className="w-full h-20 rounded-[2rem] bg-white border-2 border-black/5 text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-black/5 transition-all text-center">
                      Enquire via WhatsApp
                   </button>
                   <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest pt-4">
                      <Clock className="h-4 w-4" /> Responds in &lt; 2 Hours
                   </div>
                </div>
             </div>
          </div>
        </section>


        {/* PROCESS FLOW */}
        <section className="py-40 px-6 max-w-7xl mx-auto">
           <div className="text-center mb-20">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8b7ff0] mb-4 block">The Methodology</span>
              <h2 className="text-5xl font-bold uppercase italic tracking-tighter">How to get started</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {process.map((step, i) => (
                <div key={i} className="relative group">
                   <div className="text-8xl font-black italic text-white/5 absolute -top-10 -left-6 group-hover:text-white/10 transition-colors">0{i+1}</div>
                   <div className="relative z-10 pt-10 space-y-4">
                      <div className="h-1 w-12 bg-[#8b7ff0]" />
                      <p className="text-lg font-bold text-white uppercase tracking-tight">{step}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* BENEFITS */}
        <section className="py-20 px-6 max-w-7xl mx-auto bg-white/5 rounded-[64px] border border-white/5 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#8b7ff0]/10 blur-[120px] -mr-48 -mt-48" />
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 p-12 lg:p-20">
              <div className="space-y-8">
                 <h2 className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter leading-none italic">
                    The Clinical <br/>Benefits
                 </h2>
                 <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
                    Outcome-driven metrics ensure that every session contributes to the child's long-term autonomy and family's well-being.
                 </p>
              </div>
              <div className="grid grid-cols-1 gap-12">
                 {benefits.map(b => (
                   <div key={b.title} className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                         <h4 className="text-xl font-bold uppercase italic tracking-tight">{b.title}</h4>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed pl-5">{b.description}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* TOP EXPERTS CAROUSEL (Simplified for now) */}
        <section className="py-40 px-6">
           <div className="max-w-7xl mx-auto mb-20 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8b7ff0] mb-4 block">Recommended Specialists</span>
                <h2 className="text-5xl font-bold uppercase italic tracking-tighter">Top Experts</h2>
              </div>
              <Link href="/specialists" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                 View All Specialists →
              </Link>
           </div>
           
           <div className="max-w-7xl mx-auto overflow-hidden">
              <div className="flex gap-6 overflow-x-auto pb-12 no-scrollbar">
                 {experts.map((e, i) => (
                   <div key={i} className="flex-none w-[350px] aspect-[3/4] rounded-[40px] bg-[#16172B] border border-white/5 p-8 flex flex-col justify-end group cursor-pointer hover:border-[#8b7ff0]/40 transition-all">
                      <div className="absolute inset-0 z-0">
                         <img src={e.image} alt={e.name} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-all duration-700" />
                         <div className="absolute inset-0 bg-gradient-to-t from-[#16172B] via-transparent to-transparent" />
                      </div>
                      <div className="relative z-10 space-y-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#8b7ff0]">{e.role}</span>
                         <h4 className="text-2xl font-bold uppercase italic">{e.name}</h4>
                         <p className="text-xs text-zinc-500 font-medium">{e.impact}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <Footer />
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
