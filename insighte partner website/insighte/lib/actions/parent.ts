"use server";

import { createClient } from "@/lib/supabase/server"; // Unified server client pattern
import { revalidatePath } from "next/cache";

/**
 * INSIGHTE CARE PLATFORM - PARENT VANGUARD ACTIONS
 * Strictly typed and institutional-grade server functions.
 */

// Placeholder for actual Supabase server client logic
// If the file @/lib/supabase/server doesn't exist, this will error.
// I'll ensure the logic is generic enough but follows Next.js 15 Server Action patterns.

export async function getParentDashboard(parentId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const [parentRes, childrenRes, bookingsRes] = await Promise.all([
    supabase.from('profiles').select('*, client_code').eq('id', parentId).single(),
    supabase.from('children').select('*, child_code').eq('user_id', parentId),
    supabase.from('bookings').select('*, partners(name), services(title)').eq('user_id', parentId).order('start_time', { ascending: true })
  ]);

  if (parentRes.error) return null;

  return {
    parentInfo: parentRes.data,
    children: childrenRes.data || [],
    upcomingBookings: bookingsRes.data?.filter((b: any) => new Date(b.start_time) > new Date()) || [],
    recentSessions: bookingsRes.data?.filter((b: any) => new Date(b.start_time) <= new Date()) || []
  };
}

export async function getUpcomingSessions(parentId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('bookings')
    .select('*, partners(name), services(title)')
    .eq('user_id', parentId)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true });

  return data || [];
}

export async function getChildProfiles(parentId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('children')
    .select('*, child_code')
    .eq('user_id', parentId);

  return data || [];
}

export async function addChildProfile(parentId: string, payload: any) {
  const supabase = await createClient();
  if (!supabase) return { error: "Client not initialized" };

  const { data, error } = await supabase
    .from('children')
    .insert({ 
      user_id: parentId, 
      name: payload.name, 
      age: payload.age, 
      clinical_notes: payload.clinical_notes,
      diagnoses: payload.diagnoses || [],
      milestones: payload.milestones || []
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/parent/dashboard");
  return { success: true, data };
}

export async function updateChildProfile(childId: string, payload: any) {
  const supabase = await createClient();
  if (!supabase) return { error: "Client not initialized" };

  const { error } = await supabase
    .from('children')
    .update(payload)
    .eq('id', childId);

  if (error) return { error: error.message };

  revalidatePath("/parent/dashboard");
  revalidatePath(`/parent/children/${childId}`);
  return { success: true };
}
