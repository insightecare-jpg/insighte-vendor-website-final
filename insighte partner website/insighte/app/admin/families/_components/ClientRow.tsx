"use client";

import React from 'react';
import { 
  Calendar, 
  Edit2, 
  Trash2, 
  ChevronDown,
  Clock,
  User
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import ClientRowExpanded from './ClientRowExpanded';
import { cn } from "@/lib/utils";

export default function ClientRow({ family, index, isExpanded, onToggle }: {
  family: any;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const children = family.children || [];
  const bookings = family.bookings || [];
  const upcomingCount = bookings.filter((b: any) => b.status === 'upcoming').length;
  
  // Get unique specialists (provider_ids)
  const specialistIds = Array.from(new Set(bookings.map((b: any) => b.provider_id))).filter(Boolean);

  // Get last session
  const completedSessions = bookings
    .filter((b: any) => b.status === 'completed')
    .sort((a: any, b: any) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());
  
  const lastSession = completedSessions[0];

  return (
    <>
      <tr 
        onClick={onToggle}
        className={cn(
          "group h-20 transition-all cursor-pointer",
          isExpanded ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
        )}
      >
        <td className="pl-8 text-xs font-bold text-zinc-600 italic">#{String(index).padStart(2, '0')}</td>
        
        <td className="px-4">
          <div className="flex flex-col">
            <span className="text-sm font-black italic uppercase text-white tracking-tight">{family.full_name}</span>
            <span className="text-[10px] font-medium text-zinc-600 lowercase">{family.email}</span>
          </div>
        </td>

        <td className="px-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-6 border-white/10 text-[#d3c4b5] bg-[#d3c4b5]/5 font-black uppercase tracking-widest text-[8px]">
              {children.length} Children
            </Badge>
          </div>
        </td>

        <td className="px-4">
          <div className="flex flex-wrap gap-1">
             {children[0]?.services_needed ? (
                <>
                  <Badge className="bg-[#baccb3]/10 text-[#baccb3] border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-sm">
                    {children[0].services_needed[0] || 'Behavioral'}
                  </Badge>
                  {children.length > 1 && (
                    <Badge className="bg-white/5 text-zinc-600 border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-sm">
                      +{children.length - 1}
                    </Badge>
                  )}
                </>
             ) : (
                <span className="text-[10px] text-zinc-700 italic">—</span>
             )}
          </div>
        </td>

        <td className="px-4">
          <div className="flex -space-x-2">
            {specialistIds.length > 0 ? (
               specialistIds.slice(0, 3).map((id, i) => (
                 <div key={i as any} className="h-7 w-7 rounded-full bg-[#1d1e31] border-2 border-[#111224] flex items-center justify-center overflow-hidden">
                    <User className="h-4 w-4 text-[#d3c4b5]" />
                 </div>
               ))
            ) : (
              <span className="text-[10px] text-zinc-700 italic">—</span>
            )}
          </div>
        </td>

        <td className="px-4">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            upcomingCount > 0 ? "text-[#baccb3]" : "text-zinc-700"
          )}>
            {upcomingCount} Upcoming
          </span>
        </td>

        <td className="px-4">
          <span className="text-[10px] font-bold text-zinc-500 italic">
            {lastSession ? formatDistanceToNow(new Date(lastSession.scheduled_at), { addSuffix: true }) : 'Never'}
          </span>
        </td>

        <td className="px-4">
          <Badge className="bg-[#baccb3]/10 text-[#baccb3] border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            Active
          </Badge>
        </td>

        <td className="pr-8 text-right" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button title="Schedule" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#baccb3]/20 hover:text-[#baccb3] transition-all text-zinc-500">
               <Calendar className="h-4 w-4" />
            </button>
            <button title="Edit" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/15 transition-all text-zinc-500 hover:text-white">
               <Edit2 className="h-4 w-4" />
            </button>
            <button title="Delete" className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all text-zinc-500">
               <Trash2 className="h-4 w-4" />
            </button>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500">
               <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
            </div>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-[#1d1e31]/30 backdrop-blur-3xl border-l-[3px] border-[#baccb3]">
          <td colSpan={9} className="p-0 overflow-hidden">
             <ClientRowExpanded family={family} />
          </td>
        </tr>
      )}
    </>
  );
}
