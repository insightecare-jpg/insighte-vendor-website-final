import Stripe from 'https://esm.sh/stripe@14'
import { getAdminClient } from '../_shared/supabase.ts'
import { sendEmail } from '../_shared/email.ts'
import { corsHeaders } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16', // Adjust to latest supported
  httpClient: Stripe.createFetchHttpClient(),
})

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 })
  }

  const supabase = getAdminClient()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const invoiceId = pi.metadata.invoice_id
      const packagePurchaseId = pi.metadata.package_purchase_id
      const clientId = pi.metadata.client_id

      if (invoiceId) {
        // Mark invoice paid
        const { data: invoice } = await supabase
          .from('invoices')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('id', invoiceId)
          .select('*, client:users!invoices_client_id_fkey(email)')
          .single()

        // Insert payment record
        await supabase.from('payments').insert({
          invoice_id: invoiceId,
          stripe_payment_intent_id: pi.id,
          amount: pi.amount,
          currency: pi.currency,
          status: 'succeeded'
        })

        // Notify client
        if (clientId) {
          await supabase.from('notifications').insert({
            user_id: clientId,
            type: 'payment_confirmed',
            title: 'Payment confirmed',
            body: `Your payment of ₹${pi.amount / 100} has been received.`,
            metadata: { invoice_id: invoiceId }
          })
        }
      }

      if (packagePurchaseId) {
        // Activate package purchase by linking payment intent
        await supabase
          .from('package_purchases')
          .update({ stripe_payment_intent_id: pi.id })
          .eq('id', packagePurchaseId)
      }
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})
