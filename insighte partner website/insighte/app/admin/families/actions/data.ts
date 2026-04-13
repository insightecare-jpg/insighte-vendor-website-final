"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchAllSpecialists() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('partners')
        .select('id, name, avatar_url, rating, category')
        .eq('approval_status', 'LIVE')
        .order('name');
    return data || [];
}

export async function fetchPrograms() {
    const supabase = await createClient();
    const { data } = await supabase.from('programs').select('*').order('name');
    return data || [];
}

export async function fetchServicesForSpecialist(providerId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .eq('is_active', true);
    return data || [];
}

export async function fetchAvailableSlots(providerId: string, date: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('slots')
        .select('*')
        .eq('provider_id', providerId)
        .eq('status', 'available')
        // Filter by date string matching
        .gte('start_time', `${date}T00:00:00`)
        .lte('start_time', `${date}T23:59:59`);
    return data || [];
}
