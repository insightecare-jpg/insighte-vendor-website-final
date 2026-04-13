-- Decrement package session count
CREATE OR REPLACE FUNCTION public.decrement_package_session(purchase_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.package_purchases
    SET sessions_remaining = sessions_remaining - 1
    WHERE id = purchase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
