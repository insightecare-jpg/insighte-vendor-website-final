"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Wallet, DollarSign, ArrowUpRight, CheckCircle, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EarningsSection({ specialist }: { specialist: any }) {
  return (
    <div className="bg-[#191a2d]/60 rounded-[3rem] border border-white/5 p-12 space-y-12 shadow-3xl">
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-1.5 rounded-full bg-[#BACCB3]" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">SECTION 06 // FINANCIAL RECONCILIATION & PAYOUTS</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* INVOICES TABLE */}
        <div className="space-y-6">
            <h3 className="text-sm font-black italic uppercase text-white tracking-tight ml-1">Clinical Invoices</h3>
            <div className="bg-[#111224] rounded-3xl border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 h-12">
                            <th className="pl-6 text-[8px] font-black uppercase text-zinc-600">Inv #</th>
                            <th className="px-4 text-[8px] font-black uppercase text-zinc-600">Amount</th>
                            <th className="px-4 text-[8px] font-black uppercase text-zinc-600">Status</th>
                            <th className="pr-6 text-right text-[8px] font-black uppercase text-zinc-600">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <tr className="h-14">
                            <td className="pl-6 font-bold text-[10px] text-zinc-500 italic">INS-942</td>
                            <td className="px-4 font-black text-[10px] text-white italic">₹1,200</td>
                            <td className="px-4">
                                <Badge className="bg-amber-500/10 text-amber-500 border-none text-[7px] px-2 rounded-sm font-black">PENDING</Badge>
                            </td>
                            <td className="pr-6 text-right">
                                <button className="text-[8px] font-black uppercase tracking-widest text-[#7c6ff7] hover:text-white transition-all">Approve</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* EARNINGS SUMMARY */}
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111224] p-6 rounded-[2rem] border border-white/5 space-y-2 relative overflow-hidden group hover:border-[#BACCB3]/20 transition-all">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 leading-none">Total Yield</p>
                    <p className="text-3xl font-black italic text-[#BACCB3] tracking-tighter">₹4.8L</p>
                    <div className="absolute top-2 right-4 h-8 w-8 rounded-full bg-[#BACCB3]/10 flex items-center justify-center text-[#BACCB3] opacity-50"><ArrowUpRight className="h-4 w-4" /></div>
                </div>
                <div className="bg-[#111224] p-6 rounded-[2rem] border border-white/5 space-y-2 relative overflow-hidden group hover:border-[#7c6ff7]/20 transition-all">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 leading-none">Pending Payout</p>
                    <p className="text-3xl font-black italic text-[#7c6ff7] tracking-tighter">₹18,200</p>
                    <div className="absolute top-2 right-4 h-8 w-8 rounded-full bg-[#7c6ff7]/10 flex items-center justify-center text-[#7c6ff7] opacity-50"><Wallet className="h-4 w-4" /></div>
                </div>
            </div>

            <Button className="h-16 w-full rounded-2xl bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-[#BACCB3]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <CheckCircle className="h-5 w-5" /> Initiate Institutional Payout Release
            </Button>
            
            <div className="space-y-3">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700 ml-1">Recent Transfers</h4>
                <div className="space-y-2">
                    {[1, 2].map(i => (
                        <div key={i} className="flex items-center justify-between px-6 h-12 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                            <span className="text-[9px] font-bold text-zinc-500 italic uppercase">Apr 0{i}, 2026</span>
                            <span className="text-[10px] font-black text-white italic">₹{12000 + i*1000}</span>
                            <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none text-[7px] px-2 rounded-sm font-black italic">PROCESSED</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
