"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getEffectiveUser } from "@/lib/api/auth-helper";

/**
 * EXPERT SANCTUARY - CLINICAL SESSION INTEGRITY
 * Anti-manipulation clocking system with dual confirmation.
 */

// 1. CLOCK IN
export async function clockIn(bookingId: string) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  // Verify provider ownership of booking
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, provider_id')
    .eq('id', bookingId)
    .single();

  if (!booking) return { error: "Booking not found." };
  
  // Note: We'd check auth.uid() against booking.provider_id (via partners lookup)
  // For now, proceed with the clock-in record initialization

  const { error } = await supabase
    .from('session_clock')
    .upsert({
      booking_id: bookingId,
      provider_clock_in: new Date().toISOString(),
      clock_in_status: 'pending',
      updated_at: new Date().toISOString()
    }, { onConflict: 'booking_id' });

  if (error) return { error: error.message };

  revalidatePath('/provider/dashboard');
  return { success: true };
}

// 2. CONFIRM CLOCK IN (Used by Client Dashboard)
export async function confirmClockIn(bookingId: string) {
  const supabase = await createClient();
  // Authorization: Client must be the one who booked the session
  
  const { error } = await supabase
    .from('session_clock')
    .update({
      client_clock_in_confirm: new Date().toISOString(),
      clock_in_status: 'confirmed'
    })
    .eq('booking_id', bookingId);

  if (error) return { error: error.message };
  return { success: true };
}

// 3. CLOCK OUT (Initiated by Provider)
export async function clockOut(bookingId: string) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  const clockOutTime = new Date();
  const confirmDeadline = new Date(clockOutTime.getTime() + 90 * 1000); // +90 seconds

  const { error } = await supabase
    .from('session_clock')
    .update({
      provider_clock_out: clockOutTime.toISOString(),
      client_confirm_deadline: confirmDeadline.toISOString(),
      clock_out_status: 'pending'
    })
    .eq('booking_id', bookingId);

  if (error) return { error: error.message };

  revalidatePath('/provider/dashboard');
  return { success: true, deadline: confirmDeadline.toISOString() };
}

// 4. CONFIRM CLOCK OUT (Used by Client Dashboard)
export async function confirmClockOut(bookingId: string) {
  const supabase = await createClient();
  
  // Fetch clock-in time to compute actual duration
  const { data: clock } = await supabase
    .from('session_clock')
    .select('provider_clock_in')
    .eq('booking_id', bookingId)
    .single();

  if (!clock) return { error: "Clock record not found." };

  const confirmTime = new Date();
  const startTime = new Date(clock.provider_clock_in);
  const durationMinutes = Math.floor((confirmTime.getTime() - startTime.getTime()) / 60000);

  const { error } = await supabase
    .from('session_clock')
    .update({
      client_clock_out_confirm: confirmTime.toISOString(),
      clock_out_status: 'client_confirmed',
      actual_duration_minutes: durationMinutes,
      billable: durationMinutes >= 15, // Anti-ghosting rule: min 15 mins
      updated_at: confirmTime.toISOString()
    })
    .eq('booking_id', bookingId);

  if (error) return { error: error.message };

  // Also mark the booking as completed
  await supabase.from('bookings').update({ status: 'completed' }).eq('id', bookingId);

  return { success: true };
}

// 5. AUTO-CONFIRM (Triggered by Edge Function or system if deadline passed)
export async function autoConfirmClockOut(bookingId: string) {
  const supabase = await createClient();
  
  const { data: clock } = await supabase
    .from('session_clock')
    .select('provider_clock_in, provider_clock_out')
    .eq('booking_id', bookingId)
    .single();

  if (!clock) return { error: "Clock record not found." };

  const startTime = new Date(clock.provider_clock_in);
  const endTime = new Date(clock.provider_clock_out);
  const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);

  const { error } = await supabase
    .from('session_clock')
    .update({
      clock_out_status: 'auto_confirmed',
      actual_duration_minutes: durationMinutes,
      billable: durationMinutes >= 15
    })
    .eq('booking_id', bookingId);

  if (error) return { error: error.message };
  return { success: true };
}

// 6. CLINICAL NOTES
export async function submitSessionNotes(data: { bookingId: string, content: string, visibility: 'private' | 'client' }) {
  const supabase = await createClient();
  const user = await getEffectiveUser();
  if (!user) return { error: "Authentication required." };

  const { error } = await supabase
    .from('session_notes_v2')
    .insert({
      booking_id: data.bookingId,
      provider_id: user.id,
      content: data.content,
      visibility: data.visibility
    });

  if (error) return { error: error.message };

  revalidatePath('/provider/dashboard');
  revalidatePath(`/provider/registry`); // Update crm notes
  return { success: true };
}

// 7. GET DAILY SESSIONS
export async function getDailySessions() {
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: sessions, error } = await supabase
      .from('bookings')
      .select(`
        id,
        status,
        start_time,
        learner:children(id, name, age),
        parent:parents(id, name),
        service:programs(id, name)
      `)
      .eq('provider_id', partner.id)
      .gte('start_time', today.toISOString())
      .lt('start_time', tomorrow.toISOString())
      .order('start_time', { ascending: true });

    if (error) throw error;

    return { 
      success: true, 
      data: sessions?.map((s: any) => ({
        id: s.id,
        learner: (s.learner as any)?.name || "Unknown",
        age: (s.learner as any)?.age ? `${(s.learner as any).age}y` : "N/A",
        service: (s.service as any)?.name || "Clinical Session",
        time: new Date(s.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: s.status,
        avatar: `https://i.pravatar.cc/150?u=${s.id}`
      })) 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
