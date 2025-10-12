@echo off
cls
echo ================================================
echo   🚀 SANNY STORE - DEMARRAGE APPLICATION
echo ================================================
echo.

echo 📂 Navigation vers le dossier Client...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client"
echo ✅ Repertoire: %CD%

echo.
echo 🔍 Verification des fichiers...
if not exist package.json (
    echo ❌ package.json manquant !
    pause
    exit /b 1
)
echo ✅ package.json trouvé

if not exist node_modules (
    echo ⚠️  node_modules manquant, installation...
    npm install --legacy-peer-deps
)
echo ✅ node_modules présent

echo.
echo 🧹 Nettoyage du cache npm...
npm cache clean --force 2>nul

echo.
echo 🚀 DEMARRAGE DE L'APPLICATION REACT
echo.
echo 🌐 Adresse: http://localhost:3000
echo 📄 Page test profil: http://localhost:3000/test-profil.html
echo.
echo ⚠️  AVERTISSEMENTS NORMAUX À IGNORER:
echo    - Browserslist outdated
echo    - Deprecation warnings
echo    - Babel dependencies
echo.
echo 🚀 Démarrage en cours...
echo.

set BROWSER=none
npm start