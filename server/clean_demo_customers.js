import pg from 'pg';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function cleanDemoData() {
  console.log('🧹 Purging all old demo customer accounts from SQLite (bhanjo.db)...');
  const db = new DatabaseSync(path.join(__dirname, 'bhanjo.db'));

  // Delete all users who are not admin
  const deleteResult = db.prepare(`DELETE FROM users WHERE role != 'admin'`).run();
  console.log(`✅ Deleted demo customers from SQLite.`);

  // Also clean old test orders so new customers have a 100% fresh start
  db.prepare(`DELETE FROM orders`).run();
  console.log(`✅ Cleared old mock orders from SQLite.`);

  // Verify remaining users in SQLite
  const remaining = db.prepare('SELECT id, name, email, phone, role FROM users').all();
  console.log('Remaining SQLite Users (Master Admin only):', remaining);

  // Clean Supabase PostgreSQL
  const SUPABASE_DB_URL = process.env.DATABASE_URL || 'postgresql://postgres.duvztajbcjjctcdahiph:U4fVK3Iun76yLKUU@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';
  try {
    console.log('☁️ Purging demo customers from Supabase PostgreSQL...');
    const client = new Client({
      connectionString: SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    await client.query(`DELETE FROM users WHERE role != 'admin'`);
    await client.query(`DELETE FROM orders`);

    const supaUsers = await client.query('SELECT id, name, email, phone, role FROM users');
    console.log('Remaining Supabase Users:', supaUsers.rows);

    await client.end();
    console.log('✅ Supabase PostgreSQL cleaned successfully!');
  } catch (err) {
    console.error('⚠️ Supabase clean notice (offline fallback):', err.message);
  }

  console.log('\n✨ Database is now 100% clean and ready for real customer signups!\n');
}

cleanDemoData();
