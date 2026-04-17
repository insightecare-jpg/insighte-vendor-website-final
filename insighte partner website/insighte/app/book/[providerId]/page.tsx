import React, { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import BookingJourneyClient from "@/components/booking/BookingJourneyClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";

export default async function BookingPage({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  const supabase = await createClient();

  // 1. Fetch Partner (Provider) Details from the Marketplace Registry
  const { data: partner } = await supabase
    .from('partners')
    .select('*')
    .eq('id', providerId)
    .single();

  if (!partner) {
    return notFound();
  }

  // 2. Fetch Services offered by this provider
  const { data: services } = await supabase
    .from('services')
    .select('*, programs(name, slug)')
    .eq('provider_id', providerId)
    .eq('is_active', true);

  // 3. Fetch User's Children (if logged in)
  const { data: userData } = await supabase.auth.getUser();
  let children: any[] = [];
  if (userData.user) {
    const { data: childData } = await supabase
      .from('children')
      .select('*')
      .eq('user_id', userData.user.id);
    children = childData || [];
  }

  // Transform services to expected format for the client component
  const formattedServices = services?.map((s: any) => ({
    id: s.id,
    program_id: s.program_id,
    title: s.title || s.programs?.name || "Therapy Session",
    price: s.price || 1800,
    duration: s.session_duration_minutes || 60,
    type: s.offering_type || '1:1_CALL'
  })) || [];

  return (
    <div className="min-h-screen bg-[#111224] text-white selection:bg-[#BACCB3] selection:text-[#111224]">
      <Navbar />
      <main className="pt-20">
        <Suspense fallback={
          <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 italic text-zinc-600">
            <div className="h-10 w-10 border-2 border-[#BACCB3]/20 border-t-[#BACCB3] rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Initializing Booking Protocol...</p>
          </div>
        }>
          <BookingJourneyClient 
            services={formattedServices}
            childrenData={children}
            providers={[{ 
              id: partner.id, 
              name: partner.name, 
              profile_image: partner.avatar_url, 
              avatar_url: partner.avatar_url,
              verified: partner.approval_status === 'APPROVED'
            }]}
            isGuest={!userData.user}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
