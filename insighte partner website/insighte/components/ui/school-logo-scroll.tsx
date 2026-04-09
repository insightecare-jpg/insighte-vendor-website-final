"use client";

import React from "react";

const SCHOOLS = [
  "The Valley School",
  "Inventure Academy",
  "Mallya Aditi International",
  "Indus International School",
  "Greenwood High",
  "Canadian International",
  "Stonehill International",
  "The International School Bangalore",
  "Aditi Mallya School",
  "Vidyashilp Academy",
  "Bishop Cotton Boys",
  "Baldwin Girls School"
];

export function SchoolLogoScroll() {
  return (
    <section className="py-24 overflow-hidden border-y border-white/5 bg-[#111224] relative">
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#111224] to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#111224] to-transparent z-10"></div>

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Trusted by families in Bangalore's leading institutions</h3>
      </div>

      <div className="flex animate-scroll-infinite-fast">
        {/* Double the array for seamless scroll */}
        {[...SCHOOLS, ...SCHOOLS].map((school, i) => (
          <div 
            key={`${school}-${i}`}
            className="flex items-center gap-4 mx-12 md:mx-20 whitespace-nowrap group"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-[#d3c4b5]/10 group-hover:border-[#d3c4b5]/30 transition-all duration-700">
              <span className="text-white text-[10px] font-black italic">{school.charAt(0)}</span>
            </div>
            <span className="text-xl md:text-2xl font-manrope font-extrabold tracking-tighter text-zinc-700 group-hover:text-[#f0e0d0] transition-colors duration-700 uppercase italic">
              {school}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
