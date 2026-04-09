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
        <section className="px-6 max-w-7xl mx-auto -mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Main Info Card */}
             <div className="lg:col-span-2 p-12 rounded-[48px] bg-[#16172B] border border-white/5 shadow-2xl space-y-12">
                <div>
                   <h2 className="text-3xl font-bold uppercase tracking-tighter italic mb-8">What we provide</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map(svc => (
                        <div key={svc} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                           <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10" style={{ color: accentColor }}>
                              <CheckCircle2 size={16} />
                           </div>
                           <span className="text-sm font-bold uppercase tracking-wide">{svc}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div>
                   <h2 className="text-3xl font-bold uppercase tracking-tighter italic mb-8">Core Features</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {features.map(f => (
                        <div key={f.title} className="space-y-3">
                           <h4 className="font-black text-[#8b7ff0] uppercase text-[10px] tracking-widest">{f.title}</h4>
                           <p className="text-zinc-400 text-sm leading-relaxed">{f.description}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Side Enquiry Card */}
             <div className="p-10 rounded-[48px] bg-white text-black flex flex-col justify-between">
                <div className="space-y-8">
                   <div className="h-16 w-16 rounded-3xl bg-[#0d0f1a] text-white flex items-center justify-center">
                      <ShieldCheck size={32} />
                   </div>
                   <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic">
                      Ready to start the journey?
                   </h3>
                   <p className="font-medium opacity-60">
                      Our intake specialists are available for a 1:1 clinical consultation today.
                   </p>
                </div>

                <div className="space-y-4 pt-10">
                   <Link href="/book" className="w-full py-6 rounded-2xl bg-black text-white font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[#8b7ff0] transition-colors">
                      Book Now <ArrowUpRight size={18} />
                   </Link>
                   <button className="w-full py-6 rounded-2xl bg-black/5 border border-black/10 text-black font-black uppercase text-xs tracking-widest hover:bg-black/10 transition-colors">
                      Enquire via WhatsApp
                   </button>
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
