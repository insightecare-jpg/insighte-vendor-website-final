"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ShieldCheck, Clock, ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function PartnerCard({ partner }: { partner: any }) {
  const {
    id,
    name,
    slug,
    profile_image,
    bio,
    specializations,
    location_type,
    city,
    experience_years,
    verified,
    rate,
    rating
  } = partner;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative bg-[#1d1e31]/20 backdrop-blur-3xl rounded-[3rem] border border-white/5 transition-all duration-700 hover:border-[#d3c4b5]/40 hover:bg-[#1d1e31]/60 flex flex-col h-full overflow-hidden shadow-2xl"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#BACCB3]/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Top Section: Visual & Quick Info */}
      <div className="relative p-8 pb-4 shrink-0 flex flex-col items-center gap-6">
        <div className="relative h-44 w-44 md:h-52 md:w-52 rounded-[2.5rem] overflow-hidden bg-zinc-900 border-[6px] border-[#111224] group-hover:rounded-[3.5rem] transition-all duration-1000 shadow-2xl z-10">
          <Image 
            src={profile_image || "/avatars/provider1.png"} 
            fill 
            alt={name} 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 grayscale group-hover:grayscale-0 transition-all duration-[2000ms]" 
          />
          {verified && (
            <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#BACCB3] flex items-center justify-center text-[#2A3326] shadow-xl border border-white/20 z-20">
               <ShieldCheck className="h-4 w-4" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center gap-2 z-10">
           <div className="text-3xl font-black font-manrope text-[#D3C4B5] tracking-tighter">₹{rate || 1800}</div>
           <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <Star className="h-3 w-3 text-amber-500 fill-current opacity-60" />
              <span className="text-[10px] font-black text-zinc-500">{rating || "4.9"}</span>
           </div>
        </div>
      </div>

      {/* Middle Section: Intelligence */}
      <div className="flex-grow flex flex-col p-8 pt-2 space-y-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
             <h3 className="text-3xl md:text-4xl font-manrope font-extrabold tracking-tighter text-white uppercase italic group-hover:text-[#D3C4B5] transition-colors duration-500 leading-none">{name}</h3>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D3C4B5]/60 italic">Clinical Specialist</span>
             <div className="h-1 w-1 rounded-full bg-white/20" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 truncate max-w-[150px]">{specializations?.[0] || "Specialist"}</span>
          </div>
        </div>
        
        <p className="text-xs md:text-sm text-zinc-600 leading-relaxed italic line-clamp-3 group-hover:text-[#F0E0D0] transition-colors duration-500">
          {bio || "Dedicated specialist providing neuro-affirmative care with high-precision clinical protocols designed for developmental growth."}
        </p>

        <div className="space-y-4">
           <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
              <Sparkles className="h-3 w-3 text-[#BACCB3]" /> 
              Clinical Core
           </div>
           <div className="flex flex-wrap gap-2">
              {specializations?.slice(0, 3).map((tag: string) => (
                <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-[#BACCB3] group-hover:border-[#D3C4B5]/30 transition-all shadow-sm">
                   {tag}
                </span>
              ))}
           </div>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6">
           <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-zinc-700">
              <div className="flex items-center gap-2 group-hover:text-[#BACCB3] transition-colors"><MapPin className="h-3 w-3" /> {city || "Global"}</div>
              <div className="flex items-center gap-2 group-hover:text-[#D3C4B5] transition-colors"><Clock className="h-3 w-3" /> {experience_years || 5}yr History</div>
           </div>
           
           <div className="flex items-center gap-3">
              <Link href={`/providers/${slug || id}`} className="flex-1">
                 <Button className="h-14 w-full rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[9px] hover:bg-white transition-all shadow-xl active:scale-95 group-hover:shadow-[#D3C4B5]/10">
                    Protocol Access <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
              </Link>
              <Button variant="ghost" className="h-14 w-14 rounded-full bg-white/5 text-zinc-500 hover:text-white border border-white/10 hover:bg-white/10 transition-all flex-shrink-0">
                 <Heart className="h-5 w-5" />
              </Button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
