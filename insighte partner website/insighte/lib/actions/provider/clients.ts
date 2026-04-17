"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getEffectiveUser } from "@/lib/api/auth-helper";

/**
 * EXPERT SANCTUARY - CLIENT REGISTRY & ONBOARDING
 * CRM logic for managing clinical relationships and invitations.
 */

// 1. FETCH REGISTRY (Master CRM View)
export async function getRegistry() {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { success: false, error: "Authentication required." };

  try {
    // 1. Resolve Partner ID
    const { data: partner } = await supabase
      .from('partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!partner) return { success: false, error: "Expert identity not found." };

    // 2. Fetch unique clients linked to this provider via bookings
    // Ideally we'd have a 'provider_clients' table or a pivot. 
    // For MVP, we aggregate from bookings.
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        status,
        learner_id:children(id, name, age, diagnosis, city, location),
        parent_id:parents(id, name, email)
      `)
      .eq('provider_id', partner.id);

    if (error) throw error;

    // 3. Flatten/Deduplicate Identities
    const learnerMap = new Map();
    bookings?.forEach((b: any) => {
      const learner = b.learner_id as any;
      const parent = b.parent_id as any;
      if (learner && !learnerMap.has(learner.id)) {
        learnerMap.set(learner.id, {
          id: learner.id,
          full_name: learner.name,
          email: parent?.email || 'N/A',
          category: learner.diagnosis || 'Neuro-Developmental',
          location: learner.city || 'Bangalore',
          status: 'ACTIVE',
          sessions_count: bookings.filter((x: any) => (x.learner_id as any)?.id === learner.id).length
        });
      }
    });

    return { success: true, data: Array.from(learnerMap.values()) };
  } catch (error: any) {
    console.error("Registry Fetch Failure:", error);
    return { success: false, error: error.message };
  }
}

// 2. INVITE CLIENT
export async function inviteClient(email: string, name: string) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { success: false, error: "Authentication required." };

  try {
    const { data: partner } = await supabase
      .from('partners')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!partner) return { success: false, error: "Expert identity not found." };

    const token = Math.random().toString(36).substring(2, 15);
    const { error } = await supabase
      .from('registry_invites')
      .insert({
        provider_id: partner.id,
        email: email.toLowerCase(),
        learner_name: name,
        token: token,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

    if (error) throw error;

    revalidatePath('/provider/learners');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// 3. GET LEARNER TIMELINE
export async function getLearnerTimeline(learnerId: string) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { success: false, error: "Authentication required." };

  try {
    const { data: sessions, error } = await supabase
      .from('bookings')
      .select(`
        id,
        start_time,
        status,
        notes:session_notes_v2(content, created_at)
      `)
      .eq('child_id', learnerId)
      .order('start_time', { ascending: false });

    if (error) throw error;
    return { success: true, data: sessions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
