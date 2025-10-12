@echo off
echo Demarrage de l'interface client Sanny Store...
cd /D "c:\xampp\htdocs\sanny\san\ecomerce_sanny\Client"
echo Repertoire actuel: %CD%

echo Verification des modules critiques...
if not exist "node_modules\react" (
    echo Installation des dependances...
    npm install --legacy-peer-deps --force
)

echo Verification du package.json...
if exist package.json (
    echo package.json trouve
    echo.
    echo Tentative de demarrage avec npx...
    set NODE_OPTIONS=--openssl-legacy-provider
    npx react-scripts start
) else (
    echo ERREUR: package.json non trouve
    dir
    pause
)