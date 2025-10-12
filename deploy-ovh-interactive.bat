@echo off
:: deploy-ovh-interactive.bat
:: Script interactif pour déployer sur OVH selon votre type d'hébergement

echo.
echo 🌐 DEPLOIEMENT INTERACTIF OVH - SANNY STORE
echo ==========================================
echo.

echo Quel type d'hebergement OVH avez-vous ?
echo.
echo 1. 📦 Hebergement Mutualise (Perso/Pro/Performance) - 3-15€/mois
echo 2. 🖥️  VPS (Virtual Private Server) - 6-50€/mois  
echo 3. 🏢 Serveur Dedie - 30€+/mois
echo 4. ❓ Je ne sais pas / Aide pour choisir
echo.

set /p choix="Entrez votre choix (1-4): "

if "%choix%"=="1" goto mutualise
if "%choix%"=="2" goto vps
if "%choix%"=="3" goto dedie
if "%choix%"=="4" goto aide
goto erreur

:aide
echo.
echo 🔍 AIDE POUR IDENTIFIER VOTRE HEBERGEMENT OVH
echo =============================================
echo.
echo 1. Connectez-vous a votre espace client OVH
echo 2. Regardez dans la section "Hebergements web" ou "Serveurs"
echo 3. Le nom de votre offre indique le type :
echo.
echo    📦 MUTUALISE : Perso, Pro, Performance, Cloud Web
echo    🖥️  VPS : VPS SSD, VPS Cloud, VPS Value  
echo    🏢 DEDIE : Advance, Infrastructure, Scale
echo.
pause
goto debut

:mutualise
echo.
echo 📦 HEBERGEMENT MUTUALISE OVH DETECTE
echo ==================================
echo.
echo ⚠️  LIMITATION : L'hebergement mutualise ne supporte pas Node.js
echo 💡 SOLUTION : Frontend sur OVH + API externe gratuite
echo.
echo Configuration necessaire :
echo - Serveur FTP : ftp.votre-domaine.com
echo - Login FTP : (dans espace client OVH)
echo - Mot de passe FTP : (dans espace client OVH)
echo.

set /p domaine="Votre nom de domaine (ex: monsite.com): "
set /p ftp_user="Login FTP OVH: "
set /p ftp_pass="Mot de passe FTP: "

echo.
echo 🔧 Configuration du deployment...
node prepare-build-ovh.js mutualise "%domaine%" "%ftp_user%" "%ftp_pass%"

echo.
echo 🏗️ Creation du build...
cd Client
call npm install --legacy-peer-deps
call npm run build
cd..

echo.
echo 📤 Upload vers OVH...
node ftp-upload-ovh.js

echo.
echo ✅ DEPLOYMENT TERMINE !
echo ======================
echo 🌐 Site: https://%domaine%
echo ⚠️  API: Deployez sur Railway.app (gratuit)
echo 📖 Guide: GUIDE_DEPLOIEMENT_OVH.md
echo.
pause
goto fin

:vps
echo.
echo 🖥️ VPS OVH DETECTE
echo ================
echo.
echo ✅ Support complet Node.js + PostgreSQL
echo 🚀 Deployment complet possible
echo.

set /p ip_vps="Adresse IP de votre VPS: "
set /p domaine="Votre nom de domaine: "

echo.
echo 🔧 Preparation des fichiers de configuration...
node prepare-build-ovh.js vps "%domaine%" "%ip_vps%"

echo.
echo 📋 ETAPES SUIVANTES :
echo ====================
echo 1. Connectez-vous en SSH : ssh root@%ip_vps%
echo 2. Uploadez les fichiers (git clone ou SFTP)
echo 3. Executez : chmod +x deploy-vps-ovh.sh
echo 4. Executez : ./deploy-vps-ovh.sh
echo.
echo 📖 Guide detaille : GUIDE_DEPLOIEMENT_OVH.md
echo 📝 Configuration SSH : .env.vps-ovh
echo ⚙️  Configuration Nginx : nginx-ovh.conf
echo.
pause
goto fin

:dedie
echo.
echo 🏢 SERVEUR DEDIE OVH DETECTE
echo ==========================
echo.
echo ✅ Performance maximale
echo 🚀 Meme processus que VPS + optimisations
echo.

set /p ip_serveur="Adresse IP de votre serveur: "
set /p domaine="Votre nom de domaine: "

echo.
echo 🔧 Preparation pour serveur dedie...
node prepare-build-ovh.js dedicated "%domaine%" "%ip_serveur%"

echo.
echo 📋 CONFIGURATION SERVEUR DEDIE :
echo ===============================
echo 1. Memes etapes que VPS
echo 2. + Optimisations haute performance
echo 3. + Configuration Docker (optionnel)
echo 4. + Load balancing (si necessaire)
echo.
echo 📖 Guide : GUIDE_DEPLOIEMENT_OVH.md
echo.
pause
goto fin

:erreur
echo.
echo ❌ Choix invalide. Recommencez.
echo.
pause
goto debut

:fin
echo.
echo 🎉 PROCESS TERMINE !
echo ===================
echo.
echo 📚 Ressources disponibles :
echo - GUIDE_DEPLOIEMENT_OVH.md (guide complet)
echo - DEMARRAGE_RAPIDE_OVH.md (guide express)
echo - Tous les fichiers de configuration crees
echo.
echo 💬 Support : Consultez les guides pour aide detaillee
echo.
pause