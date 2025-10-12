@echo off
echo 🔄 Redémarrage propre du système Sanny Store...

echo.
echo 📡 Arrêt des services existants...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ⏳ Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo.
echo 🚀 Démarrage du Backend...
start "Backend" powershell -Command "cd 'C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\backend'; node index.js"

echo.
echo ⏳ Attente de 5 secondes pour le backend...
timeout /t 5 /nobreak >nul

echo.
echo 🎨 Démarrage de l'Admin...
start "Admin" powershell -Command "cd 'C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\admin-app'; npm start"

echo.
echo ⏳ Attente de 10 secondes pour l'admin...
timeout /t 10 /nobreak >nul

echo.
echo 🌐 Ouverture du navigateur...
start http://localhost:3001

echo.
echo ✅ Système démarré avec succès !
echo 💡 Admin: http://localhost:3001
echo 💡 Backend: http://localhost:4000
echo.
pause
