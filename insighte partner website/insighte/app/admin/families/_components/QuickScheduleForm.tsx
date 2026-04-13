"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { fetchAllSpecialists, fetchServicesForSpecialist, fetchAvailableSlots } from '../actions/data';
import { scheduleSession } from '../actions/bookings';
import { cn } from "@/lib/utils";

export default function QuickScheduleForm({ family }: { family: any }) {
  const [formData, setFormData] = useState<any>({
    child_id: '',
    provider_id: '',
    service_id: '',
    date: '',
    slot_id: '',
    package_id: '',
    billing_type: 'one_off',
    notes: ''
  });

  const [specialists, setSpecialists] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function init() {
        const specs = await fetchAllSpecialists();
        setSpecialists(specs);
    }
    init();
  }, []);

  useEffect(() => {
    if (formData.provider_id) {
        fetchServicesForSpecialist(formData.provider_id).then(setServices);
    }
  }, [formData.provider_id]);

  useEffect(() => {
    if (formData.provider_id && formData.date) {
        fetchAvailableSlots(formData.provider_id, formData.date).then(setSlots);
    }
  }, [formData.provider_id, formData.date]);

  const handleSubmit = async () => {
    setLoading(true);
    const selectedSlot = slots.find(s => s.id === formData.slot_id);
    const res = await scheduleSession({
        client_id: family.id,
        child_id: formData.child_id,
        provider_id: formData.provider_id,
        service_id: formData.service_id,
        scheduled_at: selectedSlot?.start_time,
        notes: formData.notes
    });
    setLoading(false);
    if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-[#baccb3]/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-[#baccb3]" />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">Protocol // Quick Schedule</h4>
      </div>

      <div className="space-y-4">
        {/* STEP 1: SELECT CHILD */}
        <div className="space-y-1.5">
          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1">Select Learner</label>
          <Select onValueChange={(val) => setFormData({...formData, child_id: val})}>
            <SelectTrigger className="bg-[#111224] border-none rounded-xl h-11 text-[10px] font-bold">
              <SelectValue placeholder="Choose a child..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1d1e31] border-white/5">
              {family.children?.map((child: any) => (
                <SelectItem key={child.id} value={child.id} className="text-[10px] font-bold uppercase">{child.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* STEP 2: SELECT SPECIALIST */}
        <div className="space-y-1.5">
          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1">Assigned Specialist</label>
          <Select onValueChange={(val) => setFormData({...formData, provider_id: val})}>
            <SelectTrigger className="bg-[#111224] border-none rounded-xl h-11 text-[10px] font-bold">
              <SelectValue placeholder="Search specialist..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1d1e31] border-white/5">
              {specialists.map((spec: any) => (
                <SelectItem key={spec.id} value={spec.id} className="text-[10px] font-bold uppercase">{spec.name} ({spec.category})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* STEP 3: SELECT SERVICE */}
        <div className="space-y-1.5">
          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1">Clinical Service</label>
          <Select disabled={!formData.provider_id} onValueChange={(val) => setFormData({...formData, service_id: val})}>
            <SelectTrigger className="bg-[#111224] border-none rounded-xl h-11 text-[10px] font-bold text-white">
              <SelectValue placeholder={formData.provider_id ? "Choose service..." : "Select specialist first"} />
            </SelectTrigger>
            <SelectContent className="bg-[#1d1e31] border-white/5">
               {services.map(s => (
                 <SelectItem key={s.id} value={s.id} className="text-[10px] font-bold uppercase text-white">{s.title} — ₹{s.rate}</SelectItem>
               ))}
            </SelectContent>
          </Select>
        </div>

        {/* STEP 4: CONTRACT TYPE & PACKAGE */}
        <div className="space-y-1.5">
          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1">Billing Protocol</label>
          <div className="flex bg-[#111224] p-1 rounded-xl">
             <button 
                onClick={() => setFormData({...formData, billing_type: 'one_off', package_id: ''})}
                className={cn(
                    "flex-1 h-8 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                    formData.billing_type === 'one_off' ? "bg-[#baccb3] text-[#111224]" : "text-zinc-500 hover:text-white"
                )}
             >
                One-Off (Invoice)
             </button>
             <button 
                onClick={() => setFormData({...formData, billing_type: 'package'})}
                className={cn(
                    "flex-1 h-8 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                    formData.billing_type === 'package' ? "bg-[#baccb3] text-[#111224]" : "text-zinc-500 hover:text-white"
                )}
             >
                Package Credit
             </button>
          </div>
        </div>

        {formData.billing_type === 'package' && (
          <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[8px] font-black uppercase tracking-widest text-[#baccb3] ml-1">Select Bundle</label>
            <Select onValueChange={(val) => setFormData({...formData, package_id: val})}>
                <SelectTrigger className="bg-[#111224] border border-[#baccb3]/20 rounded-xl h-11 text-[10px] font-bold text-white">
                <SelectValue placeholder="Choose active package..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1d1e31] border-white/5">
                {/* Mocked for now, would fetch from package_purchases */}
                <SelectItem value="pkg_1" className="text-[10px] font-bold uppercase text-white">Clinical Series (4/12 Rem.)</SelectItem>
                </SelectContent>
            </Select>
          </div>
        )}

        {/* STEP 5: DATE */}
        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1">Date</label>
                <input 
                    type="date" 
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-[#111224] border-none rounded-xl h-11 text-[10px] font-bold text-white px-3" 
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1">Select Slot</label>
                <Select disabled={!formData.date} onValueChange={(val) => setFormData({...formData, slot_id: val})}>
                    <SelectTrigger className="bg-[#111224] border-none rounded-xl h-11 text-[10px] font-bold">
                        <SelectValue placeholder="Slot" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1d1e31] border-white/5">
                        {slots.map(slot => (
                            <SelectItem key={slot.id} value={slot.id} className="text-[10px] font-bold uppercase">
                                {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[8px] font-black uppercase tracking-widest text-zinc-600 ml-1">Internal Notes</label>
          <Textarea 
             placeholder="Focusing on social engagement..."
             className="bg-[#111224] border-none rounded-xl text-[10px] font-bold placeholder:text-zinc-800"
             onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <Button 
            disabled={loading || !formData.slot_id}
            onClick={handleSubmit}
            className="w-full h-11 bg-[#baccb3] text-[#111224] font-black uppercase tracking-widest text-[9px] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#baccb3]/10"
        >
          {loading ? "Initializing..." : success ? "Scheduled. Sync Complete." : "Schedule & Notify Family"}
        </Button>
      </div>
    </div>
  );
}
