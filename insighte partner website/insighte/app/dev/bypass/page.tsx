"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Users, Briefcase, Zap } from 'lucide-react';

/**
 * INSIGHTE DEV BYPASS HUB
 * Allows instant login for E2E testing without external auth dependencies.
 */

export default function DevBypass() {
  const setBypass = (role: string) => {
    document.cookie = `insighte-dev-role=${role}; path=/; max-age=3600`;
    alert(`Bypass Active: Authenticated as ${role.toUpperCase()}. Redirecting...`);
    
    if (role === 'ADMIN') window.location.href = '/admin/dashboard';
    else if (role === 'PROVIDER') window.location.href = '/provider/dashboard';
    else window.location.href = '/parent/dashboard';
  };

  const clearBypass = () => {
    document.cookie = `insighte-dev-role=; path=/; max-age=0`;
    alert("Bypass Cleared.");
  };

  return (
    <div className="min-h-screen bg-[#111224] flex items-center justify-center p-8">
      <div className="vessel bg-[#1D1E31] p-16 rounded-[4rem] border border-white/10 space-y-12 max-w-2xl w-full text-center">
        <div className="space-y-4">
           <div className="h-20 w-20 bg-[#BACCB3]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-10 w-10 text-[#BACCB3]" />
           </div>
           <h1 className="text-5xl font-black italic uppercase italic tracking-tighter text-white">Bypass <br/><span className="text-[#D3C4B5]">Sanctuary.</span></h1>
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Development // Registry Override</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
           <Button onClick={() => setBypass('ADMIN')} className="h-20 rounded-[2rem] bg-white text-[#111224] font-black uppercase tracking-widest text-xs flex justify-between px-10 group">
              <span>Admin Protocol</span>
              <Shield className="h-6 w-6 group-hover:scale-110 transition-transform" />
           </Button>
           <Button onClick={() => setBypass('PROVIDER')} className="h-20 rounded-[2rem] bg-[#BACCB3] text-[#111224] font-black uppercase tracking-widest text-xs flex justify-between px-10 group">
              <span>Specialist Sync</span>
              <Briefcase className="h-6 w-6 group-hover:scale-110 transition-transform" />
           </Button>
           <Button onClick={() => setBypass('PARENT')} className="h-20 rounded-[2rem] bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-xs flex justify-between px-10 group">
              <span>Family Pulse</span>
              <Users className="h-6 w-6 group-hover:scale-110 transition-transform" />
           </Button>
        </div>

        <button onClick={clearBypass} className="text-zinc-700 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">
           Flush All Overrides
        </button>
      </div>
    </div>
  );
}
