"use client";

import React, { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import ClientRow from './ClientRow';
import { fetchFamilies } from '../actions/families';
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientsTab() {
  const [families, setFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await fetchFamilies(filters);
        setFamilies(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={setFilters} />

      <div className="bg-[#191a2d]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 h-16">
                <th className="pl-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">#</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Parent Name</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Children</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Services Needed</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Assigned</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Upcoming</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Last Session</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                <th className="pr-8 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="h-20 animate-pulse bg-white/[0.02]">
                    <td colSpan={9} className="px-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
                  </tr>
                ))
              ) : families.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-xs text-zinc-600 italic">
                    No family profiles found in the clinical registry.
                  </td>
                </tr>
              ) : (
                families.map((family, idx) => (
                  <ClientRow 
                    key={family.id} 
                    family={family} 
                    index={idx + 1}
                    isExpanded={expandedId === family.id}
                    onToggle={() => setExpandedId(expandedId === family.id ? null : family.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* PAGINATION (PLACEHOLDER) */}
      <div className="flex items-center justify-between px-8 text-zinc-600">
         <span className="text-[10px] font-bold uppercase tracking-widest italic">Syncing 25 of {families.length} // Recordset</span>
         <div className="flex gap-2">
            <button className="h-10 w-24 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all opacity-50 cursor-not-allowed">Prev</button>
            <button className="h-10 w-24 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all opacity-50 cursor-not-allowed">Next</button>
         </div>
      </div>
    </div>
  );
}
