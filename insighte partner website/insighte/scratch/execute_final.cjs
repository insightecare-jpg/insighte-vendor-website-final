const { Client } = require('pg');
const fs = require('fs');

const CONNECTION_STRING = "postgresql://postgres:Mentor%402025@riukjenrqfdsbvsessmk.supabase.co:6543/postgres";
const SQL_PATH = "supabase/migrations/0015_final_sovereignty.sql";

async function run() {
  console.log('Reading migration file...');
  const sql = fs.readFileSync(SQL_PATH, 'utf8');
  
  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to Supabase Postgres...');
    await client.connect();
    
    console.log('Executing Final Backend Sovereignty Migration...');
    await client.query(sql);
    
    console.log('SUCCESS: Backend Sovereignty established.');
  } catch (err) {
    console.error('MIGRATION FAILED:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
