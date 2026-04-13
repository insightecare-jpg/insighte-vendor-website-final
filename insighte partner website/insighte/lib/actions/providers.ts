"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * INSIGHTE CARE PLATFORM - PARTNER VANGUARD ACTIONS
 * Dynamic data fetching for the Marketplace & Profile Sanctuary.
 */

export async function getPublicProviders() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('partners')
    .select('*, services(*)');

  if (error) {
    console.error("Error fetching partners:", error.message);
    return [];
  }

  return data || [];
}

export async function getFeaturedProviders() {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('partners')
    .select('*, services(*)')
    .eq('is_featured', true)
    .limit(10);

  if (error) {
    console.error("Error fetching featured partners:", error.message);
    return [];
  }

  return data || [];
}

export async function getProviderById(identifier: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

  const { data, error } = await supabase
    .from('partners')
    .select('*, services(*), reviews(*), slots(*)')
    .eq(isUuid ? 'id' : 'slug', identifier)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching partner ${identifier}:`, error.message);
    return null;
  }

  if (!data) return null;

  // Filter slots to show only available ones by default
  return {
    ...data,
    slots: (data.slots || []).filter((s: any) => s.status === 'available')
  };
}

/**
 * SEEDING FUNCTIONALITY
 * To be used sparingly for initial development.
 */
export async function seedInitialProviders() {
  const supabase = await createClient();
  if (!supabase) return { error: "Client not initialized" };

  const initialPartners = [
    {
      name: "Dr. Priya Sharma",
      category: "Therapy",
      bio: "Clinical psychologist specializing in neuro-developmental support and family guidance through evidence-based ABA therapy.",
      slug: "priya-sharma",
      verified: true
    },
    {
      name: "Mr. Rahul Iyer",
      category: "Speech Therapy",
      bio: "Dedicated speech-language pathologist helping children overcome communication hurdles with fun, engaging virtual sessions.",
      slug: "rahul-iyer",
      verified: true
    }
  ];

  const { data: partners, error: partnerError } = await supabase
    .from('partners')
    .upsert(initialPartners, { onConflict: 'name' })
    .select();

  if (partnerError) return { error: partnerError.message };

  // Seed services, reviews, and slots
  for (const partner of (partners || [])) {
    // 1. Services
    await supabase.from('services').upsert([
      { 
        provider_id: partner.id, 
        title: "Sanctuary Momentum Session",
        price: partner.category === 'insighte' ? 1800 : 2200,
        duration: 60,
        type: "1:1 Video Call",
        description: "A deep-dive clinical session focused on immediate progress."
      }
    ], { onConflict: 'provider_id, title' });

    // 2. Reviews (Mock data)
    await supabase.from('reviews').upsert([
      {
        provider_id: partner.id,
        parent_name: "Anita Deshmukh",
        rating: 5,
        content: `Amazing progress with ${partner.name.split(' ')[0]}. The neuro-affirming approach really works for our son.`
      }
    ], { onConflict: 'provider_id, content' }).select();

    // 3. Slots (Next 3 days)
    const today = new Date();
    const mockSlots = Array.from({ length: 3 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 1);
      date.setHours(10, 0, 0, 0);
      const end = new Date(date);
      end.setHours(11, 0, 0, 0);
      return {
        provider_id: partner.id,
        start_time: date.toISOString(),
        end_time: end.toISOString(),
        status: 'available'
      };
    });
    
    await supabase.from('slots').upsert(mockSlots);
  }

  revalidatePath("/marketplace");
  revalidatePath("/providers/[slug]");
  return { success: true, count: partners?.length };
}
