import { getAdminClient } from '../_shared/supabase.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { code, client_id, order_value } = await req.json()
    const supabase = getAdminClient()

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !coupon) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Coupon not found or inactive' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Basic Validations
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return new Response(JSON.stringify({ valid: false, error: 'Coupon has expired' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
      return new Response(JSON.stringify({ valid: false, error: 'Usage limit reached' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const discount = coupon.discount_type === 'percentage'
      ? Math.floor(order_value * (coupon.discount_value / 100))
      : coupon.discount_value

    return new Response(
      JSON.stringify({
        valid: true,
        coupon_id: coupon.id,
        discount_amount: discount,
        final_amount: order_value - discount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
