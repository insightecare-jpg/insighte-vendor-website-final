"use client";

import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ReportsTab() {
  const [reportType, setReportType] = useState('sessions');

  const summaryCards = [
    { label: 'Total Sessions', value: '1,284', trend: '+12%' },
    { label: 'Completed', value: '1,102', trend: 'Stable' },
    { label: 'Cancelled', value: '42', trend: '-5%' },
    { label: 'Rescheduled', value: '140', trend: '+2%' },
    { label: 'Unique Families', value: '842', trend: '+18' },
    { label: 'Yield Total', value: '₹4.8L', trend: '+8%' }
  ];

  return (
    <div className="space-y-10">
      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#191a2d]/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5">
        <div className="flex bg-[#111224] p-1 rounded-xl w-full md:w-auto">
          {['sessions', 'packages', 'families'].map(type => (
            <button
               key={type}
               onClick={() => setReportType(type)}
               className={`flex-1 md:flex-none px-6 h-10 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                 reportType === type ? 'bg-[#baccb3] text-[#111224]' : 'text-zinc-600 hover:text-white'
               }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="flex items-center gap-2 text-zinc-500 bg-[#111224] px-4 h-10 rounded-xl border border-white/5">
              <Calendar className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">April 2026 // Current Month</span>
           </div>
           <Button variant="outline" className="h-10 border-white/10 text-white bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
              <Download className="h-4 w-4" /> Export CSV
           </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-[#111224] border border-white/5 p-6 rounded-2xl space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{card.label}</p>
            <div className="flex items-end justify-between">
              <h4 className="text-xl font-black italic text-white leading-none">{card.value}</h4>
              <span className="text-[8px] font-bold text-[#baccb3]">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DATA TABLE (MOCK) */}
      <div className="bg-[#191a2d]/40 backdrop-blur-md rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <h4 className="text-sm font-black italic uppercase tracking-tighter text-white">Institutional Sync Log // {reportType}</h4>
           <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500">
              <FileText className="h-4 w-4" />
           </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full border-collapse text-left">
              <thead>
                 <tr className="border-b border-white/5 h-14">
                    <th className="pl-8 text-[9px] font-black uppercase tracking-widest text-zinc-600">Period</th>
                    <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-600">Specialist</th>
                    <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-600">Client</th>
                    <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-600">Program</th>
                    <th className="px-4 text-[9px] font-black uppercase tracking-widest text-zinc-600">Status</th>
                    <th className="pr-8 text-right text-[9px] font-black uppercase tracking-widest text-zinc-600">Yield</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="h-14 hover:bg-white/[0.01] transition-all">
                       <td className="pl-8 text-[10px] font-bold text-zinc-500 italic">Apr 1{i}, 14:00</td>
                       <td className="px-4 text-[10px] font-black uppercase text-white font-manrope tracking-tight">Dr. Aradhana {i}</td>
                       <td className="px-4 text-[10px] font-bold text-zinc-400">Verma Family</td>
                       <td className="px-4 font-manrope">
                          <Badge className="bg-[#baccb3]/10 text-[#baccb3] border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-sm">
                             Behavioral Arc
                          </Badge>
                       </td>
                       <td className="px-4">
                           <Badge className="bg-green-500/10 text-green-400 border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-sm">Sync'd</Badge>
                       </td>
                       <td className="pr-8 text-right text-[10px] font-black text-white">₹1,800</td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}
