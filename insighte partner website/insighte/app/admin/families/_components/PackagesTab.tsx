"use client";

import React, { useState, useEffect } from 'react';
import { fetchPackages } from '../actions/packages';
import PackageRow from './PackageRow';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";

export default function PackagesTab() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchPackages({});
      setPackages(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* COMPACT FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 bg-[#191a2d]/40 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search client or specialist..." 
            className="h-10 pl-10 bg-white/5 border-none rounded-xl text-xs font-medium focus:ring-1 ring-[#baccb3]/50"
          />
        </div>
      </div>

      <div className="bg-[#191a2d]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 h-16">
                <th className="pl-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Client</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Package</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Specialist</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Used / Total</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Remaining</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Expires</th>
                <th className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                <th className="pr-8 text-right text-[10px] font-black uppercase tracking-widest text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="h-16 animate-pulse"><td colSpan={8} className="px-8"><div className="h-4 bg-white/5 rounded-full w-full" /></td></tr>
                 ))
              ) : packages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-xs text-zinc-600 italic">No package purchases found.</td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <PackageRow key={pkg.id} pkg={pkg} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
