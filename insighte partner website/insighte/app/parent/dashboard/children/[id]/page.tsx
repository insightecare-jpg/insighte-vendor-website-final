"use client";

import React, { useState, useEffect, useTransition } from "react";
import { 
  ArrowLeft, 
  Activity, 
  Brain, 
  Calendar, 
  Settings, 
  ChevronRight, 
  Clock, 
  ShieldCheck,
  User,
  Plus,
  Save,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import { updateChildProfile } from "@/lib/actions/parent";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ParentBottomNav } from "@/components/navigation/ParentBottomNav";

export default function ChildProfileDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [child, setChild] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    clinical_notes: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: childData } = await supabase
          .from('children')
          .select('*')
          .eq('id', id)
          .single();
        
        if (childData) {
          setChild(childData);
          setEditForm({
            name: childData.name,
            age: childData.age?.toString() || "",
            clinical_notes: childData.clinical_notes || ""
          });

          // Fetch recent sessions for this child
          const { data: sessionData } = await supabase
            .from('bookings')
            .select('*, partners(name), services(title)')
            .eq('child_id', id)
            .order('start_time', { ascending: false });
          setSessions(sessionData || []);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, supabase]);

  const handleUpdate = async () => {
    startTransition(async () => {
      const result = await updateChildProfile(id as string, {
        name: editForm.name,
        age: parseInt(editForm.age),
        clinical_notes: editForm.clinical_notes
      });

      if (result.success) {
        toast.success("Identity Sync Successful", { description: "Changes propagated to sanctuary registry." });
        setChild((prev: any) => ({ ...prev, ...editForm, age: parseInt(editForm.age) }));
        setIsEditing(false);
      } else {
        toast.error("Sync Failed", { description: result.error });
      }
    });
  };

  if (loading) return <div className="min-h-screen bg-[#111224] flex items-center justify-center text-[#D3C4B5] uppercase font-black tracking-widest text-[10px] animate-pulse">Syncing Learner Identity...</div>;
  if (!child) return <div className="min-h-screen bg-[#111224] flex items-center justify-center text-white">Identity not found in sanctuary.</div>;

  return (
    <div className="min-h-screen bg-[#111224] text-white selection:bg-[#D3C4B5]/30">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-32 space-y-16">
        
        {/* BREADCRUMB / BACK */}
        <Link href="/parent/dashboard" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all group w-fit italic">
           <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1" /> Back to Sanctuary HUD
        </Link>

        {/* PROFILE HEADER POD */}
        <section className="vessel bg-[#1D1E31]/40 border border-white/5 rounded-[64px] p-12 md:p-20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 h-96 w-96 bg-[#D3C4B5]/5 blur-[120px] rounded-full pointer-events-none" />
           
           <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
              <div className="h-48 w-48 rounded-[3.5rem] bg-[#111224] flex items-center justify-center border border-white/10 text-7xl font-black italic text-[#D3C4B5] shadow-glow glow-[#D3C4B5]/10">
                 {child.name[0]}
              </div>
              
              <div className="flex-1 space-y-8 text-center md:text-left">
                 <div className="space-y-4">
                    <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border border-[#BACCB3]/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic leading-none">
                       Vanguard Learner Identity
                    </Badge>
                    {isEditing ? (
                       <Input 
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="h-20 bg-black/40 border-white/10 text-5xl font-black font-manrope tracking-tighter italic"
                       />
                    ) : (
                       <h1 className="text-6xl md:text-8xl font-black font-manrope tracking-tighter leading-none italic">
                          {child.name}
                       </h1>
                    )}
                 </div>
                 
                 <div className="flex flex-wrap items-center justify-center md:justify-start gap-12">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Clinical Age</p>
                       {isEditing ? (
                          <Input 
                             value={editForm.age}
                             onChange={(e) => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                             className="h-12 w-24 bg-black/40 border-white/10 text-xl font-bold"
                          />
                       ) : (
                          <p className="text-3xl font-black italic">{child.age || '—'}</p>
                       )}
                    </div>
                    <div className="h-12 w-[1px] bg-white/5 hidden md:block" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Registry Code</p>
                       <code className="text-xl font-black italic text-[#D3C4B5] bg-[#D3C4B5]/5 px-4 py-1.5 rounded-lg border border-[#D3C4B5]/20 font-mono">
                          {child.child_code || 'CLI-TEMP-ID'}
                       </code>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 {isEditing ? (
                    <>
                       <Button onClick={() => setIsEditing(false)} variant="outline" className="h-20 px-8 rounded-3xl border-white/10 text-[10px] uppercase font-black tracking-widest italic">Cancel</Button>
                       <Button onClick={handleUpdate} disabled={isPending} className="h-20 px-10 rounded-3xl bg-[#BACCB3] text-[#111224] text-[10px] uppercase font-black tracking-widest italic shadow-glow glow-[#BACCB3]/20">
                          <Save className="h-5 w-5 mr-3" /> Commit Sync
                       </Button>
                    </>
                 ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="h-20 px-10 rounded-3xl border-white/5 bg-white/5 text-[10px] uppercase font-black tracking-widest hover:text-white transition-all italic leading-none">
                       <Settings className="h-5 w-5 mr-3" /> Configure Identity
                    </Button>
                 )}
              </div>
           </div>
        </section>

        {/* BENTO HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* LEFT: CLINICAL SYNOPSIS (8 Cols) */}
           <div className="lg:col-span-8 space-y-12">
              
              <div className="vessel bg-[#1D1E31]/40 border border-white/5 rounded-[4rem] p-16 space-y-10">
                 <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-[#BACCB3]/10 flex items-center justify-center">
                       <Brain className="h-6 w-6 text-[#BACCB3]" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Clinical Synopsis</h3>
                 </div>
                 
                 {isEditing ? (
                    <Textarea 
                       value={editForm.clinical_notes}
                       onChange={(e) => setEditForm(prev => ({ ...prev, clinical_notes: e.target.value }))}
                       className="min-h-[250px] bg-[#111224] border-white/10 text-xl font-medium italic rounded-[2rem] p-8 focus:border-[#BACCB3]/30 transition-all"
                       placeholder="Detail primary clinical goals and behavioral archetypes..."
                    />
                 ) : (
                    <p className="text-xl text-zinc-400 font-medium italic leading-loose">
                       {child.clinical_notes || "No clinical observations registered. Complete the identity synopsis to authorize specialized mapping protocols."}
                    </p>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                    {[
                       { label: "Behavioral Node", val: "Awaiting Sync" },
                       { label: "Speech Level", val: "Baseline Analysis" },
                       { label: "Sensory Shield", val: "Optimal" }
                    ].map((m, i) => (
                       <div key={i} className="vessel bg-[#111224] p-8 rounded-[2rem] border border-white/10 space-y-2 group hover:border-[#BACCB3]/20 transition-all">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic leading-none">{m.label}</p>
                          <p className="text-lg font-black text-zinc-400 italic group-hover:text-white transition-colors">{m.val}</p>
                       </div>
                    ))}
                 </div>
              </div>

              {/* TEMPORAL ACTIVITY */}
              <div className="space-y-10">
                 <div className="flex items-center justify-between px-8">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Identity Logs</h2>
                    <Badge className="bg-white/5 text-zinc-600 border-none px-4 py-1 text-[10px] font-black tracking-widest italic uppercase">Sync History</Badge>
                 </div>
                 <div className="space-y-6">
                    {sessions.length > 0 ? sessions.map((s) => (
                       <Link key={s.id} href={`/parent/sessions/${s.id}`}>
                          <div className="vessel bg-[#1D1E31]/40 border border-white/5 p-10 rounded-[3rem] flex items-center justify-between group hover:border-[#BACCB3]/20 transition-all">
                             <div className="flex items-center gap-10">
                                <div className="h-20 w-20 rounded-[1.5rem] bg-[#111224] flex items-center justify-center border border-white/10 group-hover:bg-[#BACCB3]/10 transition-all">
                                   <Activity className="h-8 w-8 text-zinc-700 group-hover:text-[#BACCB3] transition-colors" />
                                </div>
                                <div>
                                   <h4 className="text-2xl font-black italic text-zinc-400 group-hover:text-white transition-colors uppercase tracking-tight">{s.services?.title || "Clinical Sync"}</h4>
                                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 italic mt-1">{new Date(s.start_time).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })} • {s.partners?.name}</p>
                                </div>
                             </div>
                             <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-[#111224] transition-all">
                                <ChevronRight className="h-6 w-6" />
                             </div>
                          </div>
                       </Link>
                    )) : (
                       <div className="vessel bg-[#1D1E31]/20 border border-dashed border-white/10 p-20 rounded-[3rem] text-center">
                          <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-800 italic">No identity logs detected in this cycle.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* RIGHT: METRICS & ACTIONS (4 Cols) */}
           <div className="lg:col-span-4 space-y-10">
              
              {/* SYNC STATUS */}
              <div className="vessel bg-[#BACCB3]/5 border border-[#BACCB3]/20 p-12 rounded-[4rem] space-y-10 relative overflow-hidden group">
                 <div className="absolute top-[-10%] left-[-10%] h-32 w-32 bg-[#BACCB3]/10 blur-3xl rounded-full animate-pulse" />
                 <div className="space-y-4 relative z-10">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[#BACCB3]">Identity HUD</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BACCB3] italic leading-none">Sync Calibration: 92%</p>
                 </div>
                 <div className="h-3 w-full bg-[#111224] rounded-full overflow-hidden p-[2px] border border-white/5">
                    <div className="h-full bg-[#BACCB3] w-[92%] rounded-full shadow-glow glow-[#BACCB3]/40" />
                 </div>
                 <p className="text-xs font-semibold italic text-zinc-500 leading-relaxed relative z-10">Identity synchronization active. Protocol updates are being streamed to specialists in real-time.</p>
              </div>

              {/* QUICK OPS */}
              <div className="vessel bg-[#1D1E31]/40 border border-white/5 p-12 rounded-[4rem] space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 italic">Concierge Ops</h3>
                 <Link href="/specialists">
                    <Button className="w-full h-20 rounded-[2rem] bg-white text-[#111224] font-black uppercase tracking-widest text-[10px] hover:translate-y-[-4px] transition-all shadow-2xl mb-4 italic leading-none">
                       <Plus className="h-5 w-5 mr-3 fill-current" /> Initialize Sync
                    </Button>
                 </Link>
                 <Button variant="ghost" className="w-full h-16 rounded-[1.5rem] border border-white/5 bg-white/5 text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all italic">
                    <Calendar className="h-5 w-5 mr-3" /> Recursive Protocol
                 </Button>
                 <div className="pt-8 mt-4 border-t border-white/5">
                    <Button variant="ghost" className="w-full text-[9px] font-black uppercase tracking-widest text-red-900/40 hover:text-red-600 transition-all italic">
                       De-authorize Identity
                    </Button>
                 </div>
              </div>

              {/* ENCRYPTION SHIELD */}
              <div className="pod bg-[#86EFAC]/5 border border-[#86EFAC]/10 p-10 rounded-[3rem] flex items-center gap-8">
                 <div className="h-14 w-14 rounded-2xl bg-[#86EFAC]/10 flex items-center justify-center text-[#86EFAC]">
                    <ShieldCheck className="h-8 w-8" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">Clinical Shield</h4>
                    <p className="text-[10px] text-[#86EFAC] font-black italic tracking-wider leading-none">HIPAA NODE ACTIVE</p>
                 </div>
              </div>

           </div>
        </div>
      </main>

      <ParentBottomNav />
      <Footer />
    </div>
  );
}