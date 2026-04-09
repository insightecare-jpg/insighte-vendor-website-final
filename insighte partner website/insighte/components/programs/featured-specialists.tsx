import React from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { ProviderCard } from "@/components/ui/provider-card";
import { Button } from "@/components/ui/button";
import type { Provider } from "@/types";

interface FeaturedSpecialistsProps {
  specialists: any[];
  category: string;
}


export function FeaturedSpecialists({ specialists, category }: FeaturedSpecialistsProps) {
  if (specialists.length === 0) return null;

  return (
    <section className="px-6 py-40 bg-[#111224] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#d3c4b5]/5 blur-[120px] -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#191a2d] border border-white/5">
              <Star className="w-3 h-3 text-[#baccb3] fill-[#baccb3]" />
              <span className="text-[10px] md:text-xs font-black text-[#baccb3] uppercase tracking-widest italic">Featured Selection</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-manrope font-extrabold tracking-tighter italic uppercase text-[#f0e0d0] leading-none">
              Top Rated <br /><span className="text-zinc-600">{category} Specialists.</span>
            </h2>
            <p className="text-lg text-zinc-500 italic max-w-xl">
              Connect with hand-vetted experts recognized for clinical excellence and neuro-affirming care in our {category} vertical.
            </p>
          </div>
          
          <Link href={`/specialists?category=${category}`} className="hidden md:block">
            <Button variant="ghost" className="group text-[#d3c4b5] hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all">
              View All {category} Specialists <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialists.slice(0, 3).map((specialist) => (
            <ProviderCard key={specialist.id} provider={specialist} />
          ))}
        </div>

        <div className="md:hidden pt-8">
          <Link href={`/specialists?category=${category}`} className="w-full">
            <Button className="w-full h-16 rounded-full bg-white/5 text-white border border-white/10 font-black uppercase tracking-widest text-xs">
              View All Specialists
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
