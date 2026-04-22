const nodemailer = require('nodemailer');
const config = require('./env');

let transporter = null;

/**
 * Create and cache a nodemailer transporter.
 * Returns null if SMTP is not configured (graceful degradation).
 */
const getTransporter = () => {
  if (transporter) return transporter;

  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    console.warn('⚠️  SMTP not configured — emails will be logged to console instead.');
    return null;
  }

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
};

module.exports = { getTransporter };
