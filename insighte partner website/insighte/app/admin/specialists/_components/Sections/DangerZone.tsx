"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Trash2, PauseCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function DangerZoneSection({ specialist }: { specialist: any }) {
  const [confirmDelete, setConfirmDelete] = useState("");
  const [confirmSuspend, setConfirmSuspend] = useState("");

  return (
    <div className="bg-red-500/5 rounded-[3rem] border border-red-500/10 p-12 space-y-12 shadow-3xl">
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60">SECTION 08 // DANGER ZONE: TERMINAL CLINICAL GOVERNANCE</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SUSPEND */}
        <div className="vessel bg-black/40 p-8 rounded-[2.5rem] border border-red-500/10 space-y-6 group">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <PauseCircle className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest leading-none mb-1">Suspend Account</h4>
                    <p className="text-[8px] font-bold text-zinc-700 uppercase italic">Revocable clinical block</p>
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-[9px] text-zinc-500 leading-relaxed font-bold italic">User will be blocked from logging in. All bookings will be marked as "Under Review".</p>
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-800 ml-1">Type "{specialist.name.split(' ')[0]}" to suspend</label>
                    <Input 
                        value={confirmSuspend}
                        onChange={(e) => setConfirmSuspend(e.target.value)}
                        placeholder="NAME_KEY"
                        className="bg-black/60 border-red-500/10 rounded-xl h-10 text-[10px] font-black text-red-500 uppercase tracking-widest px-4 focus:ring-red-500" 
                    />
                </div>
                <Button 
                    disabled={confirmSuspend !== specialist.name.split(' ')[0]}
                    className="w-full h-12 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                >
                    Initiate Clinical Suspension
                </Button>
            </div>
        </div>

        {/* DEACTIVATE */}
        <div className="vessel bg-black/40 p-8 rounded-[2.5rem] border border-zinc-500/10 space-y-6 group">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-500">
                    <LogOut className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest leading-none mb-1">Deactivate Profile</h4>
                    <p className="text-[8px] font-bold text-zinc-700 uppercase italic">Invisible in Marketplace</p>
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-[9px] text-zinc-500 leading-relaxed font-bold italic">Specialist remains active but hidden from search. Recommended for clinical sabbaticals or training.</p>
                <Button className="w-full h-12 bg-zinc-800 text-zinc-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-700 hover:text-white transition-all">
                    Hide from Marketplace
                </Button>
            </div>
        </div>

        {/* PERMANENT DELETE */}
        <div className="vessel bg-black/40 p-8 rounded-[2.5rem] border border-red-500/20 space-y-6 group">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                    <Trash2 className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest leading-none mb-1">Global Purge</h4>
                    <p className="text-[8px] font-bold text-zinc-700 uppercase italic">Irreversible Data Destruction</p>
                </div>
            </div>
            <div className="space-y-4">
                <p className="text-[9px] text-red-500/40 leading-relaxed font-bold italic">CAUTION: This will delete the architecture, bookings, and financial history associated with this clinician.</p>
                <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-widest text-zinc-800 ml-1 text-red-500/60">Type specialist name + "DELETE"</label>
                    <Input 
                        value={confirmDelete}
                        onChange={(e) => setConfirmDelete(e.target.value)}
                        placeholder="NAME_DELETE"
                        className="bg-black/80 border-red-500/40 rounded-xl h-10 text-[10px] font-black text-red-500 uppercase tracking-widest px-4 focus:ring-red-600" 
                    />
                </div>
                <Button 
                    disabled={confirmDelete !== `${specialist.name} DELETE`}
                    className="w-full h-12 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-700 shadow-2xl shadow-red-500/20 shadow-xl disabled:opacity-30"
                >
                    PERMANENT PURGE
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
