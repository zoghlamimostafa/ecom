@echo off
echo 🔧 PROMOTION ADMIN - Solution Finale
echo ====================================
echo.
echo Cette commande va promouvoir souad@test.com en admin
echo.
pause

echo Connexion à MongoDB...
mongosh ecomerce_sanny --eval "db.users.updateOne({email: 'souad@test.com'}, {$set: {role: 'admin'}})"

echo.
echo ✅ Promotion terminée!
echo.
echo 📋 IDENTIFIANTS ADMIN:
echo    📧 Email: souad@test.com  
echo    🔐 Password: [votre mot de passe habituel]
echo.
echo 🧪 Test de la promotion:
mongosh ecomerce_sanny --eval "db.users.findOne({email: 'souad@test.com'}, {email: 1, role: 1})"

echo.
echo 📱 Maintenant testez l'upload:
echo    1. Allez sur http://localhost:3001
echo    2. Connectez-vous avec souad@test.com
echo    3. Allez dans Ajouter Produit
echo    4. Testez l'upload d'image
echo.
pause
