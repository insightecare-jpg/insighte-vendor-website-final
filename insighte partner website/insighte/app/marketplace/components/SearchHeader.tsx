"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, X, ChevronDown, Check, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/lib/store/search-store";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICE_GROUPS } from "@/lib/constants";

const CITIES = ["All", "Indiranagar", "HSR Layout", "Koramangala", "Whitefield", "Jayanagar", "JP Nagar", "Mumbai", "Delhi", "Kochi", "Chennai"];

export function SearchHeader() {
  const { query, city, setQuery, setCity, specializations, toggleSpecialization } = useSearchStore();
  const [localQuery, setLocalQuery] = useState(query);
  const [debouncedQuery] = useDebounce(localQuery, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Sync debounced query to store
  useEffect(() => {
    setQuery(debouncedQuery);
  }, [debouncedQuery, setQuery]);

  // Suggested categories based on query
  const suggestions = SERVICE_GROUPS.flatMap(g => g.services)
    .filter(s => s.toLowerCase().includes(localQuery.toLowerCase()))
    .slice(0, 5);

  return (
    <div 
      className="sticky top-0 z-50 w-full bg-[#121321]/80 backdrop-blur-3xl border-b border-white/5 py-4 transition-all duration-500"
      ref={headerRef}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search Input Area */}
        <div className="relative flex-grow group">
          <div className="flex items-center bg-[#1D1E31]/60 border border-white/10 rounded-2xl md:rounded-full px-6 py-2 transition-all group-focus-within:border-[#BACCB3]/50 group-focus-within:ring-4 group-focus-within:ring-[#BACCB3]/5">
            <Search className="h-5 w-5 text-[#C8C4DB] shrink-0" />
            <input
              type="text"
              placeholder="Search by name, specialization, or condition..."
              className="bg-transparent border-none focus:ring-0 text-white placeholder-zinc-600 w-full text-base md:text-lg font-medium h-10 outline-none px-4"
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {localQuery && (
              <button 
                onClick={() => { setLocalQuery(""); setQuery(""); }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-zinc-500" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && localQuery.length > 0 && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 w-full mt-2 bg-[#191A2D] border border-white/10 rounded-3xl overflow-hidden shadow-2xl overflow-y-auto max-h-[300px]"
              >
                <div className="p-4 flex items-center gap-2 border-b border-white/5">
                  <Sparkles className="h-4 w-4 text-[#BACCB3]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Suggested Categories</span>
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="w-full text-left px-6 py-4 hover:bg-white/5 flex items-center justify-between group transition-all"
                    onClick={() => {
                      toggleSpecialization(s);
                      setLocalQuery("");
                      setShowSuggestions(false);
                    }}
                  >
                    <span className="text-zinc-300 group-hover:text-[#BACCB3] font-medium">{s}</span>
                    <ChevronDown className="h-4 w-4 text-zinc-700 -rotate-90" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location Picker */}
        <div className="relative shrink-0">
          <button 
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="flex items-center gap-3 bg-[#1D1E31]/60 border border-white/10 rounded-2xl md:rounded-full px-6 py-3 md:py-2.5 h-12 md:h-auto hover:border-[#D3C4B5]/40 transition-all text-white"
          >
            <MapPin className="h-5 w-5 text-[#D3C4B5]" />
            <span className="font-bold tracking-tight text-sm md:text-base">{city === "All" ? "Select Region" : city}</span>
            <ChevronDown className={cn("h-4 w-4 text-zinc-600 transition-transform", showCityPicker && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showCityPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-full right-0 mt-2 w-64 bg-[#191A2D] border border-white/10 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 p-2"
              >
                {CITIES.map((c) => (
                  <button
                    key={c}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-left",
                      city === c ? "bg-[#D3C4B5] text-[#382F24]" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => {
                      setCity(c);
                      setShowCityPicker(false);
                    }}
                  >
                    <span className="text-sm font-bold">{c === "All" ? "Global Search" : c}</span>
                    {city === c && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Outside Click Handler */}
      {(showSuggestions || showCityPicker) && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => { setShowSuggestions(false); setShowCityPicker(false); }} 
        />
      )}
    </div>
  );
}
