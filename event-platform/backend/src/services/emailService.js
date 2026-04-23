const { getTransporter } = require('../config/email');
const config = require('../config/env');

/**
 * Email templates — returns { subject, html } for each event type.
 * All templates use inline styles for maximum email-client compatibility.
 */
const templates = {
  // ── Attendee registration received (pending approval) ──────────────────────
  registrationPending: ({ attendeeName, eventTitle }) => ({
    subject: `⏳ Registration Received — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-top: 0;">Registration Received</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${eventTitle}</strong> has been received and is <strong style="color: #f59e0b;">pending approval</strong> by the organizer.</p>
        <p>We'll notify you once your registration is reviewed. Stay tuned!</p>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">Thank you for your interest!</p>
      </div>
    `,
  }),

  // ── Auto-confirmed (open registration mode) ────────────────────────────────
  registrationConfirmed: ({ attendeeName, eventTitle, eventDate, venue }) => ({
    subject: `✅ Registration Confirmed — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-top: 0;">You're Registered! 🎉</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>
        <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #6366f1;">
          <p style="margin: 4px 0;"><strong>📅 Date:</strong> ${new Date(eventDate).toLocaleString()}</p>
          <p style="margin: 4px 0;"><strong>📍 Venue:</strong> ${venue}</p>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">See you there!</p>
      </div>
    `,
  }),

  // ── Organizer approved the RSVP ────────────────────────────────────────────
  rsvpApproved: ({ attendeeName, eventTitle, eventDate, venue }) => ({
    subject: `✅ Registration Approved — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-top: 0;">You're In! 🎉</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Great news! Your registration for <strong>${eventTitle}</strong> has been <strong style="color: #22c55e;">approved</strong>.</p>
        ${eventDate ? `
        <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 4px 0;"><strong>📅 Date:</strong> ${new Date(eventDate).toLocaleString()}</p>
          ${venue ? `<p style="margin: 4px 0;"><strong>📍 Venue:</strong> ${venue}</p>` : ''}
        </div>` : ''}
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">See you at the event!</p>
      </div>
    `,
  }),

  // ── Organizer rejected the RSVP ────────────────────────────────────────────
  rsvpRejected: ({ attendeeName, eventTitle }) => ({
    subject: `❌ Registration Update — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-top: 0;">Registration Update</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Unfortunately, your registration for <strong>${eventTitle}</strong> has <strong style="color: #ef4444;">not been approved</strong> at this time.</p>
        <p>We appreciate your interest and hope to see you at a future event.</p>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">Thank you for your interest.</p>
      </div>
    `,
  }),

  // ── Organizer revoked an existing registration ─────────────────────────────
  rsvpRevoked: ({ attendeeName, eventTitle }) => ({
    subject: `⚠️ Registration Revoked — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-top: 0;">Registration Revoked</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${eventTitle}</strong> has been <strong style="color: #f59e0b;">revoked</strong> by the organizer.</p>
        <p>If you believe this is an error, please contact the event organizer directly.</p>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">We're sorry for any inconvenience.</p>
      </div>
    `,
  }),

  // ── Event details updated ──────────────────────────────────────────────────
  eventUpdated: ({ attendeeName, eventTitle, eventDate, venue, changes }) => ({
    subject: `📝 Event Updated — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-top: 0;">Event Details Updated</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>The organizer has updated details for <strong>${eventTitle}</strong> that you're registered for.</p>
        ${changes && changes.length > 0 ? `
        <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #6366f1;">
          <p style="margin: 0 0 8px 0; font-weight: bold;">What changed:</p>
          <ul style="margin: 0; padding-left: 20px;">
            ${changes.map(c => `<li style="margin-bottom: 4px;">${c}</li>`).join('')}
          </ul>
        </div>` : ''}
        <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #94a3b8;">
          <p style="margin: 4px 0; font-weight: bold;">Current event details:</p>
          ${eventDate ? `<p style="margin: 4px 0;"><strong>📅 Date:</strong> ${new Date(eventDate).toLocaleString()}</p>` : ''}
          ${venue ? `<p style="margin: 4px 0;"><strong>📍 Venue:</strong> ${venue}</p>` : ''}
        </div>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">Please make note of the updated information.</p>
      </div>
    `,
  }),

  // ── Event cancelled ────────────────────────────────────────────────────────
  eventCancelled: ({ attendeeName, eventTitle }) => ({
    subject: `🚫 Event Cancelled — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b; margin-top: 0;">Event Cancelled</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>We regret to inform you that <strong>${eventTitle}</strong> has been <strong style="color: #ef4444;">cancelled</strong>.</p>
        <p>We apologize for any inconvenience this may cause.</p>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">We hope to see you at a future event!</p>
      </div>
    `,
  }),
};

/**
 * Send an email using the configured transport (SMTP or Resend).
 * Falls back to console logging if neither is configured.
 * Never throws — email failures are always handled gracefully.
 *
 * @param {string} to         - Recipient email address
 * @param {string} templateName - Key from the templates object above
 * @param {object} data       - Template variables
 */
const sendEmail = async (to, templateName, data) => {
  try {
    const template = templates[templateName];
    if (!template) {
      console.warn(`⚠️  Unknown email template: "${templateName}"`);
      return;
    }

    const { subject, html } = template(data);
    const transport = getTransporter();

    // ── Resend API path ────────────────────────────────────────────────────
    if (transport && transport.type === 'resend') {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.resend.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.resend.from || config.smtp.from,
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Resend API error ${response.status}: ${err.message || response.statusText}`);
      }

      console.log(`📧 [Resend] Email sent to ${to}: ${subject}`);
      return;
    }

    // ── Nodemailer / SMTP path ─────────────────────────────────────────────
    if (transport) {
      await transport.sendMail({
        from: config.smtp.from,
        to,
        subject,
        html,
      });

      console.log(`📧 [SMTP] Email sent to ${to}: ${subject}`);
      return;
    }

    // ── No transport configured — log to console (graceful fallback) ───────
    console.log(`📧 [EMAIL MOCK] To: ${to} | Subject: ${subject}`);
  } catch (error) {
    // Never let an email failure crash the request
    console.error(`❌ Failed to send email to ${to} [${templateName}]:`, error.message);
  }
};

module.exports = { sendEmail };
