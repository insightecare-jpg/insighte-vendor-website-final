"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  ChevronLeft,
  Clock, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DATES = [
  { day: "MON", date: "29", full: "Monday, Mar 29" },
  { day: "TUE", date: "30", full: "Tuesday, Mar 30" },
  { day: "WED", date: "31", full: "Wednesday, Mar 31" },
  { day: "THU", date: "01", full: "Thursday, Apr 1" },
  { day: "FRI", date: "02", full: "Friday, Apr 2" }
];

const SLOTS = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"];

export default function BookingClient({ provider }: { provider: any }) {
  const [selectedDate, setSelectedDate] = useState("29");
  const [selectedSlot, setSelectedSlot] = useState("11:30 AM");

  const price = provider.services?.[0]?.price || 1800;

  return (
    <div className="vessel-high bg-[#191A2D] p-12 md:p-20 space-y-20 border border-white/5">
       {/* DATE SELECTOR ARCHITECTURE */}
       <div className="space-y-12">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-black font-manrope tracking-tighter uppercase italic text-zinc-700">Chronicle Mapping</h3>
             <div className="flex gap-4">
                <button className="h-12 w-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-zinc-600 hover:text-white transition-all">
                   <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="h-12 w-12 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-zinc-600 hover:text-white transition-all">
                   <ChevronRight className="h-5 w-5" />
                </button>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
             {DATES.map((d, i) => (
               <button 
                  key={i}
                  onClick={() => setSelectedDate(d.date)}
                  className={cn(
                    "flex flex-col items-center justify-center h-48 rounded-[36px] transition-all duration-700 border relative overflow-hidden group",
                    selectedDate === d.date 
                      ? "bg-[#D3C4B5] text-[#382F24] border-transparent scale-105 shadow-3xl" 
                      : "bg-white/5 text-zinc-600 border-white/5 hover:border-white/10"
                  )}
               >
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity">{d.day}</p>
                  <p className="text-5xl font-extrabold font-manrope tracking-tighter">{d.date}</p>
                  {selectedDate === d.date && (
                    <div className="absolute -bottom-1 h-2 w-2 bg-[#382F24] rounded-full blur-[1px]" />
                  )}
               </button>
             ))}
          </div>
       </div>

       {/* SLOT SELECTOR ARCHITECTURE */}
       <div className="space-y-12">
          <h3 className="text-2xl font-black font-manrope tracking-tighter uppercase italic text-zinc-700">Sequence Intervals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
             {SLOTS.map((slot, i) => (
               <button 
                 key={i}
                 onClick={() => setSelectedSlot(slot)}
                 className={cn(
                   "h-16 rounded-[24px] flex items-center justify-center text-[11px] font-black uppercase tracking-widest transition-all border",
                   selectedSlot === slot 
                     ? "bg-[#D3C4B5] text-[#382F24] border-transparent shadow-2xl" 
                     : "bg-white/5 text-zinc-600 border-white/5 hover:border-white/10"
                 )}
               >
                  {slot}
               </button>
             ))}
          </div>
       </div>

       {/* SUMMARY & CHECKOUT --- WEIGHTED FOOTER */}
       <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-10">
             <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative flex-shrink-0 animate-pulse">
                <Sparkles className="h-8 w-8 text-[#D3C4B5]" />
             </div>
             <div className="space-y-2 text-zinc-500">
                <p className="text-xs font-black uppercase tracking-widest">Selected Resonance Interval</p>
                <p className="text-3xl font-extrabold font-manrope text-white">Mar {selectedDate} — {selectedSlot}</p>
                <div className="flex items-center gap-3 pt-2">
                   <Clock className="h-4 w-4" />
                   <span className="text-sm font-bold">Clinical Session Architecture (60m)</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-6 w-full md:w-auto">
             <div className="flex items-center justify-between md:justify-end gap-12 px-6">
                <div className="text-right space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Sanctuary Grade Care</p>
                   <p className="text-3xl font-extrabold font-manrope text-[#BACCB3]">₹{price}</p>
                </div>
             </div>
             <Link href={`/marketplace/checkout/${provider.id}?date=${selectedDate}&slot=${selectedSlot}`}>
               <Button className="h-24 px-20 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-xs hover:shadow-glow shadow-[#D3C4B5]/10 animate-pulse transition-all active:scale-95 group">
                  Secure Moment <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
               </Button>
             </Link>
          </div>
       </div>
    </div>
  );
}
