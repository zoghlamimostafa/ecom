const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './backend/database.sqlite',
  logging: false
});

async function diagnosticFiltrage() {
  console.log('🔍 DIAGNOSTIC COMPLET DU FILTRAGE\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Récupérer tous les produits
  const [products] = await sequelize.query('SELECT id, title, category, subcategory FROM products');
  
  console.log('📦 TOUS LES PRODUITS:');
  console.log('─────────────────────────────────────────────────────────────');
  products.forEach(p => {
    console.log(`[ID: ${p.id}] ${p.title}`);
    console.log(`   • Catégorie: ${p.category} (type: ${typeof p.category})`);
    console.log(`   • Sous-catégorie: ${p.subcategory}`);
  });

  // 2. Récupérer les catégories principales
  console.log('\n\n🏷️  CATÉGORIES PRINCIPALES (level = 0):');
  console.log('─────────────────────────────────────────────────────────────');
  const [mainCategories] = await sequelize.query('SELECT id, title, level FROM categories WHERE level = 0 ORDER BY id');
  mainCategories.forEach(c => {
    const productsInCat = products.filter(p => p.category === c.id.toString() || p.category === c.id);
    console.log(`[ID: ${c.id}] ${c.title} → ${productsInCat.length} produit(s)`);
    productsInCat.forEach(p => {
      console.log(`   ↳ ${p.title}`);
    });
  });

  // 3. Vérifier catégorie ID 379 (Téléphones et Tablettes)
  console.log('\n\n📱 CATÉGORIE "TÉLÉPHONES ET TABLETTES" (ID: 379):');
  console.log('─────────────────────────────────────────────────────────────');
  const [cat379] = await sequelize.query('SELECT * FROM categories WHERE id = 379');
  if (cat379.length > 0) {
    console.log(`Titre: ${cat379[0].title}`);
    console.log(`Level: ${cat379[0].level}`);
    console.log(`Parent: ${cat379[0].parent}`);
  }

  // 4. Sous-catégories de 379
  const [subCat379] = await sequelize.query('SELECT * FROM categories WHERE parent = 379');
  console.log(`\nSous-catégories: ${subCat379.length}`);
  subCat379.forEach(sc => {
    console.log(`   • [ID: ${sc.id}] ${sc.title}`);
  });

  // 5. Produits dans catégorie 379 ou ses sous-catégories
  const cat379Ids = [379, ...subCat379.map(sc => sc.id)];
  const productsInCat379 = products.filter(p => {
    const pCat = p.category ? p.category.toString() : '';
    const pSubcat = p.subcategory ? p.subcategory.toString() : '';
    return cat379Ids.some(id => pCat === id.toString() || pSubcat === id.toString());
  });
  
  console.log(`\n📦 Produits avec category=379 ou subcategory=379:`);
  if (productsInCat379.length > 0) {
    productsInCat379.forEach(p => {
      console.log(`   ✅ [ID: ${p.id}] ${p.title} (cat: ${p.category}, subcat: ${p.subcategory})`);
    });
  } else {
    console.log('   ⚠️  AUCUN produit trouvé !');
  }

  // 6. Test de filtrage comme dans le code React
  console.log('\n\n🧪 TEST DE FILTRAGE (simulation React):');
  console.log('─────────────────────────────────────────────────────────────');
  
  const testCategoryId = '379';
  console.log(`Filtre demandé: categoryId = "${testCategoryId}"`);
  
  const filtered = products.filter(product => {
    const productCategory = product.category ? product.category.toString() : '';
    const productSubcategory = product.subcategory ? product.subcategory.toString() : '';
    
    const match = productCategory === testCategoryId || productSubcategory === testCategoryId;
    
    if (match) {
      console.log(`   ✅ MATCH: [ID: ${product.id}] ${product.title}`);
      console.log(`      → cat: "${productCategory}" === "${testCategoryId}" ? ${productCategory === testCategoryId}`);
      console.log(`      → subcat: "${productSubcategory}" === "${testCategoryId}" ? ${productSubcategory === testCategoryId}`);
    }
    
    return match;
  });
  
  console.log(`\n📊 Résultat: ${filtered.length} produit(s) trouvé(s)`);

  // 7. Vérifier les produits "orphelins" (catégorie inexistante)
  console.log('\n\n⚠️  VÉRIFICATION DES CATÉGORIES ORPHELINES:');
  console.log('─────────────────────────────────────────────────────────────');
  const [allCategories] = await sequelize.query('SELECT id FROM categories');
  const categoryIds = allCategories.map(c => c.id.toString());
  
  products.forEach(p => {
    const pCat = p.category ? p.category.toString() : '';
    if (pCat && !categoryIds.includes(pCat)) {
      console.log(`   ⚠️  [ID: ${p.id}] ${p.title} → catégorie ${pCat} n'existe pas !`);
    }
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
  await sequelize.close();
}

diagnosticFiltrage().catch(console.error);
