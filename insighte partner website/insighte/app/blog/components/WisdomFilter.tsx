"use client";

import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

interface WisdomFilterProps {
  currentView: "all" | "parents" | "professionals";
  onViewChange: (view: "all" | "parents" | "professionals") => void;
}

export function WisdomFilter({ currentView, onViewChange }: WisdomFilterProps) {
  return (
    <Tabs.Root 
      value={currentView} 
      onValueChange={(v) => onViewChange(v as any)}
      className="flex flex-col items-center w-full md:w-auto"
    >
      <Tabs.List className="flex bg-white/5 p-1.5 rounded-[32px] border border-white/10 shadow-2xl backdrop-blur-3xl overflow-x-auto no-scrollbar max-w-full">
        {[
          { id: 'all', label: 'Entire Hub', color: '#D3C4B5' },
          { id: 'parents', label: 'Parent Sanctuary', color: '#4FD1C5' },
          { id: 'professionals', label: 'Clinical Pro-Series', color: '#FF6B6B' },
        ].map((tab) => (
          <Tabs.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "px-8 py-4 rounded-[28px] text-[10px] font-black uppercase tracking-[0.25em] transition-all whitespace-nowrap flex items-center gap-3 group relative overflow-hidden",
              currentView === tab.id 
                ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.2)]" 
                : "text-white/40 hover:text-white"
            )}
          >
            {currentView === tab.id && (
              <div 
                className="absolute inset-0 opacity-10 animate-pulse pointer-events-none"
                style={{ backgroundColor: tab.color }} 
              />
            )}
            <div className={cn("w-1.5 h-1.5 rounded-full", currentView === tab.id ? "bg-black" : "opacity-40")} style={{ backgroundColor: currentView === tab.id ? 'black' : tab.color }} />
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
