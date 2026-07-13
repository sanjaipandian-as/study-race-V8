// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ============================================================
// Email helper — uses SMTP if configured, otherwise logs.
// Never throws — sending failures are logged but won't crash the app.
// ============================================================

let transporter = null;
let mode = 'console';

function init() {
  if (transporter !== null) return;
  const host = process.env.SMTP_HOST;
  if (host) {
    try {
      const nodemailer = require('nodemailer');
      transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        } : undefined,
      });
      mode = 'smtp';
      console.log('[mail] SMTP configured:', host);
    } catch (e) {
      console.log('[mail] nodemailer not installed, falling back to console mode.');
      mode = 'console';
    }
  } else {
    console.log('[mail] No SMTP_HOST configured. Emails will be logged to console.');
    mode = 'console';
  }
}

async function sendMail({ to, subject, text, html }) {
  init();
  if (!to) throw new Error('Empfänger fehlt.');

  const from = process.env.SMTP_FROM || 'noreply@studyrace.de';

  if (mode === 'smtp' && transporter) {
    try {
      await transporter.sendMail({ from, to, subject, text, html });
      console.log('[mail] sent to', to, '-', subject);
      return { ok: true, mode: 'smtp' };
    } catch (e) {
      console.error('[mail] SMTP error, falling back to console:', e.message);
    }
  }

  // Console fallback (never throws)
  console.log('───── [mail console] ────────────────────');
  console.log('To:     ', to);
  console.log('From:   ', from);
  console.log('Subject:', subject);
  console.log('---');
  console.log(text || html || '');
  console.log('─────────────────────────────────────────');
  return { ok: true, mode: 'console' };
}

module.exports = { sendMail };
