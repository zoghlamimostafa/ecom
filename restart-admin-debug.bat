@echo off
echo 🔄 Redémarrage Interface Admin avec Debug...
echo.

echo 🛑 Arrêt de l'interface admin en cours...
taskkill /F /PID 2000 >nul 2>&1

echo ⏳ Attente 2 secondes...
timeout /t 2 /nobreak >nul

echo 🚀 Redémarrage avec debug activé...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\admin-app"

echo 📱 Démarrage sur http://localhost:3001
echo 🔍 Mode DEBUG activé - Console F12 pour voir les logs
echo.

start "Admin Interface DEBUG" cmd /k "npm start"

echo.
echo ✅ Interface admin redémarrée avec debug!
echo.
echo 💡 Instructions:
echo 1. Attendez que http://localhost:3001 s'ouvre
echo 2. Connectez-vous avec admin@example.com / admin123  
echo 3. Allez sur Add Product
echo 4. Ouvrez la console (F12) 
echo 5. Vous verrez une boîte de debug en haut à droite
echo 6. Essayez d'ajouter un produit
echo 7. Regardez les messages dans la console
echo.

pause