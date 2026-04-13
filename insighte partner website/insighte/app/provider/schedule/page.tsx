"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Trash2, 
  Save,
  Info,
  ChevronRight,
  Loader2,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from "@/lib/supabase/client";
import { updateProviderAvailability } from "@/lib/actions/provider";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', 
  '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

export default function ProviderSchedule() {
  const [activeDay, setActiveDay] = useState('monday');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
  });

  useEffect(() => {
    async function loadAvailability() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      const devRole = document.cookie.split('; ').find(row => row.startsWith('insighte-dev-role='))?.split('=')[1];
      let uid = user?.id;
      if (!uid && devRole) uid = '00000000-0000-0000-0000-000000000000';

      if (uid) {
        const { data } = await supabase.from('partners').select('id, providers(weekly_availability)').eq('user_id', uid).single();
        if (data && data.providers?.weekly_availability) {
          setAvailability(data.providers.weekly_availability as any);
        }
      }
      setLoading(false);
    }
    loadAvailability();
  }, []);

  const toggleSlot = (day: string, slot: string) => {
    setAvailability(prev => {
      const current = prev[day] || [];
      const updated = current.includes(slot) 
        ? current.filter(s => s !== slot) 
        : [...current, slot].sort();
      return { ...prev, [day]: updated };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await updateProviderAvailability(availability);
    if (res.success) {
      toast.success("Schedule Updated.");
    } else {
      toast.error("Update Failed: " + res.error);
    }
    setSaving(false);
  };

  const clearDay = () => {
     setAvailability(prev => ({ ...prev, [activeDay]: [] }));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 italic text-zinc-600">
        <Loader2 className="h-10 w-10 animate-spin text-[#BACCB3]" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Schedule Grid...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-white">
        <div className="space-y-4">
          <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
            Schedule Settings // Availability
          </Badge>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
            Weekly <br/> <span className="text-[#D3C4B5]">Availability.</span>
          </h1>
        </div>

        <div className="vessel bg-[#1D1E31]/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl flex items-center gap-4 shadow-xl">
           <div className="h-10 w-10 rounded-xl bg-[#BACCB3]/20 flex items-center justify-center text-[#BACCB3]">
              <Clock className="h-5 w-5" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Timezone</p>
              <p className="text-sm font-bold text-white">Asia/Kolkata (GMT+5:30)</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-white">
        {/* LEFT: DAY SELECTOR & GRID */}
        <div className="lg:col-span-8 space-y-8">
           {/* DAY SELECTOR */}
           <div className="flex flex-wrap gap-2 p-2 bg-[#111224] rounded-3xl border border-white/5 overflow-x-auto scrollbar-hide">
              {DAYS.map((day) => (
                 <button
                   key={day}
                   onClick={() => setActiveDay(day)}
                   className={cn(
                     "px-8 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                     activeDay === day 
                        ? "bg-[#D3C4B5] text-[#111224] shadow-lg" 
                        : "text-zinc-600 hover:text-white"
                   )}
                 >
                    {day}
                 </button>
              ))}
           </div>

           {/* SLOTS GRID */}
           <div className="vessel bg-[#111224] p-10 rounded-[3rem] border border-white/5 space-y-10 relative overflow-hidden group shadow-2xl">
              
              <div className="flex items-center justify-between relative z-10">
                 <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                    {activeDay} <span className="text-[#D3C4B5] text-xl">//</span> Slots
                 </h3>
                 <Badge className="bg-white/5 text-zinc-500 border-none rounded-lg px-4 py-1.5 text-[8px] font-black uppercase tracking-widest">
                    {availability[activeDay]?.length || 0} Slots Active
                 </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                 {TIME_SLOTS.map((slot) => {
                    const isSelected = availability[activeDay]?.includes(slot);
                    return (
                       <button
                         key={slot}
                         onClick={() => toggleSlot(activeDay, slot)}
                         className={cn(
                           "h-16 rounded-2xl border transition-all duration-300 flex items-center justify-center text-[10px] font-black uppercase tracking-widest",
                           isSelected 
                               ? "bg-[#BACCB3] text-[#111224] border-transparent shadow-lg" 
                               : "bg-[#0d0f1a] text-zinc-600 border-white/5 hover:border-[#BACCB3]/30"
                         )}
                       >
                          {slot}
                       </button>
                    );
                 })}
              </div>

              <div className="pt-10 flex gap-4 relative z-10">
                 <Button 
                   onClick={handleSave}
                   disabled={saving}
                   className="flex-grow h-18 rounded-[1.5rem] bg-[#D3C4B5] text-[#111224] font-black uppercase tracking-[0.2em] text-xs hover:shadow-2xl hover:scale-[1.01] transition-all"
                 >
                     {saving ? (
                       <span className="flex items-center gap-4"><Loader2 className="h-4 w-4 animate-spin" /> Saving Schedule...</span>
                     ) : (
                       <><Save className="h-4 w-4 mr-3" /> Save Weekly Schedule</>
                     )}
                 </Button>
                 <Button 
                   variant="ghost" 
                   onClick={clearDay}
                   className="h-18 w-18 rounded-[1.5rem] bg-white/5 border border-white/5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center"
                 >
                    <Trash2 className="h-6 w-6" />
                 </Button>
              </div>
           </div>
        </div>

        {/* RIGHT: GUIDELINES & LEGEND */}
        <div className="lg:col-span-4 space-y-8">
           <div className="vessel bg-[#1D1E31]/50 border border-white/5 p-10 rounded-[3rem] space-y-12 shadow-xl">
              <div className="space-y-4">
                  <h4 className="text-xl font-black italic uppercase tracking-tight text-white">Scheduling Rules</h4>
                 <div className="h-1 w-12 bg-[#BACCB3] rounded-full" />
              </div>

              <div className="space-y-8">
                 <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#BACCB3]/10 flex-shrink-0 flex items-center justify-center text-[#BACCB3]">
                       <ShieldCheck className="h-6 w-6" />
                    </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">Session Buffers</p>
                        <p className="text-xs text-zinc-600 leading-relaxed font-bold italic">The system automatically adds 15m transition buffers between back-to-back sessions.</p>
                     </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#D3C4B5]/10 flex-shrink-0 flex items-center justify-center text-[#D3C4B5]">
                       <Calendar className="h-6 w-6" />
                    </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">Booking Window</p>
                        <p className="text-xs text-zinc-600 leading-relaxed font-bold italic">Your schedule is applied to a rolling 4-week window. You can block specific dates in your agenda.</p>
                     </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                 <button className="w-full flex items-center justify-between group py-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors italic">Manage Leave / Holidays</span>
                    <ChevronRight className="h-4 w-4 text-zinc-800 group-hover:text-[#BACCB3] transition-colors" />
                 </button>
              </div>
           </div>

           <div className="p-10 bg-[#BACCB3]/5 border border-[#BACCB3]/10 rounded-3xl space-y-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-[#BACCB3] mx-auto opacity-40" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 leading-relaxed">
                Changes to availability are instant. All upcoming slots will be updated in the marketplace.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
