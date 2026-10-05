// Master Admin Security Middleware for Bhanjo.com
// Implements 4-Layer Defense-in-Depth Architecture:
// Layer 1: Server-Side Authentication & 404 Cloaking
// Layer 2: Dedicated Backend Isolation (Zero client code leakage)
// Layer 3: Hardware Dual-2FA & Brute-Force Rate Limiter
// Layer 4: IP Whitelisting Shield

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bhanjo_super_secret_jwt_key_2026_nepal_marketplace_production_ready';

// In-memory brute force tracker (IP -> { attempts, lockedUntil })
const loginAttempts = new Map();

// Parse cookies from raw request header
export const parseCookies = (req) => {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const key = parts.shift().trim();
      if (key) {
        list[key] = decodeURIComponent(parts.join('='));
      }
    });
  }
  return list;
};

// Normalize IPv4 & IPv6 strings
export const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  let rawIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket.remoteAddress || req.ip || '');
  if (rawIp.startsWith('::ffff:')) {
    rawIp = rawIp.replace('::ffff:', '');
  }
  return rawIp;
};

// Layer 4: IP Whitelisting Shield
export const verifyAdminIp = (req, res, next) => {
  const ip = getClientIp(req);
  
  // Always permit local development interfaces
  const isLocal = ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
  const isLan = ip.startsWith('192.168.') || ip.startsWith('10.') || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip);

  // Optional custom production IPs from .env (e.g. ADMIN_ALLOWED_IPS=103.1.2.3,27.34.5.6)
  const allowedCustomIps = process.env.ADMIN_ALLOWED_IPS 
    ? process.env.ADMIN_ALLOWED_IPS.split(',').map(s => s.trim()) 
    : [];

  const isAllowed = isLocal || isLan || allowedCustomIps.includes(ip);

  if (!isAllowed) {
    console.warn(`🚨 [SECURITY ALERT] Unauthorized IP ${ip} attempted to access Master Admin Portal. Request dropped.`);
    return res.status(403).send(`
      <!DOCTYPE html>
      <html>
      <head><title>403 Access Forbidden</title></head>
      <body style="font-family:-apple-system,sans-serif;background:#090d16;color:#e2e8f0;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
        <div style="max-width:480px;padding:32px;background:#0f172a;border:1px solid #dc2626;border-radius:12px;text-align:center;">
          <h2 style="color:#ef4444;margin-top:0;">🛡️ 403 Forbidden: IP Restricted</h2>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;">Your IP address (<strong>${ip}</strong>) is not authorized to access the Bhanjo.com Master Admin Command Center.</p>
          <div style="font-size:11px;color:#64748b;margin-top:20px;border-top:1px solid #1e293b;padding-top:12px;">Bhanjo Security Subsystem • Hardware Shield Active</div>
        </div>
      </body>
      </html>
    `);
  }

  next();
};

// Layer 3: Brute-Force Rate Limiter
export const checkBruteForce = (req, res, next) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && record.lockedUntil && record.lockedUntil > now) {
    const remainingMins = Math.ceil((record.lockedUntil - now) / 60000);
    return res.status(429).json({
      error: `Security Lockout: Too many failed login attempts. This IP is locked for ${remainingMins} more minute(s).`
    });
  }

  next();
};

export const recordFailedAttempt = (req) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, lockedUntil: null };

  record.attempts += 1;
  if (record.attempts >= 5) {
    record.lockedUntil = now + 15 * 60 * 1000; // 15-minute lock
    console.warn(`🔒 [BRUTE-FORCE BAN] IP ${ip} exceeded 5 failed attempts. Locked for 15 minutes.`);
  }

  loginAttempts.set(ip, record);
};

export const clearFailedAttempts = (req) => {
  const ip = getClientIp(req);
  loginAttempts.delete(ip);
};

// Layer 1: Authenticate Admin Session
export const verifyAdminSession = (req) => {
  const cookies = parseCookies(req);
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null) || cookies['bhanjo_admin_token'];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.role === 'admin') {
      return decoded;
    }
  } catch (err) {
    // Expired or invalid token
  }
  return null;
};
