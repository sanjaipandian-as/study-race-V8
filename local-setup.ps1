# Copyright (c) 2026 Sharvesh Vijayakumar. All rights reserved.
# ============================================================
# StudyRace - Local Setup for Windows
# ============================================================
# Prerequisites (install once):
#   1) Node.js     https://nodejs.org/  (v18+)
#   2) PostgreSQL  https://www.postgresql.org/download/windows/
#
# Run in PowerShell from the studyrace/ folder:
#   .\local-setup.ps1
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  StudyRace - Local Setup" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

# ---------- 1. Check Node.js ----------
Write-Host "[1/6] Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVer = node --version
    Write-Host "  [OK] Node.js found: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "  [FAIL] Node.js not found. Install from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# ---------- 2. Check PostgreSQL ----------
Write-Host ""
Write-Host "[2/6] Checking PostgreSQL..." -ForegroundColor Cyan
$psqlPath = $null
$candidates = @(
    "C:\Program Files\PostgreSQL\17\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe"
)
foreach ($c in $candidates) {
    if (Test-Path $c) { $psqlPath = $c; break }
}
if (-not $psqlPath) {
    try {
        $null = Get-Command psql -ErrorAction Stop
        $psqlPath = "psql"
    } catch {}
}

if (-not $psqlPath) {
    Write-Host "  [FAIL] PostgreSQL not found." -ForegroundColor Red
    Write-Host "  Install from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "  During setup: remember password, keep port 5432." -ForegroundColor Yellow
    exit 1
}
Write-Host "  [OK] PostgreSQL found: $psqlPath" -ForegroundColor Green

# ---------- 3. Postgres password ----------
Write-Host ""
Write-Host "[3/6] Enter your Postgres password:" -ForegroundColor Cyan
Write-Host "      (the password you set during PostgreSQL installation, for user 'postgres')" -ForegroundColor Gray
$pgPassword = Read-Host "  Password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword)
$pgPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
$env:PGPASSWORD = $pgPasswordPlain

# ---------- 4. Create DB + schema ----------
Write-Host ""
Write-Host "[4/6] Creating database 'studyrace'..." -ForegroundColor Cyan

$dbExists = & $psqlPath -h localhost -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='studyrace'" 2>$null
if ($dbExists -eq "1") {
    Write-Host "  -> Database exists, resetting..." -ForegroundColor Yellow
    & $psqlPath -h localhost -U postgres -c "DROP DATABASE studyrace;" | Out-Null
}

& $psqlPath -h localhost -U postgres -c "CREATE DATABASE studyrace;" | Out-Null
Write-Host "  [OK] Database created" -ForegroundColor Green

& $psqlPath -h localhost -U postgres -d studyrace -f "database/schema.sql" | Out-Null
Write-Host "  [OK] Schema loaded" -ForegroundColor Green

& $psqlPath -h localhost -U postgres -d studyrace -f "database/seed.sql" | Out-Null
Write-Host "  [OK] Test accounts seeded" -ForegroundColor Green

if (Test-Path "database/seed_questions.sql") {
    & $psqlPath -h localhost -U postgres -d studyrace -f "database/seed_questions.sql" | Out-Null
    Write-Host "  [OK] Question bank loaded (48 base questions)" -ForegroundColor Green
}

if (Test-Path "database/seed_questions_v2.sql") {
    & $psqlPath -h localhost -U postgres -d studyrace -f "database/seed_questions_v2.sql" | Out-Null
    Write-Host "  [OK] Additional questions loaded (~50 more)" -ForegroundColor Green
}

if (Test-Path "database/seed_achievements.sql") {
    & $psqlPath -h localhost -U postgres -d studyrace -f "database/seed_achievements.sql" | Out-Null
    Write-Host "  [OK] Achievements seeded" -ForegroundColor Green
}

# ---------- 5. .env file ----------
Write-Host ""
Write-Host "[5/6] Creating .env file..." -ForegroundColor Cyan

$envLines = @(
    "NODE_ENV=development",
    "PORT=3000",
    "",
    "DB_HOST=localhost",
    "DB_PORT=5432",
    "DB_NAME=studyrace",
    "DB_USER=postgres",
    "DB_PASSWORD=$pgPasswordPlain",
    "",
    "JWT_SECRET=studyrace-local-$(Get-Random)"
)
$envLines -join "`r`n" | Out-File -FilePath ".env" -Encoding ASCII -NoNewline
Write-Host "  [OK] .env created" -ForegroundColor Green

# ---------- 6. npm install ----------
Write-Host ""
Write-Host "[6/6] Running npm install..." -ForegroundColor Cyan
npm install --silent
Write-Host "  [OK] Dependencies installed" -ForegroundColor Green

# ---------- Done ----------
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Start the server with:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test logins (password: test1234):" -ForegroundColor Cyan
Write-Host "  admin@studyrace.de    (Super Admin)" -ForegroundColor White
Write-Host "  schule@studyrace.de   (School Admin)" -ForegroundColor White
Write-Host "  lehrer@studyrace.de   (Teacher)" -ForegroundColor White
Write-Host "  schueler@studyrace.de (Student)" -ForegroundColor White
Write-Host ""

# Clear sensitive vars from memory
Remove-Variable -Name pgPasswordPlain -ErrorAction SilentlyContinue
$env:PGPASSWORD = $null
