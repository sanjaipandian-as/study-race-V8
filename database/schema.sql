-- Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
-- ════════════════════════════════════════════════════════
-- StudyRace Database Schema (PostgreSQL)
-- 4-tier pricing: Free (1 class, 4 weeks) / Klein / Mittel / Groß
-- Auth flow: School registers → Super-admin approves →
--           School-admin invites teachers → Teachers create
--           classes w/ invite codes → Students join with code
-- ════════════════════════════════════════════════════════

-- ───────── SCHOOLS ─────────
CREATE TABLE IF NOT EXISTS schools (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  city         VARCHAR(100),
  postal_code  VARCHAR(20),
  contact_name VARCHAR(100),
  contact_email VARCHAR(200) UNIQUE NOT NULL,
  status       VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- pending | approved | rejected | suspended
  plan         VARCHAR(20) NOT NULL DEFAULT 'free',
    -- free | klein | mittel | gross
  trial_ends_at TIMESTAMP,
  rejection_reason TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at  TIMESTAMP,
  approved_by  INTEGER
);

CREATE INDEX IF NOT EXISTS idx_schools_status ON schools(status);
CREATE INDEX IF NOT EXISTS idx_schools_email ON schools(contact_email);

-- ───────── USERS (all 4 roles) ─────────
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  school_id    INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  role         VARCHAR(20) NOT NULL,
    -- super_admin | school_admin | teacher | student
  email        VARCHAR(200) UNIQUE,    -- NULL allowed for students who used invite code only
  password_hash VARCHAR(200),          -- NULL allowed for invite-pending users
  full_name    VARCHAR(150) NOT NULL,
  grade_level  VARCHAR(10),            -- e.g. "8B" — students only
  status       VARCHAR(20) NOT NULL DEFAULT 'active',
    -- active | invited | suspended
  invite_token VARCHAR(80),            -- email-link token if invited by email
  last_login   TIMESTAMP,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_school ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_invite_token ON users(invite_token);

-- ───────── CLASSES ─────────
CREATE TABLE IF NOT EXISTS classes (
  id          SERIAL PRIMARY KEY,
  school_id   INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name        VARCHAR(100) NOT NULL,        -- "Klasse 8B"
  subject     VARCHAR(50),                  -- Mathematik / Physik / Chemie / Biologie
  invite_code VARCHAR(12) UNIQUE NOT NULL,  -- short code students enter
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_invite ON classes(invite_code);

-- ───────── CLASS MEMBERSHIP (students-in-classes, many-to-many) ─────────
CREATE TABLE IF NOT EXISTS class_memberships (
  id         SERIAL PRIMARY KEY,
  class_id   INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  joined_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (class_id, student_id)
);

-- ───────── TASKS (teachers assign, students do) ─────────
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  class_id    INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  subject     VARCHAR(50),
  difficulty  INTEGER DEFAULT 3,           -- 1..5
  due_at      TIMESTAMP,
  tools_allowed JSONB DEFAULT '[]'::jsonb, -- ["calculator","formulas"]
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ───────── PROGRESS / RACE POSITIONS ─────────
CREATE TABLE IF NOT EXISTS progress (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  total_xp   INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  focus_minutes INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  last_active DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ───────── AUDIT LOG (super-admin actions) ─────────
CREATE TABLE IF NOT EXISTS audit_log (
  id         SERIAL PRIMARY KEY,
  actor_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action     VARCHAR(80) NOT NULL,       -- school_approved / user_suspended / ...
  target_type VARCHAR(40),               -- school / user / class
  target_id  INTEGER,
  metadata   JSONB,
  ip_address VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- ───────── SEED: super-admin (you) ─────────
-- Default password is 'changeme123' (verified bcrypt hash, rounds=10).
-- ⚠ WICHTIG: Sofort nach erstem Login ändern!
INSERT INTO users (school_id, role, email, password_hash, full_name, status)
VALUES (
  NULL,
  'super_admin',
  'admin@studyrace.de',
  '$2b$10$BX0VLgxpTFUMxB29GWqBN.W/Q4EA9QG39hGXWHyYaLQOlcx.6KqmC',
  'Plattform-Verwaltung',
  'active'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- v7 ADDITIONS: messages, announcements, submissions, materials
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  sender_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  class_id    INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  subject     VARCHAR(200),
  body        TEXT NOT NULL,
  read_at     TIMESTAMP,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender    ON messages(sender_id);

CREATE TABLE IF NOT EXISTS announcements (
  id          SERIAL PRIMARY KEY,
  school_id   INTEGER REFERENCES schools(id) ON DELETE CASCADE,
  class_id    INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  author_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  audience    VARCHAR(50) DEFAULT 'class',  -- 'class', 'school', 'all'
  title       VARCHAR(200) NOT NULL,
  body        TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_announcements_school ON announcements(school_id);
CREATE INDEX IF NOT EXISTS idx_announcements_class  ON announcements(class_id);

CREATE TABLE IF NOT EXISTS task_submissions (
  id          SERIAL PRIMARY KEY,
  task_id     INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  student_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score_pct   INTEGER,
  xp_earned   INTEGER DEFAULT 0,
  answers     JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (task_id, student_id)
);

CREATE TABLE IF NOT EXISTS materials (
  id          SERIAL PRIMARY KEY,
  class_id    INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  url         VARCHAR(500),
  material_type VARCHAR(50) DEFAULT 'link',  -- 'link', 'pdf', 'video'
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_materials_class ON materials(class_id);

-- ============================================================
-- v7.1 ADAPTIVE ENGINE: question bank, skill tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS question_bank (
  id SERIAL PRIMARY KEY,
  subject       VARCHAR(50)  NOT NULL,
  topic         VARCHAR(100) NOT NULL,
  grade_level   VARCHAR(10),
  difficulty    INTEGER DEFAULT 2,         -- 1-5
  question_type VARCHAR(20) DEFAULT 'multiple_choice', -- 'multiple_choice' | 'text_input'
  question_text TEXT NOT NULL,
  options       JSONB,                     -- array of strings for MC
  correct_answer TEXT NOT NULL,
  hint          TEXT,
  explanation   TEXT,
  xp_reward     INTEGER DEFAULT 10
);

CREATE INDEX IF NOT EXISTS idx_qb_subject ON question_bank(subject);
CREATE INDEX IF NOT EXISTS idx_qb_difficulty ON question_bank(difficulty);

CREATE TABLE IF NOT EXISTS student_skill (
  id SERIAL PRIMARY KEY,
  student_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
  subject     VARCHAR(50),
  topic       VARCHAR(100),
  skill_level NUMERIC(3,1) DEFAULT 2.0,   -- 1.0 - 5.0
  answered    INTEGER DEFAULT 0,
  correct     INTEGER DEFAULT 0,
  last_practiced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (student_id, subject, topic)
);

CREATE TABLE IF NOT EXISTS question_attempt (
  id SERIAL PRIMARY KEY,
  student_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  question_id   INTEGER REFERENCES question_bank(id) ON DELETE CASCADE,
  was_correct   BOOLEAN,
  answer_given  TEXT,
  attempted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_qa_student ON question_attempt(student_id);

-- ============================================================
-- v7.2: assignment ↔ question links, password reset tokens
-- ============================================================

-- Link a task to questions from the bank (teacher picks topics)
CREATE TABLE IF NOT EXISTS task_questions (
  id SERIAL PRIMARY KEY,
  task_id     INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES question_bank(id) ON DELETE CASCADE,
  position    INTEGER DEFAULT 0,
  UNIQUE (task_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_taskq_task ON task_questions(task_id);

-- Add topic + question_count to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS topic VARCHAR(100);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS question_count INTEGER DEFAULT 5;

-- ============================================================
-- v7.2: Task-question link, message read tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS task_questions (
  id SERIAL PRIMARY KEY,
  task_id     INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
  position    INTEGER DEFAULT 0,
  UNIQUE (task_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_tq_task ON task_questions(task_id);

-- For nicer message threading (kept simple)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_id INTEGER REFERENCES messages(id);

-- ============================================================
-- v7.3: password reset tokens, notification log
-- ============================================================

CREATE TABLE IF NOT EXISTS password_reset_token (
  id SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at    TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prt_token ON password_reset_token(token);
CREATE INDEX IF NOT EXISTS idx_prt_user ON password_reset_token(user_id);

-- ============================================================
-- v7.3: Password reset tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(128) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pwreset_token ON password_resets(token);

-- ============================================================
-- v7.4: Achievements
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
  id            VARCHAR(50) PRIMARY KEY,
  title         VARCHAR(100) NOT NULL,
  description   TEXT,
  icon          VARCHAR(10) DEFAULT 'S',
  category      VARCHAR(50),
  threshold     INTEGER,
  kind          VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_ach ON user_achievements(user_id);
