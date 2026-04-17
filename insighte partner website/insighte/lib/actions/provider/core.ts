"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getEffectiveUser } from "@/lib/api/auth-helper";

/**
 * EXPERT SANCTUARY - CORE ARCHITECTURE
 */

// 1. GET PROVIDER SERVICES HUB
export async function getProviderServices() {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { success: false, error: "Auth required" };

  const { data: partner } = await supabase.from('partners').select('id').eq('user_id', user.id).single();
  if (!partner) return { success: false, error: "Partner link missing" };

  const [catalogRes, selectedRes, regionsRes, selectedRegionsRes] = await Promise.all([
    supabase.from('programs').select('*').order('display_order'),
    supabase.from('provider_services').select('*').eq('provider_id', partner.id),
    supabase.from('master_regions').select('*'),
    supabase.from('service_regions').select('region_id').eq('provider_id', partner.id)
  ]);

  return {
    success: true,
    catalog: catalogRes.data || [],
    selected: selectedRes.data?.map((s: any) => ({ program_id: s.program_id, title: s.title, price: s.price, duration: s.duration })) || [],
    regions: regionsRes.data || [],
    selectedRegions: selectedRegionsRes.data?.map((r: any) => r.region_id) || []
  };
}

// 2. UPDATE PROVIDER SERVICES ARCHITECTURE
export async function updateProviderServices(services: any[], regions: string[]) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { success: false, error: "Auth required" };

  const { data: partner } = await supabase.from('partners').select('id').eq('user_id', user.id).single();
  if (!partner) return { success: false, error: "Partner link missing" };

  // Update Services
  await supabase.from('provider_services').delete().eq('provider_id', partner.id);
  if (services.length > 0) {
    await supabase.from('provider_services').insert(
      services.map((s: any) => ({
        provider_id: partner.id,
        program_id: s.program_id,
        title: s.title,
        price: s.price,
        duration: s.duration
      }))
    );
  }

  // Update Regions
  await supabase.from('service_regions').delete().eq('provider_id', partner.id);
  if (regions.length > 0) {
    await supabase.from('service_regions').insert(
      regions.map(rid => ({ provider_id: partner.id, region_id: rid }))
    );
  }

  revalidatePath('/provider/services');
  return { success: true };
}

// 3. GET FINANCE SUMMARY
export async function getFinanceSummary() {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { success: false, error: "Auth required" };

  const { data: partner } = await supabase.from('partners').select('id').eq('user_id', user.id).single();
  if (!partner) return { success: false, error: "Partner link missing" };

  const { data: clockins } = await supabase
    .from('session_clock')
    .select(`
      *,
      learner:learners(full_name),
      service:provider_services(title)
    `)
    .eq('provider_id', partner.id)
    .order('clock_in', { ascending: false });

  const { data: kyc } = await supabase.from('kyc_records').select('*').eq('provider_id', partner.id).single();

  return {
    success: true,
    history: clockins || [],
    kyc: kyc || null
  };
}

// 4. SUBMIT KYC
export async function submitKYC(kycData: any) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { success: false, error: "Auth required" };

  const { data: partner } = await supabase.from('partners').select('id').eq('user_id', user.id).single();
  if (!partner) return { success: false, error: "Partner link missing" };

  const { error } = await supabase
    .from('kyc_records')
    .upsert({
      provider_id: partner.id,
      pan_number: kycData.pan,
      bank_name: kycData.bankName,
      account_number: kycData.accountNumber,
      ifsc_code: kycData.ifsc,
      account_holder_name: kycData.holderName,
      status: 'PENDING',
      submitted_at: new Date().toISOString()
    });

  if (error) return { success: false, error: error.message };

  revalidatePath('/provider/finance');
  return { success: true };
}

// 5. GET PROFILE DETAILS
export async function getProfileDetails() {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { success: false, error: "Auth required" };

  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
  const { data: partner } = await supabase.from('partners').select('*, services(*), reviews(*), slots(*)').eq('user_id', user.id).single();
  
  return {
    success: true,
    profile,
    partner
  };
}

// 6. UPDATE PROFILE
export async function updateProfileDetails(profileData: any, partnerData: any) {
    const supabase = await createClient();
    const user = await getEffectiveUser();
    if (!user) return { success: false, error: "Auth required" };

    const { error: pErr } = await supabase.from('profiles').update(profileData).eq('user_id', user.id);
    const { error: partErr } = await supabase.from('partners').update(partnerData).eq('user_id', user.id);

    if (pErr || partErr) return { success: false, error: pErr?.message || partErr?.message };

    revalidatePath('/provider/profile');
    return { success: true };
}

// 7. GET PROVIDER REVIEWS
export async function getProviderReviews() {
    const supabase = await createClient();
    const user = await getEffectiveUser();
    if (!user) return { success: false, error: "Auth required" };

    const { data: partner } = await supabase.from('partners').select('id').eq('user_id', user.id).single();
    if (!partner) return { success: false, error: "Partner link missing" };

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('provider_id', partner.id)
        .order('created_at', { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, reviews: data };
}

// 8. TOGGLE REVIEW LIVE STATUS
export async function toggleReviewLive(reviewId: string, isFeatured: boolean) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('reviews')
        .update({ is_featured: isFeatured })
        .eq('id', reviewId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/provider/profile');
    return { success: true };
}

// 9. SUBMIT PROFILE FOR REVIEW
export async function submitProfileForReview() {
    const supabase = await createClient();
    const user = await getEffectiveUser();
    if (!user) return { success: false, error: "Auth required" };

    const { error } = await supabase
        .from('partners')
        .update({ status: 'PENDING_REVIEW' })
        .eq('user_id', user.id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/provider/profile');
    return { success: true };
}
