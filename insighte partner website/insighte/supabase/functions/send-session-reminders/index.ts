import { getAdminClient } from '../_shared/supabase.ts'
import { sendEmail } from '../_shared/email.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { hours_ahead } = await req.json()
    const supabase = getAdminClient()

    // Find bookings starting in the next [hours_ahead ± 30min] window
    const windowStart = new Date(Date.now() + (hours_ahead - 0.5) * 3600 * 1000)
    const windowEnd = new Date(Date.now() + (hours_ahead + 0.5) * 3600 * 1000)

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id, scheduled_at, duration_minutes,
        provider_id, client_id,
        child:children(name),
        provider:users!bookings_provider_id_fkey(email),
        client:users!bookings_client_id_fkey(email)
      `)
      .eq('status', 'confirmed')
      .gte('scheduled_at', windowStart.toISOString())
      .lte('scheduled_at', windowEnd.toISOString())

    if (error) throw error

    const results = await Promise.allSettled(
      bookings?.map(async (booking) => {
        const date = new Date(booking.scheduled_at)
        const dateStr = date.toLocaleDateString('en-IN', {
          weekday: 'long', day: 'numeric', month: 'long'
        })
        const timeStr = date.toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
        })
        const program = "Your Insighte Session"; // Fallback if program name lookup is complex

        // Email to client
        await sendEmail({
          to: booking.client.email,
          subject: `Reminder: Session with your specialist ${hours_ahead === 24 ? 'tomorrow' : 'in 1 hour'}`,
          html: `
            <p>Hi,</p>
            <p>This is a reminder that <strong>${booking.child?.name}</strong>'s 
            session is ${hours_ahead === 24 ? 'tomorrow' : 'starting in 1 hour'}.</p>
            <p><strong>Date:</strong> ${dateStr}<br>
            <strong>Time:</strong> ${timeStr} IST<br>
            <strong>Duration:</strong> ${booking.duration_minutes} minutes</p>
            <p>The Insighte Team</p>
          `,
        })

        // Email to provider
        await sendEmail({
          to: booking.provider.email,
          subject: `Reminder: Session ${hours_ahead === 24 ? 'tomorrow' : 'in 1 hour'}`,
          html: `
            <p>Hi,</p>
            <p>You have a session ${hours_ahead === 24 ? 'tomorrow' : 'in 1 hour'} 
            with ${booking.child?.name}.</p>
            <p><strong>Date:</strong> ${dateStr}<br>
            <strong>Time:</strong> ${timeStr} IST</p>
          `,
        })

        // Insert in-app notifications
        await supabase.from('notifications').insert([
          {
            user_id: booking.client_id,
            type: 'session_reminder',
            title: hours_ahead === 24 ? 'Session tomorrow' : 'Session starting soon',
            body: `${booking.child?.name}'s session at ${timeStr}`,
            metadata: { booking_id: booking.id }
          },
          {
            user_id: booking.provider_id,
            type: 'session_reminder',
            title: hours_ahead === 24 ? 'Session tomorrow' : 'Session in 1 hour',
            body: `Session with ${booking.child?.name} at ${timeStr}`,
            metadata: { booking_id: booking.id }
          }
        ])
      }) ?? []
    )

    return new Response(
      JSON.stringify({ sent: results.filter(r => r.status === 'fulfilled').length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
