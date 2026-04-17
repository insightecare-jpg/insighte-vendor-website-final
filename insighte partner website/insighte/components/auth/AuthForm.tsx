"use client";

import React, { useState } from "react";
import Link from "next/link";
import { login, register } from "@/app/actions/auth";
import { Heart, Mail, Lock, ArrowRight, Loader2, Sparkles, Zap, Shield, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
  role: "admin" | "provider" | "client";
}

export function AuthForm({ mode, role }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const roleTitles = {
    admin: "Admin Control",
    provider: "Expert Sanctuary",
    client: "Client Sanctuary",
  };

  const roleIcons = {
    admin: Shield,
    provider: Briefcase,
    client: Users,
  };

  const RoleIcon = roleIcons[role];

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          app_role: role
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("role", role); // Ensure role is passed for signup
    
    let result;
    if (mode === "login") {
      result = await login(formData);
    } else {
      result = await register(formData);
    }
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  const activateBypass = () => {
    document.cookie = `insighte-dev-role=${role}; path=/; max-age=3600`;
    alert(`Bypass Active: Authenticated as ${role.toUpperCase()}. Redirecting...`);
    
    if (role === 'admin') window.location.href = '/admin/dashboard';
    else if (role === 'provider') window.location.href = '/provider/dashboard';
    else window.location.href = '/parent/dashboard';
  };

  return (
    <div className="bg-[#111224] font-inter text-[#e1e0fa] min-h-screen overflow-hidden flex items-center justify-center relative p-6">
      <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#baccb3] opacity-5 blur-[60px] rounded-full"></div>
        <div className="absolute top-1/4 -right-24 w-64 h-64 bg-[#c8c4db] opacity-5 blur-[60px] rounded-full"></div>
      </div>

      <main className="relative w-full max-w-md z-10 animate-fade-in-up">
        <header className="mb-10 text-center">
          <div className="inline-block p-4 rounded-3xl bg-white/5 mb-6 border border-white/10 group">
            <RoleIcon className="text-[#d3c4b5] w-8 h-8 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="font-manrope text-4xl font-extrabold tracking-tighter text-[#f0e0d0] leading-none mb-3">
            {roleTitles[role]}
          </h1>
          <p className="font-inter text-[#919097] text-sm uppercase tracking-widest font-black italic">
            {mode === "login" ? "Identity Synchronization" : "Vessel Registration"}
          </p>
        </header>

        <section className="bg-[linear-gradient(135deg,rgba(50,51,71,0.7)_0%,rgba(200,196,219,0.05)_100%)] backdrop-blur-[24px] rounded-[3rem] p-8 shadow-2xl border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4" htmlFor="email">Email</label>
              <input 
                className="w-full h-14 bg-[#191a2d] border border-white/5 rounded-2xl px-6 text-[#e1e0fa] placeholder:opacity-20 focus:ring-2 focus:ring-[#baccb3]/50 transition-all outline-none text-sm font-bold" 
                id="email" 
                name="email" 
                placeholder="your@email.com" 
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4 mr-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500" htmlFor="password">Password</label>
                {mode === "login" && <Link href="/forgot-password" className="text-[10px] text-zinc-600 hover:text-white transition-colors uppercase tracking-widest font-black">Forgot?</Link>}
              </div>
              <input 
                className="w-full h-14 bg-[#191a2d] border border-white/5 rounded-2xl px-6 text-[#e1e0fa] placeholder:opacity-20 focus:ring-2 focus:ring-[#baccb3]/50 transition-all outline-none text-sm font-bold" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                type="password"
                required
              />
            </div>

            <Button 
              disabled={loading}
              className="w-full h-14 bg-white text-[#111224] font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl flex items-center justify-center gap-2 group hover:bg-[#baccb3] transition-all duration-300" 
              type="submit"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span>{mode === "login" ? "Initiate Sync" : "Create Node"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-[1px] flex-grow bg-white/5"></div>
            <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] italic leading-none inline-block pb-1">External Logic</span>
            <div className="h-[1px] flex-grow bg-white/5"></div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
             <Button 
               type="button"
               onClick={handleGoogleLogin}
               variant="outline"
               className="h-14 w-full bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
             >
               <svg className="h-4 w-4" viewBox="0 0 24 24">
                 <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                 <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                 <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                 <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
               </svg>
               Google Neural Sign-In
             </Button>

             <Button 
               type="button"
               onClick={activateBypass}
               variant="ghost" 
               className="h-14 w-full bg-[#BACCB3]/5 border border-[#BACCB3]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#BACCB3] hover:bg-[#BACCB3] hover:text-[#111224] transition-all"
             >
               Instant Bypass Protocol
             </Button>
          </div>
        </section>

        <footer className="mt-8 text-center">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            {mode === "login" ? (
              <>
                Need a new node? 
                <Link className="text-white ml-2 hover:underline decoration-[#baccb3]/50 underline-offset-4 transition-all" href={role === 'admin' ? '/auth/admin/signup' : role === 'provider' ? '/auth/expert/signup' : '/auth/client/signup'}>Register</Link>
              </>
            ) : (
              <>
                Already synchronized? 
                <Link className="text-white ml-2 hover:underline decoration-[#baccb3]/50 underline-offset-4 transition-all" href={role === 'admin' ? '/auth/admin/login' : role === 'provider' ? '/auth/expert/login' : '/auth/client/login'}>Log In</Link>
              </>
            )}
          </p>
          <div className="mt-12 flex items-center justify-center gap-8 text-[8px] font-black uppercase tracking-[0.3em] text-zinc-800 italic">
            <span className="flex items-center gap-2 font-mono"><Zap className="h-3 w-3" /> Secure</span>
            <span className="flex items-center gap-2 font-mono"><Sparkles className="h-3 w-3" /> Unified</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
