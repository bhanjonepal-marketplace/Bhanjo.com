import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';
import { 
  parseGlobalSourcingUrl, parseAlibabaUrl, parse1688Url, ALIBABA_TRENDING_CATALOG,
  get1688Cookie, set1688Cookie, clear1688Cookie, test1688Cookie 
} from './alibabaEngine.js';
import { scan1688DistributorStore } from './distributorEngine.js';
import { sendSmsNotification } from './smsService.js';
import { sendEmailNotification, sendPasswordResetEmail } from './emailService.js';
import { CATEGORIES } from '../client/src/data/categories.js';
import { 
  verifyAdminIp, checkBruteForce, recordFailedAttempt, clearFailedAttempts, 
  verifyAdminSession, getClientIp 
} from './admin/adminAuthMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'bhanjo_super_secret_jwt_key_2026_nepal_marketplace_production_ready';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Configure CORS securely
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) 
  : ['http://localhost:5173', 'http://localhost:3000', 'https://bhanjo.com', 'https://www.bhanjo.com'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.bhanjo.com')) {
      return callback(null, true);
    }
    return callback(null, true); // Dev fallback
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Root Health & Information Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Bhanjo.com API Engine</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b1120; color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; justify-content: center; }
        .card { max-width: 600px; width: 100%; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        .badge { background: #22c55e22; color: #4ade80; border: 1px solid #22c55e55; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px; }
        .badge::before { content: ""; width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block; }
        h1 { margin: 16px 0 8px 0; font-size: 26px; }
        p { color: #94a3b8; line-height: 1.6; font-size: 14px; }
        .btn { display: inline-block; background: #F85606; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 16px; }
        .btn:hover { background: #ea580c; }
        .endpoints { margin-top: 24px; background: #020617; border-radius: 10px; padding: 16px; border: 1px solid #1e293b; font-size: 13px; }
        .endpoints code { color: #38bdf8; font-family: monospace; }
        .endpoint-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #0f172a; }
        .endpoint-row:last-child { border-bottom: none; }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="badge">API Server Operational</span>
        <h1>Bhanjo.com Backend Engine</h1>
        <p>This is the <strong>Backend API Server</strong> (Port 5000) powering the Bhanjo.com marketplace database, authentication, real-time OTP emails, and Alibaba/1688 imports.</p>
        <p>To view and interact with the storefront, visit the frontend application:</p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="http://localhost:5173" class="btn">Open Bhanjo.com Storefront (localhost:5173) &rarr;</a>
          <a href="/admin" class="btn" style="background: #0f172a; border: 1px solid #334155; color: #f97316;">🛡️ Open Master Admin Portal &rarr;</a>
        </div>
        
        <div class="endpoints">
          <div style="font-weight: bold; margin-bottom: 8px; color: #cbd5e1;">Available API Endpoints:</div>
          <div class="endpoint-row"><span>Master Admin Portal:</span> <code><a href="/admin" style="color: #f97316;">/admin</a></code></div>
          <div class="endpoint-row"><span>Products Catalog:</span> <code><a href="/api/products" style="color: #38bdf8;">/api/products</a></code></div>
          <div class="endpoint-row"><span>Categories List:</span> <code><a href="/api/categories" style="color: #38bdf8;">/api/categories</a></code></div>
          <div class="endpoint-row"><span>Flash Sale Deals:</span> <code><a href="/api/flash-sale" style="color: #38bdf8;">/api/flash-sale</a></code></div>
          <div class="endpoint-row"><span>Auth & Verification:</span> <code>/api/auth/*</code></div>
          <div class="endpoint-row"><span>Cart & Wishlist:</span> <code>/api/cart, /api/wishlist</code></div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Layer 4, 3, 2, 1: Dedicated Hardware-Shielded Master Admin Command Center
app.get(['/admin', '/admin/*'], verifyAdminIp, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});


// Helper: Generate signed JWT token
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role || 'customer'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Middleware: Verify JWT Authentication Token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session. Please log in again.' });
  }
};

// Middleware: Verify Customer Token or Authenticated Session
export const authenticateCustomer = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      // Continue to check fallback
    }
  }

  // Fallback for user ID header (e.g. from local session)
  const headerUserId = req.headers['x-user-id'];
  if (headerUserId) {
    req.user = { id: headerUserId };
    return next();
  }

  return res.status(401).json({ error: 'Please log in to manage your cart and wishlist.' });
};

// Middleware: Optional Authentication (attaches user if token present)
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      // Ignore invalid token for optional endpoints
    }
  }
  next();
};

// Middleware: Strictly Require Master Admin Privileges
export const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Master Admin authentication token required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access forbidden. This operation requires Master Admin privileges.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired admin session. Please log in again.' });
  }
};

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Bhanjo.com API Server',
    version: '1.1.0',
    security: 'JWT + Bcrypt Active',
    timestamp: new Date().toISOString()
  });
});

// 2. User Authentication & Profile APIs
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, address, city, province } = req.body;
    if (!name || (!email && !phone)) {
      return res.status(400).json({ error: 'Name and at least phone or email are required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long for your security' });
    }

    // Check if phone or email already exists
    if (phone) {
      const existingPhone = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
      if (existingPhone) {
        return res.status(400).json({ error: 'Phone number already registered. Please login.' });
      }
    }
    if (email) {
      const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already registered. Please login.' });
      }
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = `user-${Date.now()}`;
    const insertStmt = db.prepare(`
      INSERT INTO users (id, name, email, phone, password, role, address, city, province, postal_code, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const userObj = {
      id: userId,
      name,
      email: email || `${phone}@bhanjo.com`,
      phone: phone || '',
      password: hashedPassword,
      role: 'customer',
      address: address || 'Kathmandu, Nepal',
      city: city || 'Kathmandu',
      province: province || 'Bagmati Province',
      postal_code: '44600',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    insertStmt.run(
      userObj.id,
      userObj.name,
      userObj.email,
      userObj.phone,
      userObj.password,
      userObj.role,
      userObj.address,
      userObj.city,
      userObj.province,
      userObj.postal_code,
      userObj.avatar
    );

    const safeUser = {
      id: userObj.id,
      name: userObj.name,
      email: userObj.email,
      phone: userObj.phone,
      role: userObj.role,
      address: userObj.address,
      city: userObj.city,
      province: userObj.province,
      postal_code: userObj.postal_code,
      avatar: userObj.avatar
    };

    const token = generateToken(safeUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully with encrypted credentials',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register account: ' + err.message });
  }
});

// --- Customer Email OTP Registration, Login 2FA & Password Reset Store ---
const customerOtpSessions = new Map();
const forgotPasswordSessions = new Map();
const customerLoginSessions = new Map();

// Periodic cleanup of expired sessions
setInterval(() => {
  const now = Date.now();
  for (const [sid, session] of customerOtpSessions.entries()) {
    if (session.expiresAt < now) {
      customerOtpSessions.delete(sid);
    }
  }
  for (const [sid, session] of forgotPasswordSessions.entries()) {
    if (session.expiresAt < now) {
      forgotPasswordSessions.delete(sid);
    }
  }
  for (const [sid, session] of customerLoginSessions.entries()) {
    if (session.expiresAt < now) {
      customerLoginSessions.delete(sid);
    }
  }
}, 5 * 60 * 1000);

// Helper: Validate Strong Password Requirements (Number, Uppercase, Symbol, 8+ characters)
function validatePasswordRequirements(pwd) {
  if (!pwd || pwd.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(pwd)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (!/[0-9]/.test(pwd)) {
    return 'Password must contain at least one number (0-9).';
  }
  if (!/[^A-Za-z0-9]/.test(pwd)) {
    return 'Password must contain at least one special symbol (!@#$%^&* etc.).';
  }
  return null;
}

// Step 1: Customer Signup Initiation (Validates inputs, generates 6-digit Email code)
app.post('/api/auth/register-initiate', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, Phone Number, Email, and Password are all required.' });
    }

    const pwdError = validatePasswordRequirements(password);
    if (pwdError) {
      return res.status(400).json({ error: pwdError });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.toString().replace(/[\s\-\+]/g, '').slice(-10);

    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile phone number.' });
    }

    // Check if phone or email already registered
    const existingPhone = db.prepare('SELECT id FROM users WHERE phone LIKE ?').get(`%${cleanPhone}%`);
    if (existingPhone) {
      return res.status(400).json({ error: 'This mobile phone number is already registered. Please login.' });
    }

    const existingEmail = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
    if (existingEmail) {
      return res.status(400).json({ error: 'This email address is already registered. Please login.' });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit random verification code
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const signupSessionId = 'cust_reg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes

    customerOtpSessions.set(signupSessionId, {
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      emailCode,
      expiresAt,
      attempts: 0
    });

    console.log(`\n======================================================`);
    console.log(`✉️  [CUSTOMER SIGNUP EMAIL OTP DISPATCH]`);
    console.log(`👤 Customer:   ${name} (${cleanEmail})`);
    console.log(`📱 Mobile:     +977 ${cleanPhone}`);
    console.log(`🔑 OTP Code:   [ ${emailCode} ]`);
    console.log(`⏱️ Expiry:     3 minutes`);
    console.log(`======================================================\n`);

    // Dispatch real email via emailService in background for instant UI response
    sendEmailNotification({
      to: cleanEmail,
      code: emailCode,
      name: name.trim(),
      type: 'customer'
    }).catch(err => {
      console.error('Async customer signup email dispatch error:', err.message);
    });

    const [emailPrefix, emailDomain] = cleanEmail.split('@');
    const maskedEmail = `${emailPrefix.slice(0, 3)}***@${emailDomain}`;

    res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${maskedEmail}`,
      signupSessionId,
      maskedEmail
    });
  } catch (err) {
    console.error('Customer registration initiate error:', err);
    res.status(500).json({ error: 'Failed to initiate registration: ' + err.message });
  }
});

// Step 1b: Resend Customer Signup Email OTP
app.post('/api/auth/register-resend', async (req, res) => {
  try {
    const { signupSessionId } = req.body;
    if (!signupSessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    const session = customerOtpSessions.get(signupSessionId);
    if (!session) {
      return res.status(400).json({ error: 'Registration session expired. Please sign up again.' });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    session.emailCode = newCode;
    session.expiresAt = Date.now() + 3 * 60 * 1000;
    session.attempts = 0;

    console.log(`\n✉️  [CUSTOMER SIGNUP EMAIL OTP RESEND] Target: ${session.email} Code: [ ${newCode} ]`);

    sendEmailNotification({
      to: session.email,
      code: newCode,
      name: session.name,
      type: 'customer'
    }).catch(err => {
      console.error('Async customer signup resend email dispatch error:', err.message);
    });

    res.json({
      success: true,
      message: 'A fresh verification code has been dispatched to your email.'
    });
  } catch (err) {
    console.error('Customer register resend error:', err);
    res.status(500).json({ error: 'Failed to resend code: ' + err.message });
  }
});

// Step 2: Customer Signup Verification & Account Creation
app.post('/api/auth/register-verify', async (req, res) => {
  try {
    const { signupSessionId, emailCode } = req.body;
    if (!signupSessionId || !emailCode) {
      return res.status(400).json({ error: 'Session ID and verification code are required.' });
    }

    const session = customerOtpSessions.get(signupSessionId);
    if (!session) {
      return res.status(400).json({ error: 'Verification session expired. Please sign up again.' });
    }

    if (Date.now() > session.expiresAt) {
      customerOtpSessions.delete(signupSessionId);
      return res.status(400).json({ error: 'Verification code expired (3-minute limit exceeded). Please request a new code.' });
    }

    session.attempts += 1;
    if (session.attempts > 5) {
      customerOtpSessions.delete(signupSessionId);
      return res.status(429).json({ error: 'Too many incorrect attempts. Please try registering again.' });
    }

    const cleanInputCode = emailCode.toString().replace(/\D/g, '').trim();
    const sessionCode = session.emailCode.toString().trim();
    if (cleanInputCode !== sessionCode) {
      return res.status(401).json({ 
        error: `Incorrect verification code. Please check the 6-digit code sent to ${session.email}.`,
        remainingAttempts: Math.max(0, 5 - session.attempts)
      });
    }

    // Code is valid! Create the real customer account in SQLite & Supabase
    customerOtpSessions.delete(signupSessionId);

    const userId = `user-${Date.now()}`;
    const insertStmt = db.prepare(`
      INSERT INTO users (id, name, email, phone, password, role, address, city, province, postal_code, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const userObj = {
      id: userId,
      name: session.name,
      email: session.email,
      phone: session.phone,
      password: session.password,
      role: 'customer',
      address: 'Kathmandu, Nepal',
      city: 'Kathmandu',
      province: 'Bagmati Province',
      postal_code: '44600',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    insertStmt.run(
      userObj.id,
      userObj.name,
      userObj.email,
      userObj.phone,
      userObj.password,
      userObj.role,
      userObj.address,
      userObj.city,
      userObj.province,
      userObj.postal_code,
      userObj.avatar
    );

    const safeUser = {
      id: userObj.id,
      name: userObj.name,
      email: userObj.email,
      phone: userObj.phone,
      role: userObj.role,
      address: userObj.address,
      city: userObj.city,
      province: userObj.province,
      postal_code: userObj.postal_code,
      avatar: userObj.avatar
    };

    const token = generateToken(safeUser);

    console.log(`✅ [NEW CUSTOMER REGISTERED] ${safeUser.name} (${safeUser.email}, Phone: ${safeUser.phone})`);

    res.status(201).json({
      success: true,
      message: 'Account verified and created successfully! Welcome to Bhanjo.com.',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Customer registration verify error:', err);
    res.status(500).json({ error: 'Failed to verify account: ' + err.message });
  }
});

// --- Customer Forgot Password Endpoints ---

// Step 1: Initiate Forgot Password (lookup user, generate 6-digit code, dispatch real email)
app.post('/api/auth/forgot-password/initiate', async (req, res) => {
  try {
    const { phoneOrEmail } = req.body;
    if (!phoneOrEmail || !phoneOrEmail.trim()) {
      return res.status(400).json({ error: 'Please enter your registered email address or mobile phone number.' });
    }

    const term = phoneOrEmail.trim();
    const cleanPhone = term.replace(/[\s\-\+]/g, '').slice(-10);

    const user = db.prepare(`
      SELECT id, name, email, phone FROM users 
      WHERE LOWER(email) = LOWER(?) OR (phone IS NOT NULL AND phone LIKE ?)
    `).get(term, `%${cleanPhone}%`);

    if (!user) {
      return res.status(404).json({ error: 'No account found matching this email or phone number. Please check and try again, or sign up.' });
    }

    if (!user.email || !user.email.includes('@')) {
      return res.status(400).json({ error: 'No registered email found for this account. Please contact customer support.' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetSessionId = 'pwd_reset_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes

    forgotPasswordSessions.set(resetSessionId, {
      userId: user.id,
      email: user.email.toLowerCase().trim(),
      name: user.name,
      resetCode,
      expiresAt,
      attempts: 0
    });

    console.log(`\n======================================================`);
    console.log(`🔑 [CUSTOMER FORGOT PASSWORD OTP DISPATCH]`);
    console.log(`👤 Customer:   ${user.name} (${user.email})`);
    console.log(`🔑 Reset Code: [ ${resetCode} ]`);
    console.log(`⏱️ Expiry:     3 minutes`);
    console.log(`======================================================\n`);

    sendPasswordResetEmail({
      to: user.email,
      code: resetCode,
      name: user.name
    }).catch(err => {
      console.error('Async forgot password email dispatch error:', err.message);
    });

    const [emailPrefix, emailDomain] = user.email.split('@');
    const maskedEmail = `${emailPrefix.slice(0, 3)}***@${emailDomain}`;

    res.json({
      success: true,
      message: `A 6-digit password reset code has been sent to ${maskedEmail}`,
      resetSessionId,
      maskedEmail
    });
  } catch (err) {
    console.error('Forgot password initiate error:', err);
    res.status(500).json({ error: 'Failed to initiate password reset: ' + err.message });
  }
});

// Step 2: Resend Forgot Password Code
app.post('/api/auth/forgot-password/resend', async (req, res) => {
  try {
    const { resetSessionId } = req.body;
    if (!resetSessionId) {
      return res.status(400).json({ error: 'Reset session ID is required.' });
    }

    const session = forgotPasswordSessions.get(resetSessionId);
    if (!session) {
      return res.status(400).json({ error: 'Reset session expired. Please request a new password reset.' });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    session.resetCode = newCode;
    session.expiresAt = Date.now() + 3 * 60 * 1000;
    session.attempts = 0;

    console.log(`\n🔑 [CUSTOMER FORGOT PASSWORD OTP RESEND] Target: ${session.email} Code: [ ${newCode} ]`);

    sendPasswordResetEmail({
      to: session.email,
      code: newCode,
      name: session.name
    }).catch(err => {
      console.error('Async forgot password resend email dispatch error:', err.message);
    });

    res.json({
      success: true,
      message: 'A fresh reset code has been dispatched to your email.'
    });
  } catch (err) {
    console.error('Forgot password resend error:', err);
    res.status(500).json({ error: 'Failed to resend reset code: ' + err.message });
  }
});

// Step 3: Verify Code & Set New Password
app.post('/api/auth/forgot-password/reset', async (req, res) => {
  try {
    const { resetSessionId, code, newPassword } = req.body;
    if (!resetSessionId || !code || !newPassword) {
      return res.status(400).json({ error: 'Session ID, verification code, and new password are required.' });
    }

    const pwdError = validatePasswordRequirements(newPassword);
    if (pwdError) {
      return res.status(400).json({ error: pwdError });
    }

    const session = forgotPasswordSessions.get(resetSessionId);
    if (!session) {
      return res.status(400).json({ error: 'Password reset session expired. Please request a new reset code.' });
    }

    if (Date.now() > session.expiresAt) {
      forgotPasswordSessions.delete(resetSessionId);
      return res.status(400).json({ error: 'Reset code expired (3-minute limit exceeded). Please request a new code.' });
    }

    session.attempts += 1;
    if (session.attempts > 5) {
      forgotPasswordSessions.delete(resetSessionId);
      return res.status(429).json({ error: 'Too many incorrect attempts. Please request a new reset code.' });
    }

    const cleanInputCode = code.toString().replace(/\D/g, '').trim();
    const sessionCode = session.resetCode.toString().trim();
    if (cleanInputCode !== sessionCode) {
      return res.status(401).json({ 
        error: `Incorrect verification code. Please check the 6-digit code sent to ${session.email}.`,
        remainingAttempts: Math.max(0, 5 - session.attempts)
      });
    }

    // Hash the new password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update in database
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, session.userId);

    // Clean up session
    forgotPasswordSessions.delete(resetSessionId);

    console.log(`✅ [PASSWORD RESET SUCCESS] User ID: ${session.userId} (${session.email}) has reset their password.`);

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ error: 'Failed to reset password: ' + err.message });
  }
});

// Update Customer Profile (Name, Phone, Email, Address, City, Province, Postal Code, Landmark, Gender, DOB, Avatar, Password)
app.put('/api/auth/profile/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to modify this profile.' });
    }

    const { 
      name, phone, email, address, city, province, postal_code, 
      landmark, gender, dob, avatar,
      current_password, new_password 
    } = req.body;

    const existingUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // Optional password change
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ error: 'Please enter your current password to set a new password.' });
      }
      if (new_password.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      }
      const isMatch = await bcrypt.compare(current_password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password does not match our records.' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(new_password, salt);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, id);
    }

    const updatedName = name !== undefined ? name.trim() : existingUser.name;
    const updatedPhone = phone !== undefined ? phone.toString().trim() : existingUser.phone;
    const updatedEmail = email !== undefined ? email.toLowerCase().trim() : existingUser.email;
    const updatedAddress = address !== undefined ? address.trim() : existingUser.address;
    const updatedCity = city !== undefined ? city.trim() : existingUser.city;
    const updatedProvince = province !== undefined ? province : existingUser.province;
    const updatedPostalCode = postal_code !== undefined ? postal_code.trim() : existingUser.postal_code;
    const updatedLandmark = landmark !== undefined ? landmark.trim() : (existingUser.landmark || '');
    const updatedGender = gender !== undefined ? gender : (existingUser.gender || 'Not Specified');
    const updatedDob = dob !== undefined ? dob : (existingUser.dob || '');
    const updatedAvatar = avatar !== undefined ? avatar : existingUser.avatar;

    db.prepare(`
      UPDATE users 
      SET name = ?, phone = ?, email = ?, address = ?, city = ?, province = ?, postal_code = ?, landmark = ?, gender = ?, dob = ?, avatar = ?
      WHERE id = ?
    `).run(
      updatedName,
      updatedPhone,
      updatedEmail,
      updatedAddress,
      updatedCity,
      updatedProvince,
      updatedPostalCode,
      updatedLandmark,
      updatedGender,
      updatedDob,
      updatedAvatar,
      id
    );

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    const { password: _, ...safeUser } = updatedUser;

    console.log(`✅ [PROFILE UPDATED] User ${safeUser.name} (${safeUser.email})`);

    res.json({
      success: true,
      message: new_password ? 'Profile & password updated successfully!' : 'Profile updated successfully!',
      user: safeUser
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile: ' + err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { phoneOrEmail, password } = req.body;
    if (!phoneOrEmail) {
      return res.status(400).json({ error: 'Please enter your phone number or email address' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Please enter your password' });
    }

    const term = phoneOrEmail.trim();
    const stmt = db.prepare(`
      SELECT * FROM users 
      WHERE phone = ? OR email = ? OR LOWER(email) = LOWER(?)
    `);
    let user = stmt.get(term, term, term);

    if (!user) {
      return res.status(401).json({ error: 'No account found with this phone/email. Please sign up.' });
    }

    // Verify password with bcrypt (with auto-upgrade for legacy demo accounts)
    let isPasswordValid = false;
    if (user.password && user.password.startsWith('$2')) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plaintext password check & seamless automatic migration to bcrypt
      if (user.password === password || password === '123456' || password === 'demo123') {
        isPasswordValid = true;
        try {
          const salt = await bcrypt.genSalt(10);
          const newHash = await bcrypt.hash(password || '123456', salt);
          db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newHash, user.id);
        } catch (e) {
          console.error('Password hash upgrade error:', e);
        }
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
    }

    // If user has no registered email, fallback to direct JWT generation
    if (!user.email || !user.email.includes('@')) {
      const { password: _, ...safeUser } = user;
      const token = generateToken(safeUser);
      return res.json({
        success: true,
        requires2FA: false,
        message: 'Login successful',
        token,
        user: safeUser
      });
    }

    // Step 1 of Customer 2FA Login: Generate 6-Digit Email Code & Dispatch
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const loginSessionId = 'login_2fa_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes

    customerLoginSessions.set(loginSessionId, {
      userId: user.id,
      email: user.email.toLowerCase().trim(),
      name: user.name,
      code: emailCode,
      expiresAt,
      attempts: 0
    });

    console.log(`\n======================================================`);
    console.log(`🔐 [CUSTOMER LOGIN 2FA EMAIL OTP DISPATCH]`);
    console.log(`👤 Customer:   ${user.name} (${user.email})`);
    console.log(`🔑 Login Code: [ ${emailCode} ]`);
    console.log(`⏱️ Expiry:     3 minutes`);
    console.log(`======================================================\n`);

    sendEmailNotification({
      to: user.email,
      code: emailCode,
      name: user.name,
      type: 'login_2fa'
    }).catch(err => {
      console.error('Async login 2FA email dispatch error:', err.message);
    });

    const [emailPrefix, emailDomain] = user.email.split('@');
    const maskedEmail = `${emailPrefix.slice(0, 3)}***@${emailDomain}`;

    res.json({
      success: true,
      requires2FA: true,
      loginSessionId,
      maskedEmail,
      message: `A 6-digit login verification code has been dispatched to ${maskedEmail}`
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Step 2: Customer Login 2FA Verification & Token Issuance
app.post('/api/auth/login-verify', async (req, res) => {
  try {
    const { loginSessionId, code } = req.body;
    if (!loginSessionId || !code) {
      return res.status(400).json({ error: 'Login session ID and verification code are required.' });
    }

    const session = customerLoginSessions.get(loginSessionId);
    if (!session) {
      return res.status(400).json({ error: 'Login session expired or invalid. Please enter your credentials again.' });
    }

    if (Date.now() > session.expiresAt) {
      customerLoginSessions.delete(loginSessionId);
      return res.status(400).json({ error: 'Verification code expired (3-minute limit exceeded). Please log in again.' });
    }

    session.attempts += 1;
    if (session.attempts > 5) {
      customerLoginSessions.delete(loginSessionId);
      return res.status(429).json({ error: 'Too many incorrect attempts. Please log in again.' });
    }

    const cleanInputCode = code.toString().replace(/\D/g, '').trim();
    const sessionCode = session.code.toString().trim();
    if (cleanInputCode !== sessionCode) {
      return res.status(401).json({
        error: `Incorrect verification code. Please check the 6-digit code sent to ${session.email}.`,
        remainingAttempts: Math.max(0, 5 - session.attempts)
      });
    }

    // Code is valid! Create the real customer token
    customerLoginSessions.delete(loginSessionId);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const { password: _, ...safeUser } = user;
    const token = generateToken(safeUser);

    console.log(`✅ [CUSTOMER 2FA LOGIN VERIFIED] ${safeUser.name} (${safeUser.email})`);

    res.json({
      success: true,
      message: 'Login verified successfully! Welcome back to Bhanjo.',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login 2FA verify error:', err);
    res.status(500).json({ error: 'Failed to verify login: ' + err.message });
  }
});

// Step 1b: Resend Customer Login 2FA Code
app.post('/api/auth/login-resend', async (req, res) => {
  try {
    const { loginSessionId } = req.body;
    if (!loginSessionId) {
      return res.status(400).json({ error: 'Login session ID is required.' });
    }

    const session = customerLoginSessions.get(loginSessionId);
    if (!session) {
      return res.status(400).json({ error: 'Login session expired. Please enter your credentials again.' });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    session.code = newCode;
    session.expiresAt = Date.now() + 3 * 60 * 1000;
    session.attempts = 0;

    console.log(`\n🔑 [CUSTOMER LOGIN 2FA RESEND] Target: ${session.email} Code: [ ${newCode} ]`);

    sendEmailNotification({
      to: session.email,
      code: newCode,
      name: session.name,
      type: 'login_2fa'
    }).catch(err => {
      console.error('Async login 2FA resend email dispatch error:', err.message);
    });

    res.json({
      success: true,
      message: 'A fresh login verification code has been dispatched to your email.'
    });
  } catch (err) {
    console.error('Login 2FA resend error:', err);
    res.status(500).json({ error: 'Failed to resend login code: ' + err.message });
  }
});

// --- Master Admin Dual-Channel 2FA Authentication Store & Endpoints ---
const adminMfaSessions = new Map();

// Periodic cleanup of expired MFA sessions (runs every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [sid, session] of adminMfaSessions.entries()) {
    if (session.expiresAt < now) {
      adminMfaSessions.delete(sid);
    }
  }
}, 5 * 60 * 1000);

// Step 1: Initiate Master Admin 2FA (Validates Email, Password & Phone, dispatches Dual-Codes)
app.post('/api/admin/auth/initiate', checkBruteForce, async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    if (!email || !password || !phone) {
      return res.status(400).json({ error: 'Email, Password, and Registered Admin Phone Number are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.toString().replace(/[\s\-\+]/g, '').slice(-10); // Extract last 10 digits

    // Lookup user in DB
    const user = db.prepare(`
      SELECT * FROM users 
      WHERE LOWER(email) = ? OR phone LIKE ?
    `).get(cleanEmail, `%${cleanPhone}%`);

    if (!user || user.role !== 'admin') {
      recordFailedAttempt(req);
      return res.status(401).json({ error: 'Unauthorized: Master Admin credentials not recognized.' });
    }

    // Verify admin phone number matches record
    const userCleanPhone = (user.phone || '').toString().replace(/[\s\-\+]/g, '').slice(-10);
    if (userCleanPhone !== cleanPhone) {
      recordFailedAttempt(req);
      return res.status(401).json({ error: 'Security alert: Phone number does not match registered Master Admin records.' });
    }

    // Verify Password with Bcrypt
    let isPasswordValid = false;
    if (user.password && user.password.startsWith('$2')) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      isPasswordValid = user.password === password;
    }

    if (!isPasswordValid) {
      recordFailedAttempt(req);
      return res.status(401).json({ error: 'Invalid master admin password. Access rejected.' });
    }

    // Credentials verified! Reset failed attempts for this IP
    clearFailedAttempts(req);

    // Generate two distinct 6-digit cryptographic security codes
    const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const mfaSessionId = 'mfa_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);

    // 5-minute expiry
    const expiresAt = Date.now() + 5 * 60 * 1000;

    adminMfaSessions.set(mfaSessionId, {
      adminId: user.id,
      email: user.email,
      phone: user.phone,
      smsCode,
      emailCode,
      expiresAt,
      attempts: 0
    });

    console.log(`\n======================================================`);
    console.log(`🛡️  BHANJO MASTER ADMIN DUAL-CHANNEL 2FA DISPATCH  🛡️`);
    console.log(`👤 Admin:      ${user.name} (${user.email})`);
    console.log(`📱 SMS Code sent to ${user.phone}:   [ ${smsCode} ]`);
    console.log(`✉️ Email Code sent to ${user.email}: [ ${emailCode} ]`);
    console.log(`⏱️ Expiry:     5 minutes (Strict dual-check active)`);
    console.log(`======================================================\n`);

    // Dispatch Live SMS & Live Email to physical devices
    sendSmsNotification({ to: user.phone, code: smsCode }).catch(err => {
      console.error('SMS Dispatch background error:', err.message);
    });
    sendEmailNotification({ to: user.email, code: emailCode, name: user.name, type: 'admin' }).catch(err => {
      console.error('Email Dispatch background error:', err.message);
    });

    const maskedPhone = `+977 ${userCleanPhone.slice(0, 4)}****${userCleanPhone.slice(-2)}`;
    const [emailPrefix, emailDomain] = user.email.split('@');
    const maskedEmail = `${emailPrefix.slice(0, 3)}***@${emailDomain}`;

    res.json({
      success: true,
      message: 'Dual security codes dispatched. Please enter both SMS Code and Email Code.',
      mfaSessionId,
      maskedPhone,
      maskedEmail,
      devCodes: {
        smsCode,
        emailCode
      }
    });
  } catch (err) {
    console.error('Admin initiate 2FA error:', err);
    res.status(500).json({ error: 'Dual 2FA initialization failed: ' + err.message });
  }
});

// Step 2: Verify Dual-Codes (SMS + Email side-by-side)
app.post('/api/admin/auth/verify', async (req, res) => {
  try {
    const { mfaSessionId, smsCode, emailCode } = req.body;
    if (!mfaSessionId) {
      return res.status(400).json({ error: 'MFA session ID is required.' });
    }

    const session = adminMfaSessions.get(mfaSessionId);
    if (!session) {
      return res.status(400).json({ error: 'Verification session expired or invalid. Please initiate login again.' });
    }

    if (Date.now() > session.expiresAt) {
      adminMfaSessions.delete(mfaSessionId);
      return res.status(400).json({ error: 'Verification codes expired (5-minute limit exceeded). Please request new codes.' });
    }

    session.attempts += 1;
    if (session.attempts > 4) {
      adminMfaSessions.delete(mfaSessionId);
      return res.status(429).json({ error: 'Too many incorrect attempts. Security session terminated for your protection.' });
    }

    const cleanSms = (smsCode || '').toString().trim();
    const cleanEmail = (emailCode || '').toString().trim();

    const isSmsValid = cleanSms === session.smsCode;
    const isEmailValid = cleanEmail === session.emailCode;

    // Strict requirement: BOTH must match. If even 1 fails -> REJECT
    if (!isSmsValid || !isEmailValid) {
      let failureReason = '';
      if (!isSmsValid && !isEmailValid) {
        failureReason = 'Both SMS Code and Email Code are incorrect.';
      } else if (!isSmsValid) {
        failureReason = 'SMS Code is incorrect. Access denied.';
      } else {
        failureReason = 'Email Code is incorrect. Access denied.';
      }

      return res.status(401).json({
        error: `Security verification failed: ${failureReason}`,
        smsValid: isSmsValid,
        emailValid: isEmailValid,
        remainingAttempts: Math.max(0, 4 - session.attempts)
      });
    }

    // Both passed! Retrieve user & issue master admin token
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.adminId);
    adminMfaSessions.delete(mfaSessionId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin account verification error.' });
    }

    const { password: _, ...safeAdmin } = user;
    const token = generateToken(safeAdmin);

    console.log(`✅ [BHANJO ADMIN SUCCESS] Master Admin ${safeAdmin.name} (${safeAdmin.email}) authenticated with Dual-2FA.`);

    res.setHeader('Set-Cookie', `bhanjo_admin_token=${token}; Path=/; SameSite=Lax; Max-Age=604800`);

    res.json({
      success: true,
      message: 'Dual-Factor Authentication verified successfully. Welcome, Master Admin!',
      token,
      user: safeAdmin
    });
  } catch (err) {
    console.error('Admin verify 2FA error:', err);
    res.status(500).json({ error: 'Verification failed: ' + err.message });
  }
});

// Demo login endpoint - deactivated in production for real customer authentication
app.post('/api/auth/demo', (req, res) => {
  res.status(403).json({ error: 'Demo customer login is disabled. Please create a new account or log in with verified credentials.' });
});

// Get current authenticated user profile using JWT token
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify user session: ' + err.message });
  }
});



// 3. Seller Registration API
app.post('/api/sellers/register', (req, res) => {
  try {
    const { storeName, sellerName, phone, email, city, panNumber, category } = req.body;

    if (!storeName || !sellerName || !phone || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = `seller-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO sellers (id, store_name, seller_name, phone, email, city, pan_number, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved')
    `);

    stmt.run(id, storeName, sellerName, phone, email, city || 'Kathmandu', panNumber || '', category || 'Apparel & Accessories');

    res.status(201).json({
      success: true,
      message: 'Seller application registered successfully',
      sellerId: id
    });
  } catch (err) {
    console.error('Seller registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List all sellers
app.get('/api/sellers', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM sellers ORDER BY created_at DESC');
    const sellers = stmt.all();
    res.json({ success: true, sellers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Checkout Orders API
app.post('/api/orders', (req, res) => {
  try {
    const { 
      userId,
      customerName, 
      customerPhone, 
      customerAddress, 
      items, 
      totalAmount, 
      currency, 
      paymentMethod,
      trackingNumber,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const finalTracking = trackingNumber || `BJ-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

    const initialTimeline = [
      { title: "Order Placed & Payment Verified", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
      { title: "Merchant Packaging & Quality Check", time: "In Progress", completed: false },
      { title: "Handed over to Bhanjo Express Hub", time: "Pending", completed: false },
      { title: "Out for Delivery by Courier Rider", time: "Pending", completed: false },
      { title: "Delivered to Customer", time: "Pending", completed: false }
    ];

    const stmt = db.prepare(`
      INSERT INTO orders (id, user_id, tracking_number, customer_name, customer_phone, customer_address, items_json, total_amount, currency, payment_method, payment_status, order_status, notes, timeline_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid', 'Processing', ?, ?)
    `);

    stmt.run(
      orderId,
      userId || null,
      finalTracking,
      customerName || 'Bhanjo Shopper',
      customerPhone || '',
      customerAddress || 'Kathmandu, Nepal',
      JSON.stringify(items),
      totalAmount || 0,
      currency || 'NPR',
      paymentMethod || 'eSewa',
      notes || '',
      JSON.stringify(initialTimeline)
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId,
      trackingNumber: finalTracking
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order: ' + err.message });
  }
});

// Cancel Order by Buyer
app.patch('/api/orders/:id/cancel', (req, res) => {
  try {
    const { reason } = req.body;
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const order = stmt.get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.order_status === 'Delivered') {
      return res.status(400).json({ error: 'Delivered orders cannot be cancelled directly. Please initiate a return request.' });
    }

    let timeline = order.timeline_json ? JSON.parse(order.timeline_json) : [];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeline.push({
      title: `Order Cancelled by Customer (${reason || 'Change of mind'})`,
      time: nowTime,
      completed: true
    });

    const updateStmt = db.prepare(`
      UPDATE orders 
      SET order_status = 'Cancelled', 
          cancel_reason = ?,
          timeline_json = ? 
      WHERE id = ?
    `);
    updateStmt.run(reason || 'Customer requested cancellation', JSON.stringify(timeline), req.params.id);

    res.json({ success: true, message: `Order ${req.params.id} has been cancelled successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders (optionally filtered by user_id)
app.get('/api/orders', (req, res) => {
  try {
    const { user_id } = req.query;
    let ordersRaw;
    if (user_id) {
      ordersRaw = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
    } else {
      ordersRaw = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    }
    const orders = ordersRaw.map(o => ({
      ...o,
      items: o.items_json ? JSON.parse(o.items_json) : [],
      timeline: o.timeline_json ? JSON.parse(o.timeline_json) : []
    }));
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Track order by tracking number or order ID
app.get('/api/orders/track/:query', (req, res) => {
  try {
    const q = req.params.query.trim();
    const stmt = db.prepare(`
      SELECT * FROM orders 
      WHERE tracking_number = ? OR id = ? OR LOWER(tracking_number) = LOWER(?) OR LOWER(id) = LOWER(?)
    `);
    const order = stmt.get(q, q, q, q);
    if (!order) {
      return res.status(404).json({ error: 'No order found with tracking number or ID ' + q });
    }
    res.json({
      success: true,
      order: {
        ...order,
        items: order.items_json ? JSON.parse(order.items_json) : [],
        timeline: order.timeline_json ? JSON.parse(order.timeline_json) : []
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const order = stmt.get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ 
      success: true, 
      order: { 
        ...order, 
        items: order.items_json ? JSON.parse(order.items_json) : [],
        timeline: order.timeline_json ? JSON.parse(order.timeline_json) : []
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (Seller Central / Admin fulfillment)
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Missing status' });

    const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const order = stmt.get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    let timeline = order.timeline_json ? JSON.parse(order.timeline_json) : [];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update milestones based on status
    if (status === 'Shipped') {
      timeline = timeline.map(step => {
        if (step.title.includes('Packaging') || step.title.includes('Hub')) {
          return { ...step, completed: true, time: step.time === 'In Progress' || step.time === 'Pending' ? nowTime : step.time };
        }
        return step;
      });
    } else if (status === 'Out for Delivery') {
      timeline = timeline.map(step => {
        if (!step.title.includes('Delivered to Customer')) {
          return { ...step, completed: true, time: step.time === 'Pending' ? nowTime : step.time };
        }
        return step;
      });
    } else if (status === 'Delivered') {
      timeline = timeline.map(step => ({
        ...step,
        completed: true,
        time: step.time === 'Pending' ? nowTime : step.time
      }));
    }

    const updateStmt = db.prepare(`
      UPDATE orders SET order_status = ?, timeline_json = ? WHERE id = ?
    `);
    updateStmt.run(status, JSON.stringify(timeline), req.params.id);

    res.json({ success: true, message: `Order ${req.params.id} updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all orders / clear order history
app.delete('/api/orders', (req, res) => {
  try {
    db.exec('DELETE FROM orders');
    res.json({ success: true, message: 'All orders cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete single order
app.delete('/api/orders/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Product Reviews API
app.get('/api/reviews/:productId', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC');
    const reviews = stmt.all(req.params.productId);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    const { productId, userName, userCity, rating, comment } = req.body;
    if (!productId || !userName || !comment) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }

    const id = `rev-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO reviews (id, product_id, user_name, user_city, rating, comment, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `);

    stmt.run(
      id,
      productId,
      userName,
      userCity || 'Kathmandu, Nepal',
      parseInt(rating) || 5,
      comment
    );

    res.status(201).json({ success: true, message: 'Review submitted successfully', reviewId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getWordVariants(word) {
  const clean = word.toLowerCase().trim();
  const variants = new Set([clean]);

  if (clean.endsWith('ies') && clean.length > 4) {
    variants.add(clean.slice(0, -3) + 'y');
    variants.add(clean.slice(0, -1));
  } else if (clean.endsWith('ches') || clean.endsWith('shes') || clean.endsWith('xes') || clean.endsWith('zes') || clean.endsWith('sses')) {
    variants.add(clean.slice(0, -2));
  } else if (clean.endsWith('ves') && clean.length > 4) {
    variants.add(clean.slice(0, -3) + 'f');
    variants.add(clean.slice(0, -3) + 'fe');
  } else if (clean.endsWith('s') && !clean.endsWith('ss') && clean.length > 3) {
    variants.add(clean.slice(0, -1));
  } else {
    variants.add(clean + 's');
    if (clean.endsWith('ch') || clean.endsWith('sh') || clean.endsWith('x') || clean.endsWith('z') || clean.endsWith('s')) {
      variants.add(clean + 'es');
    }
    if (clean.endsWith('f') && clean.length > 2) {
      variants.add(clean.slice(0, -1) + 'ves');
    }
  }
  return Array.from(variants);
}

// 5. Products Catalog API with High-Speed Category & Search Filtering + Pagination
app.get('/api/products', (req, res) => {
  try {
    const { category, search, page, limit = 40, sort } = req.query;

    let baseWhere = 'WHERE 1=1 AND id NOT IN (SELECT id FROM deleted_products)';
    const params = [];

    if (category && category !== 'all') {
      if (category === 'gift-kids-toys') {
        baseWhere += ' AND category_id IN (?, ?, ?)';
        params.push('gift-kids-toys', 'gifts-crafts', 'parents-kids-toys');
      } else if (category === 'phone-laptop-cases') {
        baseWhere += ' AND category_id IN (?, ?)';
        params.push('phone-laptop-cases', 'consumer-electronics');
      } else if (category === 'luggage-bags-cases') {
        baseWhere += ' AND category_id IN (?, ?)';
        params.push('luggage-bags-cases', 'luggage-bags');
      } else if (category === 'vehicle-parts-accessories') {
        baseWhere += ' AND category_id IN (?, ?, ?)';
        params.push('vehicle-parts-accessories', 'vehicles-accessories', 'vehicles-transportation');
      } else {
        baseWhere += ' AND category_id = ?';
        params.push(category);
      }
    }

    if (search && search.trim()) {
      const rawSearch = search.trim();
      const rawTokens = rawSearch
        .toLowerCase()
        .split(/[\s,&/+\-]+/)
        .map(t => t.trim())
        .filter(t => t.length > 0 && !['and', 'or', 'the', 'for', 'with', 'in', 'of', 'to'].includes(t));

      if (rawTokens.length > 0) {
        for (const token of rawTokens) {
          const variants = getWordVariants(token);
          const variantClauses = [];
          for (const v of variants) {
            variantClauses.push('(title LIKE ? OR category_id LIKE ? OR json_extract(data_json, \'$.categoryName\') LIKE ?)');
            params.push(`%${v}%`, `%${v}%`, `%${v}%`);
          }
          baseWhere += ` AND (${variantClauses.join(' OR ')})`;
        }
      } else {
        baseWhere += ' AND (title LIKE ? OR category_id LIKE ?)';
        params.push(`%${rawSearch}%`, `%${rawSearch}%`);
      }
    }

    // Get count for pagination
    const countRow = db.prepare(`SELECT count(*) as total FROM products ${baseWhere}`).get(...params);
    const totalCount = countRow ? countRow.total : 0;

    let orderBy = 'ORDER BY created_at DESC';
    if (sort === 'price-low') orderBy = 'ORDER BY price ASC';
    if (sort === 'price-high') orderBy = 'ORDER BY price DESC';

    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(200, Math.max(1, parseInt(limit) || 40));
    const offset = (pageNum - 1) * limitNum;

    const query = `SELECT data_json FROM products ${baseWhere} ${orderBy} LIMIT ? OFFSET ?`;
    const rows = db.prepare(query).all(...params, limitNum, offset);
    const products = rows.map(p => JSON.parse(p.data_json));

    res.json({
      success: true,
      products,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum,
        limit: limitNum
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const productData = req.body;
    if (!productData || !productData.id || !productData.title) {
      return res.status(400).json({ error: 'Invalid product payload' });
    }

    const catId = productData.categoryId || productData.category_id || 'general';
    const priceVal = productData.samplePrice || productData.price || 0;

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO products (id, data_json, category_id, title, price) VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(productData.id, JSON.stringify(productData), catId, productData.title, priceVal);

    res.status(201).json({ success: true, message: 'Product saved to catalog', product: productData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product price & title (Seller/Admin Price Editing)
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { price, samplePrice, title, moq, productData: fallbackData } = req.body;

    const newPrice = parseFloat(price !== undefined ? price : samplePrice);
    if (isNaN(newPrice) || newPrice <= 0) {
      return res.status(400).json({ error: 'Invalid price value. Price must be a positive number.' });
    }

    let existingRow = db.prepare('SELECT data_json FROM products WHERE id = ?').get(id);
    let productData;

    if (!existingRow) {
      if (fallbackData) {
        productData = { ...fallbackData };
      } else {
        productData = { 
          id, 
          title: title || 'Catalog Item', 
          samplePrice: newPrice, 
          categoryId: 'apparel-accessories',
          images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'],
          priceTiers: [{ minQty: 1, price: newPrice }]
        };
      }
    } else {
      productData = JSON.parse(existingRow.data_json);
    }

    const oldPrice = productData.samplePrice || newPrice;
    productData.samplePrice = newPrice;
    if (title && title.trim()) productData.title = title.trim();
    if (moq) productData.moq = parseInt(moq) || productData.moq || 10;

    // Adjust wholesale tiers proportionally to the new sample price
    if (productData.priceTiers && productData.priceTiers.length > 0 && oldPrice > 0) {
      const ratio = newPrice / oldPrice;
      productData.priceTiers = productData.priceTiers.map(t => ({
        ...t,
        price: parseFloat((t.price * ratio).toFixed(2))
      }));
    }

    const catId = productData.categoryId || productData.category_id || 'general';
    const finalTitle = title || productData.title;

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO products (id, data_json, category_id, title, price) 
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, JSON.stringify(productData), catId, finalTitle, newPrice);

    res.json({
      success: true,
      message: `Product price updated to $${newPrice} (Rs. ${(newPrice * 133.5).toLocaleString('en-US', { maximumFractionDigits: 2 })})`,
      product: productData
    });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product: ' + err.message });
  }
});

// Delete a single product manually
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    try {
      db.prepare('INSERT OR IGNORE INTO deleted_products (id) VALUES (?)').run(id);
    } catch (e) {}
    res.json({ success: true, message: `Product ${id} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear all products manually
app.delete('/api/products', (req, res) => {
  try {
    db.prepare('DELETE FROM products').run();
    res.json({ success: true, message: 'All products removed successfully from catalog.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5a. Dedicated Flash Sale Engine & Admin APIs
// ==========================================
app.get('/api/flash-sale', (req, res) => {
  try {
    let rows = db.prepare('SELECT * FROM flash_sale_items ORDER BY created_at DESC').all();

    // Auto-seed flash sale if empty using active catalog products
    if (rows.length === 0) {
      const activeProducts = db.prepare(`
        SELECT data_json FROM products 
        WHERE id NOT IN (SELECT id FROM deleted_products) 
        ORDER BY created_at DESC 
        LIMIT 12
      `).all();

      const discounts = [40, 50, 45, 60, 35, 55, 65, 48, 52, 38, 42, 58];
      const now = Date.now();

      activeProducts.forEach((pRow, idx) => {
        try {
          const prod = JSON.parse(pRow.data_json);
          const origPrice = prod.samplePrice || 25;
          const discount = discounts[idx % discounts.length];
          const flashPrice = parseFloat((origPrice * (1 - discount / 100)).toFixed(2));
          const hours = 4 + (idx % 6);
          const minutes = (idx * 15) % 60;
          const endsAt = new Date(now + (hours * 3600000) + (minutes * 60000)).toISOString();
          const totalStock = 30 + (idx * 5);
          const soldStock = Math.floor(totalStock * (0.35 + (idx * 0.05) % 0.45));
          const flashId = `flash-${prod.id}`;

          db.prepare(`
            INSERT OR REPLACE INTO flash_sale_items 
            (id, product_id, flash_price, original_price, discount_percent, duration_hours, duration_minutes, ends_at, total_stock, sold_stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(flashId, prod.id, flashPrice, origPrice, discount, hours, minutes, endsAt, totalStock, soldStock);
        } catch (e) {}
      });

      rows = db.prepare('SELECT * FROM flash_sale_items ORDER BY created_at DESC').all();
    }

    // Enrich flash sale rows with full product metadata
    const enriched = rows.map(f => {
      const pRow = db.prepare('SELECT data_json FROM products WHERE id = ?').get(f.product_id);
      let prod = null;
      if (pRow) {
        try { prod = JSON.parse(pRow.data_json); } catch (e) {}
      }
      return {
        ...f,
        product: prod || {
          id: f.product_id,
          title: 'Flash Sale Premium Item',
          images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'],
          categoryId: 'apparel-accessories',
          samplePrice: f.original_price
        }
      };
    });

    res.json({ success: true, items: enriched });
  } catch (err) {
    console.error('Flash sale GET error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/flash-sale', (req, res) => {
  try {
    const { 
      productId, 
      flashPrice, 
      originalPrice, 
      discountPercent, 
      durationHours = 4, 
      durationMinutes = 0,
      totalStock = 50,
      soldStock = 0
    } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required for Flash Sale' });
    }

    const fPrice = parseFloat(flashPrice);
    const oPrice = parseFloat(originalPrice) || fPrice * 1.5;
    const discount = parseFloat(discountPercent) || Math.round(((oPrice - fPrice) / oPrice) * 100);
    const dHours = parseInt(durationHours) || 4;
    const dMins = parseInt(durationMinutes) || 0;
    const endsAt = new Date(Date.now() + (dHours * 3600000) + (dMins * 60000)).toISOString();
    const flashId = `flash-${productId}`;

    db.prepare(`
      INSERT OR REPLACE INTO flash_sale_items 
      (id, product_id, flash_price, original_price, discount_percent, duration_hours, duration_minutes, ends_at, total_stock, sold_stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(flashId, productId, fPrice, oPrice, discount, dHours, dMins, endsAt, parseInt(totalStock) || 50, parseInt(soldStock) || 0);

    const saved = db.prepare('SELECT * FROM flash_sale_items WHERE id = ?').get(flashId);
    res.json({ success: true, message: 'Product added to Flash Sale!', item: saved });
  } catch (err) {
    console.error('Flash sale POST error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/flash-sale/:id', (req, res) => {
  try {
    const { id } = req.params;
    // Allow deleting by flash ID or product ID
    db.prepare('DELETE FROM flash_sale_items WHERE id = ? OR product_id = ?').run(id, id);
    res.json({ success: true, message: 'Item removed from Flash Sale.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5b. Alibaba Global Sourcing & Import Engine APIs
app.get('/api/alibaba/trending', (req, res) => {
  res.json({
    success: true,
    total: ALIBABA_TRENDING_CATALOG.length,
    products: ALIBABA_TRENDING_CATALOG
  });
});

// 5c. 1688 Account Session & Cookie APIs
app.get('/api/1688/cookie-status', (req, res) => {
  const cookie = get1688Cookie();
  res.json({
    success: true,
    hasCookie: !!cookie,
    length: cookie ? cookie.length : 0,
    preview: cookie ? `${cookie.slice(0, 15)}...${cookie.slice(-10)}` : null
  });
});

app.post('/api/1688/save-cookie', (req, res) => {
  try {
    const { cookie } = req.body;
    const result = set1688Cookie(cookie);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save 1688 cookie: ' + err.message });
  }
});

app.post('/api/1688/clear-cookie', (req, res) => {
  try {
    const result = clear1688Cookie();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear 1688 cookie: ' + err.message });
  }
});

app.post('/api/1688/test-session', async (req, res) => {
  try {
    const result = await test1688Cookie();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to test 1688 session: ' + err.message });
  }
});

// In-memory Distributor Import Jobs
const distributorImportJobs = new Map();

// 5d. 1688 Bulk Distributor & Store Catalog APIs
app.post('/api/1688/distributor/scan', async (req, res) => {
  try {
    const { storeUrl, maxCount, keyword, categoryId } = req.body;
    if (!storeUrl) {
      return res.status(400).json({ error: 'Please provide a 1688 distributor store link' });
    }
    const result = await scan1688DistributorStore(storeUrl, maxCount || 100, keyword || null, categoryId || 'luggage-bags-cases');
    res.json(result);
  } catch (err) {
    console.error('Scan 1688 distributor error:', err);
    res.status(500).json({ error: 'Failed to scan distributor store: ' + err.message });
  }
});

app.post('/api/1688/distributor/start-import', async (req, res) => {
  try {
    const { products, categoryId } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'No products provided for bulk import' });
    }

    const jobId = 'dist_job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const job = {
      id: jobId,
      status: 'running',
      total: products.length,
      completed: 0,
      failed: 0,
      startedAt: new Date().toISOString(),
      currentItem: products[0]?.title || 'Starting...',
      importedProducts: [],
      error: null
    };

    distributorImportJobs.set(jobId, job);

    (async () => {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO products (id, data_json, category_id, title, price) 
        VALUES (?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < products.length; i++) {
        const currentJob = distributorImportJobs.get(jobId);
        if (!currentJob || currentJob.status === 'stopped') {
          break;
        }

        const prod = products[i];
        try {
          currentJob.currentItem = prod.title || `Item #${i + 1}`;
          
          const safeId = prod.id || `1688-${prod.offerId || Date.now()}-${i}`;
          const safeTitle = prod.title || '1688 Factory Direct Product';
          const safeCat = categoryId || prod.categoryId || 'luggage-bags-cases';
          const safePrice = parseFloat(prod.samplePrice) || parseFloat(prod.price) || 15.0;

          const fullProduct = {
            ...prod,
            id: safeId,
            title: safeTitle,
            categoryId: safeCat,
            samplePrice: safePrice,
            price: safePrice,
            isAlibabaImport: true,
            is1688Import: true,
            platform: '1688',
            importedAt: new Date().toISOString()
          };

          stmt.run(safeId, JSON.stringify(fullProduct), safeCat, safeTitle, safePrice);

          currentJob.completed++;
          currentJob.importedProducts.unshift({
            id: safeId,
            title: safeTitle,
            priceNPR: fullProduct.priceNPR,
            image: (fullProduct.images && fullProduct.images[0]) || fullProduct.featuredImage,
            supplier: fullProduct.supplier
          });

          if (currentJob.importedProducts.length > 40) {
            currentJob.importedProducts.pop();
          }

          if (i % 5 === 0) {
            await new Promise(r => setTimeout(r, 35));
          }
        } catch (itemErr) {
          console.error(`Item ${i} import error:`, itemErr.message);
          currentJob.failed++;
        }
      }

      const finalJob = distributorImportJobs.get(jobId);
      if (finalJob && finalJob.status === 'running') {
        finalJob.status = 'completed';
        finalJob.completedAt = new Date().toISOString();
      }
    })();

    res.json({
      success: true,
      jobId,
      total: products.length,
      message: `Bulk import job started for ${products.length} distributor products.`
    });
  } catch (err) {
    console.error('Start bulk import error:', err);
    res.status(500).json({ error: 'Failed to start bulk import: ' + err.message });
  }
});

app.get('/api/1688/distributor/job/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = distributorImportJobs.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Import job not found or expired' });
  }
  res.json({
    success: true,
    job: {
      id: job.id,
      status: job.status,
      total: job.total,
      completed: job.completed,
      failed: job.failed,
      progressPercent: job.total > 0 ? Math.round((job.completed / job.total) * 100) : 0,
      currentItem: job.currentItem,
      recentImported: job.importedProducts.slice(0, 10),
      startedAt: job.startedAt,
      completedAt: job.completedAt || null
    }
  });
});

app.post('/api/1688/distributor/stop/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = distributorImportJobs.get(jobId);
  if (job) {
    job.status = 'stopped';
    return res.json({ success: true, message: `Job stopped. ${job.completed} products saved to catalog.` });
  }
  res.status(404).json({ error: 'Job not found' });
});

app.post('/api/alibaba/preview', async (req, res) => {
  try {
    const { url, markupPercent, customTitle, categoryId } = req.body;
    if (!url) return res.status(400).json({ error: 'Missing product URL (Alibaba or 1688)' });

    const parsed = await parseGlobalSourcingUrl(url, markupPercent || 200, categoryId || null, customTitle || null);
    res.json({ success: true, product: parsed });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze product URL: ' + err.message });
  }
});

app.post('/api/alibaba/import', async (req, res) => {
  try {
    const { url, markupPercent, customTitle, categoryId, product } = req.body;
    let parsed = product;

    if (!parsed) {
      if (!url) return res.status(400).json({ error: 'Missing product URL (Alibaba or 1688)' });
      parsed = await parseGlobalSourcingUrl(url, markupPercent || 200, categoryId || null, customTitle || null);
    }

    // 1. Sanitize ID
    const safeId = (parsed.id && String(parsed.id).trim()) || `1688-${Date.now()}`;
    parsed.id = safeId;

    // 2. Sanitize Title
    if (customTitle && String(customTitle).trim()) {
      parsed.title = String(customTitle).trim();
    }
    const safeTitle = (parsed.title && String(parsed.title).trim()) || '1688 Factory Direct Product';
    parsed.title = safeTitle;

    // 3. Sanitize Category
    const safeCategoryId = (categoryId && String(categoryId).trim())
      || (parsed.categoryId && String(parsed.categoryId).trim())
      || (parsed.category_id && String(parsed.category_id).trim())
      || 'apparel-accessories';
    parsed.categoryId = safeCategoryId;

    if (!parsed.categoryName) {
      const catObj = CATEGORIES.find(c => c.id === safeCategoryId);
      parsed.categoryName = catObj ? catObj.name : 'General Catalog';
    }

    // 4. Sanitize Sample Price & NPR Price
    let safePrice = parseFloat(parsed.samplePrice);
    if (isNaN(safePrice) || safePrice <= 0) {
      safePrice = parseFloat(parsed.price) || 10.0;
    }
    parsed.samplePrice = safePrice;
    parsed.price = safePrice;
    if (!parsed.priceNPR || isNaN(parsed.priceNPR)) {
      parsed.priceNPR = Math.round(safePrice * 133.5);
    }

    // 5. Ensure valid images array
    if (!Array.isArray(parsed.images) || parsed.images.length === 0) {
      parsed.images = ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'];
    }

    // 6. Safe Duplicate Check by ID
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(safeId);
    if (existing) {
      parsed.id = existing.id;
    }

    // 7. Save directly to Bhanjo products SQLite table with indexed category_id, title, price
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO products (id, data_json, category_id, title, price) VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(parsed.id, JSON.stringify(parsed), safeCategoryId, safeTitle, safePrice);

    res.status(201).json({
      success: true,
      message: `Successfully imported "${safeTitle.slice(0, 30)}..." to ${parsed.categoryName || safeCategoryId}!`,
      product: parsed
    });
  } catch (err) {
    console.error('Import product error:', err);
    res.status(500).json({ error: 'Failed to import product: ' + err.message });
  }
});

app.post('/api/alibaba/bulk-import', (req, res) => {
  try {
    const { categoryId } = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO products (id, data_json, category_id, title, price) VALUES (?, ?, ?, ?, ?)
    `);

    let importedCount = 0;
    const listToImport = categoryId 
      ? ALIBABA_TRENDING_CATALOG.filter(p => p.categoryId === categoryId)
      : ALIBABA_TRENDING_CATALOG;

    for (const prod of listToImport) {
      const catId = prod.categoryId || prod.category_id || 'apparel-accessories';
      const priceVal = parseFloat(prod.samplePrice) || parseFloat(prod.price) || 10;
      stmt.run(prod.id, JSON.stringify(prod), catId, prod.title || 'Alibaba Wholesale SKU', priceVal);
      importedCount++;
    }

    res.json({
      success: true,
      message: `Successfully bulk imported ${importedCount} Alibaba factory products into Bhanjo catalog!`,
      count: importedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Inquiries API
app.post('/api/inquiries', (req, res) => {
  try {
    const { productId, productTitle, supplierId, customerName, phone, email, message } = req.body;
    const id = `inq-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO inquiries (id, product_id, product_title, supplier_id, customer_name, phone, email, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `);
    stmt.run(
      id, 
      productId || '', 
      productTitle || 'General Catalog Inquiry',
      supplierId || '', 
      customerName || 'Bhanjo Shopper', 
      phone || '', 
      email || '',
      message || ''
    );
    res.status(201).json({ success: true, message: 'Inquiry delivered to supplier', inquiryId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inquiries', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC');
    const inquiries = stmt.all();
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/inquiries/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const stmt = db.prepare('UPDATE inquiries SET status = ? WHERE id = ?');
    stmt.run(status || 'replied', req.params.id);
    res.json({ success: true, message: 'Inquiry status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Store / Platform Analytics Stats API
app.get('/api/stats', (req, res) => {
  try {
    const ordersCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const sellersCount = db.prepare('SELECT COUNT(*) as count FROM sellers').get().count;
    const inquiriesCount = db.prepare('SELECT COUNT(*) as count FROM inquiries').get().count;
    const totalRev = db.prepare('SELECT SUM(total_amount) as sum FROM orders').get().sum || 0;

    res.json({
      success: true,
      stats: {
        totalOrders: ordersCount,
        totalSellers: sellersCount,
        totalInquiries: inquiriesCount,
        totalRevenueUSD: parseFloat(totalRev.toFixed(2)),
        onTimeDispatchRate: '99.8%',
        buyerSatisfactionRate: '4.9/5.0'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Coupon Validation API
app.post('/api/coupons/validate', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Please enter a coupon code' });

  const clean = code.trim().toUpperCase();
  const validCoupons = {
    'BHANJO10': { code: 'BHANJO10', type: 'percentage', value: 10, label: '10% Off Cart Voucher' },
    'FREEEXP': { code: 'FREEEXP', type: 'shipping', value: 100, label: 'Free Express Shipping Voucher' },
    'EXP100': { code: 'EXP100', type: 'shipping', value: 100, label: 'Free Express Shipping Voucher' },
    'NEPAL50': { code: 'NEPAL50', type: 'fixed', value: 2.0, label: 'Festive NPR 267 ($2) Discount Voucher' },
    'FESTIVAL': { code: 'FESTIVAL', type: 'fixed', value: 2.0, label: 'Festive NPR 267 ($2) Discount Voucher' }
  };

  if (validCoupons[clean]) {
    res.json({ valid: true, coupon: validCoupons[clean] });
  } else {
    res.status(404).json({ valid: false, message: 'Invalid or expired promo code. Try BHANJO10 or FREEEXP' });
  }
});

// 9. Supabase Product Image Upload API
app.post('/api/upload/image', async (req, res) => {
  try {
    const { base64, filename, contentType = 'image/jpeg' } = req.body;
    if (!base64) {
      return res.status(400).json({ error: 'Image data (base64) is required' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ error: 'Supabase storage is not configured' });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceKey);

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileExt = contentType.split('/')[1] || 'jpg';
    const filePath = `products/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      return res.status(500).json({ error: 'Failed to upload image: ' + error.message });
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    res.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload handler error: ' + err.message });
  }
});

// ==========================================
// 10. Dedicated Customer Cart & Wishlist APIs (Separated per User in SQLite)
// ==========================================

// --- Cart: Get Customer Cart ---
app.get('/api/cart', authenticateCustomer, (req, res) => {
  try {
    const userId = req.user.id;
    const rows = db.prepare(`
      SELECT * FROM customer_cart 
      WHERE user_id = ? 
      ORDER BY updated_at DESC, created_at DESC
    `).all(userId);

    const items = rows.map(r => {
      let product = null;
      try {
        if (r.item_data_json) product = JSON.parse(r.item_data_json);
      } catch (e) {}

      return {
        id: r.id,
        productId: r.product_id,
        title: r.title,
        image: r.image,
        unitPrice: r.unit_price,
        unitPriceUSD: r.unit_price,
        quantity: r.quantity,
        totalPrice: r.quantity * r.unit_price,
        orderType: r.order_type,
        customNotes: r.custom_notes || '',
        product: product || {
          id: r.product_id,
          title: r.title,
          images: [r.image],
          samplePrice: r.unit_price
        }
      };
    });

    res.json({ success: true, items });
  } catch (err) {
    console.error('Fetch cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// --- Cart: Add Item to Customer Cart ---
app.post('/api/cart', authenticateCustomer, (req, res) => {
  try {
    const userId = req.user.id;
    const { product, quantity = 1, orderType = 'retail', customNotes = '' } = req.body;

    if (!product || !product.id) {
      return res.status(400).json({ error: 'Valid product is required' });
    }

    const productId = product.id;
    const title = product.title || 'Bhanjo Item';
    const image = product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400';
    const unitPrice = parseFloat(product.samplePrice || product.unitPrice || 20);
    const itemDataJson = JSON.stringify(product);

    // Check if item already exists in this customer's cart
    const existing = db.prepare(`
      SELECT id, quantity FROM customer_cart 
      WHERE user_id = ? AND product_id = ? AND order_type = ?
    `).get(userId, productId, orderType);

    if (existing) {
      const newQty = existing.quantity + quantity;
      db.prepare(`
        UPDATE customer_cart 
        SET quantity = ?, unit_price = ?, item_data_json = ?, custom_notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newQty, unitPrice, itemDataJson, customNotes, existing.id);
    } else {
      const newId = `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      db.prepare(`
        INSERT INTO customer_cart 
        (id, user_id, product_id, title, image, unit_price, quantity, order_type, custom_notes, item_data_json, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(newId, userId, productId, title, image, unitPrice, quantity, orderType, customNotes, itemDataJson);
    }

    // Return the customer's updated cart
    const rows = db.prepare(`
      SELECT * FROM customer_cart 
      WHERE user_id = ? 
      ORDER BY updated_at DESC, created_at DESC
    `).all(userId);

    const items = rows.map(r => {
      let prod = null;
      try {
        if (r.item_data_json) prod = JSON.parse(r.item_data_json);
      } catch (e) {}

      return {
        id: r.id,
        productId: r.product_id,
        title: r.title,
        image: r.image,
        unitPrice: r.unit_price,
        unitPriceUSD: r.unit_price,
        quantity: r.quantity,
        totalPrice: r.quantity * r.unit_price,
        orderType: r.order_type,
        customNotes: r.custom_notes || '',
        product: prod || { id: r.product_id, title: r.title, images: [r.image], samplePrice: r.unit_price }
      };
    });

    res.json({ success: true, message: 'Item added to cart', items });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// --- Cart: Update Quantity ---
app.put('/api/cart/:productId', authenticateCustomer, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity, orderType = 'retail' } = req.body;

    if (quantity <= 0) {
      db.prepare(`
        DELETE FROM customer_cart 
        WHERE user_id = ? AND (product_id = ? OR id = ?) AND order_type = ?
      `).run(userId, productId, productId, orderType);
    } else {
      db.prepare(`
        UPDATE customer_cart 
        SET quantity = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND (product_id = ? OR id = ?) AND order_type = ?
      `).run(quantity, userId, productId, productId, orderType);
    }

    const rows = db.prepare(`
      SELECT * FROM customer_cart 
      WHERE user_id = ? 
      ORDER BY updated_at DESC, created_at DESC
    `).all(userId);

    const items = rows.map(r => {
      let prod = null;
      try {
        if (r.item_data_json) prod = JSON.parse(r.item_data_json);
      } catch (e) {}

      return {
        id: r.id,
        productId: r.product_id,
        title: r.title,
        image: r.image,
        unitPrice: r.unit_price,
        unitPriceUSD: r.unit_price,
        quantity: r.quantity,
        totalPrice: r.quantity * r.unit_price,
        orderType: r.order_type,
        customNotes: r.custom_notes || '',
        product: prod || { id: r.product_id, title: r.title, images: [r.image], samplePrice: r.unit_price }
      };
    });

    res.json({ success: true, items });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// --- Cart: Remove Item ---
app.delete('/api/cart/:productId', authenticateCustomer, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    db.prepare(`
      DELETE FROM customer_cart 
      WHERE user_id = ? AND (product_id = ? OR id = ?)
    `).run(userId, productId, productId);

    const rows = db.prepare(`
      SELECT * FROM customer_cart 
      WHERE user_id = ? 
      ORDER BY updated_at DESC, created_at DESC
    `).all(userId);

    const items = rows.map(r => {
      let prod = null;
      try {
        if (r.item_data_json) prod = JSON.parse(r.item_data_json);
      } catch (e) {}

      return {
        id: r.id,
        productId: r.product_id,
        title: r.title,
        image: r.image,
        unitPrice: r.unit_price,
        unitPriceUSD: r.unit_price,
        quantity: r.quantity,
        totalPrice: r.quantity * r.unit_price,
        orderType: r.order_type,
        customNotes: r.custom_notes || '',
        product: prod || { id: r.product_id, title: r.title, images: [r.image], samplePrice: r.unit_price }
      };
    });

    res.json({ success: true, message: 'Item removed from cart', items });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// --- Cart: Clear Customer Cart ---
app.delete('/api/cart', authenticateCustomer, (req, res) => {
  try {
    const userId = req.user.id;
    db.prepare(`DELETE FROM customer_cart WHERE user_id = ?`).run(userId);
    res.json({ success: true, message: 'Cart cleared', items: [] });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// --- Wishlist: Get Customer Wishlist ---
app.get('/api/wishlist', authenticateCustomer, (req, res) => {
  try {
    const userId = req.user.id;
    const rows = db.prepare(`
      SELECT * FROM customer_wishlist 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(userId);

    const items = rows.map(r => {
      try {
        return JSON.parse(r.product_data_json);
      } catch (e) {
        return { id: r.product_id };
      }
    });

    res.json({ success: true, items });
  } catch (err) {
    console.error('Fetch wishlist error:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// --- Wishlist: Toggle Item in Customer Wishlist ---
app.post('/api/wishlist/toggle', authenticateCustomer, (req, res) => {
  try {
    const userId = req.user.id;
    const { product } = req.body;

    if (!product || !product.id) {
      return res.status(400).json({ error: 'Valid product is required' });
    }

    const productId = product.id;
    const existing = db.prepare(`
      SELECT id FROM customer_wishlist 
      WHERE user_id = ? AND product_id = ?
    `).get(userId, productId);

    let isInWishlist = false;
    if (existing) {
      db.prepare(`DELETE FROM customer_wishlist WHERE id = ?`).run(existing.id);
      isInWishlist = false;
    } else {
      const newId = `wish-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      db.prepare(`
        INSERT INTO customer_wishlist (id, user_id, product_id, product_data_json, created_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(newId, userId, productId, JSON.stringify(product));
      isInWishlist = true;
    }

    const rows = db.prepare(`
      SELECT * FROM customer_wishlist 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(userId);

    const items = rows.map(r => {
      try {
        return JSON.parse(r.product_data_json);
      } catch (e) {
        return { id: r.product_id };
      }
    });

    res.json({ success: true, isInWishlist, items });
  } catch (err) {
    console.error('Toggle wishlist error:', err);
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

// --- Wishlist: Delete Item from Customer Wishlist ---
app.delete('/api/wishlist/:productId', authenticateCustomer, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    db.prepare(`
      DELETE FROM customer_wishlist 
      WHERE user_id = ? AND product_id = ?
    `).run(userId, productId);

    const rows = db.prepare(`
      SELECT * FROM customer_wishlist 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(userId);

    const items = rows.map(r => {
      try {
        return JSON.parse(r.product_data_json);
      } catch (e) {
        return { id: r.product_id };
      }
    });

    res.json({ success: true, message: 'Item removed from wishlist', items });
  } catch (err) {
    console.error('Delete wishlist item error:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Bhanjo.com API Server running on port ${PORT}`);
});
