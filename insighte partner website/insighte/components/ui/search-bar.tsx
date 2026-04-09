"use client";

import React, { useState } from "react";
import { Search, MapPin, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  variant?: "hero" | "nav";
  onSearch?: (query: string, location?: string) => void;
  currentLocation?: string; // Add this prop
}

export function SearchBar({ className, variant = "hero", onSearch, currentLocation }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const city = currentLocation || "All";
    if (onSearch) {
      onSearch(query, city);
    } else {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (city && city !== "All") params.append("city", city);
      router.push(`/specialists?${params.toString()}`);
    }
  };

  if (variant === "nav") {
    return (
      <form 
        onSubmit={handleSearch}
        className={cn(
          "relative flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 transition-all duration-500",
          isFocused ? "bg-white/10 border-[#d3c4b5]/30 ring-1 ring-[#d3c4b5]/20 shadow-[0_0_20px_rgba(211,196,181,0.1)]" : "hover:bg-white/8",
          className
        )}
      >
        <Search className="w-4 h-4 text-[#d3c4b5] mr-3 opacity-60" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-transparent border-none outline-none text-[13px] font-bold text-white placeholder:text-white/20 w-32 md:w-56 transition-all font-manrope uppercase tracking-widest"
        />
        {query && (
          <button 
            type="button" 
            onClick={() => setQuery("")}
            className="ml-2 p-1 rounded-full hover:bg-white/10 text-white/40 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>
    );
  }

  return (
    <div className={cn("w-full max-w-3xl mx-auto", className)}>
      <form 
        onSubmit={handleSearch}
        className={cn(
          "group relative flex flex-col md:flex-row items-stretch p-2 bg-[#1d1e31]/60 backdrop-blur-3xl border border-white/10 rounded-[40px] transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]",
          isFocused ? "border-[#d3c4b5]/40 ring-1 ring-[#d3c4b5]/30 shadow-[0_0_50px_rgba(211,196,181,0.1)]" : "hover:border-white/20"
        )}
      >
        {/* Search Field */}
        <div className="flex-[1.5] flex items-center px-6 py-4 md:py-0">
          <Search className="w-5 h-5 text-[#baccb3] mr-4 shrink-0 transition-transform group-hover:scale-110" />
          <input
            type="text"
            placeholder="Search specialties, autism, speech therapist..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-[#919097] font-bold font-manrope text-lg py-2"
          />
        </div>

        {/* Cinematic Divider */}
        <div className="hidden md:block w-px h-10 self-center bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* Location Display/Picker */}
        <div className="flex-1 flex items-center px-6 py-4 md:py-0 relative group/loc border-l border-white/5">
          <MapPin className="w-5 h-5 text-[#d3c4b5] mr-3 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Location</span>
            <span className="text-white font-black font-manrope text-sm uppercase tracking-widest">
              {currentLocation || "Everywhere / Online"}
            </span>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-[#d3c4b5] text-[#382f24] px-10 py-5 rounded-[30px] font-black font-manrope text-sm uppercase tracking-[0.2em] hover:bg-white transition-all active:scale-[0.96] shadow-2xl flex items-center justify-center gap-3"
        >
          Explore
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
