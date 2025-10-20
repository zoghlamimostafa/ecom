#!/bin/bash

echo "🧪 TEST MANUEL D'UPLOAD"
echo "======================"
echo ""
echo "Ce script va tester l'upload sans passer par le navigateur"
echo ""

# Vérifier que le backend tourne
if ! curl -s http://localhost:4000/api/ | grep -q "OK"; then
    echo "❌ Backend non accessible sur port 4000"
    echo "Démarrez le backend avec: cd backend && npm start"
    exit 1
fi

echo "✅ Backend accessible"
echo ""

# Demander le token
echo "📝 Pour tester l'upload, j'ai besoin de votre token admin"
echo ""
echo "Comment obtenir votre token:"
echo "1. Ouvrez l'admin dans le navigateur (http://localhost:3001)"
echo "2. Connectez-vous en tant qu'admin"
echo "3. Ouvrez DevTools (F12)"
echo "4. Aller dans: Application → Local Storage → http://localhost:3001"
echo "5. Cherchez la clé 'customer'"
echo "6. Copiez la valeur du champ 'token' (sans les guillemets)"
echo ""
echo -n "Collez votre token ici: "
read TOKEN

if [ -z "$TOKEN" ]; then
    echo "❌ Token vide, abandon"
    exit 1
fi

echo ""
echo "✅ Token reçu"
echo ""

# Créer une image de test simple
echo "📸 Création d'une image de test..."

# Essayer de créer une vraie image avec ImageMagick
if command -v convert &> /dev/null; then
    convert -size 200x200 gradient:blue-red /tmp/test-upload.jpg
    echo "✅ Image créée avec ImageMagick"
elif command -v ffmpeg &> /dev/null; then
    ffmpeg -f lavfi -i color=c=blue:s=200x200:d=1 -frames:v 1 /tmp/test-upload.jpg -y 2>/dev/null
    echo "✅ Image créée avec ffmpeg"
else
    # Créer une image minimale PNG valide en base64
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > /tmp/test-upload.jpg
    echo "✅ Image minimale créée"
fi

ls -lh /tmp/test-upload.jpg
echo ""

# Tester l'upload
echo "📤 Test d'upload vers le backend..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:4000/api/upload/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "images=@/tmp/test-upload.jpg")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "HTTP Status: $HTTP_CODE"
echo "Response:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Upload réussi!"
    echo ""
    
    # Extraire l'URL de l'image
    IMAGE_URL=$(echo "$BODY" | jq -r '.[0].url' 2>/dev/null)
    
    if [ -n "$IMAGE_URL" ] && [ "$IMAGE_URL" != "null" ]; then
        echo "🖼️  URL de l'image: $IMAGE_URL"
        echo ""
        echo "📥 Test d'accès à l'image..."
        
        if curl -f -s -I "$IMAGE_URL" | grep -q "200"; then
            echo "✅ Image accessible via HTTP"
            
            # Télécharger et vérifier la taille
            IMAGE_SIZE=$(curl -s "$IMAGE_URL" | wc -c)
            echo "📏 Taille de l'image: $IMAGE_SIZE octets"
            
            if [ $IMAGE_SIZE -gt 0 ]; then
                echo ""
                echo "🎉 TEST RÉUSSI COMPLÈTEMENT!"
                echo ""
                echo "✅ Backend fonctionne"
                echo "✅ Upload fonctionne"
                echo "✅ Images accessibles"
                echo ""
                echo "Le problème vient donc du frontend (navigateur/admin)"
            else
                echo "❌ L'image est vide"
            fi
        else
            echo "❌ Image non accessible"
            echo "Vérifiez que le serveur statique est configuré"
        fi
    else
        echo "⚠️ Pas d'URL dans la réponse"
    fi
else
    echo "❌ Upload échoué"
    echo ""
    
    case $HTTP_CODE in
        401)
            echo "🔒 Erreur 401: Token invalide ou expiré"
            echo "→ Reconnectez-vous dans l'admin et récupérez un nouveau token"
            ;;
        400)
            echo "📝 Erreur 400: Requête incorrecte"
            echo "→ Vérifiez que le fichier est bien envoyé"
            ;;
        500)
            echo "💥 Erreur 500: Erreur serveur"
            echo "→ Vérifiez les logs du backend"
            ;;
        *)
            echo "❓ Erreur inconnue: $HTTP_CODE"
            ;;
    esac
fi

echo ""
echo "🗑️  Nettoyage..."
rm -f /tmp/test-upload.jpg
echo "Terminé!"
