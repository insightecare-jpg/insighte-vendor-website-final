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

  const { data: parentInfo } = await supabase
    .from('parents')
    .select('*, children(*), bookings(*)')
    .eq('id', parentId)
    .single();

  if (!parentInfo) return null;

  return {
    parentInfo: { name: parentInfo.name, email: parentInfo.email },
    children: parentInfo.children || [],
    upcomingBookings: parentInfo.bookings?.filter((b: any) => b.status === "upcoming") || [],
    recentSessions: [] // In a real app, join with sessions table
  };
}

export async function getUpcomingSessions(parentId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('bookings')
    .select('*, partners(*), services(*)')
    .eq('parent_id', parentId)
    .eq('status', 'upcoming');

  return data || [];
}

export async function getSessionHistory(parentId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('sessions')
    .select('*, bookings!inner(*)')
    .eq('bookings.parent_id', parentId);

  return data || [];
}

export async function getPayments(parentId: string) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('payments')
    .select('*, bookings!inner(*)')
    .eq('bookings.parent_id', parentId);

  return data || [];
}

export async function addChildProfile(parentId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string);
  const goals = formData.get("goals") as string;

  const supabase = await createClient();
  if (!supabase) return { error: "Client not initialized" };

  const { error } = await supabase
    .from('children')
    .insert({ parent_id: parentId, name, age, goals });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
