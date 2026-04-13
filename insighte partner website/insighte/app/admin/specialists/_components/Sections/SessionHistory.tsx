"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SessionHistorySection({ specialist }: { specialist: any }) {
  return (
    <div className="bg-[#191a2d]/60 rounded-[3rem] border border-white/5 p-12 space-y-12 shadow-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">SECTION 05 // COMPREHENSIVE SESSION HISTORY & AUDIT</h2>
        </div>
        <div className="flex gap-4">
            <button className="h-10 px-4 rounded-xl bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all flex items-center gap-2">
                <ListFilter className="h-3.5 w-3.5" /> Filter Log
            </button>
            <button className="h-10 px-4 rounded-xl bg-[#7c6ff7]/10 text-[#7c6ff7] text-[9px] font-black uppercase tracking-widest hover:bg-[#7c6ff7] hover:text-white transition-all flex items-center gap-2">
                <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
        </div>
      </div>

      <div className="bg-[#111224] rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-white/5 h-16">
                    <th className="pl-8 text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">Date & Time</th>
                    <th className="px-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">Client / Child</th>
                    <th className="px-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">Program</th>
                    <th className="px-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                    <th className="px-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-right">Notes</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                <tr className="h-20 hover:bg-white/[0.02] transition-colors">
                    <td className="pl-8">
                        <div className="flex flex-col">
                            <span className="text-sm font-black italic uppercase text-white tracking-tight">Apr 08, 2026</span>
                            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest">04:30 PM — 5:30 PM</span>
                        </div>
                    </td>
                    <td className="px-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-white uppercase italic">Rajesh Kumar</span>
                            <span className="text-[7px] font-black text-zinc-700 tracking-widest leading-none">Child: Aryan</span>
                        </div>
                    </td>
                    <td className="px-6">
                        <span className="text-[10px] font-bold text-zinc-500 italic">ABA Intervention</span>
                    </td>
                    <td className="px-6 text-center">
                        <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none text-[8px] font-black italic">COMPLETED</Badge>
                    </td>
                    <td className="pr-8 text-right">
                        <button className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#7c6ff7] transition-all flex items-center gap-2 justify-end ml-auto">
                            <FileText className="h-3.5 w-3.5" /> View Notes
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
}
