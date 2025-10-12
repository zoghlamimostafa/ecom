@echo off
title SANNY STORE - Test Integration Complete

color 0A
echo.
echo ========================================================
echo                    SANNY STORE
echo              TEST INTEGRATION COMPLETE
echo ========================================================
echo.

set BACKEND_PORT=4000
set CLIENT_PORT=3000
set ADMIN_PORT=3001

echo 📋 PLAN DE TEST:
echo    1. Demarrage Backend (Port %BACKEND_PORT%)
echo    2. Demarrage Client (Port %CLIENT_PORT%)
echo    3. Demarrage Admin (Port %ADMIN_PORT%)
echo    4. Test connectivite
echo    5. Ouverture navigateurs
echo.

echo ⏳ Attente 3 secondes avant demarrage...
timeout /t 3 /nobreak > nul

echo.
echo 🔧 1/5 - DEMARRAGE BACKEND...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend"
start "Sanny Backend" cmd /c "echo Backend Sanny Store && echo Port: %BACKEND_PORT% && echo. && node index.js && pause"

echo ⏳ Attente backend (5s)...
timeout /t 5 /nobreak > nul

echo.
echo 🖥️ 2/5 - DEMARRAGE CLIENT...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client"
start "Sanny Client" cmd /c "echo Client Sanny Store && echo Port: %CLIENT_PORT% && echo. && set PORT=%CLIENT_PORT% && npm start"

echo ⏳ Attente client (5s)...
timeout /t 5 /nobreak > nul

echo.
echo ⚙️ 3/5 - DEMARRAGE ADMIN...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\admin-app"
start "Sanny Admin" cmd /c "echo Admin Sanny Store && echo Port: %ADMIN_PORT% && echo. && set PORT=%ADMIN_PORT% && npm start"

echo ⏳ Attente admin (8s)...
timeout /t 8 /nobreak > nul

echo.
echo 🌐 4/5 - TEST CONNECTIVITE...

curl -s http://localhost:%BACKEND_PORT% > nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ✅ Backend: ACTIF sur port %BACKEND_PORT%
) else (
    echo ⚠️  Backend: En cours de demarrage...
)

curl -s http://localhost:%CLIENT_PORT% > nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ✅ Client: ACTIF sur port %CLIENT_PORT%
) else (
    echo ⚠️  Client: En cours de demarrage...
)

curl -s http://localhost:%ADMIN_PORT% > nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ✅ Admin: ACTIF sur port %ADMIN_PORT%
) else (
    echo ⚠️  Admin: En cours de demarrage...
)

echo.
echo 🚀 5/5 - OUVERTURE NAVIGATEURS...
echo.

echo Ouverture du Backend...
start http://localhost:%BACKEND_PORT%

timeout /t 2 /nobreak > nul

echo Ouverture du Client...
start http://localhost:%CLIENT_PORT%

timeout /t 2 /nobreak > nul

echo Ouverture de l'Admin...
start http://localhost:%ADMIN_PORT%

echo.
echo ========================================================
echo                    ✅ INTEGRATION COMPLETE
echo ========================================================
echo.
echo 🌐 URLs d'acces:
echo    🔧 Backend API : http://localhost:%BACKEND_PORT%
echo    🖥️  Client Web  : http://localhost:%CLIENT_PORT%
echo    ⚙️  Admin Panel : http://localhost:%ADMIN_PORT%
echo.
echo 📋 Services actifs dans des fenetres separees
echo 🛑 Pour arreter: Fermez les fenetres ou Ctrl+C
echo.
echo 📝 Note: Si un service ne repond pas, attendez 30-60s
echo    Les applications React peuvent prendre du temps a compiler
echo.

pause