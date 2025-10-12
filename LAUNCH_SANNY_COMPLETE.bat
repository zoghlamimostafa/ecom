@echo off
title APPLICATION E-COMMERCE SANNY - DEMARRAGE COMPLET
color 0A

echo.
echo     ███████╗ █████╗ ███╗   ███╗███╗   ██╗██╗   ██╗
echo     ██╔════╝██╔══██╗████╗ ████║████╗  ██║╚██╗ ██╔╝
echo     ███████╗███████║██╔████╔██║██╔██╗ ██║ ╚████╔╝ 
echo     ╚════██║██╔══██║██║╚██╔╝██║██║╚██╗██║  ╚██╔╝  
echo     ███████║██║  ██║██║ ╚═╝ ██║██║ ╚████║   ██║   
echo     ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═══╝   ╚═╝   
echo.
echo     ========== E-COMMERCE APPLICATION ==========
echo.

echo 🚀 Lancement du systeme complet...
echo.
echo ⏳ Cela peut prendre 1-2 minutes...
echo 📋 Services: Backend + Client + Admin
echo.

REM Changer vers le repertoire de l'application
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny"

REM Verifier que Node.js est installe
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERREUR: Node.js n'est pas installe ou pas dans le PATH
    echo.
    echo 📥 Veuillez installer Node.js depuis: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Lancer le systeme complet
echo 🎬 Demarrage automatique en cours...
node launch-complete-system.js

pause