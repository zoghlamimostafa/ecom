@echo off
echo ===========================================
echo    SANNY E-COMMERCE - DEMARRAGE COMPLET
echo ===========================================
echo.

cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend"
echo 📁 Repertoire: %CD%
echo.

echo 🚀 Demarrage du serveur backend...
node index-robust.js

echo.
echo ❌ Serveur arrete
pause