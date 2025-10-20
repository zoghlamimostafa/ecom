#!/bin/bash

echo "🧪 TEST COMPLET - AFFICHAGE IMAGES CLIENT"
echo "=========================================="
echo ""

# 1. Vérifier que le client est accessible
echo "1️⃣ Test Client accessible..."
CLIENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://74.235.205.26:3000)
if [ "$CLIENT_STATUS" = "200" ]; then
  echo "   ✅ Client accessible (HTTP $CLIENT_STATUS)"
else
  echo "   ❌ Client inaccessible (HTTP $CLIENT_STATUS)"
fi

# 2. Vérifier que le backend répond
echo ""
echo "2️⃣ Test Backend API..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://74.235.205.26:4000/api/)
if [ "$BACKEND_STATUS" = "200" ]; then
  echo "   ✅ Backend accessible (HTTP $BACKEND_STATUS)"
else
  echo "   ❌ Backend inaccessible (HTTP $BACKEND_STATUS)"
fi

# 3. Tester une image existante
echo ""
echo "3️⃣ Test Image existante..."
FIRST_IMAGE=$(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | grep "images-" | head -1)
if [ -n "$FIRST_IMAGE" ]; then
  IMAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://74.235.205.26:4000/images/$FIRST_IMAGE")
  if [ "$IMAGE_STATUS" = "200" ]; then
    echo "   ✅ Image servie correctement: $FIRST_IMAGE"
    echo "   📸 URL: http://74.235.205.26:4000/images/$FIRST_IMAGE"
  else
    echo "   ❌ Erreur serving image (HTTP $IMAGE_STATUS)"
  fi
else
  echo "   ⚠️ Aucune image trouvée dans /backend/public/images/"
fi

# 4. Vérifier les processus PM2
echo ""
echo "4️⃣ État des services PM2..."
pm2 list | grep -E "backend-fixed|sanny-client|sanny-admin"

# 5. Afficher les derniers logs client
echo ""
echo "5️⃣ Derniers logs client (erreurs)..."
pm2 logs sanny-client --lines 5 --nostream 2>&1 | tail -10 | grep -v "DeprecationWarning" || echo "   Pas d'erreurs récentes"

echo ""
echo "=========================================="
echo "📋 INSTRUCTIONS DE TEST MANUEL"
echo "=========================================="
echo ""
echo "🌐 IMPORTANT: Testez dans votre navigateur avec cache vidé!"
echo ""
echo "1️⃣ VIDER LE CACHE:"
echo "   - Appuyer sur Ctrl+Shift+Delete"
echo "   - Cocher 'Cached images and files'"
echo "   - Cliquer sur 'Clear data'"
echo ""
echo "2️⃣ HARD REFRESH:"
echo "   - Appuyer sur Ctrl+Shift+R (Windows/Linux)"
echo "   - Ou Cmd+Shift+R (Mac)"
echo ""
echo "3️⃣ TESTER LES PAGES:"
echo "   Cart:     http://74.235.205.26:3000/cart"
echo "   Checkout: http://74.235.205.26:3000/checkout"
echo "   Wishlist: http://74.235.205.26:3000/wishlist"
echo ""
echo "4️⃣ CONSOLE BROWSER (F12):"
echo "   - Ouvrir avec F12"
echo "   - Aller sur l'onglet Console"
echo "   - Chercher les logs '🖼️ DEBUG' ou '⚠️ Failed'"
echo "   - Aller sur Network → Images"
echo "   - Vérifier que les images se chargent (200 OK)"
echo ""
echo "5️⃣ SI IMAGES TOUJOURS PAS VISIBLES:"
echo "   - Uploader un NOUVEAU produit avec image dans admin"
echo "   - Les anciennes images (avant Sep 22) n'existent plus"
echo "   - Admin: http://74.235.205.26:3001/admin/add-product"
echo ""
echo "=========================================="
echo "✅ Tests automatiques terminés!"
echo "🔍 Continuez avec les tests manuels ci-dessus"
echo "=========================================="
