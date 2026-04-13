"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Wallet, 
  ArrowUpRight, 
  Download, 
  CreditCard,
  PieChart,
  History,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Building,
  Filter,
  ArrowRight,
  Calendar,
  FileText,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getFinanceSummary, submitKYC } from "@/lib/actions/provider/core";

export default function ProviderFinance() {
  const [loading, setLoading] = useState(true);
  const [submittingKYC, setSubmittingKYC] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [kycRecord, setKycRecord] = useState<any>(null);
  const [filter, setFilter] = useState<'WEEK' | 'MONTH' | 'ALL'>('MONTH');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [kycForm, setKycForm] = useState({
    pan: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    holderName: ''
  });

  useEffect(() => {
    async function loadFinance() {
      const result = await getFinanceSummary();
      if (result.success) {
        setHistory(result.history || []);
        setKycRecord(result.kyc);
        if (result.kyc) {
          setKycForm({
            pan: result.kyc.pan_number || '',
            bankName: result.kyc.bank_name || '',
            accountNumber: result.kyc.account_number || '',
            ifsc: result.kyc.ifsc_code || '',
            holderName: result.kyc.account_holder_name || ''
          });
        }
      }
      setLoading(false);
    }
    loadFinance();
  }, []);

  const filteredSessions = useMemo(() => {
    let data = history;
    // Filter logic...
    if (searchQuery) {
      data = data.filter(s => 
        s.learner?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.service?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return data;
  }, [history, filter, searchQuery]);

  const stats = useMemo(() => {
    const totalRevenue = filteredSessions.reduce((acc, s) => acc + (s.price || 0), 0);
    const payoutFactor = 0.8; // Example expert share
    const totalPayout = Math.round(totalRevenue * payoutFactor);
    return {
      totalRevenue,
      totalPayout,
      sessionCount: filteredSessions.length,
      avgPerSession: filteredSessions.length > 0 ? Math.round(totalRevenue / filteredSessions.length) : 0
    };
  }, [filteredSessions]);

  const handleKYCSubmit = async () => {
    setSubmittingKYC(true);
    const result = await submitKYC(kycForm);
    if (result.success) {
      toast.success("KYC Submitted", { description: "Your details are being reviewed." });
      setKycRecord({ ...kycForm, status: 'PENDING' });
    } else {
      toast.error(result.error || "KYC failure");
    }
    setSubmittingKYC(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 italic text-zinc-600">
        <Loader2 className="h-10 w-10 animate-spin text-[#D3C4B5]" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Earnings Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mt-12 mb-16">
        <div className="space-y-4">
          <Badge className="bg-[#D3C4B5]/10 text-[#D3C4B5] border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
            Earnings // Reports
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white leading-none">
            Earnings <br/> <span className="text-[#D3C4B5]">Log.</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-4">
           {['WEEK', 'MONTH', 'ALL'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f as any)}
               className={cn(
                 "px-8 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all border",
                 filter === f 
                  ? "bg-[#D3C4B5] text-[#111224] border-transparent shadow-lg scale-105" 
                  : "bg-[#111224] text-zinc-600 border-white/5 hover:border-white/20"
               )}
             >
               {f}
             </button>
           ))}
           <Button className="h-14 px-8 rounded-2xl bg-white text-[#111224] font-black uppercase tracking-widest text-[10px] flex items-center gap-3">
              <Download className="h-4 w-4" /> Download Report
           </Button>
        </div>
      </div>

      {/* ECONOMIC HUD */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: "Total Earned", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: Wallet, color: "text-[#BACCB3]" },
          { label: "Your Share", value: `₹${stats.totalPayout.toLocaleString()}`, icon: CreditCard, color: "text-white" },
          { label: "Total Sessions", value: stats.sessionCount, icon: History, color: "text-[#D3C4B5]" },
          { label: "Avg / Session", value: `₹${stats.avgPerSession.toLocaleString()}`, icon: TrendingUp, color: "text-white/40" },
        ].map((stat, i) => (
          <div key={i} className="vessel bg-[#111224] border border-white/5 p-10 rounded-[3rem] space-y-4 group hover:border-[#BACCB3]/30 transition-all shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 blur-[50px] -translate-y-1/2 translate-x-1/2" />
            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-800 group-hover:text-[#BACCB3] transition-colors relative z-10">
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1 italic">{stat.label}</p>
              <p className={cn("text-4xl font-black italic tracking-tighter leading-none", stat.color)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* LEDGER & KYC */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        <div className="xl:col-span-8 space-y-10">
           <div className="flex items-center justify-between">
              <h3 className="text-3xl font-black italic uppercase text-white tracking-tight">Payment <span className="text-[#D3C4B5]">Log.</span></h3>
              <div className="relative w-64 font-black uppercase tracking-widest text-[9px]">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                 <input placeholder="SEARCH PAYMENTS..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-12 bg-[#111224] border border-white/5 rounded-xl pl-10 pr-4 text-white placeholder:text-zinc-800 outline-none" />
              </div>
           </div>
           
           <div className="vessel bg-[#111224] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-white/5">
                       <th className="px-10 py-8 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Session</th>
                       <th className="px-10 py-8 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Student</th>
                       <th className="px-10 py-8 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic text-right">Amount</th>
                       <th className="px-10 py-8 text-[9px] font-black uppercase tracking-widest text-zinc-600 italic text-center">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {filteredSessions.map((s) => (
                       <tr key={s.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-10 py-8">
                             <p className="text-xs font-black italic text-[#BACCB3]">{s.service?.title || "Clinical Interaction"}</p>
                             <p className="text-[8px] font-bold text-zinc-700 uppercase">{new Date(s.clock_in).toLocaleDateString()}</p>
                          </td>
                          <td className="px-10 py-8">
                             <p className="text-sm font-black italic text-white uppercase">{s.learner?.full_name}</p>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <p className="text-lg font-black italic text-white leading-none">₹{Math.round((s.price || 0) * 0.8)}</p>
                             <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Total: ₹{s.price || 0}</p>
                          </td>
                          <td className="px-10 py-8 text-center">
                             <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-full px-4 py-1 text-[8px] font-black uppercase italic">SETTLED</Badge>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {filteredSessions.length === 0 && (
                 <div className="p-20 text-center italic text-zinc-800 text-[10px] font-black uppercase">No payments yet.</div>
              )}
           </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
           <div className="vessel bg-[#111224] border border-white/5 p-10 rounded-[4rem] space-y-10 shadow-2xl sticky top-32">
              <div className="flex items-center gap-4">
                 <ShieldCheck className="h-8 w-8 text-[#D3C4B5]" />
                 <h3 className="text-2xl font-black italic uppercase text-white tracking-tight leading-none">Bank <span className="text-[#D3C4B5]">Details.</span></h3>
              </div>

              <div className="space-y-6">
                 {kycRecord?.status === 'VERIFIED' ? (
                   <div className="bg-[#BACCB3]/10 border border-[#BACCB3]/20 p-8 rounded-3xl text-center space-y-4">
                      <CheckCircle2 className="h-10 w-10 text-[#BACCB3] mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3] italic">Verification Complete</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase">Payments: ENABLED</p>
                   </div>
                 ) : (
                   <div className="space-y-6">
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-700 ml-4 italic">Account Holder Name</label>
                            <Input value={kycForm.holderName} onChange={e => setKycForm({...kycForm, holderName: e.target.value})} className="bg-[#1D1E31] border-none h-16 rounded-2xl px-6 font-bold text-white uppercase italic shadow-inner" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-700 ml-4 italic">PAN Number</label>
                            <Input value={kycForm.pan} onChange={e => setKycForm({...kycForm, pan: e.target.value.toUpperCase()})} className="bg-[#1D1E31] border-none h-16 rounded-2xl px-6 font-bold text-white uppercase shadow-inner" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-700 ml-4 italic">Account Number</label>
                            <Input value={kycForm.accountNumber} onChange={e => setKycForm({...kycForm, accountNumber: e.target.value})} className="bg-[#1D1E31] border-none h-16 rounded-2xl px-6 font-bold text-white shadow-inner" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-700 ml-4 italic">IFSC Code</label>
                            <Input value={kycForm.ifsc} onChange={e => setKycForm({...kycForm, ifsc: e.target.value.toUpperCase()})} className="bg-[#1D1E31] border-none h-16 rounded-2xl px-6 font-bold text-white uppercase shadow-inner shadow-inner" />
                         </div>
                      </div>
                      <Button onClick={handleKYCSubmit} disabled={submittingKYC} className="w-full h-20 bg-white text-[#111224] rounded-3xl font-black uppercase tracking-widest text-[11px] hover:bg-[#D3C4B5] transition-all">
                         {submittingKYC ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Details"}
                      </Button>
                      <div className="p-6 bg-orange-500/5 rounded-2xl border border-orange-500/10 flex items-center gap-4">
                         <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                         <p className="text-[8px] font-bold text-zinc-700 uppercase italic leading-tight">Bank details must be verified by Insighte before payments are sent.</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
