#!/bin/bash

echo "🎯 TEST RAPIDE - Filtrage par URL"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Vérifier que le backend est accessible
echo "1️⃣  Test Backend..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4000/api/)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "   ✅ Backend OK (port 4000)"
else
    echo "   ❌ Backend KO - Démarrez-le !"
    exit 1
fi

# Vérifier les produits par catégorie
echo ""
echo "2️⃣  Test Catégories Backend..."
echo ""

for CAT_ID in 4 7 59 296 379; do
    COUNT=$(curl -s "http://127.0.0.1:4000/api/product" | jq -r --arg cat "$CAT_ID" '[.products[] | select(.category == $cat)] | length')
    
    if [ "$COUNT" = "0" ]; then
        echo "   Catégorie $CAT_ID: ⚠️  $COUNT produit"
    else
        echo "   Catégorie $CAT_ID: ✅ $COUNT produit(s)"
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "3️⃣  Instructions de Test:"
echo ""
echo "   a) Rechargez le client (si besoin):"
echo "      /home/blackrdp/sanny/san/ecomerce_sanny/reload-client.sh"
echo ""
echo "   b) Videz le cache navigateur:"
echo "      Ctrl+Shift+Delete"
echo ""
echo "   c) Testez ces URLs:"
echo "      • http://localhost:5000/product?category=296  → 0 produit ✅"
echo "      • http://localhost:5000/product?category=4    → 1 produit ✅"
echo "      • http://localhost:5000/product?category=379  → 1 produit ✅"
echo ""
echo "   d) Vérifiez la console (F12):"
echo "      Vous devriez voir: 🔍 Paramètre URL détecté - category: XXX"
echo ""
echo "═══════════════════════════════════════════════════════════════"
