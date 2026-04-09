"use client";

import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { X, Check, Target, Users, Zap, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/lib/store/search-store";
import { SERVICE_GROUPS, AGE_GROUPS } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const CARE_MODES = ["Clinic", "Home", "Online"];

export function FilterDrawer({ children }: { children: React.ReactNode }) {
  const { 
    specializations, 
    toggleSpecialization, 
    careModes, 
    toggleCareMode, 
    targetAges, 
    toggleTargetAge,
    reset 
  } = useSearchStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-[#121321] border-white/5 rounded-none md:rounded-[3rem] p-0 overflow-hidden shadow-2xl h-full md:h-[90vh] flex flex-col transition-all duration-700 animate-in fade-in slide-in-from-bottom-20 zoom-in-95">
        
        {/* Header - Fixed */}
        <div className="p-8 md:p-12 pb-6 flex items-start justify-between bg-[#191A2D]/40 backdrop-blur-3xl shrink-0">
          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold font-manrope tracking-tighter text-white italic">Protocol <span className="text-[#BACCB3]">Refining</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Configure Your Specialized Sequence</p>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="group rounded-full h-12 w-12 bg-white/5 hover:bg-white transition-all duration-500">
               <X className="h-5 w-5 text-zinc-500 group-hover:text-black" />
            </Button>
          </DialogClose>
        </div>

        {/* Content - Scrollable */}
        <ScrollArea className="flex-grow px-8 md:px-12 pb-12">
          <div className="space-y-16 py-8">
            
            {/* Specializations Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                 <Target className="h-4 w-4 text-[#D3C4B5]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D3C4B5] italic">Clinical Specializations</span>
                 <Separator className="flex-1 bg-white/5" />
              </div>
              
              <div className="grid grid-cols-1 gap-12">
                {SERVICE_GROUPS.map((group) => (
                  <div key={group.name} className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="text-xl font-black font-manrope text-white uppercase italic">{group.name}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.services.map((service) => (
                        <button
                          key={service}
                          onClick={() => toggleSpecialization(service)}
                          className={cn(
                            "group px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-3",
                            specializations.includes(service)
                              ? "bg-[#D3C4B5] text-[#382F24] border-transparent shadow-glow shadow-[#D3C4B5]/10"
                              : "bg-white/5 text-zinc-500 border-white/5 hover:border-[#D3C4B5]/40 hover:text-white"
                          )}
                        >
                          {service}
                          {specializations.includes(service) && <Check className="h-3 w-3" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Care Modes Section */}
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                 <Zap className="h-4 w-4 text-[#C8C4DB]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C8C4DB] italic">Resistance Management (Care Mode)</span>
                 <Separator className="flex-1 bg-white/5" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                 {CARE_MODES.map((mode) => (
                   <button 
                     key={mode}
                     onClick={() => toggleCareMode(mode)}
                     className={cn(
                        "group h-24 rounded-[2rem] border transition-all duration-500 flex flex-col items-center justify-center gap-2",
                        careModes.includes(mode)
                          ? "bg-[#C8C4DB] text-[#252331] border-transparent shadow-xl"
                          : "bg-white/5 border-white/5 text-zinc-600 hover:border-[#C8C4DB]/30 hover:text-white"
                     )}
                   >
                     <span className="text-[10px] font-black uppercase tracking-widest">{mode}</span>
                     <Sparkles className={cn("h-4 w-4 transition-all duration-700", careModes.includes(mode) ? "opacity-100 scale-110" : "opacity-0 scale-0")} />
                   </button>
                 ))}
              </div>
            </div>

            {/* Age Groups Section */}
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                 <Users className="h-4 w-4 text-[#BACCB3]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BACCB3] italic">Developmental Age Alignment</span>
                 <Separator className="flex-1 bg-white/5" />
              </div>

              <div className="flex flex-wrap gap-3">
                 {AGE_GROUPS.map((age) => (
                   <button 
                     key={age}
                     onClick={() => toggleTargetAge(age)}
                     className={cn(
                        "px-6 h-14 rounded-full border transition-all duration-300 flex items-center justify-between gap-6",
                        targetAges.includes(age)
                          ? "bg-[#BACCB3] text-[#2A3326] border-transparent shadow-xl pr-4"
                          : "bg-white/5 border-white/5 text-zinc-600 hover:text-white"
                     )}
                   >
                     <span className="text-[10px] font-black uppercase tracking-widest">{age}</span>
                     {targetAges.includes(age) && (
                       <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center"><Check className="h-4 w-4" /></div>
                     )}
                   </button>
                 ))}
              </div>
            </div>

          </div>
        </ScrollArea>

        {/* Footer - Fixed */}
        <div className="p-8 md:p-12 border-t border-white/5 bg-[#121321] shrink-0 flex items-center gap-6">
           <Button 
             variant="ghost" 
             onClick={reset}
             className="h-16 px-10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-all"
           >
              Reset Protocol
           </Button>
           <DialogClose asChild>
             <Button className="flex-1 h-16 rounded-full bg-[#BACCB3] text-[#2A3326] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-glow shadow-[#BACCB3]/10">
                Establish Configuration
             </Button>
           </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
