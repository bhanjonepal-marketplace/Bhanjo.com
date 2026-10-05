import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Universal Email Dispatch Service for Bhanjo.com
 * Powered by Google Gmail SMTP (bhanjonepal@gmail.com)
 */

let sharedTransporter = null;

function getTransporter(user, pass) {
  if (!sharedTransporter) {
    sharedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      },
      pool: true,
      maxConnections: 5,
      maxMessages: Infinity,
      socketTimeout: 30000,
      connectionTimeout: 8000,
      greetingTimeout: 8000
    });

    // Asynchronously pre-warm connection pool in the background
    sharedTransporter.verify((err) => {
      if (err) {
        console.warn('⚠️  [SMTP Warmup Notice]:', err.message);
      } else {
        console.log('⚡ [SMTP Connection Pool Ready & Pre-warmed]');
      }
    });
  }
  return sharedTransporter;
}

// Pre-initialize on service startup
const bootUser = (process.env.SMTP_USER || process.env.GMAIL_USER || 'bhanjonepal@gmail.com').trim();
const bootPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
if (bootUser && bootPass) {
  try {
    getTransporter(bootUser, bootPass);
  } catch (e) {}
}

export async function sendEmailNotification({ to, code, name, type = 'customer' }) {
  console.log(`\n📧 [EMAIL DISPATCH INITIATED] Target: ${to} (Type: ${type})`);

  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || 'bhanjonepal@gmail.com').trim();
  const rawPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').trim();
  const pass = rawPass.replace(/\s+/g, '');

  if (user && pass) {
    try {
      const transporter = getTransporter(user, pass);

      let subject = `[Bhanjo.com] Your Verification Code: ${code}`;
      let title = 'Account Verification';
      let greeting = `Namaste <strong>${name || 'Shopper'}</strong>, welcome to Bhanjo! Please enter the 6-digit code below to verify your account:`;
      let codeLabel = 'Verification Code';
      let subWarning = '⏱️ This code is valid for <strong>3 minutes</strong>. Never share your verification code with anyone.';

      if (type === 'admin') {
        subject = `[Bhanjo.com] Master Admin 2FA Code: ${code}`;
        title = 'Admin Security Portal';
        greeting = `Hello <strong>${name || 'Prashanna'}</strong>, a login was initiated for the Master Admin Command Center.`;
        codeLabel = 'Master Admin Code';
        subWarning = '⏱️ This code will expire in <strong>5 minutes</strong>. Both email and SMS codes are required.';
      } else if (type === 'login_2fa') {
        subject = `[Bhanjo.com] Login Verification Code: ${code}`;
        title = 'Secure Login Verification';
        greeting = `Namaste <strong>${name || 'Shopper'}</strong>, a sign-in was initiated for your Bhanjo account. Please enter the 6-digit verification code below to complete your login:`;
        codeLabel = 'Login Verification Code';
        subWarning = '⏱️ This code is valid for <strong>3 minutes</strong>. Never share your verification code with anyone.';
      } else if (type === 'password_reset') {
        subject = `[Bhanjo.com] Password Reset Code: ${code}`;
        title = 'Account Security & Recovery';
        greeting = `Namaste <strong>${name || 'Shopper'}</strong>, we received a request to reset your Bhanjo password. Enter the 6-digit code below to set your new password:`;
        codeLabel = 'Password Reset Code';
        subWarning = '⏱️ This code is valid for <strong>3 minutes</strong>. If you did not request this reset, your existing password remains safe and you can ignore this email.';
      }

      const htmlContent = `
        <div style="background-color: #f1f5f9; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 400px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.04);">
            
            <!-- Small Orange Line at Upper -->
            <div style="height: 3px; background: #F85606;"></div>

            <!-- Header -->
            <div style="padding: 22px 20px 14px 20px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <div style="display: inline-block;">
                <span style="font-size: 21px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; text-decoration: none;">
                  Bhanjo<span style="color: #4f46e5;">.com</span>
                </span>
              </div>
              <div style="margin-top: 6px;">
                <span style="display: inline-block; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${title}
                </span>
              </div>
            </div>

            <!-- Body Content -->
            <div style="padding: 20px;">
              <p style="font-size: 13px; color: #334155; margin: 0 0 14px 0; line-height: 1.55;">
                ${greeting}
              </p>

              <!-- Code Box -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 8px; margin: 16px 0; text-align: center;">
                <span style="font-size: 10px; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 4px; letter-spacing: 1.5px; font-weight: 700;">
                  ${codeLabel}
                </span>
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'SF Mono', Monaco, Consolas, 'Courier New', monospace; font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: 7px; display: inline-block;">
                  ${code}
                </span>
              </div>

              <!-- Security Warning -->
              <div style="background: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 10px 12px; font-size: 11px; color: #854d0e; line-height: 1.45;">
                ${subWarning}
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #fafafa; padding: 12px 16px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
              © 2026 Bhanjo.com Ltd. • Kathmandu, Nepal
            </div>

            <!-- Small Sky Line at Down -->
            <div style="height: 3px; background: #0284c7;"></div>

          </div>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `"Bhanjo.com Official" <${user}>`,
        to,
        subject,
        text: `Your Bhanjo.com code is: ${code}. Valid for 3 minutes.`,
        html: htmlContent
      });

      console.log(`✅ [Real Email Sent from ${user} to ${to}] Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`❌ [Email Sending Failed]:`, err.message);
      return { success: false, error: err.message };
    }
  }

  console.log(`⚠️  [Email API Note]: SMTP_USER or GMAIL_APP_PASSWORD not configured yet in server/.env.`);
  return { success: false, error: 'Email provider credentials not configured in server/.env' };
}

export async function sendPasswordResetEmail({ to, code, name }) {
  return sendEmailNotification({ to, code, name, type: 'password_reset' });
}
