#!/bin/bash

echo "🧪 TEST AUTOMATIQUE DU SYSTÈME D'UPLOAD"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
TESTS_PASSED=0
TESTS_FAILED=0

# Fonction de test
test_assert() {
    local test_name=$1
    local command=$2
    local expected=$3
    
    echo -n "Test: $test_name ... "
    
    result=$(eval $command 2>&1)
    
    if [[ $result == *"$expected"* ]]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "  Attendu: $expected"
        echo "  Obtenu: $result"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "1️⃣  Tests de Base"
echo "─────────────────"

# Test 1: Backend accessible
test_assert "Backend accessible" \
    "curl -s http://localhost:4000/api/" \
    '"status":"OK"'

# Test 2: Backend port 4000
test_assert "Backend sur port 4000" \
    "lsof -i:4000 | grep LISTEN" \
    "4000"

# Test 3: Dossier images existe
test_assert "Dossier images existe" \
    "ls -d /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images" \
    "images"

# Test 4: Permissions dossier
test_assert "Permissions dossier correctes" \
    "stat -c '%a' /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images" \
    "755"

echo ""
echo "2️⃣  Tests Frontend"
echo "─────────────────"

# Test 5: Admin accessible
test_assert "Admin sur port 3001" \
    "lsof -i:3001 | grep LISTEN" \
    "3001"

# Test 6: Client accessible
test_assert "Client sur port 3000" \
    "lsof -i:3000 | grep LISTEN" \
    "3000"

echo ""
echo "3️⃣  Tests Configuration"
echo "─────────────────────"

# Test 7: Sharp installé
test_assert "Sharp installé" \
    "cd /home/blackrdp/sanny/san/ecomerce_sanny/backend && npm list sharp 2>&1" \
    "sharp@"

# Test 8: Multer installé
test_assert "Multer installé" \
    "cd /home/blackrdp/sanny/san/ecomerce_sanny/backend && npm list multer 2>&1" \
    "multer@"

# Test 9: Express async handler
test_assert "Express async handler installé" \
    "cd /home/blackrdp/sanny/san/ecomerce_sanny/backend && npm list express-async-handler 2>&1" \
    "express-async-handler@"

echo ""
echo "4️⃣  Tests Fichiers"
echo "─────────────────"

# Test 10: Controller existe
test_assert "uploadCtrl.js existe" \
    "ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/controller/uploadCtrl.js" \
    "uploadCtrl.js"

# Test 11: Middleware existe
test_assert "uploadImage.js existe" \
    "ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/middlewares/uploadImage.js" \
    "uploadImage.js"

# Test 12: Route existe
test_assert "uploadRoute.js existe" \
    "ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/routes/uploadRoute.js" \
    "uploadRoute.js"

echo ""
echo "5️⃣  Tests Serveur Statique"
echo "─────────────────────────"

# Test 13: Créer une image de test
echo "Test image" > /tmp/test-image-system.txt
test_assert "Fichier test créé" \
    "ls /tmp/test-image-system.txt" \
    "test-image-system.txt"

# Test 14: Copier dans le dossier images
cp /tmp/test-image-system.txt /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/test-access.txt
test_assert "Fichier copié dans images" \
    "ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/test-access.txt" \
    "test-access.txt"

# Test 15: Accessible via HTTP
test_assert "Fichier accessible via HTTP" \
    "curl -s http://localhost:4000/images/test-access.txt" \
    "Test image"

# Nettoyer
rm -f /tmp/test-image-system.txt
rm -f /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/test-access.txt

echo ""
echo "╔════════════════════════════════════╗"
echo "║         RÉSULTATS FINAUX           ║"
echo "╚════════════════════════════════════╝"
echo ""
echo -e "Tests réussis: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests échoués: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ TOUS LES TESTS SONT PASSÉS!${NC}"
    echo ""
    echo "🎉 Le système d'upload est prêt!"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "1. Ouvrez l'admin: http://localhost:3001"
    echo "2. Connectez-vous en tant qu'admin"
    echo "3. Allez dans 'Add Product'"
    echo "4. Ouvrez DevTools (F12)"
    echo "5. Uploadez une image"
    echo "6. Observez les logs console"
    echo ""
    echo "📊 Pour monitoring en temps réel:"
    echo "   ./monitor-upload.sh"
    echo ""
    exit 0
else
    echo -e "${RED}❌ CERTAINS TESTS ONT ÉCHOUÉ${NC}"
    echo ""
    echo "🔧 Actions recommandées:"
    echo "1. Vérifiez les logs ci-dessus"
    echo "2. Redémarrez les services si nécessaire"
    echo "3. Vérifiez les permissions"
    echo ""
    echo "📖 Documentation complète:"
    echo "   cat DIAGNOSTIC_UPLOAD_COMPLET.md"
    echo ""
    exit 1
fi
