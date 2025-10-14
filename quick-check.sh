#!/bin/bash

# 🎯 Script de vérification rapide du système
# Usage: ./quick-check.sh

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🎯 VÉRIFICATION RAPIDE SYSTÈME E-COMMERCE             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Services PM2
echo "📊 1. Services PM2"
echo "━━━━━━━━━━━━━━━━━━"
if pm2 status | grep -q "online"; then
    echo -e "${GREEN}✅ Services en ligne${NC}"
    pm2 status | tail -5
else
    echo -e "${RED}❌ Problème avec les services${NC}"
fi
echo ""

# 2. Base de données
echo "💾 2. Base de données SQLite"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
DB_FILE="backend/database.sqlite"
if [ -f "$DB_FILE" ]; then
    SIZE=$(ls -lh "$DB_FILE" | awk '{print $5}')
    echo -e "${GREEN}✅ Database présente: $SIZE${NC}"
    
    # Compter les tables
    TABLES=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" 2>/dev/null)
    echo "   Tables: $TABLES"
    
    # Compter les produits
    PRODUCTS=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM Products;" 2>/dev/null)
    echo "   Produits: $PRODUCTS"
    
    # Compter les catégories
    CATEGORIES=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM Categories;" 2>/dev/null)
    echo "   Catégories: $CATEGORIES"
else
    echo -e "${RED}❌ Database non trouvée${NC}"
fi
echo ""

# 3. Backend API
echo "🔌 3. Backend API (Port 4000)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/product | grep -q "200"; then
    echo -e "${GREEN}✅ Backend répond (HTTP 200)${NC}"
else
    echo -e "${RED}❌ Backend ne répond pas${NC}"
fi
echo ""

# 4. Client Interface
echo "🌐 4. Client Interface (Port 3000)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200"; then
    echo -e "${GREEN}✅ Client accessible (HTTP 200)${NC}"
else
    echo -e "${RED}❌ Client non accessible${NC}"
fi
echo ""

# 5. Admin Interface
echo "⚙️  5. Admin Interface (Port 3001)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ | grep -q "200"; then
    echo -e "${GREEN}✅ Admin accessible (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠️  Admin non accessible${NC}"
fi
echo ""

# 6. Mémoire utilisée
echo "💾 6. Utilisation Mémoire"
echo "━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL_MEM=$(pm2 jlist 2>/dev/null | grep -o '"memory":[0-9]*' | cut -d':' -f2 | awk '{s+=$1} END {printf "%.1f", s/1024/1024}')
if [ ! -z "$TOTAL_MEM" ]; then
    echo -e "${GREEN}Total: ${TOTAL_MEM} MB${NC}"
else
    echo -e "${YELLOW}⚠️  Impossible de calculer${NC}"
fi
echo ""

# 7. Dernière compilation
echo "🔨 7. Dernière Compilation Client"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if pm2 logs sanny-client --lines 20 --nostream 2>/dev/null | grep -q "Compiled successfully"; then
    echo -e "${GREEN}✅ Dernière compilation réussie${NC}"
elif pm2 logs sanny-client --lines 20 --nostream 2>/dev/null | grep -q "webpack compiled"; then
    echo -e "${YELLOW}⚠️  Compilé avec warnings${NC}"
else
    echo -e "${RED}❌ Erreur de compilation${NC}"
fi
echo ""

# 8. Résumé Final
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     🎯 RÉSUMÉ GLOBAL                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Calculer le score
SCORE=0
pm2 status | grep -q "online" && SCORE=$((SCORE + 20))
[ -f "$DB_FILE" ] && SCORE=$((SCORE + 20))
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/product | grep -q "200" && SCORE=$((SCORE + 20))
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200" && SCORE=$((SCORE + 20))
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ | grep -q "200" && SCORE=$((SCORE + 20))

if [ $SCORE -eq 100 ]; then
    echo -e "${GREEN}✅ EXCELLENT: Tous les systèmes opérationnels (100%)${NC}"
elif [ $SCORE -ge 80 ]; then
    echo -e "${GREEN}✅ BON: Système principalement fonctionnel ($SCORE%)${NC}"
elif [ $SCORE -ge 60 ]; then
    echo -e "${YELLOW}⚠️  MOYEN: Quelques problèmes détectés ($SCORE%)${NC}"
else
    echo -e "${RED}❌ CRITIQUE: Plusieurs problèmes détectés ($SCORE%)${NC}"
fi

echo ""
echo "📚 Pour plus de détails, consultez:"
echo "   - DIAGNOSTIC_COMPLET_RAPPORT.md"
echo "   - RAPPORT_FINAL_SYSTEME.md"
echo ""
echo "🔧 Commandes utiles:"
echo "   pm2 status          # Voir les services"
echo "   pm2 logs            # Voir les logs"
echo "   pm2 restart all     # Redémarrer tout"
echo ""
