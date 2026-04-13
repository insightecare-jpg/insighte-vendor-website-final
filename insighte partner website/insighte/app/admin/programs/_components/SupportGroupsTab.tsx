"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  Clock, 
  Heart, 
  Lock, 
  Unlock, 
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { getPrograms, updateProgram, deleteProgram } from "@/lib/actions/programs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SupportGroupsTab({ searchQuery }: { searchQuery: string }) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    try {
      setIsLoading(true);
      const data = await getPrograms("support_group");
      setPrograms(data);
    } catch (err) {
      toast.error("Failed to retrieve community circles.");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = programs.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="p-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Community Hub...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Community Circle</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Schedule & Cadence</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Membership</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Intake Type</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
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
                    <div className="h-10 w-10 rounded-full bg-[#1D1E31] flex items-center justify-center text-xl border border-white/5 shadow-md">
                      {p.icon_emoji || "🤝"}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">{p.name}</div>
                      <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">{p.event_mode || "Hybrid"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="text-xs font-black text-[#D3C4B5] truncate max-w-[200px]">
                      {p.schedule_label || "No schedule set"}
                    </div>
                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">{p.frequency || "TBD Frequency"}</div>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#BACCB3]/10 flex items-center justify-center border border-[#BACCB3]/10">
                         <Heart className="h-3 w-3 text-[#BACCB3]" />
                      </div>
                      <span className="text-xs font-black text-white">{p.member_count ?? 0} <span className="text-zinc-600">Enrolled</span></span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className={cn(
                     "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border inline-flex items-center gap-2",
                     p.intake_type === 'open' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                     p.intake_type === 'rolling' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : 
                     "bg-red-500/10 text-red-500 border-red-500/20"
                   )}>
                      {p.intake_type === 'open' ? <Unlock className="h-2 w-2" /> : <Lock className="h-2 w-2" />}
                      {p.intake_type || "OPEN"}
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className={cn("h-1 w-6 rounded-full", p.is_active ? "bg-[#BACCB3]" : "bg-zinc-800")} title={p.is_active ? "Live" : "Inactive"} />
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10"><Edit className="h-3 w-3 text-zinc-400" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-500/20"><Trash2 className="h-3 w-3 text-red-500" /></Button>
                      {expandedId === p.id ? <ChevronUp className="h-4 w-4 text-zinc-500 ml-2" /> : <ChevronDown className="h-4 w-4 text-zinc-500 ml-2" />}
                   </div>
                </td>
              </tr>
              {expandedId === p.id && (
                <tr className="bg-white/[0.04] border-b border-white/5">
                  <td colSpan={6} className="px-24 py-12">
                     <div className="grid grid-cols-12 gap-12 text-zinc-300">
                        <div className="col-span-8 space-y-8">
                           <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">Collective Purpose</label>
                              <p className="text-sm font-medium italic border-l-2 border-[#BACCB3]/30 pl-6 leading-relaxed">
                                 "{p.description}"
                              </p>
                           </div>
                           <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">Facilitator Roster</label>
                                 <div className="p-4 rounded-3xl bg-black/40 border border-white/5 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/10" />
                                    <div>
                                       <div className="text-xs font-black text-white">Clinical Lead</div>
                                       <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Counseling & Guidance</div>
                                    </div>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">Intake Logistics</label>
                                 <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-white/[0.02] to-transparent border border-white/10 flex flex-col items-center justify-center text-center gap-2">
                                    <div className="text-xs font-black text-white">{p.intake_type?.toUpperCase() || "OPEN"} INTAKE</div>
                                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Verify new member requests regularly</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="col-span-4 space-y-6">
                           <div className="p-10 rounded-[3rem] bg-[#BACCB3]/5 border border-[#BACCB3]/10 border-dashed text-center space-y-6">
                              <div className="h-16 w-16 bg-[#BACCB3]/10 rounded-full flex items-center justify-center mx-auto">
                                 <Users className="h-8 w-8 text-[#BACCB3]" />
                              </div>
                              <div className="space-y-2">
                                 <div className="text-3xl font-black text-white">{p.member_count ?? 0}</div>
                                 <div className="text-[9px] font-black uppercase tracking-widest text-[#BACCB3]">Active Community Members</div>
                              </div>
                              <Button className="w-full h-12 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#BACCB3] hover:text-white transition-all">
                                 Export Roster
                              </Button>
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
