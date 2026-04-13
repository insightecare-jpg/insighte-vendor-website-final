"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Users, 
  Activity,
  Zap,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  User,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getMockUser, isDevBypassActive } from "@/lib/api/dev-bypass-helper";
import { getParentDashboard } from "@/lib/actions/parent";
import { ParentBottomNav } from "@/components/navigation/ParentBottomNav";

export default function ParentSanctuaryDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        let userId: string | null = null;
        
        if (isDevBypassActive()) {
          userId = getMockUser()?.id || null;
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          userId = user?.id || null;
        }

        if (userId) {
          const dashboardData = await getParentDashboard(userId);
          setData(dashboardData);
        }
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
     return (
       <div className="min-h-screen bg-[#111224] flex items-center justify-center">
         <div className="flex flex-col items-center gap-6">
            <div className="h-12 w-12 border-4 border-[#D3C4B5]/20 border-t-[#D3C4B5] rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D3C4B5] animate-pulse">Syncing Sanctuary...</p>
         </div>
       </div>
     );
  }

  const { children = [], upcomingBookings = [], recentSessions = [], parentInfo = {} } = data || {};

  return (
    <div className="min-h-screen bg-[#111224] text-white selection:bg-[#D3C4B5]/30 overflow-x-hidden">
      {/* BACKGROUND DEPTH */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D3C4B5]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#BACCB3]/5 blur-[150px] rounded-full" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 pt-24 pb-32 space-y-16">
        
        {/* HEADER: IDENTITY & PRIMARY CTA */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4">
                 <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border border-[#BACCB3]/20 px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic">
                    Vanguard Family Sanctuary
                 </Badge>
                 <span className="h-[1px] w-8 bg-white/10 hidden md:block" />
                 <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] font-mono">{parentInfo?.client_code || 'CLI-TEMP'}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-manrope tracking-tighter leading-tight italic">
                 Welcome, <span className="text-[#D3C4B5]">{parentInfo?.name?.split(' ')[0] || 'Parent'}</span>.
              </h1>
              <p className="text-lg text-zinc-500 font-medium italic">Protocol Status: Optimal // Clinical Sync Active.</p>
           </div>

           <div className="flex items-center gap-4">
              <Link href="/specialists">
                 <Button className="h-24 px-12 rounded-[2.5rem] bg-[#D3C4B5] text-[#111224] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-glow glow-[#D3C4B5]/20">
                    <Plus className="h-6 w-6 mr-3 border-2 border-[#111224]/20 rounded-lg p-0.5" /> Book Session
                 </Button>
              </Link>
           </div>
        </header>

        {/* TOP LEVEL PULSE */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { label: "Learner Registry", val: children.length, icon: Users, color: "#D3C4B5" },
             { label: "Temporal Pulses", val: upcomingBookings.length, icon: Calendar, color: "#BACCB3" },
             { label: "Clinical Syncs", val: recentSessions.length, icon: Activity, color: "#8B7FF0" },
             { label: "Vanguard Milestones", val: children.reduce((acc: any, c: any) => acc + (c.milestones?.length || 0), 0), icon: Zap, color: "#F0A5FB" },
           ].map((stat, i) => (
             <div key={i} className="vessel bg-[#1D1E31]/40 border border-white/5 p-10 rounded-[3rem] flex items-center justify-between group hover:border-[#BACCB3]/30 transition-all cursor-default">
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</p>
                   <p className="text-5xl font-black font-manrope italic leading-none">{stat.val}</p>
                </div>
                <div style={{ backgroundColor: `${stat.color}10`, color: stat.color }} className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center">
                   <stat.icon className="h-8 w-8" />
                </div>
             </div>
           ))}
        </section>

        {/* MAIN HUD: BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* LEFT COLUMN: LEARNER REGISTRY (8 Cols) */}
           <div className="lg:col-span-8 space-y-12">
              
              <div className="flex items-center justify-between px-6">
                 <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Identity Registry</h2>
                    <Badge className="bg-white/5 text-zinc-600 border-none rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest italic">{children.length} ACTIVE</Badge>
                 </div>
                 <Link href="/parent/onboarding/learner">
                    <button className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] hover:text-white transition-all border-b border-[#D3C4B5]/20 pb-1 italic">
                       Register Learner // +
                    </button>
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {children.length > 0 ? children.map((child: any) => {
                    return (
                       <div key={child.id} className="vessel bg-[#191a2d]/60 rounded-[3.5rem] border border-white/5 p-12 space-y-8 group relative overflow-hidden transition-all hover:translate-y-[-4px] hover:border-[#BACCB3]/20">
                          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-[#BACCB3]/5 to-transparent pointer-events-none" />
                          
                          <div className="flex items-center justify-between">
                             <div className="h-24 w-24 rounded-[2rem] bg-[#111224] flex items-center justify-center p-4 border border-white/10 shadow-2xl">
                                <span className="text-4xl font-black italic text-[#D3C4B5]">{child.name?.[0]}</span>
                             </div>
                             <div className="text-right space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Learner Code</p>
                                <code className="text-[10px] font-black text-white bg-white/5 px-3 py-1 rounded-md border border-white/5">{child.child_code || 'CLI-T-A'}</code>
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div>
                                <h3 className="text-4xl font-black font-manrope tracking-tighter text-white group-hover:text-[#D3C4B5] transition-colors leading-none mb-4">{child.name}</h3>
                                <div className="flex items-center gap-4 text-xs font-black text-zinc-600 uppercase italic tracking-widest">
                                   <span>{child.age || '?'} Years</span>
                                   <span className="h-1 w-1 rounded-full bg-zinc-800" />
                                   <span className="text-[#BACCB3]">Vanguard Level 0{Math.floor(Math.random() * 5) + 1}</span>
                                </div>
                             </div>
                             
                             <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700">
                                   <span>Clinical Baseline Protocol</span>
                                   <span>{child.milestones?.length || 0}/12 Milestones</span>
                                </div>
                                <div className="h-2 w-full bg-[#111224] rounded-full overflow-hidden p-[2px] border border-white/5">
                                   <div 
                                      className="h-full bg-gradient-to-r from-[#D3C4B5] to-[#BACCB3] rounded-full transition-all duration-1000 shadow-glow glow-[#BACCB3]/20" 
                                      style={{ width: `${(child.milestones?.length || 0) / 12 * 100}%` }}
                                   />
                                </div>
                             </div>
                          </div>

                          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                             <Link href={`/parent/dashboard/children/${child.id}`}>
                                <Button className="h-12 px-8 rounded-xl bg-white/5 text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:bg-white hover:text-black transition-all">
                                   Enter Sanctuary HUD <ChevronRight className="h-3 w-3 ml-2" />
                                </Button>
                             </Link>
                          </div>
                       </div>
                    );
                 }) : (
                    <div className="md:col-span-2 vessel bg-[#191a2d]/40 border-dashed border-white/5 p-24 text-center space-y-8 rounded-[4rem]">
                       <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                          <Users className="h-10 w-10 text-zinc-800" />
                       </div>
                       <div className="space-y-2">
                          <p className="text-2xl font-black italic uppercase tracking-tighter text-zinc-400">Registry Empty</p>
                          <p className="text-sm text-zinc-600 max-w-sm mx-auto italic font-medium leading-relaxed">Identity synchronization required for clinical mapping.</p>
                       </div>
                       <Link href="/parent/onboarding/learner">
                          <Button className="h-14 px-10 rounded-2xl bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-[9px]">Begin Register</Button>
                       </Link>
                    </div>
                 )}
              </div>

              {/* TEMPORAL PULSE HUB */}
              <div className="space-y-10 pt-8">
                 <div className="flex items-center justify-between px-6">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Temporal Pulse</h2>
                    <Link href="/parent/sessions">
                       <button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all border-b border-white/5 pb-1 italic">View All Syncs</button>
                    </Link>
                 </div>

                 <div className="space-y-6">
                    {upcomingBookings.length > 0 ? upcomingBookings.map((session: any) => (
                       <div key={session.id} className="vessel bg-[#1D1E31]/40 border border-white/5 p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-10 group relative transition-all hover:border-[#BACCB3]/20">
                          <div className="w-full md:w-40 flex flex-col items-center justify-center border-r border-white/5 md:pr-10 text-center">
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 italic">{new Date(session.start_time).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                             <p className="text-5xl font-black font-manrope italic leading-none">{new Date(session.start_time).toLocaleDateString('en-US', { day: '2-digit' })}</p>
                             <div className="flex items-center gap-2 mt-4 text-[10px] font-black text-[#BACCB3] bg-[#BACCB3]/10 px-3 py-1 rounded-full uppercase italic">
                                <Clock className="h-3 w-3" />
                                {new Date(session.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                             </div>
                          </div>
                          
                          <div className="flex-1 space-y-4 text-center md:text-left">
                             <div className="flex flex-col md:flex-row items-center gap-4">
                                <h4 className="text-3xl font-black italic uppercase tracking-tighter text-white">{session.services?.title || "Clinical Pulse"}</h4>
                                <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest italic">Authorized</Badge>
                             </div>
                             <div className="flex items-center justify-center md:justify-start gap-6">
                                <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase italic tracking-widest">
                                   <div className="h-8 w-8 rounded-lg bg-[#111224] flex items-center justify-center border border-white/5 p-1">
                                      <User className="h-4 w-4" />
                                   </div>
                                   <span>{session.partners?.name || "Specialist"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-black uppercase italic tracking-widest">
                                   <div className="h-8 w-8 rounded-lg bg-[#BACCB3]/10 flex items-center justify-center p-1">
                                      <Zap className="h-4 w-4 text-[#BACCB3] fill-current" />
                                   </div>
                                   <span>Sync Pod active</span>
                                </div>
                             </div>
                          </div>

                          <Link href={`/parent/sessions/${session.id}`} className="w-full md:w-auto">
                             <Button className="w-full md:w-auto h-20 px-12 rounded-[2rem] bg-white text-[#111224] font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-glow glow-white/10 italic">
                                Join Sync
                             </Button>
                          </Link>
                       </div>
                    )) : (
                       <div className="vessel bg-[#1D1E31]/20 border border-white/5 p-16 rounded-[3rem] text-center border-dashed">
                          <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.3em] italic">No active temporal pulses detected for this cycle.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: INSIGHTS (4 Cols) */}
           <div className="lg:col-span-4 space-y-10">
              
              {/* SUPPORT CONCIERGE */}
              <div className="vessel bg-gradient-to-br from-[#191a2d] to-[#111224] rounded-[4rem] border border-white/10 p-12 space-y-12 shadow-3xl relative overflow-hidden group">
                 <div className="absolute top-[-20%] right-[-20%] w-72 h-72 bg-[#D3C4B5]/10 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                 
                 <div className="space-y-4 relative z-10">
                    <h3 className="text-4xl font-black font-manrope tracking-tighter text-white italic leading-tight">Care <br/><span className="text-[#D3C4B5]">Concierge.</span></h3>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic leading-relaxed">Dedicated sanctuary support response in &lt;10 minutes.</p>
                 </div>

                 <div className="grid gap-4 relative z-10">
                    <Button className="w-full h-20 rounded-[2rem] bg-white text-[#111224] font-black uppercase tracking-widest text-[10px] hover:translate-y-[-4px] transition-all shadow-2xl">
                       <MessageSquare className="h-5 w-5 mr-3 fill-current" /> Initiate Sync
                    </Button>
                    <Link href="/parent/billing" className="w-full">
                       <Button variant="ghost" className="w-full h-16 rounded-[1.5rem] text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all italic">
                          Billing Portal // Registry
                       </Button>
                    </Link>
                 </div>

                 <div className="pt-8 border-t border-white/5 flex items-center gap-4 relative z-10 opacity-60">
                    <ShieldCheck className="h-5 w-5 text-[#BACCB3]" />
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Clinical Privacy Encryption Active</span>
                 </div>
              </div>

              {/* GROWTH ANALYSER */}
              <div className="vessel bg-[#1D1E31]/40 border border-white/5 p-12 rounded-[4rem] space-y-10">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] italic text-zinc-500 flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-[#BACCB3]/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-[#BACCB3]" />
                       </div>
                       Growth Signals
                    </h3>
                 </div>

                 <div className="space-y-8">
                    {[
                       { type: "Behavioral", msg: "Focus duration expanded in speech sync.", time: "2h ago", color: "#BACCB3" },
                       { type: "Milestone", msg: "Visual communication node unlocked.", time: "6h ago", color: "#D3C4B5" },
                       { type: "Sync Pulse", msg: "Telehealth connectivity status: Optimal.", time: "Clinical Active", color: "#8B7FF0" }
                    ].map((sig, i) => (
                       <div key={i} className="flex gap-6 group cursor-default">
                          <div className="flex-1 space-y-2">
                             <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-widest italic" style={{ color: sig.color }}>{sig.type}</span>
                                <span className="text-[8px] font-black text-zinc-800 uppercase italic tracking-widest">{sig.time}</span>
                             </div>
                             <p className="text-xs font-semibold text-zinc-500 group-hover:text-white transition-colors leading-relaxed">{sig.msg}</p>
                          </div>
                       </div>
                    ))}
                 </div>

                 <Button variant="ghost" className="w-full h-14 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-700 hover:text-[#D3C4B5] transition-all italic">
                    Explore Progress Identity
                 </Button>
              </div>

           </div>
        </div>
      </main>

      {/* MOBILE HUD NAVIGATION */}
      <ParentBottomNav />
    </div>
  );
}
