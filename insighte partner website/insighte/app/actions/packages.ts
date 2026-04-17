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

export async function fetchAvailablePackages(programId?: string) {
  const supabase = await getSupabase()
  let query = supabase.from('packages').select('*').eq('is_active', true)
  if (programId) query = query.eq('program_id', programId)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function fetchUserPackages() {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('package_purchases')
    .select('*, package:packages(*)')
    .eq('client_id', user.id)
    .gt('sessions_remaining', 0)
    .gt('expires_at', new Date().toISOString())

  if (error) throw error
  return data
}

export async function createPackagePurchase(packageId: string) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('id', packageId)
    .single()

  if (!pkg) throw new Error('Package not found')

  const { data: purchase, error } = await supabase
    .from('package_purchases')
    .insert({
      package_id: packageId,
      client_id: user.id,
      sessions_remaining: pkg.total_sessions,
      expires_at: new Date(Date.now() + pkg.validity_days * 24 * 3600 * 1000).toISOString()
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/parent/packages')
  return purchase
}
