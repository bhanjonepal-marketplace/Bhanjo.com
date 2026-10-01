import bcrypt from 'bcryptjs';
import pg from 'pg';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_EMAIL = 'prashannaghim@gmail.com';
const ADMIN_PHONE = '9705435590';
const ADMIN_NAME = 'Prashanna Ghimire';
const ADMIN_PASS_PLAIN = 'Bhanjo#Master2026!SecureKey%9705';

async function setupMasterAdmin() {
  console.log('🔒 Generating bcrypt hash for Master Admin password...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(ADMIN_PASS_PLAIN, salt);

  // 1. Update SQLite
  console.log('📦 Updating SQLite (bhanjo.db)...');
  const db = new DatabaseSync(path.join(__dirname, 'bhanjo.db'));
  
  // Check if admin already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ? OR phone = ?').get(ADMIN_EMAIL, ADMIN_PHONE);
  const adminId = existing ? existing.id : `admin-${Date.now()}`;

  if (existing) {
    db.prepare(`
      UPDATE users 
      SET name = ?, email = ?, phone = ?, password = ?, role = 'admin'
      WHERE id = ?
    `).run(ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, hashedPassword, adminId);
    console.log(`✅ SQLite updated for existing admin (ID: ${adminId})`);
  } else {
    db.prepare(`
      INSERT INTO users (id, name, email, phone, password, role, address, city, province, postal_code, avatar)
      VALUES (?, ?, ?, ?, ?, 'admin', 'Master Admin HQ, Kathmandu', 'Kathmandu', 'Bagmati Province', '44600', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')
    `).run(adminId, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, hashedPassword);
    console.log(`✅ SQLite inserted new master admin (ID: ${adminId})`);
  }

  // Verify SQLite entry
  const check = db.prepare('SELECT id, name, email, phone, role FROM users WHERE role = ?').all('admin');
  console.log('Verified SQLite Admins:', check);

  // 2. Update Supabase PostgreSQL
  const SUPABASE_DB_URL = process.env.DATABASE_URL || 'postgresql://postgres.duvztajbcjjctcdahiph:U4fVK3Iun76yLKUU@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';
  try {
    console.log('☁️ Syncing Master Admin with Supabase PostgreSQL...');
    const client = new Client({
      connectionString: SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    await client.query(`
      INSERT INTO users (id, name, email, phone, password, role, address, city, province, postal_code, avatar)
      VALUES ($1, $2, $3, $4, $5, 'admin', 'Master Admin HQ, Kathmandu', 'Kathmandu', 'Bagmati Province', '44600', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')
      ON CONFLICT (email) DO UPDATE 
      SET name = EXCLUDED.name, phone = EXCLUDED.phone, password = EXCLUDED.password, role = 'admin';
    `, [adminId, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, hashedPassword]);

    console.log('✅ Supabase PostgreSQL synced with Master Admin credentials!');
    await client.end();
  } catch (err) {
    console.error('⚠️ Supabase sync note (offline fallback active):', err.message);
  }

  console.log('\n=======================================');
  console.log('MASTER ADMIN INITIALIZATION SUCCESSFUL!');
  console.log('Email:    ', ADMIN_EMAIL);
  console.log('Phone:    ', ADMIN_PHONE);
  console.log('Password: ', ADMIN_PASS_PLAIN);
  console.log('Role:      admin');
  console.log('=======================================\n');
}

setupMasterAdmin();
