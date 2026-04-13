import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function audit() {
  const { data: tables, error } = await supabase.rpc('get_schema_details');
  
  if (error) {
    console.error('Error fetching schema via RPC. Trying information_schema query...');
    // Fallback to direct SQL if RPC doesn't exist
    const { data: info, error: sqlError } = await supabase.from('_dummy').select('*').limit(1); // Force a query to get a client
    // Actually, I'll just use the SQL editor if I could, but I can use an SQL query via the REST API for information_schema
    const { data: columns, error: colError } = await supabase
      .rpc('exec_sql', { sql: "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position" });
    
    if (colError) {
       console.log("Could not run exec_sql RPC. Listing tables via manual search...");
       // List most common tables mentioned
       const tablesToCheck = [
         'users','profiles','children','bookings','sessions',
         'session_notes_v2','session_clock','invoices','payments',
         'packages','package_purchases','provider_services',
         'provider_kyc','blog_posts','support_tickets','programs',
         'availability_slots','testimonials','notifications','audit_logs',
         'pincode_areas','child_milestones','coupons'
       ];
       
       for(const table of tablesToCheck) {
         const { data, error } = await supabase.from(table).select('*').limit(1);
         if (error) {
           console.log(`[ABSENT] ${table}: ${error.message}`);
         } else {
           console.log(`[EXISTS] ${table}`);
           if (data && data.length > 0) {
             console.log(` Columns: ${Object.keys(data[0]).join(', ')}`);
           }
         }
       }
    } else {
      console.log(JSON.stringify(columns, null, 2));
    }
  } else {
    console.log(JSON.stringify(tables, null, 2));
  }
}

audit();
