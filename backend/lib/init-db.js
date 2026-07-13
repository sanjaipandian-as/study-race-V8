// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════════════════════
// Database auto-initializer.
//
// Runs on every server start. If the `users` table doesn't exist
// yet (i.e. this is a fresh hosted database), it applies schema.sql
// followed by the seed files. If the table already exists, it does
// nothing — safe to call on every restart.
// ════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const SQL_DIR = path.join(__dirname, '..', '..', 'database');

async function fileExists(p)        { return fs.existsSync(p); }
async function readSql(name)        { return fs.readFileSync(path.join(SQL_DIR, name), 'utf8'); }

async function tablesExist() {
  try {
    const r = await pool.query(
      "SELECT 1 FROM information_schema.tables WHERE table_name = 'users' LIMIT 1"
    );
    return r.rowCount > 0;
  } catch (e) {
    // Can't even query → DB unreachable. Bubble up.
    throw e;
  }
}

async function applySqlFile(name) {
  if (!(await fileExists(path.join(SQL_DIR, name)))) {
    console.log(`[db-init] skipping ${name} (not found)`);
    return;
  }
  const sql = await readSql(name);
  await pool.query(sql);
  console.log(`[db-init] applied ${name}`);
}

async function initIfNeeded() {
  let already;
  try {
    already = await tablesExist();
  } catch (e) {
    console.error('[db-init] cannot reach database:', e.message);
    throw e;
  }

  if (already) {
    console.log('[db-init] database already initialized — skipping');
    return;
  }

  console.log('[db-init] fresh database detected — applying schema + seeds');
  await applySqlFile('schema.sql');
  // Seeds are best-effort. If any one fails (e.g. duplicate test users on
  // a partial re-run), log it and continue rather than crash the server.
  for (const f of ['seed.sql', 'seed_questions.sql', 'seed_questions_v2.sql', 'seed_questions_v3.sql', 'seed_achievements.sql', 'seed_achievements_v2.sql']) {
    try {
      await applySqlFile(f);
    } catch (e) {
      console.warn(`[db-init] non-fatal: ${f} produced ${e.code || ''} ${e.message}`);
    }
  }
  console.log('[db-init] initialization complete');
}

module.exports = { initIfNeeded };
