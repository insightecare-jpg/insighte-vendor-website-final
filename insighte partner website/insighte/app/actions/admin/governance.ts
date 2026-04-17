'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin tasks
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  )
}

export async function promoteToAdmin(email: string) {
  const supabase = await getSupabase()
  
  // 1. Verify caller is admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: caller } = await supabase.from('users').select('role').eq('id', user?.id).single()
  
  if (caller?.role !== 'ADMIN') {
    throw new Error('Unauthorized: Only admins can promote other users')
  }

  // 2. Promote target
  const { data: target, error } = await supabase
    .from('users')
    .update({ role: 'ADMIN' })
    .eq('email', email)
    .select()
    .single()

  if (error) throw new Error('User not found or database error')

  revalidatePath('/admin')
  return { success: true, target_email: target.email }
}

export async function checkApiHealth() {
  const missing = []
  if (!process.env.RAZORPAY_KEY_ID) missing.push('Razorpay Key ID')
  if (!process.env.RAZORPAY_KEY_SECRET) missing.push('Razorpay Key Secret')
  if (!process.env.RESEND_API_KEY) missing.push('Resend API Key')
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('Supabase URL')
  
  return {
    isHealthy: missing.length === 0,
    missingKeys: missing
  }
}
