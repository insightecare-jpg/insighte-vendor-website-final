"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  ArrowLeft, 
  Sparkles, 
  User, 
  Calendar, 
  FileText, 
  ChevronRight, 
  Zap, 
  Baby, 
  Smile, 
  ShieldCheck, 
  Brain, 
  Stethoscope, 
  Camera,
  Plus,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { addChildProfile } from "@/lib/actions/parent";
import { createClient } from "@/lib/supabase/client";
import { getMockUser, isDevBypassActive } from "@/lib/api/dev-bypass-helper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddChildPage() {
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    clinical_notes: "",
    diagnoses: [] as string[]
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Foundation Bio Required", { description: "Please provide the learner's name." });
      return;
    }

    startTransition(async () => {
      try {
        let userId: string | null = null;
        
        if (isDevBypassActive()) {
          userId = getMockUser()?.id || null;
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          userId = user?.id || null;
        }

        if (!userId) {
          toast.error("Identity Lock", { description: "Please log in to register a profile." });
          return;
        }

        const result = await addChildProfile(userId, {
          ...formData,
          age: formData.age ? parseInt(formData.age) : null
        });

        if (result.success) {
          toast.success("Registry Complete", { description: "Child profile synced to the sanctuary." });
          router.push("/parent/dashboard");
        } else {
          toast.error("Registry Failure", { description: result.error || "Something went wrong." });
        }
      } catch (err) {
        console.error("Submission Error:", err);
        toast.error("Clinical Error", { description: "An unexpected error occurred during registration." });
      }
    });
  };

  return (
    <div className="flex min-h-screen-safe flex-col bg-zinc-950 font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 px-4 pt-32 pb-32 sm:px-6">
        <div className="mx-auto max-w-5xl animate-fade-in-up">
           
           {/* HEADER - NEW MEMBER INTAKE */}
           <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-6">
                 <Link href="/parent/dashboard" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1" /> Back to Sanctuary
                 </Link>
                 <div className="flex flex-col gap-4">
                    <Badge variant="outline" className="w-fit py-1.5 px-4 font-black tracking-widest text-[9px] uppercase bg-white/5 text-zinc-400 border-white/10 backdrop-blur-md">
                       <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" /> Institutional Registry
                    </Badge>
                    <h1 className="text-5xl font-black leading-tight tracking-tighter text-white sm:text-7xl lg:text-9xl">
                       New <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/70 to-white/30 italic">Profile.</span>
                    </h1>
                 </div>
              </div>
           </div>

           {/* FORM CONSTRUCT */}
           <div className="mt-24 grid grid-cols-1 gap-12 lg:grid-cols-12 animate-fade-in-up stagger-2">
              
              {/* PRIMARY CONTENT - MULTI-STEP FEED */}
              <div className="flex flex-col gap-12 lg:col-span-8">
                 <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                    
                    {/* AVATAR UPLOAD SECTOR */}
                    <div className="flex flex-col gap-10 rounded-[56px] border border-white/5 bg-white/[0.02] p-12 sm:p-16 shadow-2xl">
                       <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-12">
                          <div className="group relative flex h-40 w-40 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[48px] bg-zinc-900 border-2 border-dashed border-white/10 transition-all hover:border-primary hover:bg-zinc-800">
                             <div className="flex flex-col items-center gap-4 text-center">
                                <Camera className="h-8 w-8 text-zinc-700" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Studio Photo</span>
                             </div>
                             <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          
                          <div className="flex-1 flex flex-col gap-6">
                             <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic underline underline-offset-8 decoration-white/5">Foundation Bio</h3>
                             <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                   <label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 ml-3">Full Legal Name</label>
                                   <Input 
                                      value={formData.name}
                                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                      placeholder="Ishan" 
                                      className="h-16 rounded-2xl border-white/5 bg-zinc-900/50 px-6 font-medium text-white shadow-inner focus:bg-zinc-900 transition-all" 
                                   />
                                </div>
                                <div className="flex flex-col gap-2">
                                   <label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 ml-3">Age</label>
                                   <Input 
                                      value={formData.age}
                                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                                      placeholder="6" 
                                      type="number"
                                      className="h-16 rounded-2xl border-white/5 bg-zinc-900/50 px-6 font-medium text-white shadow-inner focus:bg-zinc-900 transition-all" 
                                   />
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* CLINICAL SYNOPSIS SECTOR */}
                    <div className="flex flex-col gap-8 rounded-[56px] border border-white/5 bg-white/[0.01] p-12 sm:p-16">
                       <div className="flex items-center gap-4 text-primary">
                          <Brain className="h-8 w-8" />
                          <h3 className="text-3xl font-black tracking-tighter text-white uppercase italic">Cognitive Synopsis</h3>
                       </div>
                       
                       <div className="flex flex-col gap-4">
                          <label className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-600 ml-3">Observation Details (Optional)</label>
                          <Textarea 
                             value={formData.clinical_notes}
                             onChange={(e) => setFormData(prev => ({ ...prev, clinical_notes: e.target.value }))}
                             placeholder="Please share any existing clinical observations, behavioral patterns, or specific developmental goals you wish to target in this vanguard cycle..." 
                             className="min-h-[220px] rounded-[40px] border-white/5 bg-zinc-900/50 p-10 text-lg font-medium text-white shadow-inner focus:bg-zinc-900 transition-all placeholder:text-zinc-800"
                          />
                       </div>

                       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
                          <Button variant="outline" type="button" className="h-20 rounded-[28px] border-white/5 bg-white/5 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/10 leading-relaxed text-left justify-start px-8 py-0 group">
                             <div className="flex items-center gap-4">
                                <div className="h-4 w-4 rounded-full border border-white/20 group-hover:border-primary transition-all" /> Upload Vector Diagnosis (PDF)
                             </div>
                          </Button>
                          <Button variant="outline" type="button" className="h-20 rounded-[28px] border-white/5 bg-white/5 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/10 leading-relaxed text-left justify-start px-8 py-0 group">
                             <div className="flex items-center gap-4">
                                <div className="h-4 w-4 rounded-full border border-white/20 group-hover:border-primary transition-all" /> IEP Module Archive
                             </div>
                          </Button>
                       </div>
                    </div>

                    {/* ACTION FINALE */}
                    <Button 
                       type="submit" 
                       disabled={isPending}
                       className="h-24 w-full rounded-[40px] bg-white text-black text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-white/5 hover:scale-[1.03] active:scale-95 disabled:opacity-50 transition-all group overflow-hidden"
                    >
                       {isPending ? (
                          <div className="flex items-center gap-3">
                             <div className="h-2 w-2 rounded-full bg-black animate-bounce [animation-delay:-0.3s]" />
                             <div className="h-2 w-2 rounded-full bg-black animate-bounce [animation-delay:-0.15s]" />
                             <div className="h-2 w-2 rounded-full bg-black animate-bounce" />
                          </div>
                       ) : (
                          <span className="flex items-center gap-4">
                             Finalize Registration <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                          </span>
                       )}
                    </Button>

                 </form>
              </div>

              {/* ASIDE - INSTITUTIONAL TRUST */}
              <aside className="lg:col-span-4 sticky top-28 flex flex-col gap-10">
                 <Card className="rounded-[56px] border border-white/5 bg-zinc-900/50 p-12 shadow-2xl backdrop-blur-xl">
                    <h3 className="mb-10 text-2xl font-black uppercase tracking-tighter text-white">Privacy Guard.</h3>
                    <div className="flex flex-col gap-10">
                       <div className="flex items-center gap-6 group">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                             <ShieldCheck className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col gap-1">
                             <h4 className="text-lg font-black text-white leading-none">HIPAA Compliant</h4>
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Clinical Encryption</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6 group">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 border border-success/20 text-success">
                             <Lock className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col gap-1">
                             <h4 className="text-lg font-black text-white leading-none">RLS Enforced</h4>
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Personal Data Shield</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6 group">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent">
                             <Zap className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col gap-1">
                             <h4 className="text-lg font-black text-white leading-none">Instant Vectoring</h4>
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Matching Engine Active</p>
                          </div>
                       </div>
                    </div>
                 </Card>

                 <div className="rounded-[56px] bg-zinc-900 p-12 text-white relative overflow-hidden group border border-white/5 shadow-inner">
                    <p className="text-2xl font-black italic text-zinc-500 leading-tight">"A child's world is a sacred workspace. We treat it with clinical precision and family warmth."</p>
                 </div>
              </aside>

           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
