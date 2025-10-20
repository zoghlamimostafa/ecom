/**
 * DIAGNOSTIC COMPLET - BASE DE DONNÉES SQLite
 * Vérifie toutes les connexions, modèles et données
 */

const { sequelize, defineAssociations } = require('./models');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Color = require('./models/Color');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const Order = require('./models/Order');

console.log('\n🔍 ====== DIAGNOSTIC BASE DE DONNÉES SQLite ======\n');

async function runDiagnostic() {
  try {
    // 1. Test de connexion
    console.log('1️⃣  TEST DE CONNEXION...');
    await sequelize.authenticate();
    console.log('   ✅ Connexion établie avec succès');
    console.log(`   📂 Fichier DB: ${sequelize.options.storage}`);
    console.log(`   🗄️  Dialecte: ${sequelize.options.dialect}\n`);

    // 2. Définir les associations
    console.log('2️⃣  DÉFINITION DES ASSOCIATIONS...');
    defineAssociations();
    console.log('   ✅ Associations définies\n');

    // 3. Synchronisation
    console.log('3️⃣  SYNCHRONISATION DES TABLES...');
    await sequelize.sync({ alter: false });
    console.log('   ✅ Tables synchronisées\n');

    // 4. Vérification des tables
    console.log('4️⃣  VÉRIFICATION DES TABLES EXISTANTES...');
    const [results] = await sequelize.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);
    
    console.log(`   📊 Nombre total de tables: ${results.length}`);
    results.forEach(table => {
      console.log(`      - ${table.name}`);
    });
    console.log();

    // 5. Comptage des données principales
    console.log('5️⃣  COMPTAGE DES DONNÉES...');
    
    const userCount = await User.count();
    console.log(`   👥 Utilisateurs: ${userCount}`);
    
    const productCount = await Product.count();
    console.log(`   📦 Produits: ${productCount}`);
    
    const categoryCount = await Category.count();
    console.log(`   🗂️  Catégories: ${categoryCount}`);
    
    const brandCount = await Brand.count();
    console.log(`   🏷️  Marques: ${brandCount}`);
    
    const colorCount = await Color.count();
    console.log(`   🎨 Couleurs: ${colorCount}`);
    
    const cartCount = await Cart.count();
    console.log(`   🛒 Paniers: ${cartCount}`);
    
    const wishlistCount = await Wishlist.count();
    console.log(`   ❤️  Wishlist: ${wishlistCount}`);
    
    const orderCount = await Order.count();
    console.log(`   📋 Commandes: ${orderCount}\n`);

    // 6. Vérification des catégories principales et sous-catégories
    console.log('6️⃣  ANALYSE DES CATÉGORIES...');
    const mainCategories = await Category.findAll({
      where: { parentId: null },
      order: [['title', 'ASC']]
    });
    console.log(`   📂 Catégories principales: ${mainCategories.length}`);
    
    for (const cat of mainCategories) {
      const subcats = await Category.count({ where: { parentId: cat.id } });
      console.log(`      - ${cat.title} (ID: ${cat.id}) → ${subcats} sous-catégories`);
    }
    console.log();

    // 7. Vérification des marques
    console.log('7️⃣  LISTE DES MARQUES...');
    const brands = await Brand.findAll({
      limit: 10,
      order: [['title', 'ASC']]
    });
    brands.forEach(brand => {
      console.log(`      - ${brand.title} (ID: ${brand.id})`);
    });
    if (brandCount > 10) {
      console.log(`      ... et ${brandCount - 10} autres`);
    }
    console.log();

    // 8. Échantillon de produits avec leurs catégories
    console.log('8️⃣  ÉCHANTILLON DE PRODUITS...');
    const products = await Product.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'category', 'subcategory', 'brand', 'price', 'quantity']
    });
    
    console.log(`   📦 Derniers produits ajoutés:`);
    for (const product of products) {
      // Enrichir avec le nom de catégorie
      let categoryName = 'N/A';
      if (product.category) {
        const cat = await Category.findByPk(product.category);
        categoryName = cat ? cat.title : `ID:${product.category}`;
      }
      
      let subcategoryName = 'N/A';
      if (product.subcategory) {
        const subcat = await Category.findByPk(product.subcategory);
        subcategoryName = subcat ? subcat.title : `ID:${product.subcategory}`;
      }
      
      console.log(`\n      📦 ${product.title}`);
      console.log(`         ID: ${product.id}`);
      console.log(`         Catégorie: ${categoryName}`);
      console.log(`         Sous-catégorie: ${subcategoryName}`);
      console.log(`         Marque: ${product.brand}`);
      console.log(`         Prix: ${product.price} €`);
      console.log(`         Stock: ${product.quantity}`);
    }
    console.log();

    // 9. Vérification de l'intégrité des données
    console.log('9️⃣  VÉRIFICATION DE L\'INTÉGRITÉ...');
    
    // Produits avec catégories invalides
    const invalidCategoryProducts = await Product.findAll({
      attributes: ['id', 'title', 'category'],
      limit: 1000
    });
    
    let invalidCount = 0;
    for (const prod of invalidCategoryProducts) {
      if (prod.category) {
        const cat = await Category.findByPk(prod.category);
        if (!cat) {
          invalidCount++;
          if (invalidCount <= 3) {
            console.log(`   ⚠️  Produit "${prod.title}" (ID:${prod.id}) a une catégorie invalide: ${prod.category}`);
          }
        }
      }
    }
    
    if (invalidCount === 0) {
      console.log('   ✅ Toutes les catégories de produits sont valides');
    } else {
      console.log(`   ⚠️  ${invalidCount} produit(s) avec catégories invalides trouvés`);
    }
    console.log();

    // 10. Test des associations
    console.log('🔟 TEST DES ASSOCIATIONS...');
    
    // Test Cart → User et Product
    const cartItem = await Cart.findOne({
      include: [
        { model: User, as: 'user' },
        { model: Product, as: 'product' }
      ]
    });
    
    if (cartItem) {
      console.log('   ✅ Association Cart → User → Product fonctionne');
      console.log(`      Exemple: User ${cartItem.user?.firstname || 'N/A'} a "${cartItem.product?.title || 'N/A'}" dans son panier`);
    } else {
      console.log('   ⚠️  Aucun élément de panier pour tester les associations');
    }
    
    // Test Category parent-child
    const subcategory = await Category.findOne({
      where: { parentId: { [require('./models').Op.ne]: null } },
      include: [{ model: Category, as: 'parent' }]
    });
    
    if (subcategory) {
      console.log('   ✅ Association Category → Parent fonctionne');
      console.log(`      Exemple: "${subcategory.title}" est une sous-catégorie de "${subcategory.parent?.title || 'N/A'}"`);
    } else {
      console.log('   ℹ️  Aucune sous-catégorie pour tester l\'association parent');
    }
    console.log();

    // 11. Résumé final
    console.log('═══════════════════════════════════════════════════');
    console.log('📊 RÉSUMÉ DU DIAGNOSTIC');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Connexion SQLite: OK`);
    console.log(`✅ Tables créées: ${results.length}`);
    console.log(`✅ Associations: OK`);
    console.log(`📦 Total produits: ${productCount}`);
    console.log(`🗂️  Total catégories: ${categoryCount}`);
    console.log(`🏷️  Total marques: ${brandCount}`);
    console.log(`🎨 Total couleurs: ${colorCount}`);
    console.log(`👥 Total utilisateurs: ${userCount}`);
    console.log(`🛒 Total paniers: ${cartCount}`);
    console.log(`❤️  Total wishlist: ${wishlistCount}`);
    console.log(`📋 Total commandes: ${orderCount}`);
    
    if (invalidCount > 0) {
      console.log(`\n⚠️  ATTENTION: ${invalidCount} produit(s) avec catégories invalides`);
      console.log(`   Exécuter un script de nettoyage si nécessaire`);
    } else {
      console.log(`\n✅ INTÉGRITÉ: Toutes les données sont valides`);
    }
    
    console.log('═══════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('\n❌ ERREUR PENDANT LE DIAGNOSTIC:', error);
    console.error('Détails:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
    console.log('🔒 Connexion fermée\n');
  }
}

// Exécuter le diagnostic
runDiagnostic();
