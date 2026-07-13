-- Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
-- ============================================================
-- Achievements v2 — additional badges across categories
-- ============================================================

INSERT INTO achievements (id, title, description, icon, category, threshold, kind) VALUES
  -- XP milestones
  ('xp_2500',          'XP-Sammler',         'Erreiche 2500 XP',                          'C', 'xp',       2500,  'xp'),
  ('xp_5000',          'XP-König',           'Erreiche 5000 XP',                          'K', 'xp',       5000,  'xp'),
  ('xp_10000',         'XP-Legende',         'Erreiche 10.000 XP',                        'L', 'xp',       10000, 'xp'),

  -- Streaks
  ('streak_14',        'Zwei-Wochen-Streak', 'Lerne 14 Tage in Folge',                    '14', 'streak',   14,    'streak'),
  ('streak_30',        'Monats-Streak',      'Lerne 30 Tage in Folge',                    '30', 'streak',   30,    'streak'),
  ('streak_100',       'Hundert-Tage-Streak','Lerne 100 Tage in Folge — Wahnsinn!',       '100','streak',  100,   'streak'),

  -- Question counts
  ('hundred_questions','Aufgaben-Killer',    'Beantworte 100 Fragen',                     'H', 'practice', 100,   'questions'),
  ('five_hundred_q',   'Lern-Maschine',      'Beantworte 500 Fragen',                     '5', 'practice', 500,   'questions'),

  -- Accuracy
  ('perfect_10',       'Volltreffer',        '10 Fragen in Folge richtig',                'T', 'accuracy', 10,    'streak_correct'),
  ('perfect_25',       'Präzisions-Profi',   '25 Fragen in Folge richtig',                'P', 'accuracy', 25,    'streak_correct'),

  -- Subject mastery
  ('math_master',      'Mathe-Meister',      'Erreiche Skill-Level 4.0 in Mathematik',    'M', 'skill',    40,    'skill_math'),
  ('german_master',    'Deutsch-Profi',      'Erreiche Skill-Level 4.0 in Deutsch',       'D', 'skill',    40,    'skill_german'),
  ('english_master',   'English Expert',     'Erreiche Skill-Level 4.0 in Englisch',      'E', 'skill',    40,    'skill_english'),
  ('science_master',   'Naturwissenschaftler','Skill 4.0 in Physik, Chemie ODER Biologie','N', 'skill',    40,    'skill_science'),
  ('history_buff',     'Geschichts-Kenner',  'Erreiche Skill-Level 4.0 in Geschichte',    'G', 'skill',    40,    'skill_history'),

  -- Engagement / time-based
  ('early_bird',       'Frühaufsteher',      'Lerne vor 8 Uhr morgens',                   'F', 'time',     1,     'morning_practice'),
  ('night_owl',        'Nachtschwärmer',     'Lerne nach 22 Uhr',                         'N', 'time',     1,     'night_practice'),
  ('weekend_warrior',  'Wochenend-Lerner',   'Lerne am Wochenende',                       'W', 'time',     1,     'weekend_practice'),

  -- Social / class
  ('classroom_helper', 'Klassen-Helfer',     'Beantworte 5 Nachrichten von Klassen­kameraden','H', 'social',5, 'messages'),
  ('homework_hero',    'Hausaufgaben-Held',  'Erledige 10 Hausaufgaben pünktlich',        'H', 'school',  10,   'homework'),
  ('class_winner',     'Klassen-Sieger',     'Beende eine Woche als XP-Spitzenreiter in deiner Klasse','W','class',1,'class_leader'),

  -- Specific milestones
  ('first_perfect',    'Erste 100 %',        'Erreiche 100 % in einer Übung',             '%', 'accuracy', 1,     'perfect_session'),
  ('comeback_kid',     'Comeback',           'Beantworte eine Frage richtig, nachdem du sie zuvor falsch hattest', 'C', 'practice', 1, 'redemption'),
  ('explorer',         'Entdecker',          'Übe in 5 verschiedenen Fächern',            'X', 'practice', 5,     'subjects_5'),
  ('all_8_subjects',   'Universalgelehrt',   'Übe in allen 8 Fächern',                    'U', 'practice', 8,     'subjects_all')

ON CONFLICT (id) DO NOTHING;
