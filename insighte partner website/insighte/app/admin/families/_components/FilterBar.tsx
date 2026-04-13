"use client";

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function FilterBar({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [activeFilters, setActiveFilters] = React.useState<any>({});

  const handleClear = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const updateFilter = (key: string, value: string) => {
     const newFilters = { ...activeFilters, [key]: value };
     if (!value || value === 'all') delete newFilters[key];
     setActiveFilters(newFilters);
     onFilterChange(newFilters);
  };

  const hasFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3 bg-[#191a2d]/40 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input 
          placeholder="Search name, child, email..." 
          className="h-10 pl-10 bg-white/5 border-none rounded-xl text-xs font-medium focus:ring-1 ring-[#baccb3]/50"
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>

      <Select onValueChange={(val) => updateFilter('service', val)}>
        <SelectTrigger className="w-[180px] h-10 bg-white/5 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-[#c8c5cd]">
          <SelectValue placeholder="SERVICE" />
        </SelectTrigger>
        <SelectContent className="bg-[#191a2d] border-white/5">
          <SelectItem value="all">All Services</SelectItem>
          {/* Mapping programs here later */}
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => updateFilter('specialist', val)}>
        <SelectTrigger className="w-[180px] h-10 bg-white/5 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-[#c8c5cd]">
          <SelectValue placeholder="SPECIALIST" />
        </SelectTrigger>
        <SelectContent className="bg-[#191a2d] border-white/5">
           <SelectItem value="all">All Specialists</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => updateFilter('status', val)}>
        <SelectTrigger className="w-[180px] h-10 bg-white/5 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-[#c8c5cd]">
          <SelectValue placeholder="SESSION STATUS" />
        </SelectTrigger>
        <SelectContent className="bg-[#191a2d] border-white/5">
           <SelectItem value="all">All Status</SelectItem>
           <SelectItem value="upcoming">Upcoming</SelectItem>
           <SelectItem value="none">No Sessions</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button 
            variant="ghost" 
            onClick={handleClear}
            className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-[#baccb3] hover:text-white"
        >
          <X className="h-3 w-3 mr-2" /> Clear Filters
        </Button>
      )}
    </div>
  );
}
