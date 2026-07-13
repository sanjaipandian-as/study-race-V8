// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════
// /api/auth — login, school registration, invites
// ════════════════════════════════════════════════
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../lib/db');
const { signToken, requireAuth } = require('../middleware/auth');
const { logAction } = require('../lib/audit');

const router = express.Router();

// ───────── helpers ─────────
function genInviteCode(len = 8) {
  // Short, human-typeable: A-Z, 2-9 (no I, O, 0, 1)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

// ───────── Password policy (one rule, used everywhere) ─────────
// Min. 8 characters AND at least one letter and one number.
// Returns an error string, or null if the password is acceptable.
function checkPassword(pw) {
  if (!pw || typeof pw !== 'string') {
    return 'Passwort erforderlich';
  }
  if (pw.length < 8) {
    return 'Passwort muss mindestens 8 Zeichen lang sein';
  }
  if (!/[A-Za-zÄÖÜäöüß]/.test(pw) || !/[0-9]/.test(pw)) {
    return 'Passwort muss mindestens einen Buchstaben und eine Zahl enthalten';
  }
  return null;
}

function setAuthCookie(res, token) {
  // 7 days
  res.setHeader('Set-Cookie',
    `sr_token=${token}; Max-Age=604800; Path=/; HttpOnly; SameSite=Lax${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );
}

// ───────── POST /api/auth/login (works for all roles) ─────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'E-Mail oder Passwort falsch' });
    }

    const user = result.rows[0];

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Konto gesperrt' });
    }
    if (!user.password_hash) {
      return res.status(401).json({
        error: 'Bitte über deinen Einladungslink anmelden, um ein Passwort zu setzen.'
      });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'E-Mail oder Passwort falsch' });
    }

    // Check school status & trial expiry (super-admins skip)
    if (user.role !== 'super_admin' && user.school_id) {
      const sRes = await db.query('SELECT * FROM schools WHERE id = $1', [user.school_id]);
      const school = sRes.rows[0];
      if (!school || school.status !== 'approved') {
        return res.status(403).json({
          error: 'Deine Schule ist noch nicht freigegeben. Bitte warte auf die Bestätigung.'
        });
      }
      if (school.trial_ends_at && new Date(school.trial_ends_at) < new Date() && school.plan === 'free') {
        return res.status(402).json({
          error: 'Die 4-Wochen-Testphase deiner Schule ist abgelaufen. Bitte einen Tarif wählen.'
        });
      }
    }

    await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = signToken(user);
    setAuthCookie(res, token);

    logAction({ actorId: user.id, action: 'user_login', targetType: 'user', targetId: user.id,
                ip: req.ip });

    return res.json({
      token,
      user: {
        id: user.id, role: user.role, full_name: user.full_name,
        email: user.email, school_id: user.school_id, grade_level: user.grade_level,
      },
      redirect: redirectFor(user.role),
    });
  } catch (e) {
    console.error('[login]', e);
    return res.status(500).json({ error: 'Serverfehler' });
  }
});

function redirectFor(role) {
  switch (role) {
    case 'student': return '/app/dashboard.html';
    case 'teacher': return '/app/teacher-dashboard.html';
    case 'school_admin': return '/app/school-dashboard.html';
    case 'super_admin': return '/app/admin-dashboard.html';
    default: return '/';
  }
}

// ───────── POST /api/auth/logout ─────────
router.post('/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'sr_token=; Max-Age=0; Path=/; HttpOnly');
  res.json({ ok: true });
});

// ───────── GET /api/auth/me ─────────
router.get('/me', requireAuth(), async (req, res) => {
  const r = await db.query(
    `SELECT u.id, u.role, u.email, u.full_name, u.grade_level, u.school_id,
            s.name AS school_name, s.status AS school_status, s.plan,
            s.trial_ends_at
       FROM users u LEFT JOIN schools s ON s.id = u.school_id
      WHERE u.id = $1`,
    [req.user.id]
  );
  res.json({ user: r.rows[0] || null });
});

// ───────── POST /api/auth/register-school ─────────
// Public. Creates school (status=pending) + the school_admin user (status=invited).
// Super-admin must approve before anyone can log in.
router.post('/register-school', async (req, res) => {
  const { school_name, city, postal_code, contact_name, contact_email, password } = req.body || {};
  if (!school_name || !contact_name || !contact_email || !password) {
    return res.status(400).json({
      error: 'Schulname, Name, E-Mail und Passwort sind erforderlich'
    });
  }
  {
    const pwErr = checkPassword(password);
    if (pwErr) return res.status(400).json({ error: pwErr });
  }

  try {
    // Check duplicate
    const existing = await db.query(
      'SELECT id FROM schools WHERE LOWER(contact_email) = LOWER($1)',
      [contact_email]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'Eine Schule mit dieser E-Mail-Adresse ist bereits angemeldet.'
      });
    }
    const userExists = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
                                     [contact_email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({
        error: 'Diese E-Mail-Adresse wird bereits verwendet.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const schoolRes = await db.query(
      `INSERT INTO schools (name, city, postal_code, contact_name, contact_email, status, plan)
       VALUES ($1, $2, $3, $4, $5, 'pending', 'free')
       RETURNING *`,
      [school_name, city || null, postal_code || null, contact_name, contact_email]
    );
    const school = schoolRes.rows[0];

    await db.query(
      `INSERT INTO users (school_id, role, email, password_hash, full_name, status)
       VALUES ($1, 'school_admin', $2, $3, $4, 'invited')`,
      [school.id, contact_email, passwordHash, contact_name]
    );

    logAction({
      action: 'school_registered',
      targetType: 'school',
      targetId: school.id,
      metadata: { name: school_name, city },
      ip: req.ip,
    });

    return res.json({
      ok: true,
      message: 'Anmeldung erhalten! Wir prüfen deine Schule innerhalb von 1–2 Werktagen.',
    });
  } catch (e) {
    console.error('[register-school]', e);
    return res.status(500).json({ error: 'Serverfehler — bitte später erneut versuchen' });
  }
});

// ───────── POST /api/auth/redeem-invite (student joins via class code) ─────────
router.post('/redeem-invite', async (req, res) => {
  const { invite_code, full_name, password, grade_level } = req.body || {};
  if (!invite_code || !full_name || !password) {
    return res.status(400).json({ error: 'Einladungscode, Name und Passwort erforderlich' });
  }
  {
    const pwErr = checkPassword(password);
    if (pwErr) return res.status(400).json({ error: pwErr });
  }

  try {
    // Find class
    const cRes = await db.query(
      `SELECT c.*, s.status AS school_status, s.plan, s.trial_ends_at
         FROM classes c JOIN schools s ON s.id = c.school_id
        WHERE UPPER(c.invite_code) = UPPER($1)`,
      [invite_code]
    );
    if (cRes.rows.length === 0) {
      return res.status(404).json({ error: 'Einladungscode nicht gefunden' });
    }
    const klass = cRes.rows[0];
    if (klass.school_status !== 'approved') {
      return res.status(403).json({ error: 'Diese Schule ist nicht aktiv' });
    }
    if (klass.trial_ends_at && new Date(klass.trial_ends_at) < new Date() && klass.plan === 'free') {
      return res.status(402).json({ error: 'Testphase abgelaufen — bitte Lehrkraft kontaktieren' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create student
    const uRes = await db.query(
      `INSERT INTO users (school_id, role, password_hash, full_name, grade_level, status)
       VALUES ($1, 'student', $2, $3, $4, 'active')
       RETURNING *`,
      [klass.school_id, passwordHash, full_name, grade_level || klass.name]
    );
    const student = uRes.rows[0];

    // Add to class
    await db.query(
      'INSERT INTO class_memberships (class_id, student_id) VALUES ($1, $2)',
      [klass.id, student.id]
    );

    // Init progress
    await db.query(
      'INSERT INTO progress (user_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [student.id]
    );

    const token = signToken(student);
    setAuthCookie(res, token);

    logAction({ actorId: student.id, action: 'student_joined_class',
                targetType: 'class', targetId: klass.id, ip: req.ip });

    return res.json({
      token,
      user: {
        id: student.id, role: 'student', full_name: student.full_name,
        school_id: student.school_id, grade_level: student.grade_level,
        class_name: klass.name,
      },
      redirect: '/app/dashboard.html',
    });
  } catch (e) {
    console.error('[redeem-invite]', e);
    return res.status(500).json({ error: 'Serverfehler' });
  }
});

// ───────── SUPER-ADMIN: list pending schools ─────────
router.get('/pending-schools', requireAuth('super_admin'), async (req, res) => {
  const r = await db.query(
    `SELECT id, name, city, postal_code, contact_name, contact_email, created_at
       FROM schools WHERE status = 'pending' ORDER BY created_at ASC`
  );
  res.json({ schools: r.rows });
});

router.get('/all-schools', requireAuth('super_admin'), async (req, res) => {
  const r = await db.query(`
    SELECT s.*, COUNT(DISTINCT u.id) AS user_count
      FROM schools s LEFT JOIN users u ON u.school_id = s.id
     GROUP BY s.id ORDER BY s.created_at DESC`);
  res.json({ schools: r.rows });
});

// ───────── SUPER-ADMIN: approve a school ─────────
router.post('/approve-school/:id', requireAuth('super_admin'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const trialEnd = new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000); // 4 weeks

  try {
    const r = await db.query(
      `UPDATE schools
          SET status='approved', plan='free', trial_ends_at=$2,
              approved_at=NOW(), approved_by=$3
        WHERE id=$1 AND status='pending'
        RETURNING *`,
      [id, trialEnd, req.user.id]
    );
    if (r.rows.length === 0) {
      return res.status(404).json({ error: 'Schule nicht gefunden oder bereits bearbeitet' });
    }

    // Activate the school-admin user too
    await db.query(`UPDATE users SET status='active' WHERE school_id=$1 AND role='school_admin'`, [id]);

    logAction({ actorId: req.user.id, action: 'school_approved',
                targetType: 'school', targetId: id, ip: req.ip });

    return res.json({ ok: true, school: r.rows[0] });
  } catch (e) {
    console.error('[approve-school]', e);
    return res.status(500).json({ error: 'Serverfehler' });
  }
});

// ───────── SUPER-ADMIN: reject a school ─────────
router.post('/reject-school/:id', requireAuth('super_admin'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { reason } = req.body || {};

  const r = await db.query(
    `UPDATE schools SET status='rejected', rejection_reason=$2
      WHERE id=$1 AND status='pending' RETURNING *`,
    [id, reason || null]
  );
  if (r.rows.length === 0) {
    return res.status(404).json({ error: 'Schule nicht gefunden' });
  }

  logAction({ actorId: req.user.id, action: 'school_rejected',
              targetType: 'school', targetId: id, metadata: { reason }, ip: req.ip });

  return res.json({ ok: true });
});

// ───────── SUPER-ADMIN: change plan ─────────
router.post('/set-plan/:id', requireAuth('super_admin'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { plan } = req.body || {};
  if (!['free', 'klein', 'mittel', 'gross'].includes(plan)) {
    return res.status(400).json({ error: 'Ungültiger Tarif' });
  }
  await db.query('UPDATE schools SET plan=$2 WHERE id=$1', [id, plan]);

  logAction({ actorId: req.user.id, action: 'plan_changed',
              targetType: 'school', targetId: id, metadata: { plan }, ip: req.ip });
  res.json({ ok: true });
});

// ───────── SCHOOL-ADMIN: invite a teacher ─────────
router.post('/invite-teacher', requireAuth('school_admin'), async (req, res) => {
  const { full_name, email } = req.body || {};
  if (!full_name || !email) {
    return res.status(400).json({ error: 'Name und E-Mail erforderlich' });
  }
  try {
    const exists = await db.query('SELECT id FROM users WHERE LOWER(email)=LOWER($1)', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Diese E-Mail wird bereits verwendet' });
    }
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const r = await db.query(
      `INSERT INTO users (school_id, role, email, full_name, status, invite_token)
       VALUES ($1, 'teacher', $2, $3, 'invited', $4) RETURNING id`,
      [req.user.school_id, email, full_name, inviteToken]
    );
    const inviteUrl = `/auth/accept-invite.html?token=${inviteToken}`;
    res.json({ ok: true, invite_url: inviteUrl, user_id: r.rows[0].id });
  } catch (e) {
    console.error('[invite-teacher]', e);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// ───────── Anyone with token: accept invite, set password ─────────
router.post('/accept-invite', async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: 'Token und Passwort erforderlich' });
  { const pwErr = checkPassword(password); if (pwErr) return res.status(400).json({ error: pwErr }); }

  const r = await db.query('SELECT * FROM users WHERE invite_token=$1', [token]);
  if (r.rows.length === 0) return res.status(404).json({ error: 'Einladungslink ungültig oder bereits genutzt' });

  const user = r.rows[0];
  const hash = await bcrypt.hash(password, 10);
  await db.query(
    `UPDATE users SET password_hash=$1, status='active', invite_token=NULL WHERE id=$2`,
    [hash, user.id]
  );
  const jwtToken = signToken(user);
  setAuthCookie(res, jwtToken);
  res.json({ ok: true, redirect: redirectFor(user.role) });
});

// ───────── TEACHER: create class with invite code ─────────
router.post('/create-class', requireAuth('teacher'), async (req, res) => {
  const { name, subject } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Klassenname erforderlich' });

  // Generate unique invite code
  let code, attempts = 0;
  while (attempts++ < 8) {
    code = genInviteCode(8);
    const dup = await db.query('SELECT id FROM classes WHERE invite_code=$1', [code]);
    if (dup.rows.length === 0) break;
  }
  const r = await db.query(
    `INSERT INTO classes (school_id, teacher_id, name, subject, invite_code)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [req.user.school_id, req.user.id, name, subject || 'Mathematik', code]
  );
  res.json({ ok: true, class: r.rows[0] });
});

module.exports = router;

// ───── Change own password ─────
router.post('/change-password', requireAuth(), async (req, res) => {
  try {
    const { current_password, new_password } = req.body || {};
    {
      const pwErr = checkPassword(new_password);
      if (pwErr) return res.status(400).json({ error: pwErr });
    }
    const u = await db.query('SELECT password_hash FROM users WHERE id=$1', [req.user.id]);
    if (u.rows.length === 0) return res.status(404).json({ error: 'User nicht gefunden.' });

    const bcrypt = require('bcryptjs');
    const ok = await bcrypt.compare(current_password || '', u.rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: 'Aktuelles Passwort falsch.' });

    const newHash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash=$1 WHERE id=$2', [newHash, req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('[change-password]', e);
    res.status(500).json({ error: 'Fehler beim Ändern.' });
  }
});

// ───── Public school signup (used by /kontakt) ─────
router.post('/signup-school', async (req, res) => {
  try {
    const { school_name, city, postcode, contact_name, contact_email, message } = req.body || {};
    if (!school_name || !contact_email) {
      return res.status(400).json({ error: 'Schulname und E-Mail sind Pflicht.' });
    }
    await db.query(
      `INSERT INTO schools (name, city, postal_code, contact_name, contact_email, status, plan)
       VALUES ($1, $2, $3, $4, $5, 'pending', 'free')
       ON CONFLICT (contact_email) DO NOTHING`,
      [school_name, city || '', postcode || '', contact_name || '', contact_email.toLowerCase()]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('[signup-school]', e);
    res.status(500).json({ error: 'Anmeldung konnte nicht gespeichert werden.' });
  }
});

// ============================================================
// v7.3: Password Reset (Forgot Password)
// ============================================================
const { sendMail } = require('../lib/mail');

// 1. Request reset link (public, no auth)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'E-Mail fehlt.' });

    // Always respond OK to avoid leaking which emails exist
    const user = await db.query('SELECT id, full_name FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (user.rows.length === 0) return res.json({ ok: true });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);  // 1 hour

    await db.query(
      'INSERT INTO password_reset_token (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.rows[0].id, token, expires]
    );

    const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
    const link = `${baseUrl}/reset-password?token=${token}`;

    // Fire and forget (don't await — never block this endpoint)
    sendMail({
      to: email,
      subject: 'StudyRace — Passwort zurücksetzen',
      text:
        `Hallo ${user.rows[0].full_name || ''},\n\n` +
        `du hast eine Passwort-Zurücksetzung angefordert. Klicke auf den folgenden Link, um ein neues Passwort zu setzen (gültig 1 Stunde):\n\n` +
        `${link}\n\n` +
        `Falls du das nicht angefordert hast, ignoriere diese E-Mail.\n\n` +
        `Viele Grüße\nStudyRace`,
    }).catch(e => console.error('[forgot-password mail]', e.message));

    res.json({ ok: true });
  } catch (e) {
    console.error('[forgot-password]', e);
    res.status(500).json({ error: 'Anfrage fehlgeschlagen.' });
  }
});

// 2. Verify token (public, used to show "set new password" form)
router.get('/reset-password/verify', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).json({ error: 'Token fehlt.' });

    const r = await db.query(
      `SELECT prt.id, u.email
         FROM password_reset_token prt
         JOIN users u ON u.id = prt.user_id
        WHERE prt.token = $1 AND prt.used_at IS NULL AND prt.expires_at > CURRENT_TIMESTAMP`,
      [token]
    );
    if (r.rows.length === 0) return res.status(400).json({ error: 'Link ungültig oder abgelaufen.' });
    res.json({ ok: true, email: r.rows[0].email });
  } catch (e) {
    res.status(500).json({ error: 'Fehler.' });
  }
});

// 3. Set new password (public)
router.post('/reset-password/set', async (req, res) => {
  try {
    const { token, new_password } = req.body || {};
    if (!token || !new_password) return res.status(400).json({ error: 'Felder fehlen.' });
    { const pwErr = checkPassword(new_password); if (pwErr) return res.status(400).json({ error: pwErr }); }

    const r = await db.query(
      `SELECT prt.id, prt.user_id
         FROM password_reset_token prt
        WHERE prt.token = $1 AND prt.used_at IS NULL AND prt.expires_at > CURRENT_TIMESTAMP`,
      [token]
    );
    if (r.rows.length === 0) return res.status(400).json({ error: 'Link ungültig oder abgelaufen.' });

    const newHash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, r.rows[0].user_id]);
    await db.query('UPDATE password_reset_token SET used_at = CURRENT_TIMESTAMP WHERE id = $1', [r.rows[0].id]);

    res.json({ ok: true });
  } catch (e) {
    console.error('[reset-password/set]', e);
    res.status(500).json({ error: 'Passwort konnte nicht gesetzt werden.' });
  }
});

// ============================================================
// v7.3: Password reset flow + email integration
// ============================================================
const { sendEmail } = require('../lib/email');

// POST /api/auth/request-password-reset
// Always returns ok:true (don't leak which emails exist)
router.post('/request-password-reset', async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ error: 'E-Mail fehlt.' });

    const u = await db.query('SELECT id, full_name FROM users WHERE LOWER(email) = $1', [email]);
    if (u.rows.length === 0) {
      // pretend success to not leak email existence
      return res.json({ ok: true });
    }

    const userId = u.rows[0].id;
    const userName = u.rows[0].full_name || '';
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expires]
    );

    const link = (process.env.BASE_URL || 'http://localhost:3000') + '/reset-password?token=' + token;
    const subject = 'StudyRace: Passwort zurücksetzen';
    const text = [
      'Hallo ' + userName + ',',
      '',
      'jemand (hoffentlich du) hat angefordert, dein Passwort zurückzusetzen.',
      'Klicke auf folgenden Link um ein neues Passwort zu setzen:',
      '',
      link,
      '',
      'Der Link ist 1 Stunde gültig.',
      'Falls du keine Zurücksetzung angefordert hast, ignoriere diese Mail.',
      '',
      '— StudyRace'
    ].join('\n');

    await sendEmail({ to: email, subject, text });
    res.json({ ok: true });
  } catch (e) {
    console.error('[request-password-reset]', e);
    res.status(500).json({ error: 'Fehler.' });
  }
});

// POST /api/auth/reset-password  { token, new_password }
router.post('/reset-password', async (req, res) => {
  try {
    const { token, new_password } = req.body || {};
    if (!token || !new_password) return res.status(400).json({ error: 'Token und Passwort sind Pflicht.' });
    { const pwErr = checkPassword(new_password); if (pwErr) return res.status(400).json({ error: pwErr }); }

    const r = await db.query(
      `SELECT id, user_id FROM password_resets
        WHERE token = $1 AND used = FALSE AND expires_at > CURRENT_TIMESTAMP
        ORDER BY created_at DESC LIMIT 1`,
      [token]
    );
    if (r.rows.length === 0) return res.status(400).json({ error: 'Token ungültig oder abgelaufen.' });

    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, r.rows[0].user_id]);
    await db.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [r.rows[0].id]);

    res.json({ ok: true });
  } catch (e) {
    console.error('[reset-password]', e);
    res.status(500).json({ error: 'Fehler.' });
  }
});
