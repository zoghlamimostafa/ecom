@echo off
title Test Client React

echo Test du demarrage du client React...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client"

echo Repertoire actuel: %CD%

echo Verification des fichiers essentiels...
if exist "package.json" (
    echo ✅ package.json existe
) else (
    echo ❌ package.json manquant
    pause
    exit /b 1
)

if exist "src\index.js" (
    echo ✅ src\index.js existe
) else (
    echo ❌ src\index.js manquant
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
echo Demarrage avec react-scripts...
set PORT=3000
npm start

pause