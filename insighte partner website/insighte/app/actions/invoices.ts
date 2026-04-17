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

export async function fetchUserInvoices() {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function fetchProviderEarnings() {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('provider_id', user.id)
    .eq('status', 'paid')
    .order('paid_at', { ascending: false })

  if (error) throw error
  return data
}

export async function approveInvoice(invoiceId: string) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('invoices')
    .update({ status: 'issued', due_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString() })
    .eq('id', invoiceId)
    .eq('provider_id', user.id) // Only provider can issue draft

  if (error) throw error
  revalidatePath('/provider/billing')
  return { success: true }
}
