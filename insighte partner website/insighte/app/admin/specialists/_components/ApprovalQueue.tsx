"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ApprovalCard from "./ApprovalCard";
import { createClient } from "@/lib/supabase/client";

export default function ApprovalQueue({ count }: { count: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const [pendingList, setPendingList] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
        const { data } = await supabase
            .from('partners')
            .select('*')
            .eq('approval_status', 'PENDING_REVIEW')
            .order('created_at', { ascending: true });
        setPendingList(data || []);
    }
    load();
  }, []);

  if (pendingList.length === 0) return null;

  return (
    <div className="bg-[#191a2d]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden">
      {/* HEADER */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-8 py-6 group"
      >
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Pending Review</span>
            <Badge className="bg-amber-500/10 text-amber-500 border-none rounded-full px-4 h-6 text-[9px] font-black">{pendingList.length} PROFILES</Badge>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-zinc-600 group-hover:text-white transition-all", !isOpen && "-rotate-90")} />
      </button>

      {/* HORIZONTAL SCROLL ROW */}
      {isOpen && (
        <div className="px-8 pb-8 animate-in slide-in-from-top-2">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {pendingList.map(specialist => (
                    <ApprovalCard 
                        key={specialist.id} 
                        specialist={specialist} 
                        onAction={() => setPendingList(prev => prev.filter(p => p.id !== specialist.id))}
                    />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
