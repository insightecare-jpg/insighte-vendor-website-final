"use client";

import React from "react";
import Link from "next/link";
import { 
  Heart, 
  Smile, 
  GraduationCap, 
  Palette, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Home as HomeIcon,
  Users,
  Compass,
  Brain,
  Baby,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    title: "Counselling for Children",
    slug: "counselling-for-children",
    description: "Support for emotional, social, and developmental progress in children.",
    icon: <Baby className="h-6 w-6" />,
    filter: "Counselling for Children",
    color: "#D3C4B5"
  },
  {
    title: "Special Education at Home",
    slug: "special-education-at-home",
    description: "Expert learning support tailored for your child's home sanctuary.",
    icon: <HomeIcon className="h-6 w-6" />,
    filter: "Special Education at Home",
    color: "#C8C4DB"
  },
  {
    title: "Counselling Online",
    slug: "counselling-online",
    description: "Virtual sessions providing weightless connection from anywhere.",
    icon: <Globe className="h-6 w-6" />,
    filter: "Counselling Online",
    color: "#BACCB3"
  },
  {
    title: "Family Counselling",
    slug: "family-counselling",
    description: "Harmonizing clinical insights with human care for the whole family.",
    icon: <Users className="h-6 w-6" />,
    filter: "Family Counselling",
    color: "#D3C4B5"
  },
  {
    title: "Career Counselling",
    slug: "career-counselling",
    description: "Guidance for neuro-diverse learners transitioning to new phases.",
    icon: <Compass className="h-6 w-6" />,
    filter: "Career Counselling",
    color: "#C8C4DB"
  },
  {
    title: "Behavioral Therapy",
    slug: "behavioral-therapy",
    description: "Evidence-based interventions designed for organic growth.",
    icon: <Brain className="h-6 w-6" />,
    filter: "Behavioral Therapy",
    color: "#BACCB3"
  },
  {
    title: "Support Group for Parents",
    slug: "support-group-for-parents",
    description: "Join a collective of intentional parents in the Sanctuary.",
    icon: <Heart className="h-6 w-6" />,
    filter: "Support Group for Parents",
    color: "#D3C4B5"
  },
  {
    title: "Early Intervention",
    slug: "early-intervention",
    description: "Crucial clinical foundations for children (ages 2-8).",
    icon: <Star className="h-6 w-6" />,
    filter: "Early Intervention",
    color: "#C8C4DB"
  }
];

export function MavenServices() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {SERVICES.map((s, i) => (
        <Link 
          key={s.title} 
          href={`/programs/${s.slug}`}
          className="group relative bg-[#1D1E31]/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 flex flex-col justify-between transition-all hover:bg-[#1D1E31]/60 hover:border-[#D3C4B5]/20 hover:-translate-y-1 h-[340px]"
        >
          <div className="space-y-6">
            <div 
              className="h-12 w-12 rounded-2xl flex items-center justify-center border border-white/5 bg-[#111224]/80 text-[#D3C4B5]"
              style={{ color: s.color }}
            >
              {s.icon}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-manrope font-extrabold tracking-tighter text-white uppercase italic leading-tight">
                {s.title}
              </h3>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed italic line-clamp-3">
                {s.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pt-6 group-hover:gap-6 transition-all">
             <span className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">Find Specialist</span>
             <ArrowRight className="h-4 w-4 text-[#D3C4B5]" />
          </div>
        </Link>
      ))}
    </div>
  );
}
