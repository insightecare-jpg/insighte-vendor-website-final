"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbNavProps {
  category: string;
  title: string;
}

export function BreadcrumbNav({ category, title }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-12 animate-fade-in group">
      <Link href="/" className="hover:text-[#D3C4B5] flex items-center gap-2 transition-colors">
        <Home size={12} /> Insighte
      </Link>
      <ChevronRight size={12} className="opacity-30 group-hover:translate-x-1 transition-transform" />
      <Link href="/blog" className="hover:text-[#D3C4B5] flex items-center gap-2 transition-colors">
        <LayoutGrid size={12} /> Wisdom Hub
      </Link>
      <ChevronRight size={12} className="opacity-30 group-hover:translate-x-1 transition-transform" />
      <span className="text-[#BACCB3] opacity-80">{category}</span>
      <ChevronRight size={12} className="opacity-30 group-hover:translate-x-1 transition-transform hidden md:block" />
      <span className="text-zinc-500 truncate max-w-[200px] hidden md:block italic">{title}</span>
    </nav>
  );
}
