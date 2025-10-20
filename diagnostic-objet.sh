#!/bin/bash

echo "🔍 DIAGNOSTIC ERREUR 'OBJET-OBJET'"
echo "=================================="
echo ""

# Vérifier les dernières images uploadées
echo "📸 Dernières images dans le dossier:"
ls -lht /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | head -5

echo ""
echo "🌐 Test d'accès aux images via HTTP:"

# Prendre la dernière image
LAST_IMAGE=$(ls -t /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | head -1)

if [ -n "$LAST_IMAGE" ]; then
    echo "Image testée: $LAST_IMAGE"
    IMAGE_URL="http://localhost:4000/images/$LAST_IMAGE"
    echo "URL: $IMAGE_URL"
    echo ""
    
    # Tester l'accès HTTP
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
    echo "Status HTTP: $HTTP_STATUS"
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ Image accessible"
        
        # Tester le type de contenu
        CONTENT_TYPE=$(curl -s -I "$IMAGE_URL" | grep -i "content-type" | cut -d: -f2 | tr -d '\r\n' | xargs)
        echo "Content-Type: $CONTENT_TYPE"
    else
        echo "❌ Image non accessible"
    fi
else
    echo "❌ Aucune image trouvée"
fi

echo ""
echo "📊 ANALYSE DE L'ERREUR 'objet-objet':"
echo "────────────────────────────────────"
echo ""
echo "Cette erreur suggère que:"
echo "1. Un objet est converti en string → '[object Object]'"
echo "2. Puis ce résultat est à nouveau traité"
echo ""
echo "🔍 Scénarios possibles:"
echo ""
echo "A) Le backend retourne: {url: {...}}"
echo "   Au lieu de: {url: 'http://...'}"
echo ""
echo "B) Le frontend fait: String({url: '...'})"
echo "   Au lieu de: imageObject.url"
echo ""
echo "C) Redux stocke mal les données"
echo ""
echo "📝 SOLUTION:"
echo "────────────────────────────────────"
echo "Ouvrez la console browser (F12) et uploadez une image."
echo "Cherchez les logs suivants et copiez-les:"
echo ""
echo "1. '📸 UploadService: Début upload' - Pour voir ce qui est envoyé"
echo "2. '✅ Upload réussi: [...]' - Pour voir la RÉPONSE du backend"
echo "3. '📊 Payload brut reçu: [...]' - Pour voir ce que Redux reçoit"
echo "4. '📸 Images finales pour le formulaire: [...]' - Pour voir ce qui est affiché"
echo ""
echo "🎯 Ces 4 logs me diront EXACTEMENT où l'objet devient 'objet-objet'!"
echo ""
