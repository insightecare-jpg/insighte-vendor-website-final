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
      name: "Dr. Aradhana Sharma",
      category: "insighte",
      bio: "12 years clinical excellence. Expert in early childhood language development and neuro-affirming support strategies.",
      slug: "aradhana-sharma",
      languages: ["English", "Hindi", "Kannada"],
      profile_image: "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=2600&auto=format&fit=crop",
      verified: true,
      experience_years: 12,
      city: "Bangalore",
      specializations: ["Speech", "Early Detection"],
      education: [
        { school: "National Institute of Speech & Hearing", degree: "Ph.D. in Speech-Language Pathology", year: "2012" },
        { school: "University of Mysore", degree: "M.Sc. in Audiology", year: "2008" }
      ],
      work_experience: [
        { company: "Fortis Hospitals", role: "Head of Speech Therapy", duration: "2015 - Present" },
        { company: "Manipal Hospitals", role: "Senior Consultant", duration: "2012 - 2015" }
      ],
      location_type: ["clinic", "home"],
      availability_timing: ["Morning", "Afternoon"]
    },
    {
      name: "Manish Verma",
      category: "premium",
      bio: "ABA Specialist focused on behavioral models and neuro-inclusive progress in clinical settings.",
      slug: "manish-verma",
      languages: ["English", "Hindi"],
      profile_image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2600&auto=format&fit=crop",
      verified: true,
      experience_years: 8,
      city: "Mumbai",
      specializations: ["Behavioral Therapy", "OT"],
      education: [
        { school: "TISS Mumbai", degree: "Masters in Applied Psychology", year: "2016" },
        { school: "BCBA Institute", degree: "Certified Behavior Analyst", year: "2017" }
      ],
      work_experience: [
        { company: "Insighte Mumbai", role: "Lead Behavioral Specialist", duration: "2019 - Present" },
        { company: "Child Development Centre", role: "Behavioral Therapist", duration: "2016 - 2019" }
      ],
      location_type: ["clinic"],
      availability_timing: ["Evening"]
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
        partner_id: partner.id, 
        title: "Sanctuary Momentum Session",
        price: partner.category === 'insighte' ? 1800 : 2200,
        duration: 60,
        type: "1:1 Video Call",
        description: "A deep-dive clinical session focused on immediate progress."
      }
    ], { onConflict: 'partner_id, title' });

    // 2. Reviews (Mock data)
    await supabase.from('reviews').upsert([
      {
        partner_id: partner.id,
        parent_name: "Anita Deshmukh",
        rating: 5,
        content: `Amazing progress with ${partner.name.split(' ')[0]}. The neuro-affirming approach really works for our son.`
      }
    ], { onConflict: 'partner_id, content' }).select();

    // 3. Slots (Next 3 days)
    const today = new Date();
    const mockSlots = Array.from({ length: 3 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 1);
      date.setHours(10, 0, 0, 0);
      const end = new Date(date);
      end.setHours(11, 0, 0, 0);
      return {
        partner_id: partner.id,
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
