// Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
// ════════════════════════════════════════════════
// /api/data — dashboard data endpoints
// ════════════════════════════════════════════════
const express = require('express');
const db = require('../lib/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ───────── STUDENT: my classes + my progress ─────────
router.get('/student/home', requireAuth('student'), async (req, res) => {
  const cls = await db.query(
    `SELECT c.id, c.name, c.subject, c.invite_code,
            t.full_name AS teacher_name
       FROM class_memberships cm
       JOIN classes c ON c.id = cm.class_id
       LEFT JOIN users t ON t.id = c.teacher_id
      WHERE cm.student_id = $1`,
    [req.user.id]
  );

  const prog = await db.query('SELECT * FROM progress WHERE user_id = $1', [req.user.id]);

  // Race for first class — top 5 by XP
  let race = [];
  if (cls.rows.length > 0) {
    const r = await db.query(
      `SELECT u.id, u.full_name, p.total_xp
         FROM class_memberships cm
         JOIN users u ON u.id = cm.student_id
         LEFT JOIN progress p ON p.user_id = u.id
        WHERE cm.class_id = $1
        ORDER BY COALESCE(p.total_xp, 0) DESC LIMIT 5`,
      [cls.rows[0].id]
    );
    race = r.rows;
  }

  res.json({ classes: cls.rows, progress: prog.rows[0] || null, race });
});

// ───────── TEACHER: my classes + class stats ─────────
router.get('/teacher/home', requireAuth('teacher'), async (req, res) => {
  const r = await db.query(
    `SELECT c.id, c.name, c.subject, c.invite_code,
            COUNT(cm.student_id) AS student_count
       FROM classes c
       LEFT JOIN class_memberships cm ON cm.class_id = c.id
      WHERE c.teacher_id = $1
      GROUP BY c.id ORDER BY c.created_at DESC`,
    [req.user.id]
  );

  // Real stats: open tasks, average accuracy across this teacher's students
  let openTasks = 0;
  let avgAccuracy = 0;
  let totalStudents = 0;
  try {
    const tasksRes = await db.query(
      `SELECT COUNT(*)::int AS c
         FROM tasks t
         JOIN classes c ON c.id = t.class_id
        WHERE c.teacher_id = $1
          AND (t.due_at IS NULL OR t.due_at >= CURRENT_DATE)`,
      [req.user.id]
    );
    openTasks = tasksRes.rows[0].c || 0;

    const accRes = await db.query(
      `SELECT COALESCE(AVG(ss.correct::numeric / NULLIF(ss.answered,0)) * 100, 0)::int AS acc
         FROM student_skill ss
        WHERE ss.student_id IN (
          SELECT DISTINCT cm.student_id
            FROM class_memberships cm
            JOIN classes c ON c.id = cm.class_id
           WHERE c.teacher_id = $1
        )`,
      [req.user.id]
    );
    avgAccuracy = accRes.rows[0].acc || 0;

    const studRes = await db.query(
      `SELECT COUNT(DISTINCT cm.student_id)::int AS c
         FROM class_memberships cm
         JOIN classes c ON c.id = cm.class_id
        WHERE c.teacher_id = $1`,
      [req.user.id]
    );
    totalStudents = studRes.rows[0].c || 0;
  } catch (e) {
    console.error('[teacher/home stats]', e);
  }

  res.json({
    classes: r.rows,
    stats: {
      open_tasks: openTasks,
      avg_accuracy: avgAccuracy,
      total_students: totalStudents,
    },
  });
});

// ───────── SCHOOL-ADMIN: school overview ─────────
router.get('/school/home', requireAuth('school_admin'), async (req, res) => {
  const sId = req.user.school_id;
  const teachers = await db.query(
    `SELECT id, full_name, email, status, last_login
       FROM users WHERE school_id=$1 AND role='teacher' ORDER BY full_name`,
    [sId]
  );
  const classes = await db.query(
    `SELECT c.id, c.name, c.subject, c.invite_code,
            t.full_name AS teacher_name,
            COUNT(cm.student_id) AS student_count
       FROM classes c
       LEFT JOIN users t ON t.id = c.teacher_id
       LEFT JOIN class_memberships cm ON cm.class_id = c.id
      WHERE c.school_id=$1
      GROUP BY c.id, t.full_name ORDER BY c.created_at DESC`,
    [sId]
  );
  const stats = await db.query(
    `SELECT
        (SELECT COUNT(*) FROM users WHERE school_id=$1 AND role='teacher') AS teachers,
        (SELECT COUNT(*) FROM users WHERE school_id=$1 AND role='student') AS students,
        (SELECT COUNT(*) FROM classes WHERE school_id=$1) AS classes`,
    [sId]
  );
  const school = await db.query('SELECT * FROM schools WHERE id=$1', [sId]);
  res.json({
    school: school.rows[0],
    teachers: teachers.rows,
    classes: classes.rows,
    stats: stats.rows[0],
  });
});

// ───────── SUPER-ADMIN: platform overview ─────────
router.get('/admin/home', requireAuth('super_admin'), async (req, res) => {
  const stats = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM schools WHERE status='approved') AS schools_active,
      (SELECT COUNT(*) FROM schools WHERE status='pending') AS schools_pending,
      (SELECT COUNT(*) FROM users WHERE role='teacher' AND status='active') AS teachers,
      (SELECT COUNT(*) FROM users WHERE role='student' AND status='active') AS students`);

  const recentLog = await db.query(
    `SELECT al.*, u.full_name AS actor_name
       FROM audit_log al
       LEFT JOIN users u ON u.id = al.actor_id
      ORDER BY al.created_at DESC LIMIT 30`
  );
  res.json({ stats: stats.rows[0], recent_log: recentLog.rows });
});

// ════════════════════════════════════════════════
// PLACEHOLDER ENDPOINTS — return mock data for new dashboard sections.
// Frontend pulls real data when available, mock when DB empty.
// ════════════════════════════════════════════════

// ─── STUDENT placeholders ───
router.get('/student/homework', requireAuth('student'), async (req, res) => {
  // Real: pull tasks. Mock if none.
  let tasks = [];
  try {
    const r = await db.query(
      `SELECT t.id, t.title, t.subject, t.due_at, t.created_at,
              CASE WHEN ts.id IS NOT NULL THEN 'erledigt' ELSE 'offen' END AS status
         FROM tasks t
         LEFT JOIN task_submissions ts ON ts.task_id = t.id AND ts.student_id = $1
         JOIN class_memberships cm ON cm.class_id = t.class_id
        WHERE cm.student_id = $1
        ORDER BY t.due_at NULLS LAST LIMIT 20`,
      [req.user.id]
    );
    tasks = r.rows;
  } catch (e) { /* table may not exist yet */ }

  if (tasks.length === 0) {
    tasks = [
      { id: 1, title: 'Quadratische Gleichungen — Übung 4', subject: 'Mathe',  due_at: addDays(2),  status: 'offen' },
      { id: 2, title: 'Lesetagebuch Kapitel 3',              subject: 'Deutsch', due_at: addDays(4), status: 'offen' },
      { id: 3, title: 'Vokabeln Unit 6',                     subject: 'Englisch', due_at: addDays(1), status: 'offen' },
      { id: 4, title: 'Photosynthese — Versuchsprotokoll',   subject: 'Bio',      due_at: addDays(7), status: 'offen' },
      { id: 5, title: 'Mittelalter — Zeitstrahl',            subject: 'Geschichte', due_at: addDays(-1), status: 'erledigt' },
    ];
  }
  res.json({ tasks });
});

router.get('/student/timetable', requireAuth('student'), async (req, res) => {
  res.json({
    days: [
      { day: 'Montag',     periods: [{ time: '08:00', subject: 'Mathe', room: 'R204' }, { time: '09:00', subject: 'Deutsch', room: 'R110' }, { time: '10:00', subject: 'Englisch', room: 'R310' }, { time: '11:00', subject: 'Sport', room: 'Halle' }] },
      { day: 'Dienstag',   periods: [{ time: '08:00', subject: 'Bio', room: 'R401' }, { time: '09:00', subject: 'Mathe', room: 'R204' }, { time: '10:00', subject: 'Geschichte', room: 'R208' }, { time: '11:00', subject: 'Kunst', room: 'R501' }] },
      { day: 'Mittwoch',   periods: [{ time: '08:00', subject: 'Deutsch', room: 'R110' }, { time: '09:00', subject: 'Physik', room: 'R402' }, { time: '10:00', subject: 'Mathe', room: 'R204' }, { time: '11:00', subject: 'Religion', room: 'R210' }] },
      { day: 'Donnerstag', periods: [{ time: '08:00', subject: 'Englisch', room: 'R310' }, { time: '09:00', subject: 'Chemie', room: 'R403' }, { time: '10:00', subject: 'Erdkunde', room: 'R215' }, { time: '11:00', subject: 'Musik', room: 'R503' }] },
      { day: 'Freitag',    periods: [{ time: '08:00', subject: 'Mathe', room: 'R204' }, { time: '09:00', subject: 'Deutsch', room: 'R110' }, { time: '10:00', subject: 'Bio', room: 'R401' }, { time: '11:00', subject: 'Sport', room: 'Halle' }] },
    ]
  });
});

router.get('/student/messages', requireAuth('student'), (req, res) => {
  res.json({ messages: [
    { id: 1, from: 'Hr. Becker', subject: 'Klassenarbeit Mathe', preview: 'Erinnerung — die Klassenarbeit findet am Mittwoch statt…', time: 'vor 2 Std', unread: true },
    { id: 2, from: 'Fr. Müller', subject: 'Hausaufgabe Deutsch', preview: 'Bitte denkt an das Lesetagebuch bis Freitag…',          time: 'gestern',  unread: true },
    { id: 3, from: 'Schul-Verwaltung', subject: 'Wandertag', preview: 'Der Wandertag wurde auf den 15. Mai verschoben…',       time: '3 Tage',  unread: false },
    { id: 4, from: 'Hr. Schmidt', subject: 'Bio-Versuch',     preview: 'Der Versuch zur Photosynthese ist aufgeschoben…',       time: '1 Woche', unread: false },
  ]});
});

router.get('/student/materials', requireAuth('student'), async (req, res) => {
  try {
    // Materials from classes this student is a member of
    const r = await db.query(
      `SELECT m.id, m.title, m.description, m.url, m.material_type AS type,
              c.name AS class_name, c.subject AS subject
         FROM materials m
         JOIN classes c ON c.id = m.class_id
         JOIN class_memberships cm ON cm.class_id = c.id
        WHERE cm.student_id = $1
        ORDER BY m.created_at DESC`,
      [req.user.id]
    );
    return res.json({ materials: r.rows });
  } catch (e) {
    console.error('[student/materials]', e);
    return res.json({ materials: [] });
  }
});

router.get('/student/progress', requireAuth('student'), (req, res) => {
  res.json({
    subjects: [
      { name: 'Mathe',    pct: 78, trend: '+5%' },
      { name: 'Deutsch',  pct: 85, trend: '+2%' },
      { name: 'Englisch', pct: 72, trend: '+8%' },
      { name: 'Bio',      pct: 91, trend: '+1%' },
      { name: 'Physik',   pct: 64, trend: '-3%' },
      { name: 'Chemie',   pct: 70, trend: '+4%' },
    ],
    weekly_xp: [120, 180, 210, 150, 240, 90, 160],
    badges: [
      { name: 'Algebra-Ass',    earned: true,  date: '12. Apr' },
      { name: 'Deutsch-Champion', earned: true, date: '5. Apr' },
      { name: 'Streak-Held',    earned: true,  date: '20. Mär' },
      { name: 'Physik-Profi',   earned: false, date: null },
    ]
  });
});

// ─── TEACHER placeholders ───
router.get('/teacher/assignments', requireAuth('teacher'), (req, res) => {
  res.json({ assignments: [
    { id: 1, title: 'Quadratische Gleichungen — Übung 4', class_name: 'Mathe 8B', due_at: addDays(2), submitted: 18, total: 24 },
    { id: 2, title: 'Lineare Funktionen Test',            class_name: 'Mathe 9A', due_at: addDays(5), submitted: 0,  total: 22 },
    { id: 3, title: 'Bruchrechnung Übungsblock',          class_name: 'Mathe 7C', due_at: addDays(-1), submitted: 25, total: 26 },
  ]});
});

router.get('/teacher/students', requireAuth('teacher'), (req, res) => {
  res.json({ students: [
    { id: 1, name: 'Lena Müller',     class: '8B', accuracy: 88, streak: 12, last_active: 'vor 2 Std' },
    { id: 2, name: 'Tim Schäfer',     class: '8B', accuracy: 64, streak: 3,  last_active: 'gestern',   flag: 'Mühe' },
    { id: 3, name: 'Sophie Bauer',    class: '8B', accuracy: 92, streak: 18, last_active: 'vor 1 Std', flag: 'stark' },
    { id: 4, name: 'Maximilian Weber', class: '9A', accuracy: 71, streak: 5, last_active: 'vor 4 Std' },
    { id: 5, name: 'Mia Hoffmann',    class: '9A', accuracy: 84, streak: 9,  last_active: 'gestern' },
    { id: 6, name: 'Leon Schmidt',    class: '7C', accuracy: 58, streak: 0,  last_active: '3 Tage',    flag: 'Mühe' },
  ]});
});

router.get('/teacher/messages', requireAuth('teacher'), (req, res) => {
  res.json({ messages: [
    { id: 1, from: 'Schul-Verwaltung', subject: 'Konferenz Donnerstag', preview: 'Die Lehrerkonferenz findet…',     time: 'vor 1 Std', unread: true },
    { id: 2, from: 'Eltern Müller',     subject: 'Frage zur Note Mathe', preview: 'Können wir kurz telefonieren…',  time: 'gestern',   unread: true },
    { id: 3, from: 'Fr. Schmidt',       subject: 'Vertretung Mittwoch',  preview: 'Kannst du am Mittwoch die 3.Std…', time: '2 Tage',   unread: false },
  ]});
});

router.get('/teacher/announcements', requireAuth('teacher'), async (req, res) => {
  try {
    const r = await db.query(
      `SELECT a.id, a.title, a.body, a.created_at AS published_at,
              c.name AS class_name
         FROM announcements a
         LEFT JOIN classes c ON c.id = a.class_id
        WHERE a.author_id = $1
        ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json({ announcements: r.rows });
  } catch (e) {
    console.error('[teacher/announcements]', e);
    res.json({ announcements: [] });
  }
});

router.get('/teacher/materials', requireAuth('teacher'), async (req, res) => {
  try {
    const r = await db.query(
      `SELECT m.id, m.title, m.description, m.url, m.material_type AS type,
              c.name AS class_name, m.created_at
         FROM materials m
         LEFT JOIN classes c ON c.id = m.class_id
        WHERE m.teacher_id = $1
        ORDER BY m.created_at DESC`,
      [req.user.id]
    );
    res.json({ materials: r.rows });
  } catch (e) {
    console.error('[teacher/materials]', e);
    res.json({ materials: [] });
  }
});

// ─── SCHOOL-ADMIN placeholders ───
router.get('/school/teachers', requireAuth('school_admin'), async (req, res) => {
  let rows = [];
  try {
    const r = await db.query(
      `SELECT id, full_name, email, status, last_login,
              (SELECT COUNT(*) FROM classes WHERE teacher_id = users.id) AS class_count
         FROM users WHERE school_id = $1 AND role = 'teacher' ORDER BY full_name`,
      [req.user.school_id]
    );
    rows = r.rows;
  } catch (e) {}
  if (rows.length === 0) {
    rows = [
      { id: 1, full_name: 'Andreas Becker',  email: 'becker@schule.de',  status: 'active', class_count: 4, last_login: 'heute' },
      { id: 2, full_name: 'Maria Schmidt',   email: 'schmidt@schule.de', status: 'active', class_count: 3, last_login: 'gestern' },
      { id: 3, full_name: 'Thomas Weber',    email: 'weber@schule.de',   status: 'active', class_count: 5, last_login: 'heute' },
      { id: 4, full_name: 'Sabine Hoffmann', email: 'hoffmann@schule.de',status: 'invited',class_count: 0, last_login: null },
    ];
  }
  res.json({ teachers: rows });
});

router.get('/school/students', requireAuth('school_admin'), (req, res) => {
  res.json({ students: [
    { id: 1, name: 'Lena Müller',  grade: 8, class: '8B', accuracy: 88, last_active: 'heute' },
    { id: 2, name: 'Tim Schäfer',  grade: 8, class: '8B', accuracy: 64, last_active: 'gestern' },
    { id: 3, name: 'Sophie Bauer', grade: 8, class: '8B', accuracy: 92, last_active: 'heute' },
    { id: 4, name: 'Maximilian Weber', grade: 9, class: '9A', accuracy: 71, last_active: 'heute' },
    { id: 5, name: 'Mia Hoffmann', grade: 9, class: '9A', accuracy: 84, last_active: 'gestern' },
    { id: 6, name: 'Leon Schmidt', grade: 7, class: '7C', accuracy: 58, last_active: '3 Tage' },
  ]});
});

router.get('/school/classes', requireAuth('school_admin'), async (req, res) => {
  let rows = [];
  try {
    const r = await db.query(
      `SELECT c.id, c.name, c.subject, c.invite_code, u.full_name AS teacher_name,
              (SELECT COUNT(*) FROM class_memberships WHERE class_id = c.id) AS student_count
         FROM classes c LEFT JOIN users u ON u.id = c.teacher_id
        WHERE c.school_id = $1 ORDER BY c.created_at DESC`,
      [req.user.school_id]
    );
    rows = r.rows;
  } catch (e) {}
  if (rows.length === 0) {
    rows = [
      { id: 1, name: 'Mathe 8B',    subject: 'Mathe',    teacher_name: 'A. Becker',  student_count: 24, invite_code: 'MATH-8BX1' },
      { id: 2, name: 'Mathe 9A',    subject: 'Mathe',    teacher_name: 'A. Becker',  student_count: 22, invite_code: 'MATH-9AY2' },
      { id: 3, name: 'Deutsch 8B',  subject: 'Deutsch',  teacher_name: 'M. Schmidt', student_count: 24, invite_code: 'DEUT-8BZ3' },
      { id: 4, name: 'Bio 9A',      subject: 'Bio',      teacher_name: 'T. Weber',   student_count: 22, invite_code: 'BIOL-9AA4' },
    ];
  }
  res.json({ classes: rows });
});

router.get('/school/analytics', requireAuth('school_admin'), (req, res) => {
  res.json({
    overview: { total_logins_week: 312, avg_accuracy: 79, tasks_completed_week: 458, active_classes: 12 },
    subjects: [
      { name: 'Mathe',    accuracy: 76 },
      { name: 'Deutsch',  accuracy: 82 },
      { name: 'Englisch', accuracy: 74 },
      { name: 'Bio',      accuracy: 88 },
      { name: 'Physik',   accuracy: 69 },
    ],
    weekly: [42, 58, 71, 65, 80, 30, 22]
  });
});

router.get('/school/reports', requireAuth('school_admin'), (req, res) => {
  const today = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  res.json({ reports: [
    { id: 'activity', title: 'Schul-Aktivitätsbericht', period: 'Aktueller Stand', created_at: today, type: 'pdf' },
  ]});
});

router.get('/school/announcements', requireAuth('school_admin'), async (req, res) => {
  try {
    const r = await db.query(
      `SELECT a.id, a.title, a.body, a.audience, a.created_at AS published_at
         FROM announcements a
        WHERE a.school_id = $1
        ORDER BY a.created_at DESC`,
      [req.user.school_id]
    );
    res.json({ announcements: r.rows });
  } catch (e) {
    console.error('[school/announcements]', e);
    res.json({ announcements: [] });
  }
});

// ─── SUPER-ADMIN placeholders ───
router.get('/admin/users', requireAuth('super_admin'), async (req, res) => {
  let rows = [];
  try {
    const r = await db.query('SELECT id, full_name, email, role, school_id, status FROM users ORDER BY created_at DESC LIMIT 50');
    rows = r.rows;
  } catch (e) {}
  res.json({ users: rows, total: rows.length });
});

router.get('/admin/system', requireAuth('super_admin'), (req, res) => {
  res.json({
    api: 'online',
    db: 'connected',
    email: 'active',
    ssl: 'valid',
    uptime: '99.9%',
    last_backup: new Date().toISOString().slice(0, 10),
    cpu: 12, memory: 38, disk: 45,
  });
});

router.get('/admin/audit', requireAuth('super_admin'), async (req, res) => {
  let rows = [];
  try {
    const r = await db.query('SELECT action, target_type, target_id, ip, created_at FROM audit_log ORDER BY created_at DESC LIMIT 30');
    rows = r.rows;
  } catch (e) {}
  if (rows.length === 0) {
    rows = [
      { action: 'school_approved',   target_type: 'school', target_id: 3, ip: '152.53.182.33', created_at: 'heute 10:24' },
      { action: 'user_login',        target_type: 'user',   target_id: 1, ip: '152.53.182.33', created_at: 'heute 09:18' },
      { action: 'school_registered', target_type: 'school', target_id: 4, ip: '85.214.x.x',     created_at: 'gestern 16:02' },
    ];
  }
  res.json({ entries: rows });
});

router.get('/admin/permissions', requireAuth('super_admin'), (req, res) => {
  res.json({ roles: [
    { role: 'super_admin', label: 'Super-Admin', count: 1, permissions: ['Schulen freigeben', 'System verwalten', 'Audit-Log einsehen', 'Alle Daten lesen'] },
    { role: 'school_admin', label: 'Schul-Verwaltung', count: 0, permissions: ['Lehrkräfte einladen', 'Klassen verwalten', 'Schulberichte einsehen'] },
    { role: 'teacher', label: 'Lehrkraft', count: 0, permissions: ['Klassen erstellen', 'Aufgaben verteilen', 'Schüler-Fortschritt einsehen'] },
    { role: 'student', label: 'Schüler:in', count: 0, permissions: ['Aufgaben einsehen', 'Hausaufgaben einreichen', 'Eigenen Fortschritt einsehen'] },
  ]});
});

// helper
function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

module.exports = router;

// ============================================================
// v7 ACTIONS: Real POST endpoints for buttons
// ============================================================

// ----- TEACHER: Create class -----
router.post('/teacher/create-class', requireAuth('teacher'), async (req, res) => {
  try {
    const { name, subject, grade_level } = req.body || {};
    if (!name || !subject) return res.status(400).json({ error: 'Name und Fach sind Pflicht.' });

    // Generate random invite code
    const code = 'C-' + Math.random().toString(36).slice(2, 8).toUpperCase();

    const result = await db.query(
      `INSERT INTO classes (school_id, teacher_id, name, subject, grade_level, invite_code)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, subject, invite_code`,
      [req.user.school_id, req.user.id, name, subject, grade_level || null, code]
    );
    res.json({ ok: true, class: result.rows[0] });
  } catch (e) {
    console.error('[create-class]', e);
    res.status(500).json({ error: 'Klasse konnte nicht erstellt werden.' });
  }
});

// ----- TEACHER: Create assignment / task -----
router.post('/teacher/create-assignment', requireAuth('teacher'), async (req, res) => {
  try {
    const { class_id, title, description, subject, difficulty, due_at } = req.body || {};
    if (!class_id || !title) return res.status(400).json({ error: 'Klasse und Titel sind Pflicht.' });

    // Verify teacher owns this class
    const own = await db.query('SELECT id FROM classes WHERE id = $1 AND teacher_id = $2', [class_id, req.user.id]);
    if (own.rows.length === 0) return res.status(403).json({ error: 'Du bist nicht Lehrer dieser Klasse.' });

    const result = await db.query(
      `INSERT INTO tasks (class_id, teacher_id, title, description, subject, difficulty, due_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, due_at`,
      [class_id, req.user.id, title, description || '', subject || 'Allgemein', difficulty || 2, due_at || null]
    );
    res.json({ ok: true, task: result.rows[0] });
  } catch (e) {
    console.error('[create-assignment]', e);
    res.status(500).json({ error: 'Aufgabe konnte nicht erstellt werden.' });
  }
});

// ----- TEACHER: Send announcement to class -----
router.post('/teacher/create-announcement', requireAuth('teacher'), async (req, res) => {
  try {
    const { class_id, title, body } = req.body || {};
    if (!title || !body) return res.status(400).json({ error: 'Titel und Inhalt sind Pflicht.' });

    const result = await db.query(
      `INSERT INTO announcements (school_id, class_id, author_id, audience, title, body)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, created_at`,
      [req.user.school_id, class_id || null, req.user.id, class_id ? 'class' : 'school', title, body]
    );
    res.json({ ok: true, announcement: result.rows[0] });
  } catch (e) {
    console.error('[create-announcement]', e);
    res.status(500).json({ error: 'Ankündigung konnte nicht erstellt werden.' });
  }
});

// ----- TEACHER: Send message -----
router.post('/teacher/send-message', requireAuth('teacher'), async (req, res) => {
  try {
    const { recipient_id, class_id, subject, body } = req.body || {};
    if (!body) return res.status(400).json({ error: 'Nachricht darf nicht leer sein.' });

    const result = await db.query(
      `INSERT INTO messages (sender_id, recipient_id, class_id, subject, body)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [req.user.id, recipient_id || null, class_id || null, subject || '', body]
    );
    res.json({ ok: true, message: result.rows[0] });
  } catch (e) {
    console.error('[send-message]', e);
    res.status(500).json({ error: 'Nachricht konnte nicht gesendet werden.' });
  }
});

// ----- TEACHER: Add material -----
router.post('/teacher/add-material', requireAuth('teacher'), async (req, res) => {
  try {
    const { class_id, title, description, url, material_type } = req.body || {};
    if (!title) return res.status(400).json({ error: 'Titel ist Pflicht.' });

    const result = await db.query(
      `INSERT INTO materials (class_id, teacher_id, title, description, url, material_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title`,
      [class_id || null, req.user.id, title, description || '', url || '', material_type || 'link']
    );
    res.json({ ok: true, material: result.rows[0] });
  } catch (e) {
    console.error('[add-material]', e);
    res.status(500).json({ error: 'Material konnte nicht gespeichert werden.' });
  }
});

// ----- STUDENT: Join class via invite code -----
router.post('/student/join-class', requireAuth('student'), async (req, res) => {
  try {
    const { invite_code } = req.body || {};
    if (!invite_code) return res.status(400).json({ error: 'Code ist Pflicht.' });

    const cls = await db.query('SELECT id, name FROM classes WHERE invite_code = $1', [invite_code.toUpperCase()]);
    if (cls.rows.length === 0) return res.status(404).json({ error: 'Kein Code gefunden.' });

    try {
      await db.query(
        'INSERT INTO class_memberships (class_id, student_id) VALUES ($1, $2)',
        [cls.rows[0].id, req.user.id]
      );
    } catch (e) {
      if (e.code === '23505') return res.status(400).json({ error: 'Du bist bereits in dieser Klasse.' });
      throw e;
    }
    res.json({ ok: true, class: cls.rows[0] });
  } catch (e) {
    console.error('[join-class]', e);
    res.status(500).json({ error: 'Beitritt fehlgeschlagen.' });
  }
});

// ----- STUDENT: Submit task -----
router.post('/student/submit-task', requireAuth('student'), async (req, res) => {
  try {
    const { task_id, score_pct, answers } = req.body || {};
    if (!task_id) return res.status(400).json({ error: 'Aufgaben-ID fehlt.' });

    const score = Math.max(0, Math.min(100, parseInt(score_pct) || 0));
    const xp = Math.round(score / 10) * 5;  // simple: 5 XP per 10% accuracy

    await db.query(
      `INSERT INTO task_submissions (task_id, student_id, score_pct, xp_earned, answers)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (task_id, student_id) DO UPDATE
       SET score_pct = $3, xp_earned = $4, answers = $5, submitted_at = CURRENT_TIMESTAMP`,
      [task_id, req.user.id, score, xp, JSON.stringify(answers || [])]
    );

    // Update progress
    await db.query(
      `INSERT INTO progress (user_id, total_xp, tasks_completed, last_active)
       VALUES ($1, $2, 1, CURRENT_DATE)
       ON CONFLICT (user_id) DO UPDATE
       SET total_xp = progress.total_xp + $2,
           tasks_completed = progress.tasks_completed + 1,
           last_active = CURRENT_DATE`,
      [req.user.id, xp]
    );
    res.json({ ok: true, score_pct: score, xp_earned: xp });
  } catch (e) {
    console.error('[submit-task]', e);
    res.status(500).json({ error: 'Abgabe fehlgeschlagen.' });
  }
});

// ----- STUDENT: Send message to teacher -----
router.post('/student/send-message', requireAuth('student'), async (req, res) => {
  try {
    const { recipient_id, body } = req.body || {};
    if (!body) return res.status(400).json({ error: 'Nachricht darf nicht leer sein.' });

    const result = await db.query(
      `INSERT INTO messages (sender_id, recipient_id, body) VALUES ($1, $2, $3) RETURNING id`,
      [req.user.id, recipient_id || null, body]
    );
    res.json({ ok: true, id: result.rows[0].id });
  } catch (e) {
    console.error('[student send-message]', e);
    res.status(500).json({ error: 'Senden fehlgeschlagen.' });
  }
});

// ----- SCHOOL ADMIN: Invite teacher -----
router.post('/school/invite-teacher', requireAuth('school_admin'), async (req, res) => {
  try {
    const { email, full_name, subject } = req.body || {};
    if (!email) return res.status(400).json({ error: 'E-Mail ist Pflicht.' });

    // Generate temp password
    const tempPw = Math.random().toString(36).slice(2, 10);
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync(tempPw, 10);

    const result = await db.query(
      `INSERT INTO users (school_id, role, email, password_hash, full_name, status)
       VALUES ($1, 'teacher', $2, $3, $4, 'active')
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [req.user.school_id, email.toLowerCase(), hash, full_name || email]
    );
    if (result.rows.length === 0) return res.status(400).json({ error: 'Diese E-Mail existiert bereits.' });

    // Return temp password so school admin can pass it on
    res.json({ ok: true, email: result.rows[0].email, temp_password: tempPw });
  } catch (e) {
    console.error('[invite-teacher]', e);
    res.status(500).json({ error: 'Einladung fehlgeschlagen.' });
  }
});

// ----- SCHOOL ADMIN: School announcement -----
router.post('/school/create-announcement', requireAuth('school_admin'), async (req, res) => {
  try {
    const { title, body } = req.body || {};
    if (!title || !body) return res.status(400).json({ error: 'Titel und Inhalt sind Pflicht.' });
    const result = await db.query(
      `INSERT INTO announcements (school_id, author_id, audience, title, body)
       VALUES ($1, $2, 'school', $3, $4) RETURNING id, title, created_at`,
      [req.user.school_id, req.user.id, title, body]
    );
    res.json({ ok: true, announcement: result.rows[0] });
  } catch (e) {
    console.error('[school announcement]', e);
    res.status(500).json({ error: 'Ankündigung fehlgeschlagen.' });
  }
});

// ============================================================
// ADAPTIVE ENGINE — practice mode
// ============================================================

// Helper: get or create student skill row
async function getOrCreateSkill(studentId, subject, topic) {
  let r = await db.query(
    'SELECT * FROM student_skill WHERE student_id=$1 AND subject=$2 AND topic=$3',
    [studentId, subject, topic]
  );
  if (r.rows.length > 0) return r.rows[0];
  await db.query(
    'INSERT INTO student_skill (student_id, subject, topic, skill_level) VALUES ($1,$2,$3,2.0)',
    [studentId, subject, topic]
  );
  r = await db.query(
    'SELECT * FROM student_skill WHERE student_id=$1 AND subject=$2 AND topic=$3',
    [studentId, subject, topic]
  );
  return r.rows[0];
}

// GET /api/data/student/practice/next?subject=Mathematik
// Returns the next question for this student, chosen by adaptive engine.
router.get('/student/practice/next', requireAuth('student'), async (req, res) => {
  try {
    const subject = req.query.subject;
    if (!subject) return res.status(400).json({ error: 'Fach fehlt.' });

    // Find average skill level across all topics this student has in this subject
    const skillRow = await db.query(
      `SELECT AVG(skill_level)::numeric(3,1) AS avg_skill
         FROM student_skill
        WHERE student_id = $1 AND subject = $2`,
      [req.user.id, subject]
    );
    const avgSkill = parseFloat(skillRow.rows[0].avg_skill) || 2.0;

    // Get last 5 question IDs this student answered (avoid immediate repeats)
    const recentAttempts = await db.query(
      `SELECT question_id FROM question_attempt
        WHERE student_id = $1
          AND attempted_at > NOW() - INTERVAL '1 hour'
        ORDER BY attempted_at DESC LIMIT 5`,
      [req.user.id]
    );
    const recentIds = recentAttempts.rows.map(r => r.question_id);

    // Pick a question with difficulty close to skill level (±1), not in recent.
    // Spaced repetition: prefer topics this student hasn't practiced lately
    // (or never). Topics with NULL last_practiced rank first.
    const targetDiff = Math.round(avgSkill);
    let query;
    let params;
    if (recentIds.length > 0) {
      query = `SELECT qb.id, qb.subject, qb.topic, qb.difficulty, qb.question_type, qb.question_text, qb.options, qb.hint, qb.xp_reward
                 FROM question_bank qb
            LEFT JOIN student_skill ss
                   ON ss.subject = qb.subject AND ss.topic = qb.topic AND ss.student_id = $${4 + recentIds.length}
                WHERE qb.subject = $1
                  AND qb.difficulty BETWEEN $2 AND $3
                  AND qb.id NOT IN (${recentIds.map((_, i) => '$' + (i + 4)).join(',')})
                ORDER BY ss.last_practiced ASC NULLS FIRST, RANDOM() LIMIT 1`;
      params = [subject, Math.max(1, targetDiff - 1), Math.min(5, targetDiff + 1), ...recentIds, req.user.id];
    } else {
      query = `SELECT qb.id, qb.subject, qb.topic, qb.difficulty, qb.question_type, qb.question_text, qb.options, qb.hint, qb.xp_reward
                 FROM question_bank qb
            LEFT JOIN student_skill ss
                   ON ss.subject = qb.subject AND ss.topic = qb.topic AND ss.student_id = $4
                WHERE qb.subject = $1
                  AND qb.difficulty BETWEEN $2 AND $3
                ORDER BY ss.last_practiced ASC NULLS FIRST, RANDOM() LIMIT 1`;
      params = [subject, Math.max(1, targetDiff - 1), Math.min(5, targetDiff + 1), req.user.id];
    }

    let r = await db.query(query, params);

    // Fallback: any question for this subject (in case the difficulty filter gave nothing)
    if (r.rows.length === 0) {
      r = await db.query(
        `SELECT id, subject, topic, difficulty, question_type, question_text, options, hint, xp_reward
           FROM question_bank
          WHERE subject = $1
          ORDER BY RANDOM() LIMIT 1`,
        [subject]
      );
    }

    if (r.rows.length === 0) {
      return res.status(404).json({ error: 'Keine Fragen für dieses Fach.' });
    }

    res.json({ ok: true, question: r.rows[0], skill_level: avgSkill });
  } catch (e) {
    console.error('[practice/next]', e);
    res.status(500).json({ error: 'Frage konnte nicht geladen werden.' });
  }
});

// POST /api/data/student/practice/answer
// Body: { question_id, answer }
// Checks correctness, updates skill, returns result + next question
router.post('/student/practice/answer', requireAuth('student'), async (req, res) => {
  try {
    const { question_id, answer } = req.body || {};
    if (!question_id) return res.status(400).json({ error: 'question_id fehlt.' });

    const qRow = await db.query(
      'SELECT * FROM question_bank WHERE id = $1', [question_id]
    );
    if (qRow.rows.length === 0) return res.status(404).json({ error: 'Frage nicht gefunden.' });
    const q = qRow.rows[0];

    // Compare answers (case-insensitive, trimmed)
    const normalize = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const correct = normalize(answer) === normalize(q.correct_answer);

    // Record attempt
    await db.query(
      'INSERT INTO question_attempt (student_id, question_id, was_correct, answer_given) VALUES ($1,$2,$3,$4)',
      [req.user.id, question_id, correct, answer || '']
    );

    // Update skill: + on correct, - on wrong (clamped 1.0-5.0)
    const skill = await getOrCreateSkill(req.user.id, q.subject, q.topic);
    let newLevel = parseFloat(skill.skill_level);
    newLevel = correct ? newLevel + 0.3 : newLevel - 0.2;
    newLevel = Math.max(1.0, Math.min(5.0, newLevel));

    await db.query(
      `UPDATE student_skill
          SET skill_level = $1,
              answered = answered + 1,
              correct = correct + $2,
              last_practiced = CURRENT_TIMESTAMP
        WHERE id = $3`,
      [newLevel.toFixed(1), correct ? 1 : 0, skill.id]
    );

    // Award XP if correct
    let xpEarned = 0;
    if (correct) {
      xpEarned = q.xp_reward || 10;
      await db.query(
        `INSERT INTO progress (user_id, total_xp, last_active)
         VALUES ($1, $2, CURRENT_DATE)
         ON CONFLICT (user_id) DO UPDATE
            SET total_xp = progress.total_xp + $2,
                last_active = CURRENT_DATE`,
        [req.user.id, xpEarned]
      );
    }

    // Check & award achievements (non-blocking-ish; awaits inside)
    let newAchievements = [];
    try {
      const beforeIds = (await db.query('SELECT achievement_id FROM user_achievements WHERE user_id = $1', [req.user.id])).rows.map(r => r.achievement_id);
      await checkAchievements(req.user.id);
      const afterAch = await db.query(
        `SELECT ua.achievement_id, a.title, a.icon
           FROM user_achievements ua JOIN achievements a ON a.id = ua.achievement_id
          WHERE ua.user_id = $1`,
        [req.user.id]
      );
      newAchievements = afterAch.rows.filter(a => !beforeIds.includes(a.achievement_id));
    } catch (e) { /* non-fatal */ }

    res.json({
      ok: true,
      correct,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      xp_earned: xpEarned,
      new_skill_level: parseFloat(newLevel.toFixed(1)),
      new_achievements: newAchievements,
    });
  } catch (e) {
    console.error('[practice/answer]', e);
    res.status(500).json({ error: 'Antwort konnte nicht gespeichert werden.' });
  }
});

// GET /api/data/student/practice/stats
// Per-subject skill levels and stats for the student
router.get('/student/practice/stats', requireAuth('student'), async (req, res) => {
  try {
    const r = await db.query(
      `SELECT subject,
              AVG(skill_level)::numeric(3,1) AS avg_skill,
              SUM(answered) AS answered,
              SUM(correct) AS correct
         FROM student_skill
        WHERE student_id = $1
        GROUP BY subject`,
      [req.user.id]
    );
    res.json({ ok: true, data: { stats: r.rows } });
  } catch (e) {
    console.error('[practice/stats]', e);
    res.json({ ok: true, data: { stats: [] } });
  }
});

// ============================================================
// v7.2: Klassenrennen, Aufgaben mit Fragen, Klasse verwalten, Inbox
// ============================================================

// ───── Klassenrennen: ranked classmates by XP (last 7 days) ─────
router.get('/student/class-race/:classId', requireAuth('student'), async (req, res) => {
  try {
    const classId = parseInt(req.params.classId, 10);
    // Verify student is in this class
    const m = await db.query('SELECT 1 FROM class_memberships WHERE class_id=$1 AND student_id=$2', [classId, req.user.id]);
    if (m.rows.length === 0) return res.status(403).json({ error: 'Nicht in dieser Klasse.' });

    const r = await db.query(
      `SELECT u.id, u.full_name, COALESCE(p.total_xp, 0) AS total_xp
         FROM class_memberships cm
         JOIN users u ON u.id = cm.student_id
    LEFT JOIN progress p ON p.user_id = u.id
        WHERE cm.class_id = $1
     ORDER BY total_xp DESC
        LIMIT 30`,
      [classId]
    );
    res.json({ ok: true, data: { students: r.rows, you_id: req.user.id } });
  } catch (e) {
    console.error('[class-race]', e);
    res.status(500).json({ error: 'Rennen konnte nicht geladen werden.' });
  }
});

// ───── Klassenrangliste (Lehrer-Sicht) ─────
router.get('/teacher/leaderboard/:classId', requireAuth('teacher'), async (req, res) => {
  try {
    const classId = parseInt(req.params.classId, 10);
    const own = await db.query('SELECT 1 FROM classes WHERE id=$1 AND teacher_id=$2', [classId, req.user.id]);
    if (own.rows.length === 0) return res.status(403).json({ error: 'Nicht deine Klasse.' });
    const r = await db.query(
      `SELECT u.id, u.full_name, COALESCE(p.total_xp, 0) AS total_xp,
              COALESCE(p.tasks_completed, 0) AS tasks_completed,
              COALESCE(p.streak_days, 0) AS streak_days
         FROM class_memberships cm
         JOIN users u ON u.id = cm.student_id
    LEFT JOIN progress p ON p.user_id = u.id
        WHERE cm.class_id = $1
     ORDER BY total_xp DESC`,
      [classId]
    );
    res.json({ ok: true, data: { students: r.rows } });
  } catch (e) {
    console.error('[leaderboard]', e);
    res.status(500).json({ error: 'Rangliste konnte nicht geladen werden.' });
  }
});

// ───── Klasse umbenennen ─────
router.post('/teacher/rename-class/:classId', requireAuth('teacher'), async (req, res) => {
  try {
    const classId = parseInt(req.params.classId, 10);
    const { name } = req.body || {};
    if (!name || name.trim().length === 0) return res.status(400).json({ error: 'Name darf nicht leer sein.' });
    const r = await db.query(
      'UPDATE classes SET name=$1 WHERE id=$2 AND teacher_id=$3 RETURNING id',
      [name.trim(), classId, req.user.id]
    );
    if (r.rows.length === 0) return res.status(403).json({ error: 'Nicht deine Klasse.' });
    res.json({ ok: true });
  } catch (e) {
    console.error('[rename-class]', e);
    res.status(500).json({ error: 'Fehler.' });
  }
});

// ───── Klasse löschen ─────
router.post('/teacher/delete-class/:classId', requireAuth('teacher'), async (req, res) => {
  try {
    const classId = parseInt(req.params.classId, 10);
    const r = await db.query('DELETE FROM classes WHERE id=$1 AND teacher_id=$2 RETURNING id', [classId, req.user.id]);
    if (r.rows.length === 0) return res.status(403).json({ error: 'Nicht deine Klasse.' });
    res.json({ ok: true });
  } catch (e) {
    console.error('[delete-class]', e);
    res.status(500).json({ error: 'Fehler.' });
  }
});

// ───── Aufgabe mit Fragen aus Bank erstellen ─────
// POST body: { class_id, title, subject, topic, question_count, due_at }
// → Picks N random questions from bank matching subject/topic, links them
router.post('/teacher/create-task-with-questions', requireAuth('teacher'), async (req, res) => {
  try {
    const { class_id, title, subject, topic, question_count, due_at } = req.body || {};
    if (!class_id || !title || !subject) return res.status(400).json({ error: 'Klasse, Titel und Fach sind Pflicht.' });

    const own = await db.query('SELECT 1 FROM classes WHERE id=$1 AND teacher_id=$2', [class_id, req.user.id]);
    if (own.rows.length === 0) return res.status(403).json({ error: 'Nicht deine Klasse.' });

    const count = Math.max(1, Math.min(20, parseInt(question_count) || 5));

    // Pick questions
    let questions;
    if (topic && topic.trim()) {
      questions = await db.query(
        'SELECT id FROM question_bank WHERE subject=$1 AND topic=$2 ORDER BY RANDOM() LIMIT $3',
        [subject, topic, count]
      );
    } else {
      questions = await db.query(
        'SELECT id FROM question_bank WHERE subject=$1 ORDER BY RANDOM() LIMIT $2',
        [subject, count]
      );
    }

    if (questions.rows.length === 0) {
      return res.status(400).json({ error: 'Keine Fragen für dieses Fach/Thema gefunden.' });
    }

    const taskRes = await db.query(
      `INSERT INTO tasks (class_id, teacher_id, title, subject, topic, question_count, due_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [class_id, req.user.id, title, subject, topic || null, questions.rows.length, due_at || null]
    );
    const taskId = taskRes.rows[0].id;

    for (let i = 0; i < questions.rows.length; i++) {
      await db.query(
        'INSERT INTO task_questions (task_id, question_id, position) VALUES ($1,$2,$3)',
        [taskId, questions.rows[i].id, i]
      );
    }
    res.json({ ok: true, task_id: taskId, question_count: questions.rows.length });
  } catch (e) {
    console.error('[create-task-with-questions]', e);
    res.status(500).json({ error: 'Aufgabe konnte nicht erstellt werden.' });
  }
});

// ───── Aufgaben-Fragen abrufen (Schüler öffnet Aufgabe) ─────
router.get('/student/task/:taskId/questions', requireAuth('student'), async (req, res) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    // Verify student is in the class of this task
    const v = await db.query(
      `SELECT t.id FROM tasks t
         JOIN class_memberships cm ON cm.class_id = t.class_id
        WHERE t.id = $1 AND cm.student_id = $2`,
      [taskId, req.user.id]
    );
    if (v.rows.length === 0) return res.status(403).json({ error: 'Diese Aufgabe ist nicht für dich.' });

    const qs = await db.query(
      `SELECT q.id, q.question_text, q.question_type, q.options, q.hint, q.xp_reward
         FROM task_questions tq
         JOIN question_bank q ON q.id = tq.question_id
        WHERE tq.task_id = $1
     ORDER BY tq.position`,
      [taskId]
    );
    res.json({ ok: true, data: { questions: qs.rows } });
  } catch (e) {
    console.error('[task questions]', e);
    res.status(500).json({ error: 'Fragen konnten nicht geladen werden.' });
  }
});

// ───── Nachrichten-Inbox (jeder Rolle) ─────
router.get('/inbox', requireAuth(), async (req, res) => {
  try {
    const r = await db.query(
      `SELECT m.id, m.subject, m.body, m.read_at, m.created_at,
              s.full_name AS sender_name, s.role AS sender_role
         FROM messages m
         JOIN users s ON s.id = m.sender_id
        WHERE m.recipient_id = $1
     ORDER BY m.created_at DESC
        LIMIT 50`,
      [req.user.id]
    );
    res.json({ ok: true, data: { messages: r.rows } });
  } catch (e) {
    console.error('[inbox]', e);
    res.json({ ok: true, data: { messages: [] } });
  }
});

// ───── Nachricht als gelesen markieren ─────
router.post('/inbox/read/:messageId', requireAuth(), async (req, res) => {
  try {
    const id = parseInt(req.params.messageId, 10);
    await db.query(
      'UPDATE messages SET read_at = CURRENT_TIMESTAMP WHERE id=$1 AND recipient_id=$2 AND read_at IS NULL',
      [id, req.user.id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Fehler.' });
  }
});

// ============================================================
// v7.2: 10 priority features — endpoints
// ============================================================
const bcryptForPw = require('bcryptjs');

// ───── 1. CHANGE PASSWORD (any logged-in user) ─────
router.post('/me/change-password', requireAuth(), async (req, res) => {
  try {
    const { current_password, new_password } = req.body || {};
    if (!current_password || !new_password) return res.status(400).json({ error: 'Felder fehlen.' });
    if (new_password.length < 6) return res.status(400).json({ error: 'Neues Passwort muss mindestens 6 Zeichen lang sein.' });

    const r = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (r.rows.length === 0) return res.status(404).json({ error: 'Benutzer nicht gefunden.' });

    const ok = await bcryptForPw.compare(current_password, r.rows[0].password_hash);
    if (!ok) return res.status(401).json({ error: 'Aktuelles Passwort falsch.' });

    const newHash = await bcryptForPw.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('[change-password]', e);
    res.status(500).json({ error: 'Passwort konnte nicht geändert werden.' });
  }
});

// ───── 3. ATTACH QUESTIONS to a teacher-created task ─────
// Teacher selects subject+topic+count; we randomly pick from question_bank.
router.post('/teacher/attach-questions', requireAuth('teacher'), async (req, res) => {
  try {
    const { task_id, subject, count } = req.body || {};
    if (!task_id || !subject) return res.status(400).json({ error: 'task_id und subject sind Pflicht.' });
    const n = Math.max(1, Math.min(20, parseInt(count) || 5));

    // verify ownership
    const own = await db.query('SELECT id FROM tasks WHERE id = $1 AND teacher_id = $2', [task_id, req.user.id]);
    if (own.rows.length === 0) return res.status(403).json({ error: 'Nicht erlaubt.' });

    // pick random questions of that subject
    const q = await db.query(
      `SELECT id FROM question_bank WHERE subject = $1 ORDER BY RANDOM() LIMIT $2`,
      [subject, n]
    );
    if (q.rows.length === 0) return res.status(404).json({ error: 'Keine Fragen für dieses Fach.' });

    // clear existing, then insert
    await db.query('DELETE FROM task_questions WHERE task_id = $1', [task_id]);
    for (let i = 0; i < q.rows.length; i++) {
      await db.query(
        'INSERT INTO task_questions (task_id, question_id, position) VALUES ($1, $2, $3)',
        [task_id, q.rows[i].id, i]
      );
    }
    res.json({ ok: true, attached: q.rows.length });
  } catch (e) {
    console.error('[attach-questions]', e);
    res.status(500).json({ error: 'Fragen konnten nicht zugewiesen werden.' });
  }
});

// Student: get questions of a task
router.get('/student/task/:id/questions', requireAuth('student'), async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const r = await db.query(
      `SELECT q.id, q.subject, q.topic, q.difficulty, q.question_type, q.question_text, q.options, q.hint, q.xp_reward
         FROM task_questions tq
         JOIN question_bank q ON q.id = tq.question_id
        WHERE tq.task_id = $1
        ORDER BY tq.position`,
      [taskId]
    );
    res.json({ ok: true, data: { questions: r.rows } });
  } catch (e) {
    console.error('[task questions]', e);
    res.status(500).json({ error: 'Fragen konnten nicht geladen werden.' });
  }
});

// ───── 4. CLASS LEADERBOARD ─────
// Top-XP students in a class (last 30 days for "active" feel)
router.get('/class/:id/leaderboard', requireAuth(), async (req, res) => {
  try {
    const classId = parseInt(req.params.id);
    const r = await db.query(
      `SELECT u.id, u.full_name, COALESCE(p.total_xp, 0) AS xp, COALESCE(p.current_streak, 0) AS streak
         FROM class_memberships cm
         JOIN users u ON u.id = cm.student_id
    LEFT JOIN progress p ON p.user_id = u.id
        WHERE cm.class_id = $1 AND u.status = 'active'
        ORDER BY xp DESC
        LIMIT 50`,
      [classId]
    );
    res.json({ ok: true, data: { leaderboard: r.rows } });
  } catch (e) {
    console.error('[leaderboard]', e);
    res.status(500).json({ error: 'Rangliste konnte nicht geladen werden.' });
  }
});

// ───── 7. CLASS: rename / delete ─────
router.post('/teacher/rename-class', requireAuth('teacher'), async (req, res) => {
  try {
    const { class_id, name } = req.body || {};
    if (!class_id || !name) return res.status(400).json({ error: 'Felder fehlen.' });
    const r = await db.query(
      'UPDATE classes SET name = $1 WHERE id = $2 AND teacher_id = $3 RETURNING id',
      [name, class_id, req.user.id]
    );
    if (r.rows.length === 0) return res.status(403).json({ error: 'Nicht erlaubt oder Klasse nicht gefunden.' });
    res.json({ ok: true });
  } catch (e) {
    console.error('[rename-class]', e);
    res.status(500).json({ error: 'Konnte nicht umbenennen.' });
  }
});

router.post('/teacher/delete-class', requireAuth('teacher'), async (req, res) => {
  try {
    const { class_id } = req.body || {};
    if (!class_id) return res.status(400).json({ error: 'class_id fehlt.' });
    const r = await db.query(
      'DELETE FROM classes WHERE id = $1 AND teacher_id = $2 RETURNING id',
      [class_id, req.user.id]
    );
    if (r.rows.length === 0) return res.status(403).json({ error: 'Nicht erlaubt oder Klasse nicht gefunden.' });
    res.json({ ok: true });
  } catch (e) {
    console.error('[delete-class]', e);
    res.status(500).json({ error: 'Konnte nicht löschen.' });
  }
});

// ───── 8. MESSAGES INBOX ─────
router.get('/messages/inbox', requireAuth(), async (req, res) => {
  try {
    const r = await db.query(
      `SELECT m.id, m.subject, m.body, m.read_at, m.created_at,
              u.full_name AS sender_name, u.email AS sender_email, u.role AS sender_role
         FROM messages m
         JOIN users u ON u.id = m.sender_id
        WHERE m.recipient_id = $1
        ORDER BY m.created_at DESC
        LIMIT 100`,
      [req.user.id]
    );
    const unread = r.rows.filter(m => !m.read_at).length;
    res.json({ ok: true, data: { messages: r.rows, unread } });
  } catch (e) {
    console.error('[inbox]', e);
    res.status(500).json({ error: 'Inbox-Fehler.' });
  }
});

router.post('/messages/:id/read', requireAuth(), async (req, res) => {
  try {
    await db.query(
      `UPDATE messages SET read_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND recipient_id = $2 AND read_at IS NULL`,
      [parseInt(req.params.id), req.user.id]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error('[mark-read]', e);
    res.status(500).json({ error: 'Konnte nicht markieren.' });
  }
});

// ───── Generic message-send (works for any role) ─────
router.post('/messages/send', requireAuth(), async (req, res) => {
  try {
    const { recipient_email, subject, body, reply_to_id } = req.body || {};
    if (!body) return res.status(400).json({ error: 'Nachricht darf nicht leer sein.' });

    let recipient_id = null;
    if (recipient_email) {
      const r = await db.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [recipient_email]);
      if (r.rows.length === 0) return res.status(404).json({ error: 'Empfänger nicht gefunden.' });
      recipient_id = r.rows[0].id;
    }

    const result = await db.query(
      `INSERT INTO messages (sender_id, recipient_id, subject, body, reply_to_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
      [req.user.id, recipient_id, subject || '', body, reply_to_id || null]
    );
    res.json({ ok: true, message: result.rows[0] });
  } catch (e) {
    console.error('[messages/send]', e);
    res.status(500).json({ error: 'Senden fehlgeschlagen.' });
  }
});

// ───── 9. LIVE CLASS RACE (polling-based, no websocket) ─────
// Returns top students by XP in a class, with their last-activity timestamp
router.get('/class/:id/race', requireAuth(), async (req, res) => {
  try {
    const classId = parseInt(req.params.id);
    const r = await db.query(
      `SELECT u.id, u.full_name,
              COALESCE(p.total_xp, 0) AS xp,
              COALESCE(p.current_streak, 0) AS streak,
              p.last_active
         FROM class_memberships cm
         JOIN users u ON u.id = cm.student_id
    LEFT JOIN progress p ON p.user_id = u.id
        WHERE cm.class_id = $1 AND u.status = 'active'
        ORDER BY xp DESC LIMIT 30`,
      [classId]
    );

    // Compute a normalised "track position" 0-100 based on max XP in this class
    const maxXp = Math.max(1, ...r.rows.map(s => parseInt(s.xp) || 0));
    const runners = r.rows.map((s, idx) => ({
      id: s.id,
      name: s.full_name || 'Schüler',
      xp: parseInt(s.xp) || 0,
      streak: parseInt(s.streak) || 0,
      position_pct: Math.round((parseInt(s.xp) || 0) / maxXp * 100),
      rank: idx + 1,
      last_active: s.last_active,
    }));
    res.json({ ok: true, data: { runners, max_xp: maxXp } });
  } catch (e) {
    console.error('[race]', e);
    res.status(500).json({ error: 'Rennen konnte nicht geladen werden.' });
  }
});

// ───── 5. PUBLIC SCHOOL SIGNUP (no auth needed) ─────
// Posted from /kontakt page form
router.post('/public/school-signup', async (req, res) => {
  try {
    const { school_name, contact_name, contact_email, city, postal_code, notes } = req.body || {};
    if (!school_name || !contact_email) return res.status(400).json({ error: 'Schul-Name und E-Mail sind Pflicht.' });

    const r = await db.query(
      `INSERT INTO schools (name, city, postal_code, contact_name, contact_email, status, plan, notes)
       VALUES ($1, $2, $3, $4, $5, 'pending', 'free', $6)
       ON CONFLICT (contact_email) DO NOTHING
       RETURNING id`,
      [school_name, city || '', postal_code || '', contact_name || '', contact_email.toLowerCase(), notes || '']
    );
    if (r.rows.length === 0) return res.status(400).json({ error: 'Diese E-Mail wurde bereits für eine Schule registriert.' });
    res.json({ ok: true, school_id: r.rows[0].id });
  } catch (e) {
    console.error('[public school-signup]', e);
    res.status(500).json({ error: 'Registrierung fehlgeschlagen.' });
  }
});

// ============================================================
// v7.3: Email-on-invite, assignment exercise, data export
// ============================================================
const { sendEmail: _sendEmail } = require('../lib/email');

// Send email when a teacher is invited (in addition to showing temp password)
router.post('/school/invite-teacher-with-email', requireAuth('school_admin'), async (req, res) => {
  try {
    const { email, full_name, subject } = req.body || {};
    if (!email) return res.status(400).json({ error: 'E-Mail ist Pflicht.' });

    const tempPw = Math.random().toString(36).slice(2, 10);
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync(tempPw, 10);

    const result = await db.query(
      `INSERT INTO users (school_id, role, email, password_hash, full_name, status)
       VALUES ($1, 'teacher', $2, $3, $4, 'active')
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [req.user.school_id, email.toLowerCase(), hash, full_name || email]
    );
    if (result.rows.length === 0) return res.status(400).json({ error: 'Diese E-Mail existiert bereits.' });

    // Send invitation email
    const base = process.env.BASE_URL || 'http://localhost:3000';
    const emailText = [
      'Hallo ' + (full_name || ''),
      '',
      'Du wurdest zu StudyRace eingeladen.',
      '',
      'Login: ' + base + '/login',
      'E-Mail: ' + email,
      'Temporäres Passwort: ' + tempPw,
      '',
      'Bitte ändere dein Passwort nach dem ersten Login.',
      '',
      '— Schul-Verwaltung'
    ].join('\n');
    const emailResult = await _sendEmail({
      to: email, subject: 'Einladung zu StudyRace', text: emailText
    });

    res.json({ ok: true, email: result.rows[0].email, temp_password: tempPw, email_sent: emailResult.ok, email_mode: emailResult.mode });
  } catch (e) {
    console.error('[invite-teacher-with-email]', e);
    res.status(500).json({ error: 'Einladung fehlgeschlagen.' });
  }
});

// ─── STUDENT: Get task with all its questions for exercise UI ───
router.get('/student/task/:id/exercise', requireAuth('student'), async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    // Get task info + verify student is enrolled in the class
    const task = await db.query(
      `SELECT t.id, t.title, t.description, t.subject, t.due_at, t.class_id, c.name AS class_name
         FROM tasks t
         JOIN classes c ON c.id = t.class_id
         JOIN class_memberships cm ON cm.class_id = c.id
        WHERE t.id = $1 AND cm.student_id = $2`,
      [taskId, req.user.id]
    );
    if (task.rows.length === 0) return res.status(404).json({ error: 'Aufgabe nicht gefunden.' });

    // Get already-submitted status
    const sub = await db.query(
      'SELECT score_pct, xp_earned, submitted_at FROM task_submissions WHERE task_id = $1 AND student_id = $2',
      [taskId, req.user.id]
    );

    // Get questions linked to this task
    const qs = await db.query(
      `SELECT q.id, q.subject, q.topic, q.difficulty, q.question_type, q.question_text, q.options, q.hint, q.xp_reward
         FROM task_questions tq
         JOIN question_bank q ON q.id = tq.question_id
        WHERE tq.task_id = $1
        ORDER BY tq.position`,
      [taskId]
    );

    res.json({
      ok: true,
      data: {
        task: task.rows[0],
        questions: qs.rows,
        previous_submission: sub.rows[0] || null,
      }
    });
  } catch (e) {
    console.error('[task exercise]', e);
    res.status(500).json({ error: 'Aufgabe konnte nicht geladen werden.' });
  }
});

// ─── STUDENT: Submit final task with answers ───
router.post('/student/task/:id/submit-exercise', requireAuth('student'), async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { answers } = req.body || {};
    if (!Array.isArray(answers)) return res.status(400).json({ error: 'answers array fehlt.' });

    // Get task questions to grade
    const qs = await db.query(
      `SELECT q.id, q.correct_answer, q.xp_reward
         FROM task_questions tq
         JOIN question_bank q ON q.id = tq.question_id
        WHERE tq.task_id = $1
        ORDER BY tq.position`,
      [taskId]
    );

    if (qs.rows.length === 0) return res.status(400).json({ error: 'Diese Aufgabe hat keine Fragen.' });

    const normalize = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
    let correct = 0;
    let totalXP = 0;
    const detail = [];
    qs.rows.forEach((q, i) => {
      const userAns = answers[i] && answers[i].answer;
      const isCorrect = normalize(userAns) === normalize(q.correct_answer);
      if (isCorrect) {
        correct++;
        totalXP += q.xp_reward || 10;
      }
      detail.push({ question_id: q.id, correct: isCorrect, correct_answer: q.correct_answer });
    });

    const scorePct = Math.round((correct / qs.rows.length) * 100);

    // Save submission
    await db.query(
      `INSERT INTO task_submissions (task_id, student_id, score_pct, xp_earned, answers)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (task_id, student_id) DO UPDATE
       SET score_pct = $3, xp_earned = $4, answers = $5, submitted_at = CURRENT_TIMESTAMP`,
      [taskId, req.user.id, scorePct, totalXP, JSON.stringify(answers)]
    );

    // Add XP to progress
    if (totalXP > 0) {
      await db.query(
        `INSERT INTO progress (user_id, total_xp, tasks_completed, last_active)
         VALUES ($1, $2, 1, CURRENT_DATE)
         ON CONFLICT (user_id) DO UPDATE
         SET total_xp = progress.total_xp + $2,
             tasks_completed = progress.tasks_completed + 1,
             last_active = CURRENT_DATE`,
        [req.user.id, totalXP]
      );
    }

    res.json({ ok: true, score_pct: scorePct, xp_earned: totalXP, correct, total: qs.rows.length, detail });
  } catch (e) {
    console.error('[task submit-exercise]', e);
    res.status(500).json({ error: 'Abgabe fehlgeschlagen.' });
  }
});

// ─── SCHOOL ADMIN: Data export (DSGVO Auskunftspflicht) ───
router.get('/school/export', requireAuth('school_admin'), async (req, res) => {
  try {
    const schoolId = req.user.school_id;
    const school = await db.query('SELECT * FROM schools WHERE id = $1', [schoolId]);
    const users = await db.query(
      `SELECT id, role, email, full_name, status, created_at
         FROM users WHERE school_id = $1`,
      [schoolId]
    );
    const classes = await db.query(
      `SELECT c.id, c.name, c.subject, c.grade_level, c.invite_code, c.created_at,
              u.full_name AS teacher_name
         FROM classes c
         LEFT JOIN users u ON u.id = c.teacher_id
        WHERE c.school_id = $1`,
      [schoolId]
    );
    const memberships = await db.query(
      `SELECT cm.class_id, cm.student_id, cm.joined_at
         FROM class_memberships cm
         JOIN classes c ON c.id = cm.class_id
        WHERE c.school_id = $1`,
      [schoolId]
    ).catch(() => ({ rows: [] }));

    const tasks = await db.query(
      `SELECT t.id, t.class_id, t.title, t.subject, t.created_at, t.due_at
         FROM tasks t
         JOIN classes c ON c.id = t.class_id
        WHERE c.school_id = $1`,
      [schoolId]
    );

    const exportData = {
      exported_at: new Date().toISOString(),
      exported_by: req.user.email,
      school: school.rows[0] || null,
      users_count: users.rows.length,
      classes_count: classes.rows.length,
      tasks_count: tasks.rows.length,
      users: users.rows,
      classes: classes.rows,
      class_memberships: memberships.rows,
      tasks: tasks.rows,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="studyrace-export-' + new Date().toISOString().split('T')[0] + '.json"');
    res.json(exportData);
  } catch (e) {
    console.error('[school export]', e);
    res.status(500).json({ error: 'Export fehlgeschlagen.' });
  }
});

// ============================================================
// v7.4: Teacher creates student account + bulk invite + analytics + achievements
// ============================================================

// Helper: check & award achievements for a user
async function checkAchievements(userId) {
  try {
    // Get user totals
    const prog = await db.query('SELECT total_xp, current_streak FROM progress WHERE user_id = $1', [userId]);
    const totalXP = prog.rows[0] ? parseInt(prog.rows[0].total_xp) : 0;
    const streak = prog.rows[0] ? parseInt(prog.rows[0].current_streak) : 0;

    const qa = await db.query('SELECT COUNT(*)::int AS c FROM question_attempt WHERE student_id = $1', [userId]);
    const answered = qa.rows[0].c;

    const skills = await db.query(
      `SELECT subject, MAX(skill_level) AS max_level FROM student_skill WHERE student_id = $1 GROUP BY subject`,
      [userId]
    );
    const maxSkill10 = Math.max(0, ...skills.rows.map(s => Math.round(parseFloat(s.max_level) * 10)));
    const distinctSubjects = skills.rows.length;

    const all = await db.query('SELECT id, kind, threshold FROM achievements');
    for (const ach of all.rows) {
      let earned = false;
      if (ach.kind === 'questions' && answered >= ach.threshold) earned = true;
      else if (ach.kind === 'xp' && totalXP >= ach.threshold) earned = true;
      else if (ach.kind === 'streak' && streak >= ach.threshold) earned = true;
      else if (ach.kind === 'skill' && maxSkill10 >= ach.threshold) earned = true;
      else if (ach.kind === 'subjects' && distinctSubjects >= ach.threshold) earned = true;

      if (earned) {
        await db.query(
          'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, ach.id]
        );
      }
    }
  } catch (e) {
    console.error('[checkAchievements]', e);
  }
}

// GET /api/data/student/achievements — for student dashboard
router.get('/student/achievements', requireAuth('student'), async (req, res) => {
  try {
    await checkAchievements(req.user.id);
    const r = await db.query(
      `SELECT a.id, a.title, a.description, a.icon, a.category, a.threshold, a.kind,
              ua.earned_at IS NOT NULL AS earned, ua.earned_at
         FROM achievements a
         LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = $1
         ORDER BY (ua.earned_at IS NULL), a.threshold ASC`,
      [req.user.id]
    );
    res.json({ ok: true, data: { achievements: r.rows } });
  } catch (e) {
    console.error('[achievements]', e);
    res.status(500).json({ error: 'Achievements konnten nicht geladen werden.' });
  }
});

// POST /api/data/teacher/create-student — Teacher creates a single student account
router.post('/teacher/create-student', requireAuth('teacher'), async (req, res) => {
  try {
    const { email, full_name, class_id } = req.body || {};
    if (!email) return res.status(400).json({ error: 'E-Mail ist Pflicht.' });

    const bcrypt = require('bcryptjs');
    const tempPw = Math.random().toString(36).slice(2, 10);
    const hash = bcrypt.hashSync(tempPw, 10);

    const insertedUser = await db.query(
      `INSERT INTO users (school_id, role, email, password_hash, full_name, status)
       VALUES ($1, 'student', $2, $3, $4, 'active')
       ON CONFLICT (email) DO NOTHING
       RETURNING id, email`,
      [req.user.school_id, email.toLowerCase(), hash, full_name || email]
    );
    if (insertedUser.rows.length === 0) {
      return res.status(400).json({ error: 'Diese E-Mail existiert bereits.' });
    }
    const studentId = insertedUser.rows[0].id;

    // Optionally add to class
    if (class_id) {
      const own = await db.query('SELECT id FROM classes WHERE id = $1 AND teacher_id = $2', [class_id, req.user.id]);
      if (own.rows.length > 0) {
        await db.query(
          'INSERT INTO class_memberships (class_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [class_id, studentId]
        );
      }
    }

    // Send invitation email (logs if no SMTP)
    try {
      const { sendEmail } = require('../lib/email');
      const base = process.env.BASE_URL || 'http://localhost:3000';
      await sendEmail({
        to: email,
        subject: 'Einladung zu StudyRace',
        text: [
          'Hallo ' + (full_name || ''),
          '',
          'Deine Lehrkraft hat einen Account für dich angelegt.',
          '',
          'Login: ' + base + '/login',
          'E-Mail: ' + email,
          'Temporäres Passwort: ' + tempPw,
          '',
          'Bitte ändere dein Passwort nach dem ersten Login.'
        ].join('\n')
      });
    } catch (e) { /* email fail is non-fatal */ }

    res.json({ ok: true, email: insertedUser.rows[0].email, temp_password: tempPw });
  } catch (e) {
    console.error('[create-student]', e);
    res.status(500).json({ error: 'Schüler-Account konnte nicht angelegt werden.' });
  }
});

// POST /api/data/teacher/bulk-invite — Teacher pastes multiple emails at once
router.post('/teacher/bulk-invite', requireAuth('teacher'), async (req, res) => {
  try {
    const { emails, class_id } = req.body || {};
    if (!emails) return res.status(400).json({ error: 'Keine E-Mails angegeben.' });

    const list = String(emails)
      .split(/[\s,;\n]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));

    if (list.length === 0) return res.status(400).json({ error: 'Keine gültigen E-Mails gefunden.' });

    const bcrypt = require('bcryptjs');
    const results = [];
    for (const email of list) {
      const tempPw = Math.random().toString(36).slice(2, 10);
      const hash = bcrypt.hashSync(tempPw, 10);
      const ins = await db.query(
        `INSERT INTO users (school_id, role, email, password_hash, full_name, status)
         VALUES ($1, 'student', $2, $3, $4, 'active')
         ON CONFLICT (email) DO NOTHING
         RETURNING id, email`,
        [req.user.school_id, email, hash, email.split('@')[0]]
      );
      if (ins.rows.length === 0) {
        results.push({ email, status: 'existed' });
        continue;
      }
      const studentId = ins.rows[0].id;

      if (class_id) {
        const own = await db.query('SELECT id FROM classes WHERE id = $1 AND teacher_id = $2', [class_id, req.user.id]);
        if (own.rows.length > 0) {
          await db.query(
            'INSERT INTO class_memberships (class_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [class_id, studentId]
          );
        }
      }

      results.push({ email, status: 'invited', temp_password: tempPw });
    }
    res.json({ ok: true, results, total: list.length, invited: results.filter(r => r.status === 'invited').length });
  } catch (e) {
    console.error('[bulk-invite]', e);
    res.status(500).json({ error: 'Bulk-Einladung fehlgeschlagen.' });
  }
});

// GET /api/data/teacher/student/:id/progress — Teacher views student analytics
router.get('/teacher/student/:id/progress', requireAuth('teacher'), async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    // Verify teacher has this student in one of their classes
    const check = await db.query(
      `SELECT 1 FROM class_memberships cm
         JOIN classes c ON c.id = cm.class_id
        WHERE cm.student_id = $1 AND c.teacher_id = $2
        LIMIT 1`,
      [studentId, req.user.id]
    );
    if (check.rows.length === 0) return res.status(403).json({ error: 'Kein Zugriff auf diesen Schüler.' });

    const user = await db.query('SELECT id, email, full_name FROM users WHERE id = $1', [studentId]);
    const progress = await db.query('SELECT total_xp, current_streak, tasks_completed FROM progress WHERE user_id = $1', [studentId]);
    const skills = await db.query(
      `SELECT subject, topic, skill_level, answered, correct, last_practiced
         FROM student_skill WHERE student_id = $1
         ORDER BY subject, topic`,
      [studentId]
    );
    const totalAnswered = await db.query('SELECT COUNT(*)::int AS c, SUM(CASE WHEN was_correct THEN 1 ELSE 0 END)::int AS correct FROM question_attempt WHERE student_id = $1', [studentId]);

    // Per-subject summary
    const bySubject = {};
    skills.rows.forEach(s => {
      if (!bySubject[s.subject]) bySubject[s.subject] = { subject: s.subject, avg_skill: 0, topics: [], answered: 0, correct: 0 };
      bySubject[s.subject].topics.push({
        topic: s.topic, skill: parseFloat(s.skill_level),
        answered: parseInt(s.answered) || 0, correct: parseInt(s.correct) || 0,
        last_practiced: s.last_practiced
      });
      bySubject[s.subject].answered += parseInt(s.answered) || 0;
      bySubject[s.subject].correct += parseInt(s.correct) || 0;
    });
    Object.values(bySubject).forEach(sub => {
      const levels = sub.topics.map(t => t.skill);
      sub.avg_skill = levels.length ? (levels.reduce((a,b) => a+b, 0) / levels.length).toFixed(1) : '0.0';
    });

    res.json({
      ok: true,
      data: {
        user: user.rows[0],
        progress: progress.rows[0] || { total_xp: 0, current_streak: 0, tasks_completed: 0 },
        total_answered: totalAnswered.rows[0].c,
        total_correct: totalAnswered.rows[0].correct || 0,
        by_subject: Object.values(bySubject),
      }
    });
  } catch (e) {
    console.error('[student progress]', e);
    res.status(500).json({ error: 'Fortschritt konnte nicht geladen werden.' });
  }
});

// GET /api/data/teacher/class/:id/students — Students of a class with quick stats
router.get('/teacher/class/:id/students', requireAuth('teacher'), async (req, res) => {
  try {
    const classId = parseInt(req.params.id);
    const own = await db.query('SELECT id FROM classes WHERE id = $1 AND teacher_id = $2', [classId, req.user.id]);
    if (own.rows.length === 0) return res.status(403).json({ error: 'Nicht erlaubt.' });

    const r = await db.query(
      `SELECT u.id, u.full_name, u.email,
              COALESCE(p.total_xp, 0) AS xp,
              COALESCE(p.current_streak, 0) AS streak
         FROM class_memberships cm
         JOIN users u ON u.id = cm.student_id
    LEFT JOIN progress p ON p.user_id = u.id
        WHERE cm.class_id = $1 AND u.status = 'active'
        ORDER BY xp DESC`,
      [classId]
    );
    res.json({ ok: true, data: { students: r.rows } });
  } catch (e) {
    console.error('[class students]', e);
    res.status(500).json({ error: 'Schüler-Liste konnte nicht geladen werden.' });
  }
});

// ============================================================
// v7.7: Real PDF report generation for school admins
// ============================================================
router.get('/school/report-pdf', requireAuth('school_admin'), async (req, res) => {
  try {
    const PDFDocument = require('pdfkit');
    const schoolId = req.user.school_id;

    // Gather real data
    const school = await db.query('SELECT * FROM schools WHERE id = $1', [schoolId]);
    const sch = school.rows[0] || { name: 'Schule' };

    const counts = await db.query(
      `SELECT
         (SELECT COUNT(*) FROM users WHERE school_id=$1 AND role='teacher') AS teachers,
         (SELECT COUNT(*) FROM users WHERE school_id=$1 AND role='student') AS students,
         (SELECT COUNT(*) FROM classes WHERE school_id=$1) AS classes`,
      [schoolId]
    );
    const c = counts.rows[0] || { teachers: 0, students: 0, classes: 0 };

    // Per-class summary
    const classes = await db.query(
      `SELECT cl.name, cl.subject, u.full_name AS teacher_name,
              COUNT(cm.student_id) AS student_count
         FROM classes cl
         LEFT JOIN users u ON u.id = cl.teacher_id
         LEFT JOIN class_memberships cm ON cm.class_id = cl.id
        WHERE cl.school_id = $1
        GROUP BY cl.id, u.full_name
        ORDER BY cl.name`,
      [schoolId]
    );

    // Accuracy across school
    const acc = await db.query(
      `SELECT COALESCE(AVG(ss.correct::numeric / NULLIF(ss.answered,0)) * 100, 0)::int AS acc,
              COALESCE(SUM(ss.answered), 0)::int AS total_answered
         FROM student_skill ss
        WHERE ss.student_id IN (SELECT id FROM users WHERE school_id = $1 AND role='student')`,
      [schoolId]
    );
    const accuracy = acc.rows[0] || { acc: 0, total_answered: 0 };

    // Build PDF
    const doc = new PDFDocument({ size: 'A4', margin: 56 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition',
      'attachment; filename="studyrace-bericht-' + new Date().toISOString().split('T')[0] + '.pdf"');
    doc.pipe(res);

    const EMERALD = '#1B6B45';
    const INK = '#1C1F1A';
    const MUTE = '#7A8077';

    // Header
    doc.fillColor(EMERALD).fontSize(26).font('Helvetica-Bold').text('StudyRace');
    doc.fillColor(MUTE).fontSize(10).font('Helvetica').text('Schul-Aktivitätsbericht');
    doc.moveDown(1.5);

    // School + date
    doc.fillColor(INK).fontSize(18).font('Helvetica-Bold').text(sch.name || 'Schule');
    doc.fillColor(MUTE).fontSize(10).font('Helvetica')
      .text((sch.city || '') + (sch.postal_code ? ' · ' + sch.postal_code : ''));
    doc.text('Erstellt am ' + new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }));
    doc.moveDown(1.5);

    // Divider
    doc.strokeColor('#D6CAB0').lineWidth(1)
      .moveTo(56, doc.y).lineTo(539, doc.y).stroke();
    doc.moveDown(1);

    // Key figures
    doc.fillColor(INK).fontSize(13).font('Helvetica-Bold').text('Überblick');
    doc.moveDown(0.5);
    const figures = [
      ['Lehrkräfte', String(c.teachers)],
      ['Schüler:innen', String(c.students)],
      ['Klassen', String(c.classes)],
      ['Beantwortete Fragen (gesamt)', String(accuracy.total_answered)],
      ['Durchschnittliche Genauigkeit', accuracy.acc + ' %'],
    ];
    doc.fontSize(11).font('Helvetica');
    figures.forEach(([label, val]) => {
      const y = doc.y;
      doc.fillColor(MUTE).text(label, 56, y);
      doc.fillColor(INK).font('Helvetica-Bold').text(val, 400, y, { align: 'right', width: 139 });
      doc.font('Helvetica');
      doc.moveDown(0.4);
    });
    doc.moveDown(1);

    // Class breakdown
    doc.fillColor(INK).fontSize(13).font('Helvetica-Bold').text('Klassen im Detail');
    doc.moveDown(0.5);
    if (classes.rows.length === 0) {
      doc.fillColor(MUTE).fontSize(10).font('Helvetica').text('Noch keine Klassen angelegt.');
    } else {
      // table header
      const cols = [56, 200, 340, 470];
      doc.fontSize(9).fillColor(MUTE).font('Helvetica-Bold');
      doc.text('Klasse', cols[0], doc.y, { continued: false });
      const hy = doc.y - 11;
      doc.text('Fach', cols[1], hy);
      doc.text('Lehrkraft', cols[2], hy);
      doc.text('Schüler', cols[3], hy);
      doc.moveDown(0.3);
      doc.strokeColor('#E8DFCE').lineWidth(0.5).moveTo(56, doc.y).lineTo(539, doc.y).stroke();
      doc.moveDown(0.3);
      doc.font('Helvetica').fontSize(10).fillColor(INK);
      classes.rows.forEach(cl => {
        const ry = doc.y;
        doc.text((cl.name || '—').substring(0, 22), cols[0], ry);
        doc.text((cl.subject || '—').substring(0, 20), cols[1], ry);
        doc.text((cl.teacher_name || '—').substring(0, 20), cols[2], ry);
        doc.text(String(cl.student_count || 0), cols[3], ry);
        doc.moveDown(0.5);
      });
    }
    doc.moveDown(2);

    // Footer note
    doc.fillColor(MUTE).fontSize(8).font('Helvetica')
      .text('Dieser Bericht wurde automatisch von StudyRace erstellt. '
        + 'Alle Daten werden DSGVO-konform in Deutschland verarbeitet.', 56, 760, { width: 483 });

    doc.end();
  } catch (e) {
    console.error('[report-pdf]', e);
    if (!res.headersSent) res.status(500).json({ error: 'PDF konnte nicht erstellt werden.' });
  }
});
