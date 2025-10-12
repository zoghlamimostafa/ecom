@echo off
title Test Admin Panel

echo Test du demarrage de l'admin panel...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\admin-app"

echo Repertoire actuel: %CD%

echo Verification des fichiers essentiels...
if exist "package.json" (
    echo ✅ package.json existe
) else (
    echo ❌ package.json manquant
    pause
    exit /b 1
)

if exist "src" (
    echo ✅ dossier src existe
) else (
    echo ❌ dossier src manquant
    pause
    exit /b 1
)

if exist "node_modules" (
    echo ✅ node_modules existe
) else (
    echo ❌ node_modules manquant - Installation...
    npm install --legacy-peer-deps
)

echo.
echo Demarrage admin panel sur port 3001...
set PORT=3001
npm start

pause