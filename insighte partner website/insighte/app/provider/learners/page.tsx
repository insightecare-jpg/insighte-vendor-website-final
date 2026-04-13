"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  Calendar, 
  FileText, 
  CheckCircle2,
  X,
  Mail,
  MapPin,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Brain,
  Loader2,
  History,
  MoreVertical,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from "next/link";
import Image from "next/image";
import { getLearnerTimeline, getRegistry, inviteClient } from "@/lib/actions/provider/clients";

function TimelineSection({ learnerId }: { learnerId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getLearnerTimeline(learnerId);
      if (result.success) setItems(result.data || []);
      setLoading(false);
    }
    load();
  }, [learnerId]);

  if (loading) return <div className="h-24 flex items-center justify-center text-[10px] font-black uppercase text-zinc-800 italic animate-pulse">Loading History...</div>;
  if (items.length === 0) return <div className="p-10 border border-dashed border-white/5 rounded-3xl text-center italic text-zinc-700 text-[9px] uppercase font-bold">No history yet</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((session: any) => (
         <div key={session.id} className="group h-24 bg-[#0A0B1A]/40 border border-white/5 rounded-3xl p-6 flex items-center justify-between hover:bg-[#0A0B1A]/80 transition-all cursor-pointer">
            <div className="flex items-center gap-6">
               <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-700 group-hover:text-[#BACCB3] transition-colors">
                  <History className="h-5 w-5" />
               </div>
               <div>
                  <p className="text-[11px] font-black text-white uppercase italic">Session Record</p>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(session.start_time).toLocaleDateString()} // {session.status}</p>
               </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-zinc-800 opacity-0 group-hover:opacity-100 transition-all" />
         </div>
      ))}
    </div>
  );
}

interface Learner {
  id: string;
  full_name: string;
  email: string;
  category: string;
  location: string;
  status: string;
  last_session?: string;
  sessions_count?: number;
}

export default function LearnerRegistry() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "", note: "" });

  useEffect(() => {
    async function loadRegistry() {
      const result = await getRegistry();
      if (result.success) {
        setLearners(result.data || []);
      } else {
        toast.error("Registry Sync Failure");
      }
      setLoading(false);
    }
    loadRegistry();
  }, []);

  const handleInvite = async () => {
    if (!inviteData.email || !inviteData.name) return;
    const result = await inviteClient(inviteData.email, inviteData.name);
    if (result.success) {
      toast.success("Invitation Synched", { description: "Email dispatched via Insighte HQ." });
      setIsInviting(false);
    } else {
      toast.error(result.error || "Invite failure");
    }
  };

  const filteredLearners = learners.filter(l => 
    l.full_name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 italic text-zinc-600">
        <Loader2 className="h-10 w-10 animate-spin text-[#BACCB3]" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Students...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* HEADER SECTION */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mt-12 mb-16">
        <div className="space-y-4">
          <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
            My Students // Educator Hub
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white leading-none">
            Student <br/> <span className="text-[#D3C4B5]">Directory.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-80 font-black tracking-widest text-[10px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH NAME..."
                className="w-full h-16 bg-[#111224] border border-white/5 rounded-2xl pl-14 pr-6 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#BACCB3]/50 transition-all shadow-2xl uppercase"
              />
           </div>
           <Button 
            onClick={() => setIsInviting(true)}
            className="h-16 px-12 rounded-2xl bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl flex items-center gap-3"
           >
              <Plus className="h-5 w-5" /> 
              Add Student
           </Button>
        </div>
      </section>

      {/* REGISTRY ENGINE */}
      <div className="space-y-6">
        {filteredLearners.map((learner) => {
          const isExpanded = expandedId === learner.id;
          return (
            <motion.div 
              key={learner.id}
              layout
              className={cn(
                "vessel border overflow-hidden transition-all duration-700",
                isExpanded ? "bg-[#1D1E31]/95 border-[#BACCB3]/20 rounded-[3rem] shadow-2xl" : "bg-[#111224]/40 border-white/5 rounded-[2.5rem] hover:bg-[#111224]/80"
              )}
            >
              {/* COMPACT ROW */}
              <div 
                onClick={() => setExpandedId(isExpanded ? null : learner.id)}
                className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer group"
              >
                <div className="flex items-center gap-8 w-full md:w-auto">
                   <div className="h-20 w-20 rounded-3xl bg-[#0A0B1A] border border-white/5 flex items-center justify-center text-3xl font-black italic text-[#BACCB3] relative overflow-hidden">
                      <Image src={`https://i.pravatar.cc/150?u=${learner.id}`} alt="" fill className="object-cover grayscale group-hover:grayscale-0 transition-grayscale" />
                      <div className="absolute inset-0 bg-[#0A0B1A]/40 group-hover:opacity-0 transition-opacity" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-3xl font-black italic uppercase text-white tracking-tight leading-none">{learner.full_name}</h3>
                      <div className="flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">
                        <span>{learner.category || "Neuro-Developmental"}</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
                        <span>ID: {learner.id.slice(0, 8)}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-16 w-full md:w-auto justify-between md:justify-end">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-600 mb-1 uppercase tracking-widest italic">Sessions</p>
                      <p className="text-2xl font-black italic text-white leading-none">{learner.sessions_count || 0}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-zinc-600 mb-1 uppercase tracking-widest italic">Status</p>
                      <Badge className={cn("rounded-full px-4 py-1 text-[8px] font-black uppercase tracking-tighter", learner.status === 'ACTIVE' ? "bg-[#BACCB3]/10 text-[#BACCB3]" : "bg-orange-500/10 text-orange-500")}>
                        {learner.status}
                      </Badge>
                   </div>
                   <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                      <ChevronRight className="h-6 w-6 text-zinc-700" />
                   </motion.div>
                </div>
              </div>

              {/* EXPANDED PANEL: 3-COLUMN BRIEF */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-10 pb-12"
                  >
                    <div className="h-px bg-white/5 w-full mb-12" />
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 text-white">
                      
                      {/* COL 1: IDENTITY SPECS (3/12) */}
                      <div className="xl:col-span-3 space-y-8">
                         <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Student Details</p>
                            <div className="space-y-3">
                               <div className="bg-[#0A0B1A]/60 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                                  <span className="text-[10px] font-black text-zinc-500 uppercase">Parent Link</span>
                                  <span className="text-[11px] font-bold text-[#D3C4B5] truncate max-w-[140px]">{learner.email}</span>
                               </div>
                               <div className="bg-[#0A0B1A]/60 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                                  <span className="text-[10px] font-black text-zinc-500 uppercase">Coordinates</span>
                                  <span className="text-[11px] font-bold text-white italic">{learner.location || "N/A"}</span>
                               </div>
                            </div>
                         </div>
                         <div className="p-8 bg-[#BACCB3]/5 border border-[#BACCB3]/10 rounded-[2.5rem] space-y-4">
                            <h4 className="text-[11px] font-black uppercase text-[#BACCB3] tracking-widest italic flex items-center gap-2">
                               <ShieldCheck className="h-4 w-4" /> Priority Note
                            </h4>
                            <p className="text-[12px] font-medium text-zinc-400 italic leading-relaxed">
                               Learner shows high affinity for auditory patterns. Progression sync recommended early mornings.
                            </p>
                         </div>
                      </div>

                      {/* COL 2: CLINICAL TIMELINE (6/12) */}
                      <div className="xl:col-span-6 space-y-8">
                         <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Session History</h4>
                            <span className="text-[8px] font-black text-zinc-700 uppercase">Interactive Log</span>
                         </div>
                         
                         <TimelineSection learnerId={learner.id} />
                         
                         <Link href={`/provider/registry/${learner.id}`}>
                            <Button variant="ghost" className="w-full h-16 border border-dashed border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] hover:text-white">
                               View Complete Profile
                            </Button>
                         </Link>
                      </div>

                      {/* COL 3: ACTION POD (3/12) */}
                      <div className="xl:col-span-3 space-y-6">
                         <div className="space-y-3">
                            <Button className="w-full h-20 bg-[#D3C4B5] text-[#111224] rounded-3xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3">
                               <FileText className="h-5 w-5" /> Record PDF
                            </Button>
                            <Button className="w-full h-20 bg-[#111224] border border-white/5 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                               Schedule Session
                            </Button>
                         </div>
                         <div className="vessel bg-orange-500/10 border border-orange-500/20 p-6 rounded-[2rem] flex items-center gap-4">
                            <Activity className="h-5 w-5 text-orange-500" />
                            <div>
                               <p className="text-[9px] font-black text-orange-500 uppercase italic">Anomaly Alert</p>
                               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Consistency Gap: 3 Days</p>
                            </div>
                         </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        
        {filteredLearners.length === 0 && (
          <div className="vessel bg-[#111224]/20 border border-dashed border-white/5 py-32 rounded-[4rem] text-center space-y-6">
             <Brain className="h-16 w-16 text-zinc-800 mx-auto animate-pulse" />
             <div className="space-y-2">
               <h3 className="text-3xl font-black italic uppercase text-zinc-700 tracking-tight">No students yet.</h3>
               <p className="text-[11px] font-bold text-zinc-800 uppercase tracking-[0.2em] italic max-w-sm mx-auto leading-relaxed">No students found. Add a student to get started.</p>
             </div>
          </div>
        )}
      </div>

      {/* INVITE DIALOG */}
      <Dialog open={isInviting} onOpenChange={setIsInviting}>
        <DialogContent className="bg-[#111224] border border-white/10 text-white max-w-2xl p-12 rounded-[4rem]">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              Add <span className="text-[#D3C4B5]">Student.</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-600 italic uppercase text-[10px] font-black tracking-widest leading-relaxed">
              Add a student to your directory. If the student does not exist, an account will be created.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 py-10">
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700 ml-4 italic">Target Email</label>
              <Input 
                value={inviteData.email}
                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                className="bg-[#1D1E31] border-white/5 h-16 rounded-2xl px-6 text-sm font-black italic focus:border-[#BACCB3]/50 transition-all uppercase" 
                placeholder="STUDENT@EMAIL.COM" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700 ml-4 italic">Student Name</label>
              <Input 
                value={inviteData.name}
                onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                className="bg-[#1D1E31] border-white/5 h-16 rounded-2xl px-6 text-sm font-black italic focus:border-[#BACCB3]/50 transition-all uppercase" 
                placeholder="NAME" 
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
                onClick={handleInvite}
                className="w-full h-20 bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-[11px] rounded-[2.5rem] hover:bg-white transition-all shadow-2xl"
            >
                Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
