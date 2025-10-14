#!/bin/bash
# Diagnostic Complet du Système E-commerce
# Date: $(date +%Y-%m-%d\ %H:%M:%S)

echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                       ║"
echo "║              🔍 DIAGNOSTIC COMPLET DU SYSTÈME                         ║"
echo "║                                                                       ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

passed=0
failed=0
warnings=0

echo -e "${BLUE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  1. État des Services PM2                                          │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────────────────────────────┘${NC}"

services=$(pm2 jlist | jq -r '.[] | "\(.name): \(.pm2_env.status)"')
echo "$services" | while read line; do
    if echo "$line" | grep -q "online"; then
        echo -e "  ${GREEN}✓${NC} $line"
        ((passed++))
    else
        echo -e "  ${RED}✗${NC} $line"
        ((failed++))
    fi
done
echo ""

echo -e "${BLUE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  2. Vérification Base de Données SQLite                            │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────────────────────────────┘${NC}"

cd /home/blackrdp/sanny/san/ecomerce_sanny/backend

if [ -f "database.sqlite" ]; then
    size=$(du -h database.sqlite | cut -f1)
    echo -e "  ${GREEN}✓${NC} Fichier database.sqlite existe (${size})"
    
    tables=$(sqlite3 database.sqlite "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null)
    echo -e "  ${GREEN}✓${NC} Tables: $tables"
    
    products=$(sqlite3 database.sqlite "SELECT COUNT(*) FROM Products;" 2>/dev/null)
    categories=$(sqlite3 database.sqlite "SELECT COUNT(*) FROM Categories;" 2>/dev/null)
    users=$(sqlite3 database.sqlite "SELECT COUNT(*) FROM Users;" 2>/dev/null)
    
    echo -e "  ${GREEN}✓${NC} Produits: $products"
    echo -e "  ${GREEN}✓${NC} Catégories: $categories"
    echo -e "  ${GREEN}✓${NC} Utilisateurs: $users"
else
    echo -e "  ${RED}✗${NC} Fichier database.sqlite introuvable!"
    ((failed++))
fi
echo ""

echo -e "${BLUE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  3. Test des Endpoints Backend                                     │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────────────────────────────┘${NC}"

endpoints=(
    "product:GET /api/product"
    "category:GET /api/category"
    "brand:GET /api/brand"
    "color:GET /api/color"
)

for endpoint in "${endpoints[@]}"; do
    name="${endpoint%%:*}"
    url="${endpoint##*:}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4000/api/$name" 2>/dev/null)
    
    if [ "$response" == "200" ]; then
        echo -e "  ${GREEN}✓${NC} $url (HTTP $response)"
        ((passed++))
    else
        echo -e "  ${RED}✗${NC} $url (HTTP $response)"
        ((failed++))
    fi
done
echo ""

echo -e "${BLUE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  4. Test des Pages Client                                          │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────────────────────────────┘${NC}"

pages=(
    "/:Accueil"
    "/product:Produits"
    "/cart:Panier"
    "/checkout:Checkout"
    "/contact:Contact"
)

for page in "${pages[@]}"; do
    url="${page%%:*}"
    name="${page##*:}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url" 2>/dev/null)
    
    if [ "$response" == "200" ]; then
        echo -e "  ${GREEN}✓${NC} $name ($url) - HTTP $response"
        ((passed++))
    else
        echo -e "  ${RED}✗${NC} $name ($url) - HTTP $response"
        ((failed++))
    fi
done
echo ""

echo -e "${BLUE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  5. Vérification Références MongoDB                                │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────────────────────────────┘${NC}"

cd /home/blackrdp/sanny/san/ecomerce_sanny

backend_mongo=$(grep -r "mongoose\|mongodb" --include="*.js" backend/controller backend/routes 2>/dev/null | grep -v "backup\|node_modules" | wc -l)
admin_mongo=$(grep -r "\._id" --include="*.js" admin-app/src/pages admin-app/src/features 2>/dev/null | grep -v "i_id\|public_id\|asset_id" | wc -l)
client_mongo=$(grep -r "\._id" --include="*.js" Client/src/pages Client/src/components 2>/dev/null | grep -v "i_id\|public_id\|asset_id" | wc -l)

if [ "$backend_mongo" -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} Backend: 0 références MongoDB"
    ((passed++))
else
    echo -e "  ${YELLOW}⚠${NC} Backend: $backend_mongo références MongoDB trouvées"
    ((warnings++))
fi

if [ "$admin_mongo" -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} Admin: 0 références _id MongoDB"
    ((passed++))
else
    echo -e "  ${YELLOW}⚠${NC} Admin: $admin_mongo références _id trouvées"
    ((warnings++))
fi

if [ "$client_mongo" -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} Client: 0 références _id MongoDB"
    ((passed++))
else
    echo -e "  ${YELLOW}⚠${NC} Client: $client_mongo références _id trouvées"
    ((warnings++))
fi
echo ""

echo -e "${BLUE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  6. Vérification Warnings ESLint                                   │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────────────────────────────┘${NC}"

eslint_warnings=$(pm2 logs sanny-client --lines 50 --nostream 2>&1 | grep "warning" | wc -l)
if [ "$eslint_warnings" -gt 0 ]; then
    echo -e "  ${YELLOW}⚠${NC} ESLint: $eslint_warnings warnings trouvés"
    pm2 logs sanny-client --lines 50 --nostream 2>&1 | grep -A1 "Line.*:" | head -6
    ((warnings++))
else
    echo -e "  ${GREEN}✓${NC} ESLint: Aucun warning"
    ((passed++))
fi
echo ""

echo -e "${BLUE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  7. Utilisation Mémoire                                            │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────────────────────────────┘${NC}"

pm2 jlist | jq -r '.[] | "\(.name): \(.monit.memory / 1024 / 1024 | floor)MB"' | while read line; do
    mem=$(echo "$line" | grep -o '[0-9]*' | head -1)
    if [ "$mem" -lt 200 ]; then
        echo -e "  ${GREEN}✓${NC} $line"
    else
        echo -e "  ${YELLOW}⚠${NC} $line"
    fi
done
echo ""

echo -e "${BLUE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
echo -e "${BLUE}│  8. Ports Réseau                                                   │${NC}"
echo -e "${BLUE}└─────────────────────────────────────────────────────────────────────┘${NC}"

ports=(3000 3001 4000)
for port in "${ports[@]}"; do
    if netstat -tuln | grep -q ":$port "; then
        echo -e "  ${GREEN}✓${NC} Port $port: OUVERT"
        ((passed++))
    else
        echo -e "  ${RED}✗${NC} Port $port: FERMÉ"
        ((failed++))
    fi
done
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Tests Réussis: $passed${NC}"
echo -e "${YELLOW}⚠ Warnings: $warnings${NC}"
echo -e "${RED}✗ Tests Échoués: $failed${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $failed -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "\n${GREEN}🎉 SYSTÈME EN PARFAIT ÉTAT !${NC}\n"
    exit 0
elif [ $failed -eq 0 ]; then
    echo -e "\n${YELLOW}⚠️  Système fonctionnel avec quelques warnings mineurs${NC}\n"
    exit 0
else
    echo -e "\n${RED}❌ Certains problèmes détectés. Consultez les détails ci-dessus.${NC}\n"
    exit 1
fi
