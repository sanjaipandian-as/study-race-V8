# StudyRace — Online stellen in ~20 Minuten

Eine echte URL wie `studyrace.onrender.com`, die von **jedem Gerät** funktioniert
(Handy, iPad, Laptop) — mit echtem Login und Dashboards.

Kosten: **0 €** (Render kostenloser Tarif für Web + Postgres).

---

## Was Claude schon für dich erledigt hat

✅ `render.yaml` (sagt Render: "mach Server + Datenbank + verbinde sie")
✅ Datenbank-Schema lädt sich beim ersten Start **automatisch** (keine SQL-Datei
   manuell hochladen)
✅ `JWT_SECRET` wird von Render automatisch erzeugt
✅ Adresse, E-Mail, Bilder, Tabs — alles ist drin

**Du musst nur noch:** Konten erstellen und 6 Knöpfe drücken.

---

## Schritt 1 — GitHub-Konto (5 Minuten)

GitHub ist nur ein Zwischenspeicher für den Code. Render holt sich von dort.

1. Auf **https://github.com** → "Sign up"
2. E-Mail + Passwort + Username wählen
3. E-Mail bestätigen (im Posteingang nachsehen)

---

## Schritt 2 — Code zu GitHub hochladen (5 Minuten)

1. Eingeloggt bei GitHub → grüner Knopf **"New"** (links oben)
2. Repository-Name: `studyrace`
3. Auf **"Private"** stellen
4. Knopf **"Create repository"**
5. Auf der nächsten Seite: Link **"uploading an existing file"** anklicken
6. Den **entpackten Inhalt** vom `studyrace_v8_fixed`-Ordner per Drag-and-Drop
   ins Browser-Fenster ziehen (alle Dateien & Ordner auf einmal markieren)
7. Warten, bis alle Dateien hochgeladen sind
8. Unten auf **"Commit changes"** klicken

---

## Schritt 3 — Render-Konto (2 Minuten)

1. Auf **https://render.com** → "Get Started"
2. **"GitHub"** als Anmeldemethode wählen → dein GitHub-Konto verknüpfen
3. Render fragt nach Berechtigung — bestätigen

---

## Schritt 4 — Deployen (3 Minuten)

1. Bei Render eingeloggt → blauer Knopf **"New +"** (oben rechts)
2. **"Blueprint"** auswählen
3. Bei "Connect a repository": das `studyrace`-Repo anklicken → **"Connect"**
4. Render liest die `render.yaml` automatisch und zeigt:
   - **studyrace** (Web Service) — gratis
   - **studyrace-db** (PostgreSQL) — gratis
5. Unten: **"Apply"** klicken

Render baut jetzt alles auf. Das dauert **3–5 Minuten** — Kaffee holen.

---

## Schritt 5 — URL holen ✨

Auf dem Dashboard von Render erscheint **studyrace** als Web Service.
Anklicken → die URL steht oben, sieht aus wie:

```
https://studyrace.onrender.com
```

**Das ist deine echte URL.** Funktioniert auf jedem Handy, jedem Laptop,
jedem Tablet, weltweit.

---

## Schritt 6 — Test-Logins (gleich da)

Auf der URL → "Anmelden" → diese Test-Accounts gehen sofort
(alle Passwort: `test1234`):

| Rolle        | E-Mail                      |
|--------------|-----------------------------|
| Super-Admin  | `admin@studyrace.de`        |
| Schul-Admin  | `schule@studyrace.de`       |
| Lehrkraft    | `lehrer@studyrace.de`       |
| Schüler:in   | `schueler@studyrace.de`     |

---

## Wichtig zu wissen

**Schlaf-Modus auf dem Gratis-Tarif:** Nach ~15 Minuten ohne Besucher legt
sich der Server schlafen. Der nächste Aufruf braucht **30–50 Sekunden**, bis
er wieder wach ist — danach läuft alles normal schnell.

Für die Jury beim Wettbewerb ist das fast nie ein Problem. Falls doch:
einfach 1 Minute vor dem Termin selbst die URL aufrufen → Server wach →
flüssig demonstrieren.

Für 7 €/Monat lässt sich der Schlaf-Modus später abschalten — aber für
den Wettbewerb reicht der Gratis-Tarif locker.

---

## Wenn was klemmt

Wo auch immer du hängst — schreib mir die Schritt-Nummer und was du siehst,
und ich helfe sofort weiter.
