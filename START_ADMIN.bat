@echo off
title Sanny Store - Admin Panel

echo.
echo ========================================
echo    SANNY STORE - ADMIN PANEL
echo ========================================
echo.

cd /d "%~dp0admin-app"

if not exist "node_modules" (
    echo 📦 Installation des dependances...
    npm install --legacy-peer-deps
    echo.
)

echo 🚀 Demarrage de l'admin panel...
echo 🌐 Ouverture: http://localhost:3001
echo.
echo ⚠️  Appuyez sur Ctrl+C pour arreter
echo.

set PORT=3001
npm start

pause