"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fetchPackages(filters: any) {
    const supabase = await createClient();
    let query = supabase
        .from('package_purchases')
        .select(`
            *,
            package:packages (name, session_count),
            client:profiles!package_purchases_client_id_fkey (full_name),
            provider:partners!package_purchases_provider_id_fkey (name)
        `)
        .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function topUpPackage(purchaseId: string, additionalSessions: number) {
    const supabase = await createClient();
    
    // Fetch current remaining
    const { data: purchase } = await supabase
        .from('package_purchases')
        .select('sessions_remaining')
        .eq('id', purchaseId)
        .single();
    
    if (!purchase) return { error: "Purchase not found" };

    const { error } = await supabase
        .from('package_purchases')
        .update({ 
            sessions_remaining: purchase.sessions_remaining + additionalSessions,
            status: 'active' // Auto-reactivate if it was exhausted
        })
        .eq('id', purchaseId);

    if (error) return { error: error.message };
    revalidatePath('/admin/families');
    return { success: true };
}
