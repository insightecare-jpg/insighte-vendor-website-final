"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Calendar, Menu, X, Heart, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/search-bar";

const NAV_LINKS = [
  { name: "Experts", href: "/specialists" },
  { name: "Programs", href: "/programs" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4 md:pt-6 transition-all duration-500">
      <nav
        className={cn(
          "mx-auto flex h-16 md:h-20 max-w-5xl items-center justify-between rounded-full px-5 md:px-8 transition-all duration-700 backdrop-blur-3xl shadow-2xl",
          isScrolled
            ? "bg-[#1D1E31]/80 border border-white/5 scale-[0.98]"
            : "bg-white/5 border border-white/10"
        )}
      >
        <div className="flex items-center gap-6 md:gap-12">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#D3C4B5] text-[#382F24] transition-all group-hover:rotate-12 shadow-lg shadow-[#D3C4B5]/10">
              <Heart className="h-4 w-4 md:h-5 md:w-5 fill-current" />
            </div>
            <span className="text-lg md:text-xl font-extrabold tracking-tighter text-white font-manrope">
              Insighte
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 hover:text-white transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Global Search - Hidden on homepage unless specifically needed, to unify search bars */}
          {pathname !== "/" && (
            <div className="hidden lg:block ml-4">
              <SearchBar variant="nav" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            <Link href="/login" className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 hover:text-white transition-all">
              Login
            </Link>
            <Link href="/specialists">
              <Button className="h-11 md:h-12 rounded-full bg-[#D3C4B5] text-[#382F24] px-5 md:px-8 font-bold text-xs hover:bg-white transition-all shadow-xl shadow-[#D3C4B5]/10 active:scale-95 flex items-center gap-2">
                Get Matched <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0C1F]/98 backdrop-blur-3xl transition-all duration-700 md:hidden",
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <button
          className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        <div className="flex flex-col items-center gap-8 text-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-3xl font-extrabold tracking-tighter text-white hover:text-[#D3C4B5] transition-colors font-manrope"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-xl font-bold text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link href="/specialists" onClick={() => setMobileMenuOpen(false)}>
            <Button size="lg" className="mt-4 rounded-full bg-[#D3C4B5] text-[#382F24] px-12 h-16 font-bold text-sm flex items-center gap-3">
              Get Matched in 10 mins <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
