import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const {
      type, // 'invoice' | 'package'
      invoice_id,
      package_purchase_id,
      amount,
      currency = 'inr',
      description,
      coupon_code,
      success_url,
      cancel_url,
    } = body

    // Validate coupon if provided via Edge Function call
    let finalAmount = amount
    let couponId = null

    if (coupon_code) {
      const couponRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/validate-coupon`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: coupon_code,
            client_id: user.id,
            order_value: amount
          })
        }
      )
      const couponData = await couponRes.json()
      if (couponData.valid) {
        finalAmount = couponData.final_amount
        couponId = couponData.coupon_id
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'], // Added 'card' as a default
      line_items: [{
        price_data: {
          currency,
          product_data: { name: description },
          unit_amount: finalAmount, // Already in minor units (paise/cents)
        },
        quantity: 1,
      }],
      metadata: {
        invoice_id: invoice_id || '',
        package_purchase_id: package_purchase_id || '',
        client_id: user.id,
        coupon_id: couponId || '',
      },
      success_url: success_url || `${process.env.NEXT_PUBLIC_APP_URL}/parent/payments?success=1`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_APP_URL}/parent/payments`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
