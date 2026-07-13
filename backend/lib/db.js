// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════
// PostgreSQL connection pool
// Supports two configurations:
//   1) DATABASE_URL (used by Render, Railway, Fly, Heroku etc.)
//   2) Individual DB_* env vars (used for local development)
// ════════════════════════════════════════════════
const { Pool } = require('pg');

const url = process.env.DATABASE_URL;
const isProd = process.env.NODE_ENV === 'production';

const pool = url
  ? new Pool({
      connectionString: url,
      // Managed databases (Render, Heroku, etc.) require TLS.
      ssl: isProd ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  : new Pool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME     || 'studyrace',
      user:     process.env.DB_USER     || 'studyrace',
      password: process.env.DB_PASSWORD || 'studyrace',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

pool.on('error', (err) => {
  console.error('[db] unexpected pool error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
