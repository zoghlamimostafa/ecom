#!/bin/bash

echo "🧪 TEST COMPLET - Sanny Store"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Fonction pour tester
test_endpoint() {
    local NAME=$1
    local URL=$2
    local EXPECTED=$3
    
    echo -n "   Testing $NAME... "
    RESPONSE=$(curl -s "$URL")
    
    if echo "$RESPONSE" | grep -q "$EXPECTED"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "      Expected: $EXPECTED"
        echo "      Got: $(echo $RESPONSE | head -c 100)..."
        ((FAILED++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}1️⃣  BACKEND - Tests API${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Backend Health Check
test_endpoint "Health Check" "http://127.0.0.1:4000/api/" '"status":"OK"'

# Test 2: Get All Products
test_endpoint "Get All Products" "http://127.0.0.1:4000/api/product" '"id"'

# Test 3: Get Product by ID
test_endpoint "Get Product by ID (40)" "http://127.0.0.1:4000/api/product/40" '"success":true'

# Test 4: Get Product by Slug
test_endpoint "Get Product by Slug" "http://127.0.0.1:4000/api/product/iphone-16-128gb" '"iPhone 16 128GB"'

# Test 5: Images Static
echo -n "   Testing Static Images... "
IMAGE_FILE=$(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/*.jpeg 2>/dev/null | head -1)
if [ -n "$IMAGE_FILE" ]; then
    IMAGE_NAME=$(basename "$IMAGE_FILE")
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:4000/images/$IMAGE_NAME")
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL (HTTP $HTTP_CODE)${NC}"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  SKIP (No images)${NC}"
fi

# Test 6: Categories
test_endpoint "Get Categories" "http://127.0.0.1:4000/api/category" '"title"'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}2️⃣  DATABASE - Tests Données${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /home/blackrdp/sanny/san/ecomerce_sanny/backend

# Test 7: Products Count
echo -n "   Checking Products Count... "
PRODUCT_COUNT=$(node -e "
const { Product } = require('./models');
(async () => {
    const count = await Product.count();
    console.log(count);
    process.exit(0);
})();
" 2>/dev/null)

if [ "$PRODUCT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} ($PRODUCT_COUNT produits)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} (0 produits)"
    ((FAILED++))
fi

# Test 8: Categories Count
echo -n "   Checking Categories Count... "
CAT_COUNT=$(node -e "
const { Category } = require('./models');
(async () => {
    const count = await Category.count();
    console.log(count);
    process.exit(0);
})();
" 2>/dev/null)

if [ "$CAT_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} ($CAT_COUNT catégories)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} (0 catégories)"
    ((FAILED++))
fi

# Test 9: Subcategories for "Téléphones et Tablettes"
echo -n "   Checking Subcategories (ID 379)... "
SUBCAT_COUNT=$(node -e "
const { Category } = require('./models');
(async () => {
    const count = await Category.count({ where: { parentId: 379 } });
    console.log(count);
    process.exit(0);
})();
" 2>/dev/null)

if [ "$SUBCAT_COUNT" -ge 3 ]; then
    echo -e "${GREEN}✅ PASS${NC} ($SUBCAT_COUNT sous-catégories)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL${NC} ($SUBCAT_COUNT sous-catégories, attendu: 3)"
    ((FAILED++))
fi

# Test 10: Product with Images
echo -n "   Checking Products with Images... "
PRODUCTS_WITH_IMAGES=$(node -e "
const { Product } = require('./models');
(async () => {
    const products = await Product.findAll();
    const withImages = products.filter(p => p.images && p.images !== 'null' && p.images !== '[]');
    console.log(withImages.length);
    process.exit(0);
})();
" 2>/dev/null)

if [ "$PRODUCTS_WITH_IMAGES" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} ($PRODUCTS_WITH_IMAGES produits avec images)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC} (0 produits avec images)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}3️⃣  FILTRAGE - Tests Catégories${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 11: Filter by Category ID
echo -n "   Filter by Category (379)... "
FILTERED=$(node -e "
const { Product } = require('./models');
(async () => {
    const products = await Product.findAll();
    const filtered = products.filter(p => p.category && p.category.toString() === '379');
    console.log(filtered.length);
    process.exit(0);
})();
" 2>/dev/null)

if [ "$FILTERED" -gt 0 ]; then
    echo -e "${GREEN}✅ PASS${NC} ($FILTERED produits trouvés)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  INFO${NC} (0 produits dans catégorie 379)"
fi

# Test 12: Category Types Check
echo -n "   Checking Category Data Types... "
node -e "
const { Product } = require('./models');
(async () => {
    const product = await Product.findOne({ where: { category: '379' } });
    if (product) {
        console.log('Type:', typeof product.category, '✅');
    } else {
        console.log('No product found ⚠️');
    }
    process.exit(0);
})();
" 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}4️⃣  CLIENT - Vérifications${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 13: Client Running
echo -n "   Checking Client (port 5000)... "
if curl -s http://localhost:5000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ RUNNING${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  NOT RUNNING${NC}"
    echo "      👉 Start client: cd Client && npm start"
fi

# Test 14: Admin Running
echo -n "   Checking Admin (port 3001)... "
if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ RUNNING${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  NOT RUNNING${NC}"
    echo "      👉 Start admin: cd admin-app && npm start"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}5️⃣  FICHIERS - Vérifications Code${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 15: Backend express.static
echo -n "   Backend serves images (express.static)... "
if grep -q "express.static.*images" /home/blackrdp/sanny/san/ecomerce_sanny/backend/index.js; then
    echo -e "${GREEN}✅ CONFIGURED${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ MISSING${NC}"
    ((FAILED++))
fi

# Test 16: Client imageHelper with BACKEND_URL
echo -n "   Client imageHelper has BACKEND_URL... "
if grep -q "BACKEND_URL.*127.0.0.1:4000" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/utils/imageHelper.js; then
    echo -e "${GREEN}✅ CONFIGURED${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ MISSING${NC}"
    ((FAILED++))
fi

# Test 17: ProductFilters uses IDs
echo -n "   ProductFilters uses category IDs... "
if grep -q "id.*title" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/components/ProductFilters.js; then
    echo -e "${GREEN}✅ CONFIGURED${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ MISSING${NC}"
    ((FAILED++))
fi

# Test 18: SingleProduct dangerouslySetInnerHTML
echo -n "   SingleProduct HTML rendering... "
if grep -q "dangerouslySetInnerHTML" /home/blackrdp/sanny/san/ecomerce_sanny/Client/src/pages/SingleProduct.js; then
    echo -e "${GREEN}✅ CONFIGURED${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ MISSING${NC}"
    ((FAILED++))
fi

# Test 19: Backend supports slug
echo -n "   Backend supports slug lookup... "
if grep -q "findOne.*slug" /home/blackrdp/sanny/san/ecomerce_sanny/backend/controller/productCtrl.js; then
    echo -e "${GREEN}✅ CONFIGURED${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ MISSING${NC}"
    ((FAILED++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 RÉSULTATS FINAUX${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$(( PASSED * 100 / TOTAL ))

echo -e "   ${GREEN}✅ Tests Réussis: $PASSED${NC}"
echo -e "   ${RED}❌ Tests Échoués: $FAILED${NC}"
echo -e "   📊 Taux de Réussite: ${SUCCESS_RATE}%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TOUS LES TESTS SONT PASSÉS !${NC}"
    echo ""
    echo "✨ Votre application est prête !"
    echo ""
    echo "🌐 URLs:"
    echo "   - Backend API: http://127.0.0.1:4000/api/"
    echo "   - Client:      http://localhost:5000"
    echo "   - Admin:       http://localhost:3001/admin"
    echo ""
else
    echo -e "${YELLOW}⚠️  QUELQUES TESTS ONT ÉCHOUÉ${NC}"
    echo ""
    echo "📝 Actions recommandées:"
    echo "   1. Vérifier les logs: tail -f /tmp/sanny-backend.log"
    echo "   2. Redémarrer les services: ./restart-services.sh"
    echo "   3. Vérifier la console du navigateur (F12)"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📚 Documentation disponible:"
echo "   - RESUME_COMPLET_CORRECTIONS.md"
echo "   - FIX_FILTRAGE_CATEGORIES.md"
echo "   - FIX_PAGE_DETAIL_PRODUIT.md"
echo "   - FIX_DESCRIPTION_HTML.md"
echo "   - CORRECTION_SLUG_BACKEND.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exit $FAILED
