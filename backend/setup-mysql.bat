@echo off
echo 🚀 Setup MySQL pour la migration MongoDB vers MySQL
echo ================================================

echo.
echo 📋 Étape 1: Vérification de l'état de MySQL...
net start | findstr /i mysql
if %errorlevel% equ 0 (
    echo ✅ MySQL est déjà démarré
) else (
    echo ⚠️ MySQL n'est pas démarré
    echo.
    echo 🔧 Tentative de démarrage de MySQL...
    net start mysql
    if %errorlevel% equ 0 (
        echo ✅ MySQL démarré avec succès
    ) else (
        echo ❌ Échec du démarrage de MySQL
        echo 💡 Assurez-vous que XAMPP est installé et configuré
        echo 💡 Ou démarrez MySQL via XAMPP Control Panel
        pause
        exit /b 1
    )
)

echo.
echo 📋 Étape 2: Création de la base de données...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ecomerce_sanny_mysql;" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Base de données 'ecomerce_sanny_mysql' créée/vérifiée
) else (
    echo ⚠️ Impossible de créer la base de données
    echo 💡 Vérifiez que MySQL est accessible sans mot de passe pour root
)

echo.
echo 📋 Étape 3: Test de connexion MySQL...
node test-mysql.js
if %errorlevel% equ 0 (
    echo ✅ Test de connexion réussi
) else (
    echo ❌ Test de connexion échoué
    echo 💡 Vérifiez la configuration dans config/config.json
)

echo.
echo 🎉 Setup terminé! 
echo 📝 Prochaines étapes:
echo    1. Si MySQL fonctionne: node migrate-data.js
echo    2. Si problèmes: Vérifiez XAMPP Control Panel
echo.
pause