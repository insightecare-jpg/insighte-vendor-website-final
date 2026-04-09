"use client";

import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchStore } from "@/lib/store/search-store";
import { fetchSearchPartners } from "@/lib/api/marketplace";
import { PartnerCard } from "./PartnerCard";
import { Filter, Sparkles, Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface PartnerGridProps {
  initialProviders?: any[];
}

export function PartnerGrid({ initialProviders = [] }: PartnerGridProps) {
  const { query, specializations, careModes, targetAges, city, reset } = useSearchStore();
  const observerRef = useRef<HTMLDivElement>(null);

  // Construct initialData structure for useInfiniteQuery
  const initialInfiniteData = initialProviders.length > 0 ? {
    pages: [{
      partners: initialProviders,
      totalCount: initialProviders.length, // Approximation or pass totalCount
      nextPage: initialProviders.length === 12 ? 1 : undefined // Assume if full page, there might be more
    }],
    pageParams: [0],
  } : undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch
  } = useInfiniteQuery({
    queryKey: ['partners', query, specializations, careModes, targetAges, city],
    queryFn: ({ pageParam = 0 }) => 
      fetchSearchPartners({
        searchTerm: query,
        selectedSpecs: specializations,
        selectedModes: careModes,
        selectedAges: targetAges,
        targetCity: city,
        page: pageParam,
        pageSize: 12
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    initialData: initialInfiniteData,
  });

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading && !initialInfiniteData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[400px] rounded-[3rem] bg-white/5 border border-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-32 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
           <SearchX className="h-10 w-10 text-red-500/40" />
        </div>
        <h3 className="text-2xl font-black font-manrope text-white uppercase italic">Protocol Interrupted</h3>
        <p className="text-zinc-500 italic max-w-sm mx-auto">The clinical search sequence encountered an error. Attempt re-initialization.</p>
        <Button onClick={() => refetch()} className="h-14 px-10 rounded-full bg-white/5 text-zinc-500 hover:text-white border border-white/10">
           Retry Sequence
        </Button>
      </div>
    );
  }

  const partners = data?.pages.flatMap((page) => page.partners) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  if (partners.length === 0) {
    return (
      <div className="py-32 text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="h-32 w-32 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center mx-auto mb-10 opacity-30 group relative">
           <div className="absolute inset-0 bg-[#D3C4B5]/5 rounded-full animate-ping" />
           <Filter className="h-12 w-12 text-zinc-700" />
        </div>
        <div className="space-y-4">
          <h3 className="text-4xl font-extrabold font-manrope tracking-tighter text-zinc-600 uppercase italic">No Matches Found</h3>
          <p className="text-lg text-zinc-700 italic max-w-md mx-auto leading-relaxed">
            The clinical resonance mapping failed to find a match for your current constraints. Adjust your refinement parameters.
          </p>
        </div>
        <Button 
           onClick={reset}
           className="h-16 px-12 rounded-full bg-[#D3C4B5] text-[#382F24] font-black tracking-widest uppercase text-xs hover:bg-white transition-all shadow-glow shadow-[#D3C4B5]/10"
        >
           Clear All Protocols
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-10">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#BACCB3]/10 flex items-center justify-center border border-[#BACCB3]/20">
               <Sparkles className="h-5 w-5 text-[#BACCB3]" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Active Search</p>
               <h2 className="text-2xl font-black font-manrope text-white uppercase italic">{totalCount} Verified Specialists</h2>
            </div>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {partners.map((partner, idx) => (
            <motion.div
              key={partner.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: idx < 6 ? idx * 0.05 : 0 }}
            >
              <PartnerCard partner={partner} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Infinite Scroll Trigger */}
      {hasNextPage && (
        <div ref={observerRef} className="h-32 flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-4 p-6 rounded-full bg-white/5 border border-white/5">
               <Loader2 className="h-5 w-5 text-[#BACCB3] animate-spin" />
               <span className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-400">Expanding Sequence...</span>
            </div>
          )}
        </div>
      )}

      {!hasNextPage && partners.length > 0 && (
        <div className="py-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-800 italic">End of Clinical Sequence</p>
        </div>
      )}
    </div>
  );
}
