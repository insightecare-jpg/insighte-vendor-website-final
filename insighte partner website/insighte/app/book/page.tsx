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

  // Fetch Providers
  const { data: providers } = await supabase
    .from("providers")
    .select("id, name, profile_image, verified")
    .order("name");

  return (
    <BookingJourneyClient 
      services={services || []} 
      childrenData={childrenData} 
      providers={providers || []}
      isGuest={!user}
    />
  );
}
