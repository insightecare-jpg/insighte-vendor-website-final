"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getEffectiveUser } from "@/lib/api/auth-helper";

/**
 * INSIGHTE CARE PLATFORM - SOVEREIGNTY ACTIONS
 * Handles profile live requests, deactivations, and hard deletions.
 * Adheres to "Institutional Stability" with auditing.
 */

export async function requestProfileLive(partnerId: string) {
  const supabase = await createClient();
  
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  // 1. Update Partner Status
  const { error } = await supabase
    .from('partners')
    .update({ approval_status: 'PENDING_REVIEW' })
    .eq('user_id', user.id === '00000000-0000-0000-0000-000000000000' ? partnerId : user.id); 
  
  if (error) return { error: error.message };

  // 2. Notify Admin
  await supabase.from('notifications').insert({
    user_id: user.id,
    type: 'REVIEW_REQUEST',
    title: 'New Profile Review Pending',
    body: `Clinical Specialist has requested institutional verification.`
  });

  revalidatePath('/provider/dashboard');
  return { success: true };
}

export async function deactivateProfile(partnerId: string, reason: string) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  // 1. Soft Delete (Update status)
  const { error } = await supabase
    .from('partners')
    .update({ is_active: false, approval_status: 'DEACTIVATED' })
    .eq('id', partnerId);
  
  if (error) return { error: error.message };

  // 2. Audit the event
  await supabase.from('audit_logs').insert({
    performer_id: user.id, 
    action: 'DEACTIVATE_PROFILE',
    entity_type: 'PARTNER',
    entity_id: partnerId,
    metadata: { reason }
  });

  revalidatePath('/admin/queue');
  revalidatePath('/provider/dashboard');
  return { success: true };
}

export async function purgeProfile(partnerId: string) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  // 1. Delayed Deletion (Set timestamp for 30-day grace period)
  const { error } = await supabase
    .from('partners')
    .update({ 
       approval_status: 'PENDING_PURGE',
       deletion_requested_at: new Date().toISOString()
    })
    .eq('id', partnerId);
  
  if (error) return { error: error.message };

  // 2. Audit the event (Critical for records)
  await supabase.from('audit_logs').insert({
    performer_id: user.id,
    action: 'INITIATE_DELAYED_PURGE',
    entity_type: 'PARTNER',
    entity_id: partnerId,
    metadata: { scheduled_purge_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
  });

  revalidatePath('/admin/queue');
  return { success: true };
}
