<!-- Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved. -->
# StudyRace — v7

**Adaptive Lernplattform für deutsche Schulen.** Klassen 5–10, Mathe/Physik/Chemie/Biologie.

---

## Test-Logins

Alle 4 Rollen mit gleichem Passwort, damit du jede Ansicht testen kannst:

| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| **Super-Admin** | `admin@studyrace.de` | `test1234` |
| **Schul-Admin** | `schule@studyrace.de` | `test1234` |
| **Lehrkraft** | `lehrer@studyrace.de` | `test1234` |
| **Schüler:in** | `schueler@studyrace.de` | `test1234` |

Login auf `/login` — die Seite erkennt die Rolle automatisch und leitet zum richtigen Dashboard weiter.

**Mit dabei:** Demo-Schule "Demo-Gymnasium Mainz" mit Test-Klasse 8B (Mathe, Lehrkraft Hr. Schmidt) und Schülerin Lena Müller (740 XP, 5 Tage Streak) + Demo-Aufgabe.

⚠ **Sicherheit:** `test1234` ist absichtlich schwach. Vor Live-Betrieb sofort ändern oder die Test-Accounts löschen.

---

## Lokal testen (Windows)

**Voraussetzungen** (einmalig installieren):
1. **Node.js** — https://nodejs.org/de/ (v18+)
2. **PostgreSQL** — https://www.postgresql.org/download/windows/
   - Bei der Installation: Passwort für `postgres`-User merken!
   - Port `5432` lassen.

**Setup** (in PowerShell, im Hauptordner studyrace/):

```powershell
.\local-setup.ps1
```

Das Script macht alles automatisch: Datenbank anlegen, Schema einlesen, Test-Accounts seeden, `.env` schreiben, `npm install`.

**Server starten:**

```powershell
npm start
```

Browser öffnen: **http://localhost:3000**

### Falls das Script Probleme macht — manuell

```powershell
# Datenbank anlegen
psql -U postgres -c "CREATE DATABASE studyrace;"
psql -U postgres -d studyrace -f database/schema.sql
psql -U postgres -d studyrace -f database/seed.sql

# .env anlegen — kopiere .env.example zu .env, passe DB_PASSWORD an
copy .env.example .env

# Dependencies + start
npm install
npm start
```

---

## Server-Deploy (Netcup)

```bash
ssh root@152.53.182.33
# Per WinSCP studyrace_v7.zip nach /root/ hochladen
unzip studyrace_v7.zip -d studyrace
cd studyrace
bash deploy/setup.sh
```

Nach 5–10 Minuten ist alles live unter `https://studyrace.de`.

**Wichtig:** Cloudflare-DNS für `@` und `www` muss auf 152.53.182.33 zeigen, **Proxy aus** (graue Wolke) für Let's Encrypt.

---

## Was ist neu in v7.1

- **🎯 Üben — Adaptive Lern-Engine:**
  - 48 echte Übungsfragen (12 pro Fach: Mathe, Physik, Chemie, Biologie)
  - Lehrplan-konform für Klassen 7–10
  - Adaptive Schwierigkeit: System wählt nächste Frage basierend auf Skill-Level (1.0–5.0)
  - Multiple Choice + Texteingabe
  - Sofort-Feedback mit Erklärung
  - Echte XP für richtige Antworten

## Was ist neu in v7

- **Multi-Page-Architektur:** Echte separate Seiten statt Scroll-Landing
  - `/` Homepage (Hero, kurze Vorteile, dezenter Pricing-Hinweis am Ende)
  - `/funktionen` — Feature-Seite
  - `/preise` — 4 Tarife (NICHT in Hauptnav, dezent)
  - `/kontakt` — Kontaktformular
  - `/login` — eine Form, erkennt Rolle aus E-Mail
  - `/dashboard` — leitet je nach Rolle automatisch weiter
- **Pricing dezent:** Nicht in Hauptnav — nur Footer + subtil am Ende der Homepage
- **50/50 Foto-Balance:** Jungen & Mädchen + gemischte Klassen
- **Erweiterte Dashboards** — alle 4 Rollen mit vielen Sektionen:
  - **Schüler:in:** Übersicht · Hausaufgaben · Stundenplan · Nachrichten · Materialien · Fortschritt · Klassenrennen
  - **Lehrkraft:** Übersicht · Klassen · Aufgaben · Schüler-Fortschritt · Nachrichten · Ankündigungen · Materialien
  - **Schul-Admin:** Übersicht · Lehrkräfte · Schüler · Klassen · Analysen · Berichte · Ankündigungen · Einstellungen
  - **Super-Admin:** Übersicht · Schulen (mit Approval-Flow) · Nutzer · System · Audit-Log · Berechtigungen
- **Backend:** Mix aus echten DB-Daten und Platzhaltern

---

## Tech-Stack

- Frontend: HTML + JS, kein Build-Step nötig
- Backend: Node.js + Express
- Datenbank: PostgreSQL (lokal + Server identisch)
- Auth: bcryptjs + JWT in HttpOnly-Cookie
- Hosting: Netcup VPS, nginx + Let's Encrypt

---

## Projektstruktur

```
studyrace/
├── backend/             Node.js + Express server
│   ├── server.js        Routen, Middleware
│   ├── routes/          auth.js, data.js
│   ├── middleware/      auth.js (JWT-Prüfung)
│   └── lib/             db.js (Postgres-Pool)
├── database/
│   ├── schema.sql       Tabellen + Default-Admin
│   └── seed.sql         Test-Accounts (Demo-Schule, Lena Müller, etc.)
├── deploy/
│   └── setup.sh         Auto-Deploy auf Netcup
├── public/              Frontend (HTML + CSS)
│   ├── index.html       Homepage
│   ├── funktionen.html  /funktionen
│   ├── preise.html      /preise
│   ├── kontakt.html     /kontakt
│   ├── login.html       /login
│   ├── site.css         Hauptseiten-Styles
│   ├── dashboard.css    Dashboard-Styles
│   ├── api.js           SR.login(), SR.get(), etc.
│   ├── images/          ~27 Fotos (Jungs/Mädchen/Klassen)
│   └── app/             Dashboards für alle 4 Rollen
├── .env.example         Konfig-Template
├── local-setup.ps1      Windows-Setup-Script
├── package.json
└── README.md            Diese Datei
```
