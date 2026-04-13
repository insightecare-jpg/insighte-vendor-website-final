"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Star, 
  MapPin, 
  PauseCircle, 
  Trash2, 
  Award,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toggleFeatureSpecialist, suspendSpecialist } from "../actions/specialists";

export default function SpecialistRow({ specialist }: { specialist: any }) {
  const isFeatured = specialist.user?.is_featured;

  const handleToggleFeatured = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFeatureSpecialist(specialist.id, isFeatured);
  };

  const handleSuspend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const reason = prompt("Enter suspension reason for specialist notification:");
    if (reason) await suspendSpecialist(specialist.id, reason);
  };

  return (
    <tr 
        onClick={() => window.location.href = `/admin/specialists/${specialist.id}`}
        className="group h-20 hover:bg-white/[0.03] transition-all cursor-pointer relative"
    >
      {/* AVATAR */}
      <td className="pl-8">
        <div className="h-9 w-9 rounded-xl bg-[#0d0f1a] border border-white/5 flex items-center justify-center font-black text-[10px] text-zinc-700">
            {specialist.name?.[0]}
        </div>
      </td>

      {/* NAME & TIER */}
      <td className="px-4">
        <div className="flex flex-col">
            <span className="text-sm font-black italic uppercase text-white tracking-tight leading-none mb-1">
                {specialist.name}
            </span>
            <Badge className={cn(
                "h-4 px-2 rounded-sm border-none text-[7px] font-black uppercase tracking-[0.2em] w-fit",
                specialist.tier === 'insighte' ? "bg-purple-500/10 text-[#7c6ff7]" :
                specialist.tier === 'premium' ? "bg-amber-500/10 text-amber-500" :
                "bg-zinc-800 text-zinc-500"
            )}>
                {specialist.tier || 'PARTNER'}
            </Badge>
        </div>
      </td>

      {/* SERVICES */}
      <td className="px-4">
        <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="h-5 border-white/10 text-[#BACCB3] bg-[#BACCB3]/5 text-[8px] font-black uppercase rounded-sm">
                Behavioral
            </Badge>
        </div>
      </td>

      {/* LOCATION */}
      <td className="px-4">
        <div className="flex items-center gap-2 text-zinc-500">
            <MapPin className="h-3 w-3" />
            <span className="text-[10px] font-bold text-zinc-400 italic">{specialist.city}</span>
        </div>
      </td>

      {/* SESSIONS */}
      <td className="px-4 text-center">
        <span className="text-xs font-black italic text-zinc-400">0</span>
      </td>

      {/* EARNINGS */}
      <td className="px-4 text-right">
        <span className="text-xs font-black text-white italic">₹0.00</span>
      </td>

      {/* RATING */}
      <td className="px-4">
        <div className="flex items-center justify-center gap-1.5">
            <Star className="h-3 w-3 text-[#D3C4B5] fill-[#D3C4B5]" />
            <span className="text-[10px] font-black italic text-white leading-none mt-0.5">5.0</span>
        </div>
      </td>

      {/* STATUS */}
      <td className="px-4">
        <div className="flex flex-wrap gap-2">
            <Badge className={cn(
                "h-6 px-3 rounded-full border-none text-[8px] font-black uppercase tracking-widest",
                specialist.approval_status === 'APPROVED' ? "bg-[#BACCB3]/10 text-[#BACCB3]" :
                specialist.approval_status === 'PENDING_REVIEW' ? "bg-amber-500/10 text-amber-500" :
                "bg-red-500/10 text-red-500"
            )}>
                {specialist.approval_status}
            </Badge>
            {isFeatured && (
                <Badge className="h-6 px-3 rounded-full bg-purple-500/10 text-[#7c6ff7] border-none text-[8px] font-black uppercase tracking-widest">
                    FEATURED
                </Badge>
            )}
        </div>
      </td>

      {/* ACTIONS */}
      <td className="pr-8 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={`/admin/specialists/${specialist.id}`} title="View Profile" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                <Eye className="h-4 w-4" />
            </Link>
            <button 
                onClick={handleToggleFeatured} 
                title="Toggle Featured" 
                className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                    isFeatured ? "bg-purple-500/20 text-[#7c6ff7]" : "bg-white/5 text-zinc-500 hover:text-[#7c6ff7]"
                )}
            >
                <Award className="h-4 w-4" />
            </button>
            <button onClick={handleSuspend} title="Suspend Account" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:bg-red-500/20 hover:text-red-500 transition-all">
                <PauseCircle className="h-4 w-4" />
            </button>
            <button title="Delete" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:bg-red-500 hover:text-white transition-all">
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
      </td>
    </tr>
  );
}
