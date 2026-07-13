// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════════════════
// Email service — graceful fallback
// If SMTP_HOST is set in .env, actually sends.
// Otherwise: logs to console (still returns ok=true).
// ════════════════════════════════════════════════════════════
const nodemailer = require('nodemailer');

let transporter = null;
let mode = 'log';

if (process.env.SMTP_HOST) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      } : undefined,
    });
    mode = 'smtp';
    console.log('[email] SMTP mode active: ' + process.env.SMTP_HOST);
  } catch (e) {
    console.error('[email] SMTP setup failed, falling back to log mode:', e.message);
  }
} else {
  console.log('[email] LOG mode (no SMTP_HOST set) — emails will be logged to console');
}

async function sendEmail({ to, subject, text, html }) {
  const from = process.env.SMTP_FROM || 'StudyRace <noreply@studyrace.de>';
  if (mode === 'smtp' && transporter) {
    try {
      const info = await transporter.sendMail({ from, to, subject, text, html });
      return { ok: true, id: info.messageId, mode: 'smtp' };
    } catch (e) {
      console.error('[email] SMTP send failed:', e.message);
      // Still log the email so it's not lost
      console.log('[email-fallback] TO:', to, 'SUBJ:', subject);
      console.log('[email-fallback] BODY:', text);
      return { ok: false, error: e.message, mode: 'failed' };
    }
  } else {
    // Log mode: print to console, always succeed
    console.log('\n┌─ [email] ───────────────────────────────────');
    console.log('│ TO:      ' + to);
    console.log('│ FROM:    ' + from);
    console.log('│ SUBJECT: ' + subject);
    console.log('├─────────────────────────────────────────────');
    console.log((text || '').split('\n').map(l => '│ ' + l).join('\n'));
    console.log('└─────────────────────────────────────────────\n');
    return { ok: true, id: 'log-' + Date.now(), mode: 'log' };
  }
}

module.exports = { sendEmail, mode: () => mode };
