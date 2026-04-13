"use client";

import React, { useState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";
import { Heart, Mail, Lock, ArrowRight, Loader2, Brain, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginSanctuary() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111224] font-inter text-[#e1e0fa] min-h-screen overflow-hidden flex items-center justify-center relative">
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#baccb3] opacity-10 blur-[60px] rounded-full"></div>
        <div className="absolute top-1/4 -right-24 w-64 h-64 bg-[#c8c4db] opacity-10 blur-[60px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0b0c1f] opacity-40 blur-[60px] rounded-full"></div>
      </div>

      <main className="relative w-full max-w-md px-6 py-12 z-10 animate-fade-in-up">
        {/* Brand Header */}
        <header className="mb-12 pl-4">
          <Link href="/" className="inline-block p-4 rounded-full bg-[#191a2d] mb-6 shadow-2xl hover:bg-[#27283c] transition-colors group">
            <Heart className="text-[#d3c4b5] w-8 h-8 group-hover:scale-110 transition-transform" />
          </Link>
          <h1 className="font-manrope text-5xl font-extrabold tracking-tighter text-[#f0e0d0] leading-none">
            Welcome<br/>back.
          </h1>
          <p className="font-inter text-[#c8c5cd] mt-4 text-lg max-w-[280px]">
            Return to your sanctuary of care and connection.
          </p>
        </header>

        {/* Central Vessel */}
        <section className="bg-[linear-gradient(135deg,rgba(50,51,71,0.7)_0%,rgba(200,196,219,0.05)_100%)] backdrop-blur-[24px] rounded-3xl p-8 shadow-[0_20px_80px_rgba(11,12,31,0.6)] border border-[#47464c]/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-[#93000a]/20 border border-[#93000a] text-[#ffdad6] rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#c8c5cd] ml-4 font-inter" htmlFor="email">Email Address</label>
              <div className="relative group">
                <input 
                  className="w-full bg-[#323347] border-none rounded-2xl px-6 py-4 text-[#e1e0fa] placeholder:opacity-40 focus:ring-2 focus:ring-[#baccb3]/50 transition-all duration-300 outline-none" 
                  id="email" 
                  name="email" 
                  placeholder="parent@insighte.com" 
                  type="email"
                  required
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#919097] group-focus-within:text-[#baccb3] transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4 mr-2">
                <label className="block text-sm font-medium text-[#c8c5cd] font-inter" htmlFor="password">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#baccb3]/80 hover:text-[#baccb3] font-medium transition-colors">Forgot password?</Link>
              </div>
              <div className="relative group">
                <input 
                  className="w-full bg-[#323347] border-none rounded-2xl px-6 py-4 text-[#e1e0fa] placeholder:opacity-40 focus:ring-2 focus:ring-[#baccb3]/50 transition-all duration-300 outline-none" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type="password"
                  required
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#919097] group-focus-within:text-[#baccb3] transition-colors" />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                disabled={loading}
                className="w-full h-16 bg-[#d3c4b5] text-[#382f24] font-bold text-lg rounded-full flex items-center justify-center gap-2 group hover:shadow-[0_0_30px_rgba(200,196,219,0.3)] hover:bg-[#f0e0d0] active:scale-95 transition-all duration-300" 
                type="submit"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#47464c]/50 to-transparent"></div>
            <span className="text-[10px] font-inter text-[#919097] uppercase tracking-widest font-black italic">Insighte Sanctuary</span>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#47464c]/50 to-transparent"></div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
             <button 
               type="button"
               onClick={() => {
                 document.cookie = "insighte-dev-role=admin; path=/";
                 window.location.href = "/admin/hub";
               }}
               className="p-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#d3c4b5] hover:bg-white/10 transition-all"
             >
               Admin Bypass
             </button>
             <button 
               type="button"
               onClick={() => {
                 document.cookie = "insighte-dev-role=provider; path=/";
                 window.location.href = "/provider/dashboard";
               }}
               className="p-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#baccb3] hover:bg-white/10 transition-all"
             >
               Provider Bypass
             </button>
          </div>
        </section>

        <footer className="mt-8 text-center">
          <p className="text-[#c8c5cd] text-sm">
            New to Insighte? 
            <Link className="text-[#f0e0d0] font-bold ml-2 hover:underline decoration-[#baccb3]/50 underline-offset-4" href="/signup">Sign up</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
