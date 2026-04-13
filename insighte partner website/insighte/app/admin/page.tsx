"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  PieChart, 
  TrendingUp,
  Activity,
  Plus,
  FileText,
  AlertTriangle,
  UserPlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { promoteToAdmin, checkApiHealth } from "@/app/actions/admin/governance";
import { toast } from "sonner";

export default function AdminPulseDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      // 1. Fetch Stats counts
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: providerCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'provider');
      const { count: bookingCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
      const { data: payments } = await supabase.from('payments').select('amount');
      
      const totalYield = payments?.reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0) || 0;

      setStats({
        users: userCount || 0,
        providers: providerCount || 0,
        bookings: bookingCount || 0,
        yield: totalYield
      });

      // 2. Fetch Pending Approvals
      const { data: pendingProviders } = await supabase
        .from('users')
        .select(`*, profiles(*)`)
        .eq('role', 'provider')
        .limit(3);
      
      setPending(pendingProviders || []);
      
      // 3. Check System Health
      const health = await checkApiHealth();
      setApiStatus(health);

      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  const handlePromote = async () => {
    if (!adminEmail) return;
    setIsPromoting(true);
    try {
      await promoteToAdmin(adminEmail);
      toast.success(`${adminEmail} has been elevated to Admin`);
      setAdminEmail("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsPromoting(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* API INTEGRITY BANNER */}
      {apiStatus && !apiStatus.isHealthy && (
        <section className="bg-orange-500/10 border border-orange-500/20 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
           <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                 <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
              <div className="space-y-1 text-left">
                 <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Infrastructure Gap Detected</h3>
                 <p className="text-[10px] font-bold text-orange-200/60 uppercase tracking-widest">
                    Missing configuration for: {apiStatus.missingKeys.join(', ')}
                 </p>
              </div>
           </div>
           <Link href="/admin/settings">
              <Button className="h-14 px-10 rounded-full bg-orange-500 text-white font-black uppercase tracking-widest text-[9px] hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20">
                 Resolve Integration
              </Button>
           </Link>
        </section>
      )}

      {/* HEADER HUD */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
            Institutional Pulse // Global
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black font-manrope tracking-tighter italic uppercase text-white leading-none">
            Registry <br/> <span className="text-[#BACCB3]">Status.</span>
          </h1>
        </div>
      </section>

      {/* ECONOMIC HUD */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
         <StatCard icon={<Users />} label="Collective Users" value={stats?.users || "0"} change="+12.4%" />
         <StatCard icon={<ShieldCheck />} label="Verified Specialists" value={stats?.providers || "0"} change="+5.2%" />
         <StatCard icon={<Activity />} label="Market Bookings" value={stats?.bookings || "0"} change="+18.9%" />
         <StatCard icon={<TrendingUp />} label="Gross Platform Yield" value={`₹${stats?.yield.toLocaleString() || "0"}`} change="+8.1%" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* LEFT: PENDING OPERATIONS */}
         <div className="lg:col-span-8 space-y-8">
            <div className="vessel bg-[#1D1E31] p-12 space-y-12 border border-white/5 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#D3C4B5]/50 to-transparent opacity-30" />
               
               <div className="flex items-center justify-between">
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">Registry Audits</h3>
                  <Link href="/admin/queue" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group/link">
                     <span className="text-[9px] font-black uppercase tracking-widest">Go to queue</span>
                     <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </Link>
               </div>

               <div className="space-y-6">
                  {loading ? (
                     <p className="text-zinc-600 italic">Syncing with Registry...</p>
                  ) : pending.length === 0 ? (
                     <p className="text-zinc-600 italic text-center p-12">All clinical architectures verified.</p>
                  ) : (
                     pending.map((item) => (
                        <div key={item.id} className="vessel bg-black/30 p-8 rounded-[48px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group/item hover:bg-black/50 transition-all">
                           <div className="flex items-center gap-6 text-left">
                              <div className="h-16 w-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-zinc-600 group-hover/item:text-[#D3C4B5] transition-all">
                                 {item.profiles?.display_name?.[0] || item.email[0].toUpperCase()}
                              </div>
                              <div className="space-y-1">
                                 <h4 className="text-2xl font-bold font-manrope leading-tight text-white">{item.profiles?.display_name || item.email}</h4>
                                 <p className="text-[9px] font-black uppercase tracking-widest text-[#BACCB3]">Provider Profile Review</p>
                              </div>
                           </div>

                           <Link href={`/admin/queue`}>
                              <Button className="h-14 px-8 rounded-full bg-white/5 text-[#D3C4B5] font-black uppercase tracking-widest text-[8px] hover:bg-[#D3C4B5] hover:text-[#111224] transition-all border border-white/5">
                                 Perform Audit
                              </Button>
                           </Link>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>

         {/* RIGHT: SYSTEM ACTION PODS */}
         <div className="lg:col-span-4 space-y-8">
            <div className="vessel bg-[#1D1E31] p-10 space-y-8 border border-white/5 group relative overflow-hidden">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                     <Clock className="h-5 w-5 text-[#BACCB3]" />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Active Logs</h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <p className="text-sm font-bold text-white italic">Provider Registry Update</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">2 minutes ago — System Internal</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-sm font-bold text-white italic">Gross Yield Settlement</p>
                     <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">14 minutes ago — Economic Module</p>
                  </div>
               </div>

               <button className="h-16 w-full rounded-full bg-white/5 text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all border border-white/5">
                  View Audit Trail
               </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="vessel bg-white/5 h-48 border border-white/5 flex flex-col items-center justify-center space-y-4 hover:bg-[#D3C4B5] group transition-all text-center p-6 cursor-pointer">
                  <Plus className="h-8 w-8 text-zinc-600 group-hover:text-[#111224]" />
                  <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-[#111224]">Add Program</span>
               </div>
                <Link href="/admin/help" className="h-full">
                  <div className="vessel bg-white/5 h-48 border border-white/5 flex flex-col items-center justify-center space-y-4 hover:bg-[#BACCB3] group transition-all text-center p-6 cursor-pointer">
                     <FileText className="h-8 w-8 text-zinc-600 group-hover:text-[#111224]" />
                     <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-[#111224]">Support Hub</span>
                  </div>
               </Link>
            </div>

            {/* ADMIN SOVEREIGNTY TOOL */}
            <div className="vessel bg-[#1D1E31] p-10 space-y-8 border border-white/5 relative overflow-hidden group">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                     <UserPlus className="h-5 w-5 text-[#BACCB3]" />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Registry Control</h3>
               </div>
               <div className="space-y-4">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">Elevate user to administrative authority</p>
                  <Input 
                    placeholder="Enter email..."
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="h-14 bg-black/40 border-white/5 rounded-full px-8 text-[10px] font-bold text-white placeholder:text-zinc-800 focus:border-[#D3C4B5]/40 transition-all"
                  />
                  <Button 
                    onClick={handlePromote}
                    disabled={isPromoting || !adminEmail}
                    className="h-16 w-full rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[9px] hover:shadow-glow shadow-[#D3C4B5]/20 active:scale-[0.98] transition-all"
                  >
                    {isPromoting ? "Synchronizing..." : "Authorize Elevation"}
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change }: any) {
  return (
    <div className="vessel bg-[#1D1E31] p-10 space-y-6 border border-white/5 hover:border-[#D3C4B5]/20 transition-all group shadow-2xl">
      <div className="flex items-center justify-between">
         <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-[#D3C4B5] transition-all">
            {React.cloneElement(icon, { className: "h-6 w-6" })}
         </div>
         <Badge className="h-8 px-4 rounded-full bg-black/40 text-[#BACCB3] border border-white/5 font-black text-[9px]">
            {change}
         </Badge>
      </div>
      <div>
         <h2 className="text-5xl font-black font-manrope tracking-tighter text-white">{value}</h2>
         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-2 italic">{label}</p>
      </div>
    </div>
  );
}
