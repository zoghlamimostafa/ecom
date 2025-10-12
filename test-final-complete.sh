#!/bin/bash

echo "🧪 Test Final - Vérification Complète du Système"
echo "=============================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL de base
BASE_URL="http://localhost:4000/api"

echo "1️⃣  Vérification des services PM2..."
pm2 status | grep -E "backend-fixed|sanny-admin|sanny-client"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Services PM2 en ligne${NC}\n"
else
    echo -e "${RED}❌ Problème avec les services PM2${NC}\n"
    exit 1
fi

echo "2️⃣  Test de connexion au backend..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000)
if [ "$response" -eq 200 ] || [ "$response" -eq 404 ]; then
    echo -e "${GREEN}✅ Backend accessible (HTTP $response)${NC}\n"
else
    echo -e "${RED}❌ Backend non accessible (HTTP $response)${NC}\n"
fi

echo "3️⃣  Test d'inscription utilisateur (numéro dupliqué)..."
timestamp=$(date +%s)
response=$(curl -s -X POST "$BASE_URL/user/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstname\": \"Test\",
    \"lastname\": \"Final\",
    \"email\": \"test.final.$timestamp@example.com\",
    \"mobile\": \"1234567890\",
    \"password\": \"password123\"
  }")

if echo "$response" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Inscription réussie avec numéro dupliqué${NC}"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
    echo -e "${RED}❌ Erreur lors de l'inscription${NC}"
    echo "$response"
fi
echo ""

echo "4️⃣  Test de connexion utilisateur..."
response=$(curl -s -X POST "$BASE_URL/user/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test.final.$timestamp@example.com\",
    \"password\": \"password123\"
  }")

if echo "$response" | grep -q '"token"'; then
    echo -e "${GREEN}✅ Connexion utilisateur réussie${NC}"
    # Extraire le token
    token=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${token:0:20}..."
else
    echo -e "${RED}❌ Erreur lors de la connexion${NC}"
    echo "$response"
fi
echo ""

echo "5️⃣  Vérification de la structure de la base de données..."
if [ -f "/home/blackrdp/sanny/san/ecomerce_sanny/backend/database.sqlite" ]; then
    echo -e "${GREEN}✅ Fichier database.sqlite existe${NC}"
    
    # Vérifier la taille du fichier
    size=$(stat -f%z "/home/blackrdp/sanny/san/ecomerce_sanny/backend/database.sqlite" 2>/dev/null || stat -c%s "/home/blackrdp/sanny/san/ecomerce_sanny/backend/database.sqlite" 2>/dev/null)
    echo "   Taille: $(($size / 1024)) KB"
else
    echo -e "${RED}❌ Fichier database.sqlite introuvable${NC}"
fi
echo ""

echo "6️⃣  Test des interfaces web..."
echo -n "   Admin (3001): "
admin_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$admin_response" -eq 200 ]; then
    echo -e "${GREEN}✅ Accessible${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $admin_response${NC}"
fi

echo -n "   Client (3000): "
client_response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$client_response" -eq 200 ]; then
    echo -e "${GREEN}✅ Accessible${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP $client_response${NC}"
fi
echo ""

echo "7️⃣  Vérification des logs backend (dernières lignes)..."
pm2 logs backend-fixed --lines 5 --nostream | tail -10
echo ""

echo "=============================================="
echo -e "${GREEN}🎉 Test final terminé !${NC}"
echo ""
echo "📊 Résumé:"
echo "   - Backend: http://localhost:4000"
echo "   - Admin:   http://localhost:3001"
echo "   - Client:  http://localhost:3000"
echo ""
echo "📚 Documentations créées:"
echo "   - RAPPORT_BASES_DONNEES.md"
echo "   - RAPPORT_CORRECTIONS_FINALES.md"
echo ""
