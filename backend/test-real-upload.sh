#!/bin/bash

echo "🧪 TEST UPLOAD ET AFFICHAGE - COMPLET"
echo "======================================"
echo ""

# 1. Créer une image de test simple
echo "1️⃣ Création image de test..."
convert -size 300x300 xc:blue -pointsize 50 -fill white -gravity center \
  -annotate +0+0 "TEST" /tmp/test-upload-$(date +%s).jpg 2>/dev/null || \
  echo "⚠️ ImageMagick non installé - utilisez une vraie image"

# 2. Vérifier que le dossier d'upload est accessible
echo ""
echo "2️⃣ Vérifier dossier images..."
ls -lh /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | tail -5
echo "📁 Total images: $(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | wc -l)"

# 3. Tester l'endpoint upload (nécessite un token admin valide)
echo ""
echo "3️⃣ Test endpoint upload (OPTIONS)..."
curl -s -X OPTIONS http://74.235.205.26:4000/api/upload -v 2>&1 | grep -E "HTTP|Access-Control"

# 4. Vérifier les logs d'upload récents
echo ""
echo "4️⃣ Logs upload récents..."
pm2 logs backend-fixed --lines 100 --nostream | grep -E "📸|Upload|✅.*image" | tail -10

# 5. Vérifier qu'une image locale existante est servie
echo ""
echo "5️⃣ Test serving image existante..."
EXISTING_IMAGE=$(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | head -1)
if [ -n "$EXISTING_IMAGE" ]; then
  echo "   Testing: $EXISTING_IMAGE"
  curl -I "http://74.235.205.26:4000/images/$EXISTING_IMAGE" 2>/dev/null | head -1
else
  echo "   ❌ Aucune image trouvée"
fi

echo ""
echo "✅ Tests terminés!"
echo ""
echo "📝 INSTRUCTIONS POUR UPLOADER:"
echo "   1. Allez sur http://74.235.205.26:3001/admin/add-product"
echo "   2. Remplissez le formulaire"
echo "   3. Uploadez une NOUVELLE image"
echo "   4. Sauvegardez"
echo "   5. Allez voir le produit côté client"
echo ""
echo "💡 Les anciennes images (avant Sep 22) ont été supprimées/perdues"
echo "💡 Vous devez uploader de nouvelles images pour les voir s'afficher"
