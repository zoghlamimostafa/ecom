#!/bin/bash

# Script de test pour l'upload d'images
# Nécessite un token d'authentification admin valide

echo "🧪 Test de l'endpoint upload"
echo "================================"

# Récupérer le token (à remplacer par votre vrai token admin)
TOKEN="YOUR_ADMIN_TOKEN_HERE"

# Créer une image de test
echo "📸 Création d'une image de test..."
convert -size 100x100 xc:blue /tmp/test-image.jpg 2>/dev/null || {
    # Si ImageMagick n'est pas installé, créer un fichier texte
    echo "Image de test" > /tmp/test-image.jpg
}

echo "📤 Envoi de l'image au serveur..."
curl -v -X POST http://localhost:4000/api/upload/ \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "images=@/tmp/test-image.jpg" \
  2>&1 | grep -E "(< HTTP|images|error|message)"

echo ""
echo "✅ Test terminé"
