// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════
// StudyRace — Main server
// ════════════════════════════════════════════════
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// ───────── Middleware ─────────
// Security headers (helmet) — strengthened, with a CSP that allows our inline styles + Google Fonts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdnjs.cloudflare.com'],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],   // block clickjacking
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));

// Trust nginx in front of us
app.set('trust proxy', 1);

// NOTE: No rate limiting / lockout / cooldown on login — by design.
// Login attempts are never throttled, even after wrong passwords.
// Accounts support unlimited simultaneous logins across devices.

// ───────── API ─────────
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ───────── Static frontend ─────────
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Dashboard pages must never be cached — so that after logout,
// the browser Back button cannot reveal a stale dashboard with data.
app.use((req, res, next) => {
  if (req.path.startsWith('/app/')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

app.use(express.static(PUBLIC_DIR, {
  extensions: ['html'],
  fallthrough: true,
}));

// ───────── Multi-page routes ─────────
const pageMap = {
  '/funktionen':       'funktionen.html',
  '/preise':           'preise.html',
  '/kontakt':          'kontakt.html',
  '/login':            'login.html',
  '/forgot-password':  'forgot-password.html',
  '/reset-password':   'reset-password.html',
  '/impressum':        'impressum.html',
  '/datenschutz':      'datenschutz.html',
  '/agb':              'agb.html',
  '/ueber-uns':        'ueber-uns.html',
  '/sicherheit':       'sicherheit.html',
  '/faq':              'faq.html',
};
Object.entries(pageMap).forEach(([route, file]) => {
  app.get(route, (req, res) => res.sendFile(path.join(PUBLIC_DIR, file)));
});

// /dashboard redirects to role-specific dashboard based on JWT
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./middleware/auth');
const dashboardMap = {
  student:      '/app/dashboard.html',
  teacher:      '/app/teacher-dashboard.html',
  school_admin: '/app/school-dashboard.html',
  super_admin:  '/app/admin-dashboard.html',
};
app.get('/dashboard', (req, res) => {
  const token = req.cookies && req.cookies.sr_token;
  if (!token) return res.redirect('/login');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const target = dashboardMap[decoded.role] || '/login';
    return res.redirect(target);
  } catch {
    return res.redirect('/login');
  }
});

// SPA-style fallback: any unknown HTML route returns landing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// ───────── Error handler ─────────
app.use((err, req, res, next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Serverfehler' });
});

// Auto-bootstrap the database (no-op if schema already loaded).
const { initIfNeeded } = require('./lib/init-db');

// Listen on 0.0.0.0 in production (so the hosting platform can route to us),
// and on 127.0.0.1 in development (safer, only local).
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
(async () => {
  try {
    await initIfNeeded();
  } catch (e) {
    console.error('[studyrace] database init failed — continuing anyway:', e.message);
  }
  app.listen(PORT, HOST, () => {
    console.log(`[studyrace] listening on http://${HOST}:${PORT}`);
    console.log(`[studyrace] static files from: ${PUBLIC_DIR}`);
  });
})();
