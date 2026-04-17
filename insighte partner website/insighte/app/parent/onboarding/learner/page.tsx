"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Baby, 
  Brain, 
  Heart, 
  ChevronRight, 
  CheckCircle2,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function LearnerOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    diagnosis_ids: [] as string[],
    notes: ""
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchDiagnoses() {
      const { data } = await supabase.from('diagnoses').select('*');
      if (data) setDiagnoses(data);
    }
    fetchDiagnoses();
  }, []);

  const handleNext = () => setStep(prev => prev + 1);
  const toggleDiagnosis = (id: string) => {
    setFormData(prev => ({
      ...prev,
      diagnosis_ids: prev.diagnosis_ids.includes(id) 
        ? prev.diagnosis_ids.filter(i => i !== id) 
        : [...prev.diagnosis_ids, id]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    let userId: string | undefined;

    // Check for Dev Bypass
    const devRole = document.cookie.split('; ').find(row => row.startsWith('insighte-dev-role='))?.split('=')[1];
    
    if (devRole && process.env.NODE_ENV === 'development') {
      userId = '00000000-0000-0000-0000-000000000000';
    } else {
      const { data: userData } = await supabase.auth.getUser();
      userId = userData.user?.id;
    }

    if (!userId) return;

    // Simulate saving - in reality this would invoke a server action
    const { error } = await supabase.from('children').insert({
      user_id: userId,
      name: formData.name,
      age: parseInt(formData.age),
      diagnoses: formData.diagnosis_ids,
      clinical_notes: formData.notes
    });

    if (!error) {
       window.location.href = "/parent/dashboard";
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#111224] text-white flex flex-col items-center justify-center p-6 pb-20 overflow-hidden relative font-sans">
      {/* BACKGROUND DECOR */}
      <div className="absolute top-0 left-0 h-screen w-screen opacity-20 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] bg-[#D3C4B5]/20 blur-[150px] rounded-full animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] bg-[#BACCB3]/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-xl w-full space-y-12 relative z-10">
         {/* HEADER */}
         <div className="text-center space-y-6">
            <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest italic animate-in fade-in slide-in-from-top-4 duration-1000">
               Childhood Identity // Protocol
            </Badge>
            <h1 className="text-6xl md:text-7xl font-black font-manrope tracking-tighter italic uppercase text-white leading-[0.85] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
               Connection <br/> <span className="text-[#D3C4B5]">Before</span> <br/> Logic.
            </h1>
            <p className="text-sm font-medium text-zinc-500 italic max-w-xs mx-auto animate-in fade-in duration-1000 delay-200">
               Help us understand the clinical context of your family's journey.
            </p>
         </div>

         {/* STEPPER PROGRESS */}
         <div className="flex justify-center gap-3">
            {[1, 2, 3].map(s => (
               <div key={s} className={cn(
                  "h-1.5 rounded-full transition-all duration-700",
                  step >= s ? "w-12 bg-[#BACCB3] shadow-glow glow-[#BACCB3]/30" : "w-4 bg-white/5"
               )} />
            ))}
         </div>

         {/* STEP 1: IDENTITY */}
         {step === 1 && (
            <div className="vessel bg-[#1D1E31]/50 p-12 rounded-[3.5rem] border border-white/5 space-y-10 animate-in fade-in zoom-in-95 duration-700">
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4 italic">Full Name of Child</label>
                     <Input 
                        placeholder="e.g. Aryan S." 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="h-18 rounded-[2rem] bg-[#111224] border-none px-8 text-xl font-bold font-manrope text-white shadow-inner" 
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4 italic">Current Age</label>
                     <Input 
                        type="number" 
                        placeholder="7" 
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="h-18 rounded-[2rem] bg-[#111224] border-none px-8 text-xl font-bold font-manrope text-white shadow-inner" 
                     />
                  </div>
               </div>
               
               <Button 
                  onClick={handleNext} 
                  disabled={!formData.name || !formData.age}
                  className="w-full h-18 rounded-[2rem] bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:scale-[1.02] transition-all"
               >
                  Commit Step 01 <ChevronRight className="h-4 w-4 ml-2" />
               </Button>
            </div>
         )}

         {/* STEP 2: CLINICAL CONTEXT */}
         {step === 2 && (
            <div className="vessel bg-[#1D1E31]/50 p-12 rounded-[3.5rem] border border-white/5 space-y-10 animate-in fade-in zoom-in-95 duration-700">
               <h3 className="text-2xl font-black italic uppercase italic tracking-tighter text-center">Diagnostic Catalog</h3>
               
               <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide py-2">
                  {diagnoses.map((diag) => (
                     <button
                        key={diag.id}
                        onClick={() => toggleDiagnosis(diag.name)}
                        className={cn(
                           "p-6 rounded-3xl border transition-all duration-300 text-[10px] font-black uppercase tracking-widest",
                           formData.diagnosis_ids.includes(diag.name) 
                              ? "bg-[#D3C4B5] border-transparent text-[#111224] shadow-xl" 
                              : "bg-[#111224] border-white/5 text-zinc-600 hover:border-white/20"
                        )}
                     >
                        {diag.name}
                     </button>
                  ))}
               </div>

               <div className="p-8 bg-[#1B1B2D] rounded-[2rem] border border-[#BACCB3]/10 flex gap-4">
                  <ShieldCheck className="h-6 w-6 text-[#BACCB3] shrink-0" />
                  <p className="text-[10px] font-bold text-zinc-500 leading-relaxed italic">
                     These selections help Sanctuary Specialists tailor the initial protocol for your family's unique profile.
                  </p>
               </div>

               <div className="flex gap-4">
                  <Button variant="ghost" onClick={() => setStep(1)} className="h-16 px-8 rounded-2xl text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Back</Button>
                  <Button onClick={handleNext} className="flex-1 h-16 rounded-[2rem] bg-[#D3C4B5] text-[#111224] font-black uppercase tracking-widest text-[10px]">Sync Context</Button>
               </div>
            </div>
         )}

         {/* STEP 3: FINAL SYNC */}
         {step === 3 && (
            <div className="vessel bg-[#1D1E31]/50 p-12 rounded-[3.5rem] border border-white/5 space-y-10 animate-in fade-in zoom-in-95 duration-700">
               <div className="space-y-4 text-center">
                  <div className="h-16 w-16 bg-[#BACCB3]/10 rounded-full flex items-center justify-center mx-auto text-[#BACCB3] mb-4">
                     <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Identity Finalized</h3>
                  <p className="text-sm text-zinc-600 italic">"The only way to do great work is to love what you do." — Sanctuary Philosophy</p>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4 italic">Any specific concerns/goals?</label>
                  <textarea 
                     value={formData.notes}
                     onChange={(e) => setFormData({...formData, notes: e.target.value})}
                     className="w-full h-32 bg-[#111224] border-none rounded-[2rem] p-8 text-sm font-bold text-white shadow-inner resize-none focus:ring-1 ring-[#BACCB3]/30 outline-none"
                     placeholder="Focusing on social engagement and sensory regulation..."
                  />
               </div>

               <Button 
                  onClick={handleComplete}
                  disabled={loading}
                  className="w-full h-18 rounded-[2rem] bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all"
               >
                  {loading ? "Establishing Identity..." : "Enter the Sanctuary Portal"}
               </Button>
            </div>
         )}
      </div>
    </div>
  );
}
