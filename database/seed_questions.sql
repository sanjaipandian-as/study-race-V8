-- Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
-- ============================================================
-- StudyRace - Question Bank Seed Data
-- 48 questions: 12 each in Math, Physik, Chemie, Biologie
-- Klassen 7-10, lehrplan-konform
-- ============================================================

-- ───── MATHEMATIK (12) ─────
INSERT INTO question_bank (subject, topic, grade_level, difficulty, question_type, question_text, options, correct_answer, hint, explanation) VALUES
('Mathematik', 'Lineare Gleichungen', '7', 2, 'text_input',
 'Löse: 3x + 5 = 14. Was ist x?', NULL, '3',
 'Subtrahiere 5 auf beiden Seiten, dann teile durch 3.',
 '3x + 5 = 14 → 3x = 9 → x = 3'),

('Mathematik', 'Lineare Gleichungen', '7', 1, 'multiple_choice',
 'Wenn 2x = 10 ist, was ist x?', '["x = 5","x = 8","x = 12","x = 20"]', 'x = 5',
 'Teile beide Seiten durch 2.', '10 / 2 = 5'),

('Mathematik', 'Bruchrechnen', '6', 2, 'multiple_choice',
 'Was ist 1/2 + 1/4?', '["1/6","2/6","3/4","1/3"]', '3/4',
 'Mache den Nenner gleich.', '1/2 = 2/4. Also 2/4 + 1/4 = 3/4.'),

('Mathematik', 'Bruchrechnen', '6', 2, 'text_input',
 'Was ist 2/3 von 9?', NULL, '6',
 '9 durch 3 teilen, dann mit 2 multiplizieren.', '9/3 = 3. 3 · 2 = 6.'),

('Mathematik', 'Prozent', '7', 2, 'text_input',
 'Was sind 20 % von 80?', NULL, '16',
 '20% = 0,2. Multipliziere.', '0,2 · 80 = 16'),

('Mathematik', 'Prozent', '7', 1, 'multiple_choice',
 'Was ist 25 % als Bruch?', '["1/2","1/3","1/4","1/5"]', '1/4',
 '25/100 kürzen.', '25/100 = 1/4'),

('Mathematik', 'Quadratische Gleichungen', '9', 4, 'text_input',
 'Was ist eine positive Lösung von x² = 25?', NULL, '5',
 'Ziehe die Quadratwurzel.', '√25 = 5 (auch -5 ist Lösung)'),

('Mathematik', 'Pythagoras', '9', 3, 'text_input',
 'Im rechtwinkligen Dreieck ist a = 3 und b = 4. Wie lang ist die Hypotenuse c?', NULL, '5',
 'a² + b² = c²', '3² + 4² = 9 + 16 = 25. c = √25 = 5'),

('Mathematik', 'Pythagoras', '9', 2, 'multiple_choice',
 'Welcher Satz gilt nur im rechtwinkligen Dreieck?', '["Pythagoras","Thales","Strahlensatz","Sinussatz"]', 'Pythagoras',
 NULL, 'a² + b² = c² gilt im rechtwinkligen Dreieck.'),

('Mathematik', 'Geometrie', '7', 1, 'text_input',
 'Wie groß ist die Innenwinkelsumme in einem Dreieck (in °)?', NULL, '180',
 NULL, 'Innenwinkelsumme im Dreieck = 180°'),

('Mathematik', 'Geometrie', '7', 2, 'text_input',
 'Ein Quadrat hat die Seitenlänge 4. Wie groß ist die Fläche?', NULL, '16',
 'Fläche = a · a', '4 · 4 = 16'),

('Mathematik', 'Funktionen', '8', 3, 'multiple_choice',
 'Welche Gleichung beschreibt eine lineare Funktion?', '["y = x²","y = 2x + 3","y = 1/x","y = √x"]', 'y = 2x + 3',
 'Linear = höchste Potenz ist 1.', 'y = mx + b ist die Form linearer Funktionen.'),

-- ───── PHYSIK (12) ─────
('Physik', 'Mechanik', '7', 1, 'multiple_choice',
 'Welche Einheit hat die Kraft?', '["Watt","Newton","Joule","Volt"]', 'Newton',
 NULL, 'Kraft wird in Newton (N) gemessen.'),

('Physik', 'Mechanik', '8', 3, 'text_input',
 'F = m · a. Wie groß ist a (in m/s²), wenn F = 10 N und m = 2 kg?', NULL, '5',
 'a = F / m', '10 N / 2 kg = 5 m/s²'),

('Physik', 'Energie', '8', 2, 'multiple_choice',
 'Welche Einheit hat Energie?', '["Newton","Joule","Pascal","Hertz"]', 'Joule',
 NULL, 'Energie wird in Joule (J) gemessen.'),

('Physik', 'Energie', '9', 3, 'multiple_choice',
 'Was ist die Formel für kinetische Energie?', '["E = m·g·h","E = ½·m·v²","E = m·c²","E = F·s"]', 'E = ½·m·v²',
 NULL, 'Kinetische Energie hängt quadratisch von der Geschwindigkeit ab.'),

('Physik', 'Elektrizität', '9', 3, 'text_input',
 'U = R · I (Ohmsches Gesetz). Wie groß ist I (in A), wenn U = 12 V und R = 4 Ω?', NULL, '3',
 'I = U / R', '12 V / 4 Ω = 3 A'),

('Physik', 'Elektrizität', '9', 2, 'multiple_choice',
 'Welche Einheit hat der elektrische Widerstand?', '["Volt","Ampere","Ohm","Watt"]', 'Ohm',
 NULL, 'Widerstand wird in Ohm (Ω) gemessen.'),

('Physik', 'Optik', '7', 2, 'multiple_choice',
 'Wie schnell ist Licht im Vakuum (ungefähr)?', '["300 m/s","3.000 km/s","300.000 km/s","3.000.000 km/s"]', '300.000 km/s',
 NULL, 'c ≈ 299.792 km/s ≈ 300.000 km/s'),

('Physik', 'Optik', '8', 2, 'multiple_choice',
 'Welche sichtbare Lichtfarbe hat die längste Wellenlänge?', '["Blau","Grün","Gelb","Rot"]', 'Rot',
 NULL, 'Rotes Licht hat die längste Wellenlänge im sichtbaren Spektrum.'),

('Physik', 'Wärme', '7', 1, 'text_input',
 'Bei wie viel °C kocht Wasser auf Meereshöhe?', NULL, '100',
 NULL, 'Wasser kocht bei 100 °C bei normalem Luftdruck.'),

('Physik', 'Wärme', '7', 1, 'text_input',
 'Bei welcher Temperatur (°C) gefriert Wasser?', NULL, '0',
 NULL, 'Wasser gefriert bei 0 °C bei normalem Luftdruck.'),

('Physik', 'Dichte', '8', 3, 'text_input',
 'Ein Stein wiegt 50 g und hat das Volumen 25 cm³. Wie groß ist die Dichte (in g/cm³)?', NULL, '2',
 'Dichte = Masse / Volumen', '50 g / 25 cm³ = 2 g/cm³'),

('Physik', 'Dichte', '8', 2, 'multiple_choice',
 'Was ist die SI-Einheit der Dichte?', '["kg/m","kg/m²","kg/m³","kg·m"]', 'kg/m³',
 NULL, 'Dichte ist Masse pro Volumen, also kg/m³.'),

-- ───── CHEMIE (12) ─────
('Chemie', 'Elemente', '7', 1, 'multiple_choice',
 'Welches Element hat das chemische Symbol "O"?', '["Gold","Sauerstoff","Osmium","Eisen"]', 'Sauerstoff',
 NULL, 'O steht für Oxygenium = Sauerstoff.'),

('Chemie', 'Atome', '7', 1, 'text_input',
 'Wie viele Protonen hat ein Wasserstoff-Atom?', NULL, '1',
 'Wasserstoff = Ordnungszahl 1.', 'Die Ordnungszahl entspricht der Protonenzahl.'),

('Chemie', 'Periodensystem', '8', 2, 'multiple_choice',
 'Welches Element wird durch "Fe" abgekürzt?', '["Fluor","Eisen","Francium","Fermium"]', 'Eisen',
 'Aus dem Lateinischen.', 'Fe = ferrum = Eisen.'),

('Chemie', 'Periodensystem', '9', 3, 'multiple_choice',
 'Wie viele Elemente hat das aktuelle Periodensystem (Stand 2024)?', '["98","108","118","128"]', '118',
 NULL, 'Das Periodensystem hat 118 Elemente, das letzte ist Oganesson (Og).'),

('Chemie', 'Reaktionen', '7', 1, 'multiple_choice',
 'Wasserstoff und Sauerstoff reagieren zu...', '["Stickstoff","Wasser","Salz","Ammoniak"]', 'Wasser',
 NULL, '2 H₂ + O₂ → 2 H₂O'),

('Chemie', 'Formeln', '7', 1, 'multiple_choice',
 'Was ist die chemische Formel von Wasser?', '["HO","H2O","H2O2","OH2"]', 'H2O',
 NULL, 'Zwei Wasserstoff-Atome und ein Sauerstoff-Atom: H₂O'),

('Chemie', 'Säuren/Basen', '9', 3, 'text_input',
 'Welcher pH-Wert ist neutral?', NULL, '7',
 NULL, 'pH 7 = neutral. Unter 7 = sauer, über 7 = basisch.'),

('Chemie', 'Säuren/Basen', '9', 2, 'multiple_choice',
 'Was ist die chemische Formel von Salzsäure?', '["HCl","H2SO4","HNO3","NaCl"]', 'HCl',
 NULL, 'Salzsäure = HCl. Achtung: NaCl ist Kochsalz.'),

('Chemie', 'Mol', '10', 4, 'multiple_choice',
 'Wie viele Teilchen entspricht 1 Mol?', '["6,022 · 10²³","6,022 · 10²²","9,81 · 10²³","3,14 · 10²³"]', '6,022 · 10²³',
 'Avogadro.', 'Die Avogadro-Konstante: N_A ≈ 6,022 · 10²³ Teilchen pro Mol.'),

('Chemie', 'Mol', '10', 4, 'multiple_choice',
 'Wie heißt diese Konstante?', '["Plancksche Konstante","Avogadro-Konstante","Faraday-Konstante","Boltzmann-Konstante"]', 'Avogadro-Konstante',
 NULL, 'Benannt nach Amedeo Avogadro.'),

('Chemie', 'Aggregatzustände', '7', 1, 'multiple_choice',
 'Wie heißt der Übergang von flüssig zu gasförmig?', '["Verdampfen","Schmelzen","Gefrieren","Sublimieren"]', 'Verdampfen',
 NULL, 'flüssig → gasförmig = Verdampfen'),

('Chemie', 'Aggregatzustände', '7', 1, 'text_input',
 'Wie viele Aggregatzustände hat Wasser im Alltag?', NULL, '3',
 NULL, 'Fest (Eis), flüssig (Wasser), gasförmig (Wasserdampf).'),

-- ───── BIOLOGIE (12) ─────
('Biologie', 'Zelle', '7', 1, 'multiple_choice',
 'Was ist die kleinste lebende Einheit?', '["Atom","Molekül","Zelle","Organ"]', 'Zelle',
 NULL, 'Alle Lebewesen bestehen aus Zellen.'),

('Biologie', 'Zelle', '8', 2, 'multiple_choice',
 'Wo befindet sich die DNA in einer tierischen Zelle?', '["Zellmembran","Zellkern","Mitochondrium","Ribosom"]', 'Zellkern',
 NULL, 'Bei Eukaryoten liegt die DNA im Zellkern (Nucleus).'),

('Biologie', 'Genetik', '9', 3, 'multiple_choice',
 'Wofür steht die Abkürzung DNA?', '["Desoxyribonukleinsäure","Diaminonukleinsäure","Doppel-Nukleinsäure","Direkte Nukleinsäure"]', 'Desoxyribonukleinsäure',
 NULL, 'DNA = Desoxyribonukleinsäure (englisch: deoxyribonucleic acid).'),

('Biologie', 'Genetik', '9', 3, 'text_input',
 'Wie viele Chromosomenpaare hat ein menschlicher Zellkern (normale Körperzelle)?', NULL, '23',
 NULL, '46 Chromosomen = 23 Paare (22 Autosomen + 1 Geschlechtschromosomenpaar).'),

('Biologie', 'Evolution', '8', 2, 'multiple_choice',
 'Wer formulierte die Evolutionstheorie?', '["Mendel","Darwin","Linné","Pasteur"]', 'Darwin',
 'Britischer Naturforscher.', 'Charles Darwin, "Über die Entstehung der Arten" (1859).'),

('Biologie', 'Evolution', '9', 3, 'multiple_choice',
 'Was beschreibt "natürliche Selektion"?', '["Tiere wählen ihren Partner","Vorteilhafte Eigenschaften setzen sich durch","Menschen züchten Tiere","Zufällige Genveränderungen"]', 'Vorteilhafte Eigenschaften setzen sich durch',
 NULL, 'Individuen mit Vorteilen vermehren sich erfolgreicher.'),

('Biologie', 'Ökologie', '8', 2, 'multiple_choice',
 'Was ist ein "Produzent" in einem Ökosystem?', '["Pflanze","Pflanzenfresser","Fleischfresser","Pilz"]', 'Pflanze',
 'Wer baut organische Stoffe auf?', 'Pflanzen produzieren mit Photosynthese Glucose aus CO₂ und Wasser.'),

('Biologie', 'Photosynthese', '8', 3, 'multiple_choice',
 'Bei der Photosynthese entsteht aus CO₂ und Wasser...', '["Sauerstoff und Glucose","Stickstoff und Glucose","Sauerstoff und Stärke","CO₂ und Wasser"]', 'Sauerstoff und Glucose',
 'Pflanzen geben einen Gas ab.', '6 CO₂ + 6 H₂O → C₆H₁₂O₆ (Glucose) + 6 O₂'),

('Biologie', 'Mensch', '7', 2, 'text_input',
 'Wie viele Knochen hat ein ausgewachsener Mensch (ungefähr)?', NULL, '206',
 NULL, 'Ein erwachsener Mensch hat 206 Knochen.'),

('Biologie', 'Mensch', '8', 2, 'multiple_choice',
 'Welches Organ filtert das Blut?', '["Leber","Niere","Lunge","Magen"]', 'Niere',
 NULL, 'Die Nieren filtern das Blut und scheiden Abfallstoffe als Urin aus.'),

('Biologie', 'Botanik', '7', 1, 'multiple_choice',
 'Welches Pflanzenorgan nimmt Wasser aus dem Boden auf?', '["Blatt","Blüte","Wurzel","Stiel"]', 'Wurzel',
 NULL, 'Die Wurzel nimmt Wasser und Mineralstoffe auf.'),

('Biologie', 'Botanik', '7', 1, 'multiple_choice',
 'Welcher Farbstoff macht Blätter grün?', '["Chlorophyll","Karotin","Anthocyan","Xanthophyll"]', 'Chlorophyll',
 NULL, 'Chlorophyll ist das Schlüsselmolekül der Photosynthese.');


-- ============================================================
-- BATCH 2: 52 zusätzliche Fragen (gesamt jetzt 100)
-- ============================================================

INSERT INTO question_bank (subject, topic, grade_level, difficulty, question_type, question_text, options, correct_answer, hint, explanation) VALUES

-- MATHEMATIK (+13)
('Mathematik','Bruchrechnen','6',1,'multiple_choice','Was ist 3/4 - 1/4?','["1/2","1/4","2/4","1"]','1/2',NULL,'3/4 - 1/4 = 2/4 = 1/2'),
('Mathematik','Prozent','7',3,'text_input','15 % von 200 sind?',NULL,'30','0,15 · 200','30'),
('Mathematik','Lineare Gleichungen','8',3,'text_input','Löse: 2x - 7 = 11. Was ist x?',NULL,'9','+7, dann ÷2','2x = 18 → x = 9'),
('Mathematik','Quadratische Gleichungen','9',4,'text_input','Löse: x² - 9 = 0. Eine positive Lösung?',NULL,'3','x² = 9','x = ±3'),
('Mathematik','Geometrie','7',2,'text_input','Umfang eines Quadrats mit Seitenlänge 5 cm?',NULL,'20','4 · a','4 · 5 = 20 cm'),
('Mathematik','Geometrie','7',2,'multiple_choice','Wie viele Ecken hat ein Sechseck?','["4","5","6","8"]','6',NULL,'Sechseck = 6 Ecken'),
('Mathematik','Kreis','9',3,'multiple_choice','Formel für die Fläche eines Kreises?','["π·r","2·π·r","π·r²","2·π·r²"]','π·r²',NULL,'A = π · r²'),
('Mathematik','Wurzeln','9',2,'text_input','√64 = ?',NULL,'8',NULL,'8 · 8 = 64'),
('Mathematik','Wurzeln','9',3,'text_input','√(121) = ?',NULL,'11',NULL,'11² = 121'),
('Mathematik','Funktionen','8',3,'multiple_choice','y = 3x + 2. Welcher ist die Steigung?','["2","3","x","3x"]','3','m·x+b → m=Steigung','Steigung m = 3'),
('Mathematik','Trigonometrie','10',4,'multiple_choice','sin(90°) = ?','["0","0,5","1","2"]','1',NULL,'sin(90°) = 1'),
('Mathematik','Potenzen','8',2,'text_input','2⁵ = ?',NULL,'32','2·2·2·2·2','32'),
('Mathematik','Potenzen','8',2,'text_input','10³ = ?',NULL,'1000',NULL,'10·10·10 = 1000'),

-- PHYSIK (+13)
('Physik','Mechanik','8',2,'multiple_choice','Welche Größe ist eine Vektorgröße?','["Masse","Temperatur","Geschwindigkeit","Energie"]','Geschwindigkeit',NULL,'Geschwindigkeit hat Richtung — Vektor.'),
('Physik','Mechanik','9',3,'text_input','Eine Masse von 5 kg fällt frei. Gewichtskraft (in N) bei g=10 m/s²?',NULL,'50','F = m·g','5 · 10 = 50 N'),
('Physik','Energie','9',3,'text_input','Hubarbeit (J): m=2kg, h=10m, g=10 m/s²?',NULL,'200','W = m·g·h','2·10·10 = 200 J'),
('Physik','Elektrizität','9',2,'multiple_choice','Einheit der elektrischen Spannung?','["Ohm","Ampere","Volt","Watt"]','Volt',NULL,'Spannung wird in Volt (V) gemessen.'),
('Physik','Elektrizität','9',3,'text_input','P = U · I. Wie groß ist P (in W), wenn U=12V und I=2A?',NULL,'24','U mal I','12·2 = 24 W'),
('Physik','Optik','8',3,'multiple_choice','Was passiert, wenn Licht durch ein Prisma fällt?','["Es wird zerlegt","Es wird heller","Es verschwindet","Es bleibt gleich"]','Es wird zerlegt',NULL,'Licht wird in seine Spektralfarben zerlegt.'),
('Physik','Wärme','7',1,'multiple_choice','Welche Einheit hat die Temperatur in Deutschland?','["Kelvin","Celsius","Fahrenheit","Newton"]','Celsius',NULL,'Im Alltag: Celsius (°C). Wissenschaftlich auch Kelvin.'),
('Physik','Wärme','9',3,'text_input','Wie viele Kelvin entsprechen 0 °C?',NULL,'273','+273','0 °C = 273,15 K ≈ 273'),
('Physik','Schall','8',2,'multiple_choice','Wie schnell ist Schall in Luft (ungefähr)?','["30 m/s","340 m/s","3.000 m/s","300.000 m/s"]','340 m/s',NULL,'Schallgeschwindigkeit in Luft ≈ 343 m/s bei 20 °C.'),
('Physik','Schwerkraft','7',1,'text_input','Was zieht alle Gegenstände zum Erdmittelpunkt? (Wort)',NULL,'Gravitation','Auch "Schwerkraft" gilt.','Gravitation / Schwerkraft.'),
('Physik','Magnetismus','7',2,'multiple_choice','Welche Pole zieht ein Magnet an?','["Gleiche","Ungleiche","Beide","Keine"]','Ungleiche',NULL,'Ungleiche Pole ziehen sich an, gleiche stoßen sich ab.'),
('Physik','Astronomie','7',1,'multiple_choice','Wie heißt der Stern, um den die Erde kreist?','["Mond","Sonne","Jupiter","Polarstern"]','Sonne',NULL,'Die Erde umkreist die Sonne.'),
('Physik','Astronomie','7',1,'text_input','Wie viele Planeten hat unser Sonnensystem?',NULL,'8','Seit 2006 ohne Pluto.','Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus, Neptun — 8.'),

-- CHEMIE (+13)
('Chemie','Elemente','8',2,'multiple_choice','Welches Symbol hat Gold?','["Go","Au","Gd","Ag"]','Au','Aus dem Lateinischen.','Au = aurum = Gold.'),
('Chemie','Elemente','8',2,'multiple_choice','Welches Element wird durch "Na" abgekürzt?','["Stickstoff","Natrium","Nickel","Neon"]','Natrium',NULL,'Na = natrium = Natrium.'),
('Chemie','Atombau','9',3,'multiple_choice','Welches Teilchen hat eine negative Ladung?','["Proton","Neutron","Elektron","Atomkern"]','Elektron',NULL,'Elektronen sind negativ geladen.'),
('Chemie','Atombau','9',3,'multiple_choice','Wo sitzen Protonen im Atom?','["In der Hülle","Im Kern","Außerhalb","Nirgends"]','Im Kern',NULL,'Protonen und Neutronen bilden den Atomkern.'),
('Chemie','Bindungen','10',4,'multiple_choice','Welche Bindung hat NaCl?','["Kovalent","Ionisch","Metallisch","Wasserstoff"]','Ionisch',NULL,'Na⁺ und Cl⁻ — Ionenbindung.'),
('Chemie','Reaktionen','8',2,'multiple_choice','Was passiert bei Verbrennung?','["Stoff verschwindet","Stoff reagiert mit Sauerstoff","Stoff schmilzt","Stoff friert"]','Stoff reagiert mit Sauerstoff',NULL,'Verbrennung = Oxidation mit Sauerstoff.'),
('Chemie','Formeln','8',2,'multiple_choice','Was ist CO₂?','["Kohlenstoffmonoxid","Kohlenstoffdioxid","Calcium","Chlor"]','Kohlenstoffdioxid',NULL,'CO₂ = Kohlenstoffdioxid.'),
('Chemie','Säuren','9',3,'multiple_choice','Was ist H₂SO₄?','["Salzsäure","Schwefelsäure","Salpetersäure","Essigsäure"]','Schwefelsäure',NULL,'H₂SO₄ = Schwefelsäure.'),
('Chemie','Säuren','9',3,'text_input','pH-Wert einer starken Säure ist ungefähr?',NULL,'1','Sehr sauer.','Starke Säuren haben pH ≈ 0-1.'),
('Chemie','PSE','9',3,'text_input','In welcher Hauptgruppe stehen Edelgase?',NULL,'8','Ganz rechts.','Hauptgruppe 8 (oder 18 IUPAC).'),
('Chemie','Stoffe','7',1,'multiple_choice','Was ist Wasser bei -10 °C?','["Fest","Flüssig","Gas","Plasma"]','Fest',NULL,'Unter 0 °C ist Wasser fest (Eis).'),
('Chemie','Stoffe','7',1,'multiple_choice','Welcher Stoff ist ein Element?','["Wasser","Salz","Sauerstoff","Zucker"]','Sauerstoff',NULL,'Sauerstoff (O) ist ein chemisches Element. Wasser, Salz, Zucker sind Verbindungen.'),
('Chemie','Stoffgemische','8',2,'multiple_choice','Salzwasser ist ein...','["Stoffgemisch","Element","Verbindung","Reines Wasser"]','Stoffgemisch',NULL,'Salzwasser = Lösung = Stoffgemisch.'),

-- BIOLOGIE (+13)
('Biologie','Zelle','7',1,'multiple_choice','Was ist nur in pflanzlichen Zellen vorhanden?','["Zellkern","Chloroplasten","Ribosomen","Mitochondrien"]','Chloroplasten',NULL,'Chloroplasten (mit Chlorophyll) gibt es nur in Pflanzenzellen.'),
('Biologie','Zelle','7',2,'multiple_choice','Was ist die Funktion der Mitochondrien?','["DNA speichern","Energie produzieren","Atmung","Verdauung"]','Energie produzieren',NULL,'Mitochondrien sind die "Kraftwerke" der Zelle.'),
('Biologie','Genetik','9',3,'multiple_choice','Aus wie vielen Basen besteht die DNA?','["2","3","4","5"]','4','A, T, G, C','Adenin, Thymin, Guanin, Cytosin.'),
('Biologie','Genetik','9',3,'text_input','Welche Base paart sich mit Adenin in der DNA?',NULL,'Thymin','A-T','Adenin paart mit Thymin.'),
('Biologie','Vererbung','9',3,'multiple_choice','Wer entdeckte die Vererbungsregeln?','["Darwin","Mendel","Watson","Crick"]','Mendel',NULL,'Gregor Mendel — Erbsenexperimente, Vater der Genetik.'),
('Biologie','Atmung','8',2,'multiple_choice','Welches Gas atmen wir aus?','["Sauerstoff","Stickstoff","Kohlenstoffdioxid","Wasserstoff"]','Kohlenstoffdioxid',NULL,'Wir nehmen O₂ auf und geben CO₂ ab.'),
('Biologie','Mensch','7',1,'multiple_choice','Welches Organ pumpt das Blut?','["Lunge","Herz","Leber","Magen"]','Herz',NULL,'Das Herz pumpt das Blut durch den Körper.'),
('Biologie','Mensch','7',1,'multiple_choice','Wo wird Nahrung zuerst zerkleinert?','["Magen","Mund","Darm","Speiseröhre"]','Mund',NULL,'Im Mund mit Zähnen und Speichel.'),
('Biologie','Ökologie','9',3,'multiple_choice','Was ist ein Konsument 1. Ordnung?','["Pflanze","Pflanzenfresser","Fleischfresser","Pilz"]','Pflanzenfresser',NULL,'Konsumenten 1. Ordnung essen Pflanzen.'),
('Biologie','Insekten','7',1,'text_input','Wie viele Beine hat ein Insekt?',NULL,'6',NULL,'Insekten haben immer 6 Beine.'),
('Biologie','Spinnen','7',1,'text_input','Wie viele Beine hat eine Spinne?',NULL,'8','Spinne ≠ Insekt','Spinnen haben 8 Beine, gehören zu Spinnentieren.'),
('Biologie','Pflanzen','8',2,'multiple_choice','Wie heißt der weibliche Teil der Blüte?','["Staubblatt","Stempel","Kelch","Kronblatt"]','Stempel',NULL,'Der Stempel ist das weibliche Fortpflanzungsorgan.'),
('Biologie','Bakterien','8',2,'multiple_choice','Was sind Bakterien?','["Pflanzen","Tiere","Einzeller","Viren"]','Einzeller',NULL,'Bakterien sind einzellige Lebewesen ohne Zellkern (Prokaryoten).');

