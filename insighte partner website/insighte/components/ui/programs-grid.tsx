"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Program {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

export function ProgramsGrid() {
  const supabase = createClient();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchPrograms() {
      const { data, error } = await supabase
        .from("curations")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        setPrograms(data);
      }
      setLoading(false);
    }
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-[#1d1e31]/50 animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4 text-zinc-600 italic">
        <Package className="h-12 w-12 opacity-20" />
        <p>No curated programs detected in the sanctuary database.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {programs.map((program) => (
        <Link 
          key={program.id} 
          href={`/programs/${program.id}`}
          className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 hover:border-white/20 transition-all duration-700 hover:scale-[1.02]"
        >
          {/* Maven-style Dot Indicator */}
          <div className="absolute top-6 left-6 z-20 flex items-center justify-center h-4 w-4">
             <div className={cn("absolute inset-0 rounded-full blur-[4px] opacity-60 bg-[#D3C4B5]")}></div>
             <div className={cn("relative h-2 w-2 rounded-full bg-[#D3C4B5]")}></div>
          </div>

          {program.image_url && !imageErrors[program.id] ? (
            <Image 
              src={program.image_url}
              alt={program.title}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.05] group-hover:scale-100 opacity-60 group-hover:opacity-100"
              onError={() => setImageErrors(prev => ({ ...prev, [program.id]: true }))}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
               <Package className="h-20 w-20 text-zinc-900" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b0c1f] via-[#0b0c1f]/40 to-transparent z-10 transition-opacity duration-700 opacity-80 group-hover:opacity-100"></div>

          <div className="absolute bottom-8 left-8 right-8 z-20">
            <Badge className="bg-black/60 text-[#D3C4B5] border-none px-3 py-1 rounded-full text-[7px] font-black tracking-widest uppercase mb-3">
               {program.category}
            </Badge>
            <h3 className="text-2xl font-black font-manrope leading-tight text-white tracking-tighter uppercase italic">{program.title}</h3>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#BACCB3] opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-700 delay-150">
               Explore Protocol <Plus className="w-3 h-3" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
    {children}
  </span>
);

