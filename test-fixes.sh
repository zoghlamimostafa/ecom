#!/bin/bash

echo "🧪 Test des Corrections - Sanny Store"
echo "======================================"
echo ""

# 1. Vérifier le backend
echo "1️⃣ Test du backend..."
if curl -s http://127.0.0.1:4000/api/ > /dev/null 2>&1; then
    echo "   ✅ Backend accessible"
else
    echo "   ❌ Backend non accessible"
    echo "   👉 Démarrez le backend: cd backend && npm start"
fi

# 2. Vérifier les images statiques
echo ""
echo "2️⃣ Test du service d'images..."
FIRST_IMAGE=$(ls /home/blackrdp/sanny/san/ecomerce_sanny/backend/public/images/*.jpeg 2>/dev/null | head -1)
if [ -n "$FIRST_IMAGE" ]; then
    IMAGE_NAME=$(basename "$FIRST_IMAGE")
    echo "   📷 Image trouvée: $IMAGE_NAME"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:4000/images/$IMAGE_NAME")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Image accessible via HTTP"
    else
        echo "   ❌ Image non accessible (HTTP $HTTP_CODE)"
        echo "   👉 Vérifiez express.static dans backend/index.js"
    fi
else
    echo "   ⚠️ Aucune image trouvée"
fi

# 3. Vérifier la structure des catégories
echo ""
echo "3️⃣ Test des catégories..."
cd /home/blackrdp/sanny/san/ecomerce_sanny/backend
node -e "
const { Category } = require('./models');
(async () => {
    try {
        const electronique = await Category.findByPk(1);
        if (electronique) {
            const subcats = await Category.findAll({ where: { parentId: 1 } });
            console.log('   ✅ Électronique trouvée:', subcats.length, 'sous-catégories');
            
            const smartphones = subcats.find(c => c.title === 'Smartphones');
            const tablettes = subcats.find(c => c.title === 'Tablettes');
            
            if (smartphones) console.log('   ✅ Smartphones (ID:', smartphones.id + ')');
            if (tablettes) console.log('   ✅ Tablettes (ID:', tablettes.id + ')');
        }
        
        const phoneTablet = await Category.findByPk(379);
        if (phoneTablet) {
            const subcats = await Category.findAll({ where: { parentId: 379 } });
            console.log('   ℹ️', phoneTablet.title + ':', subcats.length, 'sous-catégories');
        }
    } catch (e) {
        console.log('   ❌ Erreur:', e.message);
    }
    process.exit(0);
})();
" 2>/dev/null

# 4. Vérifier les produits récents
echo ""
echo "4️⃣ Test des produits..."
cd /home/blackrdp/sanny/san/ecomerce_sanny/backend
node -e "
const { Product } = require('./models');
(async () => {
    try {
        const products = await Product.findAll({ 
            limit: 3, 
            order: [['id', 'DESC']] 
        });
        
        console.log('   📦 Produits récents:');
        products.forEach(p => {
            const hasImages = p.images && p.images !== 'null';
            const imgIcon = hasImages ? '✅' : '❌';
            console.log('      ' + imgIcon, 'ID', p.id + ':', p.title.substring(0, 30));
        });
    } catch (e) {
        console.log('   ❌ Erreur:', e.message);
    }
    process.exit(0);
})();
" 2>/dev/null

echo ""
echo "======================================"
echo "✨ Tests terminés!"
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Redémarrer le backend (cd backend && npm start)"
echo "   2. Redémarrer le client (cd Client && npm start)"
echo "   3. Vérifier les images sur http://localhost:5000"
echo ""
