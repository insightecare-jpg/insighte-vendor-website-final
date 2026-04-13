"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function AdminSupportHub() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTickets() {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setTickets(data || []);
      setLoading(false);
    }
    fetchTickets();
  }, []);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* HEADER HUD */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <Badge className="bg-[#D3C4B5]/10 text-[#D3C4B5] border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
            Institutional Support // Concierge
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black font-manrope tracking-tighter italic uppercase text-white leading-none">
            Ticket <br/> <span className="text-[#D3C4B5]">Architecture.</span>
          </h1>
        </div>

        <div className="vessel bg-[#1D1E31]/50 border border-white/5 p-6 rounded-3xl flex items-center gap-4">
           <div className="h-10 w-10 rounded-xl bg-[#BACCB3]/20 flex items-center justify-center text-[#BACCB3]">
              <MessageSquare className="h-5 w-5" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Syncs</p>
              <p className="text-sm font-bold text-white">{tickets.filter(t => t.status === 'open').length} Open Channels</p>
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT: TICKET LISTING */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black italic uppercase tracking-tight">Support Queue</h3>
              <div className="flex gap-2">
                 <Badge className="bg-[#D3C4B5] text-[#111224] rounded-full px-4 font-black text-[8px] uppercase">Open</Badge>
                 <Badge className="bg-white/5 text-zinc-500 rounded-full px-4 font-black text-[8px] uppercase">Resolved</Badge>
              </div>
           </div>

           <div className="space-y-4">
              {loading ? (
                 <p className="text-zinc-600 italic">Syncing Support Registry...</p>
              ) : tickets.length === 0 ? (
                 <div className="vessel bg-[#1D1E31] p-20 text-center space-y-4 border border-white/5">
                    <LifeBuoy className="h-12 w-12 mx-auto text-zinc-800" />
                    <p className="text-xl font-black italic uppercase text-zinc-700">No active support escalations.</p>
                 </div>
              ) : (
                 tickets.map((ticket) => (
                    <div key={ticket.id} className="vessel bg-[#111224] border border-white/5 p-8 rounded-[2.5rem] hover:bg-[#1D1E31] transition-all group cursor-pointer relative overflow-hidden">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                                "h-3 w-3 rounded-full",
                                ticket.priority === 'high' ? "bg-red-500 shadow-glow glow-red-500/50" : "bg-[#BACCB3]"
                             )} />
                             <Badge className="bg-white/5 text-zinc-500 border-none rounded-lg px-2 text-[8px] font-black uppercase">
                                Ticket #{ticket.id.slice(0, 5)}
                             </Badge>
                          </div>
                          <p className="text-[8px] font-bold text-zinc-700 uppercase italic">Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
                       </div>

                       <div className="space-y-2">
                          <h4 className="text-2xl font-black italic uppercase tracking-tight text-white group-hover:text-[#D3C4B5] transition-colors">{ticket.subject || "No Subject"}</h4>
                          <p className="text-sm text-zinc-500 font-medium leading-relaxed italic line-clamp-1">{ticket.description}</p>
                       </div>

                       <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] text-zinc-600">
                                {ticket.user_id?.slice(0, 2).toUpperCase() || "SY"}
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 italic">Auth ID: {ticket.user_id?.slice(0, 8)}</span>
                          </div>
                          <ChevronRight className="h-5 w-5 text-zinc-800 group-hover:text-[#D3C4B5] transition-transform group-hover:translate-x-1" />
                       </div>
                    </div>
                 ))
              )}
           </div>
        </div>

        {/* RIGHT: SEARCH & CATEGORIES */}
        <div className="lg:col-span-4 space-y-8">
           <div className="vessel bg-[#1D1E31] p-10 rounded-[3rem] space-y-8 border border-white/5">
              <div className="space-y-4">
                 <h4 className="text-sm font-black uppercase tracking-widest italic text-white">Registry Search</h4>
                 <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <input className="h-14 w-full rounded-2xl bg-[#111224] border-none pl-14 text-xs font-bold text-white focus:ring-1 ring-[#D3C4B5]/30 outline-none" placeholder="Search tickets..." />
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-sm font-black uppercase tracking-widest italic text-white">Common Triage</h4>
                 <div className="space-y-2">
                    {['Booking Conflict', 'Yield Settlement', 'Protocol Access', 'Identity Verification'].map(cat => (
                       <button key={cat} className="w-full h-12 px-6 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-left hover:text-white hover:bg-white/10 transition-all flex items-center justify-between group">
                          {cat}
                          <Badge className="bg-black/60 text-[#BACCB3] border-none">0</Badge>
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-[#BACCB3]/10 border border-[#BACCB3]/10 p-10 rounded-[3rem] space-y-4 text-center">
              <AlertCircle className="h-8 w-8 text-[#BACCB3] mx-auto" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3] leading-relaxed italic">
                 Priority 1 escalations trigger automatic push notifications to the on-call registrar.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
