"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function scheduleSession(data: {
    client_id: string;
    child_id: string;
    provider_id: string;
    service_id: string;
    scheduled_at: string;
    package_purchase_id?: string;
    notes?: string;
}) {
    const supabase = await createClient();
    
    // 1. Create Booking
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
            client_id: data.client_id,
            child_id: data.child_id,
            provider_id: data.provider_id,
            service_id: data.service_id,
            scheduled_at: data.scheduled_at,
            start_time: data.scheduled_at, // For legacy compatibility
            package_purchase_id: data.package_purchase_id,
            status: 'upcoming'
        })
        .select()
        .single();

    if (bookingError) return { error: bookingError.message };

    // 2. Decrement Package if applicable
    if (data.package_purchase_id) {
        await supabase.rpc('decrement_package_session', { purchase_id: data.package_purchase_id });
    }

    // 3. Notifications (Internal)
    await supabase.from('notifications').insert([
        {
            user_id: data.client_id,
            type: 'BOOKING_CONFIRMED',
            title: 'Protocol Initialized',
            body: `Session scheduled for ${data.scheduled_at}.`
        },
        {
            user_id: data.provider_id,
            type: 'NEW_BOOKING',
            title: 'New Family Sync',
            body: `A new session has been added to your timeline.`
        }
    ]);

    revalidatePath('/admin/families');
    return { success: true };
}

export async function cancelBooking(bookingId: string, reason: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('bookings')
        .update({ 
            status: 'cancelled',
            cancellation_reason: reason 
        })
        .eq('id', bookingId);
    
    if (error) return { error: error.message };
    revalidatePath('/admin/families');
    return { success: true };
}
