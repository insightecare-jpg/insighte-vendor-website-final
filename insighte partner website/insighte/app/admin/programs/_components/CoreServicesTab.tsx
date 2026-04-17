"use client";

import React, { useState, useEffect } from "react";
import { 
  MoreHorizontal, 
  Trash2, 
  Archive, 
  Edit3, 
  Settings2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { getPrograms, updateProgram, deleteProgram } from "@/lib/actions/programs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CoreServicesTab({ searchQuery }: { searchQuery: string }) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  async function fetchPrograms() {
    try {
      setIsLoading(true);
      const data = await getPrograms("core_service");
      setPrograms(data);
    } catch (err) {
      toast.error("Failed to retrieve clinical pillars.");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = programs.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-20 text-center space-y-4">
        <div className="h-12 w-12 border-4 border-[#D3C4B5]/20 border-t-[#D3C4B5] rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Synchronizing clinical registry...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Order</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Service Pillar</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Impact Stats</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Tags</th>
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
                  <span className="text-xs font-black text-zinc-600 group-hover:text-[#D3C4B5] transition-colors">
                    {p.display_order.toString().padStart(2, '0')}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#1D1E31] flex items-center justify-center text-2xl border border-white/5 shadow-xl">
                      {p.icon_emoji || "🏠"}
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[#D3C4B5] transition-colors">{p.name}</div>
                      <div className="text-[10px] font-bold text-zinc-500">{p.subtitle || "Clinical Foundation"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="text-xs font-black text-white">{p.impact_stat}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-600">{p.impact_label}</div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    {p.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                    {p.tags?.length > 2 && <span className="text-[8px] font-black text-zinc-600">+{p.tags.length - 2}</span>}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                    p.is_active ? "bg-[#BACCB3]/10 text-[#BACCB3]" : "bg-zinc-800 text-zinc-500"
                  )}>
                    <div className={cn("h-1 w-1 rounded-full", p.is_active ? "bg-[#BACCB3]" : "bg-zinc-500")} />
                    {p.is_active ? "Verified" : "Archived"}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-[#D3C4B5] hover:text-[#382F24] transition-all">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    {expandedId === p.id ? <ChevronUp className="h-4 w-4 text-zinc-500 ml-2" /> : <ChevronDown className="h-4 w-4 text-zinc-500 ml-2" />}
                  </div>
                </td>
              </tr>
              {expandedId === p.id && (
                <tr className="bg-white/[0.04] border-b border-white/5">
                  <td colSpan={6} className="px-24 py-12">
                    <div className="grid grid-cols-12 gap-12">
                      <div className="col-span-8 space-y-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Service Narrative</label>
                            <p className="text-sm font-medium leading-relaxed text-zinc-300 italic border-l-2 border-[#D3C4B5]/30 pl-6">
                              "{p.description}"
                            </p>
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Impact Metrics</label>
                               <div className="vessel bg-white/5 p-4 rounded-2xl border border-white/5">
                                  <div className="text-xl font-black text-white">{p.impact_stat}</div>
                                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#D3C4B5]">{p.impact_label}</div>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Clinical Tags</label>
                               <div className="flex flex-wrap gap-2">
                                  {p.tags?.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-[9px] font-bold text-zinc-400">
                                      {tag}
                                    </span>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="col-span-4 space-y-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Hero Media</label>
                            <div className="aspect-video rounded-[2rem] bg-black/40 border border-white/5 flex flex-col items-center justify-center gap-4 group/media overflow-hidden relative">
                               {p.hero_image_url ? (
                                 <img src={p.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                               ) : (
                                 <>
                                   <ImageIcon className="h-8 w-8 text-zinc-800" />
                                   <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">No Image Seeded</span>
                                 </>
                               )}
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button variant="ghost" className="text-white text-[8px] font-black uppercase tracking-widest border border-white/20 rounded-full h-8 px-4">
                                    Change Asset
                                  </Button>
                               </div>
                            </div>
                         </div>
                         <Link href={`/programs/${p.slug}`} className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] hover:bg-white/10 transition-all">
                            Preview Storefront <ExternalLink className="h-3 w-3" />
                         </Link>
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
