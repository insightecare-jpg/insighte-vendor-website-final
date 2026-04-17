'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  )
}

export async function createBooking(data: {
  provider_id: string
  child_id: string
  provider_service_id: string
  scheduled_at: string
  duration_minutes?: number
  package_purchase_id?: string
}) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      client_id: user.id,
      ...data,
      status: data.package_purchase_id ? 'confirmed' : 'pending'
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/parent/sessions')
  revalidatePath('/provider/dashboard')
  return { success: true, booking_id: booking.id }
}

export async function cancelBooking(bookingId: string, reason: string) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('bookings')
    .update({ 
      status: 'cancelled',
      cancellation_reason: reason,
      cancelled_by: user.id
    })
    .eq('id', bookingId)
    .or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)

  if (error) throw error

  revalidatePath('/parent/sessions')
  revalidatePath('/provider/dashboard')
  return { success: true }
}

export async function fetchUserBookings(role: 'client' | 'provider') {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      child:children(name),
      partner:partners(*)
    `)
    .eq(role === 'client' ? 'client_id' : 'provider_id', user.id)
    .order('scheduled_at', { ascending: false })

  if (error) throw error
  return data
}
