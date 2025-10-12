@echo off
title Sanny Store - Backend Node.js

echo.
echo ========================================
echo    SANNY STORE - BACKEND NODE.JS
echo ========================================
echo.

cd /d "%~dp0backend"

if not exist "node_modules" (
    echo 📦 Installation des dependances...
    npm install
    echo.
)

echo 🚀 Demarrage du backend...
echo 🌐 API: http://localhost:5000
echo.
echo ⚠️  Appuyez sur Ctrl+C pour arreter
echo.

npm start

pause