@echo off
echo 🚀 Démarrage des services Sanny Store...

echo.
echo 📡 Démarrage du Backend...
start "Backend-Sanny" cmd /k "cd /d \"C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\backend\" && node index.js"

echo.
echo ⏳ Attente de 5 secondes pour le backend...
timeout /t 5 /nobreak

echo.
echo 🎨 Démarrage de l'Admin...
start "Admin-Sanny" cmd /k "cd /d \"C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\admin-app\" && npm start"

echo.
echo ⏳ Attente de 15 secondes pour l'admin...
timeout /t 15 /nobreak

echo.
echo 🌐 Ouverture du navigateur...
start http://localhost:3001

echo.
echo ✅ Services démarrés !
echo 💡 Backend: http://localhost:4000
echo 💡 Admin: http://localhost:3001
echo.
pause
