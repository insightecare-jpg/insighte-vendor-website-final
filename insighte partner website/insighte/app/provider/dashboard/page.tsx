"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function ProviderDashboardPage() {
  const cookieStore = await cookies();
  const supabase = await createClient();
  
  const devRole = cookieStore.get('insighte-dev-role')?.value;
  let userId: string | undefined;

  if (devRole && (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEV_MODE === 'true')) {
    userId = '00000000-0000-0000-0000-000000000000';
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id;
  }

  let safePartner = null;
  let status = "PENDING";
  let clockData = null;

  if (userId) {
    // 1. Fetch Partner
    const { data: partner } = await supabase
      .from('partners')
      .select('id, name, avatar_url, category, approval_status, user_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (partner) {
      safePartner = partner;
      status = partner.approval_status || "PENDING";

      // 2. Fetch Active Clock 
      const { data: activeClock } = await supabase
        .from('session_clock')
        .select('*')
        .eq('clock_out_status', 'pending')
        .maybeSingle();
      
      clockData = activeClock;
    }
  }

  return <DashboardClient partner={safePartner} status={status} initialClock={clockData} />;
}
