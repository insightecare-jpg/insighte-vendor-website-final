"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ShieldCheck, Sparkles, ArrowRight, Video, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Provider {
  id: string;
  slug?: string;
  name: string;
  avatar_url?: string | null;
  profile_image?: string | null;
  category?: string;
  specializations?: string[];
  services?: string[];
  experience_years?: number;
  location?: string;
  city?: string;
  mode?: string;
  session_modes?: string[];
  rating?: number;
  rating_avg?: number;
  review_count?: number;
  consultation_fee?: number;
  rate?: string | number;
  is_verified?: boolean;
  booking_count?: number;
  total_bookings?: number;
  bio?: string;
  provider_type?: string;
  first_session_price?: number;
  specialisations?: string[];
}

interface ProviderCardProps {
  provider: Provider;
  className?: string;
  priority?: boolean;
}

export function ProviderCard({ provider, className, priority = false }: ProviderCardProps) {
  const href = `/specialists/${provider.slug || provider.id}`;
  const rating = provider.rating_avg || provider.rating || 4.9;
  const bookings = provider.booking_count || provider.total_bookings || 120;
  const experience = provider.experience_years || 5;
  const price = provider.first_session_price || provider.consultation_fee || provider.rate || 999;
  const rawExpertise = (provider.specializations || provider.specialisations || provider.services || []);
  const expertise = rawExpertise.slice(0, 3).map(tag => typeof tag === 'object' ? (tag as any).title || (tag as any).name : tag);
  
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col min-h-[520px] h-full w-full overflow-hidden rounded-[2.5rem] bg-[#0d0f1a] border border-[#23263b] hover:border-[#8b7ff080] transition-all duration-700 hover:shadow-[0_48px_96px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {/* ── IMAGE SECTION (Taller portrait) ── */}
      <div className="relative h-[320px] w-full overflow-hidden">
        {(() => {
          const category = (provider.category || (provider as any).provider_type || "").toLowerCase();
          let fallback = "/images/experts/special_educator.png";
          if (category.includes("speech")) fallback = "/images/experts/speech_therapist.png";
          else if (category.includes("autism") || category.includes("aba")) fallback = "/images/experts/autism_specialist.png";
          else if (category.includes("counsel") || category.includes("behavior")) fallback = "/images/experts/behavioral_specialist.png";
          
          return (
            <Image
              src={provider.avatar_url || provider.profile_image || fallback}
              alt={provider.name}
              fill
              priority={priority}
              className="object-cover object-top transition-transform duration-[1.5s] group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallback;
              }}
            />
          );
        })()}
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1a] via-transparent to-black/20 opacity-100" />
        
        {/* Verification & Impact Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {provider.is_verified && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 text-[8px] font-black text-[#8b7ff0] uppercase tracking-[0.2em] shadow-2xl">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
              Verified Expert
            </div>
          )}
          {rating >= 4.8 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1d9e7515] backdrop-blur-3xl border border-[#1d9e7530] text-[8px] font-black text-[#5dcaa5] uppercase tracking-[0.2em] shadow-2xl">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Top Rated
            </div>
          )}
        </div>

        {/* Mode Indicator */}
        <div className="absolute bottom-5 right-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-3xl border border-white/5 shadow-2xl">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8b7ff0] animate-pulse shadow-[0_0_8px_#8b7ff0]" />
          <span className="text-[9px] font-black text-white/80 uppercase tracking-[0.1em]">
            {provider.mode === "Online" ? "Online Sessions" : "Home / Clinic"}
          </span>
        </div>
      </div>

      {/* ── IDENTITY & BIO (20%) ── */}
      <div className="px-7 pt-5 flex flex-col gap-2 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-[#c5b8f8] transition-colors duration-500 leading-tight">
              {provider.name}
            </h3>
            <p className="text-[10px] font-black text-[#8b7ff0] uppercase tracking-[0.2em] mt-1 opacity-70">
              {provider.provider_type || provider.category || "Consultant"}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10 shadow-lg" aria-label={`Rating: ${rating}`}>
            <Star className="w-3.5 h-3.5 text-[#ef9f27] fill-[#ef9f27]" aria-hidden="true" />
            <span className="text-sm font-black text-white">{rating}</span>
          </div>
        </div>

        <p className="text-[13px] text-[#8a8591] line-clamp-2 mt-2 leading-relaxed opacity-90 group-hover:text-[#b0aab8] transition-colors">
          {provider.bio || "Dedicated specialist providing personalized, neuro-affirming support for families through evidence-based practices."}
        </p>
      </div>

      {/* ── HIGH DENSITY FOOTER (40%) ── */}
      <div className="mt-auto px-7 pb-7 pt-4 bg-gradient-to-t from-white/[0.02] to-transparent">
        {/* Expertise Row (Compact - One Line) */}
        <div className="flex flex-wrap gap-2 mb-5">
          {expertise.map((tag) => (
            <div 
              key={tag} 
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] group-hover:bg-[#8b7ff010] group-hover:border-[#8b7ff040] transition-all duration-300"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#8b7ff0]" aria-hidden="true" />
              <span className="text-[10px] font-bold text-[#e8e2d8] tracking-tight">{tag}</span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between py-4 border-y border-white/5 mb-5 px-1">
          <div className="flex flex-col gap-0.5" aria-label={`Experience: ${experience} years`}>
            <span className="text-[8px] font-black text-[#8a8591] uppercase tracking-[0.2em]" aria-hidden="true">Experience</span>
            <span className="text-sm font-black text-white/90">{experience} Years</span>
          </div>
          <div className="flex flex-col gap-0.5 items-center" aria-label={`Impact: ${bookings} families helped`}>
            <span className="text-[8px] font-black text-[#8a8591] uppercase tracking-[0.2em]" aria-hidden="true">Impact</span>
            <span className="text-sm font-black text-white/90">{bookings}+ Families</span>
          </div>
          <div className="flex flex-col gap-0.5 items-end" aria-label={`Fee: ${price} rupees`}>
            <span className="text-[8px] font-black text-[#8a8591] uppercase tracking-[0.2em]" aria-hidden="true">Fee</span>
            <span className="text-sm font-black text-[#c5b8f8]">₹{price}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="relative group/btn">
          <div className="absolute inset-0 bg-[#8b7ff0] blur-[15px] opacity-20 group-hover/btn:opacity-40 transition-opacity" />
          <div className="relative w-full py-4 rounded-2xl bg-[#8b7ff0] text-[#0d0f1a] text-[11px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden" aria-label={`Consult Now with ${provider.name}`}>
            <span>Consult Now</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
            
            {/* Gloss shine effect */}
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000" />
          </div>
        </div>
      </div>

      {/* Decorative Gradients */}
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#8b7ff010] rounded-full blur-[100px] pointer-events-none group-hover:bg-[#8b7ff020] transition-all duration-[1s]" />
    </Link>
  );
}
