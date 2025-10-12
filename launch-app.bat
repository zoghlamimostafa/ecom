@echo off
echo =================================
echo    LANCEMENT SANNY STORE
echo =================================
echo.

echo [1/3] Nettoyage des processus...
taskkill /IM node.exe /F 2>NUL
timeout /t 2 /nobreak >NUL

echo [2/3] Lancement du backend...
start "SANNY BACKEND" cmd /k "cd /d C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend && echo Backend demarrage... && node index.js"
timeout /t 5 /nobreak >NUL

echo [3/3] Lancement du frontend...
start "SANNY FRONTEND" cmd /k "cd /d C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client && echo Frontend demarrage... && npm start"
timeout /t 3 /nobreak >NUL

echo.
echo ✅ Application en cours de lancement...
echo 🌐 Frontend: http://localhost:3000  
echo 🔧 Backend:  http://localhost:4000
echo.
echo Appuyez sur une touche pour continuer...
pause > NUL