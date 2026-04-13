"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  ShieldCheck, 
  Briefcase,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function DevBypassPage() {
  const setBypass = (role: string) => {
    // Set cookie that middleware reads
    document.cookie = `insighte-dev-role=${role}; path=/; max-age=3600; SameSite=Lax`;
    
    // Redirect to relevant dashboard
    if (role === 'ADMIN') window.location.href = '/admin/dashboard';
    else if (role === 'PROVIDER' || role === 'expert') window.location.href = '/provider/dashboard';
    else window.location.href = '/parent/dashboard';
  };

  const clearBypass = () => {
    document.cookie = "insighte-dev-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#111224] text-white">
      <Navbar />
      
      <main className="mx-auto max-w-xl px-6 pt-40 pb-32">
        <div className="pod p-10 text-center space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#D3C4B5] flex items-center justify-center gap-3">
              <Zap className="h-8 w-8 text-[#EF9F27]" />
              Dev Access Engine
            </h1>
            <p className="text-sm text-zinc-500 font-medium">Bypass authentication for rapid interface testing.</p>
          </div>

          <div className="grid gap-4">
            <button 
              onClick={() => setBypass('PARENT')}
              className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#8B7FF0]/10 flex items-center justify-center text-[#8B7FF0]">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Parent / Client</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-black mt-1">Role: PARENT</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap className="h-4 w-4 text-[#EF9F27]" />
              </div>
            </button>

            <button 
              onClick={() => setBypass('PROVIDER')}
              className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#BACCB3]/10 flex items-center justify-center text-[#BACCB3]">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Specialist / Provider</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-black mt-1">Role: PROVIDER</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap className="h-4 w-4 text-[#EF9F27]" />
              </div>
            </button>

            <button 
              onClick={() => setBypass('ADMIN')}
              className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EF9F27]/10 flex items-center justify-center text-[#EF9F27]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Super Admin</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-black mt-1">Role: ADMIN</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap className="h-4 w-4 text-[#EF9F27]" />
              </div>
            </button>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={clearBypass}
              className="text-xs text-zinc-600 font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Clear Bypass Cookies
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
