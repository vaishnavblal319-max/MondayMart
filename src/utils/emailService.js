/**
 * emailService.js
 * Client-side Automated Emails via EmailJS (No backend server required).
 *
 * Supported automated emails:
 * 1. sendOtpEmail: 6-digit OTP code for student vendor onboarding.
 * 2. sendOrderConfirmationEmail: Order receipt with 4-digit pickup PIN pass for customers.
 * 3. sendVentureApprovalEmail: Official credentials sent to student founder upon incubation approval.
 *
 * HOW TO ACTIVATE IN .env:
 *   VITE_EMAILJS_PUBLIC_KEY=your_public_key
 *   VITE_EMAILJS_SERVICE_ID=your_service_id
 *   VITE_EMAILJS_TEMPLATE_ID=your_template_id
 *   (Optional dedicated templates):
 *   VITE_EMAILJS_ORDER_TEMPLATE_ID=your_order_template_id
 *   VITE_EMAILJS_APPROVAL_TEMPLATE_ID=your_approval_template_id
 */

const EMAILJS_PUBLIC_KEY         = import.meta.env.VITE_EMAILJS_PUBLIC_KEY         || 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID         = import.meta.env.VITE_EMAILJS_SERVICE_ID         || 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID        = import.meta.env.VITE_EMAILJS_TEMPLATE_ID        || 'YOUR_TEMPLATE_ID';
const EMAILJS_ORDER_TEMPLATE_ID   = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID   || EMAILJS_TEMPLATE_ID;
const EMAILJS_APPROVAL_TEMPLATE_ID= import.meta.env.VITE_EMAILJS_APPROVAL_TEMPLATE_ID|| EMAILJS_TEMPLATE_ID;

let _initialized = false;

async function getEmailJS() {
  const { default: emailjs } = await import('@emailjs/browser');
  if (!_initialized) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    _initialized = true;
  }
  return emailjs;
}

export const isEmailConfigured = () => {
  return (
    EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY' &&
    EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID' &&
    EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID'
  );
};

/**
 * 1. Sends the OTP code to the seller's email address.
 */
export async function sendOtpEmail({ toEmail, toName, storeName, otpCode }) {
  if (!isEmailConfigured()) {
    console.warn(
      '[EmailJS] Credentials not configured. Add VITE_EMAILJS_PUBLIC_KEY, ' +
      'VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID in your .env file.'
    );
    return { success: false, error: 'email_not_configured' };
  }

  try {
    const emailjs = await getEmailJS();
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:    toEmail,
      email:       toEmail,
      user_email:  toEmail,
      recipient:   toEmail,
      to_name:     toName,
      name:        toName,
      user_name:   toName,
      store_name:  storeName,
      stall_name:  storeName,
      otp_code:    otpCode,
      otp:         otpCode,
      code:        otpCode,
      expiry_mins: '5',
    });
    return { success: true };
  } catch (err) {
    console.error('[EmailJS] Failed to send OTP email:', err);
    return { success: false, error: err?.text || err?.message || 'Unknown error' };
  }
}

/**
 * 2. Sends order confirmation & 4-digit pickup PIN to the customer.
 */
export async function sendOrderConfirmationEmail({
  toEmail,
  toName,
  orderId,
  pin,
  itemsSummary,
  totalAmount,
}) {
  if (!isEmailConfigured()) {
    console.warn('[EmailJS] Skipping order confirmation email (EmailJS not configured).');
    return { success: false, error: 'email_not_configured' };
  }

  try {
    const emailjs = await getEmailJS();
    const templateId = EMAILJS_ORDER_TEMPLATE_ID;
    await emailjs.send(EMAILJS_SERVICE_ID, templateId, {
      to_email:      toEmail,
      to_name:       toName,
      order_id:      orderId,
      pickup_pin:    pin,
      items_summary: itemsSummary,
      total_amount:  totalAmount,
    });
    return { success: true };
  } catch (err) {
    console.error('[EmailJS] Failed to send Order Confirmation email:', err);
    return { success: false, error: err?.text || err?.message || 'Unknown error' };
  }
}

/**
 * 3. Sends official merchant credentials to the student founder upon approval.
 */
export async function sendVentureApprovalEmail({
  toEmail,
  founderName,
  storeName,
  officialEmail,
  defaultPassword,
}) {
  if (!isEmailConfigured()) {
    console.warn('[EmailJS] Skipping venture approval email (EmailJS not configured).');
    return { success: false, error: 'email_not_configured' };
  }

  try {
    const emailjs = await getEmailJS();
    const templateId = EMAILJS_APPROVAL_TEMPLATE_ID;
    await emailjs.send(EMAILJS_SERVICE_ID, templateId, {
      to_email:         toEmail,
      email:            toEmail,
      user_email:       toEmail,
      recipient:        toEmail,
      to_name:          founderName,
      name:             founderName,
      founder_name:     founderName,
      user_name:        founderName,
      store_name:       storeName,
      stall_name:       storeName,
      shop_name:        storeName,
      official_email:   officialEmail,
      username:         officialEmail,
      user_id:          officialEmail,
      seller_email:     officialEmail,
      login_email:      officialEmail,
      default_password: defaultPassword,
      password:         defaultPassword,
      temp_password:    defaultPassword,
      login_url:        typeof window !== 'undefined' ? window.location.origin : '',
    });
    return { success: true };
  } catch (err) {
    console.error('[EmailJS] Failed to send Venture Approval email:', err);
    return { success: false, error: err?.text || err?.message || 'Unknown error' };
  }
}
