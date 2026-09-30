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

// Seed default demo user if not exists
try {
  const existingUser = db.prepare('SELECT id FROM users WHERE phone = ? OR email = ?').get('9841987654', 'prashant@bhanjo.com');
  if (!existingUser) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, phone, password, address, city, province, postal_code, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      'user-prashant',
      'Prashant Sharma',
      'prashant@bhanjo.com',
      '9841987654',
      'demo123',
      'New Road Gate, Ward #22, Kathmandu Valley',
      'Kathmandu',
      'Bagmati Province',
      '44600',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    );
  }
} catch (err) {
  console.log('User seed note:', err.message);
}

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

// Seed initial orders if empty
try {
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get();
  if (orderCount && orderCount.count === 0) {
    const seedOrders = [
      {
        id: 'ORD-884821',
        trackingNumber: 'BJ-EXP-884821',
        customerName: 'Siddhartha Joshi',
        customerPhone: '+977-9841234567',
        customerAddress: 'New Road Gate, Kathmandu Valley, Nepal',
        totalAmount: 35.0,
        currency: 'NPR',
        paymentMethod: 'eSewa',
        paymentStatus: 'paid',
        orderStatus: 'Out for Delivery',
        items: [
          {
            id: 'prod-pashmina-shawl',
            title: '100% Pure Himalayan Chyangra Cashmere Pashmina Shawl',
            image: 'https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=400',
            unitPriceUSD: 35.0,
            quantity: 1,
            totalPrice: 35.0
          }
        ],
        timeline: [
          { title: "Order Placed & Payment Verified", time: "Aug 26, 09:30 AM", completed: true },
          { title: "Merchant Packaging & Quality Check", time: "Aug 26, 02:15 PM", completed: true },
          { title: "Handed over to Bhanjo Express Hub (Kathmandu)", time: "Aug 27, 08:30 AM", completed: true },
          { title: "Out for Delivery by Courier Rider", time: "Aug 27, 11:20 AM", completed: true },
          { title: "Delivered to Customer", time: "Estimated within 2 hours", completed: false }
        ]
      },
      {
        id: 'ORD-772910',
        trackingNumber: 'BJ-EXP-772910',
        customerName: 'Pooja Thapa',
        customerPhone: '+977-9803112233',
        customerAddress: 'Lakeside Ward #6, Pokhara, Nepal',
        totalAmount: 54.0,
        currency: 'NPR',
        paymentMethod: 'Khalti',
        paymentStatus: 'paid',
        orderStatus: 'Delivered',
        items: [
          {
            id: 'prod-singing-bowl-set',
            title: '7-Metal Hand-Hammered Singing Bowl Chakra Set',
            image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400',
            unitPriceUSD: 54.0,
            quantity: 1,
            totalPrice: 54.0
          }
        ],
        timeline: [
          { title: "Order Placed & Payment Verified", time: "Aug 24, 10:15 AM", completed: true },
          { title: "Merchant Packaging & Quality Check", time: "Aug 24, 04:30 PM", completed: true },
          { title: "Dispatched via Pokhara Highway Express", time: "Aug 25, 07:00 AM", completed: true },
          { title: "Out for Delivery in Lakeside", time: "Aug 25, 01:15 PM", completed: true },
          { title: "Delivered to Customer", time: "Aug 25, 03:40 PM", completed: true }
        ]
      },
      {
        id: 'ORD-551029',
        trackingNumber: 'BJ-EXP-551029',
        customerName: 'Ramesh Adhikari',
        customerPhone: '+977-9851098765',
        customerAddress: 'Traffic Chowk, Butwal, Nepal',
        totalAmount: 25.6,
        currency: 'NPR',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'pending',
        orderStatus: 'Shipped',
        items: [
          {
            id: 'prod-himalayan-shilajit-resin',
            title: 'Gold Grade Pure Himalayan Shilajit Resin (50g)',
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400',
            unitPriceUSD: 12.8,
            quantity: 2,
            totalPrice: 25.6
          }
        ],
        timeline: [
          { title: "Order Placed (Cash on Delivery)", time: "Aug 26, 08:00 AM", completed: true },
          { title: "Merchant Packaging & Quality Check", time: "Aug 26, 12:45 PM", completed: true },
          { title: "Handed over to Bhanjo Express Hub", time: "Aug 27, 09:10 AM", completed: true },
          { title: "Out for Delivery by Courier Rider", time: "Pending", completed: false },
          { title: "Delivered to Customer", time: "Pending", completed: false }
        ]
      }
    ];

    const insertOrd = db.prepare(`
      INSERT INTO orders (id, tracking_number, customer_name, customer_phone, customer_address, items_json, total_amount, currency, payment_method, payment_status, order_status, timeline_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const o of seedOrders) {
      insertOrd.run(
        o.id,
        o.trackingNumber,
        o.customerName,
        o.customerPhone,
        o.customerAddress,
        JSON.stringify(o.items),
        o.totalAmount,
        o.currency,
        o.paymentMethod,
        o.paymentStatus,
        o.orderStatus,
        JSON.stringify(o.timeline)
      );
    }
  }
} catch (err) {
  console.log('Orders seed note:', err.message);
}

// Backfill any existing orders that had null tracking_number
try {
  const nullOrders = db.prepare('SELECT id FROM orders WHERE tracking_number IS NULL').all();
  const updateNull = db.prepare(`
    UPDATE orders 
    SET tracking_number = ?, 
        timeline_json = ? 
    WHERE id = ?
  `);
  for (const o of nullOrders) {
    const trackingNo = `BJ-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    const timeline = [
      { title: "Order Placed & Payment Verified", time: "Completed", completed: true },
      { title: "Merchant Packaging & Quality Check", time: "Completed", completed: true },
      { title: "Handed over to Bhanjo Express Hub", time: "Completed", completed: true },
      { title: "Out for Delivery by Courier Rider", time: "In Progress", completed: true },
      { title: "Delivered to Customer", time: "Pending", completed: false }
    ];
    updateNull.run(trackingNo, JSON.stringify(timeline), o.id);
  }
} catch (e) {
  console.log('Backfill note:', e.message);
}

// Ensure benchmark tracking order BJ-EXP-884821 exists
try {
  const benchmarkOrder = db.prepare('SELECT id FROM orders WHERE tracking_number = ?').get('BJ-EXP-884821');
  if (!benchmarkOrder) {
    const insertOrd = db.prepare(`
      INSERT INTO orders (id, tracking_number, customer_name, customer_phone, customer_address, items_json, total_amount, currency, payment_method, payment_status, order_status, timeline_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertOrd.run(
      'ORD-884821',
      'BJ-EXP-884821',
      'Siddhartha Joshi',
      '+977-9841234567',
      'New Road Gate, Kathmandu Valley, Nepal',
      JSON.stringify([{
        id: 'prod-pashmina-shawl',
        title: '100% Pure Himalayan Chyangra Cashmere Pashmina Shawl',
        image: 'https://images.unsplash.com/photo-1606744888344-493238955de0?auto=format&fit=crop&w=400',
        unitPriceUSD: 35.0,
        quantity: 1,
        totalPrice: 35.0
      }]),
      35.0,
      'NPR',
      'eSewa',
      'paid',
      'Out for Delivery',
      JSON.stringify([
        { title: "Order Placed & Payment Verified", time: "Aug 26, 09:30 AM", completed: true },
        { title: "Merchant Packaging & Quality Check", time: "Aug 26, 02:15 PM", completed: true },
        { title: "Handed over to Bhanjo Express Hub (Kathmandu)", time: "Aug 27, 08:30 AM", completed: true },
        { title: "Out for Delivery by Courier Rider", time: "Aug 27, 11:20 AM", completed: true },
        { title: "Delivered to Customer", time: "Estimated within 2 hours", completed: false }
      ])
    );
  }
} catch (e) {
  console.log('Benchmark order note:', e.message);
}

// Catalog products table is initialized empty; products are managed manually by the user

console.log('✅ SQLite Database initialized successfully with persistent tables and migrations.');

export default db;
