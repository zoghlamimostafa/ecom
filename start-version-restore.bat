@echo off
cls
echo ========================================
echo    SANNY STORE - VERSION RESTAURÉE
echo    Version du 28/09/2025 - 10:00
echo ========================================
echo.

echo [1/4] Nettoyage des processus...
taskkill /IM node.exe /F 2>NUL
timeout /t 2 /nobreak >NUL

echo [2/4] Démarrage du backend...
start "SANNY BACKEND" /min cmd /k "cd /d C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend && echo 🔧 Backend démarré && node index.js"
timeout /t 5 /nobreak >NUL

echo [3/4] Démarrage du frontend...
start "SANNY FRONTEND" cmd /k "cd /d C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client && echo ⚛️  Frontend démarré && npm start"
timeout /t 8 /nobreak >NUL

echo [4/4] Ouverture de l'application...
timeout /t 15 /nobreak
start http://localhost:3000

echo.
echo ========================================
echo     APPLICATION SANNY STORE LANCÉE
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:4000
echo.
echo ✅ Version restaurée du 28/09/2025 - 10:00
echo 📱 L'application s'ouvrira automatiquement
echo.
pause