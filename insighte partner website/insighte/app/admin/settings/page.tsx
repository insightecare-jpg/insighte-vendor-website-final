"use client";

import React from "react";
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Smartphone, 
  LogOut,
  ChevronRight,
  Database,
  Cloud,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-16 pb-24 animate-fade-in-up">
       {/* HEADER */}
       <section className="flex flex-col lg:flex-row items-end justify-between gap-12">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
             <h1 className="text-8xl font-black font-manrope tracking-tighter leading-[0.85]">Sanctuary Settings</h1>
             <p className="text-2xl text-zinc-600 font-medium italic">
                Refining the engine. Manage permissions, notifications, and institutional security.
             </p>
          </div>
       </section>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 stagger-1">
          {/* SETTINGS MENU */}
          <div className="lg:col-span-4 space-y-6">
             {[
               { icon: <User />, label: "My Profile", sub: "Personal details & Access" },
               { icon: <Shield />, label: "Security & RLS", sub: "Database protection layers" },
               { icon: <Bell />, label: "Notifications", sub: "Alert preferences & Routing" },
               { icon: <Smartphone />, label: "Mobile Access", sub: "Authenticator & Devices" },
               { icon: <Database />, label: "Backups", sub: "Historical data sync" },
               { icon: <Cloud />, label: "Cloudflare Sync", sub: "Edge network settings" },
             ].map((item, i) => (
               <button key={i} className={cn(
                 "vessel w-full flex items-center justify-between p-8 group transition-all border border-white/5",
                 i === 0 ? "bg-[#1D1E31] shadow-2xl" : "bg-white/5 hover:bg-white/10"
               )}>
                  <div className="flex items-center gap-6">
                     <div className={cn(
                       "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                       i === 0 ? "bg-[#D3C4B5] text-[#382F24]" : "bg-black/30 text-zinc-700 group-hover:text-white"
                     )}>
                        {item.icon}
                     </div>
                     <div className="text-left">
                        <p className="text-xl font-bold font-manrope tracking-tighter">{item.label}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">{item.sub}</p>
                     </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-800" />
               </button>
             ))}
          </div>

          {/* MAIN SETTINGS CONTENT AREA */}
          <div className="lg:col-span-8 space-y-10">
             <div className="vessel bg-[#1D1E31] p-12 space-y-12 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#D3C4B5]/50 to-transparent opacity-30" />
                
                <h3 className="text-4xl font-extrabold font-manrope tracking-tighter italic">General Account Settings</h3>

                <div className="space-y-10">
                   {[
                     { label: "Two-Factor Authentication", sub: "Require a secondary device for all admin logins.", active: true },
                     { label: "IP Restriction (Geo-Lock)", sub: "Limit dashboard access to known office IP ranges.", active: false },
                     { label: "AI Translation Helper", sub: "Auto-translate provider biographies in the review queue.", active: true },
                     { label: "Real-time Notifications", sub: "Enable live desktop alerts for urgent approval requests.", active: true },
                   ].map((pref, i) => (
                     <div key={i} className="flex items-center justify-between py-8 border-b border-white/5 last:border-none">
                        <div className="space-y-2 text-left">
                           <p className="text-2xl font-bold font-manrope leading-tight">{pref.label}</p>
                           <p className="text-sm text-zinc-600 font-medium italic">{pref.sub}</p>
                        </div>
                        <Switch checked={pref.active} className="data-[state=checked]:bg-[#BACCB3]" />
                     </div>
                   ))}
                </div>

                <div className="pt-10 flex items-center justify-between gap-6 overflow-hidden">
                   <Button variant="ghost" className="h-16 px-10 rounded-full text-zinc-700 font-black uppercase tracking-widest text-[9px] hover:text-white border border-white/5">Cancel Changes</Button>
                   <Button className="h-16 px-12 flex-1 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-glow glow-[#D3C4B5]/20">Update Sanctuary Profile</Button>
                </div>
             </div>

             <div className="vessel bg-red-400/5 p-12 space-y-8 border border-red-400/10 group rounded-[48px]">
                <div className="flex items-center gap-4 text-red-400">
                   <Lock className="h-6 w-6" />
                   <h3 className="text-3xl font-extrabold font-manrope tracking-tighter italic">Security Danger Zone</h3>
                </div>
                <p className="text-xl text-red-400/60 font-medium italic max-w-xl">
                  These actions are destructive and will irrevocably alter the sanctuary architecture. Verification required for all changes.
                </p>
                <div className="flex items-center gap-6 overflow-hidden">
                   <Button variant="outline" className="h-16 flex-1 rounded-full border-red-400/20 text-red-400 hover:bg-red-400 hover:text-white font-black uppercase tracking-widest text-[9px] transition-all">Deactivate Account</Button>
                   <Button className="h-16 px-12 rounded-full bg-red-500 text-white font-black uppercase tracking-widest text-[9px] hover:bg-red-600 transition-all shadow-glow glow-red-500/30">Force Logout All</Button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
