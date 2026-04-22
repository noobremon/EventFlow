const { getTransporter } = require('../config/email');
const config = require('../config/env');

/**
 * Email templates — returns { subject, html } for each type.
 */
const templates = {
  registrationConfirmed: ({ attendeeName, eventTitle, eventDate, venue }) => ({
    subject: `✅ Registration Confirmed — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b;">You're Registered! 🎉</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>
        <div style="background: #fff; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #6366f1;">
          <p><strong>📅 Date:</strong> ${new Date(eventDate).toLocaleString()}</p>
          <p><strong>📍 Venue:</strong> ${venue}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">See you there!</p>
      </div>
    `,
  }),

  registrationPending: ({ attendeeName, eventTitle }) => ({
    subject: `⏳ Registration Received — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b;">Registration Received</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${eventTitle}</strong> has been received and is pending approval by the organizer.</p>
        <p>We'll notify you once your registration is reviewed.</p>
        <p style="color: #64748b; font-size: 14px;">Thank you for your interest!</p>
      </div>
    `,
  }),

  rsvpApproved: ({ attendeeName, eventTitle }) => ({
    subject: `✅ Registration Approved — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b;">You're In! 🎉</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Great news! Your registration for <strong>${eventTitle}</strong> has been <strong style="color: #22c55e;">approved</strong>.</p>
        <p style="color: #64748b; font-size: 14px;">See you at the event!</p>
      </div>
    `,
  }),

  rsvpRejected: ({ attendeeName, eventTitle }) => ({
    subject: `❌ Registration Update — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b;">Registration Update</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Unfortunately, your registration for <strong>${eventTitle}</strong> has not been approved at this time.</p>
        <p style="color: #64748b; font-size: 14px;">We appreciate your interest.</p>
      </div>
    `,
  }),

  rsvpRevoked: ({ attendeeName, eventTitle }) => ({
    subject: `⚠️ Registration Revoked — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b;">Registration Revoked</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${eventTitle}</strong> has been revoked by the organizer.</p>
        <p style="color: #64748b; font-size: 14px;">If you believe this is an error, please contact the event organizer.</p>
      </div>
    `,
  }),

  eventCancelled: ({ attendeeName, eventTitle }) => ({
    subject: `🚫 Event Cancelled — ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
        <h2 style="color: #1e293b;">Event Cancelled</h2>
        <p>Hi <strong>${attendeeName}</strong>,</p>
        <p>We regret to inform you that <strong>${eventTitle}</strong> has been cancelled.</p>
        <p style="color: #64748b; font-size: 14px;">We apologize for any inconvenience.</p>
      </div>
    `,
  }),
};

/**
 * Send an email. Falls back to console logging if SMTP is not configured.
 */
const sendEmail = async (to, templateName, data) => {
  try {
    const template = templates[templateName];
    if (!template) {
      console.warn(`⚠️  Unknown email template: ${templateName}`);
      return;
    }

    const { subject, html } = template(data);
    const transporter = getTransporter();

    if (!transporter) {
      // Graceful fallback — log to console
      console.log(`📧 [EMAIL MOCK] To: ${to} | Subject: ${subject}`);
      return;
    }

    await transporter.sendMail({
      from: config.smtp.from,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (error) {
    // Graceful failure — never crash due to email
    console.error(`❌ Failed to send email to ${to}:`, error.message);
  }
};

module.exports = { sendEmail };
