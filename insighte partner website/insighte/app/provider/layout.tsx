import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  LayoutDashboard, 
  UserCircle, 
  Tags, 
  Calendar, 
  Wallet, 
  LogOut,
  Bell,
  Users
} from 'lucide-react';
import { logout } from '@/app/actions/auth';

export const metadata: Metadata = {
  title: 'Expert Sanctuary | Educator Hub',
  description: 'A modern, high-performance dashboard for Insighte educators. Manage teaching sessions, student directory, and earnings with ease.',
  keywords: ['neuro-inclusive', 'expert sanctuary', 'insighte portal', 'educator dashboard'],
  openGraph: {
    title: 'Expert Sanctuary | Insighte',
    description: 'Modernizing neuro-diverse care delivery through data precision.',
    type: 'website',
  }
};

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/provider/dashboard', icon: LayoutDashboard },
  { name: 'Students', href: '/provider/learners', icon: Users },
  { name: 'Profile', href: '/provider/profile', icon: UserCircle },
  { name: 'Programs', href: '/provider/services', icon: Tags },
  { name: 'Earnings', href: '/provider/finance', icon: Wallet },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white selection:bg-[#BACCB3] selection:text-[#111224]" style={{ fontFamily: "'Manrope', 'DM Sans', sans-serif" }}>
      {/* GLOBAL HEADER / HUD */}
      <header className="fixed top-0 left-0 right-0 z-50 h-24 px-6 md:px-12 flex items-center justify-between border-b border-white/5 backdrop-blur-3xl bg-[#0d0f1a]/80">
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-3">
             <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center p-2 group-hover:rotate-[10deg] transition-all duration-500">
                <img src="/logo-icon.svg" alt="Insighte" className="h-full w-full" />
             </div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-[#BACCB3] transition-colors duration-500">
              Insighte <span className="text-[#D3C4B5]/40 italic">/</span> Sanctuary
            </h2>
          </Link>
          
          <nav className="hidden lg:flex items-center ml-12 gap-2" aria-label="Desktop Navigation">
             {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-500 flex items-center gap-3 border border-transparent hover:border-white/5"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.name}
                </Link>
             ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <button className="relative h-12 w-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all bg-white/5" aria-label="Notifications">
             <Bell className="h-5 w-5" />
             <span className="absolute top-3.5 right-3.5 h-2 w-2 bg-[#BACCB3] border-2 border-[#0d0f1a] rounded-full" />
          </button>
          
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#111224] to-[#1D1E31] border border-white/10 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
             <UserCircle className="h-7 w-7 text-[#BACCB3]" />
          </div>

          <form action={logout}>
            <button type="submit" className="hidden md:flex h-12 px-6 rounded-2xl border border-white/5 items-center gap-3 text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-all group" aria-label="Exit Gateway">
              <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
            </button>
          </form>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main id="main-content" className="pt-32 pb-32 px-4 md:px-12 max-w-[1536px] mx-auto min-h-screen">
        {children}
      </main>

      {/* MOBILE THUMB NAVIGATION (THE HUB) */}
      <nav className="fixed bottom-10 left-6 right-6 lg:hidden z-50 mobile-hub-container" aria-label="Mobile Navigation Hub">
        <div className="bg-[#111224]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 flex items-center justify-around shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] haptic-touch-lg">
           {NAV_ITEMS.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className="p-5 rounded-3xl text-zinc-600 hover:text-[#BACCB3] hover:bg-[#BACCB3]/10 transition-all flex flex-col items-center gap-2 group active:scale-90"
              >
                <item.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="text-[7px] font-black uppercase tracking-widest">{item.name}</span>
              </Link>
           ))}
        </div>
      </nav>
    </div>
  );
}
