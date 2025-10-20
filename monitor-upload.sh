#!/bin/bash

echo "🔍 MONITORING UPLOAD EN TEMPS RÉEL"
echo "===================================="
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""
echo "1. Ouvrez l'admin dans le navigateur"
echo "2. Essayez d'uploader une image"
echo "3. Observez les logs ci-dessous"
echo ""
echo "===================================="
echo ""

# Trouver le PID du backend
BACKEND_PID=$(ps aux | grep "backend/index.js" | grep -v grep | awk '{print $2}')

if [ -z "$BACKEND_PID" ]; then
    echo "❌ Backend non trouvé!"
    echo "Démarrez le backend avec: cd backend && npm start"
    exit 1
fi

echo "✅ Backend trouvé (PID: $BACKEND_PID)"
echo "📡 Surveillance des logs..."
echo ""

# Surveiller les logs du processus
journalctl _PID=$BACKEND_PID -f -n 50
