#!/bin/bash

echo "🧪 TEST UNIFIÉ - UPLOAD ADMIN & AFFICHAGE CLIENT"
echo "================================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Vérifier que le backend est en ligne
echo "📡 Test 1: Backend accessible"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://74.235.205.26:4000/api/product)
if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Backend OK (HTTP $RESPONSE)${NC}"
else
    echo -e "${RED}❌ Backend KO (HTTP $RESPONSE)${NC}"
fi
echo ""

# Test 2: Vérifier le format des images dans un produit
echo "📦 Test 2: Format des images d'un produit"
PRODUCT_DATA=$(curl -s http://74.235.205.26:4000/api/product | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if 'products' in data and len(data['products']) > 0:
        product = data['products'][0]
        print('Produit:', product.get('title', 'N/A'))
        print('Images type:', type(product.get('images')).__name__)
        if 'images' in product:
            images = product['images']
            if isinstance(images, list):
                print('Images count:', len(images))
                if len(images) > 0:
                    print('Première image:', images[0])
                    if isinstance(images[0], dict) and 'url' in images[0]:
                        print('Format: ✅ Correct (objet avec url)')
                        print('URL:', images[0]['url'])
                    else:
                        print('Format: ❌ Incorrect')
            else:
                print('Format: ❌ Images n\'est pas un array')
except Exception as e:
    print('Erreur:', e)
")
echo "$PRODUCT_DATA"
echo ""

# Test 3: Vérifier le format dans la BDD
echo "💾 Test 3: Format des images en base de données"
cd /home/blackrdp/sanny/san/ecomerce_sanny/backend
DB_DATA=$(sqlite3 database.sqlite "SELECT id, title, substr(images, 1, 80) as images_preview FROM products WHERE images IS NOT NULL LIMIT 1;" 2>&1)
if [ $? -eq 0 ]; then
    echo "$DB_DATA"
    if [[ $DB_DATA == *"[{\"url\""* ]] || [[ $DB_DATA == *"[{\\\"url\\\""* ]]; then
        echo -e "${GREEN}✅ Format en BDD: String JSON correct${NC}"
    else
        echo -e "${YELLOW}⚠️ Format en BDD: Vérifier manuellement${NC}"
    fi
else
    echo -e "${RED}❌ Erreur accès BDD${NC}"
fi
echo ""

# Test 4: Vérifier une image physique
echo "📷 Test 4: Accès aux images physiques"
IMAGE_FILE=$(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/*.jpeg 2>/dev/null | head -1)
if [ -n "$IMAGE_FILE" ]; then
    FILENAME=$(basename "$IMAGE_FILE")
    echo "Fichier test: $FILENAME"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://74.235.205.26:4000/images/$FILENAME")
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ Image accessible (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${RED}❌ Image inaccessible (HTTP $HTTP_CODE)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Aucune image trouvée${NC}"
fi
echo ""

# Test 5: Vérifier les logs récents du backend
echo "📋 Test 5: Logs récents du backend"
echo "Dernières 10 lignes:"
pm2 logs backend-fixed --nostream --lines 10 | tail -10
echo ""

echo "================================================"
echo "✅ Tests terminés"
echo ""
echo "🎯 Actions à faire manuellement:"
echo "   1. Testez l'upload dans l'admin: http://74.235.205.26:3001/admin"
echo "   2. Vérifiez l'affichage dans le client: http://74.235.205.26:3000/store"
echo "   3. Testez cart/wishlist/checkout"
echo ""
echo "📝 Commandes utiles:"
echo "   pm2 logs backend-fixed --lines 50    # Voir les logs"
echo "   pm2 logs backend-fixed | grep '📦'   # Filtrer les logs upload"
