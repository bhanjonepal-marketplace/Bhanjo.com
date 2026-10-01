import dotenv from 'dotenv';
dotenv.config();

/**
 * Universal SMS Dispatch Service for Nepal and International
 * Supports:
 * 1. Twilio (Global, sends to +977 Nepal mobile numbers)
 * 2. Sparrow SMS (Nepal #1 Gateway - http://api.sparrowsms.com/v2/sms/)
 * 3. Aakash SMS (Nepal Gateway - https://aakashsms.com/admin/api/v3/sms/send)
 */

export async function sendSmsNotification({ to, code }) {
  // Clean phone number
  const rawDigits = to.toString().replace(/\D/g, '');
  const nepaliNumber = rawDigits.slice(-10); // e.g. 9705435590
  const internationalNumber = `+977${nepaliNumber}`;
  const messageBody = `[Bhanjo.com] Your Master Admin 2FA Security Code is: ${code}. Valid for 5 minutes. Do NOT share this code with anyone.`;

  console.log(`\n📲 [SMS DISPATCH INITIATED] Target: ${internationalNumber}`);

  // Provider 1: Twilio
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const twilioModule = await import('twilio');
      const twilio = twilioModule.default;
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

      const message = await client.messages.create({
        body: messageBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: internationalNumber
      });

      console.log(`✅ [Twilio SMS Delivered] SID: ${message.sid} to ${internationalNumber}`);
      return { success: true, provider: 'twilio', sid: message.sid };
    } catch (err) {
      console.error(`❌ [Twilio SMS Failed]:`, err.message);
      return { success: false, provider: 'twilio', error: err.message };
    }
  }

  // Provider 2: Sparrow SMS (Nepal Gateway)
  if (process.env.SPARROW_SMS_TOKEN) {
    try {
      const params = new URLSearchParams({
        token: process.env.SPARROW_SMS_TOKEN,
        from: process.env.SPARROW_SMS_IDENTITY || 'Bhanjo',
        to: nepaliNumber,
        text: messageBody
      });

      const response = await fetch(`http://api.sparrowsms.com/v2/sms/?${params.toString()}`);
      const data = await response.json();
      console.log(`✅ [Sparrow SMS Nepal Response]:`, data);
      return { success: true, provider: 'sparrow', data };
    } catch (err) {
      console.error(`❌ [Sparrow SMS Failed]:`, err.message);
      return { success: false, provider: 'sparrow', error: err.message };
    }
  }

  // Provider 3: Aakash SMS (Nepal Gateway)
  if (process.env.AAKASH_SMS_AUTH_TOKEN) {
    try {
      const response = await fetch('https://aakashsms.com/admin/api/v3/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: process.env.AAKASH_SMS_AUTH_TOKEN,
          to: nepaliNumber,
          text: messageBody
        })
      });
      const data = await response.json();
      console.log(`✅ [Aakash SMS Nepal Response]:`, data);
      return { success: true, provider: 'aakash', data };
    } catch (err) {
      console.error(`❌ [Aakash SMS Failed]:`, err.message);
      return { success: false, provider: 'aakash', error: err.message };
    }
  }

  // Fallback notice if API credentials haven't been provided yet
  console.log(`⚠️  [SMS API Note]: No live SMS provider credentials configured yet in server/.env.`);
  console.log(`💬 Simulated Carrier Message to [${internationalNumber}]: "${messageBody}"`);
  return { 
    success: false, 
    provider: 'none', 
    message: 'SMS provider not configured in .env' 
  };
}
