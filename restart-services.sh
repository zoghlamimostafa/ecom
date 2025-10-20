#!/bin/bash

echo "🔄 Redémarrage des Services Sanny Store"
echo "======================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour arrêter un processus Node sur un port
kill_port() {
    PORT=$1
    NAME=$2
    PID=$(lsof -ti:$PORT)
    if [ -n "$PID" ]; then
        echo -e "${YELLOW}⏹️  Arrêt de $NAME (PID: $PID)...${NC}"
        kill -9 $PID
        sleep 2
        echo -e "${GREEN}✅ $NAME arrêté${NC}"
    else
        echo -e "${GREEN}ℹ️  $NAME n'est pas en cours d'exécution${NC}"
    fi
}

# Arrêter les services existants
echo "1️⃣ Arrêt des services existants..."
echo ""

kill_port 4000 "Backend"
kill_port 5000 "Client"
kill_port 3001 "Admin"

echo ""
echo "2️⃣ Démarrage du backend..."
echo ""

cd /home/blackrdp/sanny/san/ecomerce_sanny/backend

# Démarrer le backend en arrière-plan
nohup npm start > /tmp/sanny-backend.log 2>&1 &
BACKEND_PID=$!

echo -e "${YELLOW}⏳ Attente du démarrage du backend...${NC}"
sleep 5

# Vérifier si le backend répond
if curl -s http://127.0.0.1:4000/api/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend démarré avec succès (PID: $BACKEND_PID)${NC}"
    echo -e "${GREEN}   URL: http://127.0.0.1:4000/api/${NC}"
    
    # Tester les images statiques
    echo ""
    echo "3️⃣ Test du service d'images..."
    
    FIRST_IMAGE=$(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/*.jpeg 2>/dev/null | head -1)
    if [ -n "$FIRST_IMAGE" ]; then
        IMAGE_NAME=$(basename "$FIRST_IMAGE")
        
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:4000/images/$IMAGE_NAME")
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✅ Images accessibles!${NC}"
            echo -e "${GREEN}   Test: http://127.0.0.1:4000/images/$IMAGE_NAME${NC}"
        else
            echo -e "${RED}❌ Images non accessibles (HTTP $HTTP_CODE)${NC}"
        fi
    fi
else
    echo -e "${RED}❌ Échec du démarrage du backend${NC}"
    echo -e "${YELLOW}📋 Logs: tail -f /tmp/sanny-backend.log${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✨ Redémarrage terminé!${NC}"
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Vérifier les logs: tail -f /tmp/sanny-backend.log"
echo "   2. Démarrer le client: cd Client && npm start"
echo "   3. Démarrer l'admin: cd admin-app && npm start"
echo ""
echo "🌐 URLs:"
echo "   - Backend: http://127.0.0.1:4000/api/"
echo "   - Images:  http://127.0.0.1:4000/images/"
echo ""
