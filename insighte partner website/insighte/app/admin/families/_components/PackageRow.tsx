"use client";

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { PlusCircle, Calendar } from 'lucide-react';
import { topUpPackage } from '../actions/packages';
import { cn } from "@/lib/utils";

export default function PackageRow({ pkg }: { pkg: any }) {
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [topUpValue, setTopUpValue] = useState("");

  const handleTopUp = async () => {
    const val = parseInt(topUpValue);
    if (!isNaN(val) && val > 0) {
        await topUpPackage(pkg.id, val);
        setIsToppingUp(false);
    }
  };

  return (
    <tr className="h-16 hover:bg-white/[0.02] transition-all">
      <td className="pl-8">
        <span className="text-xs font-black uppercase italic text-white">{pkg.client?.full_name || 'Legacy Client'}</span>
      </td>
      <td className="px-4">
        <span className="text-[10px] font-bold text-[#d3c4b5] uppercase tracking-widest">{pkg.package?.name || 'Bundle'}</span>
      </td>
      <td className="px-4">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{pkg.provider?.name || '—'}</span>
      </td>
      <td className="px-4">
        <span className="text-[10px] font-bold text-zinc-600">{pkg.sessions_total - pkg.sessions_remaining} / {pkg.sessions_total}</span>
      </td>
      <td className="px-4">
        <span className={cn(
            "text-xs font-black italic",
            pkg.sessions_remaining > 0 ? "text-white" : "text-zinc-700"
        )}>
            {pkg.sessions_remaining}
        </span>
      </td>
      <td className="px-4">
        <span className="text-[10px] font-medium text-zinc-600">
            {pkg.expires_at ? format(new Date(pkg.expires_at), 'MMM dd, yyyy') : 'No Expiry'}
        </span>
      </td>
      <td className="px-4">
        <Badge className={cn(
            "text-[8px] font-black uppercase tracking-widest border-none px-3 py-1 rounded-full",
            pkg.status === 'active' ? "bg-green-500/10 text-green-400" :
            pkg.status === 'expiring_soon' ? "bg-amber-500/10 text-amber-400" :
            "bg-red-500/10 text-red-400"
        )}>
            {pkg.status}
        </Badge>
      </td>
      <td className="pr-8 text-right">
        <div className="flex justify-end gap-2">
            {isToppingUp ? (
                <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                    <input 
                        className="w-16 h-8 bg-[#111224] border-none rounded-lg text-[10px] font-bold px-2 text-white" 
                        placeholder="+ Sesh"
                        value={topUpValue}
                        onChange={(e) => setTopUpValue(e.target.value)}
                    />
                    <button onClick={handleTopUp} className="h-8 px-3 rounded-lg bg-[#baccb3] text-[#111224] text-[8px] font-black uppercase">Add</button>
                    <button onClick={() => setIsToppingUp(false)} className="h-8 px-3 rounded-lg bg-white/5 text-zinc-500 text-[8px] font-black uppercase">Cancel</button>
                </div>
            ) : (
                <button onClick={() => setIsToppingUp(true)} className="h-8 px-3 rounded-lg bg-white/5 flex items-center gap-2 hover:bg-[#baccb3]/20 hover:text-[#baccb3] text-zinc-500 transition-all text-[8px] font-black uppercase tracking-widest">
                    <PlusCircle className="h-3 w-3" /> Top Up
                </button>
            )}
        </div>
      </td>
    </tr>
  );
}
