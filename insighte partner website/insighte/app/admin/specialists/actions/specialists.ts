"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * CERTIFY: immediately sets provider_approvals.status = 'approved', 
 * sets users.is_approved = true, inserts notification for the specialist.
 */
export async function approveSpecialist(id: string) {
    const supabase = await createClient();
    
    // 1. Update partner status
    const { error: partnerError } = await supabase
        .from('partners')
        .update({ approval_status: 'APPROVED' })
        .eq('id', id);
        
    if (partnerError) return { error: partnerError.message };

    // 2. Fetch user_id for notification
    const { data: partner } = await supabase.from('partners').select('user_id').eq('id', id).single();
    if (partner?.user_id) {
        // 3. Update user status
        await supabase.from('profiles').update({ is_verified: true }).eq('id', partner.user_id);
        
        // 4. Send Notification
        await supabase.from('notifications').insert({
            user_id: partner.user_id,
            type: 'SYSTEM',
            title: "Profile Approved",
            body: "Your Institutional Registry profile is now live. Families can find and book you."
        });
    }

    revalidatePath('/admin/specialists');
    return { success: true };
}

export async function rejectSpecialist(id: string, reason: string) {
    const supabase = await createClient();
    const { data: partner } = await supabase.from('partners').select('user_id').eq('id', id).single();

    const { error } = await supabase
        .from('partners')
        .update({ approval_status: 'DEACTIVATED' })
        .eq('id', id);

    if (partner?.user_id) {
        await supabase.from('notifications').insert({
            user_id: partner.user_id,
            type: 'ALERT',
            title: "Clarification Needed",
            body: reason
        });
    }

    revalidatePath('/admin/specialists');
    return { success: true };
}

export async function toggleFeatureSpecialist(id: string, current: boolean) {
    const supabase = await createClient();
    const { data: partner } = await supabase.from('partners').select('user_id').eq('id', id).single();
    
    if (partner?.user_id) {
        await supabase.from('users').update({ 
            is_featured: !current,
            featured_at: !current ? new Date().toISOString() : null
        }).eq('id', partner.user_id);

        if (!current) {
            await supabase.from('notifications').insert({
                user_id: partner.user_id,
                type: 'SYSTEM',
                title: "You're Featured!",
                body: "Your profile is now featured at the top of specialist listings."
            });
        }
    }

    revalidatePath('/admin/specialists');
    return { success: true };
}

export async function suspendSpecialist(id: string, reason: string) {
    const supabase = await createClient();
    const { data: partner } = await supabase.from('partners').select('user_id').eq('id', id).single();

    if (partner?.user_id) {
        await supabase.from('users').update({ 
            suspended_at: new Date().toISOString(),
            suspended_reason: reason
        }).eq('id', partner.user_id);

        await supabase.from('partners').update({ approval_status: 'SUSPENDED' }).eq('id', id);

        await supabase.from('notifications').insert({
            user_id: partner.user_id,
            type: 'ALERT',
            title: "Account Suspended",
            body: reason
        });
    }

    revalidatePath('/admin/specialists');
    return { success: true };
}

export async function createSpecialist(formData: any) {
    const supabase = await createClient();
    
    // 1. Create Profile (Admin onboarding)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
            full_name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: 'PROVIDER',
            is_verified: false
        })
        .select()
        .single();

    if (profileError) return { error: profileError.message };

    // 2. Create Partner Record
    const { error: partnerError } = await supabase
        .from('partners')
        .insert({
            user_id: profile.id,
            name: `${formData.firstName} ${formData.lastName}`,
            tier: formData.tier,
            city: formData.location,
            bio: formData.bio,
            approval_status: 'PENDING_REVIEW'
        });

    if (partnerError) return { error: partnerError.message };

    revalidatePath('/admin/specialists');
    return { success: true };
}
