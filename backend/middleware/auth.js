// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════
// Authentication middleware (JWT-based)
// ════════════════════════════════════════════════
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ── JWT secret resolution ───────────────────────────────────────────
// The secret signs every login token. If it is guessable, anyone can
// forge a token for any account — including super_admin. So:
//   • In production: the secret MUST be supplied via JWT_SECRET, be long,
//     and not be a known placeholder — otherwise the server refuses to start.
//   • In development: if no strong secret is set, we generate a random one
//     per process (tokens just won't survive a local restart — fine for dev).
const WEAK_SECRETS = [
  'studyrace-dev-secret',
  'studyrace-lokal-dev-secret-aendern-vor-live',
  'change-me-in-production',
  'secret', 'changeme', 'change-me', 'password',
];

function resolveJwtSecret() {
  const fromEnv = (process.env.JWT_SECRET || '').trim();
  const isProd = process.env.NODE_ENV === 'production';
  const looksWeak =
    !fromEnv ||
    fromEnv.length < 32 ||
    WEAK_SECRETS.some(w => fromEnv.toLowerCase().includes(w));

  if (isProd) {
    if (looksWeak) {
      console.error(
        '\n[FATAL] JWT_SECRET fehlt oder ist zu schwach für den Live-Betrieb.\n' +
        'Bitte einen langen Zufallswert in der .env setzen, z. B. erzeugt mit:\n' +
        '  node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"\n'
      );
      process.exit(1); // hard stop — never run live with a guessable secret
    }
    return fromEnv;
  }

  if (looksWeak) {
    console.warn('[warn] Kein starkes JWT_SECRET gesetzt — es wird ein Zufallswert ' +
                 'genutzt (nur Entwicklung; Login gilt bis zum nächsten Neustart).');
    return crypto.randomBytes(48).toString('hex');
  }
  return fromEnv;
}

const JWT_SECRET = resolveJwtSecret();
const JWT_EXPIRES = '7d';

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      school_id: user.school_id,
      full_name: user.full_name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// Read JWT from `Authorization: Bearer <token>` or `sr_token` cookie
function readToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);

  const cookie = req.headers.cookie || '';
  const m = cookie.match(/sr_token=([^;]+)/);
  if (m) return decodeURIComponent(m[1]);

  return null;
}

function requireAuth(roles = null) {
  return (req, res, next) => {
    const token = readToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Nicht angemeldet' });
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      if (roles) {
        const allowed = Array.isArray(roles) ? roles : [roles];
        if (!allowed.includes(payload.role)) {
          return res.status(403).json({ error: 'Keine Berechtigung' });
        }
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Sitzung abgelaufen — bitte neu anmelden' });
    }
  };
}

module.exports = { signToken, requireAuth, JWT_SECRET };
