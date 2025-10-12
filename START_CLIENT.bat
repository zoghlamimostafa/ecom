@echo off
title Sanny Store - Client React

echo.
echo ========================================
echo    SANNY STORE - CLIENT REACT
echo ========================================
echo.

cd /d "%~dp0Client"

if not exist "node_modules" (
    echo 📦 Installation des dependances...
    npm install --legacy-peer-deps
    echo.
)

echo 🚀 Demarrage du client React...
echo 🌐 Ouverture: http://localhost:3000
echo.
echo ⚠️  Appuyez sur Ctrl+C pour arreter
echo.

npm start

pause