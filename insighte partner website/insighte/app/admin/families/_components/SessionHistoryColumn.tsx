"use client";

import React from 'react';
import { Clock, ExternalLink, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

export default function SessionHistoryColumn({ family }: { family: any }) {
  const bookings = family.bookings || [];
  const sorted = [...bookings].sort((a: any, b: any) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#baccb3]/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-[#baccb3]" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">Clinical Timeline // Analytics</h4>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">View Full Archive</button>
      </div>

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-[10px] text-zinc-600 italic py-4">No historical sessions recorded for this family registry.</p>
        ) : (
          sorted.slice(0, 5).map((session: any) => (
            <div key={session.id} className="group flex items-center gap-6 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer">
               <div className="h-12 w-12 rounded-xl bg-[#111224] flex flex-col items-center justify-center border border-white/5 shrink-0">
                  <span className="text-[8px] font-black text-zinc-500 uppercase">{format(new Date(session.scheduled_at), 'MMM')}</span>
                  <span className="text-sm font-black text-white italic leading-none">{format(new Date(session.scheduled_at), 'dd')}</span>
               </div>

               <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     <h5 className="text-xs font-black uppercase italic text-white truncate tracking-tight">Clinical Sync</h5>
                     <Badge className={cn(
                        "text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border-none",
                        session.status === 'upcoming' ? "bg-blue-500/10 text-blue-400" :
                        session.status === 'completed' ? "bg-green-500/10 text-green-400" :
                        "bg-red-500/10 text-red-400"
                     )}>
                        {session.status}
                     </Badge>
                  </div>
                  <p className="text-[8px] font-bold text-zinc-600 tracking-widest uppercase truncate"> 
                     14:00 PM — 60 Min // Specialist ID: {session.provider_id.split('-')[0]}
                  </p>
               </div>

               <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {session.status === 'upcoming' ? (
                     <>
                        <button title="Reschedule" className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20">
                           <Calendar className="h-3.5 w-3.5" />
                        </button>
                        <button title="Cancel" className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20">
                           <XCircle className="h-3.5 w-3.5" />
                        </button>
                     </>
                  ) : (
                     <button title="View Report" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white">
                        <ExternalLink className="h-3.5 w-3.5" />
                     </button>
                  )}
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
