"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Calendar, Clock, Link as LinkIcon } from "lucide-react";

export default function IdentitySection({ specialist }: { specialist: any }) {
  return (
    <div className="bg-[#191a2d]/60 rounded-[3rem] border border-white/5 p-12 space-y-12 shadow-3xl">
      <div className="flex items-center gap-3">
        <div className="h-1.5 w-1.5 rounded-full bg-[#7c6ff7]" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">SECTION 01 // IDENTITY & INSTITUTIONAL TIERING</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* AVATAR + BASIC INFO */}
        <div className="lg:col-span-4 space-y-8">
            <div className="relative h-48 w-48 rounded-[3rem] bg-[#0d0f1a] border border-white/5 flex items-center justify-center font-black text-6xl text-zinc-700 mx-auto lg:mx-0 overflow-hidden group">
                {specialist.avatar_url ? (
                    <img src={specialist.avatar_url} className="h-full w-full object-cover" />
                ) : (
                    <span>{specialist.name?.[0]}</span>
                )}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-[10px] font-black uppercase text-white">Upload New</span>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="flex items-center gap-4 text-zinc-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-bold italic">Joined {new Date(specialist.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-bold italic">Last Active: Recently</span>
                </div>
                <div className="flex items-center gap-4 text-[#7c6ff7] cursor-pointer hover:underline">
                    <LinkIcon className="h-4 w-4" />
                    <span className="text-xs font-bold italic truncate flex-1">insighte.care/specialists/{specialist.id}</span>
                </div>
            </div>
        </div>

        {/* EDITABLE FIELDS */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Full Legal Name</label>
                <Input defaultValue={specialist.name} className="bg-[#111224] border-white/5 rounded-2xl h-14 text-sm font-bold text-white px-6" />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Clinical Tiering</label>
                <div className="h-14 bg-[#111224] rounded-2xl flex items-center px-6 border border-white/5">
                    <span className="text-xs font-black italic uppercase text-white">{specialist.tier || 'PARTNER'}</span>
                </div>
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Primary Clinical Location</label>
                <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                    <Input defaultValue={specialist.city} className="pl-14 bg-[#111224] border-white/5 rounded-2xl h-14 text-sm font-bold text-white" />
                </div>
            </div>
            <div className="space-y-2 md:col-span-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Professional Clinical Biography</label>
                <Textarea 
                    defaultValue={specialist.bio} 
                    className="bg-[#111224] border-white/5 rounded-[2rem] min-h-[160px] p-8 text-sm font-bold text-[#c8c5cd] leading-relaxed resize-none" 
                />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Years Experience</label>
                <Input defaultValue={specialist.experience_years || '8'} className="bg-[#111224] border-white/5 rounded-2xl h-14 text-sm font-bold text-white px-6" />
            </div>
            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-1">Licensed Languages</label>
                <div className="flex flex-wrap gap-2 pt-2">
                    {['English', 'Hindi', 'Kannada'].map(l => (
                        <Badge key={l} className="bg-white/5 text-zinc-500 border-none rounded-lg px-3 py-1 text-[9px] font-bold uppercase">{l}</Badge>
                    ))}
                    <Badge className="bg-[#7c6ff7]/10 text-[#7c6ff7] border-none rounded-lg px-3 py-1 text-[9px] font-bold uppercase italic cursor-pointer">+ Add</Badge>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
