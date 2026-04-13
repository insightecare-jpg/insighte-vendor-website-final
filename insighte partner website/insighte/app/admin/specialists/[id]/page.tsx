import React from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProfileHeader from "../_components/ProfileHeader";
import IdentitySection from "../_components/Sections/Identity";
import ServicesPackagesSection from "../_components/Sections/ServicesPackages";
import AvailabilitySection from "../_components/Sections/Availability";
import ClientRosterSection from "../_components/Sections/ClientRoster";
import SessionHistorySection from "../_components/Sections/SessionHistory";
import EarningsSection from "../_components/Sections/Earnings";
import TestimonialsSection from "../_components/Sections/Testimonials";
import DangerZoneSection from "../_components/Sections/DangerZone";

export default async function SpecialistDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  
  const { data: specialist, error } = await supabase
    .from('partners')
    .select(`
      *,
      user:users (*)
    `)
    .eq('id', params.id)
    .single();

  if (!specialist || error) notFound();

  return (
    <div className="min-h-screen bg-[#111224] text-white overflow-x-hidden">
      {/* STICKY TOP BAR */}
      <ProfileHeader specialist={specialist} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16 pb-32">
        
        {/* SECTION 1: IDENTITY */}
        <section id="identity" className="scroll-mt-32">
          <IdentitySection specialist={specialist} />
        </section>

        {/* SECTION 2: SERVICES & PACKAGES */}
        <section id="services" className="scroll-mt-32">
          <ServicesPackagesSection specialist={specialist} />
        </section>

        {/* SECTION 3: AVAILABILITY */}
        <section id="availability" className="scroll-mt-32">
          <AvailabilitySection specialist={specialist} />
        </section>

        {/* SECTION 4: CLIENT ROSTER */}
        <section id="clients" className="scroll-mt-32">
          <ClientRosterSection specialist={specialist} />
        </section>

        {/* SECTION 5: SESSION HISTORY */}
        <section id="sessions" className="scroll-mt-32">
          <SessionHistorySection specialist={specialist} />
        </section>

        {/* SECTION 6: INVOICES & EARNINGS */}
        <section id="earnings" className="scroll-mt-32">
          <EarningsSection specialist={specialist} />
        </section>

        {/* SECTION 7: TESTIMONIALS */}
        <section id="testimonials" className="scroll-mt-32">
          <TestimonialsSection specialist={specialist} />
        </section>

        {/* SECTION 8: DANGER ZONE */}
        <section id="danger" className="scroll-mt-32 pb-20">
          <DangerZoneSection specialist={specialist} />
        </section>

      </div>
    </div>
  );
}
