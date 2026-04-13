"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, Edit2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServicesPackagesSection({ specialist }: { specialist: any }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-[#191a2d]/60 rounded-[3rem] border border-white/5 p-12 space-y-12 shadow-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-[#BACCB3]" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">SECTION 02 // CLINICAL SERVICES & FINANCIAL BUNDLES</h2>
        </div>
        <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-[9px] font-black uppercase tracking-widest text-[#7c6ff7] hover:text-white flex items-center gap-2"
        >
            {isEditing ? <><X className="h-3 w-3" /> CANCEL</> : <><Edit2 className="h-3 w-3" /> EDIT INVENTORY</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* SERVICES TABLE */}
        <div className="space-y-6">
            <h3 className="text-sm font-black italic uppercase text-white tracking-tight ml-1">Current Services Registry</h3>
            <div className="bg-[#111224] rounded-3xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 h-12">
                            <th className="pl-6 text-[8px] font-black uppercase text-zinc-600">Program</th>
                            <th className="px-4 text-[8px] font-black uppercase text-zinc-600">Rate</th>
                            <th className="px-4 text-[8px] font-black uppercase text-zinc-600">Duration</th>
                            <th className="pr-6 text-right text-[8px] font-black uppercase text-zinc-600">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <tr className="h-14">
                            <td className="pl-6">
                                <span className="text-[10px] font-bold text-white uppercase italic">Behavioral Therapy</span>
                            </td>
                            <td className="px-4">
                                <span className="text-[10px] font-bold text-[#BACCB3] tracking-tighter">₹800/hr</span>
                            </td>
                            <td className="px-4">
                                <span className="text-[10px] font-bold text-zinc-500 italic">45m</span>
                            </td>
                            <td className="pr-6 text-right">
                                <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none text-[7px] px-2 rounded-sm font-black italic">ACTIVE</Badge>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button className="h-12 w-full rounded-2xl border-2 border-dashed border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-700 hover:text-white hover:border-white/10 transition-all">
                + Append Service Protocol
            </button>
        </div>

        {/* PACKAGES TABLE */}
        <div className="space-y-6">
            <h3 className="text-sm font-black italic uppercase text-white tracking-tight ml-1">Clinical Package Bundles</h3>
            <div className="bg-[#111224] rounded-3xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 h-12">
                            <th className="pl-6 text-[8px] font-black uppercase text-zinc-600">Packet Name</th>
                            <th className="px-4 text-[8px] font-black uppercase text-zinc-600">Sessions</th>
                            <th className="px-4 text-[8px] font-black uppercase text-zinc-600">Price</th>
                            <th className="pr-6 text-right text-[8px] font-black uppercase text-zinc-600">Edit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <tr className="h-14">
                            <td className="pl-6">
                                <span className="text-[10px] font-bold text-white uppercase italic">Standard Series</span>
                            </td>
                            <td className="px-4 text-center">
                                <span className="text-[10px] font-bold text-zinc-500 italic">12</span>
                            </td>
                            <td className="px-4">
                                <span className="text-[10px] font-bold text-[#BACCB3] tracking-tighter">₹9,600</span>
                            </td>
                            <td className="pr-6 text-right">
                                <button className="text-zinc-700 hover:text-white transition-colors"><Edit2 className="h-3 w-3" /></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="bg-[#baccb3]/5 border border-[#baccb3]/10 p-6 rounded-[2rem] space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3] italic flex items-center gap-2">
                    <Check className="h-3 w-3" /> Institutional Integrity Lock
                </p>
                <p className="text-[9px] text-[#baccb3]/40 leading-relaxed font-bold uppercase tracking-tight italic">Packages are primarily configured by specialists. Admin edits are logged and synchronized with their dashboard.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
