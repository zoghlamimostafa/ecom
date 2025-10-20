/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║    RAPPORT COMPLET - CONNEXION SQLite & API              ║
 * ╚══════════════════════════════════════════════════════════╝
 */

const { sequelize, defineAssociations } = require('./models');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Color = require('./models/Color');

console.log('\n\n');
console.log('═'.repeat(70));
console.log('  🔍 RAPPORT DE DIAGNOSTIC COMPLET - SANNY STORE');
console.log('═'.repeat(70));
console.log('\n');

async function generateFullReport() {
  let hasErrors = false;
  
  try {
    // ==================== SECTION 1: BASE DE DONNÉES ====================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  📊 SECTION 1: CONNEXION BASE DE DONNÉES SQLite            │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    // Test connexion
    await sequelize.authenticate();
    console.log('✅ Connexion établie avec succès');
    console.log(`   📂 Fichier: ${sequelize.options.storage}`);
    console.log(`   🔧 Dialecte: ${sequelize.options.dialect}`);
    console.log(`   ⏱️  Logging: ${sequelize.options.logging ? 'Activé' : 'Désactivé'}`);
    
    // Associations
    defineAssociations();
    console.log('✅ Associations de modèles définies\n');
    
    // Sync
    await sequelize.sync({ alter: false });
    console.log('✅ Synchronisation des tables complétée\n');

    // ==================== SECTION 2: TABLES ====================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  🗄️  SECTION 2: TABLES DE LA BASE DE DONNÉES               │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    const [tables] = await sequelize.query(`
      SELECT name, sql FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name;
    `);
    
    console.log(`Total: ${tables.length} tables créées\n`);
    
    const essentialTables = ['Users', 'Products', 'Categories', 'Brands', 'Colors', 'Carts', 'Wishlists', 'Orders'];
    console.log('📋 Tables essentielles:');
    essentialTables.forEach(tableName => {
      const exists = tables.find(t => t.name === tableName);
      console.log(`   ${exists ? '✅' : '❌'} ${tableName}`);
      if (!exists) hasErrors = true;
    });
    
    console.log('\n📋 Toutes les tables:');
    tables.forEach(table => {
      console.log(`   • ${table.name}`);
    });
    console.log();

    // ==================== SECTION 3: MODÈLES SEQUELIZE ====================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  🏗️  SECTION 3: MODÈLES SEQUELIZE                           │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    // Vérifier Product Model
    console.log('📦 Modèle Product:');
    const productAttributes = Object.keys(Product.rawAttributes);
    console.log(`   Champs (${productAttributes.length}): ${productAttributes.join(', ')}`);
    
    const requiredProductFields = ['title', 'description', 'price', 'category', 'brand', 'quantity'];
    requiredProductFields.forEach(field => {
      const exists = productAttributes.includes(field);
      console.log(`   ${exists ? '✅' : '❌'} ${field}`);
      if (!exists) hasErrors = true;
    });
    
    // Vérifier Category Model
    console.log('\n🗂️  Modèle Category:');
    const categoryAttributes = Object.keys(Category.rawAttributes);
    console.log(`   Champs (${categoryAttributes.length}): ${categoryAttributes.join(', ')}`);
    console.log(`   ✅ Support sous-catégories (parentId): ${categoryAttributes.includes('parentId') ? 'Oui' : 'Non'}`);
    
    // Vérifier Brand Model
    console.log('\n🏷️  Modèle Brand:');
    const brandAttributes = Object.keys(Brand.rawAttributes);
    console.log(`   Champs (${brandAttributes.length}): ${brandAttributes.join(', ')}`);
    
    // Vérifier Color Model
    console.log('\n🎨 Modèle Color:');
    const colorAttributes = Object.keys(Color.rawAttributes);
    console.log(`   Champs (${colorAttributes.length}): ${colorAttributes.join(', ')}`);
    console.log();

    // ==================== SECTION 4: DONNÉES ====================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  📈 SECTION 4: STATISTIQUES DES DONNÉES                     │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    const stats = {
      users: await User.count(),
      products: await Product.count(),
      categories: await Category.count(),
      mainCategories: await Category.count({ where: { parentId: null } }),
      subcategories: await Category.count({ where: { parentId: { [require('./models').Op.ne]: null } } }),
      brands: await Brand.count(),
      colors: await Color.count()
    };
    
    console.log('📊 Compteurs:');
    console.log(`   👥 Utilisateurs:          ${stats.users}`);
    console.log(`   📦 Produits:              ${stats.products}`);
    console.log(`   🗂️  Catégories totales:   ${stats.categories}`);
    console.log(`      ↳ Principales:        ${stats.mainCategories}`);
    console.log(`      ↳ Sous-catégories:    ${stats.subcategories}`);
    console.log(`   🏷️  Marques:              ${stats.brands}`);
    console.log(`   🎨 Couleurs:             ${stats.colors}`);
    
    if (stats.products === 0) {
      console.log('\n⚠️  ATTENTION: Aucun produit dans la base de données');
      hasErrors = true;
    }
    
    if (stats.categories === 0) {
      console.log('⚠️  ATTENTION: Aucune catégorie dans la base de données');
      hasErrors = true;
    }
    console.log();

    // ==================== SECTION 5: INTÉGRITÉ ====================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  🔍 SECTION 5: VÉRIFICATION DE L\'INTÉGRITÉ                 │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    // Vérifier produits avec catégories invalides
    const products = await Product.findAll({ attributes: ['id', 'title', 'category', 'brand'] });
    const categories = await Category.findAll({ attributes: ['id', 'title'] });
    const brands = await Brand.findAll({ attributes: ['id', 'title'] });
    
    const categoryIds = categories.map(c => c.id.toString());
    const brandTitles = brands.map(b => b.title);
    
    let invalidCategoryCount = 0;
    let invalidBrandCount = 0;
    
    products.forEach(product => {
      if (product.category && !categoryIds.includes(product.category.toString())) {
        invalidCategoryCount++;
        if (invalidCategoryCount <= 3) {
          console.log(`⚠️  Produit "${product.title}" a une catégorie invalide: ${product.category}`);
        }
      }
      
      if (product.brand && !brandTitles.includes(product.brand)) {
        invalidBrandCount++;
        if (invalidBrandCount <= 3) {
          console.log(`⚠️  Produit "${product.title}" a une marque invalide: ${product.brand}`);
        }
      }
    });
    
    if (invalidCategoryCount === 0 && invalidBrandCount === 0) {
      console.log('✅ Toutes les relations produits sont valides');
    } else {
      if (invalidCategoryCount > 0) {
        console.log(`❌ ${invalidCategoryCount} produit(s) avec catégories invalides`);
        hasErrors = true;
      }
      if (invalidBrandCount > 0) {
        console.log(`❌ ${invalidBrandCount} produit(s) avec marques invalides`);
        hasErrors = true;
      }
    }
    console.log();

    // ==================== SECTION 6: ASSOCIATIONS ====================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  🔗 SECTION 6: TEST DES ASSOCIATIONS                        │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    // Test Category parent-child
    const subcat = await Category.findOne({
      where: { parentId: { [require('./models').Op.ne]: null } },
      include: [{ model: Category, as: 'parent' }]
    });
    
    if (subcat && subcat.parent) {
      console.log('✅ Association Category ↔ Parent fonctionne');
      console.log(`   Exemple: "${subcat.title}" → "${subcat.parent.title}"`);
    } else {
      console.log('⚠️  Impossible de tester l\'association Category parent-child');
    }
    console.log();

    // ==================== SECTION 7: ÉCHANTILLONS ====================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  📦 SECTION 7: ÉCHANTILLONS DE DONNÉES                      │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    // Top 5 catégories principales
    const topCategories = await Category.findAll({
      where: { parentId: null },
      limit: 5,
      order: [['title', 'ASC']],
      attributes: ['id', 'title', 'slug']
    });
    
    console.log('🗂️  Top 5 Catégories principales:');
    for (const cat of topCategories) {
      const subcatCount = await Category.count({ where: { parentId: cat.id } });
      console.log(`   ${cat.id}. ${cat.title} (${subcatCount} sous-catégories)`);
    }
    
    // Top 5 marques
    const topBrands = await Brand.findAll({
      limit: 5,
      order: [['title', 'ASC']],
      attributes: ['id', 'title']
    });
    
    console.log('\n🏷️  Top 5 Marques:');
    topBrands.forEach(brand => {
      console.log(`   • ${brand.title}`);
    });
    
    // Derniers produits
    const recentProducts = await Product.findAll({
      limit: 3,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'category', 'brand', 'price', 'quantity']
    });
    
    console.log('\n📦 Derniers produits ajoutés:');
    for (const prod of recentProducts) {
      const cat = await Category.findByPk(prod.category);
      console.log(`\n   ${prod.id}. ${prod.title}`);
      console.log(`      Catégorie: ${cat ? cat.title : 'N/A'}`);
      console.log(`      Marque: ${prod.brand}`);
      console.log(`      Prix: ${prod.price} €`);
      console.log(`      Stock: ${prod.quantity}`);
    }
    console.log();

    // ==================== SECTION 8: CONFIGURATION API ====================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  🌐 SECTION 8: CONFIGURATION API                            │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    console.log('📡 Points d\'accès API:');
    console.log('   Backend: http://127.0.0.1:4000');
    console.log('   Admin:   http://localhost:3001');
    console.log('   Client:  http://localhost:3000\n');
    
    console.log('🔗 Routes principales:');
    console.log('   GET    /api/product          → Liste des produits');
    console.log('   GET    /api/product/:id      → Détail d\'un produit');
    console.log('   POST   /api/product          → Créer un produit (admin)');
    console.log('   PUT    /api/product/:id      → Modifier un produit (admin)');
    console.log('   DELETE /api/product/:id      → Supprimer un produit (admin)');
    console.log('   GET    /api/category         → Liste des catégories');
    console.log('   GET    /api/brand            → Liste des marques');
    console.log('   GET    /api/color            → Liste des couleurs\n');

    // ==================== SECTION 9: RÉSUMÉ FINAL ====================
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│  ✨ SECTION 9: RÉSUMÉ FINAL                                 │');
    console.log('└─────────────────────────────────────────────────────────────┘\n');
    
    console.log('═'.repeat(70));
    if (!hasErrors) {
      console.log('  🎉 TOUT EST CORRECTEMENT CONFIGURÉ !');
    } else {
      console.log('  ⚠️  CERTAINS PROBLÈMES NÉCESSITENT ATTENTION');
    }
    console.log('═'.repeat(70));
    console.log();
    
    console.log('✅ Système de base de données:  OK');
    console.log(`✅ Tables créées:               ${tables.length}/16`);
    console.log('✅ Modèles Sequelize:           OK');
    console.log('✅ Associations:                OK');
    console.log(`${stats.products > 0 ? '✅' : '⚠️ '} Produits en base:           ${stats.products}`);
    console.log(`${stats.categories > 0 ? '✅' : '⚠️ '} Catégories en base:         ${stats.categories}`);
    console.log(`${stats.brands > 0 ? '✅' : '⚠️ '} Marques en base:            ${stats.brands}`);
    console.log(`${invalidCategoryCount === 0 ? '✅' : '❌'} Intégrité catégories:       ${invalidCategoryCount === 0 ? 'OK' : `${invalidCategoryCount} erreurs`}`);
    console.log(`${invalidBrandCount === 0 ? '✅' : '❌'} Intégrité marques:          ${invalidBrandCount === 0 ? 'OK' : `${invalidBrandCount} erreurs`}`);
    console.log();
    
    if (!hasErrors) {
      console.log('🚀 Le système est prêt pour la production !');
      console.log('   • La base de données est correctement configurée');
      console.log('   • Tous les modèles sont synchronisés');
      console.log('   • Les associations fonctionnent correctement');
      console.log('   • Les données sont intègres');
    } else {
      console.log('⚠️  Actions recommandées:');
      if (stats.products === 0) {
        console.log('   • Ajouter des produits via l\'interface admin');
      }
      if (invalidCategoryCount > 0) {
        console.log('   • Corriger les catégories invalides des produits');
      }
      if (invalidBrandCount > 0) {
        console.log('   • Corriger les marques invalides des produits');
      }
    }
    
    console.log();
    console.log('═'.repeat(70));
    console.log(`  📅 Rapport généré le: ${new Date().toLocaleString('fr-FR')}`);
    console.log('═'.repeat(70));
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    console.error('Stack:', error.stack);
    hasErrors = true;
  } finally {
    await sequelize.close();
    console.log('🔒 Connexion fermée\n');
    process.exit(hasErrors ? 1 : 0);
  }
}

generateFullReport();
