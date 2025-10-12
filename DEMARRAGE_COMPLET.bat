@echo off
title Sanny Store - Demarrage Complet

echo.
echo =============================================
echo      SANNY STORE - DEMARRAGE COMPLET
echo =============================================
echo.
echo Ce script va demarrer tous les services:
echo.
echo   🔧 Backend  : http://localhost:5000
echo   🖥️  Client   : http://localhost:3000  
echo   ⚙️  Admin    : http://localhost:3001
echo.
echo =============================================
echo.

echo 📋 1/3 - Demarrage du Backend...
start "Sanny Backend" cmd /c "%~dp0START_BACKEND.bat"

echo ⏳ Attente 5 secondes...
timeout /t 5 /nobreak > nul

echo 📋 2/3 - Demarrage du Client...
start "Sanny Client" cmd /c "%~dp0START_CLIENT.bat"

echo ⏳ Attente 5 secondes...
timeout /t 5 /nobreak > nul

echo 📋 3/3 - Demarrage de l'Admin...
start "Sanny Admin" cmd /c "%~dp0START_ADMIN.bat"

echo.
echo ✅ Tous les services sont en cours de demarrage !
echo.
echo 🌐 URLs d'acces:
echo    Backend : http://localhost:5000
echo    Client  : http://localhost:3000
echo    Admin   : http://localhost:3001
echo.
echo 📝 Pour arreter un service, fermez sa fenetre ou Ctrl+C
echo.

echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul