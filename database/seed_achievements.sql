-- Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
-- ============================================================
-- Achievements seed
-- ============================================================

INSERT INTO achievements (id, title, description, icon, category, threshold, kind) VALUES
  ('first_question', 'Erste Schritte',      'Beantworte deine erste Frage',            'S', 'start',    1,    'questions'),
  ('ten_questions',  'Aufwärmphase',        'Beantworte 10 Fragen',                    'W', 'practice', 10,   'questions'),
  ('fifty_questions','Quizmeister',         'Beantworte 50 Fragen',                    'Q', 'practice', 50,   'questions'),
  ('xp_100',         'Schnellstarter',      'Erreiche 100 XP',                         'F', 'xp',       100,  'xp'),
  ('xp_500',         'Aufsteiger',          'Erreiche 500 XP',                         'A', 'xp',       500,  'xp'),
  ('xp_1000',        'Marathonläufer',      'Erreiche 1000 XP',                        'M', 'xp',       1000, 'xp'),
  ('streak_3',       'Drei-Tage-Streak',    'Lerne 3 Tage in Folge',                   '3', 'streak',   3,    'streak'),
  ('streak_7',       'Wochen-Streak',       'Lerne 7 Tage in Folge',                   '7', 'streak',   7,    'streak'),
  ('skill_4',        'Profi-Level',         'Erreiche Skill-Level 4.0 in einem Fach',  'P', 'skill',    40,   'skill'),
  ('all_subjects',   'Allround-Talent',     'Übe in allen 4 Fächern',                  'X', 'practice', 4,    'subjects')
ON CONFLICT (id) DO NOTHING;
