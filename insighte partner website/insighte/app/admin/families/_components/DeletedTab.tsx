"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Trash2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { fetchFamilies } from '../actions/families';

export default function DeletedTab() {
  const [deletedFamilies, setDeletedFamilies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await fetchFamilies({ status: 'deleted' });
      setDeletedFamilies(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[2rem] flex items-center gap-6">
         <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
            <ShieldAlert className="h-8 w-8" />
         </div>
         <div className="space-y-1">
            <h4 className="text-lg font-black italic uppercase text-white tracking-tight">Cemetery Registry // Purge Protocol</h4>
            <p className="text-[10px] font-bold text-zinc-600 italic uppercase">Families in this table are soft-deleted. Restore them within 30 days or initiate permanent hard purge.</p>
         </div>
      </div>

      <div className="bg-[#191a2d]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 h-16">
                <th className="pl-8 text-[9px] font-black uppercase tracking-widest text-zinc-500">Parent Name</th>
                <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Deleted Date</th>
                <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Reason</th>
                <th className="pr-8 text-right text-[9px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr className="h-20 animate-pulse"><td colSpan={4} className="px-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td></tr>
              ) : deletedFamilies.length === 0 ? (
                <tr>
                   <td colSpan={4} className="py-20 text-center text-xs text-zinc-600 italic">Cemetery registry is empty. Protocol synchronized.</td>
                </tr>
              ) : (
                deletedFamilies.map((family) => (
                  <tr key={family.id} className="h-20 hover:bg-white/[0.02] transition-all">
                    <td className="pl-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black italic uppercase text-white tracking-tight">{family.full_name}</span>
                        <span className="text-[8px] font-medium text-zinc-600">{family.email}</span>
                      </div>
                    </td>
                    <td className="px-4">
                      <span className="text-[10px] font-bold text-zinc-500 italic">
                        {family.deleted_at ? format(new Date(family.deleted_at), 'MMM dd, yyyy') : 'Recently'}
                      </span>
                    </td>
                    <td className="px-4">
                      <span className="text-[10px] font-bold text-zinc-600 line-clamp-1 italic max-w-xs">{family.deletion_reason || 'No reason provided'}</span>
                    </td>
                    <td className="pr-8 text-right">
                      <div className="flex justify-end gap-3">
                        <button title="Restore" className="h-10 px-4 rounded-xl bg-[#baccb3] text-[#111224] text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                           <RefreshCcw className="h-3 w-3" /> Restore Sync
                        </button>
                        <button title="Hard Delete" className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all">
                           <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
