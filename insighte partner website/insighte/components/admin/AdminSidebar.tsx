"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  Home, 
  Users, 
  Settings, 
  HelpCircle, 
  ShieldCheck,
  Menu,
  X,
  Plus,
  Clock,
  Search,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ADMIN_LINKS = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Overview", href: "/admin" },
  { icon: <BarChart3 className="h-5 w-5" />, label: "Bookings", href: "/admin/dashboard" }, // Currently dashboard is bookings hub
  { icon: <FileText className="h-5 w-5" />, label: "Blog", href: "/admin/hub" },
  { icon: <Users className="h-5 w-5" />, label: "Families", href: "/admin/families" },
  { icon: <Search className="h-5 w-5" />, label: "Specialists", href: "/admin/specialists" },
  { icon: <Plus className="h-5 w-5" />, label: "Programs", href: "/admin/programs" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const NavItem = ({ link }: { link: typeof ADMIN_LINKS[0] }) => {
    const isActive = pathname === link.href;
    return (
      <Link 
        href={link.href}
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          "flex items-center gap-4 px-6 h-14 rounded-full transition-all group",
          isActive 
            ? "bg-[#1D1E31] text-white shadow-xl shadow-black/20" 
            : "text-zinc-500 hover:text-zinc-100"
        )}
      >
        <span className={cn(
          "transition-colors",
          isActive ? "text-[#D3C4B5]" : "text-inherit group-hover:text-white"
        )}>
          {link.icon}
        </span>
        <span className="text-sm font-bold tracking-tight">
          {link.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-8 left-8 z-[110]">
         <Button 
            variant="ghost" 
            className="h-12 w-12 rounded-full bg-[#1D1E31] text-white p-0 hover:bg-[#252640]"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
         >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
         </Button>
      </div>

      {/* Sidebar - Desktop & Mobile Overlay */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[100] w-72 bg-[#111224] border-r border-white/5 flex flex-col p-8 transition-transform duration-500",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* LOGO */}
        <div className="mb-16">
          <Link href="/" className="flex items-center gap-3">
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 p-1 border border-white/10 group">
                <div className="h-full w-full rounded-full bg-gradient-to-tr from-[#D3C4B5] to-[#BACCB3] opacity-40 group-hover:opacity-100 transition-opacity" />
             </div>
             <div className="space-y-0.5">
                <span className="text-xl font-black tracking-tighter uppercase font-manrope block">Insighte</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Childcare Admin</span>
             </div>
          </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-4">
           {ADMIN_LINKS.map(link => (
             <NavItem key={link.href} link={link} />
           ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="pt-10 border-t border-white/5 space-y-6">
           <Link 
              href="/admin/help"
              className="flex items-center gap-4 px-6 h-12 text-zinc-500 hover:text-white transition-all group"
           >
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm font-bold tracking-tight">Help</span>
           </Link>

           <div className="vessel bg-[#1D1E31] p-6 rounded-[32px] border border-white/10 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Need assistance?</p>
              <Button className="h-10 w-full rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[8px] hover:bg-white transition-all">Support</Button>
           </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
