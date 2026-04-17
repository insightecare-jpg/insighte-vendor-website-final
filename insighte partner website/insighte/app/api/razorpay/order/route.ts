import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { amount, currency = 'INR', metadata } = await req.json()

    const options = {
      amount: amount, // amount in the smallest currency unit (paise for INR)
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: metadata || {}
    }

    const order = await razorpay.orders.create(options)

    // Store order in DB if it's for an invoice
    if (metadata?.invoice_id) {
      await supabase
        .from('invoices')
        .update({ razorpay_order_id: order.id })
        .eq('id', metadata.invoice_id)
    }

    return NextResponse.json(order)
  } catch (err: any) {
    console.error('Razorpay Order Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
