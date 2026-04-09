"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signupAction } from "./actions";
import { 
  Heart, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  CheckCircle2,
  Phone,
  Zap,
  Sparkles,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupSanctuary() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await signupAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111224] font-inter text-[#e1e0fa] min-h-screen overflow-hidden flex flex-col items-center justify-center p-6 relative">
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d3c4b5] opacity-10 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      <div className="w-full max-w-2xl animate-fade-in-up z-10">
        {/* Brand Header */}
        <div className="mb-12 flex flex-col items-center gap-6">
          <Link href="/" className="group flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#d3c4b5] text-[#382f24] shadow-2xl transition-all hover:scale-105">
            <Heart className="h-10 w-10 fill-current" />
          </Link>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-[#f0e0d0] font-manrope">
               Join the Insighte <span className="text-[#baccb3] italic">Sanctuary.</span>
            </h1>
            <p className="text-sm font-medium text-[#c8c5cd] uppercase tracking-[0.2em] italic">A space for your child's growth.</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-[linear-gradient(135deg,rgba(50,51,71,0.7)_0%,rgba(200,196,219,0.05)_100%)] backdrop-blur-[24px] rounded-[3rem] p-10 sm:p-14 shadow-[0_20px_80px_rgba(11,12,31,0.6)] border border-[#47464c]/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {error && (
              <div className="p-4 bg-[#93000a]/20 border border-[#93000a] text-[#ffdad6] rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#919097] ml-4 mb-1">Legal Name</label>
                <div className="relative group">
                  <input 
                    name="fullName"
                    placeholder="Midhun Noble" 
                    required
                    className="w-full h-[72px] rounded-3xl border-none bg-[#191a2d] pl-16 pr-6 text-lg font-medium text-[#e1e0fa] shadow-inner focus:ring-2 focus:ring-[#baccb3]/50 transition-all placeholder:text-[#47464c] outline-none"
                  />
                  <User className="absolute top-1/2 left-6 h-5 w-5 -translate-y-1/2 text-[#919097] group-focus-within:text-[#baccb3] transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#919097] ml-4 mb-1">Contact Number</label>
                <div className="relative group">
                  <input 
                    name="phone"
                    placeholder="+91 999 999 9999" 
                    required
                    className="w-full h-[72px] rounded-3xl border-none bg-[#191a2d] pl-16 pr-6 text-lg font-medium text-[#e1e0fa] shadow-inner focus:ring-2 focus:ring-[#baccb3]/50 transition-all placeholder:text-[#47464c] outline-none"
                  />
                  <Phone className="absolute top-1/2 left-6 h-5 w-5 -translate-y-1/2 text-[#919097] group-focus-within:text-[#baccb3] transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#919097] ml-4 mb-1">Email Address</label>
              <div className="relative group">
                <input 
                  type="email"
                  name="email"
                  placeholder="parent@insighte.com" 
                  required
                  className="w-full h-[72px] rounded-3xl border-none bg-[#191a2d] pl-16 pr-6 text-lg font-medium text-[#e1e0fa] shadow-inner focus:ring-2 focus:ring-[#baccb3]/50 transition-all placeholder:text-[#47464c] outline-none"
                />
                <Mail className="absolute top-1/2 left-6 h-5 w-5 -translate-y-1/2 text-[#919097] group-focus-within:text-[#baccb3] transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#919097] ml-4 mb-1">Master Password</label>
              <div className="relative group">
                <input 
                  type="password"
                  name="password"
                  placeholder="••••••••" 
                  required
                  className="w-full h-[72px] rounded-3xl border-none bg-[#191a2d] pl-16 pr-6 text-lg font-medium text-[#e1e0fa] shadow-inner focus:ring-2 focus:ring-[#baccb3]/50 transition-all placeholder:text-[#47464c] outline-none"
                />
                <Lock className="absolute top-1/2 left-6 h-5 w-5 -translate-y-1/2 text-[#919097] group-focus-within:text-[#baccb3] transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-4 px-6 py-5 bg-[#3b4b38]/40 rounded-2xl border border-[#baccb3]/20 mt-2">
              <CheckCircle2 className="h-5 w-5 text-[#baccb3] flex-shrink-0" /> 
              <span className="text-xs font-black uppercase tracking-widest text-[#baccb3]">Professional Clinical Vetting Defaulted</span>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-20 rounded-full bg-[#d3c4b5] text-[#382f24] font-bold text-lg flex items-center justify-center gap-2 group hover:bg-[#f0e0d0] hover:shadow-[0_0_30px_rgba(200,196,219,0.3)] active:scale-95 transition-all duration-300 mt-4"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <span className="flex items-center gap-4 uppercase tracking-[0.2em] text-sm">
                    Create Membership
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer Meta */}
        <div className="mt-12 flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-4 border-t border-[#47464c]/30 pt-10 w-full text-center">
            <p className="text-md font-medium text-[#c8c5cd]">
              Already a member of the Insighte sanctuary? 
              <Link href="/login" className="text-[#f0e0d0] font-black ml-2 hover:underline decoration-[#baccb3]/50 underline-offset-8">Sign In</Link>
            </p>
          </div>
          
          <div className="flex items-center gap-8 md:gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-[#919097] italic">
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#baccb3]" /> Active Encryption</span>
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#d3c4b5]" /> Institutional Rigor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
