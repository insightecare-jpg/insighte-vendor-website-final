import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BookingJourneyClient from "@/components/booking/BookingJourneyClient";

export default async function BookingJourney() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Services from public.services table
  const { data: services } = await supabase
    .from("services")
    .select("id, title, price, duration")
    .order("title");

  // Fetch Children linked to this parent (only if logged in)
  let childrenData: any[] = [];
  if (user) {
    const { data: children } = await supabase
      .from("children")
      .select("id, name, age")
      .eq("parent_id", user.id)
      .order("name");
    if (children) {
      childrenData = children;
    }
  }

  // Fetch Providers (Partners)
  const { data: providers } = await supabase
    .from("partners")
    .select("id, name, avatar_url, approval_status")
    .eq("approval_status", "LIVE")
    .order("name");

  const formattedProviders = providers?.map((p: any) => ({
     ...p,
     profile_image: p.avatar_url,
     verified: p.approval_status === 'LIVE' || p.approval_status === 'APPROVED'
  })) || [];

  return (
    <BookingJourneyClient 
      services={services || []} 
      childrenData={childrenData} 
      providers={formattedProviders}
      isGuest={!user}
    />
  );
}
