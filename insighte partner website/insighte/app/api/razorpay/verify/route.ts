import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      invoice_id,
      package_purchase_id
    } = await req.json()

    // 1. Verify Signature
    const secret = process.env.RAZORPAY_KEY_SECRET!
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 2. Update Database (Atomic check or wait for webhook)
    // We update here to give instant feedback, webhook is the source of truth.
    if (invoice_id) {
       await supabase
         .from('invoices')
         .update({ status: 'paid', paid_at: new Date().toISOString() })
         .eq('id', invoice_id)
       
       await supabase.from('payments').insert({
         invoice_id,
         external_id: razorpay_payment_id,
         external_order_id: razorpay_order_id,
         amount: 0, // Should fetch from Razorpay or metadata
         status: 'captured',
         signature: razorpay_signature
       })
    }

    if (package_purchase_id) {
      await supabase
        .from('package_purchases')
        .update({ status: 'active', razorpay_order_id })
        .eq('id', package_purchase_id)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Razorpay Verification Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
