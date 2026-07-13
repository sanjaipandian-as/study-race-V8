-- Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
-- ============================================================
-- Additional question bank (50 more questions)
-- Brings total to ~100 questions across Math/Physik/Chemie/Biologie
-- ============================================================

INSERT INTO question_bank (subject, topic, grade_level, difficulty, question_type, question_text, options, correct_answer, hint, explanation) VALUES

-- ───── MATHEMATIK +13 ─────
('Mathematik', 'Lineare Gleichungen', '7', 3, 'text_input',
 'Löse: 4x - 7 = 13. Was ist x?', NULL, '5',
 '13 + 7 = 20, dann durch 4.', '4x = 20 → x = 5'),

('Mathematik', 'Bruchrechnen', '6', 3, 'multiple_choice',
 'Was ist 3/4 - 1/2?', '["1/4","2/4","1/2","2/2"]', '1/4',
 'Mache gleichnamig.', '3/4 - 2/4 = 1/4'),

('Mathematik', 'Bruchrechnen', '7', 3, 'text_input',
 'Was ist 1/3 · 6?', NULL, '2',
 NULL, '6/3 = 2'),

('Mathematik', 'Prozent', '8', 3, 'text_input',
 'Wie viel sind 12 % von 250?', NULL, '30',
 '0,12 · 250', '0,12 · 250 = 30'),

('Mathematik', 'Prozent', '8', 4, 'multiple_choice',
 'Ein Hemd kostete 80 € und ist nun um 25 % reduziert. Neuer Preis?', '["55 €","60 €","65 €","75 €"]', '60 €',
 '25 % von 80 = 20.', '80 - 20 = 60 €'),

('Mathematik', 'Quadratische Gleichungen', '9', 4, 'multiple_choice',
 'Lösungen von (x-3)(x+5) = 0?', '["x=3, x=-5","x=-3, x=5","x=3, x=5","x=-3, x=-5"]', 'x=3, x=-5',
 'Satz vom Nullprodukt.', 'Setze jeden Faktor = 0.'),

('Mathematik', 'Funktionen', '8', 3, 'multiple_choice',
 'Steigung der Geraden y = 3x + 2?', '["2","3","-3","5"]', '3',
 'm in y = mx + b.', 'Der Koeffizient von x ist die Steigung.'),

('Mathematik', 'Funktionen', '8', 3, 'text_input',
 'y-Achsenabschnitt von y = -2x + 7?', NULL, '7',
 'b in y = mx + b.', 'y = mx + b, der Wert bei x=0 ist 7.'),

('Mathematik', 'Geometrie', '7', 2, 'text_input',
 'Umfang eines Quadrats mit Seitenlänge 6?', NULL, '24',
 'U = 4·a', '4 · 6 = 24'),

('Mathematik', 'Geometrie', '8', 3, 'text_input',
 'Flächeninhalt eines Kreises mit Radius 3 (π ≈ 3,14, gerundet auf ganze Zahl)?', NULL, '28',
 'A = π · r²', '3,14 · 9 ≈ 28,3 → 28'),

('Mathematik', 'Pythagoras', '9', 4, 'text_input',
 'a = 5, b = 12. Wie lang ist c?', NULL, '13',
 '5² + 12² = ?', '25 + 144 = 169. √169 = 13'),

('Mathematik', 'Wahrscheinlichkeit', '8', 3, 'multiple_choice',
 'Wahrscheinlichkeit, bei einem Würfel eine 6 zu würfeln?', '["1/2","1/3","1/4","1/6"]', '1/6',
 NULL, 'Sechs gleichwahrscheinliche Seiten, eine davon ist die 6.'),

('Mathematik', 'Wurzeln', '9', 3, 'text_input',
 'Was ist √81?', NULL, '9',
 NULL, '9 · 9 = 81'),

-- ───── PHYSIK +12 ─────
('Physik', 'Mechanik', '7', 2, 'multiple_choice',
 'Welche Einheit hat Geschwindigkeit?', '["km/h oder m/s","Pa","N/m","Hz"]', 'km/h oder m/s',
 NULL, 'Geschwindigkeit = Strecke / Zeit.'),

('Physik', 'Mechanik', '8', 3, 'text_input',
 'Ein Auto fährt 60 km in 1,5 h. Geschwindigkeit (in km/h)?', NULL, '40',
 'v = s / t', '60 / 1,5 = 40 km/h'),

('Physik', 'Mechanik', '8', 3, 'multiple_choice',
 'Auf jede Aktion folgt eine gleich große, entgegengesetzte Reaktion. Wer hat das formuliert?', '["Galilei","Newton","Einstein","Kepler"]', 'Newton',
 NULL, 'Newtons 3. Gesetz: actio = reactio.'),

('Physik', 'Energie', '9', 4, 'text_input',
 'Ein 2 kg schwerer Stein liegt 5 m hoch. Wie groß ist die Lageenergie (g = 10 m/s²) in Joule?', NULL, '100',
 'E = m · g · h', '2 · 10 · 5 = 100 J'),

('Physik', 'Energie', '10', 3, 'multiple_choice',
 'Welcher Energie-Erhaltungssatz gilt?', '["Energie kann verloren gehen","Energie wird nur umgewandelt","Energie entsteht aus dem Nichts","Energie nimmt mit der Zeit zu"]', 'Energie wird nur umgewandelt',
 NULL, 'Die Gesamtenergie eines geschlossenen Systems bleibt konstant.'),

('Physik', 'Elektrizität', '8', 2, 'multiple_choice',
 'Welche Einheit hat Spannung?', '["Ampere","Volt","Ohm","Watt"]', 'Volt',
 NULL, 'Spannung wird in Volt (V) gemessen.'),

('Physik', 'Elektrizität', '9', 4, 'text_input',
 'P = U · I. Wie groß ist die Leistung (in W), wenn U=230V und I=2A?', NULL, '460',
 'P = U · I', '230 · 2 = 460 W'),

('Physik', 'Optik', '8', 3, 'multiple_choice',
 'Was passiert beim Übergang von Licht von Luft in Wasser?', '["Es wird reflektiert","Es wird gebrochen","Es verschwindet","Es wird heißer"]', 'Es wird gebrochen',
 NULL, 'Lichtbrechung beim Übergang zwischen Medien unterschiedlicher Dichte.'),

('Physik', 'Wärme', '8', 3, 'multiple_choice',
 'Wie nennt man die Energie, die ein Stoff braucht, um zu schmelzen?', '["Schmelzwärme","Verdampfungswärme","Strahlungsenergie","Kinetische Energie"]', 'Schmelzwärme',
 NULL, 'Schmelzwärme ist die Energie pro Masse für den Aggregatübergang fest → flüssig.'),

('Physik', 'Akustik', '8', 2, 'multiple_choice',
 'Womit wird Schall gemessen?', '["Watt","Dezibel","Hertz oder Dezibel","Volt"]', 'Hertz oder Dezibel',
 'Frequenz und Lautstärke.', 'Frequenz: Hz, Lautstärke: dB.'),

('Physik', 'Astronomie', '9', 3, 'multiple_choice',
 'Welcher Planet ist der Sonne am nächsten?', '["Venus","Merkur","Erde","Mars"]', 'Merkur',
 NULL, 'Merkur ist der innerste Planet im Sonnensystem.'),

('Physik', 'Astronomie', '9', 2, 'text_input',
 'Wie viele Planeten hat unser Sonnensystem (offiziell, ohne Pluto)?', NULL, '8',
 NULL, 'Seit 2006 zählt Pluto als Zwergplanet, somit 8 Planeten.'),

('Physik', 'Magnetismus', '8', 2, 'multiple_choice',
 'Gleichartige magnetische Pole...', '["ziehen sich an","stoßen sich ab","sind neutral","verschwinden"]', 'stoßen sich ab',
 NULL, 'Gleichnamige Pole stoßen sich ab, ungleichnamige ziehen sich an.'),

-- ───── CHEMIE +12 ─────
('Chemie', 'Elemente', '7', 1, 'multiple_choice',
 'Welches Element hat das Symbol "C"?', '["Calcium","Kohlenstoff","Chlor","Chrom"]', 'Kohlenstoff',
 NULL, 'C = Carbonium = Kohlenstoff.'),

('Chemie', 'Elemente', '7', 2, 'multiple_choice',
 'Welches Element hat das Symbol "Au"?', '["Aluminium","Argon","Gold","Silber"]', 'Gold',
 'Aus dem Lateinischen.', 'Au = aurum = Gold.'),

('Chemie', 'Atome', '8', 2, 'text_input',
 'Wie viele Elektronen hat ein neutrales Sauerstoff-Atom?', NULL, '8',
 'Ordnungszahl von Sauerstoff?', 'Sauerstoff hat die Ordnungszahl 8, also 8 Elektronen.'),

('Chemie', 'Reaktionen', '8', 3, 'multiple_choice',
 'Was entsteht bei der Verbrennung von Kohlenstoff?', '["CO","CO2","H2O","O2"]', 'CO2',
 NULL, 'C + O₂ → CO₂ (Kohlendioxid).'),

('Chemie', 'Reaktionen', '8', 3, 'multiple_choice',
 'Welches Gas atmen Pflanzen bei Photosynthese aus?', '["Stickstoff","CO2","Sauerstoff","Wasserstoff"]', 'Sauerstoff',
 NULL, 'Pflanzen geben bei der Photosynthese O₂ ab.'),

('Chemie', 'Säuren/Basen', '9', 3, 'multiple_choice',
 'Welcher pH-Wert ist stark sauer?', '["1","7","9","14"]', '1',
 NULL, 'pH 0-2 = stark sauer, 7 = neutral, 12-14 = stark basisch.'),

('Chemie', 'Säuren/Basen', '9', 2, 'multiple_choice',
 'Welcher pH-Wert ist stark basisch?', '["1","4","7","14"]', '14',
 NULL, 'Je höher der pH-Wert, desto basischer.'),

('Chemie', 'Formeln', '9', 3, 'multiple_choice',
 'Was ist die chemische Formel von Methan?', '["CH3","CH4","C2H6","CO"]', 'CH4',
 NULL, 'Methan: ein C-Atom und vier H-Atome.'),

('Chemie', 'Formeln', '9', 3, 'multiple_choice',
 'Wieviele Atome hat ein Molekül CO₂?', '["1","2","3","4"]', '3',
 NULL, '1 Kohlenstoff + 2 Sauerstoff = 3 Atome.'),

('Chemie', 'Periodensystem', '8', 3, 'multiple_choice',
 'In welcher Gruppe stehen die Edelgase?', '["Gruppe 1","Gruppe 2","Gruppe 17","Gruppe 18"]', 'Gruppe 18',
 NULL, 'Edelgase: Gruppe 18 (Hauptgruppe VIII).'),

('Chemie', 'Stoffe', '7', 2, 'multiple_choice',
 'Welches ist ein Gemisch und keine reine Substanz?', '["Wasser","Sauerstoff","Salz","Luft"]', 'Luft',
 NULL, 'Luft ist ein Gemisch aus N₂, O₂, CO₂ und anderen Gasen.'),

('Chemie', 'Aggregatzustände', '7', 1, 'multiple_choice',
 'Was passiert beim Schmelzen?', '["fest → flüssig","flüssig → gasförmig","gasförmig → fest","fest → gasförmig"]', 'fest → flüssig',
 NULL, 'Schmelzen: fest → flüssig.'),

-- ───── BIOLOGIE +13 ─────
('Biologie', 'Zelle', '7', 2, 'multiple_choice',
 'Welche Zellbestandteile haben Pflanzenzellen, aber Tierzellen NICHT?', '["Zellkern","Zellwand und Chloroplasten","Zellmembran","Mitochondrien"]', 'Zellwand und Chloroplasten',
 NULL, 'Pflanzenzellen haben zusätzlich eine Zellwand und Chloroplasten.'),

('Biologie', 'Zelle', '8', 3, 'multiple_choice',
 'Welche Zellorganelle erzeugt Energie (ATP)?', '["Zellkern","Mitochondrium","Vakuole","Golgi-Apparat"]', 'Mitochondrium',
 'Die "Kraftwerke" der Zelle.', 'Mitochondrien produzieren ATP durch Zellatmung.'),

('Biologie', 'Genetik', '9', 3, 'multiple_choice',
 'Welche Base passt in der DNA mit Adenin (A) zusammen?', '["Cytosin (C)","Guanin (G)","Thymin (T)","Uracil (U)"]', 'Thymin (T)',
 'In RNA wäre es U.', 'In der DNA: A-T und G-C (komplementäre Basenpaare).'),

('Biologie', 'Genetik', '9', 3, 'multiple_choice',
 'Wie heißt der Begründer der Vererbungslehre?', '["Darwin","Mendel","Watson","Mendel und Crick"]', 'Mendel',
 'Erbsen-Experimente.', 'Gregor Mendel erforschte die Vererbung an Erbsenpflanzen.'),

('Biologie', 'Evolution', '9', 3, 'text_input',
 'Vor wie vielen Millionen Jahren starben die Dinosaurier aus (gerundet)?', NULL, '66',
 NULL, 'Etwa vor 66 Millionen Jahren am Ende der Kreidezeit.'),

('Biologie', 'Mensch', '8', 2, 'multiple_choice',
 'Welches Organ pumpt das Blut?', '["Lunge","Herz","Leber","Niere"]', 'Herz',
 NULL, 'Das Herz pumpt das Blut durch den Körper.'),

('Biologie', 'Mensch', '8', 2, 'multiple_choice',
 'Wo findet die Verdauung hauptsächlich statt?', '["Mund","Magen und Dünndarm","Lunge","Herz"]', 'Magen und Dünndarm',
 NULL, 'Die Hauptverdauung findet im Magen und Dünndarm statt.'),

('Biologie', 'Mensch', '8', 3, 'multiple_choice',
 'Welche Blutgruppe ist universeller Spender?', '["A","B","AB","0 (Null)"]', '0 (Null)',
 NULL, 'Blutgruppe 0 negativ kann an alle anderen Gruppen gespendet werden.'),

('Biologie', 'Ökologie', '8', 3, 'multiple_choice',
 'Was ist die richtige Reihenfolge in einer Nahrungskette?', '["Konsument → Produzent → Destruent","Produzent → Konsument → Destruent","Destruent → Produzent → Konsument","Konsument → Destruent → Produzent"]', 'Produzent → Konsument → Destruent',
 NULL, 'Pflanzen (Produzenten) → Tiere (Konsumenten) → Pilze/Bakterien (Destruenten).'),

('Biologie', 'Ökologie', '9', 3, 'multiple_choice',
 'Was ist das größte Ökosystem der Erde?', '["Wälder","Wüsten","Ozeane","Berge"]', 'Ozeane',
 NULL, 'Die Ozeane bedecken ~71 % der Erdoberfläche.'),

('Biologie', 'Botanik', '7', 2, 'multiple_choice',
 'Wofür dienen Blüten bei Pflanzen?', '["Atmung","Fortpflanzung","Wasserspeicherung","Stabilität"]', 'Fortpflanzung',
 NULL, 'Blüten sind die Fortpflanzungsorgane der Pflanzen.'),

('Biologie', 'Botanik', '7', 1, 'text_input',
 'Wie viele Hauptbestandteile hat eine vollständige Blüte (Kelch, Krone, Staubblätter, Fruchtblätter)?', NULL, '4',
 NULL, 'Kelchblätter, Kronblätter, Staubblätter, Fruchtblätter = 4 Hauptteile.'),

('Biologie', 'Mikrobiologie', '8', 2, 'multiple_choice',
 'Welche Mikroorganismen verursachen typischerweise Erkältungen?', '["Bakterien","Viren","Pilze","Algen"]', 'Viren',
 NULL, 'Erkältungen werden meist durch Rhinoviren ausgelöst.');

