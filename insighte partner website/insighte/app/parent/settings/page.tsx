"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  Settings, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Fingerprint, 
  Heart, 
  Globe, 
  Moon, 
  LogOut, 
  ChevronRight,
  Sparkles,
  Zap,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen-safe flex-col bg-zinc-950 font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 px-4 pt-32 pb-32 sm:px-6">
        <div className="mx-auto max-w-5xl animate-fade-in-up">
           
           {/* HEADER - PROTOCOL SETUP */}
           <div className="flex flex-col gap-6">
              <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all group">
                 <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1" /> Return Dashboard
              </Link>
              <div className="flex flex-col gap-4">
                 <Badge variant="outline" className="w-fit py-1.5 px-4 font-black tracking-widest text-[9px] uppercase bg-white/5 text-zinc-400 border-white/10 backdrop-blur-md">
                    <Fingerprint className="mr-2 h-3.5 w-3.5 text-primary" /> Workspace Settings
                 </Badge>
                 <h1 className="text-5xl font-black leading-tight tracking-tighter text-white sm:text-7xl lg:text-8xl">
                    Account <span className="text-zinc-500 italic">Vanguard.</span>
                 </h1>
              </div>
           </div>

           {/* SETTINGS ARCHITECTURE */}
           <div className="mt-20 grid grid-cols-1 gap-12 animate-fade-in-up stagger-2">
              
              {/* PRIMARY IDENTITY */}
              <section className="flex flex-col gap-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 italic border-l-2 border-primary pl-6">Clinical Identity</h3>
                 <Card className="rounded-[48px] border border-white/5 bg-white/[0.02] p-10 sm:p-14">
                    <div className="flex flex-col gap-10 md:flex-row md:items-center">
                       <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[32px] border-2 border-white/10 shadow-float">
                          <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-4xl font-black text-white">MN</div>
                          <div className="absolute inset-x-0 bottom-0 flex h-8 items-center justify-center bg-black/40 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">EDIT</div>
                       </div>
                       
                       <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-2">
                          <div className="flex flex-col gap-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Legacy Name</label>
                             <Input 
                               defaultValue="Midhun Noble" 
                               className="h-16 rounded-2xl border-white/5 bg-zinc-900/50 px-6 font-medium text-white focus:bg-zinc-900 transition-all placeholder:text-zinc-800"
                             />
                          </div>
                          <div className="flex flex-col gap-2">
                             <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 ml-2">Contact Link</label>
                             <Input 
                               defaultValue="+91 999 999 9999" 
                               className="h-16 rounded-2xl border-white/5 bg-zinc-900/50 px-6 font-medium text-white focus:bg-zinc-900 transition-all placeholder:text-zinc-800"
                             />
                          </div>
                       </div>
                    </div>
                 </Card>
              </section>

              {/* PERMISSIONS & SECURITY */}
              <section className="flex flex-col gap-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 italic border-l-2 border-primary pl-6">Safety Protocols</h3>
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <Card className="rounded-[48px] border border-white/5 bg-white/[0.01] p-10 hover:bg-white/[0.02] transition-all">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                             <h4 className="text-xl font-black tracking-tight text-white">Two-Factor Auth</h4>
                             <Switch className="bg-zinc-800 data-[state=checked]:bg-primary" />
                          </div>
                          <p className="text-sm font-medium text-zinc-600 leading-relaxed">Mandatory for all Royale-tier families to ensure session privacy.</p>
                       </div>
                    </Card>

                    <Card className="rounded-[48px] border border-white/5 bg-white/[0.01] p-10 hover:bg-white/[0.02] transition-all">
                       <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                             <h4 className="text-xl font-black tracking-tight text-white">Login Alerts</h4>
                             <Switch defaultChecked className="bg-zinc-800 data-[state=checked]:bg-primary" />
                          </div>
                          <p className="text-sm font-medium text-zinc-600 leading-relaxed">Real-time vector notifications for every workspace access incident.</p>
                       </div>
                    </Card>
                 </div>
              </section>

              {/* ACTIONS LAYER */}
              <section className="flex flex-col gap-8 pt-12 border-t border-white/5">
                 <Button className="h-20 w-full rounded-[30px] bg-white text-black text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-all">
                    Update Institutional Profile
                 </Button>
                 <Button variant="ghost" className="h-16 w-full rounded-2xl border border-danger/20 text-danger text-[10px] font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all flex items-center justify-center gap-3">
                    <LogOut className="h-4 w-4" /> Deactivate Workspace Access
                 </Button>
              </section>

           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
