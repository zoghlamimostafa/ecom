#!/bin/bash

echo "🔍 DIAGNOSTIC DU MENU CATÉGORIES"
echo "=================================="
echo ""

# 1. Vérifier que le serveur client est en ligne
echo "1️⃣  Vérification du serveur client..."
if curl -s http://74.235.205.26:3000 > /dev/null; then
    echo "   ✅ Client accessible sur http://74.235.205.26:3000"
else
    echo "   ❌ Client NON accessible"
fi
echo ""

# 2. Vérifier que l'API backend est en ligne
echo "2️⃣  Vérification de l'API backend..."
if curl -s http://74.235.205.26:4000/api/category/ > /dev/null; then
    echo "   ✅ API accessible sur http://74.235.205.26:4000"
else
    echo "   ❌ API NON accessible"
fi
echo ""

# 3. Vérifier le nombre de catégories
echo "3️⃣  Vérification des catégories..."
TOTAL_CATS=$(curl -s "http://74.235.205.26:4000/api/category/?limit=500" | grep -o '"id":' | wc -l)
echo "   📊 Total catégories retournées: $TOTAL_CATS"
if [ "$TOTAL_CATS" -ge 375 ]; then
    echo "   ✅ Toutes les catégories sont chargées"
else
    echo "   ⚠️  Seulement $TOTAL_CATS catégories (attendu: 375+)"
fi
echo ""

# 4. Vérifier que Header.js contient le nouveau code
echo "4️⃣  Vérification du fichier Header.js..."
if grep -q "subcategories-horizontal-panel" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/components/Header.js; then
    echo "   ✅ Header.js contient le nouveau code"
else
    echo "   ❌ Header.js ne contient PAS le nouveau code"
fi
echo ""

# 5. Vérifier que App.css contient les nouveaux styles
echo "5️⃣  Vérification du fichier App.css..."
if grep -q "subcategories-horizontal-panel" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/App.css; then
    echo "   ✅ App.css contient les nouveaux styles"
else
    echo "   ❌ App.css ne contient PAS les nouveaux styles"
fi
echo ""

# 6. Vérifier le statut PM2
echo "6️⃣  Statut des services PM2..."
pm2 status | grep -E "sanny-client|backend-fixed" | while read line; do
    if echo "$line" | grep -q "online"; then
        echo "   ✅ $(echo $line | awk '{print $2}'): online"
    else
        echo "   ❌ $(echo $line | awk '{print $2}'): $(echo $line | awk '{print $10}')"
    fi
done
echo ""

# 7. Vérifier la dernière compilation
echo "7️⃣  Dernière compilation du client..."
LAST_COMPILE=$(pm2 logs sanny-client --lines 50 --nostream 2>/dev/null | grep -i "compiled" | tail -1)
echo "   📝 $LAST_COMPILE"
echo ""

echo "=================================="
echo "📋 RÉSUMÉ"
echo "=================================="
echo ""
echo "Si tous les tests sont ✅ mais vous ne voyez pas le menu :"
echo ""
echo "1. 🔄 Faites un HARD REFRESH dans votre navigateur :"
echo "   - Windows/Linux: Ctrl + Shift + R"
echo "   - Mac: Cmd + Shift + R"
echo ""
echo "2. 🕵️  Ouvrez une fenêtre de navigation privée/incognito"
echo ""
echo "3. 🧹 Videz le cache du navigateur complètement"
echo ""
echo "4. 🔍 Ouvrez la console du navigateur (F12) et cherchez des erreurs"
echo ""
echo "Le menu devrait apparaître quand vous survolez le bouton 'Catégories'"
echo "dans le header, puis quand vous survolez une catégorie, un panel"
echo "latéral avec les sous-catégories en grille horizontale devrait s'afficher."
echo ""
