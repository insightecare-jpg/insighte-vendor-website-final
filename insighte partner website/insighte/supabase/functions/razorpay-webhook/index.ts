import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const signature = req.headers.get('x-razorpay-signature')
  const body = await req.text()

  // Verify Webhook Signature
  const expectedSignature = hmac('sha256', Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!, body, 'utf8', 'hex')
  
  if (signature !== expectedSignature) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 })
  }

  const event = JSON.parse(body)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    const orderId = payment.order_id

    // Check if it's an invoice payment
    const { data: invoice } = await supabase
      .from('invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('razorpay_order_id', orderId)
      .select()
      .single()

    if (invoice) {
      await supabase.from('payments').insert({
        invoice_id: invoice.id,
        external_id: payment.id,
        external_order_id: orderId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        metadata: payment.notes
      })
    }

    // Check if it's a package purchase
    await supabase
      .from('package_purchases')
      .update({ status: 'active' })
      .eq('razorpay_order_id', orderId)
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
