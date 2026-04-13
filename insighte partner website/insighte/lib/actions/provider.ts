"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getEffectiveUser } from "@/lib/api/auth-helper";

/**
 * INSIGHTE CARE PLATFORM - PROVIDER CORE ACTIONS
 * Handles profile, services, and schedule management.
 */

export async function updateProviderProfile(data: any) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  // Update partners table (The Marketplace Source of Truth)
  const { error } = await supabase
    .from('partners')
    .update({
      name: data.name,
      bio: data.bio,
      tagline: data.tagline,
      experience_years: data.experience_years,
      city: data.city,
      location: data.location,
      languages: data.languages,
      avatar_url: data.avatar_url,
      profile_image: data.avatar_url, // Synchronize legacy column
      academic_experience: data.academic_experience,
      professional_experience: data.professional_experience,
      coords: data.coords,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/provider/profile');
  revalidatePath('/provider/dashboard');
  return { success: true };
}

export async function updateProviderServices(offerings: any[]) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  // 1. Get Partner ID
  const { data: partner } = await supabase
    .from('partners')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!partner) return { error: "Provider record not found." };

  // 2. Clear old offerings
  await supabase.from('services').delete().eq('provider_id', partner.id);

  // 3. Insert new offerings
  const { error } = await supabase.from('services').insert(
    offerings.map(o => ({
      provider_id: partner.id,
      program_id: o.program_id,
      title: o.title,
      price: o.price,
      session_duration_minutes: o.duration,
      offering_type: o.type,
      is_active: true
    }))
  );

  if (error) return { error: error.message };

  revalidatePath('/provider/services');
  return { success: true };
}

export async function submitKYC(kycData: any) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  // 1. Get Provider ID (from providers table or partners)
  const { data: provider } = await supabase
    .from('providers')
    .select('id')
    .eq('name', (await supabase.from('partners').select('name').eq('user_id', user.id).single()).data?.name) // Temporary lookup logic
    .single();

  // Actually, let's use the partner.id as the unified ID if possible, 
  // but for now we follow the schema which references providers(id).
  
  const { error } = await supabase
    .from('kyc_records')
    .upsert({
      provider_id: provider?.id,
      pan_number: kycData.pan,
      bank_name: kycData.bankName,
      account_number: kycData.accountNumber,
      ifsc_code: kycData.ifsc,
      account_holder_name: kycData.holderName,
      status: 'PENDING',
      updated_at: new Date().toISOString()
    });

  if (error) return { error: error.message };

  revalidatePath('/provider/finance');
  return { success: true };
}

export async function updateProviderAvailability(availability: any) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  // Update providers table
  const { error } = await supabase
    .from('providers')
    .update({
      weekly_availability: availability,
      updated_at: new Date().toISOString()
    })
    .eq('id', (await supabase.from('partners').select('id').eq('user_id', user.id).single()).data?.id); // Should ideally match profile ID logic

  if (error) return { error: error.message };

  revalidatePath('/provider/schedule');
  return { success: true };
}

