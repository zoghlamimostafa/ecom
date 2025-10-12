@echo off
echo Demarrage de l'interface admin Sanny Store...
cd /D "c:\xampp\htdocs\sanny\san\ecomerce_sanny\admin-app"
echo Repertoire actuel: %CD%
echo Verification du package.json...
if exist package.json (
    echo package.json trouve
    echo Demarrage de l'application React Admin...
    call npm start
) else (
    echo ERREUR: package.json non trouve
    dir
    pause
)