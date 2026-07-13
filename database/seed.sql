-- Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
-- ════════════════════════════════════════════════════════
-- StudyRace — Test-Seeding (für Demo & Tests)
--
-- Erstellt 4 Test-Logins, einen pro Rolle.
-- Alle haben das Passwort: test1234
--
--   admin@studyrace.de       Super-Admin
--   schule@studyrace.de      Schul-Admin
--   lehrer@studyrace.de      Lehrkraft
--   schueler@studyrace.de    Schüler:in
--
-- ⚠ WICHTIG: Diese Passwörter sind nur für Demo / Tests gedacht.
-- Vor Live-Betrieb über das Dashboard ändern!
--
-- bcryptjs-Hash für "test1234":
-- $2a$10$Do11W.2mENVBdwa/lGkvnuM33YBst/uBinnLS.cV4XrjrZa4lSdC2
-- ════════════════════════════════════════════════════════

-- ───────── 1. Super-Admin (Test-Passwort) ─────────
-- Wir setzen den Super-Admin auf "test1234" zurück, damit ALLE 4 Logins
-- das gleiche Passwort haben. Der Account existiert bereits aus schema.sql.
UPDATE users
SET password_hash = '$2a$10$Do11W.2mENVBdwa/lGkvnuM33YBst/uBinnLS.cV4XrjrZa4lSdC2'
WHERE email = 'admin@studyrace.de';

-- Falls schema.sql noch nicht gelaufen ist, erzeugen wir ihn auch hier
INSERT INTO users (school_id, role, email, password_hash, full_name, status)
VALUES (
  NULL,
  'super_admin',
  'admin@studyrace.de',
  '$2a$10$Do11W.2mENVBdwa/lGkvnuM33YBst/uBinnLS.cV4XrjrZa4lSdC2',
  'Plattform-Verwaltung',
  'active'
)
ON CONFLICT (email) DO NOTHING;


-- ───────── 2. Test-Schule (für Schul-Admin / Lehrer / Schüler) ─────────
INSERT INTO schools (name, city, postal_code, contact_name, contact_email, status, plan, trial_ends_at, approved_at)
VALUES (
  'Demo-Gymnasium Mainz',
  'Mainz',
  '55116',
  'Dr. Anna Becker',
  'schule@studyrace.de',
  'approved',
  'mittel',
  CURRENT_TIMESTAMP + INTERVAL '90 days',
  CURRENT_TIMESTAMP
)
ON CONFLICT (contact_email) DO NOTHING;


-- ───────── 3. Schul-Admin ─────────
INSERT INTO users (school_id, role, email, password_hash, full_name, status)
SELECT
  s.id,
  'school_admin',
  'schule@studyrace.de',
  '$2a$10$Do11W.2mENVBdwa/lGkvnuM33YBst/uBinnLS.cV4XrjrZa4lSdC2',
  'Dr. Anna Becker',
  'active'
FROM schools s
WHERE s.contact_email = 'schule@studyrace.de'
ON CONFLICT (email) DO NOTHING;


-- ───────── 4. Lehrkraft ─────────
INSERT INTO users (school_id, role, email, password_hash, full_name, status)
SELECT
  s.id,
  'teacher',
  'lehrer@studyrace.de',
  '$2a$10$Do11W.2mENVBdwa/lGkvnuM33YBst/uBinnLS.cV4XrjrZa4lSdC2',
  'Hr. Markus Schmidt',
  'active'
FROM schools s
WHERE s.contact_email = 'schule@studyrace.de'
ON CONFLICT (email) DO NOTHING;


-- ───────── 5. Test-Klasse für die Lehrkraft ─────────
INSERT INTO classes (school_id, teacher_id, name, subject, invite_code)
SELECT
  s.id,
  u.id,
  'Klasse 8B',
  'Mathematik',
  'DEMO8B2026'
FROM schools s, users u
WHERE s.contact_email = 'schule@studyrace.de'
  AND u.email = 'lehrer@studyrace.de'
ON CONFLICT (invite_code) DO NOTHING;


-- ───────── 6. Schüler:in ─────────
INSERT INTO users (school_id, role, email, password_hash, full_name, grade_level, status)
SELECT
  s.id,
  'student',
  'schueler@studyrace.de',
  '$2a$10$Do11W.2mENVBdwa/lGkvnuM33YBst/uBinnLS.cV4XrjrZa4lSdC2',
  'Lena Müller',
  '8B',
  'active'
FROM schools s
WHERE s.contact_email = 'schule@studyrace.de'
ON CONFLICT (email) DO NOTHING;


-- ───────── 7. Schüler:in in Klasse einschreiben ─────────
INSERT INTO class_memberships (class_id, student_id)
SELECT c.id, u.id
FROM classes c, users u
WHERE c.invite_code = 'DEMO8B2026'
  AND u.email = 'schueler@studyrace.de'
ON CONFLICT (class_id, student_id) DO NOTHING;


-- ───────── 8. Etwas XP für die Schülerin (damit das Dashboard nicht leer ist) ─────────
INSERT INTO progress (user_id, total_xp, streak_days, focus_minutes, tasks_completed, last_active)
SELECT u.id, 740, 5, 90, 12, CURRENT_DATE
FROM users u
WHERE u.email = 'schueler@studyrace.de'
ON CONFLICT (user_id) DO NOTHING;


-- ───────── 9. Eine Beispiel-Aufgabe ─────────
INSERT INTO tasks (class_id, teacher_id, title, description, subject, difficulty, due_at, tools_allowed)
SELECT
  c.id,
  c.teacher_id,
  'Quadratische Gleichungen',
  '6 Aufgaben zur Lösung quadratischer Gleichungen mit der pq-Formel.',
  'Mathematik',
  3,
  CURRENT_TIMESTAMP + INTERVAL '7 days',
  '["calculator", "formulas"]'::jsonb
FROM classes c
WHERE c.invite_code = 'DEMO8B2026'
ON CONFLICT DO NOTHING;

-- ============================================================
-- v7 ADDITIONAL DEMO DATA: messages, announcements, materials
-- ============================================================

-- Sample announcement to the class
INSERT INTO announcements (school_id, class_id, author_id, audience, title, body)
SELECT
  s.id, c.id, t.id, 'class',
  'Klausur am Freitag',
  'Liebe Klasse, am Freitag schreiben wir die Mathearbeit. Bitte bereitet die Aufgaben aus dem letzten Kapitel vor.'
FROM schools s, classes c, users t
WHERE s.contact_email = 'schule@studyrace.de'
  AND c.invite_code = 'DEMO8B2026'
  AND t.email = 'lehrer@studyrace.de'
ON CONFLICT DO NOTHING;

-- Sample message: teacher -> student
INSERT INTO messages (sender_id, recipient_id, subject, body)
SELECT
  t.id, u.id,
  'Gut gemacht!',
  'Hi Lena, super Leistung in der letzten Aufgabe. Weiter so!'
FROM users t, users u
WHERE t.email = 'lehrer@studyrace.de'
  AND u.email = 'schueler@studyrace.de'
ON CONFLICT DO NOTHING;

-- Sample material
INSERT INTO materials (class_id, teacher_id, title, description, url, material_type)
SELECT
  c.id, t.id,
  'Übungsblatt: Quadratische Gleichungen',
  'PDF mit 12 Übungsaufgaben zur Vorbereitung auf die Klausur.',
  'https://example.com/uebungsblatt-quadratisch.pdf',
  'pdf'
FROM classes c, users t
WHERE c.invite_code = 'DEMO8B2026'
  AND t.email = 'lehrer@studyrace.de'
ON CONFLICT DO NOTHING;
