import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
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
  Filter,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { getPublicProviders } from "@/lib/actions/providers";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import MarketplaceClient from "./MarketplaceClient";
import { createClient } from "@/lib/supabase/server";

export default async function MarketplaceSanctuary({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string; category?: string; sort?: string; location?: string }> 
}) {
  const supabase = await createClient();
  const providers = await getPublicProviders();
  const { data: curations } = await supabase.from('curations').select('*').order('price', { ascending: true });
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#111224] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-36 pb-32 flex flex-col lg:flex-row gap-12">
        <Suspense fallback={<MarketplaceSkeleton />}>
          <MarketplaceClient 
            initialProviders={providers} 
            initialCurations={curations || []}
            initialQuery={params.query || ""}
            initialCategory={params.category || "All"}
            initialSort={params.sort || "Recommended"}
            initialLocation={params.location || "All"}
          />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

function MarketplaceSkeleton() {
   return (
      <div className="flex-1 space-y-12 animate-pulse">
         <div className="h-20 bg-white/5 rounded-3xl w-1/3" />
         <div className="space-y-10">
            {[1, 2, 3].map(i => (
               <div key={i} className="h-64 bg-[#191A2D] rounded-[48px] border border-white/5" />
            ))}
         </div>
      </div>
   );
}
