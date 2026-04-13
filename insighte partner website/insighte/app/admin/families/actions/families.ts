"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * FETCH FAMILIES (Admin Focus)
 * Returns a data-dense aggregation of parents, children, and session status.
 */
export async function fetchFamilies(filters: {
  search?: string;
  status?: 'active' | 'deleted';
  program_id?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      is_active,
      deleted_at,
      deletion_reason,
      children (
        id,
        name,
        age,
        services_needed
      ),
      bookings (
        id,
        status,
        scheduled_at,
        provider_id
      )
    `)
    .eq('role', 'PARENT');

  if (filters.status === 'deleted') {
    query = query.eq('is_active', false).not('deleted_at', 'is', null);
  } else {
    query = query.eq('is_active', true);
  }

  if (filters.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  query = query.order('full_name', { ascending: true });

  // Handle pagination
  if (filters.limit) query = query.range(filters.offset || 0, (filters.offset || 0) + filters.limit - 1);

  const { data, error, count } = await query;
  
  if (error) throw error;
  return { data, count };
}

export async function updateChildProfile(childId: string, data: any) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('children')
        .update(data)
        .eq('id', childId);
    
    if (error) return { error: error.message };
    revalidatePath('/admin/families');
    return { success: true };
}

export async function softDeleteFamily(parentId: string, reason: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('profiles')
        .update({ 
            is_active: false, 
            deleted_at: new Date().toISOString(),
            deletion_reason: reason 
        })
        .eq('id', parentId);
        
    if (error) return { error: error.message };
    revalidatePath('/admin/families');
    return { success: true };
}
