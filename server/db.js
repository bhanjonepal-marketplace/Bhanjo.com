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

  CREATE TABLE IF NOT EXISTS deleted_products (
    id TEXT PRIMARY KEY,
    deleted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS flash_sale_items (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    flash_price REAL NOT NULL,
    original_price REAL NOT NULL,
    discount_percent REAL NOT NULL,
    duration_hours INTEGER DEFAULT 4,
    duration_minutes INTEGER DEFAULT 0,
    ends_at DATETIME NOT NULL,
    total_stock INTEGER DEFAULT 50,
    sold_stock INTEGER DEFAULT 18,
    session_time TEXT DEFAULT '12:00',
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

  CREATE TABLE IF NOT EXISTS customer_cart (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    title TEXT NOT NULL,
    image TEXT,
    unit_price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    order_type TEXT DEFAULT 'retail',
    custom_notes TEXT DEFAULT '',
    item_data_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id, order_type)
  );

  CREATE TABLE IF NOT EXISTS customer_wishlist (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_data_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS flash_sale_settings (
    id TEXT PRIMARY KEY,
    title TEXT DEFAULT 'FLASH SALE',
    subtitle TEXT DEFAULT 'Massive limited-time price drops • Direct China Factory Pricing • Refreshes Hourly',
    badge_text TEXT DEFAULT 'International Direct Deals',
    sales_count_text TEXT DEFAULT '🔥 570K+ Sold Across Nepal',
    countdown_label TEXT DEFAULT 'Current Rush Session Ends In:',
    duration_hours INTEGER DEFAULT 4,
    duration_minutes INTEGER DEFAULT 28,
    duration_seconds INTEGER DEFAULT 15,
    ends_at DATETIME,
    session_name TEXT DEFAULT '⚡ ONGOING RUSH',
    upcoming_sessions_json TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS vouchers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tag TEXT DEFAULT 'HOURLY DROP',
    expiry_text TEXT DEFAULT 'Expiring in 2 hours',
    code TEXT DEFAULT 'BHANJO500',
    discount_amount REAL DEFAULT 500,
    min_spend REAL DEFAULT 1500,
    icon TEXT DEFAULT '🎁',
    color TEXT DEFAULT 'purple',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_claimed_vouchers (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    voucher_id TEXT NOT NULL,
    claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, voucher_id)
  );
`);

// Create indexes for instant fast lookups per customer
try {
  db.exec(`CREATE INDEX IF NOT EXISTS idx_customer_cart_user ON customer_cart(user_id);`);
} catch (e) {}
try {
  db.exec(`CREATE INDEX IF NOT EXISTS idx_customer_wishlist_user ON customer_wishlist(user_id);`);
} catch (e) {}
try {
  db.exec(`CREATE INDEX IF NOT EXISTS idx_user_claimed_vouchers ON user_claimed_vouchers(user_id);`);
} catch (e) {}

// Seed default flash sale settings if not exist
try {
  const existingSettings = db.prepare('SELECT id FROM flash_sale_settings WHERE id = ?').get('active');
  if (!existingSettings) {
    const defaultUpcoming = [
      { id: '16:00', time: '16:00', title: '16:00 Coming Up', tag: 'Soon' },
      { id: '20:00', time: '20:00', title: '20:00 Night Drop', tag: 'Popular' },
      { id: 'tomorrow', time: 'Tomorrow 10:00', title: 'Tomorrow 10:00 Mega Drop', tag: 'Huge Deals' }
    ];
    const defaultEndsAt = new Date(Date.now() + (4 * 3600000) + (28 * 60000) + (15 * 1000)).toISOString();

    db.prepare(`
      INSERT INTO flash_sale_settings 
      (id, title, subtitle, badge_text, sales_count_text, countdown_label, duration_hours, duration_minutes, duration_seconds, ends_at, session_name, upcoming_sessions_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'active',
      'FLASH SALE',
      'Massive limited-time price drops • Direct China Factory Pricing • Refreshes Hourly',
      'International Direct Deals',
      '🔥 570K+ Sold Across Nepal',
      'Current Rush Session Ends In:',
      4,
      28,
      15,
      defaultEndsAt,
      '⚡ ONGOING RUSH',
      JSON.stringify(defaultUpcoming)
    );
  }
} catch (e) {
  console.warn('Flash settings init note:', e.message);
}

// Seed default vouchers if empty
try {
  const vCount = db.prepare('SELECT COUNT(*) as count FROM vouchers').get();
  if (vCount && vCount.count === 0) {
    const defaultVouchers = [
      {
        id: 'vouch-250',
        title: 'Rs. 250 Off',
        tag: 'Flash Voucher',
        expiry_text: 'Min Spend Rs. 1,000',
        code: 'FLASH250',
        discount_amount: 250,
        min_spend: 1000,
        icon: '⚡',
        color: 'amber',
        is_active: 1
      },
      {
        id: 'vouch-500',
        title: 'Rs. 500 Gift Voucher',
        tag: 'Hourly Drop',
        expiry_text: 'Expiring in 2 hours',
        code: 'GIFT500',
        discount_amount: 500,
        min_spend: 2000,
        icon: '🎁',
        color: 'purple',
        is_active: 1
      }
    ];

    const ins = db.prepare(`
      INSERT INTO vouchers (id, title, tag, expiry_text, code, discount_amount, min_spend, icon, color, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    defaultVouchers.forEach(v => {
      ins.run(v.id, v.title, v.tag, v.expiry_text, v.code, v.discount_amount, v.min_spend, v.icon, v.color, v.is_active);
    });
  }
} catch (e) {
  console.warn('Vouchers init note:', e.message);
}

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
  db.exec(`ALTER TABLE users ADD COLUMN landmark TEXT;`);
} catch (e) {}
try {
  db.exec(`ALTER TABLE users ADD COLUMN gender TEXT;`);
} catch (e) {}
try {
  db.exec(`ALTER TABLE users ADD COLUMN dob TEXT;`);
} catch (e) {}
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
