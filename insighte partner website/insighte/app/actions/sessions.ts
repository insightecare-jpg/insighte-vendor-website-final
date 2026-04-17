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

export async function clockIn(bookingId: string) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify this booking belongs to the provider
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, provider_id, client_id, status')
    .eq('id', bookingId)
    .eq('provider_id', user.id)
    .single()

  if (!booking) throw new Error('Booking not found')
  if (booking.status !== 'confirmed') throw new Error('Booking is not confirmed')

  // Create clock record
  const { data: clock, error } = await supabase
    .from('session_clock')
    .insert({
      booking_id: bookingId,
      provider_clock_in: new Date().toISOString(),
      clock_in_status: 'pending'
    })
    .select()
    .single()

  if (error) throw error

  // Notify client to confirm clock-in
  await supabase.from('notifications').insert({
    user_id: booking.client_id,
    type: 'session_clock_in',
    title: 'Session started',
    body: 'Your specialist has started the session. Confirm you\'re ready.',
    metadata: { booking_id: bookingId, clock_id: clock.id }
  })

  revalidatePath('/provider/dashboard')
  return { success: true, clock_id: clock.id }
}

export async function confirmClockIn(bookingId: string) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('session_clock')
    .update({
      client_clock_in_confirm: new Date().toISOString(),
      clock_in_status: 'confirmed'
    })
    .eq('booking_id', bookingId)
    .eq('clock_in_status', 'pending')

  if (error) throw error
  revalidatePath('/parent/dashboard')
  return { success: true }
}

export async function clockOut(bookingId: string) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const now = new Date()
  const deadline = new Date(now.getTime() + 90 * 1000) // 90 seconds

  const { data: clock, error } = await supabase
    .from('session_clock')
    .update({
      provider_clock_out: now.toISOString(),
      client_confirm_deadline: deadline.toISOString(),
      clock_out_status: 'pending'
    })
    .eq('booking_id', bookingId)
    .select('*, booking:bookings(client_id)')
    .single()

  if (error) throw error

  // Notify client
  await supabase.from('notifications').insert({
    user_id: clock.booking.client_id,
    type: 'session_clock_out',
    title: 'Session ending',
    body: 'Your specialist is closing the session. Please confirm.',
    metadata: {
      booking_id: bookingId,
      deadline: deadline.toISOString()
    }
  })

  revalidatePath('/provider/dashboard')
  return { success: true, deadline: deadline.toISOString() }
}

export async function confirmClockOut(bookingId: string) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: clock } = await supabase
    .from('session_clock')
    .select('*')
    .eq('booking_id', bookingId)
    .single()

  if (!clock) throw new Error('Clock record not found')
  
  // Calculate duration
  const start = new Date(clock.provider_clock_in).getTime()
  const end = new Date().getTime()
  const durationMinutes = Math.round((end - start) / 60000)

  const { error } = await supabase
    .from('session_clock')
    .update({
      client_clock_out_confirm: new Date().toISOString(),
      clock_out_status: 'client_confirmed',
      actual_duration_minutes: durationMinutes,
      billable: durationMinutes >= 15
    })
    .eq('booking_id', bookingId)

  if (error) throw error

  // Mark booking completed
  await supabase
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', bookingId)

  // Trigger invoice via RPC
  if (durationMinutes >= 15) {
     await supabase.rpc('create_session_invoice', { p_booking_id: bookingId })
  }

  revalidatePath('/parent/dashboard')
  revalidatePath('/parent/sessions')
  return { success: true, duration_minutes: durationMinutes }
}
