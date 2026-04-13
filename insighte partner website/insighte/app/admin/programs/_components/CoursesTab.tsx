"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Users, 
  Globe, 
  ExternalLink,
  Edit2,
  Trash,
  ChevronDown,
  ChevronUp,
  GraduationCap
} from "lucide-react";
import { getPrograms, updateProgram, deleteProgram } from "@/lib/actions/programs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CoursesTab({ searchQuery }: { searchQuery: string }) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    try {
      setIsLoading(true);
      const data = await getPrograms("course");
      setPrograms(data);
    } catch (err) {
      toast.error("Failed to retrieve course catalog.");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = programs.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="p-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Learning Hub...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Curriculum Pillar</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Audience</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Structure</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Format</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Link</th>
            <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <React.Fragment key={p.id}>
              <tr 
                className={cn(
                  "group border-b border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer",
                  expandedId === p.id && "bg-white/[0.04]"
                )}
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#1D1E31] flex items-center justify-center text-xl border border-white/5 shadow-lg group-hover:rotate-6 transition-all duration-500">
                      {p.icon_emoji || "📘"}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">{p.name}</div>
                      <div className="text-[10px] font-bold text-zinc-500 italic">Graphy Marketplace</div>
                    </div>
                    {p.is_featured && (
                      <span className="px-2 py-0.5 rounded-full bg-[#8b7ff0]/10 border border-[#8b7ff0]/30 text-[#8b7ff0] text-[8px] font-black uppercase tracking-widest ml-2">FEATURED</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">{p.course_audience || "Universal"}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-xs font-black text-white">
                    <Clock className="h-3 w-3 text-zinc-500" /> {p.course_duration || "Self-Paced"}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#BACCB3]">
                    {p.course_format || "Online"}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <Link 
                    href={p.external_enroll_url || "#"} 
                    target="_blank" 
                    className="flex items-center gap-2 text-[10px] font-bold text-blue-400/60 hover:text-blue-400 transition-all truncate max-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open Graphy <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10"><Edit2 className="h-3 w-3 text-zinc-400" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-500/20"><Trash className="h-3 w-3 text-red-500" /></Button>
                      {expandedId === p.id ? <ChevronUp className="h-4 w-4 text-zinc-500 ml-2" /> : <ChevronDown className="h-4 w-4 text-zinc-500 ml-2" />}
                   </div>
                </td>
              </tr>
              {expandedId === p.id && (
                <tr className="bg-white/[0.04] border-b border-white/5">
                  <td colSpan={6} className="px-24 py-12">
                    <div className="grid grid-cols-12 gap-12">
                       <div className="col-span-8 space-y-8 text-zinc-300">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-[#8b7ff0]">Course Objective</label>
                             <p className="text-sm font-medium leading-relaxed italic border-l-2 border-[#8b7ff0]/30 pl-6">
                                "{p.description}"
                             </p>
                          </div>
                          <div className="grid grid-cols-3 gap-6">
                             <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-2">
                                <Users className="h-5 w-5 text-zinc-600 mb-2" />
                                <div className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">INTAKE STRATEGY</div>
                                <div className="text-xs font-black text-white">{p.intake_type?.toUpperCase() || "OPEN"}</div>
                             </div>
                             <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-2">
                                <Clock className="h-5 w-5 text-zinc-600 mb-2" />
                                <div className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">PACING</div>
                                <div className="text-xs font-black text-white">{p.course_duration?.toUpperCase() || "FLEXIBLE"}</div>
                             </div>
                             <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-2">
                                <GraduationCap className="h-5 w-5 text-zinc-600 mb-2" />
                                <div className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em]">CERTIFICATION</div>
                                <div className="text-xs font-black text-white">UPON COMPLETION</div>
                             </div>
                          </div>
                       </div>
                       <div className="col-span-4 space-y-8">
                          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#8b7ff0]/5 to-transparent border border-[#8b7ff0]/10 flex flex-col items-center justify-center gap-6">
                             <div className="text-center space-y-2">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8b7ff0]">Ready for Enrollment?</div>
                                <p className="text-[9px] font-bold text-zinc-500 opacity-60">Listing Sync with Graphy LMS</p>
                             </div>
                             <Link 
                                href={p.external_enroll_url || "#"} 
                                target="_blank"
                                className="w-full h-14 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center hover:bg-[#8b7ff0] hover:text-white transition-all shadow-xl"
                             >
                                <BookOpen className="h-4 w-4 mr-2" /> Verify Redirect
                             </Link>
                          </div>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
