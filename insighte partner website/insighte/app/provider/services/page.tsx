"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Settings2, 
  Info,
  DollarSign,
  Clock,
  Globe,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Search,
  Filter,
  Trash2,
  Activity,
  Package,
  Layers,
  MapPin,
  Users,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { updateProviderServices, getProviderServices } from "@/lib/actions/provider/core";

export default function ProviderServices() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadHub() {
      const result = await getProviderServices();
      if (result.success) {
        setCatalog(result.catalog || []);
        setSelectedServices(result.selected || []);
        setRegions(result.regions || []);
        setSelectedRegions(result.selectedRegions || []);
      }
      setLoading(false);
    }
    loadHub();
  }, []);

  const toggleService = (program: any) => {
    const isSelected = selectedServices.some(s => s.program_id === program.id);
    if (isSelected) {
      setSelectedServices(prev => prev.filter(s => s.program_id !== program.id));
    } else {
      setSelectedServices(prev => [...prev, {
        program_id: program.id,
        title: program.name,
        price: 1800,
        duration: 60
      }]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProviderServices(selectedServices, selectedRegions);
    if (result.success) {
      toast.success("Services Saved", { description: "Your program settings have been updated." });
    } else {
      toast.error(result.error || "Save failure");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 italic text-zinc-600">
        <Loader2 className="h-10 w-10 animate-spin text-[#BACCB3]" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Services...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* HEADER SECTION */}
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mt-12 mb-16">
        <div className="space-y-4 text-white">
          <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
            My Programs // Setup
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white leading-none">
            Selected <br/> <span className="text-[#BACCB3]">Programs.</span>
          </h1>
        </div>
        
        <div className="flex flex-col gap-4 max-w-sm">
           <div className="relative font-black uppercase tracking-widest text-[10px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
              <input 
                placeholder="SEARCH PROGRAMS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 pl-14 pr-8 rounded-2xl bg-[#111224] border border-white/5 text-white placeholder:text-zinc-800 outline-none w-full shadow-2xl"
              />
           </div>
           <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 leading-relaxed italic">
             Choose the programs you teach. Set your preferred rates and duration.
           </p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 text-white">
        
        {/* LEFT: MASTER CATALOG & REGIONS (8/12) */}
        <div className="xl:col-span-8 space-y-16">
           
           {/* REGION SELECTION */}
           <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <MapPin className="h-5 w-5 text-[#BACCB3]" />
                 <h3 className="text-sm font-black italic uppercase tracking-[0.2em] text-zinc-500">Where you teach</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                 {regions.map(region => (
                    <button 
                      key={region.id}
                      onClick={() => {
                        setSelectedRegions(prev => 
                          prev.includes(region.id) ? prev.filter(r => r !== region.id) : [...prev, region.id]
                        );
                      }}
                      className={cn(
                        "px-8 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all border",
                        selectedRegions.includes(region.id)
                          ? "bg-[#BACCB3] text-[#111224] border-transparent scale-105 shadow-xl"
                          : "bg-[#111224] border-white/5 text-zinc-600 hover:border-white/20"
                      )}
                    >
                       {region.name}
                    </button>
                 ))}
              </div>
           </section>

           {/* SERVICE GRID - GROUPED BY CATEGORY */}
           <section className="space-y-16">
              {[
                { name: 'Academic', type: 'academic', icon: Clock },
                { name: 'Therapy & Clinical', type: 'core_service', icon: Activity },
                { name: 'Training & Courses', type: 'course', icon: GraduationCap },
                { name: 'Support & Community', type: 'support_group', icon: Users }
              ].map((category) => {
                const categoryPrograms = catalog.filter(p => {
                  const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
                  // Map specific types or names to categories if needed
                  if (category.type === 'academic') {
                    return matchesSearch && (p.name.includes('Academic') || p.name.includes('Education') || p.name.includes('Shadow') || p.name.includes('Tutor'));
                  }
                  return matchesSearch && p.type === category.type;
                });

                if (categoryPrograms.length === 0 && searchQuery) return null;

                return (
                  <div key={category.name} className="space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-[#BACCB3]/10 flex items-center justify-center">
                           <category.icon className="h-5 w-5 text-[#BACCB3]" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-[0.2em] text-white underline decoration-[#BACCB3]/30 underline-offset-8">
                           {category.name}.
                        </h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categoryPrograms.map((program) => {
                           const isActive = selectedServices.some(s => s.program_id === program.id);
                           return (
                              <motion.button 
                                key={program.id}
                                onClick={() => toggleService(program)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                  "p-10 rounded-[3rem] border text-left transition-all duration-700 group relative overflow-hidden h-[240px] flex flex-col justify-end",
                                  isActive 
                                      ? "bg-[#BACCB3] border-transparent shadow-2xl" 
                                      : "bg-[#111224]/40 border-white/5 hover:bg-[#111224]/80"
                                )}
                              >
                                 <div className="absolute top-8 right-8">
                                    {isActive ? (
                                      <div className="h-10 w-10 rounded-full bg-[#111224] flex items-center justify-center shadow-lg">
                                        <CheckCircle2 className="h-6 w-6 text-[#BACCB3]" />
                                      </div>
                                    ) : (
                                      <div className="h-10 w-10 rounded-full bg-[#0A0B1A] flex items-center justify-center border border-white/5 group-hover:border-[#BACCB3]/30">
                                        <Plus className="h-4 w-4 text-[#BACCB3]" />
                                      </div>
                                    )}
                                 </div>
                                 
                                 <div className="space-y-4">
                                    <div className="flex gap-2">
                                      {program.tags?.slice(0, 2).map((tag: string) => (
                                        <Badge key={tag} className={cn("rounded-full px-3 py-0.5 text-[7px] font-black uppercase border-none", isActive ? "bg-[#111224]/10 text-[#111224]" : "bg-white/5 text-zinc-500")}>
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                    <h4 className={cn("text-3xl font-black italic uppercase tracking-tighter leading-none", isActive ? "text-[#111224]" : "text-white")}>
                                       {program.name}
                                    </h4>
                                    <p className={cn("text-[10px] font-bold line-clamp-2 italic leading-relaxed", isActive ? "text-[#111224]/60" : "text-zinc-600")}>
                                      {program.description}
                                    </p>
                                 </div>
                              </motion.button>
                           );
                        })}
                     </div>
                  </div>
                );
              })}
           </section>
        </div>

        {/* RIGHT: CONFIGURATION (4/12) */}
        <div className="xl:col-span-4 space-y-10">
           <div className="vessel bg-[#111224] border border-white/5 p-10 rounded-[4rem] space-y-10 shadow-2xl sticky top-32">
              <div className="flex items-center gap-4">
                 <Settings2 className="h-8 w-8 text-[#BACCB3]" />
                 <h3 className="text-2xl font-black italic uppercase text-white tracking-tight">Selected Programs.</h3>
              </div>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 no-scrollbar">
                 <AnimatePresence>
                    {selectedServices.map(service => (
                       <motion.div 
                         key={service.program_id}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="p-8 rounded-[2.5rem] bg-[#1D1E31] border border-white/5 space-y-8 shadow-xl"
                       >
                          <div className="flex justify-between items-start">
                             <h5 className="text-sm font-black italic uppercase text-white tracking-tight leading-none truncate max-w-[200px]">{service.title}</h5>
                             <button onClick={() => toggleService({ id: service.program_id })} className="text-zinc-700 hover:text-red-500 transition-colors">
                                <Trash2 className="h-4 w-4" />
                             </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-[#0d0f1a] rounded-2xl p-4 border border-white/5 space-y-1">
                                <p className="text-[7px] font-black uppercase text-zinc-600 italic">Rate (₹)</p>
                                <div className="flex items-center gap-2">
                                   <DollarSign className="h-3 w-3 text-[#BACCB3]" />
                                   <input 
                                      type="number" 
                                      value={service.price}
                                      onChange={(e) => {
                                        setSelectedServices(prev => prev.map(s => 
                                          s.program_id === service.program_id ? { ...s, price: parseInt(e.target.value) } : s
                                        ));
                                      }}
                                      className="bg-transparent border-none outline-none text-xs font-bold w-full text-white" 
                                   />
                                </div>
                             </div>
                             <div className="bg-[#0d0f1a] rounded-2xl p-4 border border-white/5 space-y-1">
                                <p className="text-[7px] font-black uppercase text-zinc-600 italic">Minutes</p>
                                <div className="flex items-center gap-2">
                                   <Clock className="h-3 w-3 text-[#BACCB3]" />
                                   <input 
                                      type="number" 
                                      value={service.duration}
                                      onChange={(e) => {
                                        setSelectedServices(prev => prev.map(s => 
                                          s.program_id === service.program_id ? { ...s, duration: parseInt(e.target.value) } : s
                                        ));
                                      }}
                                      className="bg-transparent border-none outline-none text-xs font-bold w-full text-white" 
                                   />
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    ))}
                 </AnimatePresence>

                 {selectedServices.length === 0 && (
                    <div className="p-12 border border-dashed border-white/5 rounded-3xl text-center italic text-zinc-700 text-[10px] uppercase font-bold">
                       Select services from catalog
                    </div>
                 )}
              </div>

              <div className="space-y-4 pt-6">
                 <Button 
                   onClick={handleSave}
                   disabled={saving || (selectedServices.length === 0 && selectedRegions.length === 0)}
                   className="w-full h-20 bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-[11px] rounded-3xl hover:bg-white transition-all shadow-xl"
                 >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Programs"}
                 </Button>
                 <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                    <ShieldAlert className="h-4 w-4 text-orange-500 shrink-0" />
                    <p className="text-[8px] font-bold text-zinc-600 uppercase italic leading-tight">Rate variations exceeding 20% of mean will flag for peer audit.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
