"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TestimonialsSection({ specialist }: { specialist: any }) {
  return (
    <div className="bg-[#191a2d]/60 rounded-[3rem] border border-white/5 p-12 space-y-12 shadow-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-[#D3C4B5]" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">SECTION 07 // CLINICAL FEEDBACK & PUBLIC ENDORSEMENTS</h2>
        </div>
        <div className="flex gap-4">
            <button className="h-10 px-4 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" /> Pending Only
            </button>
        </div>
      </div>

      <div className="bg-[#111224] rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-white/5 h-16">
                    <th className="pl-8 text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">Family Parent</th>
                    <th className="px-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Rating</th>
                    <th className="px-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 max-w-sm">Testimonial Content</th>
                    <th className="px-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Approved</th>
                    <th className="pr-8 text-right text-[9px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                <tr className="h-24 hover:bg-white/[0.02] transition-colors">
                    <td className="pl-8">
                        <div className="flex flex-col">
                            <span className="text-sm font-black italic uppercase text-white tracking-tight">Rajesh Kumar</span>
                            <span className="text-[7px] font-bold text-zinc-600 italic">Apr 08, 2026</span>
                        </div>
                    </td>
                    <td className="px-6 text-center">
                        <div className="flex items-center justify-center gap-1 text-[#D3C4B5]">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                        </div>
                    </td>
                    <td className="px-6 max-w-sm">
                        <p className="text-[11px] text-[#c8c5cd] italic leading-relaxed line-clamp-2 italic">"Dr. Sharma's approach with Aryan was transformative. We saw immediate improvement in his focus and emotional regulation within two sessions."</p>
                    </td>
                    <td className="px-6 text-center">
                        <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none text-[8px] font-black italic">APPROVED</Badge>
                    </td>
                    <td className="pr-8 text-right">
                        <div className="flex justify-end gap-3">
                            <button className="h-10 px-4 rounded-xl bg-[#BACCB3]/10 text-[#BACCB3] hover:bg-[#BACCB3] hover:text-[#111224] text-[8px] font-black uppercase tracking-widest transition-all">Publish</button>
                            <button className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
}
