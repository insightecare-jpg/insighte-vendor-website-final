-- 0007_reminders_cron.sql
-- Setting up automated reminders using pg_cron.

-- Enable pg_cron if not already enabled (Requires superuser usually, Supabase handles this via extensions)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to process and send reminders
-- This function will insert into the notifications table, which can trigger Edge Functions or Realtime
CREATE OR REPLACE FUNCTION public.process_booking_reminders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 24h Reminders
    INSERT INTO public.notifications (user_id, type, title, body, metadata)
    SELECT 
        b.client_id,
        'booking_reminder_24h',
        'Session Reminder: 24 Hours to Go',
        'Your session for ' || p.name || ' is scheduled in 24 hours.',
        jsonb_build_object('booking_id', b.id, 'scheduled_at', b.scheduled_at)
    FROM public.bookings b
    JOIN public.programs p ON b.provider_service_id = b.service_id -- simplified join for prototype
    WHERE b.status = 'confirmed'
    AND b.scheduled_at <= (now() + interval '24 hours')
    AND b.scheduled_at > (now() + interval '23 hours')
    AND NOT EXISTS (
        SELECT 1 FROM public.notifications n 
        WHERE n.user_id = b.client_id 
        AND n.type = 'booking_reminder_24h' 
        AND (n.metadata->>'booking_id')::uuid = b.id
    );

    -- Provider 24h Reminder
    INSERT INTO public.notifications (user_id, type, title, body, metadata)
    SELECT 
        b.provider_id,
        'booking_reminder_provider_24h',
        'Upcoming Session: 24 Hours',
        'You have a session scheduled with ' || u.email || ' in 24 hours.',
        jsonb_build_object('booking_id', b.id, 'scheduled_at', b.scheduled_at)
    FROM public.bookings b
    JOIN public.users u ON b.client_id = u.id
    WHERE b.status = 'confirmed'
    AND b.scheduled_at <= (now() + interval '24 hours')
    AND b.scheduled_at > (now() + interval '23 hours')
    AND NOT EXISTS (
        SELECT 1 FROM public.notifications n 
        WHERE n.user_id = b.provider_id 
        AND n.type = 'booking_reminder_provider_24h' 
        AND (n.metadata->>'booking_id')::uuid = b.id
    );
END;
$$;

-- Schedule the job to run every hour
SELECT cron.schedule('process-reminders', '0 * * * *', 'SELECT public.process_booking_reminders()');
