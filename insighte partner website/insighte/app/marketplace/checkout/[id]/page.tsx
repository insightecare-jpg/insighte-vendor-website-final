import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  ChevronRight, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CreditCard,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { getProviderById } from "@/lib/actions/providers";
import CheckoutClient from "./CheckoutClient";
import { notFound } from "next/navigation";

export default async function CheckoutSanctuary({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>, 
  searchParams: Promise<{ date: string, slot: string }> 
}) {
  const { id } = await params;
  const { date, slot } = await searchParams;
  const provider = await getProviderById(id);

  if (!provider) return notFound();

  return (
    <div className="min-h-screen bg-[#111224] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-36 pb-32">
        {/* BACK NAV */}
        <Link href={`/marketplace/book/${id}`} className="inline-flex mb-12 animate-fade-in-up">
           <button className="pod h-14 px-8 group hover:scale-[1.02] transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] flex items-center gap-3">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Return to Sequence
              </span>
           </button>
        </Link>

        <CheckoutClient provider={provider} date={date} slot={slot} />
      </main>

      <Footer />
    </div>
  );
}
