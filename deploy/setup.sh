#!/bin/bash
# Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
# ════════════════════════════════════════════════
# StudyRace — One-shot Netcup VPS deployment
# Run as root on a fresh Ubuntu 24.04 server
# Usage: bash deploy/setup.sh
# ════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
say() { echo -e "${GREEN}▸${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
err() { echo -e "${RED}✗${NC} $1"; exit 1; }

# ───── Sanity check ─────
[ "$EUID" -ne 0 ] && err "Bitte als root ausführen (sudo bash deploy/setup.sh)"

DOMAIN="${DOMAIN:-studyrace.de}"
DB_PASSWORD="${DB_PASSWORD:-$(openssl rand -hex 16)}"
JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
APP_DIR="/var/www/Study-race-V8"

say "Domain: $DOMAIN"
say "App-Verzeichnis: $APP_DIR"

# ───── Update + install packages ─────
say "System aktualisieren..."
apt-get update -qq
apt-get upgrade -y -qq

say "Pakete installieren (Node.js 20, PostgreSQL, nginx, Certbot)..."
apt-get install -y -qq curl ca-certificates gnupg postgresql postgresql-contrib nginx certbot python3-certbot-nginx ufw unzip

if ! command -v node &>/dev/null || [[ ! "$(node -v)" =~ ^v20 ]]; then
  say "Node.js 20 installieren..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi

# ───── PostgreSQL setup ─────
say "PostgreSQL einrichten..."
systemctl enable postgresql --now

sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='studyrace'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER studyrace WITH PASSWORD '$DB_PASSWORD';"

sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='studyrace'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE studyrace OWNER studyrace;"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE studyrace TO studyrace;" >/dev/null

# ───── Copy app files ─────
say "App-Dateien kopieren..."
mkdir -p "$APP_DIR"
# Copy from current dir (assumes you ran setup.sh from project root)
SOURCE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cp -r "$SOURCE_DIR/backend" "$APP_DIR/"
cp -r "$SOURCE_DIR/public" "$APP_DIR/"
cp -r "$SOURCE_DIR/database" "$APP_DIR/"
cp "$SOURCE_DIR/package.json" "$APP_DIR/"

# ───── Initialize DB schema ─────
say "Datenbank-Schema einlesen..."
PGPASSWORD="$DB_PASSWORD" psql -h localhost -U studyrace -d studyrace -f "$APP_DIR/database/schema.sql"

# ───── Seed Test-Accounts ─────
if [ -f "$APP_DIR/database/seed.sql" ]; then
  say "Test-Accounts einsetzen (admin/schule/lehrer/schueler @studyrace.de · Passwort: test1234)..."
  PGPASSWORD="$DB_PASSWORD" psql -h localhost -U studyrace -d studyrace -f "$APP_DIR/database/seed.sql"
fi

if [ -f "$APP_DIR/database/seed_questions.sql" ]; then
  say "Question Bank einsetzen (48 Übungsfragen, alle Fächer)..."
  PGPASSWORD="$DB_PASSWORD" psql -h localhost -U studyrace -d studyrace -f "$APP_DIR/database/seed_questions.sql"
fi

if [ -f "$APP_DIR/database/seed_questions_v2.sql" ]; then
  say "Zusätzliche Übungsfragen einsetzen (~50 weitere)..."
  PGPASSWORD="$DB_PASSWORD" psql -h localhost -U studyrace -d studyrace -f "$APP_DIR/database/seed_questions_v2.sql"
fi

if [ -f "$APP_DIR/database/seed_achievements.sql" ]; then
  say "Achievements einsetzen..."
  PGPASSWORD="$DB_PASSWORD" psql -h localhost -U studyrace -d studyrace -f "$APP_DIR/database/seed_achievements.sql"
fi

# ───── npm install ─────
say "npm install..."
cd "$APP_DIR"
npm install --omit=dev --silent

# ───── Environment file ─────
say ".env Datei schreiben..."
cat > "$APP_DIR/.env" <<EOF
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studyrace
DB_USER=studyrace
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
EOF
chmod 600 "$APP_DIR/.env"

# ───── systemd service ─────
say "systemd-Service einrichten..."
cat > /etc/systemd/system/Study-race-V8.service <<EOF
[Unit]
Description=Study-race-V8 Node.js App
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/bin/node $APP_DIR/backend/server.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=Study-race-V8

[Install]
WantedBy=multi-user.target
EOF

chown -R www-data:www-data "$APP_DIR"
systemctl daemon-reload
systemctl enable Study-race-V8
systemctl restart Study-race-V8

# ───── Wait for app to come up ─────
sleep 3
if ! curl -sf http://127.0.0.1:3000/api/health >/dev/null; then
  warn "App antwortet nicht auf Port 3000 — Logs prüfen mit: journalctl -u Study-race-V8 -n 50"
fi

# ───── nginx ─────
say "nginx konfigurieren..."
cat > /etc/nginx/sites-available/Study-race-V8 <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 5M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
    }
}
EOF

ln -sf /etc/nginx/sites-available/Study-race-V8 /etc/nginx/sites-enabled/Study-race-V8
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl restart nginx

# ───── Firewall ─────
say "Firewall (UFW) einrichten..."
ufw --force reset >/dev/null
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

# ───── SSL via Let's Encrypt ─────
say "SSL-Zertifikat (Let's Encrypt) anfragen..."
warn "Stelle sicher, dass DNS für $DOMAIN auf diesen Server zeigt!"
warn "Falls DNS noch nicht propagiert ist, überspringen wir SSL — du kannst es später mit:"
warn "  certbot --nginx -d $DOMAIN -d www.$DOMAIN"
warn "nachholen."
echo ""

if host "$DOMAIN" >/dev/null 2>&1 && [ "$(host "$DOMAIN" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | head -1)" = "$(curl -s ifconfig.me)" ]; then
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect || warn "SSL fehlgeschlagen — manuell mit 'certbot --nginx' nachholen"
else
  warn "DNS zeigt noch nicht auf diesen Server. SSL übersprungen."
fi

# ───── Done ─────
echo ""
echo "════════════════════════════════════════"
echo -e "${GREEN}✓ Deployment abgeschlossen!${NC}"
echo "════════════════════════════════════════"
echo ""
echo "  Website:           https://$DOMAIN"
echo "  Backend-Port:      3000 (intern)"
echo "  Datenbank:         PostgreSQL (lokal)"
echo "  App-Verzeichnis:   $APP_DIR"
echo ""
echo "  Super-Admin Login: admin@studyrace.de"
echo "  Standard-Passwort: changeme123"
echo -e "  ${YELLOW}WICHTIG: Sofort nach dem ersten Login das Passwort ändern!${NC}"
echo ""
echo "  Datenbank-Passwort: $DB_PASSWORD"
echo "  JWT-Secret:         (in $APP_DIR/.env)"
echo ""
echo "  Logs ansehen:        journalctl -u Study-race-V8 -f"
echo "  Service neustarten:  systemctl restart Study-race-V8"
echo "  nginx neuladen:      systemctl reload nginx"
echo ""
