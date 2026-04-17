"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Globe, 
  Users, 
  Ticket, 
  Calendar,
  Clock,
  MoreVertical,
  Edit2,
  Trash,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { getPrograms, updateProgram, deleteProgram } from "@/lib/actions/programs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function TrainingsTab({ searchQuery }: { searchQuery: string }) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    try {
      setIsLoading(true);
      const data = await getPrograms("training");
      setPrograms(data);
    } catch (err) {
      toast.error("Failed to retrieve training events.");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = programs.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'live': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse';
      case 'completed': return 'bg-zinc-800 text-zinc-500 border-zinc-700';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-zinc-800 text-zinc-500';
    }
  };

  if (isLoading) return <div className="p-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Events Hub...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Event Details</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Date & Mode</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Seating</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Fee</th>
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
                      <div className="h-10 w-10 rounded-xl bg-[#1D1E31] flex items-center justify-center text-xl border border-white/5 shadow-lg group-hover:scale-110 transition-transform">
                        {p.icon_emoji || "📅"}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-tight">{p.name}</div>
                        <div className="text-[10px] font-bold text-zinc-500 flex items-center gap-2">
                           {p.event_mode === 'online' ? <Globe className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                           {p.event_location || "Virtual Venue"}
                        </div>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="space-y-1">
                      <div className="text-xs font-black text-zinc-300">
                        {p.event_date ? format(new Date(p.event_date), "MMM dd, yyyy") : "TBD"}
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                         <Clock className="h-3 w-3" /> {p.event_date ? format(new Date(p.event_date), "hh:mm a") : "—"}
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center">
                         <Users className="h-3 w-3 text-zinc-500" />
                      </div>
                      <div className="space-y-0.5">
                         <div className="text-xs font-black text-white">{p.seats_remaining ?? 0} <span className="text-zinc-600">/ {p.seats_total ?? 0}</span></div>
                         <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#BACCB3]" 
                              style={{ width: `${((p.seats_total - p.seats_remaining) / (p.seats_total || 1)) * 100}%` }} 
                            />
                         </div>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   {p.is_free ? (
                     <span className="px-2 py-0.5 rounded bg-[#BACCB3]/10 text-[#BACCB3] text-[9px] font-black uppercase tracking-widest border border-[#BACCB3]/20">FREE</span>
                   ) : (
                     <div className="text-xs font-black text-white">₹{p.fee?.toLocaleString()}</div>
                   )}
                </td>
                <td className="px-8 py-6">
                   <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border inline-block shadow-sm", getStatusColor(p.event_status))}>
                      {p.event_status}
                   </div>
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
                       <div className="col-span-7 space-y-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">Operational Logistics</label>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-2">
                                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Registration Link</p>
                                   <div className="flex items-center gap-3">
                                      <div className="flex-1 truncate text-xs font-medium text-blue-400">{p.registration_link || "No link provided"}</div>
                                      <Link href={p.registration_link || "#"} target="_blank"><ExternalLink className="h-4 w-4 text-zinc-600 hover:text-white" /></Link>
                                   </div>
                                </div>
                                <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-2">
                                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Payment Gateway</p>
                                   <div className="flex items-center gap-3">
                                      <div className="flex-1 truncate text-xs font-medium text-emerald-400">{p.payment_link || "None Required"}</div>
                                      {p.payment_link && <Link href={p.payment_link} target="_blank"><Ticket className="h-4 w-4 text-zinc-600 hover:text-white" /></Link>}
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">Curriculum Modules</label>
                             <div className="space-y-2">
                                <div className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between">
                                   <div className="flex items-center gap-4">
                                      <span className="text-[10px] font-black text-zinc-700">01</span>
                                      <span className="text-xs font-bold text-zinc-300">Integration Methodology</span>
                                   </div>
                                   <span className="text-[9px] font-black text-zinc-500">45 MINS</span>
                                </div>
                                <button className="w-full p-4 rounded-2xl border border-dashed border-white/10 text-zinc-700 text-[10px] font-black uppercase tracking-widest hover:border-white/20 hover:text-zinc-500 transition-all">
                                   + Add Module
                                </button>
                             </div>
                          </div>
                       </div>
                       <div className="col-span-5 space-y-8">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">Facilitator Roster</label>
                             <div className="space-y-3">
                                <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
                                   <div className="h-10 w-10 rounded-full bg-zinc-800" />
                                   <div>
                                      <div className="text-xs font-black text-white">Lead Specialist</div>
                                      <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">Clinical Psychology</div>
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#D3C4B5]/5 to-transparent border border-[#D3C4B5]/10 space-y-4">
                             <p className="text-[10px] font-black text-[#D3C4B5] uppercase tracking-widest">Target Audience</p>
                             <p className="text-sm font-medium italic text-zinc-300">"Recommended for parents of children aged 6–14 navigating sensory integration in secondary classrooms."</p>
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
