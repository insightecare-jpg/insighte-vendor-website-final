"use client";

import React from 'react';
import { User, Plus, Edit2, ShieldCheck, Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function ChildrenColumn({ family }: { family: any }) {
  const children = family.children || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#d3c4b5]/10 flex items-center justify-center">
                <Heart className="h-4 w-4 text-[#d3c4b5]" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">Clinical Registry // Learners</h4>
        </div>
        <button className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#baccb3]/20 hover:text-[#baccb3] transition-all text-zinc-500">
           <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {children.length === 0 ? (
          <p className="text-[10px] text-zinc-600 italic py-4">No learners registered under this family identity.</p>
        ) : (
          children.map((child: any) => (
            <div key={child.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-[#d3c4b5]/20 transition-all">
               <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-[#111224] border border-white/5 flex items-center justify-center font-black italic text-[#d3c4b5] text-xs">
                        {child.name?.[0]}
                     </div>
                     <div>
                        <h5 className="text-xs font-black uppercase italic text-white tracking-tight">{child.name}</h5>
                        <p className="text-[8px] font-bold text-zinc-600 tracking-widest uppercase">{child.age || '—'} Years Old</p>
                     </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:text-white transition-all text-zinc-500">
                     <Edit2 className="h-3 w-3" />
                  </button>
               </div>

               <div className="flex flex-wrap gap-1.5">
                  {child.services_needed?.map((s: string, i: number) => (
                    <Badge key={i} className="bg-[#baccb3]/10 text-[#baccb3] border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
                       {s}
                    </Badge>
                  ))}
               </div>
               
               {child.clinical_notes && (
                  <p className="mt-3 text-[10px] text-zinc-500 leading-relaxed italic line-clamp-2">
                     "{child.clinical_notes}"
                  </p>
               )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
