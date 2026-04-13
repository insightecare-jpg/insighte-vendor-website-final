"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, 
  BookOpen, 
  Users, 
  Heart, 
  GraduationCap,
  Sparkles, 
  Calendar,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PROGRAM_CATEGORIES = [
  { id: "all", label: "All Programs" },
  { id: "services", label: "Core Services" },
  { id: "courses", label: "Courses" },
  { id: "groups", label: "Support Groups" },
];

interface ProgramsClientProps {
  initialServices: any[];
  initialCourses: any[];
  initialGroups: any[];
}

export function ProgramsClient({ initialServices, initialCourses, initialGroups }: ProgramsClientProps) {
  const [activeTab, setActiveTab] = useState("all");

  const getSvcColor = (index: number) => {
    const colors = [
      { color: "from-[#1d9e7520] to-transparent", accent: "#1d9e75" },
      { color: "from-[#97C45920] to-transparent", accent: "#97C459" },
      { color: "from-[#F0997B20] to-transparent", accent: "#F0997B" },
      { color: "from-[#5DCAA520] to-transparent", accent: "#5DCAA5" },
    ];
    return colors[index % colors.length];
  };

  const getCourseColor = (index: number) => {
    const colors = [
      { color: "from-[#8b7ff015] to-transparent", accent: "#8b7ff0" },
      { color: "from-[#5DCAA515] to-transparent", accent: "#5DCAA5" },
      { color: "from-[#85B7EB15] to-transparent", accent: "#85B7EB" },
      { color: "from-[#EF9F2715] to-transparent", accent: "#EF9F27" },
    ];
    return colors[index % colors.length];
  };

  return (
    <main className="pt-24 pb-32">
      {/* ═══ CRYSTAL HERO ═══════════════════════════════════════════════════ */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        {/* Background Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-radial from-[#5DCAA5]/10 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-[#1d9e7510] border border-[#1d9e7530] backdrop-blur-3xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#5DCAA5]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5DCAA5]">
            Structured Care Pathways
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8 max-w-4xl mx-auto leading-[0.95]"
        >
          The right support for your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5DCAA5] via-[#8b7ff0] to-[#5DCAA5] bg-[length:200%_auto] animate-gradient-slow italic">
            whole family ecosystem
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[#8a8591] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          From intensive 1:1 therapy to collaborative community groups — Insighte offers granular care layers 
          engineered for progress, accessible wherever your journey begins.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/specialists" className="px-8 py-4 rounded-2xl bg-white text-[#0d0f1a] font-black uppercase text-xs tracking-widest hover:bg-[#8b7ff0] hover:text-white transition-all shadow-2xl active:scale-95">
            Browse Specialists
          </Link>
          <Link href="/triage" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all active:scale-95">
            Get Guided Discovery
          </Link>
        </motion.div>
      </section>

      {/* ═══ THEMATIC FILTERS ════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-wrap gap-3">
          {PROGRAM_CATEGORIES.map((cat) => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border backdrop-blur-3xl",
                activeTab === cat.id 
                  ? "bg-[#8b7ff0]/10 border-[#8b7ff0]/40 text-white" 
                  : "bg-white/5 border-white/5 text-[#5a5466] hover:border-white/20"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ SECTION: CORE SERVICES ═════════════════════════════════════════ */}
      {(activeTab === "all" || activeTab === "services") && (
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="mb-12 border-l-4 border-[#5DCAA5] pl-8">
            <div className="flex items-center gap-2 text-[#5DCAA5] mb-2 font-black uppercase tracking-[0.25em] text-[10px]">
              <Heart className="w-4 h-4" /> The Foundation
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic opacity-90">
              The Pillars of Insighte Care
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initialServices.map((svc, idx) => {
              const theme = getSvcColor(idx);
              return (
                <div 
                  key={svc.id} 
                  className={cn(
                    "group relative p-8 rounded-[2.5rem] bg-gradient-to-br border border-white/5 transition-all duration-500 overflow-hidden hover:border-[#8b7ff0]/40",
                    theme.color
                  )}
                >
                  <div className="text-5xl mb-6">{svc.icon_emoji}</div>
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#8b7ff0] transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-sm text-[#8a8591] mb-6 leading-relaxed italic border-l-2 border-white/10 pl-4 font-medium opacity-80 group-hover:opacity-100">
                    {svc.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {svc.tags?.map((tag: string) => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto space-y-6">
                    <div className="text-[10px] font-black text-[#5a5466] uppercase tracking-[0.2em] pt-4 border-t border-white/5">
                      {svc.impact_stat} {svc.impact_label}
                    </div>
                    <Link href={`/programs/${svc.slug || svc.id}`} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#8b7ff0] group-hover:text-white transition-all">
                      View Program <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══ SECTION: COURSES ════════════════════════════════════════════════ */}
      {(activeTab === "all" || activeTab === "courses") && (
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="border-l-4 border-[#85B7EB] pl-8">
              <div className="flex items-center gap-2 text-[#85B7EB] mb-2 font-black uppercase tracking-[0.25em] text-[10px]">
                <GraduationCap className="w-4 h-4" /> Intellectual Capital
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic opacity-90">
                Precision Trainings
              </h2>
            </div>
            <Link href="/specialists" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#85B7EB] hover:text-white transition-all">
              View Specialized Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialCourses.map((course, idx) => {
              const theme = getCourseColor(idx);
              return (
                <div 
                  key={course.id} 
                  className={cn(
                    "group p-8 rounded-[2.5rem] bg-gradient-to-br border border-white/5 transition-all duration-500 hover:scale-[1.02] shadow-2xl",
                    theme.color
                  )}
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="text-4xl">{course.icon_emoji}</span>
                    {course.is_featured && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#8b7ff0]/10 border border-[#8b7ff0]/30 text-[#8b7ff0]">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 leading-tight">
                    {course.name}
                  </h3>
                  <p className="text-[10px] font-semibold text-[#5DCAA5] uppercase tracking-widest mb-4">
                    {course.course_format} • {course.course_audience}
                  </p>
                  <p className="text-sm text-[#8a8591] mb-8 leading-relaxed font-medium">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href={course.external_enroll_url || `/programs/${course.slug || course.id}`} 
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#8b7ff0] hover:text-white transition-all active:scale-95"
                    >
                      <BookOpen className="w-4 h-4" /> Enroll Now
                    </Link>
                    <Link 
                      href={`/programs/${course.slug || course.id}`} 
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#8b7ff0] hover:bg-white/10 transition-all"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══ SECTION: SUPPORT GROUPS ═════════════════════════════════════════ */}
      {(activeTab === "all" || activeTab === "groups") && (
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="mb-12 border-l-4 border-[#c5b8f8] pl-8">
            <div className="flex items-center gap-2 text-[#c5b8f8] mb-2 font-black uppercase tracking-[0.25em] text-[10px]">
              <Users className="w-4 h-4" /> Shared Journey
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic opacity-90">
              Community Circles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initialGroups.map((grp) => (
              <div 
                key={grp.id} 
                className={cn(
                  "group p-8 rounded-[2.5rem] bg-gradient-to-br border border-white/5 transition-all duration-500 hover:border-[#c5b8f8]/40",
                  "from-[#8b7ff0]/10 to-transparent flex flex-col h-full"
                )}
              >
                <div className="text-4xl mb-6">{grp.icon_emoji}</div>
                <h3 className="text-lg font-black text-white mb-2 leading-tight">
                  {grp.name}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-[#c5b8f8] uppercase tracking-widest mb-6">
                  <Calendar className="w-3.5 h-3.5" /> {grp.schedule_label}
                </div>
                <p className="text-sm text-[#8a8591] mb-8 leading-relaxed font-medium">
                  {grp.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                  <span className="text-[9px] font-black text-[#5a5466] uppercase tracking-widest">
                     {grp.member_count} members
                  </span>
                  <Link href={`/programs/${grp.slug || grp.id}`} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#c5b8f8] hover:bg-[#c5b8f8] hover:text-white transition-all active:scale-95">
                    Join Circle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


      {/* ═══ GUIDED TRIAGE CTA ═══════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="relative p-12 lg:p-16 rounded-[3rem] bg-[#1d9e7510] border border-[#1d9e7520] text-center overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5DCAA5]/40 to-transparent" />
          
          <div className="text-5xl mb-8">🦋</div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic mb-6">
            Not sure what your child needs?
          </h2>
          <p className="text-[#8a8591] text-lg max-w-lg mx-auto mb-10 leading-relaxed font-medium">
            Every child has a unique signature. Answer 3 questions and our AI-assisted 
            triage will map a precision pathway through specialists and programs.
          </p>
          <Link 
            href="/triage" 
            className="inline-flex items-center gap-4 px-12 py-5 rounded-2xl bg-[#5DCAA5] text-[#0d0f1a] font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all shadow-2xl shadow-[#5DCAA520] active:scale-95"
          >
            Start Guided Discovery <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
