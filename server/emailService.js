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

export async function sendEmailNotification({ to, code, name, type = 'customer' }) {
  console.log(`\n📧 [EMAIL DISPATCH INITIATED] Target: ${to} (Type: ${type})`);

  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || 'bhanjonepal@gmail.com').trim();
  const rawPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').trim();
  const pass = rawPass.replace(/\s+/g, '');

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass
        }
      });

      const isAdmin = type === 'admin';
      const subject = isAdmin 
        ? `[Bhanjo.com] Master Admin 2FA Security Code: ${code}` 
        : `[Bhanjo.com] Your Account Verification Code: ${code}`;

      const title = isAdmin ? 'Master Admin Security Portal' : "Nepal's Premier Online Marketplace";
      const greeting = isAdmin 
        ? `Hello <strong>${name || 'Prashanna'}</strong>, a login was initiated for the Master Admin Command Center.`
        : `Namaste <strong>${name || 'Shopper'}</strong>, welcome to Bhanjo.com! Please enter the 6-digit verification code below to activate your account and start shopping:`;

      const subWarning = isAdmin
        ? '⚠️ This code will expire in <strong>5 minutes</strong>. Both this email code and your SMS code are required to access admin tools.'
        : '⚠️ This code is valid for <strong>10 minutes</strong>. Never share your verification code with anyone.';

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
          <div style="background: linear-gradient(135deg, #F85606 0%, #d97706 100%); padding: 26px 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">BHANJO.COM</h1>
            <p style="margin: 6px 0 0 0; color: #fef08a; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${title}</p>
          </div>
          
          <div style="padding: 32px 24px; background: #0b1120;">
            <p style="font-size: 14px; color: #cbd5e1; margin-top: 0; line-height: 1.6;">${greeting}</p>
            
            <div style="text-align: center; margin: 28px 0; background: #020617; padding: 22px; border-radius: 14px; border: 1px dashed #F85606;">
              <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; display: block; margin-bottom: 6px; letter-spacing: 1.5px; font-weight: bold;">
                ${isAdmin ? 'Master Admin Code' : 'Verification Code'}
              </span>
              <span style="font-family: 'Courier New', monospace; font-size: 38px; font-weight: 900; color: #fb923c; letter-spacing: 8px;">${code}</span>
            </div>
            
            <p style="font-size: 11px; color: #64748b; line-height: 1.6;">
              ${subWarning}
            </p>
          </div>

          <div style="background: #020617; padding: 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b;">
            © 2026 Bhanjo.com Ltd. • Kathmandu, Nepal • 100% Genuine Marketplace
          </div>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `"Bhanjo.com Official" <${user}>`,
        to,
        subject,
        text: `Your Bhanjo.com verification code is: ${code}`,
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
  return { success: false, message: 'Email provider not configured in .env' };
}
