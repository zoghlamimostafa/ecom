@echo off
cls
echo ========================================
echo     DIAGNOSTIC ET LANCEMENT SANNY STORE
echo ========================================
echo.

REM Nettoyer tous les processus Node.js
echo [1/6] Nettoyage des processus existants...
taskkill /IM node.exe /F 2>NUL
taskkill /IM npm.cmd /F 2>NUL
timeout /t 3 /nobreak >NUL

REM Vérifier les dossiers
echo [2/6] Vérification de la structure des dossiers...
if not exist "C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend" (
    echo ❌ ERREUR: Dossier backend introuvable
    pause
    exit /b 1
)
if not exist "C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client" (
    echo ❌ ERREUR: Dossier Client introuvable  
    pause
    exit /b 1
)
echo ✅ Structure des dossiers OK

REM Vérifier les fichiers package.json
echo [3/6] Vérification des fichiers de configuration...
if not exist "C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend\package.json" (
    echo ❌ ERREUR: package.json backend introuvable
    pause
    exit /b 1
)
if not exist "C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client\package.json" (
    echo ❌ ERREUR: package.json Client introuvable
    pause  
    exit /b 1
)
echo ✅ Fichiers de configuration OK

REM Lancer le backend
echo [4/6] Démarrage du serveur backend...
start "SANNY BACKEND" /min cmd /k "cd /d C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend && echo 🔧 Démarrage backend... && node index.js"
timeout /t 8 /nobreak >NUL

REM Vérifier que le backend est lancé
echo [5/6] Vérification du backend...
netstat -ano | findstr :4000 >NUL
if errorlevel 1 (
    echo ⚠️  Backend peut prendre plus de temps à démarrer
) else (
    echo ✅ Backend actif sur port 4000
)

REM Lancer le frontend
echo [6/6] Démarrage du serveur frontend...
start "SANNY FRONTEND" cmd /k "cd /d C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client && echo ⚛️  Démarrage React... && npm start"
timeout /t 5 /nobreak >NUL

echo.
echo ========================================
echo        LANCEMENT TERMINÉ
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:4000
echo.
echo ⏳ Les serveurs peuvent prendre 30-60 secondes pour être complètement opérationnels
echo 📱 Ouvrez votre navigateur à http://localhost:3000
echo.
echo Appuyez sur une touche pour ouvrir le navigateur...
pause >NUL
start http://localhost:3000