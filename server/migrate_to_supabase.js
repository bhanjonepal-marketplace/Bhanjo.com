import pg from 'pg';
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_DB_URL = process.env.DATABASE_URL || 'postgresql://postgres.duvztajbcjjctcdahiph:U4fVK3Iun76yLKUU@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function migrate() {
  console.log('🚀 Connecting to Supabase PostgreSQL...');
  const client = new Client({
    connectionString: SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('✅ Connected to Supabase PostgreSQL successfully!');

  console.log('🛠️ Creating schema tables in Supabase...');

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE,
      phone VARCHAR(50) UNIQUE,
      password TEXT,
      role VARCHAR(50) DEFAULT 'customer',
      address TEXT,
      city VARCHAR(100) DEFAULT 'Kathmandu',
      province VARCHAR(100) DEFAULT 'Bagmati Province',
      postal_code VARCHAR(50) DEFAULT '44600',
      avatar TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sellers (
      id VARCHAR(255) PRIMARY KEY,
      store_name VARCHAR(255) NOT NULL,
      seller_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      pan_number VARCHAR(100),
      category VARCHAR(100),
      status VARCHAR(50) DEFAULT 'approved',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255),
      tracking_number VARCHAR(100),
      customer_name VARCHAR(255),
      customer_phone VARCHAR(50),
      customer_address TEXT,
      items_json TEXT NOT NULL,
      total_amount NUMERIC(12, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'NPR',
      payment_method VARCHAR(50) DEFAULT 'esewa',
      payment_status VARCHAR(50) DEFAULT 'paid',
      order_status VARCHAR(50) DEFAULT 'Processing',
      notes TEXT,
      cancel_reason TEXT,
      timeline_json TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id VARCHAR(255) PRIMARY KEY,
      product_id VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      user_city VARCHAR(100) DEFAULT 'Kathmandu',
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      is_verified BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      category_id VARCHAR(100),
      title TEXT,
      price NUMERIC(12, 2),
      data_json TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id VARCHAR(255) PRIMARY KEY,
      product_id VARCHAR(255),
      product_title TEXT,
      supplier_id VARCHAR(255),
      customer_name VARCHAR(255),
      phone VARCHAR(50),
      email VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'new',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
  `);

  console.log('✅ Tables created successfully!');

  // Migrate local SQLite records if sqlite db exists
  const sqlitePath = path.join(__dirname, 'bhanjo.db');
  console.log(`📦 Checking local SQLite database at: ${sqlitePath}`);

  try {
    const sqlite = new DatabaseSync(sqlitePath);

    // 1. Migrate Users
    const users = sqlite.prepare('SELECT * FROM users').all();
    console.log(`Found ${users.length} users in SQLite.`);
    for (const u of users) {
      await client.query(`
        INSERT INTO users (id, name, email, phone, password, role, address, city, province, postal_code, avatar)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          email = EXCLUDED.email,
          phone = EXCLUDED.phone,
          password = EXCLUDED.password,
          role = EXCLUDED.role;
      `, [
        u.id, u.name, u.email, u.phone, u.password, u.role || 'customer',
        u.address, u.city, u.province, u.postal_code, u.avatar
      ]);
    }

    // 2. Migrate Products
    const products = sqlite.prepare('SELECT * FROM products').all();
    console.log(`Found ${products.length} products in SQLite.`);
    for (const p of products) {
      await client.query(`
        INSERT INTO products (id, category_id, title, price, data_json)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          category_id = EXCLUDED.category_id,
          title = EXCLUDED.title,
          price = EXCLUDED.price,
          data_json = EXCLUDED.data_json;
      `, [p.id, p.category_id, p.title, p.price, p.data_json]);
    }

    // 3. Migrate Sellers
    const sellers = sqlite.prepare('SELECT * FROM sellers').all();
    console.log(`Found ${sellers.length} sellers in SQLite.`);
    for (const s of sellers) {
      await client.query(`
        INSERT INTO sellers (id, store_name, seller_name, phone, email, city, pan_number, category, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING;
      `, [s.id, s.store_name, s.seller_name, s.phone, s.email, s.city, s.pan_number, s.category, s.status]);
    }

    // 4. Migrate Orders
    const orders = sqlite.prepare('SELECT * FROM orders').all();
    console.log(`Found ${orders.length} orders in SQLite.`);
    for (const o of orders) {
      await client.query(`
        INSERT INTO orders (id, user_id, tracking_number, customer_name, customer_phone, customer_address, items_json, total_amount, currency, payment_method, payment_status, order_status, notes, cancel_reason, timeline_json)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO NOTHING;
      `, [
        o.id, o.user_id, o.tracking_number, o.customer_name, o.customer_phone, o.customer_address,
        o.items_json, o.total_amount, o.currency, o.payment_method, o.payment_status,
        o.order_status, o.notes, o.cancel_reason, o.timeline_json
      ]);
    }

    // 5. Migrate Reviews
    const reviews = sqlite.prepare('SELECT * FROM reviews').all();
    console.log(`Found ${reviews.length} reviews in SQLite.`);
    for (const r of reviews) {
      await client.query(`
        INSERT INTO reviews (id, product_id, user_name, user_city, rating, comment, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;
      `, [r.id, r.product_id, r.user_name, r.user_city, r.rating, r.comment, r.is_verified === 1 || r.is_verified === true]);
    }

    // 6. Migrate Inquiries
    const inquiries = sqlite.prepare('SELECT * FROM inquiries').all();
    console.log(`Found ${inquiries.length} inquiries in SQLite.`);
    for (const i of inquiries) {
      await client.query(`
        INSERT INTO inquiries (id, product_id, product_title, supplier_id, customer_name, phone, email, message, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING;
      `, [i.id, i.product_id, i.product_title, i.supplier_id, i.customer_name, i.phone, i.email, i.message, i.status]);
    }

    console.log('🎉 Data migration from SQLite to Supabase PostgreSQL completed successfully!');
  } catch (err) {
    console.error('Migration note:', err.message);
  }

  // Verify counts in Supabase
  const userCount = (await client.query('SELECT count(*) FROM users')).rows[0].count;
  const prodCount = (await client.query('SELECT count(*) FROM products')).rows[0].count;
  const orderCount = (await client.query('SELECT count(*) FROM orders')).rows[0].count;
  console.log(`\n📊 Live Supabase Cloud Database Status:`);
  console.log(`- Users in Supabase: ${userCount}`);
  console.log(`- Products in Supabase: ${prodCount}`);
  console.log(`- Orders in Supabase: ${orderCount}`);

  await client.end();
}

migrate().catch(console.error);
