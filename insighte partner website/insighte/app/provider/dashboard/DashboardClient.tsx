"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  Play, 
  Square,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  FileText,
  User,
  Star,
  MapPin,
  RefreshCw,
  Bell,
  Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { clockIn, clockOut, submitSessionNotes, getDailySessions } from "@/lib/actions/provider/sessions";

interface DashboardClientProps {
  partner: any;
  status: string;
  initialClock?: any;
}

export default function DashboardClient({ partner, status, initialClock }: DashboardClientProps) {
  const [activeClock, setActiveClock] = useState(initialClock);
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Timer logic for active session
  useEffect(() => {
    let interval: any;
    if (activeClock?.provider_clock_in && !activeClock?.provider_clock_out) {
      const start = new Date(activeClock.provider_clock_in).getTime();
      interval = setInterval(() => {
        const now = new Date().getTime();
        setTimeLeft(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      setTimeLeft(0);
    }
    return () => clearInterval(interval);
  }, [activeClock]);

  useEffect(() => {
    async function fetchToday() {
      const result = await getDailySessions();
      if (result.success) {
        setSessions(result.data || []);
      }
      setLoadingSessions(false);
    }
    fetchToday();
  }, []);

  const handleClockIn = async (bookingId: string) => {
    setIsClockingIn(true);
    const result = await clockIn(bookingId);
    if (result.success) {
      toast.success("Session Started", { description: "Clocking in confirmed." });
      setActiveClock({ provider_clock_in: new Date().toISOString(), booking_id: bookingId });
    } else {
      toast.error(result.error || "Clock-in failed");
    }
    setIsClockingIn(false);
  };

  const handleClockOut = async () => {
    if (!activeClock?.booking_id) return;
    const result = await clockOut(activeClock.booking_id);
    if (result.success) {
      toast.success("Ending Session", { description: "Finalizing session details." });
      setActiveClock((prev: any) => ({ ...prev, provider_clock_out: new Date().toISOString() }));
    } else {
      toast.error(result.error || "Clock-out failed");
    }
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };


  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* MASTER GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-12">
        
        {/* COLUMN 1: TODAY'S SCHEDULE (Left - 3/12) */}
        <div className="xl:col-span-3 space-y-8 order-2 xl:order-1">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 italic">Today's Sessions</h3>
              <Badge variant="outline" className="border-white/10 text-[9px] font-black uppercase">Apr 12</Badge>
           </div>
           
           <div className="space-y-4">
              {sessions.map((s, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={s.id}
                  className="group relative p-6 bg-[#111224]/40 border border-white/5 rounded-[2rem] hover:bg-[#111224]/80 transition-all cursor-pointer overflow-hidden"
                >
                   <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[#0A0B1A] border border-white/5 overflow-hidden relative">
                         <Image src={s.avatar} alt={s.learner} fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-black text-white uppercase italic">{s.time}</p>
                         <h4 className="text-lg font-black text-[#D3C4B5] truncate leading-none">{s.learner}</h4>
                         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{s.service}</p>
                      </div>
                   </div>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight className="h-4 w-4 text-[#BACCB3]" />
                   </div>
                </motion.div>
              ))}
              
              <Button variant="ghost" className="w-full h-16 border border-dashed border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-[#BACCB3]">
                + Open Calendar
              </Button>
           </div>
        </div>

        {/* COLUMN 2: THE HUB (Middle - 6/12) */}
        <div className="xl:col-span-6 space-y-8">
           
           {/* ACTIVE / NEXT SESSION HERO */}
           <section className="relative">
              {!activeClock ? (
                /* PRE-SESSION: FOCUS ON NEXT LEARNER */
                <div className="vessel bg-[#111224] border border-white/5 rounded-[4rem] p-12 overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col justify-end">
                   <div className="absolute top-0 right-0 w-1/2 h-full opacity-40">
                      <Image 
                        src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200" 
                        alt="Background" fill className="object-cover grayscale" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#111224]" />
                   </div>
                   
                    <div className="relative z-10 space-y-10">
                      <div className="space-y-4">
                         <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
                           Your Next Student
                         </Badge>
                         <h1 className="text-7xl font-black italic uppercase text-white tracking-tighter leading-none">
                            Liam <span className="text-[#D3C4B5]">Siddarth.</span>
                         </h1>
                         <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-widest italic">
                            <span>14 Year Old</span>
                            <div className="h-1 w-1 rounded-full bg-zinc-800" />
                            <span>Student ID #A-8842</span>
                         </div>
                      </div>

                      <div className="flex items-center gap-6">
                         <Button 
                            onClick={() => handleClockIn("B-101")}
                            disabled={isClockingIn}
                            className="h-16 px-12 rounded-3xl bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl"
                         >
                            Start Session
                         </Button>
                         <Link href="/provider/learners">
                            <Button variant="ghost" className="h-16 px-8 rounded-3xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">
                               Plan Lesson
                            </Button>
                         </Link>
                      </div>
                   </div>
                </div>
              ) : (
                /* ACTIVE SESSION: THE TIMER HUD */
                <div className="vessel bg-gradient-to-br from-[#111224] to-[#0A0B1A] border border-[#BACCB3]/20 rounded-[4rem] p-12 overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col items-center justify-center text-center">
                   <div className="absolute top-10 left-10">
                      <Badge className="bg-orange-500 text-[#111224] border-none rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        Session in Progress
                      </Badge>
                   </div>
                   
                   <div className="space-y-4 mb-8">
                      <p className="text-[12px] font-black text-zinc-500 uppercase tracking-[0.5em] italic">Session Timer</p>
                      <h2 className="text-9xl font-black italic text-[#BACCB3] tracking-tighter font-mono">
                         {formatDuration(timeLeft)}
                      </h2>
                   </div>

                   <div className="flex items-center gap-4">
                      <Button 
                        onClick={handleClockOut}
                        disabled={!!activeClock.provider_clock_out}
                        className="h-20 px-16 rounded-[2.5rem] bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all flex items-center gap-4"
                      >
                         <Square className="h-5 w-5 fill-current" /> End Session
                      </Button>
                   </div>
                   
                   <div className="mt-12 w-full max-w-md">
                      <textarea 
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        placeholder="Session notes & observations..."
                        className="w-full h-32 bg-[#0A0B1A]/60 border border-white/5 rounded-3xl p-6 text-sm font-bold text-[#D3C4B5] outline-none placeholder:text-zinc-700 resize-none transition-all focus:border-[#BACCB3]/30"
                      />
                   </div>
                </div>
              )}
           </section>

           {/* STATS STRIP */}
           <div className="grid grid-cols-3 gap-6">
              <div className="vessel bg-[#111224]/60 border border-white/5 p-8 rounded-[2.5rem] space-y-2">
                 <div className="flex items-center gap-2 text-zinc-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Earnings</span>
                 </div>
                 <p className="text-2xl font-black italic text-white leading-none">₹84,200</p>
              </div>
              <div className="vessel bg-[#111224]/60 border border-white/5 p-8 rounded-[2.5rem] space-y-2">
                 <div className="flex items-center gap-2 text-zinc-600">
                    <Activity className="h-3 w-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">My Students</span>
                 </div>
                 <p className="text-2xl font-black italic text-white leading-none">12</p>
              </div>
              <div className="vessel bg-[#111224]/60 border border-white/5 p-8 rounded-[2.5rem] space-y-2">
                 <div className="flex items-center gap-2 text-zinc-600">
                    <ShieldCheck className="h-3 w-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Performance</span>
                 </div>
                 <p className="text-2xl font-black italic text-[#BACCB3] leading-none">Pinnacle</p>
              </div>
           </div>
        </div>

        {/* COLUMN 3: THE RADAR (Right - 3/12) */}
        <div className="xl:col-span-3 space-y-8">
           
           {/* PROFESSIONAL IDENTITY */}
           <div className="vessel bg-[#1D1E31]/80 border border-white/5 p-10 rounded-[3rem] space-y-8">
              <div className="flex flex-col items-center text-center space-y-6">
                 <div className="h-24 w-24 rounded-[2rem] bg-[#111224] p-1 border border-[#BACCB3]/20 overflow-hidden relative shadow-2xl">
                    <Image 
                        src={partner?.avatar_url || "https://i.pravatar.cc/200"} 
                        alt="Expert" fill className="object-cover grayscale" 
                    />
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black italic uppercase leading-none text-white">{partner?.name || "Professional"}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic">{partner?.category || "Specialist"}</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-zinc-500">Reliability Score</span>
                    <span className="text-[#BACCB3]">94%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#D3C4B5] to-[#BACCB3] transition-all duration-1000" style={{ width: '94%' }} />
                 </div>
              </div>

              <Link href="/provider/profile" className="block">
                 <Button className="w-full h-14 bg-[#111224] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] hover:bg-[#D3C4B5] hover:text-[#111224] transition-all">
                    View Profile
                 </Button>
              </Link>
           </div>

           {/* KYC / COMPLIANCE NUDGE */}
           {status !== "LIVE" && (
             <motion.div 
               whileHover={{ scale: 1.02 }}
               className="vessel bg-orange-500/10 border border-orange-500/20 p-8 rounded-[3rem] space-y-6"
             >
                <div className="flex items-center gap-4 text-orange-500">
                   <ShieldCheck className="h-6 w-6" />
                   <h4 className="text-sm font-black uppercase tracking-widest leading-none">Profile <br/> Incomplete</h4>
                </div>
                <p className="text-[10px] font-medium text-zinc-400 leading-relaxed italic">
                   Your profile is currently in <span className="text-orange-400 underline">Review Mode</span> until setup is complete.
                </p>
                <Link href="/provider/profile#kyc" className="block">
                   <Button variant="secondary" className="w-full h-12 bg-orange-500 text-[#111224] font-black uppercase tracking-widest text-[9px] rounded-2xl">
                      Verify Identity
                   </Button>
                </Link>
             </motion.div>
           )}

           {/* QUICK UTILITIES */}
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => toast.info("Syncing Dashboard...", { description: "Refreshing your latest session data." })}
                className="vessel bg-[#111224]/40 border border-white/5 h-28 rounded-[2rem] flex flex-col items-center justify-center gap-2 group hover:border-[#BACCB3]/30 transition-all"
              >
                 <RefreshCw className="h-5 w-5 text-zinc-600 group-hover:text-[#BACCB3] transition-all" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Sync Data</span>
              </button>
              <button 
                onClick={() => toast.info("Generating Report...", { description: "Your teaching summary is being prepared." })}
                className="vessel bg-[#111224]/40 border border-white/5 h-28 rounded-[2rem] flex flex-col items-center justify-center gap-2 group hover:border-[#BACCB3]/30 transition-all"
              >
                 <FileText className="h-5 w-5 text-zinc-600 group-hover:text-[#BACCB3] transition-all" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Reports</span>
              </button>
           </div>

        </div>

      </div>

    </div>
  );
}
