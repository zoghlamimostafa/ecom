#!/bin/bash

echo "🔗 Vérification Rapide des Liaisons Sanny Store"
echo "=============================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de test
test_url() {
    local name=$1
    local url=$2
    local code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$code" = "200" ]; then
        echo -e "${GREEN}✅ $name${NC} (HTTP $code)"
        return 0
    elif [ "$code" = "000" ]; then
        echo -e "${RED}❌ $name${NC} (Inaccessible)"
        return 1
    else
        echo -e "${YELLOW}⚠️  $name${NC} (HTTP $code)"
        return 2
    fi
}

# Tests
echo "📍 Applications:"
test_url "Backend (4000) " "http://localhost:4000/api/product/"
test_url "Admin (3001)   " "http://localhost:3001"
test_url "Client (3000)  " "http://localhost:3000"

echo ""
echo "🔌 APIs Backend:"
test_url "Products   " "http://localhost:4000/api/product/"
test_url "Categories " "http://localhost:4000/api/category/"
test_url "Brands     " "http://localhost:4000/api/brand/"
test_url "Colors     " "http://localhost:4000/api/color/"
test_url "Users      " "http://localhost:4000/api/user/all-users"

echo ""
echo "📊 Données:"
products=$(curl -s http://localhost:4000/api/product/ | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('products', data)))" 2>/dev/null)
categories=$(curl -s http://localhost:4000/api/category/ | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data))" 2>/dev/null)
brands=$(curl -s http://localhost:4000/api/brand/ | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data['brands']))" 2>/dev/null)
colors=$(curl -s http://localhost:4000/api/color/ | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data['colors']))" 2>/dev/null)

echo "  Produits: $products"
echo "  Catégories: $categories"
echo "  Marques: $brands"
echo "  Couleurs: $colors"

echo ""
echo "🔧 Processus PM2:"
pm2 list | grep -E "backend-fixed|sanny-admin|sanny-client"

echo ""
echo "✅ Vérification terminée!"
