"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AvailabilitySection({ specialist }: { specialist: any }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return (
    <div className="bg-[#191a2d]/60 rounded-[3rem] border border-white/5 p-12 space-y-12 shadow-3xl">
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-1.5 rounded-full bg-[#D3C4B5]" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">SECTION 03 // CLINICAL AVAILABILITY & SCHEDULING GRID</h2>
      </div>

      <div className="space-y-8">
        <div className="bg-[#111224] rounded-[2.5rem] border border-white/5 p-8 overflow-hidden">
            <div className="grid grid-cols-7 gap-4">
                {days.map((day) => (
                    <div key={day} className="space-y-4 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 italic">{day}</span>
                        <div className="h-[200px] w-full bg-white/[0.02] rounded-2xl border border-white/5 p-2 space-y-2">
                            {/* MOCK SLOTS */}
                            <div className="h-8 w-full bg-[#BACCB3]/10 border border-[#BACCB3]/10 rounded-lg flex items-center justify-center text-[8px] font-black text-[#BACCB3] uppercase italic">09:00 AM</div>
                            <div className="h-8 w-full bg-[#BACCB3]/10 border border-[#BACCB3]/10 rounded-lg flex items-center justify-center text-[8px] font-black text-[#BACCB3] uppercase italic">11:30 AM</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] italic flex items-center gap-2">
                <Lock className="h-3 w-3" /> Availability Sovereignty Notice
            </p>
            <p className="text-[9px] text-[#D3C4B5]/40 leading-relaxed font-bold uppercase tracking-tight italic flex-1 max-w-lg text-center md:text-left">Availability is exclusively managed by the specialist from their dashboard. Admin viewing is read-only to prevent clinical scheduling conflicts.</p>
            <button className="h-10 px-6 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-2">
                <Calendar className="h-3 w-3" /> View Comprehensive Schedule
            </button>
        </div>
      </div>
    </div>
  );
}
