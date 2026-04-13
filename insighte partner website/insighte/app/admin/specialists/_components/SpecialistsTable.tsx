"use client";

import React, { useState, useEffect } from "react";
import SpecialistFilters from "./SpecialistFilters";
import SpecialistRow from "./SpecialistRow";
import AddSpecialistForm from "./AddSpecialistForm";
import { createClient } from "@/lib/supabase/client";

export default function SpecialistsTable() {
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filters, setFilters] = useState<any>({
     status: 'ALL',
     search: '',
     category: 'ALL',
     location: 'ALL'
  });

  const supabase = createClient();

  useEffect(() => {
    async function load() {
        setLoading(true);
        let query = supabase
            .from('partners')
            .select(`
                *,
                user:users (*)
            `)
            .order('created_at', { ascending: false });

        if (filters.status !== 'ALL') {
             if (filters.status === 'APPROVED') query = query.eq('approval_status', 'APPROVED');
             if (filters.status === 'PENDING') query = query.eq('approval_status', 'PENDING_REVIEW');
             if (filters.status === 'SUSPENDED') query = query.eq('approval_status', 'SUSPENDED');
             if (filters.status === 'DEACTIVATED') query = query.eq('approval_status', 'DEACTIVATED');
        }

        if (filters.category !== 'ALL') {
             query = query.or(`category.eq.${filters.category},sub_category.eq.${filters.category}`);
        }

        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
        }

        const { data } = await query;
        setSpecialists(data || []);
        setLoading(false);
    }
    load();
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* FILTER BAR + ADD TRIGGER */}
      <SpecialistFilters 
        onFilterChange={setFilters} 
        onAddClick={() => setShowAdd(!showAdd)} 
        isAddOpen={showAdd}
      />

      {/* INLINE ADD FORM */}
      {showAdd && (
        <div className="animate-in slide-in-from-top-4 duration-500 overflow-hidden">
            <AddSpecialistForm onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {/* DATA TABLE */}
      <div className="bg-[#191a2d]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden shadow-3xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 h-16">
                <th className="pl-8 w-16 text-[9px] font-black uppercase tracking-widest text-zinc-500 italic">ID</th>
                <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Name & Tier</th>
                <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Services</th>
                <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Location</th>
                <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Sessions</th>
                <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-right">Earnings</th>
                <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center">Rating</th>
                <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                <th className="pr-8 text-right text-[9px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="h-20 animate-pulse"><td colSpan={9} className="px-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td></tr>
                 ))
              ) : specialists.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-xs text-zinc-600 italic">No specialist records found matching these criteria.</td>
                </tr>
              ) : (
                specialists.map((specialist) => (
                  <SpecialistRow key={specialist.id} specialist={specialist} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-8 text-zinc-600">
         <span className="text-[10px] font-bold uppercase tracking-widest italic opacity-50">Operational Sync Code: 0x88F-ST</span>
         <div className="flex gap-2">
            <button className="h-10 w-24 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all opacity-50 cursor-not-allowed">Previous</button>
            <button className="h-10 w-24 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all opacity-50 cursor-not-allowed">Next</button>
         </div>
      </div>
    </div>
  );
}
