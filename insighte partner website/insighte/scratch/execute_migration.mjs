import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

const CONNECTION_STRING = "postgresql://postgres:Mentor%402025@db.riukjenrqfdsbvsessmk.supabase.co:5432/postgres";
const SQL_FILE_PATH = "/Users/midhunnoble/Documents/antigravity/insighte partner website/insighte/supabase/migrations/20240413_backend_implementation_final.sql";

async function run() {
  const sql = fs.readFileSync(SQL_FILE_PATH, 'utf8');
  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Executing migration...');
    await client.query(sql);
    console.log('Migration SUCCESSFUL!');
  } catch (err) {
    console.error('Migration FAILED:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
    if (err.hint) console.error('Hint:', err.hint);
  } finally {
    await client.end();
  }
}

run();
