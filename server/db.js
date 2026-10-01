import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new DatabaseSync(path.join(__dirname, 'bhanjo.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password TEXT,
    address TEXT,
    city TEXT DEFAULT 'Kathmandu',
    province TEXT DEFAULT 'Bagmati Province',
    postal_code TEXT DEFAULT '44600',
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sellers (
    id TEXT PRIMARY KEY,
    store_name TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT NOT NULL,
    pan_number TEXT,
    category TEXT,
    status TEXT DEFAULT 'approved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    tracking_number TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    items_json TEXT NOT NULL,
    total_amount REAL NOT NULL,
    currency TEXT DEFAULT 'NPR',
    payment_method TEXT DEFAULT 'esewa',
    payment_status TEXT DEFAULT 'paid',
    order_status TEXT DEFAULT 'Processing',
    notes TEXT,
    cancel_reason TEXT,
    timeline_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_city TEXT DEFAULT 'Kathmandu',
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    data_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    product_title TEXT,
    supplier_id TEXT,
    customer_name TEXT,
    phone TEXT,
    email TEXT,
    message TEXT,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Safe migrations for existing databases
try {
  db.exec(`ALTER TABLE orders ADD COLUMN tracking_number TEXT;`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE orders ADD COLUMN timeline_json TEXT;`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer';`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE orders ADD COLUMN user_id TEXT;`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE orders ADD COLUMN notes TEXT;`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE orders ADD COLUMN cancel_reason TEXT;`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE inquiries ADD COLUMN product_title TEXT;`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE inquiries ADD COLUMN supplier_id TEXT;`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE inquiries ADD COLUMN email TEXT;`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE inquiries ADD COLUMN status TEXT DEFAULT 'new';`);
} catch (e) {
  // column already exists
}
try {
  db.exec(`ALTER TABLE products ADD COLUMN category_id TEXT;`);
} catch (e) {}
try {
  db.exec(`ALTER TABLE products ADD COLUMN title TEXT;`);
} catch (e) {}
try {
  db.exec(`ALTER TABLE products ADD COLUMN price REAL;`);
} catch (e) {}
try {
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);`);
} catch (e) {}

// Customer users table starts clean - real users register via Email OTP verification

// Seed sample reviews if empty
try {
  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get();
  if (reviewCount && reviewCount.count === 0) {
    const seedReviews = [
      {
        id: 'rev-1',
        productId: 'prod-pashmina-shawl',
        userName: 'Sunita Shrestha',
        userCity: 'Lalitpur, Nepal',
        rating: 5,
        comment: 'The cashmere shawl is exceptionally soft and warm! Authentic Chyangra tag attached. Ordered and delivered to Patan the very next day with eSewa.'
      },
      {
        id: 'rev-2',
        productId: 'prod-pashmina-shawl',
        userName: 'Pooja Karki',
        userCity: 'Kathmandu, Nepal',
        rating: 5,
        comment: 'Pure luxury quality. Diamond weave pattern is pristine. Proud of Nepali craftsmanship!'
      },
      {
        id: 'rev-3',
        productId: 'prod-singing-bowl-set',
        userName: 'Bikash Gurung',
        userCity: 'Pokhara, Nepal',
        rating: 5,
        comment: 'The 7-metal sound harmonics sustain for almost 45 seconds! Perfect for our yoga retreat in Lakeside. Fast courier packaging.'
      },
      {
        id: 'rev-4',
        productId: 'prod-ilam-orthodox-tea',
        userName: 'Ramesh Adhikari',
        userCity: 'Biratnagar, Nepal',
        rating: 5,
        comment: 'Authentic first-flush aroma from Ilam. Once you drink this, you cannot go back to generic tea bags. 10/10!'
      },
      {
        id: 'rev-5',
        productId: 'prod-himalayan-shilajit-resin',
        userName: 'Deepak Thapa',
        userCity: 'Butwal, Nepal',
        rating: 5,
        comment: 'Pure gold-grade resin, dissolves completely in warm water. Felt energized within a week. Highly recommended authentic source.'
      },
      {
        id: 'rev-6',
        productId: 'prod-palpali-dhaka-fabric',
        userName: 'Manish Shrestha',
        userCity: 'Kathmandu, Nepal',
        rating: 5,
        comment: 'Genuine handloom Palpali Dhaka pattern. Used it for wedding kurtas and everyone was asking where we bought it!'
      }
    ];

    const insertRev = db.prepare(`
      INSERT INTO reviews (id, product_id, user_name, user_city, rating, comment, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    for (const r of seedReviews) {
      insertRev.run(r.id, r.productId, r.userName, r.userCity, r.rating, r.comment);
    }
  }
} catch (err) {
  console.log('Reviews seed note:', err.message);
}

// Orders table starts clean - real orders are created by authenticated customers during checkout

// Catalog products table is initialized empty; products are managed manually by the user

console.log('✅ SQLite Database initialized successfully with persistent tables and migrations.');

export default db;
