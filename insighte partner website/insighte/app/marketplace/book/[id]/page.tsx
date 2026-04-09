import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  ChevronRight, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft,
  CheckCircle2,
  Lock,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import { getProviderById } from "@/lib/actions/providers";
import BookingClient from "./BookingClient";
import { notFound } from "next/navigation";

export default async function BookingSanctuary({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const provider = await getProviderById(id);

  if (!provider) return notFound();

  return (
    <div className="min-h-screen bg-[#111224] text-white">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pt-36 pb-32">
        {/* BACK NAV */}
        <Link href={`/marketplace/${id}`} className="inline-flex mb-12 animate-fade-in-up">
           <button className="pod h-14 px-8 group hover:scale-[1.02] transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] flex items-center gap-3">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Return to Architect
              </span>
           </button>
        </Link>

        <section className="animate-fade-in-up stagger-1 space-y-16">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-8 py-2 text-[10px] font-black uppercase tracking-widest">
                    Reservation Architecture
                 </Badge>
                 <div className="h-1.5 w-1.5 rounded-full bg-[#BACCB3] blur-[1px] animate-pulse" />
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] font-manrope">
                 Choose your <br/>
                 <span className="text-zinc-600">Sanctuary Moment</span>
              </h1>
           </div>

           <BookingClient provider={provider} />
        </section>

        {/* TRUST SIGNALS */}
        <section className="mt-20 flex flex-wrap justify-center gap-12 opacity-30 animate-fade-in-up stagger-5">
           {[
             { icon: <ShieldCheck className="h-5 w-5" />, label: "Encrypted Portal" },
             { icon: <Lock className="h-5 w-5" />, label: "Secure Payments" },
             { icon: <CheckCircle2 className="h-5 w-5" />, label: "Verified Specialists" }
           ].map((sig, i) => (
             <div key={i} className="flex items-center gap-4">
                {sig.icon}
                <span className="text-[10px] font-black uppercase tracking-widest">{sig.label}</span>
             </div>
           ))}
        </section>
      </main>
    </div>
  );
}
