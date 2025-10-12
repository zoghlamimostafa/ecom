@echo off
echo 🚀 DÉMARRAGE APPLICATION E-COMMERCE SANNY
echo.

echo 1️⃣ Démarrage Backend (port 4000)...
start "Backend-Sanny" /min powershell -Command "cd 'C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend'; node stable-server.js"
timeout /t 3 /nobreak > nul

echo 2️⃣ Démarrage Client (port 3000)...
start "Client-Sanny" /min powershell -Command "cd 'C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client'; $env:BROWSER='none'; npm start"
timeout /t 5 /nobreak > nul

echo 3️⃣ Démarrage Admin (port 3001)...
start "Admin-Sanny" /min powershell -Command "cd 'C:\xampp\htdocs\sanny\san\ecomerce_sanny\admin-app'; $env:BROWSER='none'; $env:PORT='3001'; npm start"

echo.
echo ✅ Démarrage en cours...
echo    ⏳ Backend: ~3 secondes
echo    ⏳ Client: ~15 secondes  
echo    ⏳ Admin: ~20 secondes
echo.
echo 📋 URLs une fois démarrés:
echo    🖥️  Backend: http://localhost:4000/api/
echo    🛒 Client: http://localhost:3000
echo    ⚙️  Admin: http://localhost:3001
echo.
echo ⚠️  Fermer les fenêtres PowerShell pour arrêter les services
pause