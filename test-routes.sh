#!/bin/bash

echo "🔍 Diagnostic des Routes Backend - Sanny Store"
echo "============================================="

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
BASE_URL="http://localhost:4000"
API_URL="$BASE_URL/api"

# Fonction pour tester une route
test_route() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $description... "
    
    response=$(curl -s -w "%{http_code}" -o /tmp/response.txt "$url")
    status_code=$response
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK (${status_code})${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL (${status_code})${NC}"
        echo "  Expected: $expected_status, Got: $status_code"
        if [ -f /tmp/response.txt ]; then
            echo "  Response: $(head -1 /tmp/response.txt)"
        fi
        return 1
    fi
}

echo "🏠 Routes Principales"
echo "-------------------"
test_route "$BASE_URL/" "Route racine"
test_route "$API_URL/" "Health check API"

echo ""
echo "📦 Routes Produits"
echo "-----------------"
test_route "$API_URL/product" "Liste des produits"
test_route "$API_URL/product/1" "Produit spécifique (ID)"
test_route "$BASE_URL/product" "Redirection /product" 301

echo ""
echo "👤 Routes Utilisateurs"
echo "---------------------"
test_route "$API_URL/user/all-users" "Liste utilisateurs" 401
test_route "$API_URL/user/admin-login" "Login admin" 405

echo ""
echo "🎨 Routes Ressources"
echo "------------------"
test_route "$API_URL/brand" "Marques"
test_route "$API_URL/category" "Catégories"
test_route "$API_URL/color" "Couleurs"

echo ""
echo "🚫 Routes d'Erreur"
echo "-----------------"
test_route "$BASE_URL/route-inexistante" "Route inexistante" 404
test_route "$BASE_URL/favicon.ico" "Favicon" 204

echo ""
echo "📊 Résumé"
echo "--------"
echo "Backend URL: $BASE_URL"
echo "API Base: $API_URL"
echo "Status: $(curl -s $BASE_URL/ | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"

# Nettoyer
rm -f /tmp/response.txt

echo ""
echo "✅ Diagnostic terminé !"