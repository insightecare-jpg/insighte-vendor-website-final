import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://riukjenrqfdsbvsessmk.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpdWtqZW5ycWZkc2J2c2Vzc21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTAyMzgsImV4cCI6MjA5MDQ2NjIzOH0.3gndRl_qYo7BERiDQvb7V0PSCnsaNw2DZ93Vp-uCpPA'; // Using the one they provided + context

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function auditTable(tableName) {
  try {
    const { data, error } = await supabase.from(tableName).select().limit(1);
    if (error) {
      console.error(`Error fetching ${tableName}:`, error.message);
      return;
    }
    if (data && data.length > 0) {
      console.log(`[TABLE: ${tableName}] Columns:`, Object.keys(data[0]));
    } else {
      console.log(`[TABLE: ${tableName}] - Table exists but is empty.`);
    }
  } catch (err) {
    console.error(`Fatal error for ${tableName}:`, err.message);
  }
}

async function runAudit() {
  console.log('--- Database Schema Audit ---');
  await auditTable('users');
  await auditTable('profiles');
  await auditTable('partners');
  await auditTable('bookings');
  await auditTable('children');
  await auditTable('programs');
  console.log('--- End of Audit ---');
}

runAudit();
