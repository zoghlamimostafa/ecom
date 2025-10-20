#!/bin/bash

echo "🧪 TEST AUTOMATIQUE E-COMMERCE SANNY STORE"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TOTAL=0
PASSED=0
FAILED=0

# URL de base
BASE_URL="http://74.235.205.26:4000"
CLIENT_URL="http://74.235.205.26:3000"
ADMIN_URL="http://74.235.205.26:3001"

test_api() {
    local name=$1
    local url=$2
    local expected=$3
    
    ((TOTAL++))
    echo -n "Testing $name... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$status" -eq "$expected" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $status)"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} (Expected $expected, got $status)"
        ((FAILED++))
    fi
}

test_api_json() {
    local name=$1
    local url=$2
    
    ((TOTAL++))
    echo -n "Testing $name... "
    
    response=$(curl -s "$url" 2>/dev/null)
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$status" -eq 200 ] && echo "$response" | python3 -c "import sys, json; json.load(sys.stdin)" 2>/dev/null; then
        echo -e "${GREEN}✅ PASS${NC} (Valid JSON)"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $status or Invalid JSON)"
        ((FAILED++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 1. TEST CONNECTIVITÉ SERVICES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_api "Backend API Health" "$BASE_URL/api/" 200
test_api "Client Application" "$CLIENT_URL" 200
test_api "Admin Application" "$ADMIN_URL" 200

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🛍️ 2. TEST API PRODUITS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_api_json "GET All Products" "$BASE_URL/api/product"
test_api_json "GET Product Count" "$BASE_URL/api/product/count"

# Obtenir un ID de produit pour tests
PRODUCT_ID=$(curl -s "$BASE_URL/api/product" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['id'] if len(data) > 0 else '')" 2>/dev/null)

if [ -n "$PRODUCT_ID" ]; then
    test_api "GET Single Product" "$BASE_URL/api/product/$PRODUCT_ID" 200
    echo -e "  ${BLUE}ℹ️${NC} Testing with product ID: $PRODUCT_ID"
else
    echo -e "${YELLOW}⚠️${NC} No products found in database"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📂 3. TEST API CATÉGORIES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_api_json "GET All Categories" "$BASE_URL/api/category"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏷️ 4. TEST API MARQUES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_api_json "GET All Brands" "$BASE_URL/api/brand"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖼️ 5. TEST IMAGES STATIQUES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Trouver une image existante
FIRST_IMAGE=$(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | grep "images-" | head -1)

if [ -n "$FIRST_IMAGE" ]; then
    test_api "Serve Static Image" "$BASE_URL/images/$FIRST_IMAGE" 200
    echo -e "  ${BLUE}ℹ️${NC} Testing image: $FIRST_IMAGE"
else
    echo -e "${YELLOW}⚠️${NC} No images found in directory"
fi

# Vérifier dossier images existe
if [ -d "/home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/" ]; then
    IMAGE_COUNT=$(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/ | wc -l)
    echo -e "  ${BLUE}ℹ️${NC} Total images in storage: $IMAGE_COUNT"
else
    echo -e "${RED}❌${NC} Images directory not found!"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️ 6. TEST BASE DE DONNÉES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

DB_PATH="/home/blackrdp/sanny/san/ecomerce_sanny/backend/database.sqlite"

if [ -f "$DB_PATH" ]; then
    echo -e "${GREEN}✅${NC} Database file exists"
    ((PASSED++))
    ((TOTAL++))
    
    # Compter produits
    PRODUCTS_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM products;" 2>/dev/null)
    echo -e "  ${BLUE}ℹ️${NC} Total products in DB: $PRODUCTS_COUNT"
    
    # Compter utilisateurs
    USERS_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM users;" 2>/dev/null)
    echo -e "  ${BLUE}ℹ️${NC} Total users in DB: $USERS_COUNT"
    
    # Compter catégories
    CATEGORIES_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM categories;" 2>/dev/null)
    echo -e "  ${BLUE}ℹ️${NC} Total categories in DB: $CATEGORIES_COUNT"
else
    echo -e "${RED}❌${NC} Database file not found!"
    ((FAILED++))
    ((TOTAL++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 7. TEST SERVICES PM2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Vérifier backend
if pm2 list | grep -q "backend-fixed.*online"; then
    echo -e "${GREEN}✅${NC} Backend service online"
    ((PASSED++))
    ((TOTAL++))
else
    echo -e "${RED}❌${NC} Backend service not online"
    ((FAILED++))
    ((TOTAL++))
fi

# Vérifier client
if pm2 list | grep -q "sanny-client.*online"; then
    echo -e "${GREEN}✅${NC} Client service online"
    ((PASSED++))
    ((TOTAL++))
else
    echo -e "${RED}❌${NC} Client service not online"
    ((FAILED++))
    ((TOTAL++))
fi

# Vérifier admin
if pm2 list | grep -q "sanny-admin.*online"; then
    echo -e "${GREEN}✅${NC} Admin service online"
    ((PASSED++))
    ((TOTAL++))
else
    echo -e "${RED}❌${NC} Admin service not online"
    ((FAILED++))
    ((TOTAL++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RÉSUMÉ DES TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PERCENT=$((PASSED * 100 / TOTAL))

echo "Total tests: $TOTAL"
echo -e "Réussis: ${GREEN}$PASSED${NC}"
echo -e "Échoués: ${RED}$FAILED${NC}"
echo "Taux de réussite: $PERCENT%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ TOUS LES TESTS SONT PASSÉS!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🎉 Le site e-commerce est fonctionnel!"
    echo ""
    echo "📝 PROCHAINES ÉTAPES:"
    echo "  1. Effectuer tests manuels (voir TEST_ECOMMERCE_COMPLET.md)"
    echo "  2. Tester flux complet achat"
    echo "  3. Vérifier responsive mobile/tablet"
    echo "  4. Tester admin (ajout/modification produits)"
    echo "  5. Valider sécurité et performance"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ CERTAINS TESTS ONT ÉCHOUÉ${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "🔧 ACTIONS REQUISES:"
    echo "  1. Vérifier logs PM2: pm2 logs"
    echo "  2. Vérifier services: pm2 list"
    echo "  3. Redémarrer si nécessaire: pm2 restart all"
    echo "  4. Consulter documentation des erreurs"
    exit 1
fi
