"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getEffectiveUser } from "@/lib/api/auth-helper";

export async function getProviderSlots(providerId: string, date: string) {
  const supabase = await createClient();
  
  // Fetch slots for the provider on the specific date
  // Assuming slots are stored as timestamps
  const { data, error } = await supabase
    .from('slots')
    .select('*')
    .eq('provider_id', providerId)
    .eq('status', 'available')
    .gte('start_time', `${date}T00:00:00Z`)
    .lte('start_time', `${date}T23:59:59Z`);
  
  if (error) return [];
  return data;
}


export async function createBooking(data: {
  provider_id: string;
  client_id?: string;
  child_id: string;
  service_id: string;
  slot_id: string | null;
  start_time: string;
  end_time: string;
  total_price: number;
}) {
  const supabase = await createClient();
  const user = await getEffectiveUser();

  if (!user) return { error: "Authorization Protocol Failed: No active session." };
  
  // 1. Create the booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      provider_id: data.provider_id,
      client_id: user.id === '00000000-0000-0000-0000-000000000000' ? data.client_id : user.id, // Use data.client_id for bypass
      child_id: data.child_id,
      service_id: data.service_id,
      start_time: data.start_time,
      end_time: data.end_time,
      total_price: data.total_price,
      status: 'pending'
    })
    .select()
    .single();
  
  if (bookingError) return { error: bookingError.message };

  // 2. Mark the slot as booked
  if (data.slot_id) {
    const { error: slotError } = await supabase
      .from('slots')
      .update({ status: 'booked' })
      .eq('id', data.slot_id);
    
    if (slotError) return { error: slotError.message };
  }


  revalidatePath('/parent/dashboard');
  return { success: true, bookingId: booking.id };
}
