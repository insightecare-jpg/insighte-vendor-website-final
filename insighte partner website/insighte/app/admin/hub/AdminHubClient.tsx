"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  slug: string;
  title_en: string;
  category: string;
  status: "draft" | "published";
  created_at: string;
  author?: { name: string };
  is_professional: boolean;
}

export default function AdminHubClient({ initialPosts }: { initialPosts: Post[] }) {
  const [query, setQuery] = useState("");
  
  const filtered = initialPosts.filter(p => 
    p.title_en.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Structural Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-12 border-b-2 border-dashed border-white/5">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#BACCB3] animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#BACCB3]">Clinical Documentation Suite</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-manrope font-extrabold text-white tracking-tighter uppercase italic leading-none">
             Wisdom <br /> <span className="text-zinc-800">Curation</span>
           </h1>
        </div>
        
        <Link href="/admin/hub/write">
           <button className="h-16 px-10 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[11px] flex items-center gap-4 hover:shadow-[0_0_50px_rgba(211,196,181,0.3)] transition-all active:scale-95">
             <Plus size={18} strokeWidth={3} /> Initiate Research Sequence
           </button>
        </Link>
      </div>

      {/* Control Bar - High Functional Density */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-4 bg-[#111224]/50 backdrop-blur-3xl rounded-[40px] border border-white/5">
        <div className="relative w-full md:w-[400px] h-14 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5 group-focus-within:text-[#D3C4B5] transition-colors" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter documented insights..." 
            className="w-full h-full bg-[#191a2d] rounded-full pl-16 pr-8 text-[10px] font-black uppercase tracking-[0.2em] outline-none border border-white/5 focus:ring-2 focus:ring-[#D3C4B5]/30 transition-all placeholder:text-zinc-800"
          />
        </div>
        
        <div className="flex items-center gap-4">
           <div className="h-14 px-8 rounded-full border border-white/5 flex items-center gap-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
              <Filter size={14} /> Sequence: Newest
           </div>
           <div className="h-14 w-14 rounded-full border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white transition-colors cursor-pointer">
              <MoreVertical size={20} />
           </div>
        </div>
      </div>

      {/* High-Density Sanctuary Table */}
      <div className="vessel border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#191a2d]/80 border-b border-white/5">
              <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Document Protocol</th>
              <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Tier</th>
              <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Status</th>
              <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Published Sequence</th>
              <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(post => (
              <tr key={post.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-10 py-8 max-w-[400px]">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-white/5 flex-shrink-0 flex items-center justify-center text-zinc-700 text-xs font-black italic shadow-inner">
                       {post.category.charAt(0)}
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-lg font-manrope font-bold text-white group-hover:text-[#D3C4B5] transition-colors uppercase italic truncate">{post.title_en}</h3>
                       <div className="flex items-center gap-3 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                          <Eye size={10} /> 1.2k Reads • Author: {post.author?.name || 'Hive'}
                       </div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <Badge className={cn(
                    "bg-white/5 border-none rounded-full px-6 py-1 text-[9px] font-black uppercase tracking-widest",
                    post.is_professional ? "text-[#C8C4DB] bg-[#C8C4DB]/10" : "text-[#BACCB3] bg-[#BACCB3]/10"
                  )}>
                    {post.is_professional ? 'Professional' : 'Parent'}
                  </Badge>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor]",
                      post.status === 'published' ? "bg-[#BACCB3]" : "bg-orange-400"
                    )} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      {post.status}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">
                    <Clock size={12} /> {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-10 py-8 text-right">
                   <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/hub/write/${post.id}`}>
                        <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                          <Edit3 size={16} />
                        </button>
                      </Link>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-[#D3C4B5] transition-colors">
                          <ExternalLink size={16} />
                        </button>
                      </Link>
                      <button className="h-10 w-10 rounded-full bg-red-400/5 flex items-center justify-center text-red-400/40 hover:text-red-400 transition-colors">
                        <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="py-20 text-center space-y-6">
             <div className="h-24 w-24 rounded-full border-2 border-dashed border-white/5 flex items-center justify-center mx-auto opacity-10">
                <Search size={32} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-800 italic">No clinical protocols found matching the sequence</p>
          </div>
        )}
      </div>
      
      {/* Structural Footer */}
      <div className="pt-12 flex justify-between items-center text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">
         <div>Protocol v2.1.0 (Clinical Stabilized)</div>
         <div className="flex items-center gap-6">
            <span className="text-[#BACCB3]">Status: Synchronized</span>
            <span className="animate-pulse">Live</span>
         </div>
      </div>
    </div>
  );
}
