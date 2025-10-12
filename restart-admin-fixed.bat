@echo off
echo 🔄 Correction et redémarrage de l'admin...

echo.
echo 📡 Arrêt des services admin...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
    if not "%%a"=="0" (
        echo Arrêt du processus %%a
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo ⏳ Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo.
echo 🧹 Nettoyage des modules et cache...
cd "C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\admin-app"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache" >nul 2>&1

echo.
echo 🚀 Redémarrage de l'admin avec cache vide...
start "Admin-Fresh" powershell -Command "cd 'C:\Users\souad ben brahim\Downloads\san\ecomerce_sanny\admin-app'; $env:GENERATE_SOURCEMAP='false'; npm start"

echo.
echo ⏳ Attente de 15 secondes pour compilation...
timeout /t 15 /nobreak >nul

echo.
echo 🌐 Ouverture du navigateur...
start http://localhost:3001

echo.
echo ✅ Admin redémarré avec corrections !
echo 💡 Les erreurs d'import ont été corrigées
echo 💡 Cache vidé pour éviter les conflits
echo.
pause
