import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Clock, 
  MessageSquare, 
  ChevronRight, 
  ArrowLeft,
  Users,
  Brain,
  Zap,
  CheckCircle2,
  Quote,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { getProviderById } from "@/lib/actions/providers";
import ProfileClient from "./ProfileClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const provider = await getProviderById(id);
  
  if (!provider) return { title: "Specialist Not Found" };

  return {
    title: `${provider.name} | ${provider.specializations?.[0] || 'Specialist'} | Insighte`,
    description: provider.bio || `View the profile of ${provider.name}, a verified specialist on Insighte.`,
    openGraph: {
      title: `${provider.name} — Verified Specialist`,
      description: provider.bio,
      images: [provider.avatar_url || ""],
    }
  };
}

export default async function ProviderProfileSanctuary({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const provider = await getProviderById(id);

  if (!provider) {
    // If not found in DB, try to find in hardcoded list for fallback or 404
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#111224] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-36 pb-32">
        {/* BACK NAVIGATION POD */}
        <Link href="/specialists" className="inline-flex mb-12 animate-fade-in-up">
           <button className="pod h-14 px-8 group hover:scale-[1.02] transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] flex items-center gap-3">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Return to Discovery
              </span>
           </button>
        </Link>

        <ProfileClient provider={provider} />
      </main>

      <Footer />
    </div>
  );
}
