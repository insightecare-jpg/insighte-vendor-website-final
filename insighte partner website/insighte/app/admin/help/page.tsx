"use client";

import React from "react";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  BookOpen, 
  Video, 
  FileText,
  LifeBuoy,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminHelpPage() {
  return (
    <div className="space-y-16 pb-24 animate-fade-in-up">
       {/* HEADER */}
       <section className="flex flex-col lg:flex-row items-end justify-between gap-12">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
             <h1 className="text-8xl font-black font-manrope tracking-tighter leading-[0.85]">Sanctuary Support</h1>
             <p className="text-2xl text-zinc-600 font-medium italic">
                Guided by the doctrine. Find resources, tutorials, and direct access to our engineering team.
             </p>
          </div>

          <div className="vessel bg-[#1D1E31] p-3 rounded-full flex items-center gap-4 border border-white/5 w-full lg:max-w-md shadow-2xl">
             <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-600">
                <Search className="h-6 w-6" />
             </div>
             <Input 
                className="bg-transparent border-none text-xl font-manrope font-bold placeholder:text-zinc-800 focus-visible:ring-0" 
                placeholder="How do I review a provider?"
             />
          </div>
       </section>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 stagger-1">
          {[
            { icon: <BookOpen className="h-8 w-8 text-[#D3C4B5]" />, label: "Documentation", count: "48 Articles" },
            { icon: <Video className="h-8 w-8 text-[#BACCB3]" />, label: "Video Tutorials", count: "12 Guides" },
            { icon: <MessageSquare className="h-8 w-8 text-blue-400" />, label: "Live Chat", count: "Always Online" },
          ].map((card, i) => (
            <div key={i} className="vessel bg-[#1D1E31] p-12 space-y-8 border border-white/5 hover:border-white/10 transition-all group cursor-pointer overflow-hidden relative">
               <div className="h-16 w-16 rounded-[24px] bg-white/5 flex items-center justify-center relative z-10">
                  {card.icon}
               </div>
               <div className="space-y-2 relative z-10">
                  <h3 className="text-4xl font-extrabold font-manrope tracking-tighter">{card.label}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 truncate italic">{card.count} — Sanctuary Knowledge Base</p>
               </div>
               <div className="absolute top-0 right-0 h-24 w-24 bg-white/5 blur-[40px] rounded-full group-hover:scale-150 transition-transform" />
            </div>
          ))}
       </div>

       {/* FAQ / SYSTEM LOGS AREA */}
       <div className="vessel bg-[#1D1E31] p-12 space-y-12 border border-white/5 relative overflow-hidden group stagger-2">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-[#BACCB3]">
                <FileText className="h-6 w-6" />
             </div>
             <h3 className="text-4xl font-extrabold font-manrope tracking-tighter italic">Common Procedures</h3>
          </div>

          <div className="divide-y divide-white/5">
             {[
               "How do I override a provider verification status?",
               "Can I bulk-invite families from a CSV file?",
               "What defines a 'Critical' priority alert?",
               "How long does the background check typically take?",
             ].map((q, i) => (
               <button key={i} className="w-full flex items-center justify-between py-8 px-4 hover:bg-white/5 rounded-[24px] transition-all text-left">
                  <span className="text-2xl font-bold font-manrope tracking-tight text-white group-hover:text-[#D3C4B5] transition-colors">{q}</span>
                  <ChevronRight className="h-6 w-6 text-zinc-800" />
               </button>
             ))}
          </div>
       </div>

       {/* FOOTER CALL TO ACTION */}
       <div className="flex items-center justify-center pt-10">
          <Button className="h-20 px-16 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-glow glow-[#D3C4B5]/20 flex items-center gap-6">
             CONTACT SUPPORT <LifeBuoy className="h-6 w-6" />
          </Button>
       </div>
    </div>
  );
}
