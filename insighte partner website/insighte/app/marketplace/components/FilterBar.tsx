"use client";

import React from "react";
import { SlidersHorizontal, X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/lib/store/search-store";
import { motion, AnimatePresence } from "framer-motion";
import { FilterDrawer } from "./FilterDrawer";

export function FilterBar() {
  const { 
    specializations, 
    careModes, 
    targetAges, 
    toggleSpecialization, 
    toggleCareMode, 
    toggleTargetAge,
    reset
  } = useSearchStore();

  const activeFiltersCount = specializations.length + careModes.length + targetAges.length;

  return (
    <div className="w-full py-4 border-b border-white/5 bg-[#121321]/40 backdrop-blur-3xl overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-3">
        {/* Main Filter Trigger */}
        <FilterDrawer>
          <Button 
            variant="outline" 
            className="flex-shrink-0 h-10 px-6 rounded-full bg-white/5 border-white/10 text-white hover:bg-white hover:text-black transition-all gap-2 group"
          >
            <SlidersHorizontal className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Protocol Refining</span>
            {activeFiltersCount > 0 && (
              <Badge className="bg-[#BACCB3] text-[#2A3326] border-none ml-1 h-5 w-5 flex items-center justify-center p-0 rounded-full font-black text-[9px]">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </FilterDrawer>

        <div className="h-6 w-[1px] bg-white/10 mx-2 flex-shrink-0" />

        {/* Dynamic Chips Area */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pr-10">
          <AnimatePresence mode="popLayout">
            {/* Specializations */}
            {specializations.map((spec) => (
              <motion.div
                key={`spec-${spec}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div 
                  className="flex items-center gap-2 px-4 h-9 rounded-xl bg-[#D3C4B5]/10 border border-[#D3C4B5]/20 text-[#D3C4B5] transition-all hover:bg-[#D3C4B5] hover:text-[#382F24] cursor-pointer group"
                  onClick={() => toggleSpecialization(spec)}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{spec}</span>
                  <X className="h-3 w-3 text-[#D3C4B5]/40 group-hover:text-[#382F24]" />
                </div>
              </motion.div>
            ))}

            {/* Care Modes */}
            {careModes.map((mode) => (
              <motion.div
                key={`mode-${mode}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div 
                  className="flex items-center gap-2 px-4 h-9 rounded-xl bg-[#C8C4DB]/10 border border-[#C8C4DB]/20 text-[#C8C4DB] transition-all hover:bg-[#C8C4DB] hover:text-[#252331] cursor-pointer group"
                  onClick={() => toggleCareMode(mode)}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{mode}</span>
                  <X className="h-3 w-3 text-[#C8C4DB]/40 group-hover:text-[#252331]" />
                </div>
              </motion.div>
            ))}

            {/* Age Groups */}
            {targetAges.map((age) => (
              <motion.div
                key={`age-${age}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div 
                  className="flex items-center gap-2 px-4 h-9 rounded-xl bg-[#BACCB3]/10 border border-[#BACCB3]/20 text-[#BACCB3] transition-all hover:bg-[#BACCB3] hover:text-[#2A3326] cursor-pointer group"
                  onClick={() => toggleTargetAge(age)}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{age}</span>
                  <X className="h-3 w-3 text-[#BACCB3]/40 group-hover:text-[#2A3326]" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {activeFiltersCount > 0 && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={reset}
              className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors pl-4 shrink-0"
            >
              Reset Protocol
            </motion.button>
          )}

          {activeFiltersCount === 0 && (
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 italic ml-4 whitespace-nowrap">
              No filters active in current sequence
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
