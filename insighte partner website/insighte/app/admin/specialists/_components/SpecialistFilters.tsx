"use client";

import React from "react";
import { Search, Plus, Filter, LayoutGrid, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function SpecialistFilters({ onFilterChange, onAddClick, isAddOpen }: any) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      
      {/* SEARCH & DROPDOWNS BAR */}
      <div className="flex flex-wrap items-center gap-4 flex-1">
        {/* SEARCH BOX */}
        <div className="relative w-full lg:max-w-xs group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-800 group-focus-within:text-white transition-colors" />
            <Input 
                onChange={(e) => onFilterChange((p: any) => ({ ...p, search: e.target.value }))}
                placeholder="Search name or specialty..."
                className="pl-12 bg-[#191a2d] border-white/5 rounded-2xl h-12 text-[11px] font-bold text-white placeholder:text-zinc-800 focus:border-white/20 transition-all shadow-xl"
            />
        </div>

        {/* STATUS */}
        <Select onValueChange={(val) => onFilterChange((p: any) => ({ ...p, status: val }))}>
            <SelectTrigger className="w-[140px] bg-[#191a2d] border-white/5 rounded-2xl h-12 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <SelectValue placeholder="STATUS" />
            </SelectTrigger>
            <SelectContent className="bg-[#191a2d] border-white/10 text-white">
                <SelectItem value="ALL" className="text-[9px] font-black uppercase tracking-widest">All Status</SelectItem>
                <SelectItem value="APPROVED" className="text-[9px] font-black uppercase tracking-widest">Approved</SelectItem>
                <SelectItem value="PENDING" className="text-[9px] font-black uppercase tracking-widest">Pending</SelectItem>
                <SelectItem value="SUSPENDED" className="text-[9px] font-black uppercase tracking-widest">Suspended</SelectItem>
            </SelectContent>
        </Select>

        {/* CATEGORY (Dynamic Hierarchy) */}
        <Select onValueChange={(val) => onFilterChange((p: any) => ({ ...p, category: val }))}>
            <SelectTrigger className="w-[160px] bg-[#191a2d] border-white/5 rounded-2xl h-12 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <SelectValue placeholder="CATEGORY" />
            </SelectTrigger>
            <SelectContent className="bg-[#191a2d] border-white/10 text-white">
                <SelectItem value="ALL" className="text-[9px] font-black uppercase tracking-widest">All Categories</SelectItem>
                <SelectItem value="Therapist" className="text-[9px] font-black uppercase tracking-widest">Therapists</SelectItem>
                <SelectItem value="Educator" className="text-[9px] font-black uppercase tracking-widest">Educators</SelectItem>
                <SelectItem value="Counsellor" className="text-[9px] font-black uppercase tracking-widest">Counsellors</SelectItem>
                <SelectItem value="Instructor" className="text-[9px] font-black uppercase tracking-widest">Instructors (Dance/Swim)</SelectItem>
            </SelectContent>
        </Select>

        {/* LOCATION */}
        <Select>
            <SelectTrigger className="w-[160px] bg-[#191a2d] border-white/5 rounded-2xl h-12 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <SelectValue placeholder="LOCATION" />
            </SelectTrigger>
            <SelectContent className="bg-[#191a2d] border-white/10 text-white">
                <SelectItem value="ALL" className="text-[9px] font-black uppercase tracking-widest">All Locations</SelectItem>
                <SelectItem value="Bangalore" className="text-[9px] font-black uppercase tracking-widest">Bangalore</SelectItem>
                <SelectItem value="Online" className="text-[9px] font-black uppercase tracking-widest">Online</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-4">
        <Button 
            onClick={onAddClick}
            className={cn(
                "h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-3",
                isAddOpen ? "bg-white text-[#111224]" : "bg-[#7c6ff7] text-white hover:scale-105 active:scale-95 shadow-xl shadow-[#7c6ff7]/20"
            )}
        >
            {isAddOpen ? (
                <> <X className="h-4 w-4" /> CLOSE FORM </>
            ) : (
                <> <Plus className="h-4 w-4" /> ADD SPECIALIST </>
            )}
        </Button>
      </div>

    </div>
  );
}
