"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProviderTestimonials() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
            Expert Reputation // Feedback
          </Badge>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter italic uppercase text-white leading-none">
            Public <br/> <span className="text-[#BACCB3]">Proof.</span>
          </h1>
        </div>
        
        <div className="vessel bg-[#1D1E31]/50 border border-white/5 p-6 rounded-3xl flex items-center gap-4">
           <div className="h-10 w-10 rounded-xl bg-[#BACCB3]/20 flex items-center justify-center text-[#BACCB3]">
              <Star className="h-5 w-5 fill-current" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Expert Rating</p>
              <p className="text-xl font-black text-white italic">4.9 <span className="text-xs text-zinc-600">/ 5.0</span></p>
           </div>
        </div>
      </div>

      {/* FEEDBACK GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* TESTIMONIAL LIST */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black italic uppercase tracking-tight">Recent Feedback</h3>
              <div className="flex gap-2">
                 <Badge className="bg-[#BACCB3] text-[#111224] rounded-full px-4 font-black text-[8px] uppercase">All</Badge>
                 <Badge className="bg-white/5 text-zinc-500 rounded-full px-4 font-black text-[8px] uppercase">Pending Review</Badge>
              </div>
           </div>

           <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                 <div key={item} className="vessel bg-[#111224] border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-8 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Quote className="h-20 w-20 text-[#BACCB3]" />
                    </div>
                    
                    <div className="flex items-start gap-6 mb-8 relative z-10">
                       <div className="h-16 w-16 rounded-2xl bg-[#0d0f1a] border border-white/5 flex items-center justify-center text-zinc-700">
                          <MessageSquare className="h-8 w-8" />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-xl font-black italic uppercase tracking-tight text-white">Parent of Ria S.</h4>
                          <div className="flex gap-1">
                             {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3 w-3 fill-[#BACCB3] text-[#BACCB3]" />)}
                          </div>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-[#BACCB3] mt-1 italic">Applied Behavior Analysis // Session #8</p>
                       </div>
                    </div>

                    <p className="text-sm font-medium leading-relaxed text-zinc-400 mb-10 relative z-10 italic">
                       "Dr. Sarah has been a consistent lighthouse for our family. Her approach to sensory dysregulation is both empathetic and clinically precise. We've seen significant progress in Ria's social engagement over the last 3 months."
                    </p>

                    <div className="flex items-center justify-between relative z-10 pt-8 border-t border-white/5">
                       <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#BACCB3]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Verified Session Feedback</span>
                       </div>
                       <span className="text-[10px] font-bold text-zinc-800 uppercase italic">Apr 08, 2026</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* IDENTITY REPUTATION */}
        <div className="lg:col-span-4 space-y-12">
            <div className="bg-[#BACCB3] p-12 rounded-[3.5rem] text-[#111224] space-y-8">
               <ShieldCheck className="h-12 w-12" />
               <div className="space-y-2">
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Trust <br/> Verified.</h3>
                  <p className="text-xs font-bold opacity-80 leading-relaxed italic">
                    94% of sessions conducted by you result in positive feedback. This increases your visibility in the "Top Pick" section.
                  </p>
               </div>
               <div className="h-1 w-full bg-[#111224]/20 rounded-full" />
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span>Top Expert Status</span>
                  <span>9.2/10</span>
               </div>
            </div>

            <div className="bg-[#111224] border border-white/5 p-10 rounded-[3rem] space-y-10">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500">
                     <Clock className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-black italic uppercase tracking-tight">Feedback Policies</h4>
               </div>
               
               <div className="space-y-6">
                  <p className="text-xs text-zinc-600 leading-relaxed font-bold">
                    Testimonials are automatically verified through session attendance. 
                    <br/><br/>
                    Admins reserve the right to audit feedback to maintain community standards and integrity.
                  </p>
                  <Button variant="outline" className="w-full h-14 rounded-2xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                    Report Issue
                  </Button>
               </div>
            </div>
        </div>
      </section>
    </div>
  );
}
