"use client";

import React from "react";
import { ArrowLeft, ExternalLink, ShieldAlert, Star, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFeatureSpecialist, approveSpecialist, suspendSpecialist } from "../actions/specialists";

export default function ProfileHeader({ specialist }: { specialist: any }) {
  const isFeatured = specialist.user?.is_featured;
  const isPending = specialist.approval_status === 'PENDING_REVIEW';

  const handleApprove = async () => {
    if (confirm("Confirm clinical certification for this specialist?")) {
        await approveSpecialist(specialist.id);
    }
  };

  const handleSuspend = async () => {
    const reason = prompt("Enter suspension reason for specialist notification:");
    if (reason) await suspendSpecialist(specialist.id, reason);
  };

  return (
    <div className="sticky top-0 z-50 bg-[#111224]/80 backdrop-blur-2xl border-b border-white/5 px-4 md:px-8 h-20 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/admin/specialists" className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
            <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="h-8 w-[1px] bg-white/5" />
        <div className="flex items-center gap-4">
            <h1 className="text-xl font-black italic uppercase text-white tracking-tight">{specialist.name}</h1>
            <Badge className={cn(
                "h-6 px-3 rounded-full border-none text-[8px] font-black uppercase tracking-widest",
                specialist.approval_status === 'APPROVED' ? "bg-[#BACCB3]/10 text-[#BACCB3]" :
                specialist.approval_status === 'PENDING_REVIEW' ? "bg-amber-500/10 text-amber-500" :
                "bg-red-500/10 text-red-500"
            )}>
                {specialist.approval_status}
            </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isPending && (
            <Button onClick={handleApprove} className="h-10 px-6 rounded-xl bg-[#BACCB3] text-[#111224] text-[9px] font-black uppercase tracking-widest gap-2 flex items-center shadow-xl shadow-[#BACCB3]/10">
                <CheckCircle2 className="h-3.5 w-3.5" /> CERTIFY PROFILE
            </Button>
        )}
        <button 
            onClick={() => toggleFeatureSpecialist(specialist.id, isFeatured)}
            className={cn(
                "h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all gap-2 flex items-center",
                isFeatured ? "bg-purple-500/20 text-[#7c6ff7] border border-purple-500/20" : "bg-white/5 text-zinc-500 hover:text-white"
            )}
        >
            <Star className={cn("h-3.5 w-3.5", isFeatured && "fill-[#7c6ff7]")} />
            {isFeatured ? "FEATURED SPECIALIST" : "FEATURE ON LIST"}
        </button>
        <Button variant="ghost" className="h-10 w-10 rounded-xl bg-white/5 text-zinc-500 hover:text-white">
            <ExternalLink className="h-4 w-4" />
        </Button>
        <div className="h-8 w-[1px] bg-white/5 mx-2" />
        <Button onClick={handleSuspend} className="h-10 px-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-[9px] font-black uppercase tracking-widest">
            SUSPEND
        </Button>
      </div>
    </div>
  );
}
