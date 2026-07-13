// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════
// Audit log helper
// ════════════════════════════════════════════════
const db = require('./db');

async function logAction({ actorId, action, targetType, targetId, metadata, ip }) {
  try {
    await db.query(
      `INSERT INTO audit_log (actor_id, action, target_type, target_id, metadata, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [actorId || null, action, targetType || null, targetId || null,
       metadata ? JSON.stringify(metadata) : null, ip || null]
    );
  } catch (e) {
    console.error('[audit] failed to write log:', e.message);
  }
}

module.exports = { logAction };
