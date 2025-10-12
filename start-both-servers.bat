@echo off
echo ========================================
echo Demarrage des serveurs Sanny Store
echo ========================================

echo.
echo 1. Demarrage du Backend...
cd /d "C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\backend"
start "Backend Server" cmd /k "node index.js"

echo.
echo 2. Attente de 5 secondes...
timeout /t 5 /nobreak > nul

echo.
echo 3. Demarrage de l'Admin...
cd /d "C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\admin-app"
start "Admin App" cmd /k "npm start"

echo.
echo ========================================
echo Les deux serveurs sont en cours de demarrage
echo Backend: http://localhost:4000
echo Admin: http://localhost:3001
echo ========================================
pause
