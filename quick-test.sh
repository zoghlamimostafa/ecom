#!/bin/bash

echo "🔍 TEST RAPIDE BACKEND"
echo "====================="
echo ""

# Vérifier que le backend tourne
echo "1. Test connexion backend..."
if curl -s http://localhost:4000/api/ | grep -q "OK"; then
    echo "   ✅ Backend accessible"
else
    echo "   ❌ Backend inaccessible"
    exit 1
fi

echo ""
echo "2. Test format réponse upload (sans fichier)..."
RESPONSE=$(curl -s http://localhost:4000/api/upload/ -X POST)
echo "   Réponse: $RESPONSE"

if echo "$RESPONSE" | grep -q "No token"; then
    echo "   ✅ Authentification requise (normal)"
else
    echo "   ⚠️ Réponse inattendue"
fi

echo ""
echo "3. Info système..."
echo "   Backend PID: $(ps aux | grep 'backend/index.js' | grep -v grep | awk '{print $2}')"
echo "   Port 4000: $(lsof -i:4000 | grep LISTEN | wc -l) processus"
echo "   Admin port 3001: $(lsof -i:3001 | grep LISTEN | wc -l) processus"

echo ""
echo "4. Dernières images uploadées..."
ls -lht /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | head -6

echo ""
echo "✅ Tests basiques OK"
echo ""
echo "📝 PROCHAINE ÉTAPE:"
echo "   1. Ouvrez l'admin: http://localhost:3001"
echo "   2. Ouvrez DevTools (F12) → Console"
echo "   3. Uploadez une image"
echo "   4. Regardez TOUS les logs dans la console"
echo "   5. Copiez-moi les messages avec 📸 ✅ ❌"
