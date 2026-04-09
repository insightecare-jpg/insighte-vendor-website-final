"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  ArrowRight,
  Compass,
  Sparkles,
  Zap,
  Target,
  ChevronRight
} from "lucide-react";
import { SearchHeader } from "./components/SearchHeader";
import { FilterBar } from "./components/FilterBar";
import { PartnerGrid } from "./components/PartnerGrid";
import { useSearchStore } from "@/lib/store/search-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function MarketplaceClient({ 
  initialProviders, 
  initialCurations,
  initialQuery, 
  initialCategory, 
  initialSort,
  initialLocation
}: { 
  initialProviders: any[], 
  initialCurations: any[],
  initialQuery: string, 
  initialCategory: string, 
  initialSort: string,
  initialLocation: string
}) {
  const { discoveryMode, setDiscoveryMode, query, specializations } = useSearchStore();

  // Filter pathways based on query and some simple logic for now
  const filteredCurations = useMemo(() => {
    return initialCurations.filter(c => {
      const matchesQuery = !query || 
        c.title?.toLowerCase().includes(query.toLowerCase()) || 
        c.description?.toLowerCase().includes(query.toLowerCase()) ||
        c.category?.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = specializations.length === 0 || 
        specializations.some(spec => c.category?.toLowerCase().includes(spec.toLowerCase()));

      return matchesQuery && matchesCategory;
    });
  }, [initialCurations, query, specializations]);

  return (
    <div className="marketplace-discovery w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search & Global Controls */}
      <div className="space-y-6">
        <SearchHeader />
        <FilterBar />

        {/* Discovery Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit backdrop-blur-md">
            <button 
              onClick={() => setDiscoveryMode("specialists")}
              className={cn(
                "group relative h-11 px-8 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                discoveryMode === "specialists" ? "bg-[#D3C4B5] text-[#382F24] shadow-xl" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Target className={cn("h-3.5 w-3.5 transition-transform", discoveryMode === "specialists" && "scale-110")} />
                Specialists
              </div>
            </button>
            <button 
              onClick={() => setDiscoveryMode("pathways")}
              className={cn(
                "group relative h-11 px-8 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                discoveryMode === "pathways" ? "bg-[#BACCB3] text-[#2A3326] shadow-xl" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Compass className={cn("h-3.5 w-3.5 transition-transform", discoveryMode === "pathways" && "scale-110")} />
                Pathways
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {discoveryMode === "pathways" ? (
          <motion.div 
            key="pathways"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {filteredCurations.length > 0 ? (
                filteredCurations.map((curation, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={curation.id} 
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#BACCB3]/10 to-transparent rounded-[2.5rem] -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="h-full vessel bg-zinc-900/40 backdrop-blur-xl p-8 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col justify-between hover:border-[#BACCB3]/30 transition-all duration-500 shadow-2xl">
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-[#BACCB3]/10 text-[#BACCB3] border-[#BACCB3]/20 font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">
                                {curation.category || 'Pathways'}
                              </Badge>
                              <Badge variant="outline" className="bg-white/5 text-zinc-400 border-white/5 font-bold text-[9px] uppercase tracking-[0.2em] px-2 py-0.5">
                                Curated
                              </Badge>
                            </div>
                            <h3 className="text-3xl font-black font-manrope tracking-tighter italic uppercase text-white group-hover:text-[#BACCB3] transition-colors">
                              {curation.title}
                            </h3>
                          </div>
                          <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                            <Sparkles className="h-6 w-6 text-[#BACCB3]/30" />
                          </div>
                        </div>
                        
                        <p className="text-sm text-zinc-500 leading-relaxed italic line-clamp-3">
                          {curation.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-1">Focus</div>
                            <div className="text-xs font-bold text-zinc-300">Targeted Sessions</div>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="text-[10px] uppercase tracking-widest font-black text-zinc-600 mb-1">Duration</div>
                            <div className="text-xs font-bold text-zinc-300">4-6 Weeks</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-widest font-black text-zinc-600">Investment</span>
                          <div className="text-2xl font-black font-manrope tracking-tighter text-white">₹{curation.price}</div>
                        </div>
                        <Link href={`/checkout/curation/${curation.id}`}>
                          <Button className="h-14 px-12 rounded-full bg-[#BACCB3] text-[#2A3326] font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-glow shadow-[#BACCB3]/20 flex items-center gap-2">
                            Unlock Pathway
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center space-y-6">
                  <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5 animate-pulse">
                    <Compass className="h-10 w-10 text-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-xs">No matching pathways in current sequence</p>
                    <p className="text-zinc-700 text-sm">Try adjusting your spectral filters or specialization tags</p>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-[#BACCB3] font-black uppercase tracking-widest text-[10px]"
                    onClick={() => useSearchStore.getState().reset()}
                  >
                    Reset Sequence
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="specialists"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PartnerGrid initialProviders={initialProviders} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
