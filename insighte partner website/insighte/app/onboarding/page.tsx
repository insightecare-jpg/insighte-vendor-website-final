"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Smile,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "The Insighte Welcome", subtitle: "Define your clinical goals.", icon: <Heart className="h-6 w-6" /> },
  { id: 2, title: "Identity Mapping", subtitle: "Secure your child's profile.", icon: <Smile className="h-6 w-6" /> },
  { id: 3, title: "Sanctuary Match", subtitle: "Connect with elite specialists.", icon: <Users className="h-6 w-6" /> }
];

export default function OnboardingSanctuary() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  
  // Clinical State Architecture
  const [formData, setFormData] = useState({
    childName: "",
    childAge: "",
    childGender: "",
    serviceNeeded: "",
    journeyStage: "Early Detection",
    clinicalContext: "",
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleComplete = async () => {
    setLoading(true);
    // In a real app, we'd save the onboarding data to Supabase here
    setTimeout(() => {
      router.push("/parent/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#111224] text-[#e1e0fa] font-inter overflow-x-hidden flex flex-col justify-between">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-[#0b0c1f] opacity-40 blur-[120px] rounded-full"></div>
        <div className="absolute top-[10%] -right-[5%] w-[40%] h-[40%] bg-[#282016] opacity-20 blur-[100px] rounded-full"></div>
      </div>

      {currentStep > 0 && <Navbar />}

      {/* Step 0: Welcome Portal */}
      {currentStep === 0 && (
        <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 pt-12 pb-24 max-w-4xl mx-auto w-full animate-fade-in-up">
          {/* Architectural Portal Hero Section */}
          <div className="relative w-full aspect-[4/5] md:aspect-video mb-12 flex items-center justify-center">
            {/* Floating Elements Around the Portal */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#baccb3] opacity-10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-[#c8c4db] opacity-5 blur-3xl rounded-full"></div>
            
            {/* The Architectural Portal (Vessel) */}
            <div className="relative w-full h-full max-w-2xl overflow-hidden rounded-xl border border-[#47464c]/20 backdrop-blur-[24px] bg-[linear-gradient(135deg,rgba(50,51,71,0.7)_0%,rgba(17,18,36,0.4)_100%)] shadow-[0_0_100px_rgba(211,196,181,0.15)] flex items-center justify-center group">
              <img 
                alt="Weightless architectural portal" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000" 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111224] via-transparent to-transparent opacity-80"></div>
              
              {/* Floating Visual Cue */}
              <div className="relative z-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#d3c4b5]/20 backdrop-blur-md flex items-center justify-center border border-[#d3c4b5]/30 mb-4 shadow-[0_20px_80px_rgba(11,12,31,0.6)]">
                  <Heart className="text-[#d3c4b5] w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Editorial Content */}
          <div className="text-center space-y-8 max-w-2xl">
            <h1 className="font-manrope text-5xl md:text-7xl font-extrabold tracking-tighter text-[#e1e0fa] leading-[1.1]">
              Find the right support on Insighte
            </h1>
            <p className="text-[#c8c5cd] text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto">
              Your journey to discovery starts here. Setting up your profile to match with the best specialists through Sanctuary.
            </p>
          </div>
          
          {/* Call to Action Section */}
          <div className="mt-16 w-full flex flex-col items-center gap-6">
            <button 
              onClick={() => setCurrentStep(1)}
              className="group relative px-12 py-5 rounded-full bg-[#d3c4b5] text-[#382f24] font-manrope font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(200,196,219,0.4)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin the journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#d3c4b5] to-[#f0e0d0] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        </main>
      )}

      {/* Steps 1-3: Clinical Focus, Identity, Matching */}
      {currentStep > 0 && (
        <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-32 flex-grow animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             {/* LEFT COLUMN --- NARRATIVE ARCHITECTURE */}
             <div className="space-y-12">
                <div className="flex items-center gap-3">
                   <Badge className="bg-[#baccb3]/10 text-[#baccb3] border-none rounded-full px-8 py-2 text-[10px] font-black uppercase tracking-widest">
                      Pathway Initiation 0{currentStep}
                   </Badge>
                   <div className="h-1.5 w-1.5 rounded-full bg-[#baccb3] blur-[1px] animate-pulse" />
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] font-manrope">
                   Initialize <br/>
                   <span className="text-[#c8c5cd] italic">Insighte Journey.</span>
                </h1>

                <div className="space-y-6 pt-10">
                   {STEPS.map(step => (
                     <div 
                        key={step.id} 
                        className={cn(
                          "flex items-center gap-6 p-6 rounded-[32px] transition-all duration-700",
                          currentStep === step.id ? "bg-white/5 border border-white/10 shadow-lg" : "opacity-40"
                        )}
                     >
                        <div className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                          currentStep === step.id ? "bg-[#d3c4b5] text-[#382f24]" : "bg-[#191a2d] text-[#919097]"
                        )}>
                           {step.icon}
                        </div>
                        <div className="space-y-1 text-left">
                           <h3 className="text-xl font-bold font-manrope tracking-tight text-[#e1e0fa]">{step.title}</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#919097]">{step.subtitle}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* RIGHT COLUMN --- INPUT VESSEL */}
             <div className="animate-fade-in-up md:delay-150">
                <div className="bg-[linear-gradient(135deg,rgba(50,51,71,0.7)_0%,rgba(200,196,219,0.05)_100%)] backdrop-blur-[24px] p-8 md:p-14 rounded-[3rem] shadow-[0_20px_80px_rgba(11,12,31,0.6)] border border-[#47464c]/20 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 h-40 w-40 bg-[#d3c4b5]/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                   
                   {currentStep === 1 && (
                      <div className="space-y-10 animate-fade-in-up">
                        <div className="space-y-2">
                           <h2 className="text-3xl font-extrabold font-manrope tracking-tighter text-[#e1e0fa]">Care Focus</h2>
                           <p className="text-xs text-[#919097] font-medium tracking-wide">Select the clinical resonance your child requires.</p>
                        </div>
                        
                        <div className="space-y-8">
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d3c4b5] ml-4">Required Service</p>
                              <div className="grid grid-cols-2 gap-3">
                                 {["Speech", "OT", "ABA", "Behavioral", "Physio", "Special Ed"].map(service => (
                                   <button 
                                     key={service}
                                     onClick={() => updateForm("serviceNeeded", service)}
                                     className={cn(
                                       "h-14 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border",
                                       formData.serviceNeeded === service 
                                         ? "bg-[#d3c4b5] text-[#382f24] border-transparent shadow-glow shadow-[#d3c4b5]/10 scale-[1.02]" 
                                         : "bg-[#191a2d] text-[#919097] border-white/5 hover:border-[#d3c4b5]/20"
                                     )}
                                   >
                                     {service}
                                   </button>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d3c4b5] ml-4">Journey Stage</p>
                              <div className="grid grid-cols-2 gap-4">
                                 <button 
                                   onClick={() => updateForm("journeyStage", "Early Detection")}
                                   className={cn(
                                     "h-[72px] rounded-3xl transition-all font-black uppercase text-[9px] tracking-widest",
                                     formData.journeyStage === "Early Detection" 
                                       ? "bg-[#baccb3] text-[#253423] shadow-lg scale-[1.02]" 
                                       : "bg-[#191a2d] text-[#919097]"
                                   )}
                                 >
                                   Early Detection
                                 </button>
                                 <button 
                                   onClick={() => updateForm("journeyStage", "Advanced Support")}
                                   className={cn(
                                     "h-[72px] rounded-3xl transition-all font-black uppercase text-[9px] tracking-widest",
                                     formData.journeyStage === "Advanced Support" 
                                       ? "bg-[#c8c4db] text-[#2d2a3d] shadow-lg scale-[1.02]" 
                                       : "bg-[#191a2d] text-[#919097]"
                                   )}
                                 >
                                   Advanced Support
                                 </button>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}

                   {currentStep === 2 && (
                     <div className="space-y-10 animate-fade-in-up">
                        <h2 className="text-3xl font-extrabold font-manrope tracking-tighter text-[#e1e0fa]">Identity Structure</h2>
                        <div className="space-y-8">
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d3c4b5] ml-4">Full Biological Name</p>
                              <Input placeholder="Child's Name" className="h-[72px] w-full rounded-3xl bg-[#191a2d] border-none px-8 text-lg font-medium text-[#e1e0fa] shadow-inner focus:ring-2 focus:ring-[#baccb3]/50 transition-all placeholder:text-[#47464c] outline-none" />
                           </div>
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d3c4b5] ml-4">Biological Chronology (Age)</p>
                              <Input placeholder="E.g., 5 Years" className="h-[72px] w-full rounded-3xl bg-[#191a2d] border-none px-8 text-lg font-medium text-[#e1e0fa] shadow-inner focus:ring-2 focus:ring-[#baccb3]/50 transition-all placeholder:text-[#47464c] outline-none" />
                           </div>
                        </div>
                     </div>
                   )}

                   {currentStep === 3 && (
                     <div className="space-y-10 animate-fade-in-up text-center">
                        <div className="h-24 w-24 rounded-full bg-[#3b4b38]/40 border border-[#baccb3]/30 mx-auto flex items-center justify-center relative shadow-[0_0_30px_rgba(186,204,179,0.2)]">
                           <Sparkles className="h-10 w-10 text-[#baccb3]" />
                        </div>
                        <div className="space-y-4">
                          <h2 className="text-3xl font-extrabold font-manrope tracking-tighter text-[#e1e0fa]">Profile Ready</h2>
                          <p className="text-md text-[#c8c5cd] font-medium leading-relaxed italic max-w-sm mx-auto">
                             Your Insighte profile is prepared. Now, enter the Sanctuary to find your matching specialists.
                          </p>
                        </div>
                        <Badge className="bg-[#baccb3]/20 text-[#baccb3] border-none rounded-full px-6 py-2 text-[9px] font-black uppercase tracking-widest mt-4 inline-flex">
                          Verified Identity
                        </Badge>
                     </div>
                   )}

                   <div className="flex flex-col gap-4 pt-10 border-t border-[#47464c]/30 mt-10 relative z-10">
                      <Button 
                         disabled={loading}
                         onClick={() => {
                           if(currentStep < 3) setCurrentStep(prev => prev + 1);
                           else handleComplete();
                         }} 
                         className="h-20 w-full rounded-full bg-[#d3c4b5] text-[#382f24] font-black uppercase tracking-widest text-[11px] hover:shadow-[0_0_30px_rgba(200,196,219,0.3)] hover:bg-[#f0e0d0] active:scale-95 transition-all duration-300"
                      >
                         {loading ? "Securing Entry..." : (currentStep === 3 ? "Go to Sanctuary" : "Initialize Next Phase")} 
                         {!loading && <ArrowRight className="ml-3 h-5 w-5" />}
                      </Button>
                      
                      {currentStep > 1 && (
                        <button 
                           disabled={loading}
                           onClick={() => setCurrentStep(prev => prev - 1)} 
                           className="h-12 w-full text-[#919097] hover:text-[#e1e0fa] font-black uppercase tracking-widest text-[10px] transition-colors"
                        >
                           Previous Cell
                        </button>
                      )}
                   </div>
                </div>
                
                <div className="mt-12 flex items-center justify-center gap-10 opacity-50">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#baccb3]" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#919097]">Clinical Encryption Enabled</span>
                   </div>
                   <div className="h-1 w-1 rounded-full bg-[#47464c]" />
                   <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#c8c4db]" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#919097]">Global Resonance Standard</span>
                   </div>
                </div>
             </div>
          </div>
        </main>
      )}

      {currentStep > 0 && <Footer />}
    </div>
  );
}
