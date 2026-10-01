import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

/**
 * Universal Email Dispatch Service for Bhanjo.com
 * Supports:
 * 1. Gmail SMTP (via standard 16-character App Password)
 * 2. Custom SMTP (e.g. Hostinger, Zoho, cPanel, Amazon SES)
 */

export async function sendEmailNotification({ to, code, name }) {
  console.log(`\n📧 [EMAIL DISPATCH INITIATED] Target: ${to}`);

  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        auth: {
          user,
          pass
        }
      });

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
          <div style="background: linear-gradient(135deg, #F85606 0%, #d97706 100%); padding: 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">BHANJO.COM</h1>
            <p style="margin: 4px 0 0 0; color: #fef08a; font-size: 12px; font-weight: bold; text-transform: uppercase;">Master Admin Security Portal</p>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="font-size: 14px; color: #cbd5e1; margin-top: 0;">Hello <strong>${name || 'Prashanna'}</strong>,</p>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
              A login attempt was initiated for the Bhanjo.com Master Admin Command Center. Enter the verification code below along with your SMS code to authenticate:
            </p>
            
            <div style="text-align: center; margin: 28px 0; background: #020617; padding: 20px; border-radius: 12px; border: 1px dashed #F85606;">
              <span style="font-size: 11px; text-transform: uppercase; color: #94a3b8; display: block; margin-bottom: 6px; letter-spacing: 1px;">Email Verification Code</span>
              <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 900; color: #38bdf8; letter-spacing: 8px;">${code}</span>
            </div>
            
            <p style="font-size: 11px; color: #64748b; line-height: 1.5;">
              ⚠️ This code will expire in <strong>5 minutes</strong>. If you did not initiate this login request, your account is safe because the attacker also requires your physical phone SMS code and master password.
            </p>
          </div>

          <div style="background: #020617; padding: 16px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid #1e293b;">
            © 2026 Bhanjo.com Platform Security Division • Kathmandu, Nepal
          </div>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `"Bhanjo Security" <${user}>`,
        to,
        subject: `[Bhanjo.com] Your Master Admin 2FA Code: ${code}`,
        text: `Your Bhanjo.com Master Admin Email Code is: ${code}. Valid for 5 minutes.`,
        html: htmlContent
      });

      console.log(`✅ [Email Delivered Successfully] Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`❌ [Email Sending Failed]:`, err.message);
      return { success: false, error: err.message };
    }
  }

  console.log(`⚠️  [Email API Note]: SMTP_USER or GMAIL_APP_PASSWORD not configured yet in server/.env.`);
  return { success: false, message: 'Email provider not configured in .env' };
}
