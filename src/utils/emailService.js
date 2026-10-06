/**
 * emailService.js
 * Sends OTP verification emails via EmailJS.
 *
 * HOW TO SET UP (one-time):
 * 1. Go to https://www.emailjs.com and sign up (free tier = 200 emails/month).
 * 2. Add an Email Service (Gmail recommended) → note the Service ID.
 * 3. Create an Email Template with these variables:
 *      {{to_email}}    – recipient email
 *      {{to_name}}     – seller's name
 *      {{store_name}}  – their store/stall name
 *      {{otp_code}}    – the 6-digit code
 *      {{expiry_mins}} – how long the code is valid (e.g. 5)
 * 4. Copy your Public Key from Account → API Keys.
 * 5. Fill in the three constants below (or set as VITE_ env vars).
 */

// ─── EmailJS Credentials ───────────────────────────────────────────────────
// Replace these with your own values from https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';

let _initialized = false;

async function getEmailJS() {
  const { default: emailjs } = await import('@emailjs/browser');
  if (!_initialized) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    _initialized = true;
  }
  return emailjs;
}

/**
 * Sends the OTP code to the seller's personal email.
 *
 * @param {object} params
 * @param {string} params.toEmail   – seller's personal email address
 * @param {string} params.toName    – seller's full name
 * @param {string} params.storeName – name of their stall/venture
 * @param {string} params.otpCode   – 6-digit OTP string
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function sendOtpEmail({ toEmail, toName, storeName, otpCode }) {
  // Credentials not configured – gracefully skip sending
  if (
    EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY' ||
    EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID' ||
    EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
  ) {
    console.warn(
      '[EmailJS] Credentials not configured. Set VITE_EMAILJS_PUBLIC_KEY, ' +
      'VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID in your .env file.'
    );
    // Return success=false so the UI can show a fallback
    return { success: false, error: 'email_not_configured' };
  }

  try {
    const emailjs = await getEmailJS();
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:    toEmail,
      to_name:     toName,
      store_name:  storeName,
      otp_code:    otpCode,
      expiry_mins: '5',
    });
    return { success: true };
  } catch (err) {
    console.error('[EmailJS] Failed to send OTP email:', err);
    return { success: false, error: err?.text || err?.message || 'Unknown error' };
  }
}
