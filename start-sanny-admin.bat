@echo off
echo ========================================
echo    DEMARRAGE SANNY STORE ADMIN
echo ========================================
echo.

echo 1. Demarrage du serveur backend...
echo Repertoire: C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend
start "Backend Server" cmd /k "cd /d C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend && npm start"

echo.
echo 2. Attente de 5 secondes pour que le backend demarre...
timeout /t 5 /nobreak

echo.
echo 3. Demarrage de l'interface admin...
echo Repertoire: C:\xampp\htdocs\sanny\san\ecomerce_sanny\admin-app
start "Admin Interface" cmd /k "cd /d C:\xampp\htdocs\sanny\san\ecomerce_sanny\admin-app && npm start"

echo.
echo ========================================
echo   SERVICES SANNY STORE LANCES
echo ========================================
echo Backend:  http://localhost:4000
echo Admin:    http://localhost:3001
echo.
echo Les deux services vont s'ouvrir dans des fenetres separees.
echo Attendez quelques secondes puis ouvrez http://localhost:3001
echo.
pause