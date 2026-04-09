
"use client";

import React from "react";
import Link from "next/link";
import { 
  Heart, 
  Smile, 
  GraduationCap, 
  Palette, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const VERTICALS = [
  {
    id: "therapy",
    name: "Therapy",
    filter: "Therapy",
    icon: <Heart className="h-7 w-7" />,
    description: "Speech, occupational, behavior therapy and more for children of all ages.",
    color: "#D3C4B5",
    accent: "bg-[#D3C4B5]/10",
    textColor: "text-[#D3C4B5]",
    services: ["Speech Therapy", "OT", "Behavior Therapy", "Physiotherapy", "Play Therapy", "Special Ed"]
  },
  {
    id: "counselling",
    name: "Counselling",
    filter: "Counselling",
    icon: <Smile className="h-7 w-7" />,
    description: "Emotional support for children, families, and career guidance.",
    color: "#C8C4DB",
    accent: "bg-[#C8C4DB]/10",
    textColor: "text-[#C8C4DB]",
    services: ["Children's Counselling", "Family Sessions", "Online Support", "Career Guidance"]
  },
  {
    id: "tutoring",
    name: "Tutoring",
    filter: "Tutoring",
    icon: <GraduationCap className="h-7 w-7" />,
    description: "Academic support across all boards and development stages.",
    color: "#BACCB3",
    accent: "bg-[#BACCB3]/10",
    textColor: "text-[#BACCB3]",
    services: ["Home Tutoring", "CBSE/ICSE", "Special Education", "Early Learning"]
  },
  {
    id: "curricular",
    name: "Extra Curricular",
    filter: "Extra Curricular",
    icon: <Palette className="h-7 w-7" />,
    description: "Arts, music, dance, yoga and sports training for holistic growth.",
    color: "#D3C4B5",
    accent: "bg-[#D3C4B5]/10",
    textColor: "text-[#D3C4B5]",
    services: ["Art", "Music", "Yoga", "Sports", "Dance"]
  }
];

export function ExploreVerticals() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {VERTICALS.map((v) => (
        <Link 
          key={v.id} 
          href={`/specialists?category=${v.filter}`}
          className="group relative h-[380px] overflow-hidden rounded-3xl border border-white/5 bg-[#1D1E31]/40 backdrop-blur-3xl p-8 flex flex-col justify-between transition-all hover:bg-[#1D1E31]/60 hover:border-white/10 hover:-translate-y-1"
        >
          <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700", v.accent)} />
          
          <div className="space-y-6 relative z-10">
            <div className={cn("h-14 w-14 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-xl", v.accent, v.textColor)}>
              {v.icon}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold font-manrope tracking-tight text-white">{v.name}</h3>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed">{v.description}</p>
            </div>
          </div>

          <div className="space-y-5 relative z-10">
            <div className="flex flex-wrap gap-2">
              {v.services.slice(0, 3).map(s => (
                <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-zinc-500">{s}</span>
              ))}
              {v.services.length > 3 && (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-[#D3C4B5]">+{v.services.length - 3}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3 group-hover:gap-5 transition-all">
              <span className="text-xs font-bold text-[#D3C4B5]">Find Specialists</span>
              <ArrowRight className="h-4 w-4 text-[#D3C4B5]" />
            </div>
          </div>
          
          <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
             <ShieldCheck className={cn("h-5 w-5", v.textColor)} />
          </div>
        </Link>
      ))}
    </div>
  );
}
