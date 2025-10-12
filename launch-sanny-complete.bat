@echo off
cls
echo =============================================
echo       🎉 SANNY STORE - VERSION COMPLÈTE 🎉
echo       Version du 28 Septembre 2025
echo =============================================
echo.
echo ✅ Système de traduction français complet
echo 🟠 Thème orange personnalisé  
echo 🛒 Fonctionnalités e-commerce avancées
echo 📱 Interface responsive et moderne
echo.
echo [1/5] Nettoyage des processus existants...
taskkill /IM node.exe /F 2>NUL
taskkill /IM npm.cmd /F 2>NUL
timeout /t 3 /nobreak >NUL

echo [2/5] Vérification de la configuration...
if not exist "backend\index.js" (
    echo ❌ Erreur: Fichier backend manquant
    pause
    exit /b 1
)
if not exist "Client\src\index.js" (
    echo ❌ Erreur: Fichier frontend manquant
    pause
    exit /b 1
)
echo ✅ Configuration vérifiée

echo [3/5] Démarrage du serveur backend...
start "🔧 SANNY BACKEND" /min cmd /k "cd /d %~dp0backend && echo ===== BACKEND SANNY STORE ===== && echo Démarrage du serveur... && node index.js"
timeout /t 8 /nobreak >NUL

echo [4/5] Démarrage du serveur frontend...
start "⚛️  SANNY FRONTEND" cmd /k "cd /d %~dp0Client && echo ===== FRONTEND SANNY STORE ===== && echo Compilation React en cours... && npm start"
timeout /t 5 /nobreak >NUL

echo [5/5] Finalisation...
echo.
echo =============================================
echo     🚀 LANCEMENT EN COURS...
echo =============================================
echo.
echo 🌐 Interface utilisateur: http://localhost:3000
echo 🔧 API Backend:          http://localhost:4000
echo.
echo ⏳ Temps d'initialisation: 30-60 secondes
echo 📱 L'application s'ouvrira automatiquement
echo.
echo 💡 Fonctionnalités disponibles:
echo    • Interface entièrement en français
echo    • Thème orange personnalisé
echo    • Système de panier et wishlist
echo    • Authentification utilisateur
echo    • Gestion des commandes
echo.
echo Patientez pendant l'ouverture automatique...
timeout /t 20 /nobreak >NUL
start http://localhost:3000
echo.
echo 🎊 Application lancée avec succès !
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >NUL