"use client";
import React from "react";
import Link from "next/link";
import { Heart, Globe, Share2, MessageCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FOOTER_LINKS = [
  {
    title: "For Parents",
    links: [
      { name: "Find Specialists", href: "/specialists" },
      { name: "Programs & Curations", href: "/programs" },
      { name: "Talk to our Team", href: "/book" },
      { name: "Parent Login", href: "/login" },
      { name: "Sign Up", href: "/signup" },
    ],
  },
  {
    title: "For Experts",
    links: [
      { name: "Join as a Partner", href: "/partners" },
      { name: "Provider Dashboard", href: "/provider/dashboard" },
      { name: "Admin Portal", href: "/admin" },
    ],
  },
  {
    title: "For Public",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Wisdom Hub (Blog)", href: "/blog" },
      { name: "Speech Therapy", href: "/specialists?category=Speech Therapy" },
      { name: "Behavior Therapy", href: "/specialists?category=Behavior Therapy" },
      { name: "Special Education", href: "/specialists?category=Special Education" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-[#0B0C1F] pt-32 pb-16 relative overflow-hidden border-t border-white/5">
      {/* Cinematic Background Accents */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 h-96 w-96 bg-[#D3C4B5]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 h-64 w-64 bg-[#BACCB3]/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-8 relative z-10">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="flex flex-col gap-10 lg:col-span-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D3C4B5] text-[#382F24] shadow-[0_20px_40px_rgba(211,196,181,0.3)] transition-all hover:scale-110 hover:rotate-3">
                    <Heart className="h-6 w-6 fill-current" />
                 </div>
                 <span className="text-3xl font-black tracking-tighter font-manrope text-white">
                   Insighte
                 </span>
              </div>
              <p className="max-w-sm text-lg leading-relaxed text-zinc-400 font-medium">
                The world's most trusted sanctuary for families seeking neuro-affirmative clinical excellence.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {[
                { Icon: Globe, href: "#" },
                { Icon: Share2, href: "#" },
                { Icon: MessageCircle, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  className="h-12 w-12 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1" 
                  aria-label="Social link"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-4 mt-4">
               <div className="flex items-center gap-3 rounded-2xl bg-[#BACCB3]/10 px-5 py-3 border border-[#BACCB3]/10">
                  <ShieldCheck className="h-4 w-4 text-[#BACCB3]" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#BACCB3]">Clinical Integrity Secured</span>
               </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 lg:col-span-8">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title} className="flex flex-col gap-8">
                <h4 className="text-sm font-black uppercase tracking-[0.25em] text-[#D3C4B5] font-manrope">
                  {group.title}
                </h4>
                <ul className="flex flex-col gap-5">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-base font-bold text-zinc-500 hover:text-white transition-all duration-300 flex items-center group/link"
                      >
                        <span className="w-0 overflow-hidden group-hover/link:w-3 transition-all duration-500 text-[#D3C4B5]">•</span>
                        <span className="group-hover/link:translate-x-2 transition-all duration-500">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <p className="text-sm font-bold text-zinc-600 font-manrope">
                © {new Date().getFullYear()} Insighte Childcare. A 2016 DNA Institution.
              </p>
              <div className="flex items-center gap-8">
                 <Link href="/privacy" className="text-sm font-bold text-zinc-600 hover:text-white transition-colors underline-offset-4 hover:underline">Privacy</Link>
                 <Link href="/terms" className="text-sm font-bold text-zinc-600 hover:text-white transition-colors underline-offset-4 hover:underline">Terms</Link>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
                Optimized by Antigravity OS
              </p>
           </div>
        </div>
      </div>
    </footer>
  );
}
