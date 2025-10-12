@echo off
echo =====================================
echo   🚀 DEMARRAGE SANNY STORE CLIENT
echo =====================================
echo.

echo 📂 Navigation vers le dossier Client...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\Client"

echo ✅ Repertoire courant: %CD%

echo 🔍 Verification du package.json...
if exist package.json (
    echo ✅ package.json trouvé
) else (
    echo ❌ package.json non trouvé !
    pause
    exit /b 1
)

echo.
echo 🚀 Demarrage de l'application React...
echo.
echo ⚠️  AVERTISSEMENTS ATTENDUS :
echo    - Browserslist outdated (normal)
echo    - Deprecation warnings (normal) 
echo    - Babel dependencies (normal)
echo.
echo 🌐 L'application sera accessible sur :
echo    http://localhost:3000
echo.

npm start

echo.
echo ❌ Le serveur s'est arrêté
pause