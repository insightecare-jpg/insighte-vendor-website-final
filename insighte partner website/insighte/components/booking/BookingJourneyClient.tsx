"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  Search, 
  Calendar as CalendarIcon, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  ShieldCheck,
  CreditCard,
  MapPin,
  Clock,
  Zap,
  Star,
  Lock,
  ArrowRight,
  User,
  X
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

// Map some known service titles to icons
const getServiceIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('speech')) return <ShieldCheck className="h-10 w-10" />;
  if (lower.includes('shadow')) return <Users className="h-10 w-10" />;
  if (lower.includes('behavio') || lower.includes('aba')) return <Heart className="h-10 w-10" />;
  return <Sparkles className="h-10 w-10" />;
};

interface Service {
  id: string;
  title: string;
  price: number;
  duration: number | null;
}

interface Child {
  id: string;
  name: string;
  age: number | null;
}

interface Provider {
  id: string;
  name: string;
  profile_image: string | null;
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
  const searchParams = useSearchParams();
  const providerIdParam = searchParams.get("provider");

  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: "",
    date: "",
    time: "",
    childId: "",
    providerId: providerIdParam || "",
  });

  useEffect(() => {
    setMounted(true);
    if (providerIdParam) {
      setFormData(prev => ({ ...prev, providerId: providerIdParam }));
    }
  }, [providerIdParam]);

  const supabase = createClient();

  const handleLoginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/book`,
      },
    });
  };

  const nextStep = () => {
    if (step === 3 && isGuest) {
      // Skip Child Selection if guest, go straight to summary and show Auth Modal on Authorize
      setStep(5);
    } else {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };
  const prevStep = () => {
    if (step === 5 && isGuest) {
      setStep(3);
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleAuthorize = () => {
    if (isGuest) {
      setShowAuthModal(true);
    } else {
      // Proceed logic
      alert("Redirecting to Razorpay checkout...");
    }
  };

  if (!mounted) return null;

  const selectedService = services.find(s => s.id === formData.serviceId);
  const selectedChild = childrenData.find(c => c.id === formData.childId);
  const selectedProvider = providers.find(p => p.id === formData.providerId);

  // Generate the next 4 valid dates from today
  const nextDates = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      day: i === 0 ? "TOM" : days[d.getDay()],
      date: d.getDate().toString(),
      month: months[d.getMonth()],
      fullDate: d.toISOString().split('T')[0]
    };
  });

  return (
    <div className="flex min-h-screen-safe flex-col bg-zinc-950 font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 px-4 pt-32 pb-32 sm:px-6">
        <div className="mx-auto max-w-5xl">
           
           {/* STEPPER INDICATOR - ANTIGRAVITY STYLE */}
           <div className="mb-20 flex items-center justify-between px-4 sm:px-20 relative">
              <div className="absolute top-6 left-20 right-20 h-0.5 bg-white/5 -z-0 hidden md:block" />
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className="flex flex-col items-center gap-4 group relative z-10" style={{ display: isGuest && s === 4 ? 'none' : 'flex' }}>
                   <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-700",
                      step === s ? "border-primary bg-primary text-white shadow-[0_0_30px_rgba(79,103,240,0.4)] scale-110" : 
                      step > s ? "border-success bg-success/20 text-success" : 
                      "border-white/10 bg-zinc-950 text-zinc-500"
                   )}>
                      {step > s ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-sm font-black tracking-tight">{s}</span>}
                   </div>
                   <span className={cn(
                     "text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                     step === s ? "text-white" : "text-zinc-600"
                   )}>
                     {s === 1 && "Service"}
                     {s === 2 && "Expert"}
                     {s === 3 && "Schedule"}
                     {s === 4 && "Learner"}
                     {s === 5 && "Checkout"}
                   </span>
                </div>
              ))}
           </div>

           <div className="flex flex-col gap-12 text-center lg:text-left">
              <div className="flex flex-col gap-4">
                 <Badge variant="outline" className="w-fit py-1.5 px-4 font-black tracking-widest text-[9px] uppercase bg-white/5 text-zinc-400 border-white/10 mx-auto lg:mx-0">
                    Step {step} of 5
                 </Badge>
                 <h1 className="text-4xl font-black leading-tight tracking-tighter text-white sm:text-6xl lg:text-7xl">
                    {step === 1 && "What support do you need?"}
                    {step === 2 && (formData.providerId ? "Confirm your specialist." : "Choose your care specialist.")}
                    {step === 3 && "Choose your preferred time."}
                    {step === 4 && "Who is this for?"}
                    {step === 5 && "Review & Complete."}
                 </h1>
              </div>

              {/* STEP CONTENT */}
              <div className="mt-8">
                 
                 {/* STEP 1: SERVICE SELECTION */}
                 {step === 1 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                       {services.length > 0 ? services.map((service, i) => (
                          <button
                             key={service.id}
                             onClick={() => { setFormData({...formData, serviceId: service.id}); nextStep(); }}
                             className={cn(
                                "animate-fade-in-up flex flex-col items-start gap-8 rounded-[48px] border border-white/5 bg-white/[0.02] p-10 transition-all hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-2 group group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.6)]",
                                `stagger-${(i % 5) + 1}`
                             )}
                          >
                             <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-zinc-900 border border-white/10 text-primary shadow-inner group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {getServiceIcon(service.title)}
                             </div>
                             <div className="flex flex-col items-start gap-2">
                                <span className="text-3xl font-black tracking-tight text-white text-left">{service.title}</span>
                                <p className="text-sm font-medium text-zinc-500 leading-relaxed text-left group-hover:text-zinc-400">
                                  {service.duration ? `${service.duration} mins session` : "Expert clinical support"}
                                </p>
                             </div>
                             <div className="mt-4 flex items-center justify-between w-full border-t border-white/5 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                <span>Starts ₹{service.price}</span>
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                             </div>
                          </button>
                       )) : (
                         <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-[48px]">
                           <span className="text-zinc-500 text-sm font-medium">No services currently available.</span>
                         </div>
                       )}
                    </div>
                 )}

                 {/* STEP 2: PROVIDER SELECTION */}
                 {step === 2 && (
                    <div className="flex flex-col gap-12 animate-fade-in-up">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {providers.map((provider) => (
                           <button
                             key={provider.id}
                             onClick={() => { setFormData({...formData, providerId: provider.id}); nextStep(); }}
                             className={cn(
                               "flex flex-col items-start gap-8 rounded-[48px] border border-white/5 bg-white/[0.02] p-10 transition-all hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-2 group text-left",
                               formData.providerId === provider.id && "bg-white/10 border-primary"
                             )}
                           >
                             <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[28px] border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                               {provider.profile_image ? (
                                 <img src={provider.profile_image} alt={provider.name} className="h-full w-full object-cover" />
                               ) : (
                                 <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600">
                                   <User className="h-10 w-10" />
                                 </div>
                               )}
                             </div>
                             <div className="flex flex-col items-start gap-2">
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black tracking-[0.2em] uppercase">Verified Royale</Badge>
                                <span className="text-2xl font-black tracking-tight text-white">{provider.name}</span>
                             </div>
                           </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                         <Button variant="ghost" onClick={prevStep} className="h-16 px-10 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-500">Back</Button>
                         <Button size="lg" onClick={nextStep} disabled={!formData.providerId} className="h-20 flex-1 rounded-[32px] bg-white text-black text-xs font-black uppercase tracking-widest shadow-2xl">Continue to Schedule</Button>
                      </div>
                    </div>
                 )}

                 {/* STEP 3: DATE & TIME */}
                 {step === 3 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                       <div className="lg:col-span-8 flex flex-col gap-12 animate-fade-in-up">
                          <div className="flex flex-col gap-8">
                             <h3 className="text-xl font-black uppercase tracking-[0.2em] text-zinc-500">Select Session Date</h3>
                             <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {nextDates.map(d => (
                                   <button 
                                     key={d.fullDate} 
                                     onClick={() => setFormData({...formData, date: d.fullDate})}
                                     className={cn(
                                       "flex flex-col items-center gap-1 rounded-3xl border p-8 transition-all active:scale-95 group",
                                       formData.date === d.fullDate 
                                          ? "bg-white text-black border-transparent shadow-xl" 
                                          : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20 hover:bg-white/10"
                                     )}
                                   >
                                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{d.day}</span>
                                      <span className="text-3xl font-black">{d.date}</span>
                                      <span className="text-[10px] font-bold opacity-40">{d.month}</span>
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="flex flex-col gap-8">
                             <h3 className="text-xl font-black uppercase tracking-[0.2em] text-zinc-500">Available Time Slots</h3>
                             <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {["10:30 AM", "12:00 PM", "03:30 PM", "05:00 PM"].map(t => (
                                   <button 
                                     key={t}
                                     onClick={() => setFormData({...formData, time: t})}
                                     className={cn(
                                       "h-16 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all active:scale-95",
                                       formData.time === t
                                          ? "bg-primary text-white border-transparent shadow-[0_0_20px_rgba(79,103,240,0.4)]"
                                          : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                                     )}
                                   >
                                      {t}
                                   </button>
                                ))}
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-4 pt-4">
                             <Button variant="ghost" onClick={prevStep} className="h-16 px-10 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white">Back</Button>
                             <Button size="lg" onClick={nextStep} disabled={!formData.date || !formData.time} className="h-20 flex-1 rounded-[32px] bg-white text-black text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-zinc-100 disabled:opacity-30">
                                {isGuest ? "Review & Complete" : "Continue to Family Profile"}
                             </Button>
                          </div>
                       </div>
                       
                       <aside className="lg:col-span-4 flex flex-col gap-8 animate-fade-in-up stagger-2">
                          <Card className="rounded-[40px] border-white/10 bg-zinc-900/50 p-10 flex flex-col gap-8 shadow-2xl backdrop-blur-xl">
                             <div className="flex flex-col gap-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Expert Selection</span>
                                <div className="flex items-center gap-4">
                                   <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10">
                                      {selectedProvider?.profile_image ? <img src={selectedProvider.profile_image} className="h-full w-full object-cover" /> : <div className="bg-zinc-800 h-full w-full flex items-center justify-center"><User className="h-6 w-6" /></div>}
                                   </div>
                                   <span className="text-xl font-black text-white">{selectedProvider?.name || "Specialist"}</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                                <Zap className="h-5 w-5 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Instant verification enabled.</span>
                             </div>
                          </Card>
                       </aside>
                    </div>
                 )}

                 {/* STEP 4: CHILD SELECTION (Hidden for Guests initially) */}
                 {step === 4 && !isGuest && (
                    <div className="flex flex-col gap-12 max-w-2xl mx-auto lg:mx-0 animate-fade-in-up">
                       <div className="grid grid-cols-1 gap-6">
                         {childrenData.length > 0 ? childrenData.map((child) => (
                            <button 
                              key={child.id} 
                              onClick={() => { setFormData({...formData, childId: child.id}); nextStep(); }} 
                              className={cn(
                                "flex items-center gap-8 rounded-[40px] border border-white/5 bg-white/[0.02] p-8 transition-all hover:bg-white/[0.05] hover:border-white/10 hover:scale-[1.02] group text-left",
                                formData.childId === child.id && "bg-white/10 border-primary"
                              )}
                            >
                               <div className="flex h-16 w-16 items-center justify-center shrink-0 rounded-[24px] bg-zinc-900 border border-white/10 text-white font-black text-2xl shadow-inner group-hover:scale-110 transition-transform">
                                  {child.name.charAt(0).toUpperCase()}
                               </div>
                               <div className="flex flex-col items-start gap-1">
                                  <span className="text-2xl font-black tracking-tight text-white">{child.name} {child.age ? `(${child.age}Y)` : ""}</span>
                                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select this profile</span>
                               </div>
                               <ChevronRight className="ml-auto flex-shrink-0 h-6 w-6 text-zinc-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
                            </button>
                         )) : (
                            <div className="py-12 px-6 rounded-[40px] border border-dashed border-white/10 text-center">
                               <p className="text-zinc-500 text-sm mb-4">You have no children profiles created.</p>
                               <Link href="/parent/dashboard/add-child" className="inline-flex h-12 items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 px-6 font-bold text-sm">
                                 Add a Child Profile First
                               </Link>
                            </div>
                         )}
                         <Link href="/parent/dashboard/add-child" className="flex h-20 items-center justify-center rounded-[40px] border border-dashed border-white/10 bg-transparent font-black uppercase tracking-widest text-xs text-zinc-500 hover:border-white hover:text-white transition-all">
                            Add New Family Member
                         </Link>
                       </div>
                       
                       <Button variant="ghost" onClick={prevStep} className="h-16 px-10 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-500 w-fit">Previous Section</Button>
                    </div>
                 )}

                 {/* STEP 5: SUMMARY & PAYMENT */}
                 {step === 5 && (
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:text-left animate-fade-in-up">
                       <div className="lg:col-span-7 flex flex-col gap-10">
                          <Card className="rounded-[48px] border-white/5 bg-white/[0.02] p-12 shadow-inner">
                             <h3 className="mb-12 text-2xl font-black uppercase tracking-tighter text-white">Booking Matrix.</h3>
                             <div className="flex flex-col gap-10">
                                <div className="flex items-start gap-6">
                                   <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-zinc-900 text-white border border-white/10 shadow-xl"><Sparkles className="h-6 w-6" /></div>
                                   <div className="flex flex-col gap-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Clinical Service</span>
                                      <span className="text-2xl font-black tracking-tight leading-none text-white">{selectedService?.title || "Special Education"}</span>
                                   </div>
                                </div>
                                <div className="flex items-start gap-6">
                                   <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-zinc-900 text-white border border-white/10 shadow-xl">
                                      {selectedProvider?.profile_image ? <img src={selectedProvider.profile_image} className="h-full w-full object-cover rounded-lg" /> : <Users className="h-6 w-6" />}
                                   </div>
                                   <div className="flex flex-col gap-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Expert Specialist</span>
                                      <span className="text-2xl font-black tracking-tight leading-none text-white">{selectedProvider?.name || "Professional"}</span>
                                   </div>
                                </div>
                                <div className="flex items-start gap-6">
                                   <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-zinc-900 text-white border border-white/10 shadow-xl"><CalendarIcon className="h-6 w-6" /></div>
                                   <div className="flex flex-col gap-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Session Schedule</span>
                                      <span className="text-2xl font-black tracking-tight leading-none text-white">{formData.date} • {formData.time}</span>
                                   </div>
                                </div>
                                {!isGuest && (
                                  <div className="flex items-start gap-6">
                                     <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-zinc-900 text-white border border-white/10 shadow-xl"><Users className="h-6 w-6" /></div>
                                     <div className="flex flex-col gap-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Learner Profile</span>
                                        <span className="text-2xl font-black tracking-tight leading-none text-white">{selectedChild?.name || "Unknown Profile"}</span>
                                     </div>
                                  </div>
                                )}
                             </div>
                             
                             <div className="mt-16 pt-10 border-t border-white/5 flex flex-col gap-6">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Security Protocols</h4>
                                <div className="flex items-center gap-6">
                                   <ShieldCheck className="h-6 w-6 text-success" />
                                   <span className="text-xs font-black uppercase tracking-widest text-zinc-400">RCI Vetted Professional assigned.</span>
                                </div>
                             </div>
                          </Card>
                          
                          <Button variant="ghost" onClick={prevStep} className="h-16 w-fit px-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white">Modify Selection</Button>
                       </div>

                       <aside className="lg:col-span-5 flex flex-col gap-8">
                          <Card className="rounded-[48px] border-white/10 bg-white p-12 text-black shadow-[0_40px_100px_rgba(255,255,255,0.1)] relative overflow-hidden">
                             {/* Decorative Background Element */}
                             <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                             
                             <div className="flex flex-col gap-10 relative z-10">
                                <div className="flex flex-col gap-4 border-b border-black/5 pb-10">
                                   <div className="flex items-center justify-between">
                                      <span className="text-xs font-black uppercase tracking-widest text-black/40">Session Value</span>
                                      <span className="text-xs font-black">₹{selectedService?.price || 1200}</span>
                                   </div>
                                   <div className="flex items-center justify-between">
                                      <span className="text-xs font-black uppercase tracking-widest text-black/40">Technology Fee</span>
                                      <span className="text-xs font-black">₹0</span>
                                   </div>
                                   <div className="mt-6 flex items-center justify-between">
                                      <span className="text-lg font-black uppercase tracking-widest text-primary italic">To Pay</span>
                                      <span className="text-5xl font-black tracking-tighter">₹{selectedService?.price || 1200}</span>
                                   </div>
                                </div>

                                <div className="flex flex-col gap-6">
                                   <Button 
                                     onClick={handleAuthorize}
                                     size="lg" 
                                     className="h-24 w-full rounded-[32px] bg-black text-lg font-black uppercase tracking-widest text-white hover:bg-zinc-800 shadow-2xl transition-all hover:scale-[1.03] active:scale-95 group"
                                   >
                                      {isGuest ? "Login to Authorize" : "Authorize with Razorpay"}
                                      {isGuest ? <Lock className="ml-3 h-5 w-5 opacity-50" /> : <Zap className="ml-3 h-6 w-6 fill-primary text-primary group-hover:scale-110" />}
                                   </Button>
                                   <div className="flex items-center justify-center gap-4 text-black/40">
                                      <Lock className="h-4 w-4" />
                                      <span className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                                         Industrial Encryption Enabled. <br/>Verified by Institutional Board.
                                      </span>
                                   </div>
                                </div>
                             </div>
                          </Card>
                       </aside>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </main>

      {/* SEAMLESS AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
           <div className="bg-zinc-950 border border-white/10 rounded-[40px] p-10 max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col gap-8 relative overflow-hidden animate-in slide-in-from-bottom-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500" />
              
              <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                 <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col gap-2">
                 <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-2">
                    <Lock className="h-5 w-5 text-primary" />
                 </div>
                 <h2 className="text-3xl font-black tracking-tight text-white">Create Account</h2>
                 <p className="text-sm font-medium text-zinc-400">Save your child's profile and securely complete your booking.</p>
              </div>

              <div className="flex flex-col gap-4">
                 <Button onClick={handleLoginGoogle} className="h-14 w-full rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-3 hover:bg-zinc-200">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                    Continue with Google
                 </Button>
                 
                 <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink-0 mx-4 text-[10px] font-black uppercase text-zinc-600 tracking-widest">Or</span>
                    <div className="flex-grow border-t border-white/5"></div>
                 </div>

                 <Link href={`/login?redirect=/book`} className="h-14 w-full rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center hover:bg-white/10 transition-colors">
                    Continue with Email
                 </Link>
              </div>
           </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
