"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowLeft,
  LayoutGrid,
  Calendar,
  GraduationCap,
  Users as UsersIcon,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CoreServicesTab } from "./_components/CoreServicesTab";
import { TrainingsTab } from "./_components/TrainingsTab";
import { CoursesTab } from "./_components/CoursesTab";
import { SupportGroupsTab } from "./_components/SupportGroupsTab";
import { getProgramStats } from "@/lib/actions/programs";

type ProgramTab = "services" | "trainings" | "courses" | "groups";

export default function ProgramsAdminPage() {
  const [activeTab, setActiveTab] = useState<ProgramTab>("services");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "services", label: "Core Services", icon: <ShieldCheck className="h-4 w-4" /> },
    { id: "trainings", label: "Trainings & Events", icon: <Calendar className="h-4 w-4" /> },
    { id: "courses", label: "Courses", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "groups", label: "Support Groups", icon: <UsersIcon className="h-4 w-4" /> },
  ];

  return (
    <main className="min-h-screen bg-[#0a0b1c] p-6 pt-12 md:p-24 space-y-12">
      {/* ─── HEADER SECTION ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#D3C4B5] font-black uppercase tracking-[0.3em] text-[10px]">
            <Zap className="h-3 w-3" /> Clinical Governance // Catalog
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-[0.8] mix-blend-plus-lighter">
            Program <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D3C4B5] via-white to-[#BACCB3]">Master.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-[#D3C4B5] transition-colors" />
            <Input 
              placeholder="Search by name..." 
              className="w-64 h-14 bg-[#111224] border-white/5 rounded-2xl pl-12 text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-[#D3C4B5]/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline"
            onClick={async () => {
              const { seedPrograms } = await import("@/lib/actions/programs");
              await seedPrograms();
              alert("Infrastructure Seeded Successfully!");
              window.location.reload();
            }}
            className="h-14 px-8 bg-white/5 border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/10 transition-all mr-2"
          >
            Seed Programs
          </Button>
          <Button 
            variant="outline"
            onClick={async () => {
              const { seedWisdomHub } = await import("@/lib/actions/blog");
              await seedWisdomHub();
              alert("Wisdom Hub Seeded Successfully!");
              window.location.reload();
            }}
            className="h-14 px-8 bg-white/5 border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/10 transition-all mr-2"
          >
            Seed Blogs
          </Button>
          <Button className="h-14 px-8 bg-[#D3C4B5] text-[#382F24] font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-black">
            <Plus className="h-4 w-4 mr-2" /> Initialize {activeTab === "services" ? "Service" : activeTab === "trainings" ? "Training" : activeTab === "courses" ? "Course" : "Group"}
          </Button>
        </div>
      </div>

      {/* ─── TAB NAVIGATION ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-1.5 bg-[#111224] border border-white/5 rounded-[2rem] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProgramTab)}
            className={cn(
              "flex items-center gap-3 px-8 h-12 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-[#1D1E31] text-white shadow-xl shadow-black/20 border border-white/5" 
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── CONTENT AREA ───────────────────────────────────────────────────── */}
      <div className="vessel bg-[#111224]/50 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-[#111224]/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Registry:</span>
            <div className="h-8 w-px bg-white/5" />
            <div className="flex gap-2">
              {["Active", "Archived", "Draft"].map(status => (
                <button key={status} className="px-4 h-8 rounded-full bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">
            Total Entries: <span className="text-white ml-2">12</span>
          </div>
        </div>

        <div className="p-0">
          {activeTab === "services" && <CoreServicesTab searchQuery={searchQuery} />}
          {activeTab === "trainings" && <TrainingsTab searchQuery={searchQuery} />}
          {activeTab === "courses" && <CoursesTab searchQuery={searchQuery} />}
          {activeTab === "groups" && <SupportGroupsTab searchQuery={searchQuery} />}
        </div>
      </div>
    </main>
  );
}
