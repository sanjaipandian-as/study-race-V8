-- Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
-- ============================================================
-- StudyRace - Question Bank v3 (Major Content Expansion)
-- Adds: Deutsch (60), Englisch (55), Geschichte (40),
--       Geographie (40), plus more Mathe/Physik/Chemie/Biologie
-- Klassen 5-10, lehrplan-orientiert
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- DEUTSCH (Grammatik, Rechtschreibung, Literatur, Lesen)
-- ════════════════════════════════════════════════════════════

INSERT INTO question_bank (subject, topic, grade_level, difficulty, question_type, question_text, options, correct_answer, hint, explanation) VALUES
('Deutsch', 'Wortarten', '5', 1, 'multiple_choice',
 'Welches Wort ist ein Nomen?',
 '["laufen","schnell","Hund","grün"]', 'Hund',
 'Nomen kann man anfassen oder fühlen.', 'Hund ist ein Nomen (Substantiv) — Dinge, Personen, Tiere.'),

('Deutsch', 'Wortarten', '5', 1, 'multiple_choice',
 'Welches Wort ist ein Verb?',
 '["Tisch","schnell","singen","blau"]', 'singen',
 'Verben sind Tätigkeitswörter.', 'singen ist eine Tätigkeit — also ein Verb.'),

('Deutsch', 'Wortarten', '5', 2, 'multiple_choice',
 'Welches Wort ist ein Adjektiv?',
 '["Auto","fahren","schnell","gestern"]', 'schnell',
 'Adjektive beschreiben Eigenschaften.', 'schnell beschreibt, wie etwas ist — also ein Adjektiv (Eigenschaftswort).'),

('Deutsch', 'Wortarten', '6', 2, 'multiple_choice',
 'Welches Wort ist ein Adverb?',
 '["klug","schnell","heute","Kind"]', 'heute',
 'Adverbien sagen wann, wo oder wie.', 'heute ist ein Zeitadverb — es sagt WANN etwas passiert.'),

('Deutsch', 'Fälle', '6', 2, 'multiple_choice',
 'Welcher Fall ist in: „Ich gebe DEM HUND einen Knochen"?',
 '["Nominativ","Genitiv","Dativ","Akkusativ"]', 'Dativ',
 'Frage: WEM gibst du etwas?', 'WEM? → Dativ (3. Fall). „dem Hund" ist Dativ.'),

('Deutsch', 'Fälle', '6', 2, 'multiple_choice',
 'Welcher Fall ist in: „Das Buch DES LEHRERS"?',
 '["Nominativ","Genitiv","Dativ","Akkusativ"]', 'Genitiv',
 'Frage: WESSEN Buch?', 'WESSEN? → Genitiv (2. Fall). „des Lehrers" zeigt Besitz.'),

('Deutsch', 'Fälle', '7', 3, 'text_input',
 'Welcher Fall ist „den Apfel" in „Ich esse den Apfel"? (Nominativ, Genitiv, Dativ oder Akkusativ)',
 NULL, 'Akkusativ',
 'Frage: WEN oder WAS isst du?', 'WEN/WAS? → Akkusativ (4. Fall).'),

('Deutsch', 'Zeitformen', '6', 2, 'multiple_choice',
 'In welcher Zeitform steht: „Ich habe gelernt"?',
 '["Präsens","Präteritum","Perfekt","Plusquamperfekt"]', 'Perfekt',
 'haben/sein + Partizip II.', 'Perfekt: „habe" (Hilfsverb) + „gelernt" (Partizip II).'),

('Deutsch', 'Zeitformen', '6', 2, 'multiple_choice',
 'In welcher Zeitform steht: „Ich lernte"?',
 '["Präsens","Präteritum","Perfekt","Futur"]', 'Präteritum',
 'Einfache Vergangenheit, oft in Erzählungen.', 'Präteritum ist die einfache Vergangenheit.'),

('Deutsch', 'Zeitformen', '7', 3, 'text_input',
 'Setze in Präteritum: „Ich gehe in die Schule." → „Ich ___ in die Schule."',
 NULL, 'ging',
 'Unregelmäßiges Verb gehen.', 'gehen → ging (Präteritum).'),

('Deutsch', 'Rechtschreibung', '5', 1, 'multiple_choice',
 'Welches Wort schreibt man groß?',
 '["der haus","das Haus","Das haus","das HAus"]', 'das Haus',
 'Nomen werden immer großgeschrieben.', 'Nomen (Substantive) werden im Deutschen immer großgeschrieben.'),

('Deutsch', 'Rechtschreibung', '6', 2, 'multiple_choice',
 'Welche Schreibweise ist richtig?',
 '["Ich weiß, dass du kommst","Ich weiß, das du kommst","Ich weis, dass du kommst","Ich weiß, daß du kommst"]', 'Ich weiß, dass du kommst',
 'Konjunktion „dass" mit Doppel-s.', '„dass" als Konjunktion (Bindewort) wird mit „ss" geschrieben. „das" mit einem s ist Artikel/Pronomen.'),

('Deutsch', 'Rechtschreibung', '7', 3, 'multiple_choice',
 'Welcher Satz ist richtig?',
 '["Das Buch, das ich lese, ist gut.","Das Buch, dass ich lese, ist gut.","Daß Buch das ich lese ist gut.","Das buch das ich lese ist gut."]', 'Das Buch, das ich lese, ist gut.',
 'Hier ist „das" ein Relativpronomen (kannst es durch „welches" ersetzen).', 'Wenn man „das" durch „welches" ersetzen kann → mit einem „s". Hier: „Das Buch, welches ich lese" → also „das".'),

('Deutsch', 'Rechtschreibung', '6', 2, 'multiple_choice',
 'Wie schreibt man richtig?',
 '["der Fluss","der Fluß","der Floss","der Fluuss"]', 'der Fluss',
 'Nach kurzem Vokal: ss.', 'Nach kurzem Vokal (u) schreibt man „ss". Nach langem Vokal/Diphthong: „ß" (z. B. Straße).'),

('Deutsch', 'Satzbau', '5', 1, 'multiple_choice',
 'Was ist das Subjekt in: „Der Hund bellt laut"?',
 '["bellt","laut","Der Hund","Hund laut"]', 'Der Hund',
 'Wer macht etwas?', 'Subjekt = WER oder WAS macht etwas? → „Der Hund".'),

('Deutsch', 'Satzbau', '6', 2, 'multiple_choice',
 'Was ist das Prädikat in: „Lena schreibt einen Brief"?',
 '["Lena","schreibt","einen Brief","Brief"]', 'schreibt',
 'Das ist die Tätigkeit / das Verb.', 'Prädikat = die Tätigkeit / das Verb. → „schreibt".'),

('Deutsch', 'Satzbau', '6', 2, 'multiple_choice',
 'Was ist das Objekt in: „Tim isst einen Apfel"?',
 '["Tim","isst","einen Apfel","gerne"]', 'einen Apfel',
 'WEN oder WAS isst Tim?', 'Akkusativobjekt: WEN/WAS? → „einen Apfel".'),

('Deutsch', 'Literatur', '7', 2, 'multiple_choice',
 'Was ist ein Reim?',
 '["Eine lange Geschichte","Wenn Wörter ähnlich klingen am Ende","Eine Hauptperson","Eine traurige Stimmung"]', 'Wenn Wörter ähnlich klingen am Ende',
 'Haus — Maus.', 'Ein Reim entsteht, wenn die Wortenden gleich oder ähnlich klingen.'),

('Deutsch', 'Literatur', '8', 3, 'multiple_choice',
 'Welche der folgenden Gattungen ist KEINE der drei Hauptgattungen der Literatur?',
 '["Epik","Lyrik","Dramatik","Fantasie"]', 'Fantasie',
 'Es gibt 3 große Gattungen.', 'Die 3 großen Gattungen sind Epik (Erzählung), Lyrik (Gedichte) und Dramatik (Theater).'),

('Deutsch', 'Literatur', '8', 3, 'multiple_choice',
 'Wer schrieb „Faust"?',
 '["Friedrich Schiller","Heinrich Heine","Johann Wolfgang von Goethe","Bertolt Brecht"]', 'Johann Wolfgang von Goethe',
 'Der berühmteste deutsche Dichter.', 'Goethe schrieb „Faust" — Teil I (1808) und Teil II (1832).'),

('Deutsch', 'Literatur', '8', 3, 'multiple_choice',
 'Was ist eine Metapher?',
 '["Ein Vergleich mit „wie"","Ein bildhafter Ausdruck ohne „wie"","Eine Wiederholung","Eine Übertreibung"]', 'Ein bildhafter Ausdruck ohne „wie"',
 'Beispiel: „Sein Herz ist aus Stein."', 'Metapher = bildhafte Übertragung. Beispiel: „Sein Herz ist aus Stein" (er ist gefühllos).'),

('Deutsch', 'Wortarten', '7', 2, 'multiple_choice',
 'Welches Wort ist eine Präposition?',
 '["und","aber","auf","sehr"]', 'auf',
 'Präpositionen zeigen Ort, Zeit oder Beziehung.', '„auf" zeigt eine Lage/Position — also eine Präposition.'),

('Deutsch', 'Wortarten', '7', 2, 'multiple_choice',
 'Welches Wort ist ein Pronomen?',
 '["schnell","laufen","sie","grün"]', 'sie',
 'Pronomen ersetzen Nomen.', '„sie" ersetzt ein Nomen (Personalpronomen).'),

('Deutsch', 'Aktiv-Passiv', '8', 3, 'multiple_choice',
 'Welcher Satz steht im Passiv?',
 '["Der Lehrer erklärt die Aufgabe.","Die Aufgabe wird vom Lehrer erklärt.","Der Lehrer hat die Aufgabe erklärt.","Erklärt der Lehrer die Aufgabe?"]', 'Die Aufgabe wird vom Lehrer erklärt.',
 'Passiv = „werden" + Partizip II.', 'Passiv bildet man mit „werden" + Partizip II. Der Täter steht oft mit „von".'),

('Deutsch', 'Konjunktiv', '9', 4, 'multiple_choice',
 'In welcher Form steht: „Er sagte, er sei krank"?',
 '["Indikativ","Konjunktiv I","Konjunktiv II","Imperativ"]', 'Konjunktiv I',
 'Indirekte Rede.', 'Konjunktiv I (sei, habe, gehe) wird für die indirekte Rede verwendet.'),

('Deutsch', 'Erörterung', '9', 4, 'multiple_choice',
 'Welche Struktur gehört zu einer Erörterung?',
 '["Einleitung — Höhepunkt — Ende","Einleitung — Hauptteil (Argumente) — Schluss","Einleitung — Bilder — Ende","nur Hauptteil"]', 'Einleitung — Hauptteil (Argumente) — Schluss',
 'Klassischer Aufbau einer Erörterung.', 'Eine Erörterung hat: Einleitung (zur Frage hinführen), Hauptteil (Pro/Kontra-Argumente) und Schluss (eigene Meinung).'),

('Deutsch', 'Rechtschreibung', '5', 1, 'text_input',
 'Schreibe richtig: „Der Hund bellt l___t." (kurz: laut/laud?)',
 NULL, 'laut',
 'Endet auf t, nicht d.', 'Verlängerungsprobe: lauter → also „laut" mit „t".'),

('Deutsch', 'Rechtschreibung', '6', 2, 'multiple_choice',
 'Welche Schreibweise ist korrekt?',
 '["Fußball","Fussball","Fußbal","Fusball"]', 'Fußball',
 'Nach langem „u" steht „ß".', 'Nach langem Vokal oder Diphthong → „ß". Bei „Fuß" → langes u → ß.'),

('Deutsch', 'Wortarten', '5', 1, 'multiple_choice',
 'Welches ist ein Pluralwort?',
 '["Kind","Kinder","ein","der"]', 'Kinder',
 'Mehrzahl.', '„Kinder" ist die Mehrzahl (Plural) von „Kind".'),

('Deutsch', 'Wortarten', '5', 1, 'multiple_choice',
 'Wie heißt der Artikel von „Haus"?',
 '["der","die","das","den"]', 'das',
 'Sächlich.', '„Haus" ist sächlich → „das Haus".'),

('Deutsch', 'Zeitformen', '7', 3, 'text_input',
 'Setze in Perfekt: „Ich laufe schnell." → „Ich ___ schnell gelaufen."',
 NULL, 'bin',
 'Bei Bewegungsverben: „sein".', 'Bewegungsverben verwenden „sein" als Hilfsverb: „Ich bin gelaufen."'),

('Deutsch', 'Komma', '8', 3, 'multiple_choice',
 'Wo gehört das Komma hin? „Ich gehe ins Kino weil ich den Film sehen will."',
 '["nach Kino","nach ich","nach gehe","kein Komma nötig"]', 'nach Kino',
 'Nebensatz mit „weil".', 'Vor Nebensatzeinleitungen wie „weil" kommt ein Komma: „Ich gehe ins Kino, weil ich den Film sehen will."'),

('Deutsch', 'Wortarten', '7', 2, 'multiple_choice',
 'Welches Wort ist eine Konjunktion?',
 '["aber","sehr","gestern","groß"]', 'aber',
 'Konjunktionen verbinden Sätze oder Wörter.', '„aber" ist ein Bindewort (Konjunktion).'),

('Deutsch', 'Satzbau', '7', 2, 'multiple_choice',
 'Welcher Satz ist ein Fragesatz?',
 '["Du gehst nach Hause.","Geh nach Hause!","Gehst du nach Hause?","Nach Hause."]', 'Gehst du nach Hause?',
 'Beginnt oft mit dem Verb.', 'Fragesätze enden mit „?" und beginnen oft mit dem Verb (Entscheidungsfrage) oder Fragewort.'),

('Deutsch', 'Literatur', '7', 2, 'multiple_choice',
 'Was ist eine Strophe?',
 '["Ein Satz","Ein Abschnitt in einem Gedicht","Ein Buch","Ein Reim"]', 'Ein Abschnitt in einem Gedicht',
 'Bauelement eines Gedichts.', 'Eine Strophe ist ein Sinnabschnitt in einem Gedicht — wie ein Absatz, nur in Versen.'),

('Deutsch', 'Wortarten', '6', 2, 'multiple_choice',
 'Welches Verb ist im Infinitiv?',
 '["läuft","gelaufen","laufen","lief"]', 'laufen',
 'Grundform: -en am Ende.', 'Der Infinitiv ist die Grundform eines Verbs: „laufen", „lesen", „singen".'),

('Deutsch', 'Rechtschreibung', '6', 2, 'multiple_choice',
 'Welche Schreibweise ist richtig?',
 '["heute Abend","heute abend","Heute Abend","heute ABEND"]', 'heute Abend',
 'Tageszeit nach „heute".', 'Tageszeiten nach „heute, morgen, gestern" werden großgeschrieben: heute Abend, gestern Morgen.'),

('Deutsch', 'Aktiv-Passiv', '8', 3, 'multiple_choice',
 'Wandle in Passiv: „Der Maler malt das Bild."',
 '["Der Maler hat gemalt.","Das Bild wird vom Maler gemalt.","Das Bild malt den Maler.","Der Maler wird gemalt."]', 'Das Bild wird vom Maler gemalt.',
 'Objekt wird Subjekt, Subjekt mit „von".', 'Aktiv → Passiv: Objekt (das Bild) wird Subjekt. „wird ... gemalt" und der Täter mit „vom".'),

('Deutsch', 'Wortarten', '6', 2, 'multiple_choice',
 'Welches ist ein zusammengesetztes Nomen?',
 '["Hund","Schreibtisch","laufen","schnell"]', 'Schreibtisch',
 'Zwei Nomen zusammen.', '„Schreib-Tisch" ist aus zwei Wörtern zusammengesetzt → ein Kompositum.'),

('Deutsch', 'Komma', '8', 3, 'multiple_choice',
 'Welcher Satz hat alle Kommas richtig?',
 '["Ich mag, Äpfel Birnen und Trauben.","Ich mag Äpfel, Birnen und Trauben.","Ich, mag Äpfel Birnen, und Trauben.","Ich mag Äpfel Birnen, und Trauben."]', 'Ich mag Äpfel, Birnen und Trauben.',
 'Aufzählung: Komma vor jedem Element außer dem letzten mit „und".', 'Bei Aufzählungen: Komma zwischen den Elementen, KEIN Komma vor dem letzten „und".'),

('Deutsch', 'Literatur', '9', 4, 'multiple_choice',
 'Was ist ein Symbol in der Literatur?',
 '["Eine wörtliche Beschreibung","Ein Zeichen, das für etwas Anderes steht","Ein Reim","Ein Ende"]', 'Ein Zeichen, das für etwas Anderes steht',
 'z. B. eine Rose für Liebe.', 'Ein Symbol ist ein Zeichen mit übertragener Bedeutung — z. B. die Rose als Symbol für Liebe.'),

('Deutsch', 'Wortarten', '7', 3, 'multiple_choice',
 'Welches Wort ist eine Interjektion (Empfindungswort)?',
 '["und","schnell","Au!","laufen"]', 'Au!',
 'Drückt Gefühl/Reaktion aus.', 'Interjektionen drücken spontane Gefühle aus: „Au!", „Oh!", „Pfui!".'),

('Deutsch', 'Wortarten', '8', 3, 'multiple_choice',
 'Welcher Satz steht im Konjunktiv II?',
 '["Ich gehe nach Hause.","Wenn ich Zeit hätte, würde ich kommen.","Geh nach Hause!","Ich bin gegangen."]', 'Wenn ich Zeit hätte, würde ich kommen.',
 'Hypothetische Situation („würde", „hätte", „wäre").', 'Konjunktiv II drückt etwas Hypothetisches/Wunsch aus: „hätte", „wäre", „würde".'),

('Deutsch', 'Satzbau', '8', 3, 'multiple_choice',
 'Was ist ein Hauptsatz?',
 '["Ein Satz, der nicht alleine stehen kann","Ein Satz, der alleine stehen kann","Ein Frageteil","Ein Komma"]', 'Ein Satz, der alleine stehen kann',
 'Vollständiger Sinn.', 'Ein Hauptsatz kann alleine stehen — er hat einen vollständigen Sinn. Nebensätze brauchen einen Hauptsatz.'),

('Deutsch', 'Rechtschreibung', '7', 2, 'multiple_choice',
 'Welche Schreibweise ist richtig?',
 '["zu Hause","zuhause","Zuhause","ZuHause"]', 'zu Hause',
 'Beide Schreibweisen erlaubt — hier traditionell.', 'Sowohl „zu Hause" als auch „zuhause" sind heute zulässig. Klassisch: „zu Hause" (Nomen großgeschrieben).'),

('Deutsch', 'Literatur', '9', 4, 'multiple_choice',
 'Was ist eine Ballade?',
 '["Ein lustiges Gedicht","Ein erzählendes Gedicht mit dramatischer Handlung","Ein kurzer Roman","Ein Sachtext"]', 'Ein erzählendes Gedicht mit dramatischer Handlung',
 'Bekannt: „Der Erlkönig" von Goethe.', 'Eine Ballade verbindet Lyrik (Versform), Epik (Handlung) und Dramatik (Spannung) — z. B. „Der Erlkönig".'),

('Deutsch', 'Komma', '9', 4, 'multiple_choice',
 'Wo muss ein Komma stehen? „Tom der gerade angekommen ist begrüßte uns."',
 '["nach Tom und nach ist","nach gerade und nach uns","nach Tom und nach begrüßte","kein Komma nötig"]', 'nach Tom und nach ist',
 'Relativsatz wird in Kommas eingeschlossen.', 'Relativsätze werden in Kommas eingeschlossen: „Tom, der gerade angekommen ist, begrüßte uns."'),

('Deutsch', 'Wortarten', '9', 3, 'multiple_choice',
 'Was ist ein Partizip II?',
 '["Die Grundform eines Verbs","Eine Form von gehen, oft mit „ge-"","Eine Frage","Ein Nomen"]', 'Eine Form von gehen, oft mit „ge-"',
 'Beispiel: gelaufen, gemacht.', 'Partizip II (Mittelwort der Vergangenheit) bildet u. a. das Perfekt: gemacht, gelaufen, gegessen.'),

('Deutsch', 'Wortarten', '5', 1, 'text_input',
 'Wie heißt die Mehrzahl (Plural) von „Buch"?',
 NULL, 'Bücher',
 'Mit Umlaut.', '„Buch" → „Bücher" (Plural mit Umlaut und -er-Endung).'),

('Deutsch', 'Wortarten', '5', 1, 'text_input',
 'Wie heißt die Mehrzahl von „Apfel"?',
 NULL, 'Äpfel',
 'Nur Umlaut.', '„Apfel" → „Äpfel" (Plural durch Umlaut allein).'),

('Deutsch', 'Rechtschreibung', '6', 2, 'multiple_choice',
 'Wann schreibt man „seit" und wann „seid"?',
 '["seit = Zeit, seid = ihr","seit = ihr, seid = Zeit","beides gleich","nur seid"]', 'seit = Zeit, seid = ihr',
 'Eselsbrücke: seid mit d wie ihr seid.', '„seit" → Zeit (seit gestern). „seid" → 2. Person Plural von „sein" (ihr seid hier).'),

('Deutsch', 'Wortarten', '8', 3, 'multiple_choice',
 'In welcher Steigerungsform steht „besser"?',
 '["Positiv","Komparativ","Superlativ","keine"]', 'Komparativ',
 'Vergleich zwischen zwei.', 'gut — besser — am besten. „besser" ist die Komparativform (Vergleich).'),

('Deutsch', 'Wortarten', '8', 3, 'text_input',
 'Bilde den Superlativ von „schön".',
 NULL, 'am schönsten',
 'Höchste Steigerung.', 'schön (Positiv) — schöner (Komparativ) — am schönsten (Superlativ).'),

('Deutsch', 'Texte', '7', 3, 'multiple_choice',
 'Was ist ein Bericht?',
 '["Ein erfundener Text","Ein Text, der sachlich über Ereignisse informiert","Ein Gedicht","Ein Brief"]', 'Ein Text, der sachlich über Ereignisse informiert',
 'Fakten, kein Drumherum.', 'Ein Bericht informiert sachlich und präzise über ein Ereignis — Wer? Was? Wann? Wo? Wie? Warum?'),

('Deutsch', 'Texte', '7', 3, 'multiple_choice',
 'Welche Frage gehört NICHT zu den W-Fragen eines Berichts?',
 '["Wer?","Was?","Welcher Star?","Warum?"]', 'Welcher Star?',
 '7 typische W-Fragen.', 'Die 7 W-Fragen: Wer? Was? Wann? Wo? Wie? Warum? Welche Folgen?'),

('Deutsch', 'Literatur', '8', 3, 'multiple_choice',
 'Was kennzeichnet eine Kurzgeschichte?',
 '["Sehr langer Roman","Kurzer Text, oft mit offenem Ende","Gedichtform","Theaterstück"]', 'Kurzer Text, oft mit offenem Ende',
 'Kurze epische Form.', 'Kurzgeschichten sind kurz, beginnen oft mitten im Geschehen und haben häufig ein offenes Ende.'),

('Deutsch', 'Wortarten', '7', 3, 'multiple_choice',
 'Welches Wort gehört zu den Demonstrativpronomen?',
 '["ich","dieser","sehr","weil"]', 'dieser',
 'Hinweisendes Fürwort.', '„dieser" (diese, dieses) zeigt auf etwas hin — Demonstrativpronomen.'),

('Deutsch', 'Erörterung', '10', 4, 'multiple_choice',
 'Welche Aussage ist KEIN gutes Argument?',
 '["Studien zeigen, dass...","Ich finde es einfach gut.","Experten bestätigen, dass...","Statistiken belegen, dass..."]', 'Ich finde es einfach gut.',
 'Gefühl ist kein Argument.', 'Gute Argumente brauchen eine Begründung (Fakten, Beispiele, Statistik). Bloße Gefühle reichen nicht.'),

('Deutsch', 'Literatur', '10', 4, 'multiple_choice',
 'Wer schrieb „Die Räuber"?',
 '["Goethe","Schiller","Heine","Kafka"]', 'Schiller',
 'Sturm und Drang.', 'Friedrich Schiller schrieb „Die Räuber" (1781) — ein berühmtes Drama des Sturm und Drang.')

ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- ENGLISCH (Vocabulary, Grammar, Tenses)
-- ════════════════════════════════════════════════════════════

INSERT INTO question_bank (subject, topic, grade_level, difficulty, question_type, question_text, options, correct_answer, hint, explanation) VALUES
('Englisch', 'Vocabulary', '5', 1, 'multiple_choice',
 'Was bedeutet „house"?',
 '["Hund","Haus","Maus","Hose"]', 'Haus',
 'Klingt fast wie „Haus".', '„house" = Haus.'),

('Englisch', 'Vocabulary', '5', 1, 'multiple_choice',
 'Was bedeutet „cat"?',
 '["Hund","Katze","Maus","Kuh"]', 'Katze',
 'Haustier.', '„cat" = Katze.'),

('Englisch', 'Vocabulary', '5', 1, 'multiple_choice',
 'Was bedeutet „school"?',
 '["Schule","Schuh","Schloss","Schal"]', 'Schule',
 'Wo du jeden Tag hingehst.', '„school" = Schule.'),

('Englisch', 'Vocabulary', '5', 1, 'multiple_choice',
 'Wie sagt man „Hund" auf Englisch?',
 '["cat","dog","fish","bird"]', 'dog',
 'Bellt: Wuff!', 'Hund = dog.'),

('Englisch', 'Vocabulary', '5', 1, 'multiple_choice',
 'Wie sagt man „Buch" auf Englisch?',
 '["pen","book","desk","chair"]', 'book',
 'Lesen.', 'Buch = book.'),

('Englisch', 'Tenses', '5', 1, 'multiple_choice',
 'I ___ a student. Welches Wort fehlt?',
 '["am","is","are","be"]', 'am',
 'I + am.', '„I am" — bei „I" immer „am".'),

('Englisch', 'Tenses', '5', 2, 'multiple_choice',
 'She ___ to school every day. Welches Wort fehlt?',
 '["go","goes","going","went"]', 'goes',
 'Simple Present, 3. Person Singular: -s.', 'Bei he/she/it im Simple Present kommt ein „s" ans Verb: she goes, he runs.'),

('Englisch', 'Tenses', '6', 2, 'multiple_choice',
 'Was ist das Past Simple von „go"?',
 '["goed","went","gone","goes"]', 'went',
 'Unregelmäßig.', '„go" ist unregelmäßig: go — went — gone.'),

('Englisch', 'Tenses', '6', 2, 'multiple_choice',
 'Was ist das Past Simple von „eat"?',
 '["eated","ate","eaten","eats"]', 'ate',
 'Unregelmäßig.', '„eat" ist unregelmäßig: eat — ate — eaten.'),

('Englisch', 'Tenses', '6', 2, 'multiple_choice',
 'Yesterday I ___ to the cinema.',
 '["go","goes","went","gone"]', 'went',
 'Vergangenheit — Past Simple.', '„yesterday" → Past Simple → „went".'),

('Englisch', 'Tenses', '7', 3, 'multiple_choice',
 'I ___ TV when the phone rang.',
 '["watch","watched","was watching","am watching"]', 'was watching',
 'Past Continuous für laufende Handlung.', 'Past Continuous (was/were + -ing) für eine Handlung, die gerade lief, als etwas anderes passierte.'),

('Englisch', 'Tenses', '7', 3, 'multiple_choice',
 'She has ___ to Paris.',
 '["go","went","gone","goes"]', 'gone',
 'Present Perfect = have/has + Partizip Perfekt.', 'Present Perfect: have/has + past participle (3. Form). go → gone.'),

('Englisch', 'Tenses', '8', 3, 'multiple_choice',
 'If it rains tomorrow, we ___ stay at home.',
 '["will","would","are","were"]', 'will',
 'Conditional Type 1.', 'Conditional Type 1: If + Simple Present, will + Infinitive.'),

('Englisch', 'Tenses', '9', 4, 'multiple_choice',
 'If I ___ rich, I would travel the world.',
 '["am","was","were","be"]', 'were',
 'Conditional Type 2 — hypothetisch.', 'Conditional Type 2 (hypothetisch): „If I were" — auch bei I/he/she/it.'),

('Englisch', 'Grammar', '6', 2, 'multiple_choice',
 'Was ist der Komparativ von „big"?',
 '["more big","bigger","biggest","big"]', 'bigger',
 'Kurze Adjektive: -er.', 'Bei kurzen Adjektiven: -er. „big" → „bigger" (Verdopplung des g).'),

('Englisch', 'Grammar', '6', 2, 'multiple_choice',
 'Was ist der Superlativ von „good"?',
 '["gooder","goodest","best","more good"]', 'best',
 'Unregelmäßig.', '„good" — better — best (unregelmäßig).'),

('Englisch', 'Grammar', '7', 2, 'multiple_choice',
 'Welche Form ist richtig? „This book is ___ than that one."',
 '["interesting","interestinger","more interesting","most interesting"]', 'more interesting',
 'Lange Adjektive: more.', 'Bei mehr-silbigen Adjektiven: „more ... than", nicht „-er".'),

('Englisch', 'Modals', '7', 3, 'multiple_choice',
 'I ___ swim very well.',
 '["can","must","should","might"]', 'can',
 'Fähigkeit.', '„can" drückt eine Fähigkeit aus: I can swim = ich kann schwimmen.'),

('Englisch', 'Modals', '8', 3, 'multiple_choice',
 'You ___ wear a helmet when you ride a bike.',
 '["can","should","may","might"]', 'should',
 'Empfehlung / Ratschlag.', '„should" gibt eine Empfehlung / einen Ratschlag.'),

('Englisch', 'Articles', '5', 1, 'multiple_choice',
 'Which article fits? „___ apple a day keeps the doctor away."',
 '["A","An","The","No article"]', 'An',
 'Vor Vokal.', 'Vor Vokal-Laut: „an apple". Vor Konsonant: „a".'),

('Englisch', 'Articles', '5', 1, 'multiple_choice',
 'Which article? „I have ___ dog."',
 '["a","an","the","no article"]', 'a',
 'Vor Konsonant.', '„a dog" — vor Konsonantenlaut.'),

('Englisch', 'Pronouns', '5', 1, 'multiple_choice',
 'Maria is my friend. ___ is nice.',
 '["He","She","It","They"]', 'She',
 'Maria ist weiblich.', 'Maria = weiblich → she.'),

('Englisch', 'Pronouns', '6', 2, 'multiple_choice',
 'This is Tom and ___ brother.',
 '["he","his","him","her"]', 'his',
 'Possessivpronomen.', '„his" ist das Possessivpronomen — „seinen Bruder".'),

('Englisch', 'Questions', '5', 2, 'multiple_choice',
 '___ is your name?',
 '["Who","Where","What","When"]', 'What',
 'Frage nach Namen.', '„What is your name?" — Frage nach dem Namen mit „what".'),

('Englisch', 'Questions', '6', 2, 'multiple_choice',
 '___ are you from?',
 '["Who","Where","What","Why"]', 'Where',
 'Frage nach Ort.', '„Where are you from?" — Frage nach Herkunft mit „where".'),

('Englisch', 'Questions', '6', 2, 'multiple_choice',
 '___ do you go to school?',
 '["What","Where","Who","Why"]', 'Where',
 'Frage nach Ort.', '„Where do you go to school?"'),

('Englisch', 'Vocabulary', '6', 2, 'multiple_choice',
 'Was bedeutet „breakfast"?',
 '["Mittagessen","Abendessen","Frühstück","Pause"]', 'Frühstück',
 'Morgens.', '„breakfast" = Frühstück. lunch = Mittagessen. dinner = Abendessen.'),

('Englisch', 'Vocabulary', '7', 2, 'multiple_choice',
 'Was bedeutet „library"?',
 '["Buchhandlung","Bibliothek","Schule","Büro"]', 'Bibliothek',
 'Bücher ausleihen.', '„library" = Bibliothek. Achtung: „Buchhandlung" = bookshop / bookstore.'),

('Englisch', 'Vocabulary', '7', 3, 'multiple_choice',
 'Was bedeutet „receive"?',
 '["geben","empfangen / erhalten","verkaufen","verlieren"]', 'empfangen / erhalten',
 'Gegenteil von give.', '„receive" = empfangen / bekommen. Gegenteil von „give" = geben.'),

('Englisch', 'Tenses', '7', 3, 'multiple_choice',
 'I ___ my homework. (gerade fertig)',
 '["did","have done","do","am doing"]', 'have done',
 'Present Perfect — Resultat in der Gegenwart.', 'Present Perfect (have/has + past participle) für Handlungen mit Bezug zur Gegenwart.'),

('Englisch', 'Tenses', '8', 3, 'multiple_choice',
 'How long ___ you ___ English?',
 '["did/learn","have/been learning","are/learning","will/learn"]', 'have/been learning',
 'Present Perfect Progressive.', '„How long have you been learning English?" — für Dauer einer noch andauernden Handlung.'),

('Englisch', 'Passive', '8', 3, 'multiple_choice',
 'Wandle in Passiv: „He builds a house."',
 '["A house is built.","A house was built.","He is built.","Built a house."]', 'A house is built.',
 'Object wird Subject; is + past participle.', 'Passive Simple Present: Object → Subject, „is/are" + past participle: „A house is built."'),

('Englisch', 'Grammar', '8', 3, 'multiple_choice',
 'Some ___ vs. any: „Do you have ___ questions?"',
 '["some","any","no","every"]', 'any',
 'In Fragen meist „any".', 'In Fragen und Verneinungen meist „any". In positiven Aussagen „some".'),

('Englisch', 'Modals', '8', 3, 'multiple_choice',
 'You ___ smoke here — it''s a hospital.',
 '["can","must not","should","may"]', 'must not',
 'Strenges Verbot.', '„must not / mustn''t" = Verbot. Etwas ist nicht erlaubt.'),

('Englisch', 'Grammar', '9', 4, 'multiple_choice',
 'The book ___ I read yesterday was great.',
 '["who","which","whose","whom"]', 'which',
 'Sache → which/that.', 'Relativpronomen: für Sachen → „which" oder „that". Für Personen → „who".'),

('Englisch', 'Tenses', '9', 4, 'multiple_choice',
 'By the time we arrived, the film ___ already ___.',
 '["was/started","had/started","has/started","is/started"]', 'had/started',
 'Past Perfect — Handlung VOR einer anderen.', 'Past Perfect (had + past participle) für eine Handlung, die VOR einer anderen Vergangenheits-Handlung passierte.'),

('Englisch', 'Vocabulary', '8', 3, 'multiple_choice',
 'What is the opposite of „expensive"?',
 '["cheap","high","big","new"]', 'cheap',
 'Wenig Geld kostet.', '„expensive" (teuer) ↔ „cheap" (billig).'),

('Englisch', 'Vocabulary', '9', 4, 'multiple_choice',
 'What does „eventually" mean?',
 '["plötzlich","schließlich/am Ende","vielleicht","nie"]', 'schließlich/am Ende',
 'Falsche Freunde: NICHT „eventuell"!', 'Achtung „false friend": „eventually" = schließlich/letztendlich (NICHT eventuell = „possibly").'),

('Englisch', 'Vocabulary', '8', 3, 'multiple_choice',
 'What does „actually" mean?',
 '["aktuell","tatsächlich","später","manchmal"]', 'tatsächlich',
 'False friend.', '„actually" = tatsächlich/eigentlich. NICHT „aktuell" (= currently).'),

('Englisch', 'Tenses', '6', 2, 'multiple_choice',
 'They ___ playing football now.',
 '["is","am","are","be"]', 'are',
 'they + are.', '„they" → „are". Present Continuous: they are playing.'),

('Englisch', 'Grammar', '7', 2, 'multiple_choice',
 'There is ___ milk in the fridge.',
 '["a","an","some","many"]', 'some',
 'Nicht zählbar.', '„milk" ist nicht zählbar (uncountable) → „some milk", nicht „a milk".'),

('Englisch', 'Grammar', '8', 3, 'multiple_choice',
 'How ___ books do you have?',
 '["much","many","some","any"]', 'many',
 'Zählbar?', 'Zählbar (books, friends, cars) → „many". Nicht zählbar (water, money, time) → „much".'),

('Englisch', 'Vocabulary', '7', 2, 'multiple_choice',
 'What does „awesome" mean?',
 '["furchtbar","großartig","langweilig","schmutzig"]', 'großartig',
 'Sehr positiv.', '„awesome" = großartig, fantastisch.'),

('Englisch', 'Modals', '9', 3, 'multiple_choice',
 'I''m not sure, but it ___ rain later.',
 '["must","will definitely","might","cannot"]', 'might',
 'Möglichkeit.', '„might" = Möglichkeit (vielleicht). „It might rain" = es könnte regnen.'),

('Englisch', 'Vocabulary', '10', 4, 'multiple_choice',
 'What does „to consider" mean?',
 '["aufhören","überlegen / in Betracht ziehen","laufen","verstecken"]', 'überlegen / in Betracht ziehen',
 'Über etwas nachdenken.', '„to consider" = überlegen, in Erwägung ziehen.'),

('Englisch', 'Grammar', '10', 4, 'multiple_choice',
 'Reported speech: He said, „I am tired." → He said that he ___ tired.',
 '["am","is","was","were"]', 'was',
 'Backshift: Present → Past.', 'In reported speech wird die Zeit zurückgesetzt: „I am" → „he was".'),

('Englisch', 'Vocabulary', '5', 1, 'text_input',
 'What is „Sonne" in English?',
 NULL, 'sun',
 'Scheint am Tag.', 'Sonne = sun.'),

('Englisch', 'Vocabulary', '5', 1, 'text_input',
 'What is „Wasser" in English?',
 NULL, 'water',
 'Trinken.', 'Wasser = water.'),

('Englisch', 'Vocabulary', '6', 2, 'text_input',
 'Was ist die englische Übersetzung von „Bibliothek"?',
 NULL, 'library',
 'Wo Bücher ausgeliehen werden.', 'Bibliothek = library.'),

('Englisch', 'Numbers', '5', 1, 'multiple_choice',
 'How do you write „13" in English?',
 '["thirty","thirteen","threeteen","thirten"]', 'thirteen',
 'Klingt fast wie thirty, aber mit -teen.', '13 = thirteen. 30 = thirty.'),

('Englisch', 'Time', '5', 1, 'multiple_choice',
 'Wie sagt man auf Englisch: „Es ist 3 Uhr."?',
 '["It''s three o''clock.","It''s three hours.","It''s a three.","Three is now."]', 'It''s three o''clock.',
 'o''clock = volle Stunde.', '„o''clock" verwendet man bei vollen Stunden.'),

('Englisch', 'Tenses', '7', 3, 'multiple_choice',
 '„I will go to the party." — Welche Zeitform?',
 '["Past Simple","Present Perfect","Will-Future","Going-to-Future"]', 'Will-Future',
 'will + Infinitiv.', 'Will-Future: will + Infinitiv. Drückt spontane Entscheidungen oder Vorhersagen aus.'),

('Englisch', 'Vocabulary', '8', 3, 'multiple_choice',
 'What does „to borrow" mean?',
 '["leihen (sich)","verleihen","verlieren","gewinnen"]', 'leihen (sich)',
 'borrow ≠ lend.', '„borrow" = sich leihen. „lend" = verleihen (jemandem geben).')

ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- GESCHICHTE (Deutschland-bezogen, EU, Weltgeschichte)
-- ════════════════════════════════════════════════════════════

INSERT INTO question_bank (subject, topic, grade_level, difficulty, question_type, question_text, options, correct_answer, hint, explanation) VALUES
('Geschichte', 'Mittelalter', '6', 2, 'multiple_choice',
 'Wer war Karl der Große?',
 '["Ein römischer Kaiser","Ein fränkischer König und Kaiser","Ein Pirat","Ein Wikinger"]', 'Ein fränkischer König und Kaiser',
 'Krönung im Jahr 800.', 'Karl der Große wurde 800 in Rom zum Kaiser gekrönt — Gründer des Frankenreichs.'),

('Geschichte', 'Mittelalter', '7', 2, 'multiple_choice',
 'In welchem Jahr wurde Karl der Große zum Kaiser gekrönt?',
 '["476","800","1066","1492"]', '800',
 'Wendepunkt des frühen Mittelalters.', 'Am Weihnachtstag 800 wurde Karl der Große von Papst Leo III. in Rom zum Kaiser gekrönt.'),

('Geschichte', 'Mittelalter', '7', 3, 'multiple_choice',
 'Was war ein Lehnsherr?',
 '["Ein Bauer","Ein Adliger, der Land an Vasallen vergab","Ein Mönch","Ein Händler"]', 'Ein Adliger, der Land an Vasallen vergab',
 'Lehnswesen.', 'Im Lehnswesen gab ein Lehnsherr (oft König oder Adliger) Land an Vasallen — gegen Treue und Kriegsdienst.'),

('Geschichte', 'Neuzeit', '7', 3, 'multiple_choice',
 'Wer entdeckte 1492 Amerika für die Europäer?',
 '["Vasco da Gama","Christoph Kolumbus","Magellan","Marco Polo"]', 'Christoph Kolumbus',
 '14-hundert-92.', 'Kolumbus landete 1492 in der Karibik und „entdeckte" so Amerika für die Europäer.'),

('Geschichte', 'Reformation', '7', 3, 'multiple_choice',
 'Wer schlug 1517 die 95 Thesen an die Kirchentür?',
 '["Johannes Calvin","Martin Luther","Erasmus","Heinrich VIII."]', 'Martin Luther',
 'In Wittenberg.', 'Martin Luther begann 1517 mit seinen 95 Thesen in Wittenberg die Reformation.'),

('Geschichte', 'Französische Revolution', '8', 3, 'multiple_choice',
 'In welchem Jahr begann die Französische Revolution?',
 '["1689","1789","1848","1871"]', '1789',
 'Sturm auf die Bastille.', 'Die Französische Revolution begann 1789 mit dem Sturm auf die Bastille (14. Juli).'),

('Geschichte', 'Französische Revolution', '8', 3, 'multiple_choice',
 'Welche drei Schlagworte prägte die Französische Revolution?',
 '["Frieden, Freude, Eierkuchen","Freiheit, Gleichheit, Brüderlichkeit","Glaube, Liebe, Hoffnung","Arbeit, Familie, Vaterland"]', 'Freiheit, Gleichheit, Brüderlichkeit',
 'Liberté, Égalité, Fraternité.', '„Freiheit, Gleichheit, Brüderlichkeit" — die Leitgedanken der Französischen Revolution.'),

('Geschichte', 'Industrialisierung', '8', 3, 'multiple_choice',
 'Was war eine wichtige Erfindung der Industriellen Revolution?',
 '["Das Internet","Die Dampfmaschine","Das Smartphone","Der Computer"]', 'Die Dampfmaschine',
 'Verbesserung durch James Watt.', 'Die Dampfmaschine (von James Watt verbessert, 1769) trieb die Industrialisierung voran.'),

('Geschichte', 'Deutsches Kaiserreich', '8', 3, 'multiple_choice',
 'In welchem Jahr wurde das Deutsche Kaiserreich gegründet?',
 '["1848","1871","1914","1933"]', '1871',
 'Nach dem Krieg gegen Frankreich.', 'Das Deutsche Kaiserreich wurde am 18. Januar 1871 in Versailles ausgerufen — nach dem Sieg über Frankreich.'),

('Geschichte', 'Deutsches Kaiserreich', '8', 3, 'multiple_choice',
 'Wer wurde 1871 erster Reichskanzler?',
 '["Friedrich Ebert","Otto von Bismarck","Adenauer","Wilhelm II."]', 'Otto von Bismarck',
 'Der „Eiserne Kanzler".', 'Otto von Bismarck — Reichskanzler 1871–1890, prägte die deutsche Reichsgründung.'),

('Geschichte', 'Erster Weltkrieg', '9', 3, 'multiple_choice',
 'In welchen Jahren fand der Erste Weltkrieg statt?',
 '["1914–1918","1939–1945","1870–1871","1900–1905"]', '1914–1918',
 'Vor 100 Jahren plus.', 'Der Erste Weltkrieg dauerte von 1914 bis 1918.'),

('Geschichte', 'Erster Weltkrieg', '9', 4, 'multiple_choice',
 'Welches Ereignis löste den Ersten Weltkrieg aus?',
 '["Der Krieg in der Ukraine","Das Attentat von Sarajevo","Die Mondlandung","Die Wiedervereinigung"]', 'Das Attentat von Sarajevo',
 '28. Juni 1914.', 'Der Mord am österreichischen Thronfolger Franz Ferdinand am 28. Juni 1914 in Sarajevo löste die Eskalation aus.'),

('Geschichte', 'Weimarer Republik', '9', 4, 'multiple_choice',
 'Wann begann die Weimarer Republik?',
 '["1871","1919","1933","1945"]', '1919',
 'Nach dem Ersten Weltkrieg.', 'Die Weimarer Republik wurde 1919 mit der Weimarer Verfassung gegründet — die erste deutsche Demokratie.'),

('Geschichte', 'Nationalsozialismus', '9', 4, 'multiple_choice',
 'Wann kam Hitler an die Macht?',
 '["1918","1933","1939","1945"]', '1933',
 'Ernennung zum Reichskanzler.', '30. Januar 1933 wurde Hitler zum Reichskanzler ernannt — Beginn der NS-Diktatur.'),

('Geschichte', 'Zweiter Weltkrieg', '9', 4, 'multiple_choice',
 'Wann begann der Zweite Weltkrieg?',
 '["1914","1918","1933","1939"]', '1939',
 'Überfall auf Polen.', 'Am 1. September 1939 begann der Zweite Weltkrieg mit dem deutschen Überfall auf Polen.'),

('Geschichte', 'Zweiter Weltkrieg', '9', 4, 'multiple_choice',
 'Wann endete der Zweite Weltkrieg in Europa?',
 '["Mai 1945","September 1939","November 1918","Juni 1944"]', 'Mai 1945',
 'Bedingungslose Kapitulation.', 'Am 8. Mai 1945 kapitulierte die Wehrmacht bedingungslos — Ende des Krieges in Europa.'),

('Geschichte', 'Holocaust', '9', 4, 'multiple_choice',
 'Was war der Holocaust?',
 '["Ein Sportereignis","Der systematische Massenmord an etwa 6 Millionen Juden durch die Nazis","Ein Vertrag","Eine Stadt"]', 'Der systematische Massenmord an etwa 6 Millionen Juden durch die Nazis',
 'Schoah.', 'Der Holocaust (Schoah) war der vom NS-Regime organisierte Völkermord an etwa 6 Millionen Juden in Europa.'),

('Geschichte', 'Nachkriegszeit', '10', 4, 'multiple_choice',
 'Wann wurde die Bundesrepublik Deutschland gegründet?',
 '["1945","1949","1955","1961"]', '1949',
 'Westdeutschland.', 'Am 23. Mai 1949 wurde das Grundgesetz der Bundesrepublik Deutschland verkündet.'),

('Geschichte', 'Nachkriegszeit', '10', 4, 'multiple_choice',
 'Wann wurde die DDR gegründet?',
 '["1945","1949","1955","1961"]', '1949',
 'Im selben Jahr wie die BRD.', 'Die DDR wurde am 7. Oktober 1949 in der sowjetisch besetzten Zone gegründet.'),

('Geschichte', 'Kalter Krieg', '10', 4, 'multiple_choice',
 'Wann wurde die Berliner Mauer gebaut?',
 '["1945","1953","1961","1989"]', '1961',
 '13. August.', 'Die Berliner Mauer wurde am 13. August 1961 errichtet — sie teilte Berlin und Deutschland 28 Jahre lang.'),

('Geschichte', 'Wiedervereinigung', '10', 4, 'multiple_choice',
 'Wann fiel die Berliner Mauer?',
 '["1961","1985","1989","1990"]', '1989',
 '9. November.', 'In der Nacht vom 9. zum 10. November 1989 fiel die Berliner Mauer.'),

('Geschichte', 'Wiedervereinigung', '10', 4, 'multiple_choice',
 'Wann fand die deutsche Wiedervereinigung statt?',
 '["1989","3. Oktober 1990","1992","1999"]', '3. Oktober 1990',
 'Tag der Deutschen Einheit.', 'Am 3. Oktober 1990 vereinigten sich BRD und DDR — heute Nationalfeiertag.'),

('Geschichte', 'EU', '10', 4, 'multiple_choice',
 'Wann wurde der Euro als Bargeld eingeführt?',
 '["1992","1999","2002","2010"]', '2002',
 'Münzen und Scheine.', 'Am 1. Januar 2002 wurde der Euro als Bargeld eingeführt — vorher war er nur Buchgeld seit 1999.'),

('Geschichte', 'Antike', '6', 2, 'multiple_choice',
 'Welches Volk baute die Pyramiden?',
 '["Römer","Griechen","Ägypter","Wikinger"]', 'Ägypter',
 'In Gizeh.', 'Die berühmten Pyramiden in Gizeh wurden von den alten Ägyptern erbaut (vor ca. 4500 Jahren).'),

('Geschichte', 'Antike', '6', 2, 'multiple_choice',
 'Welche antike Hochkultur erfand die Demokratie?',
 '["Ägypten","Rom","Griechenland","Persien"]', 'Griechenland',
 'In Athen.', 'Die Demokratie entstand im antiken Athen (ca. 500 v. Chr.) — „Demos" = Volk, „kratos" = Herrschaft.'),

('Geschichte', 'Antike', '7', 3, 'multiple_choice',
 'Wer war Julius Caesar?',
 '["Ein griechischer Philosoph","Ein römischer Feldherr und Politiker","Ein ägyptischer Pharao","Ein Maler"]', 'Ein römischer Feldherr und Politiker',
 'Erobert Gallien, ermordet 44 v. Chr.', 'Julius Caesar (100–44 v. Chr.) — römischer Feldherr, eroberte Gallien, wurde an den Iden des März ermordet.'),

('Geschichte', 'Mittelalter', '6', 2, 'multiple_choice',
 'Was war die Pest im 14. Jahrhundert?',
 '["Ein Krieg","Eine schwere Seuche, die viele Menschen tötete","Ein Lied","Eine Stadt"]', 'Eine schwere Seuche, die viele Menschen tötete',
 '„Schwarzer Tod".', 'Die Pest („Schwarzer Tod") tötete um 1347–1353 etwa 25 Millionen Menschen — ein Drittel Europas.'),

('Geschichte', 'Neuzeit', '8', 3, 'multiple_choice',
 'Was war der „Dreißigjährige Krieg"?',
 '["Ein Krieg in der Antike","Ein Religionskrieg 1618–1648","Ein Krieg im 19. Jh.","Ein Bürgerkrieg in den USA"]', 'Ein Religionskrieg 1618–1648',
 'Westfälischer Frieden.', 'Der Dreißigjährige Krieg (1618–1648) verwüstete weite Teile Mitteleuropas. Endete mit dem Westfälischen Frieden.'),

('Geschichte', 'Industrialisierung', '8', 3, 'multiple_choice',
 'Was war eine soziale Folge der Industrialisierung?',
 '["Es gab kaum Veränderungen","Schwere Arbeitsbedingungen für Arbeiter:innen, einschließlich Kindern","Alle wurden reich","Es gab keine Städte mehr"]', 'Schwere Arbeitsbedingungen für Arbeiter:innen, einschließlich Kindern',
 'Soziale Frage.', 'Lange Arbeitstage (12-16h), Kinderarbeit, schlechte Wohnungen — die „soziale Frage" der Industrialisierung.'),

('Geschichte', '20. Jahrhundert', '9', 4, 'multiple_choice',
 'Was war die NATO bei ihrer Gründung 1949?',
 '["Ein Sportverein","Ein westliches Militärbündnis","Eine Bank","Eine Schule"]', 'Ein westliches Militärbündnis',
 'Im Kalten Krieg.', 'Die NATO (North Atlantic Treaty Organization) — westliches Militärbündnis, gegründet 1949 gegen die sowjetische Bedrohung.'),

('Geschichte', '20. Jahrhundert', '10', 4, 'multiple_choice',
 'Was geschah am 11. September 2001?',
 '["Mauerfall","Terroranschläge in den USA","Wiedervereinigung","Euro-Einführung"]', 'Terroranschläge in den USA',
 'Twin Towers, NYC.', 'Am 11. September 2001 (9/11) verübten Terroristen Anschläge auf das World Trade Center und das Pentagon.'),

('Geschichte', 'Antike', '6', 2, 'multiple_choice',
 'Welches Reich baute viele Straßen, Aquädukte und Theater im antiken Europa?',
 '["Das ägyptische Reich","Das römische Reich","Das chinesische Reich","Das Inkareich"]', 'Das römische Reich',
 'Caesar, Augustus, Nero.', 'Das Römische Reich (8. Jh. v. Chr. — 5. Jh. n. Chr.) errichtete eine beeindruckende Infrastruktur in Europa.'),

('Geschichte', 'Mittelalter', '7', 2, 'multiple_choice',
 'Wer baute Burgen im Mittelalter?',
 '["Bauern","Adlige (Ritter und Herren)","Mönche","Händler"]', 'Adlige (Ritter und Herren)',
 'Wehrhafte Wohnsitze.', 'Burgen wurden von Adligen gebaut — als befestigte Wohnsitze und Symbol ihrer Macht.'),

('Geschichte', 'Neuzeit', '8', 3, 'multiple_choice',
 'Was war die Aufklärung?',
 '["Ein Krieg","Eine geistige Bewegung des 17.-18. Jh. mit Fokus auf Vernunft und Wissen","Eine Religion","Eine Mode"]', 'Eine geistige Bewegung des 17.-18. Jh. mit Fokus auf Vernunft und Wissen',
 'Kant: „Sapere aude!"', 'Die Aufklärung (ca. 1650-1800) betonte Vernunft, Wissenschaft und Menschenrechte. Wegbereiter der Demokratie.'),

('Geschichte', 'EU', '10', 4, 'multiple_choice',
 'Welches Land trat 2020 aus der EU aus?',
 '["Frankreich","Deutschland","Vereinigtes Königreich (Brexit)","Italien"]', 'Vereinigtes Königreich (Brexit)',
 'Brexit.', 'Das Vereinigte Königreich verließ die EU am 31. Januar 2020 (Brexit) nach dem Referendum 2016.'),

('Geschichte', '20. Jahrhundert', '10', 4, 'text_input',
 'In welchem Jahr endete der Erste Weltkrieg?',
 NULL, '1918',
 'Versailler Vertrag folgte.', 'Der Erste Weltkrieg endete am 11. November 1918 mit dem Waffenstillstand von Compiègne.'),

('Geschichte', 'Antike', '6', 2, 'text_input',
 'Wer war der erste römische Kaiser?',
 NULL, 'Augustus',
 'Adoptivsohn Caesars.', 'Augustus (eigentlich Octavian) — der erste römische Kaiser, regierte von 27 v. Chr. bis 14 n. Chr.'),

('Geschichte', 'Mittelalter', '7', 2, 'multiple_choice',
 'Was ist das Heilige Römische Reich Deutscher Nation?',
 '["Eine Stadt","Ein Reich mittelalterlicher deutscher und mitteleuropäischer Länder","Ein Buch","Eine Kirche"]', 'Ein Reich mittelalterlicher deutscher und mitteleuropäischer Länder',
 'Bestand fast 1000 Jahre.', 'Das Heilige Römische Reich (962–1806) war ein loser Verbund europäischer Länder unter einem Kaiser.'),

('Geschichte', 'Erster Weltkrieg', '9', 4, 'multiple_choice',
 'Welcher Vertrag beendete formell den Ersten Weltkrieg?',
 '["Vertrag von Maastricht","Vertrag von Versailles","Vertrag von Rom","Vertrag von Verdun"]', 'Vertrag von Versailles',
 '1919.', 'Der Versailler Vertrag (1919) regelte das Kriegsende — mit harten Bedingungen für Deutschland.'),

('Geschichte', 'Nationalsozialismus', '9', 4, 'multiple_choice',
 'Was war die „Reichspogromnacht"?',
 '["Ein Fest","Die Nacht vom 9./10. November 1938 mit gewaltsamen Übergriffen auf Juden","Eine Wahl","Eine Rede"]', 'Die Nacht vom 9./10. November 1938 mit gewaltsamen Übergriffen auf Juden',
 'Auch „Kristallnacht".', 'In der Reichspogromnacht (9./10. November 1938) wurden Synagogen, jüdische Geschäfte und Wohnungen zerstört. Beginn einer neuen Phase der Verfolgung.')

ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- GEOGRAPHIE (Deutschland, Europa, Welt, Klima)
-- ════════════════════════════════════════════════════════════

INSERT INTO question_bank (subject, topic, grade_level, difficulty, question_type, question_text, options, correct_answer, hint, explanation) VALUES
('Geographie', 'Deutschland', '5', 1, 'multiple_choice',
 'Was ist die Hauptstadt Deutschlands?',
 '["München","Hamburg","Berlin","Köln"]', 'Berlin',
 'Größte Stadt im Osten.', 'Berlin ist seit 1990 wieder die Hauptstadt Deutschlands.'),

('Geographie', 'Deutschland', '5', 1, 'multiple_choice',
 'Wie viele Bundesländer hat Deutschland?',
 '["8","12","16","20"]', '16',
 'Inklusive Stadtstaaten.', 'Deutschland hat 16 Bundesländer — 13 Flächenländer + 3 Stadtstaaten (Berlin, Hamburg, Bremen).'),

('Geographie', 'Deutschland', '6', 2, 'multiple_choice',
 'Welcher Fluss fließt durch Köln?',
 '["Donau","Rhein","Elbe","Main"]', 'Rhein',
 'Größter Fluss Deutschlands.', 'Der Rhein fließt durch Köln, Düsseldorf und Bonn — wichtiger Fluss in NRW.'),

('Geographie', 'Deutschland', '5', 1, 'multiple_choice',
 'Welches Bundesland liegt im Süden Deutschlands an Österreich?',
 '["Hessen","Bayern","Sachsen","Saarland"]', 'Bayern',
 'Größtes Bundesland.', 'Bayern ist das südlichste und flächenmäßig größte Bundesland — Hauptstadt: München.'),

('Geographie', 'Deutschland', '6', 2, 'multiple_choice',
 'In welchem Bundesland liegt Neckarsulm?',
 '["Bayern","Baden-Württemberg","Hessen","NRW"]', 'Baden-Württemberg',
 'Im Süden.', 'Neckarsulm liegt in Baden-Württemberg, Landkreis Heilbronn.'),

('Geographie', 'Europa', '5', 1, 'multiple_choice',
 'Was ist die Hauptstadt Frankreichs?',
 '["Marseille","Paris","Lyon","Madrid"]', 'Paris',
 'Eiffelturm.', 'Paris ist die Hauptstadt Frankreichs.'),

('Geographie', 'Europa', '5', 1, 'multiple_choice',
 'Was ist die Hauptstadt Italiens?',
 '["Mailand","Venedig","Rom","Florenz"]', 'Rom',
 'Kolosseum.', 'Rom ist die Hauptstadt Italiens — Sitz des Vatikans und Wiege der Antike.'),

('Geographie', 'Europa', '6', 2, 'multiple_choice',
 'Was ist die Hauptstadt Spaniens?',
 '["Barcelona","Madrid","Lissabon","Valencia"]', 'Madrid',
 'In der Mitte des Landes.', 'Madrid ist die Hauptstadt Spaniens — im Zentrum des Landes.'),

('Geographie', 'Europa', '6', 2, 'multiple_choice',
 'Welches Land ist KEIN EU-Mitglied?',
 '["Deutschland","Frankreich","Schweiz","Italien"]', 'Schweiz',
 'Nicht in der EU, mit eigenem Franken.', 'Die Schweiz ist kein EU-Mitglied — sie ist Nicht-EU mit bilateralen Verträgen.'),

('Geographie', 'Europa', '7', 2, 'multiple_choice',
 'Welcher ist der längste Fluss Europas?',
 '["Rhein","Donau","Wolga","Themse"]', 'Wolga',
 'In Russland.', 'Die Wolga (ca. 3530 km) ist der längste Fluss Europas, fließt durch Russland.'),

('Geographie', 'Welt', '6', 2, 'multiple_choice',
 'Welcher Kontinent ist der größte?',
 '["Afrika","Asien","Europa","Amerika"]', 'Asien',
 'Russland, China, Indien...', 'Asien ist mit ca. 44,6 Mio. km² der größte Kontinent.'),

('Geographie', 'Welt', '6', 2, 'multiple_choice',
 'Welcher Ozean ist der größte?',
 '["Atlantischer","Pazifischer","Indischer","Arktischer"]', 'Pazifischer',
 'Zwischen Asien und Amerika.', 'Der Pazifische Ozean ist mit ca. 165 Mio. km² der größte Ozean.'),

('Geographie', 'Welt', '7', 3, 'multiple_choice',
 'Wo liegt das höchste Gebirge der Welt?',
 '["Anden","Rocky Mountains","Alpen","Himalaya"]', 'Himalaya',
 'Mount Everest.', 'Der Himalaya liegt in Asien — mit dem Mount Everest (8848 m) als höchstem Berg.'),

('Geographie', 'Klima', '7', 2, 'multiple_choice',
 'Welche Klimazone hat Deutschland überwiegend?',
 '["Tropisch","Wüste","Gemäßigte Zone","Polar"]', 'Gemäßigte Zone',
 'Vier Jahreszeiten.', 'Deutschland liegt in der gemäßigten Klimazone — mit 4 Jahreszeiten und mäßigen Temperaturen.'),

('Geographie', 'Klima', '8', 3, 'multiple_choice',
 'Was ist der Treibhauseffekt?',
 '["Heizungsausfall","Erwärmung der Erde durch Gase, die Wärme zurückhalten","Wolken am Himmel","Schmelzendes Gletschereis"]', 'Erwärmung der Erde durch Gase, die Wärme zurückhalten',
 'CO2, Methan.', 'Der Treibhauseffekt: Treibhausgase (CO2, Methan, Wasserdampf) halten Wärme in der Atmosphäre — natürlich + verstärkt durch den Menschen.'),

('Geographie', 'Klima', '8', 3, 'multiple_choice',
 'Welches Gas ist hauptsächlich für den menschengemachten Klimawandel verantwortlich?',
 '["Sauerstoff","Kohlenstoffdioxid (CO2)","Stickstoff","Wasserstoff"]', 'Kohlenstoffdioxid (CO2)',
 'Aus Auto- und Industrieabgasen.', 'CO2 aus der Verbrennung von Kohle, Öl und Gas ist der größte Verursacher der menschengemachten Erderwärmung.'),

('Geographie', 'Deutschland', '7', 2, 'multiple_choice',
 'Welches Bundesland ist KEIN Stadtstaat?',
 '["Berlin","Hamburg","Bayern","Bremen"]', 'Bayern',
 'Stadtstaaten sind Städte, die Bundesländer sind.', 'Die 3 Stadtstaaten: Berlin, Hamburg, Bremen. Bayern ist ein Flächenstaat.'),

('Geographie', 'Welt', '7', 3, 'multiple_choice',
 'In welchem Land liegt die Sahara-Wüste?',
 '["nur in Ägypten","Nordafrika (mehrere Länder)","Südafrika","Asien"]', 'Nordafrika (mehrere Länder)',
 'Größte heiße Wüste der Welt.', 'Die Sahara erstreckt sich über 11 nordafrikanische Länder — Algerien, Ägypten, Libyen, Marokko, Tunesien u. a.'),

('Geographie', 'Welt', '7', 3, 'multiple_choice',
 'Welcher Fluss ist der längste der Welt?',
 '["Amazonas","Nil","Mississippi","Donau"]', 'Nil',
 'Stark umstritten — meist Nil genannt.', 'Der Nil (ca. 6650 km) gilt traditionell als der längste Fluss — auch wenn der Amazonas in einigen Messungen knapp länger ist.'),

('Geographie', 'Plattentektonik', '8', 3, 'multiple_choice',
 'Was sind Kontinentalplatten?',
 '["Geschirr","Große Stücke der Erdkruste, die sich bewegen","Vulkanasche","Felsen am Strand"]', 'Große Stücke der Erdkruste, die sich bewegen',
 'Tektonik.', 'Die Erdkruste besteht aus Platten, die langsam wandern — verursachen Erdbeben, Vulkane und Gebirgsbildung.'),

('Geographie', 'Plattentektonik', '8', 3, 'multiple_choice',
 'Was passiert, wenn sich zwei Kontinentalplatten zusammenschieben?',
 '["Vulkane verschwinden","Es bildet sich ein Gebirge","Ein See entsteht","Der Boden wird weich"]', 'Es bildet sich ein Gebirge',
 'So entstand der Himalaya.', 'Wenn Platten kollidieren, entstehen Gebirge — z. B. der Himalaya durch die indische Platte gegen die eurasische.'),

('Geographie', 'Vulkane', '8', 3, 'multiple_choice',
 'Was ist Magma?',
 '["Asche aus dem Schornstein","Geschmolzenes Gestein unter der Erdoberfläche","Eine harte Steinsorte","Vulkanrauch"]', 'Geschmolzenes Gestein unter der Erdoberfläche',
 'Wenn es austritt: Lava.', 'Magma = geschmolzenes Gestein im Erdinneren. An der Oberfläche heißt es Lava.'),

('Geographie', 'Klima', '9', 3, 'multiple_choice',
 'Was ist der Unterschied zwischen Wetter und Klima?',
 '["Es gibt keinen","Wetter = kurzfristig, Klima = langfristiger Durchschnitt","Wetter = warm, Klima = kalt","Klima = nur im Winter"]', 'Wetter = kurzfristig, Klima = langfristiger Durchschnitt',
 'Klima über ~30 Jahre.', 'Wetter ist der Zustand der Atmosphäre jetzt (heute regnet es). Klima ist der durchschnittliche Wetterzustand über lange Zeiträume (z. B. 30 Jahre).'),

('Geographie', 'Europa', '6', 2, 'multiple_choice',
 'Welches ist das größte Land Europas (nach Fläche, ohne Russland)?',
 '["Deutschland","Frankreich","Spanien","Italien"]', 'Frankreich',
 'In Westeuropa.', 'Frankreich ist mit ca. 643.000 km² das größte EU-Land (Frankreich ohne Übersee: ca. 552.000 km²).'),

('Geographie', 'Deutschland', '6', 2, 'multiple_choice',
 'Was ist der höchste Berg Deutschlands?',
 '["Brocken","Feldberg","Zugspitze","Watzmann"]', 'Zugspitze',
 'In den Alpen (Bayern).', 'Die Zugspitze (2962 m) in den Bayerischen Alpen ist der höchste Berg Deutschlands.'),

('Geographie', 'Deutschland', '6', 2, 'multiple_choice',
 'An welche Nordsee-Stadt grenzt die Elbmündung?',
 '["Berlin","Hamburg","Bremen","Lübeck"]', 'Hamburg',
 'Großer Hafen.', 'Hamburg liegt an der Elbe, etwa 100 km vor der Nordseemündung — Deutschlands größter Hafen.'),

('Geographie', 'Welt', '8', 3, 'multiple_choice',
 'In welchem Land liegt der Amazonas-Regenwald hauptsächlich?',
 '["Indien","Brasilien","Kongo","Indonesien"]', 'Brasilien',
 'Südamerika.', 'Der Amazonas-Regenwald liegt zu etwa 60% in Brasilien — der größte tropische Regenwald der Erde.'),

('Geographie', 'Welt', '8', 3, 'multiple_choice',
 'Welcher Wendekreis liegt nördlich des Äquators?',
 '["Wendekreis des Steinbocks","Wendekreis des Krebses","Nordpol","Polarkreis"]', 'Wendekreis des Krebses',
 'Bei ca. 23,5° N.', 'Der nördliche Wendekreis (Wendekreis des Krebses) liegt bei 23,5° nördlicher Breite.'),

('Geographie', 'Welt', '7', 3, 'multiple_choice',
 'Wie viele Zeitzonen gibt es auf der Erde?',
 '["12","24","48","8"]', '24',
 'Erde dreht sich in 24h.', 'Die Erde ist in 24 Zeitzonen unterteilt — eine pro Stunde (360°/24 = 15° pro Zone).'),

('Geographie', 'Welt', '9', 4, 'multiple_choice',
 'Was sind die Tropen?',
 '["Kalte Gebiete","Gebiete um den Äquator zwischen den Wendekreisen","Berge","Wüsten"]', 'Gebiete um den Äquator zwischen den Wendekreisen',
 'Heiß und feucht.', 'Tropen = Gebiet zwischen nördlichem und südlichem Wendekreis (jeweils 23,5°) — heißes Klima das ganze Jahr.'),

('Geographie', 'Klima', '9', 4, 'multiple_choice',
 'Welche Folgen hat der Klimawandel?',
 '["Keine","Schmelzende Gletscher, Meeresspiegelanstieg, extremere Wetterereignisse","Mehr Schnee überall","Nur weniger Sonne"]', 'Schmelzende Gletscher, Meeresspiegelanstieg, extremere Wetterereignisse',
 'Mehrere Effekte.', 'Folgen des Klimawandels: Eis schmilzt, Meeresspiegel steigt, mehr Hitzewellen, Dürren, Starkregen, Artensterben.'),

('Geographie', 'Naturphänomene', '8', 3, 'multiple_choice',
 'Wie entstehen Erdbeben?',
 '["Durch Wind","Durch Bewegungen der Erdplatten","Durch Regen","Durch Vulkanasche"]', 'Durch Bewegungen der Erdplatten',
 'Plattentektonik.', 'Erdbeben entstehen, wenn sich Spannungen zwischen Erdplatten plötzlich entladen — meist an Plattengrenzen.'),

('Geographie', 'Naturphänomene', '8', 3, 'multiple_choice',
 'Was misst die Richterskala?',
 '["Windgeschwindigkeit","Stärke von Erdbeben","Regen","Temperatur"]', 'Stärke von Erdbeben',
 'Logarithmische Skala.', 'Die Richterskala (heute oft Momenten-Magnituden-Skala) misst die Stärke von Erdbeben — logarithmisch.'),

('Geographie', 'Welt', '8', 3, 'multiple_choice',
 'Welches Land hat die meisten Einwohner weltweit?',
 '["USA","Russland","Indien","Brasilien"]', 'Indien',
 'Seit 2023.', 'Indien überholte 2023 China als bevölkerungsreichstes Land mit über 1,4 Milliarden Einwohnern.'),

('Geographie', 'Welt', '7', 2, 'multiple_choice',
 'Welcher Kontinent liegt komplett auf der Südhalbkugel?',
 '["Europa","Afrika","Australien","Asien"]', 'Australien',
 'Down under.', 'Australien liegt vollständig auf der Südhalbkugel. (Afrika wird vom Äquator geschnitten.)'),

('Geographie', 'Welt', '6', 2, 'text_input',
 'Wie heißt der Kontinent, auf dem Frankreich liegt?',
 NULL, 'Europa',
 '7 Kontinente.', 'Frankreich liegt in Europa.'),

('Geographie', 'Deutschland', '5', 1, 'text_input',
 'In welchem Bundesland liegt München?',
 NULL, 'Bayern',
 'Stadt im Süden.', 'München ist die Hauptstadt von Bayern.'),

('Geographie', 'Welt', '8', 3, 'multiple_choice',
 'Wie heißt die Linie, die die Erde in Nord- und Südhalbkugel teilt?',
 '["Nullmeridian","Wendekreis","Äquator","Polarkreis"]', 'Äquator',
 'Bei 0° Breite.', 'Der Äquator (0° Breite) teilt die Erde in Nord- und Südhalbkugel.'),

('Geographie', 'Welt', '8', 3, 'multiple_choice',
 'Was ist der Nullmeridian?',
 '["Eine Linie in Berlin","Eine Linie bei 0° Länge durch Greenwich","Der Äquator","Die Datumsgrenze"]', 'Eine Linie bei 0° Länge durch Greenwich',
 'In England.', 'Der Nullmeridian (0° Länge) verläuft durch Greenwich bei London — Bezugspunkt für die Längengrade.'),

('Geographie', 'Klima', '9', 4, 'multiple_choice',
 'Welche Maßnahme reduziert CO2-Emissionen?',
 '["Mehr Kohlekraftwerke","Erneuerbare Energien wie Wind und Sonne","Mehr Flugverkehr","Mehr Autoabgase"]', 'Erneuerbare Energien wie Wind und Sonne',
 'Saubere Energie.', 'Erneuerbare Energien (Wind, Solar, Wasser) erzeugen Strom ohne CO2 — wichtig für den Klimaschutz.')

ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- More Mathematik
-- ════════════════════════════════════════════════════════════

INSERT INTO question_bank (subject, topic, grade_level, difficulty, question_type, question_text, options, correct_answer, hint, explanation) VALUES
('Mathematik', 'Geometrie', '6', 2, 'multiple_choice',
 'Wie viele Grad hat ein Rechter Winkel?',
 '["45°","60°","90°","180°"]', '90°',
 'Wie eine Hausecke.', 'Ein rechter Winkel hat exakt 90°.'),

('Mathematik', 'Geometrie', '7', 2, 'text_input',
 'Wie viele Grad hat die Winkelsumme im Dreieck?',
 NULL, '180',
 'Egal welches Dreieck.', 'Die Winkelsumme im Dreieck beträgt immer 180°.'),

('Mathematik', 'Geometrie', '7', 3, 'text_input',
 'Berechne den Flächeninhalt eines Rechtecks mit Länge 6 cm und Breite 4 cm. (Antwort in cm²)',
 NULL, '24',
 'Länge × Breite.', 'A = l × b = 6 × 4 = 24 cm².'),

('Mathematik', 'Geometrie', '7', 3, 'text_input',
 'Berechne den Umfang eines Quadrats mit Seitenlänge 5 cm. (in cm)',
 NULL, '20',
 '4 × Seitenlänge.', 'Umfang Quadrat = 4 × a = 4 × 5 = 20 cm.'),

('Mathematik', 'Bruchrechnen', '6', 2, 'multiple_choice',
 'Was ist 3/4 + 1/4?',
 '["1","2/4","4/8","3/8"]', '1',
 'Gleiche Nenner: einfach Zähler addieren.', '3/4 + 1/4 = 4/4 = 1.'),

('Mathematik', 'Prozent', '8', 3, 'text_input',
 'Wie viel sind 15% von 200?',
 NULL, '30',
 '15/100 · 200.', '15% von 200 = 0,15 · 200 = 30.'),

('Mathematik', 'Prozent', '8', 3, 'multiple_choice',
 'Ein Pulli kostet 80 €. Er wird um 25% reduziert. Wie viel kostet er jetzt?',
 '["55 €","60 €","65 €","70 €"]', '60 €',
 '25% von 80 abziehen.', '25% von 80 = 20 €. Reduzierter Preis: 80 - 20 = 60 €.'),

('Mathematik', 'Gleichungen', '8', 3, 'text_input',
 'Löse: 5x − 7 = 18. Was ist x?',
 NULL, '5',
 '+7, dann ÷5.', '5x − 7 = 18 → 5x = 25 → x = 5.'),

('Mathematik', 'Gleichungen', '9', 4, 'text_input',
 'Löse: 2x + 4 = 3x − 1. Was ist x?',
 NULL, '5',
 'Alle x auf eine Seite.', '2x + 4 = 3x − 1 → 4 + 1 = 3x − 2x → 5 = x.'),

('Mathematik', 'Statistik', '8', 3, 'text_input',
 'Was ist der Mittelwert von 4, 8, 12?',
 NULL, '8',
 'Summe ÷ Anzahl.', '(4 + 8 + 12) / 3 = 24 / 3 = 8.'),

('Mathematik', 'Statistik', '8', 3, 'text_input',
 'Was ist der Median von 3, 7, 5, 9, 1?',
 NULL, '5',
 'Erst sortieren!', 'Sortiert: 1, 3, 5, 7, 9. Median = mittlerer Wert = 5.'),

('Mathematik', 'Pythagoras', '9', 4, 'multiple_choice',
 'Pythagoras: a² + b² = ?',
 '["c","c²","2c","c³"]', 'c²',
 'Quadrat der Hypotenuse.', 'Im rechtwinkligen Dreieck: a² + b² = c² (c ist die Hypotenuse).'),

('Mathematik', 'Pythagoras', '9', 4, 'text_input',
 'Pythagoras: Bei a=3, b=4, wie lang ist c?',
 NULL, '5',
 '3² + 4² = c².', '9 + 16 = 25 → c = √25 = 5.'),

('Mathematik', 'Funktionen', '9', 4, 'multiple_choice',
 'Welche Steigung hat die Gerade y = 2x + 3?',
 '["2","3","2x","5"]', '2',
 'Faktor vor x.', 'Bei y = mx + b ist m die Steigung. Also m = 2.'),

('Mathematik', 'Wurzel', '8', 3, 'text_input',
 'Was ist √64?',
 NULL, '8',
 '8 · 8 = 64.', '√64 = 8, weil 8 · 8 = 64.'),

('Mathematik', 'Negative Zahlen', '7', 2, 'text_input',
 'Was ist (-3) + (-7)?',
 NULL, '-10',
 'Beide negativ: addieren und Minus.', '(-3) + (-7) = -10.'),

('Mathematik', 'Negative Zahlen', '7', 2, 'text_input',
 'Was ist 5 − (−3)?',
 NULL, '8',
 'Minus mal Minus = Plus.', '5 − (−3) = 5 + 3 = 8.'),

('Mathematik', 'Bruchrechnen', '6', 3, 'multiple_choice',
 'Was ist 2/3 · 3/4?',
 '["6/7","6/12","1/2","2/12"]', '1/2',
 'Zähler · Zähler, Nenner · Nenner.', '2/3 · 3/4 = (2·3)/(3·4) = 6/12 = 1/2.'),

('Mathematik', 'Bruchrechnen', '6', 3, 'multiple_choice',
 'Was ist 5/6 - 1/3?',
 '["4/3","4/6","1/2","5/3"]', '1/2',
 'Gleiche Nenner machen.', '1/3 = 2/6. Also 5/6 - 2/6 = 3/6 = 1/2.'),

('Mathematik', 'Geometrie', '8', 3, 'text_input',
 'Wie viele Grad hat ein Vollkreis?',
 NULL, '360',
 'Ganze Drehung.', 'Ein Vollkreis hat 360°.')
ON CONFLICT DO NOTHING;
