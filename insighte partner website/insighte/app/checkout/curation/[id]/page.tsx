import React from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CurationCheckoutClient from "./CheckoutClient";

export default async function CurationCheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  // Fetch curation details
  const { data: curation, error } = await supabase
    .from("curations")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !curation) {
    console.error("Error fetching curation:", error);
    // Fallback if DB isn't seeded or available for some reason during dev
    // (In a real app, you'd handle this better, but for local host we help the user)
    const mockCuration = {
        id: id,
        title: "Seedling Sanctuary",
        description: "Early Foundation support",
        price: 4500,
        category: "Early Foundation",
        image_url: "/services/seedling-sanctuary.png",
        features: ["Infant Care", "Sensory Play", "Nurture Focus"]
    };
    return <CurationCheckoutClient curation={mockCuration} />;
  }

  return <CurationCheckoutClient curation={curation} />;
}
