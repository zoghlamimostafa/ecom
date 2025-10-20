#!/bin/bash

echo "🔍 TEST DES IMAGES - CART ET WISHLIST"
echo "======================================"
echo ""

# Récupérer un token valide depuis le localStorage (simulation)
# Pour tester, vous devrez remplacer TOKEN par votre vrai token

echo "📋 Instructions:"
echo "1. Ouvrez votre navigateur sur http://74.235.205.26:3000"
echo "2. Ouvrez la console (F12)"
echo "3. Tapez: localStorage.getItem('token')"
echo "4. Copiez le token (sans les guillemets)"
echo "5. Collez-le ci-dessous quand demandé"
echo ""

read -p "Entrez votre TOKEN d'authentification: " TOKEN

if [ -z "$TOKEN" ]; then
    echo "❌ Aucun token fourni. Test annulé."
    exit 1
fi

echo ""
echo "🔍 Test 1: Récupération du panier (Cart)"
echo "----------------------------------------"
CART_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://74.235.205.26:4000/api/user/cart)
echo "$CART_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print('✅ Réponse reçue:', len(data) if isinstance(data, list) else 'objet unique')
    if isinstance(data, list) and len(data) > 0:
        item = data[0]
        print('📦 Premier item:')
        print('  - ID:', item.get('id'))
        print('  - Product ID:', item.get('productId'))
        print('  - Quantity:', item.get('quantity'))
        print('  - Images (racine):', item.get('images'))
        if item.get('product'):
            print('  - Product.title:', item['product'].get('title'))
            print('  - Product.images:', item['product'].get('images'))
    else:
        print('❌ Panier vide ou format incorrect')
        print(data)
except Exception as e:
    print('❌ Erreur de parsing:', e)
    print(sys.stdin.read())
" <<< "$CART_RESPONSE"

echo ""
echo "🔍 Test 2: Récupération de la wishlist"
echo "----------------------------------------"
WISHLIST_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://74.235.205.26:4000/api/user/wishlist)
echo "$WISHLIST_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print('✅ Réponse reçue:', len(data) if isinstance(data, list) else 'objet unique')
    if isinstance(data, list) and len(data) > 0:
        item = data[0]
        print('📦 Premier produit:')
        print('  - ID:', item.get('id'))
        print('  - Title:', item.get('title'))
        print('  - Images:', item.get('images'))
        print('  - Images type:', type(item.get('images')))
        if item.get('images'):
            print('  - Nombre d\'images:', len(item['images']) if isinstance(item['images'], list) else 'non-array')
    else:
        print('❌ Wishlist vide ou format incorrect')
        print(data)
except Exception as e:
    print('❌ Erreur de parsing:', e)
    print(sys.stdin.read())
" <<< "$WISHLIST_RESPONSE"

echo ""
echo "🔍 Test 3: Vérification d'une image produit"
echo "--------------------------------------------"
# Extraire une URL d'image du panier ou de la wishlist
IMAGE_URL=$(echo "$CART_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list) and len(data) > 0:
        item = data[0]
        if item.get('images') and isinstance(item['images'], list) and len(item['images']) > 0:
            img = item['images'][0]
            if isinstance(img, dict) and 'url' in img:
                print(img['url'])
            elif isinstance(img, str):
                print(img)
except:
    pass
" 2>/dev/null)

if [ -n "$IMAGE_URL" ]; then
    echo "📷 URL testée: $IMAGE_URL"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Image accessible (HTTP $HTTP_CODE)"
    else
        echo "❌ Image inaccessible (HTTP $HTTP_CODE)"
    fi
else
    echo "⚠️ Aucune URL d'image trouvée dans le panier"
fi

echo ""
echo "======================================"
echo "✅ Tests terminés"
echo ""
echo "📝 Consultez les logs du backend avec:"
echo "   pm2 logs backend-fixed --lines 50"
