#!/bin/bash

echo "🧪 TEST RAPIDE - Filtrage Pages de Catégories"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Vérifier les produits par catégorie dans la BDD
echo "📦 PRODUITS PAR CATÉGORIE (Backend):"
echo "───────────────────────────────────────────────────────────────"

cd /home/blackrdp/sanny/san/ecomerce_sanny/backend

node -e "
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

(async () => {
  const [products] = await sequelize.query('SELECT id, title, category FROM products');
  
  const categoryMap = {
    '1': 'Électronique',
    '3': 'Sport',
    '4': 'Maison',
    '7': 'Smartphones',
    '39': 'Auto & Moto',
    '59': 'Beauté',
    '261': 'Hygiène',
    '277': 'Animaux',
    '300': 'Bébé',
    '326': 'Jardin',
    '345': 'Jeux',
    '378': 'Informatique',
    '379': 'Téléphones',
    '380': 'Mode Homme',
    '381': 'Mode Femme',
    '387': 'Autres'
  };
  
  const grouped = {};
  products.forEach(p => {
    const cat = p.category || 'null';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p.title);
  });
  
  console.log('');
  Object.keys(grouped).sort().forEach(catId => {
    const catName = categoryMap[catId] || 'Inconnue';
    console.log(\`   Cat \${catId.padEnd(3)} (\${catName.padEnd(20)}): \${grouped[catId].length} produit(s)\`);
    grouped[catId].forEach(title => {
      console.log(\`           → \${title}\`);
    });
  });
  
  await sequelize.close();
})();
"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "✅ PAGES QUI DEVRAIENT AVOIR DES PRODUITS:"
echo "   • /maison → 1 produit"
echo "   • /telephone → 1 produit"
echo ""
echo "⚠️  PAGES QUI SERONT VIDES (normal):"
echo "   • /informatique, /electro, /sport, /animaux, /auto,"
echo "     /femme, /homme, /bebe, /jeux, /jardin, /sante, /other"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🔄 INSTRUCTIONS:"
echo "   1. Rechargez le client: Ctrl+Shift+R"
echo "   2. Videz le cache: Ctrl+Shift+Delete"
echo "   3. Ouvrez F12 → Console"
echo "   4. Visitez les pages et vérifiez les logs:"
echo "      🔍 [PageName] Filtrage: {...}"
echo ""
echo "═══════════════════════════════════════════════════════════════"
