#!/bin/bash

echo "🔍 Diagnostic Complet - Page Détail Produit"
echo "==========================================="
echo ""

# Test 1: Backend API
echo "1️⃣ Test Backend API..."
echo ""

# Test avec ID
echo "   Test avec ID (40):"
RESPONSE=$(curl -s http://127.0.0.1:4000/api/product/40)
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "   ✅ API répond correctement avec ID"
    echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print('      Titre:', data['product']['title']); print('      Images:', len(data['product']['images']))"
else
    echo "   ❌ Erreur API avec ID"
fi

echo ""

# Test avec Slug
echo "   Test avec Slug (iphone-16-128gb):"
RESPONSE=$(curl -s http://127.0.0.1:4000/api/product/iphone-16-128gb)
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "   ✅ API répond correctement avec Slug"
    echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print('      Titre:', data['product']['title']); print('      Images:', len(data['product']['images']))"
else
    echo "   ❌ Erreur API avec Slug"
    echo "   Réponse:" $RESPONSE
fi

echo ""
echo "2️⃣ Vérification Client..."
echo ""

# Vérifier si le client tourne
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo "   ✅ Client accessible sur http://localhost:5000"
else
    echo "   ❌ Client non accessible"
    echo "   👉 Démarrez le client: cd Client && npm start"
fi

echo ""
echo "3️⃣ Vérification des Logs Backend..."
echo ""

# Dernières lignes des logs
echo "   Derniers logs:"
tail -5 /tmp/sanny-backend.log | sed 's/^/      /'

echo ""
echo "==========================================="
echo "✨ Diagnostic terminé!"
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Ouvrir http://localhost:5000/product/iphone-16-128gb"
echo "   2. Ouvrir F12 → Console pour voir les erreurs"
echo "   3. Vérifier que les données arrivent dans Redux"
echo ""
echo "🐛 Si le problème persiste:"
echo "   - Vider le cache du navigateur (Ctrl+Shift+Delete)"
echo "   - Redémarrer le client: cd Client && npm start"
echo "   - Vérifier la console navigateur pour erreurs JavaScript"
echo ""
