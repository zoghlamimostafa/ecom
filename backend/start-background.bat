@echo off
cd /d "c:\xampp\htdocs\sanny\san\ecomerce_sanny\backend"
echo Démarrage du serveur MySQL en arrière-plan...
start "Sanny MySQL Server" node index.js
echo Serveur démarré sur le port 4000
timeout /t 3
exit