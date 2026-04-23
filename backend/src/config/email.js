const nodemailer = require('nodemailer');
const config = require('./env');

let transporter = null;

/**
 * Create and cache an email transporter.
 *
 * Priority order:
 *  1. Resend API  — if RESEND_API_KEY is set
 *  2. SMTP        — if SMTP_HOST + SMTP_USER + SMTP_PASS are set
 *  3. null        — graceful degradation (console logging)
 *
 * Returns either:
 *  - { type: 'resend' }               — signals emailService to use Resend API
 *  - a nodemailer Transport object    — standard SMTP sending
 *  - null                             — no transport; emails logged to console
 */
const getTransporter = () => {
  if (transporter) return transporter;

  // ── 1. Resend API via SMTP ─────────────────────────────────────────────────
  if (config.resend && config.resend.apiKey) {
    console.log('📧 Email transport: Resend (SMTP)');
    
    // Check if user is trying to send from a generic email (Resend requires verified domains or onboarding@resend.dev)
    const fromEmail = config.resend.from || '';
    if (fromEmail.includes('@gmail.com') || fromEmail.includes('@yahoo.com') || fromEmail.includes('@hotmail.com')) {
      console.warn('⚠️ WARNING: Resend does not allow sending FROM generic email addresses like Gmail.');
      console.warn('⚠️ You MUST use "onboarding@resend.dev" for testing, or a verified domain.');
      console.warn('⚠️ Overriding FROM address to onboarding@resend.dev to prevent failure.');
      config.resend.from = 'Event Platform <onboarding@resend.dev>';
    }

    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: config.resend.apiKey,
      },
    });
    return transporter;
  }

  // ── 2. SMTP ────────────────────────────────────────────────────────────────
  if (config.smtp.host && config.smtp.user && config.smtp.pass) {
    console.log(`📧 Email transport: SMTP (${config.smtp.host}:${config.smtp.port})`);
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
    return transporter;
  }

  // ── 3. No transport — graceful fallback ────────────────────────────────────
  console.warn(
    '⚠️  No email transport configured (RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS).' +
    ' Emails will be logged to console.'
  );
  return null;
};

module.exports = { getTransporter };
