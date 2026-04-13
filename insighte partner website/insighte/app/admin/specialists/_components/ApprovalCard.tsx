"use client";

import React, { useState } from "react";
import { X, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveSpecialist, rejectSpecialist } from "../actions/specialists";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ApprovalCard({ specialist, onAction }: { specialist: any, onAction: () => void }) {
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = async () => {
    const res = await approveSpecialist(specialist.id);
    if (res.success) onAction();
  };

  const handleReject = async () => {
    if (!reason) return;
    const res = await rejectSpecialist(specialist.id, reason);
    if (res.success) onAction();
  };

  return (
    <div className={cn(
        "min-w-[320px] bg-[#1d1e31] p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-xl transition-all",
        rejectMode && "min-h-[180px]"
    )}>
      <div className="flex items-start gap-4">
        {/* INITIALS SQUARE */}
        <div className="h-12 w-12 rounded-2xl bg-[#0d0f1a] flex items-center justify-center font-black text-xs text-zinc-700 shrink-0">
            {specialist.name?.[0]}
        </div>
        
        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black italic uppercase text-white truncate tracking-tight">{specialist.name}</h4>
            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-600">{specialist.category || 'Specialist'}</p>
            <p className="text-[8px] font-bold text-zinc-700 italic mt-0.5">
                {specialist.city} · Applied {formatDistanceToNow(new Date(specialist.created_at), { addSuffix: true })}
            </p>
        </div>
      </div>

      {!rejectMode ? (
        <div className="flex items-center gap-2 pt-1">
            <Button onClick={handleApprove} className="h-10 px-6 rounded-xl bg-[#BACCB3] text-[#111224] text-[9px] font-black uppercase tracking-widest flex-1">
                CERTIFY
            </Button>
            <Link href={`/admin/specialists/${specialist.id}`} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <Eye className="h-4 w-4" />
            </Link>
            <Button onClick={() => setRejectMode(true)} variant="ghost" className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                <X className="h-4 w-4" />
            </Button>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <input 
                autoFocus
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full bg-[#111224] border border-red-500/20 rounded-xl h-10 px-4 text-[10px] text-white focus:outline-none focus:border-red-500/50"
            />
            <div className="flex gap-2">
                <Button onClick={handleReject} className="flex-1 h-9 bg-red-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                    Confirm Rejection
                </Button>
                <button onClick={() => setRejectMode(false)} className="px-4 text-[8px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400">
                    Cancel
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
