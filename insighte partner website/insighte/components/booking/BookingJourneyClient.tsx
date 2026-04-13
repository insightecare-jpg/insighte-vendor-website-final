"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Calendar as CalendarIcon,
  Clock,
  Zap,
  ArrowRight,
  User,
  ExternalLink,
  ChevronLeft,
  Loader2,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createBooking, getProviderSlots } from "@/lib/actions/booking";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

interface Service {
  id: string;
  program_id: string;
  title: string;
  price: number;
  duration: number;
  type: string;
}

interface Child {
  id: string;
  name: string;
  age: number | null;
}

interface Provider {
  id: string;
  name: string;
  avatar_url: string | null;
  profile_image?: string | null;
  verified: boolean;
}

interface BookingJourneyClientProps {
  services: Service[];
  childrenData: Child[];
  providers: Provider[];
  isGuest?: boolean;
}

export default function BookingJourneyClient({ services, childrenData, providers, isGuest = false }: BookingJourneyClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  
  const provider = providers[0];
  const [formData, setFormData] = useState({
    serviceId: services[0]?.id || "",
    date: "",
    time: "",
    slotId: "",
    childId: childrenData[0]?.id || "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });

  // Fetch slots when date changes
  useEffect(() => {
    if (formData.date && provider?.id) {
       setLoadingSlots(true);
       getProviderSlots(provider.id, formData.date).then(data => {
          setSlots(data || []);
          setLoadingSlots(false);
       });
    }
  }, [formData.date, provider?.id]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    const selectedService = services.find(s => s.id === formData.serviceId);
    const selectedSlot = slots.find(s => s.id === formData.slotId);

    if (!selectedService || (!selectedSlot && step === 3)) {
       toast.error("Incomplete Protocol: Please select service and slot.");
       setIsSubmitting(false);
       return;
    }

    // IF GUEST: Capture details and simulate reservation/payment
    if (isGuest) {
       if (!formData.guestEmail || !formData.guestName) {
          toast.error("Protocol Error: Email and Name required for Guest Authorization.");
          setIsSubmitting(false);
          setStep(4); // Force to guest info step
          return;
       }

       toast.success("Moment Reserved! Institutional Receipt being generated...");
       // Store guest booking in session or temp table
       router.push(`/book/confirmation?email=${encodeURIComponent(formData.guestEmail)}&name=${encodeURIComponent(formData.guestName)}`);
       return;
    }

    const res = await createBooking({
       provider_id: provider.id,
       child_id: formData.childId,
       service_id: formData.serviceId,
       slot_id: formData.slotId || null, 
       start_time: selectedSlot ? selectedSlot.start_time : new Date(formData.date + "T14:00:00Z").toISOString(),
       end_time: selectedSlot ? selectedSlot.end_time : new Date(formData.date + "T15:00:00Z").toISOString(),
       total_price: selectedService.price
    });

    if (res.success) {
       toast.success("Protocol Authorized. Check Sanctuary Dashboard.");
       router.push("/parent/dashboard");
    } else {
       toast.error("Institutional Sync Failure: " + res.error);
    }
    setIsSubmitting(false);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const selectedService = services.find(s => s.id === formData.serviceId);
  const selectedChild = childrenData.find(c => c.id === formData.childId);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-16 py-12">
      
      {/* HEADER: CONTEXT HUD */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
             Protocol Sync // Step {step} of 4
          </Badge>
          <div className="flex items-center gap-6">
             <div className="h-16 w-16 rounded-2xl bg-[#1D1E31] p-1 border border-white/5 overflow-hidden">
                <img src={provider?.avatar_url || (provider as any)?.profile_image || ''} alt="" className="h-full w-full object-cover rounded-xl grayscale opacity-50" />
             </div>
             <div>
                <h1 className="text-4xl md:text-6xl font-black font-manrope tracking-tighter italic uppercase text-white leading-none">
                   Configuring <span className="text-[#D3C4B5]">{provider?.name.split(' ')[0]}.</span>
                </h1>
                {provider?.verified && <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BACCB3] italic flex items-center gap-2 mt-2"><ShieldCheck className="h-3 w-3" /> Institionally Verified</span>}
             </div>
          </div>
        </div>
      </section>

      {/* PROGRESS FLOW */}
      <div className="flex gap-3">
         {[1, 2, 3, 4].map(s => (
            <div key={s} className={cn(
               "h-1.5 flex-1 rounded-full transition-all duration-1000",
               step >= s ? "bg-[#BACCB3] shadow-glow glow-[#BACCB3]/20" : "bg-white/5"
            )} />
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* MAIN CONFIGURATION ENGINE */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
              {step === 1 && (
                 <motion.div 
                   key="step1"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-10"
                 >
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black italic uppercase tracking-tight text-white">Select Mastery Pillar</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Choose the clinical protocol for this engagement.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {services.map(s => (
                          <button 
                            key={s.id} 
                            onClick={() => { setFormData({...formData, serviceId: s.id}); nextStep(); }}
                            className={cn(
                              "vessel bg-[#1D1E31]/50 p-10 rounded-[3rem] border border-white/5 text-left group hover:border-[#BACCB3]/40 transition-all shadow-xl",
                              formData.serviceId === s.id && "border-[#BACCB3] bg-[#BACCB3]/5"
                            )}
                          >
                             <div className="flex justify-between items-start mb-8">
                                <div className="h-14 w-14 bg-[#111224] rounded-2xl flex items-center justify-center text-[#BACCB3] group-hover:scale-110 transition-transform">
                                   <Sparkles className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase text-zinc-500">₹{s.price}</span>
                             </div>
                             <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">{s.title}</h4>
                             <p className="text-[10px] font-bold text-zinc-600 uppercase italic tracking-widest">{s.duration}m // {s.type}</p>
                          </button>
                       ))}
                    </div>
                 </motion.div>
              )}

              {step === 2 && (
                 <motion.div 
                   key="step2"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-12"
                 >
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black italic uppercase tracking-tight text-white">Temporal Grid Selection</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Select an opening in the specialist's schedule.</p>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                          {Array.from({length: 7}).map((_, i) => {
                             const d = new Date(); d.setDate(d.getDate() + i + 1);
                             const dateStr = d.toISOString().split('T')[0];
                             return (
                                <button 
                                   key={dateStr}
                                   onClick={() => setFormData({...formData, date: dateStr})}
                                   className={cn(
                                      "flex-shrink-0 w-24 h-32 rounded-[2rem] border flex flex-col items-center justify-center transition-all",
                                      formData.date === dateStr ? "bg-[#BACCB3] text-[#111224] border-transparent shadow-xl" : "bg-[#111224] border-white/5 text-zinc-500"
                                   )}
                                >
                                   <span className="text-[9px] font-black uppercase tracking-widest opacity-60 italic">{d.toLocaleDateString('en-IN', {weekday: 'short'})}</span>
                                   <span className="text-3xl font-black font-manrope">{d.getDate()}</span>
                                </button>
                             );
                          })}
                       </div>

                       {formData.date && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                             <div className="flex items-center gap-4">
                                <div className="h-[2px] w-12 bg-[#BACCB3]/30" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Available Channels</h4>
                             </div>
                             
                             {loadingSlots ? (
                                <div className="flex items-center gap-3 text-zinc-600 italic text-[10px] font-black uppercase"><Loader2 className="h-4 w-4 animate-spin" /> Scanning Registry...</div>
                             ) : slots.length === 0 ? (
                                <div className="vessel bg-[#1D1E31]/20 p-12 rounded-[2.5rem] border border-white/5 text-center italic text-zinc-700 text-xs font-black uppercase tracking-widest">No Temporal Openings Available for this Cycle.</div>
                             ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                   {slots.map(slot => (
                                      <button 
                                         key={slot.id}
                                         onClick={() => { setFormData({...formData, slotId: slot.id}); nextStep(); }}
                                         className={cn(
                                            "h-16 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                            formData.slotId === slot.id ? "bg-[#D3C4B5] text-[#111224] border-transparent shadow-lg" : "bg-[#111224] border-white/5 text-zinc-500 hover:border-white/20"
                                         )}
                                      >
                                         {new Date(slot.start_time).toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}
                                      </button>
                                   ))}
                                </div>
                             )}
                          </div>
                       )}
                    </div>
                    <Button variant="ghost" onClick={prevStep} className="text-zinc-500 italic uppercase font-black text-[10px] tracking-widest hover:text-white transition-all"><ChevronLeft className="h-4 w-4 mr-2" /> Modify Pillar</Button>
                 </motion.div>
              )}

              {step === 3 && (
                 <motion.div 
                   key="step3"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-12"
                 >
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black italic uppercase tracking-tight text-white flex items-center justify-between">
                          Learner Context
                          {!isGuest && (
                             <Link href="/parent/onboarding/learner">
                                <button className="text-[9px] font-black uppercase tracking-widest text-[#BACCB3] border-b border-[#BACCB3]/30 pb-1 italic">+ New Identity</button>
                             </Link>
                          )}
                       </h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Select the profile for this clinical engagement.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {isGuest ? (
                          <div className="col-span-2 space-y-6 animate-in slide-in-from-right-4 duration-500">
                             <div className="vessel bg-[#1D1E31]/50 p-10 rounded-[3rem] border border-[#BACCB3]/30">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3] mb-4 block italic">Guest Learner Identity</label>
                                <input 
                                   type="text" 
                                   placeholder="ENTER LEARNER NAME" 
                                   value={formData.guestName}
                                   onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                                   className="w-full bg-transparent border-none text-3xl font-black italic uppercase tracking-tighter text-white focus:ring-0 placeholder:text-white/10"
                                   autoFocus
                                />
                             </div>
                             {formData.guestName && (
                                <Button onClick={nextStep} className="h-16 px-12 rounded-2xl bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                                   Proceed to Verification <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                             )}
                          </div>
                       ) : childrenData.length > 0 ? (
                          childrenData.map(child => (
                             <button 
                               key={child.id} 
                               onClick={() => { setFormData({...formData, childId: child.id}); nextStep(); }}
                               className={cn(
                                 "vessel bg-[#1D1E31]/50 p-10 rounded-[3rem] border border-white/5 text-left group hover:border-[#BACCB3]/40 transition-all",
                                 formData.childId === child.id && "border-[#BACCB3] bg-[#BACCB3]/5"
                               )}
                             >
                                <div className="h-16 w-16 bg-[#111224] rounded-2xl flex items-center justify-center text-white font-black text-2xl italic mb-6">
                                   {child.name[0]}
                                </div>
                                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">{child.name}</h4>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-2 italic">{child.age || '?'} Years Old</p>
                             </button>
                          ))
                       ) : (
                          <div className="col-span-2 vessel bg-white/5 p-12 rounded-[2.5rem] border border-dashed border-white/10 text-center space-y-4">
                             <User className="h-10 w-10 text-zinc-800 mx-auto" />
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">No Learner Profiles Detected.</p>
                             <Button onClick={() => router.push('/parent/onboarding/learner')} size="sm" className="bg-[#BACCB3] text-[#111224] font-black uppercase text-[8px] rounded-xl">Create Identity</Button>
                          </div>
                       )}
                    </div>
                    <Button variant="ghost" onClick={prevStep} className="text-zinc-500 italic uppercase font-black text-[10px] tracking-widest hover:text-white transition-all"><ChevronLeft className="h-4 w-4 mr-2" /> Modify Temporal Pulse</Button>
                 </motion.div>
              )}

              {step === 4 && (
                 <motion.div 
                   key="step4"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-12"
                 >
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black italic uppercase tracking-tight text-white mb-2">Institutional Authorization</h3>
                       <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 italic">Final authorization for protocol synchronization.</p>
                    </div>

                    <div className="vessel bg-[#111224] p-12 rounded-[4rem] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 h-64 w-64 bg-[#BACCB3]/5 blur-[100px] rounded-full group-hover:scale-125 transition-all duration-1000" />
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                          <div className="space-y-1.5">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Specialist Signature</p>
                             <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{provider?.name}</p>
                          </div>
                          <div className="space-y-1.5">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Clinical Master Pillar</p>
                             <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedService?.title}</p>
                          </div>
                          <div className="space-y-1.5">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Temporal Engagement</p>
                             <p className="text-2xl font-black text-[#BACCB3] italic tracking-tighter uppercase">{formData.date} // {formData.time || '14:00 PM'}</p>
                          </div>
                          <div className="space-y-1.5">
                             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Learner Archetype</p>
                             <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{isGuest ? (formData.guestName || "Protocol Guest") : (selectedChild?.name || "Identity Sync")}</p>
                          </div>

                        {isGuest && (
                           <div className="pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Verification Email</label>
                                 <input 
                                    type="email" 
                                    placeholder="your@email.com"
                                    value={formData.guestEmail}
                                    onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
                                    className="w-full h-14 bg-white/5 rounded-2xl border border-white/5 px-6 text-sm font-bold placeholder:text-zinc-600 focus:border-[#BACCB3]/30 transition-all text-white"
                                 />
                              </div>
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Communication Phone</label>
                                 <input 
                                    type="tel" 
                                    placeholder="+91 00000 00000"
                                    value={formData.guestPhone}
                                    onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
                                    className="w-full h-14 bg-white/5 rounded-2xl border border-white/5 px-6 text-sm font-bold placeholder:text-zinc-600 focus:border-[#BACCB3]/30 transition-all text-white"
                                 />
                              </div>
                           </div>
                        )}
                       </div>

                       <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                          <div className="text-center md:text-left">
                             <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600 mb-1">Authorization Value</p>
                             <p className="text-7xl font-black text-white italic tracking-tighter">₹{selectedService?.price}</p>
                          </div>
                          <Button 
                             onClick={handleComplete} 
                             disabled={isSubmitting}
                             className="h-24 px-16 rounded-[2.5rem] bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-lg hover:scale-[1.02] transition-all shadow-glow glow-[#BACCB3]/30"
                          >
                             {isSubmitting ? <span className="flex items-center gap-4"><Loader2 className="h-6 w-6 animate-spin" /> Syncing Logic...</span> : <span className="flex items-center gap-4">Authorize Protocol <Zap className="h-6 w-6 fill-current" /></span>}
                          </Button>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 px-10 text-zinc-600 opacity-60 italic text-[9px] font-bold uppercase tracking-widest">
                       <ShieldCheck className="h-4 w-4" /> Secure institutional checkout. Identity encryption active.
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* SIDEBAR: SELECTION HUD */}
        <aside className="lg:col-span-4">
           <div className="vessel bg-[#1D1E31]/50 border border-white/5 p-10 rounded-[3.5rem] space-y-10 sticky top-32 shadow-xl">
              <div className="space-y-2">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic flex items-center gap-2">
                    <span className="h-1 w-8 bg-[#BACCB3] rounded-full" /> Selection Audit
                 </h4>
              </div>

              <div className="space-y-8">
                 <div className="flex items-center gap-4 group">
                    <div className={cn(
                       "h-10 w-10 rounded-xl bg-[#111224] border border-white/5 flex items-center justify-center transition-all",
                       formData.serviceId ? "text-[#BACCB3]" : "text-zinc-800"
                    )}>
                       <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-black uppercase text-zinc-600">Clinical Pillar</p>
                       <span className="text-xs font-black italic text-white uppercase tracking-tight">{selectedService?.title || "Awaiting Config..."}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 group">
                    <div className={cn(
                       "h-10 w-10 rounded-xl bg-[#111224] border border-white/5 flex items-center justify-center transition-all",
                       formData.date ? "text-[#D3C4B5]" : "text-zinc-800"
                    )}>
                       <Clock className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-black uppercase text-zinc-600">Temporal Pulse</p>
                       <span className="text-xs font-black italic text-white uppercase tracking-tight">{formData.date ? `${formData.date} @ ${formData.time || '14:00'}` : "Awaiting Sync..."}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 group">
                    <div className={cn(
                       "h-10 w-10 rounded-xl bg-[#111224] border border-white/5 flex items-center justify-center transition-all",
                       formData.childId ? "text-[#BACCB3]" : "text-zinc-800"
                    )}>
                       <User className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-[8px] font-black uppercase text-zinc-600">Learner Archetype</p>
                       <span className="text-xs font-black italic text-white uppercase tracking-tight">{selectedChild?.name || "Awaiting Identity..."}</span>
                    </div>
                 </div>
              </div>

              <div className="pt-10 border-t border-white/5 bg-gradient-to-b from-transparent to-white/5 -mx-10 -mb-10 p-10 mt-10 rounded-b-[3.5rem]">
                 <p className="text-[10px] font-bold text-zinc-500 italic leading-relaxed text-center uppercase tracking-tight">
                    Authorized protocols are instantly indexed in the Sanctuary HUD.
                 </p>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
