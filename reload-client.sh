#!/bin/bash

# 🔄 Script pour forcer le rechargement complet du client

echo "🔄 RECHARGEMENT COMPLET DU CLIENT"
echo "═══════════════════════════════════════════════════════════════"

# 1. Vérifier si le client tourne
CLIENT_PID=$(ps aux | grep "react-scripts start" | grep "Client" | grep -v grep | awk '{print $2}' | head -1)

if [ -z "$CLIENT_PID" ]; then
    echo "❌ Le client ne tourne pas"
    echo ""
    echo "Démarrez-le avec:"
    echo "cd /home/blackrdp/sanny/san/ecomerce_sanny/Client && npm start"
    exit 1
fi

echo "✅ Client détecté (PID: $CLIENT_PID)"
echo ""

# 2. Arrêter le client
echo "⏸️  Arrêt du client..."
kill $CLIENT_PID
sleep 2

# Vérifier si bien arrêté
if ps -p $CLIENT_PID > /dev/null 2>&1; then
    echo "⚠️  Forçage de l'arrêt..."
    kill -9 $CLIENT_PID
    sleep 1
fi

echo "✅ Client arrêté"
echo ""

# 3. Nettoyer le cache de build
echo "🧹 Nettoyage du cache..."
cd /home/blackrdp/sanny/san/ecomerce_sanny/Client

if [ -d "build" ]; then
    rm -rf build
    echo "   ✓ Dossier build supprimé"
fi

if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "   ✓ Cache node_modules supprimé"
fi

if [ -d ".eslintcache" ]; then
    rm -rf .eslintcache
    echo "   ✓ Cache ESLint supprimé"
fi

echo "✅ Cache nettoyé"
echo ""

# 4. Redémarrer le client
echo "🚀 Redémarrage du client..."
echo ""

# Option 1: En arrière-plan
npm start > /tmp/sanny-client.log 2>&1 &
NEW_PID=$!

echo "✅ Client redémarré (PID: $NEW_PID)"
echo ""
echo "📋 Logs disponibles dans: /tmp/sanny-client.log"
echo ""
echo "⏳ Attendez 10-15 secondes pour la compilation..."
echo ""
echo "🌐 Une fois prêt, ouvrez: http://localhost:5000"
echo ""
echo "💡 IMPORTANT: Dans votre navigateur:"
echo "   1. Ouvrez http://localhost:5000"
echo "   2. Appuyez sur Ctrl+Shift+R (rechargement forcé)"
echo "   3. Ou videz le cache: Ctrl+Shift+Delete"
echo ""
echo "═══════════════════════════════════════════════════════════════"

# Suivre les logs pendant 5 secondes
echo ""
echo "📊 Logs de démarrage:"
sleep 3
tail -n 20 /tmp/sanny-client.log

echo ""
echo "✅ Script terminé"
