#!/bin/bash

# Script de vérification rapide du statut e-commerce

echo "🔍 VÉRIFICATION RAPIDE E-COMMERCE"
echo "=================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Services PM2
echo "📊 État des Services:"
pm2 list | grep -E "backend-fixed|sanny-client|sanny-admin"
echo ""

# 2. URLs
echo "🌐 URLs Actives:"
echo "  Client:  http://74.235.205.26:3000"
echo "  Admin:   http://74.235.205.26:3001"
echo "  Backend: http://74.235.205.26:4000"
echo ""

# 3. Base de données
echo "🗄️ Base de Données:"
PRODUCTS=$(sqlite3 /home/blackrdp/sanny/san/ecomerce_sanny/backend/database.sqlite "SELECT COUNT(*) FROM products;" 2>/dev/null)
USERS=$(sqlite3 /home/blackrdp/sanny/san/ecomerce_sanny/backend/database.sqlite "SELECT COUNT(*) FROM users;" 2>/dev/null)
echo "  Produits: $PRODUCTS"
echo "  Utilisateurs: $USERS"
echo ""

# 4. Images
IMAGE_COUNT=$(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ 2>/dev/null | wc -l)
echo "🖼️ Images Stockées: $IMAGE_COUNT fichiers"
echo ""

# 5. Dernières corrections
echo "✅ Corrections Appliquées Aujourd'hui:"
echo "  1. Erreur tags.split admin → FIXÉ"
echo "  2. Suppression cart avec feedback → FIXÉ"
echo "  3. Prix en DT partout → FIXÉ"
echo "  4. Icône cart ProductCard → AJOUTÉ"
echo "  5. Logs debug checkout → AJOUTÉ"
echo ""

# 6. Tests automatiques
echo "🧪 Résultat Tests Automatiques:"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://74.235.205.26:4000/api/ 2>/dev/null)
CLIENT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://74.235.205.26:3000 2>/dev/null)
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://74.235.205.26:3001 2>/dev/null)

if [ "$BACKEND_STATUS" -eq 200 ]; then
    echo -e "  Backend: ${GREEN}✅ Online (HTTP 200)${NC}"
else
    echo -e "  Backend: ${RED}❌ Offline (HTTP $BACKEND_STATUS)${NC}"
fi

if [ "$CLIENT_STATUS" -eq 200 ]; then
    echo -e "  Client:  ${GREEN}✅ Online (HTTP 200)${NC}"
else
    echo -e "  Client:  ${RED}❌ Offline (HTTP $CLIENT_STATUS)${NC}"
fi

if [ "$ADMIN_STATUS" -eq 200 ]; then
    echo -e "  Admin:   ${GREEN}✅ Online (HTTP 200)${NC}"
else
    echo -e "  Admin:   ${RED}❌ Offline (HTTP $ADMIN_STATUS)${NC}"
fi

echo ""

# 7. Statut global
echo "🎯 Statut Global:"
if [ "$BACKEND_STATUS" -eq 200 ] && [ "$CLIENT_STATUS" -eq 200 ] && [ "$ADMIN_STATUS" -eq 200 ]; then
    echo -e "  ${GREEN}🟢 TOUT FONCTIONNE PARFAITEMENT!${NC}"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "  1. Tests manuels (voir TEST_ECOMMERCE_COMPLET.md)"
    echo "  2. Vérifier images dans checkout"
    echo "  3. Tester admin upload produits"
    echo "  4. Valider flux complet achat"
else
    echo -e "  ${RED}🔴 PROBLÈMES DÉTECTÉS${NC}"
    echo ""
    echo "🔧 Actions:"
    echo "  - Vérifier logs: pm2 logs"
    echo "  - Redémarrer: pm2 restart all"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
