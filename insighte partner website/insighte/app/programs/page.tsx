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
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ─── DATA DELEGATES ───────────────────────────────────────────────────────────
const CORE_SERVICES = [
  {
    icon: "🏠", label: "Home Therapy",
    desc: "Personalized neuro-affirming therapy (Special Ed, ABA, Speech) delivered in the comfort and safety of your own home.",
    tags: ["At-Home", "Personalized", "Daily Reports"],
    color: "from-[#1d9e7520] to-transparent", accent: "#1d9e75", border: "#1d9e7530",
    href: "/programs/homecare",
    stat: "1,200+ families supported in Bangalore",
  },
  {
    icon: "🎓", label: "Shadow Teachers",
    desc: "Classroom support specialists who work alongside your child in mainstream schools, facilitating learning without singling them out.",
    tags: ["In-School", "Daily support", "IEP aligned"],
    color: "from-[#97C45920] to-transparent", accent: "#97C459", border: "#97C45930",
    href: "/programs/shadow-teaching",
    stat: "60+ shadow teachers across Bangalore & Delhi",
  },
  {
    icon: "💬", label: "Counselling & Therapy",
    desc: "Licensed child psychologists and therapists helping with anxiety, school transitions, emotional regulation, trauma, and family dynamics.",
    tags: ["ADHD", "Anxiety", "Behavioural", "Family therapy"],
    color: "from-[#F0997B20] to-transparent", accent: "#F0997B", border: "#F0997B30",
    href: "/programs/counselling",
    stat: "57+ counsellors · Available online & in-person",
  },
  {
    icon: "🏫", label: "Special Education",
    desc: "Identifying specific learning needs through clinical diagnosis and creating actionable, personalized learning strategies for the classroom.",
    tags: ["IEP", "Academic Support", "Diagnostics"],
    color: "from-[#5DCAA520] to-transparent", accent: "#5DCAA5", border: "#5DCAA530",
    href: "/programs/special-education",
    stat: "500+ outcome-based IEPs created",
  },
];

const COURSES = [
  {
    icon: "🧠", name: "Understanding Your Neurodiverse Child",
    format: "Online · 6 weeks", level: "For Parents",
    desc: "Science-backed strategies for supporting ADHD, autism, and learning differences at home and school.",
    color: "from-[#8b7ff015] to-transparent", accent: "#8b7ff0",
    tag: "Most enrolled",
  },
  {
    icon: "🗣️", name: "Early Speech Stimulation at Home",
    format: "Online · 4 weeks", level: "For Parents",
    desc: "Practical activities to build language skills in children aged 1–4 with speech delays.",
    color: "from-[#5DCAA515] to-transparent", accent: "#5DCAA5",
    tag: "New",
  },
  {
    icon: "✏️", name: "IEP Planning Masterclass",
    format: "Live sessions · 2 days", level: "For Educators",
    desc: "Build effective, legally compliant IEPs with clear goals, accommodations, and progress tracking.",
    color: "from-[#85B7EB15] to-transparent", accent: "#85B7EB",
    tag: null,
  },
  {
    icon: "🎭", name: "Social Skills Through Drama",
    format: "In-person · Bangalore", level: "Ages 6–14",
    desc: "Drama-based group program building conversation, empathy, and social confidence.",
    color: "from-[#EF9F2715] to-transparent", accent: "#EF9F27",
    tag: "Limited spots",
  },
  {
    icon: "📱", name: "Teen Mental Health & Screen Balance",
    format: "Online · 3 sessions", level: "Ages 13–18",
    desc: "Building emotional intelligence, digital wellness habits, and resilience in adolescents.",
    color: "from-[#F0997B15] to-transparent", accent: "#F0997B",
    tag: null,
  },
  {
    icon: "🏋️", name: "Sensory Diet Design for OT",
    format: "Live online · 1 day", level: "For Therapists & Parents",
    desc: "Learn to design and implement sensory diets for children with SPD and autism.",
    color: "from-[#8b7ff015] to-transparent", accent: "#8b7ff0",
    tag: null,
  },
];

const SUPPORT_GROUPS = [
  {
    icon: "🤝", name: "Parent Circle — Bangalore",
    meets: "Every 2nd Saturday · In-person",
    desc: "A safe space for parents of neurodiverse children to share stories, strategies, and find community.",
    members: "180+ members", color: "from-[#8b7ff010] to-transparent",
    accent: "#8b7ff0",
  },
  {
    icon: "💻", name: "Online Parents' Support Group",
    meets: "Every Wednesday · 8 PM IST",
    desc: "Virtual peer support for parents across India. Moderated by a licensed counsellor.",
    members: "340+ members", color: "from-[#5DCAA510] to-transparent",
    accent: "#5DCAA5",
  },
  {
    icon: "🎓", name: "Educator Community Hub",
    meets: "Monthly workshop + Slack community",
    desc: "Shadow teachers, special educators, and counsellors sharing resources and getting peer support.",
    members: "90+ professionals", color: "from-[#85B7EB10] to-transparent",
    accent: "#85B7EB",
  },
  {
    icon: "🌱", name: "Adolescent Peer Group (13–17)",
    meets: "Saturdays · In-person, Bengaluru",
    desc: "A therapist-facilitated group where teens build social skills, express themselves, and feel understood.",
    members: "24/group · Rolling intake", color: "from-[#EF9F2710] to-transparent",
    accent: "#EF9F27",
  },
];

const PROGRAM_CATEGORIES = [
  { id: "all", label: "All Programs" },
  { id: "services", label: "Core Services" },
  { id: "courses", label: "Courses" },
  { id: "groups", label: "Support Groups" },
];

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-[#e8e2d8] selection:bg-[#8b7ff0/30]">
      <Navbar />

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
                    ? "bg-[#8b7ff0/10] border-[#8b7ff0/40] text-white" 
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
              {CORE_SERVICES.map((svc) => (
                <div 
                  key={svc.label} 
                  className={cn(
                    "group relative p-8 rounded-[2.5rem] bg-gradient-to-br border border-white/5 transition-all duration-500 overflow-hidden hover:border-[#8b7ff040]",
                    svc.color
                  )}
                >
                  <div className="text-5xl mb-6">{svc.icon}</div>
                  <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#8b7ff0] transition-colors">
                    {svc.label}
                  </h3>
                  <p className="text-sm text-[#8a8591] mb-6 leading-relaxed italic border-l-2 border-white/10 pl-4 font-medium opacity-80 group-hover:opacity-100">
                    {svc.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {svc.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto space-y-6">
                    <div className="text-[10px] font-black text-[#5a5466] uppercase tracking-[0.2em] pt-4 border-t border-white/5">
                      {svc.stat}
                    </div>
                    <Link href={svc.href} className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#8b7ff0] group-hover:text-white transition-all">
                      View Program <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
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
              {COURSES.map((course) => (
                <div 
                  key={course.name} 
                  className={cn(
                    "group p-8 rounded-[2.5rem] bg-gradient-to-br border border-white/5 transition-all duration-500 hover:scale-[1.02] shadow-2xl",
                    course.color
                  )}
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="text-4xl">{course.icon}</span>
                    {course.tag && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#8b7ff0/10] border border-[#8b7ff0/30] text-[#8b7ff0]">
                        {course.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white mb-2 leading-tight">
                    {course.name}
                  </h3>
                  <p className="text-[10px] font-semibold text-[#5DCAA5] uppercase tracking-widest mb-4">
                    {course.format} • {course.level}
                  </p>
                  <p className="text-sm text-[#8a8591] mb-8 leading-relaxed font-medium">
                    {course.desc}
                  </p>
                  <Link href="/courses" className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#8b7ff0] hover:bg-[#8b7ff0] hover:text-white transition-all active:scale-95">
                    <BookOpen className="w-4 h-4" /> Enroll Now
                  </Link>
                </div>
              ))}
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
              {SUPPORT_GROUPS.map((grp) => (
                <div 
                  key={grp.name} 
                  className={cn(
                    "group p-8 rounded-[2.5rem] bg-gradient-to-br border border-white/5 transition-all duration-500 hover:border-[#c5b8f840]",
                    grp.color
                  )}
                >
                  <div className="text-4xl mb-6">{grp.icon}</div>
                  <h3 className="text-lg font-black text-white mb-2 leading-tight">
                    {grp.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-[#c5b8f8] uppercase tracking-widest mb-6">
                    <Calendar className="w-3.5 h-3.5" /> {grp.meets}
                  </div>
                  <p className="text-sm text-[#8a8591] mb-8 leading-relaxed font-medium">
                    {grp.desc}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <span className="text-[9px] font-black text-[#5a5466] uppercase tracking-widest">
                       {grp.members}
                    </span>
                    <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#c5b8f8] hover:bg-[#c5b8f8] hover:text-white transition-all active:scale-95">
                      <ChevronRight className="w-4 h-4" />
                    </button>
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

      <Footer />
    </div>
  );
}
