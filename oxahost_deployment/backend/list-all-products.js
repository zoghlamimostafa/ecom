const { sequelize, Product, Category, Brand } = require('./models');

const listAllProducts = async () => {
  try {
    console.log('📦 Liste de tous les produits dans MySQL...\n');

    await sequelize.authenticate();
    
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']]
    });

    console.log(`🎯 Total: ${products.length} produits trouvés\n`);

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   📝 Slug: ${product.slug}`);
      console.log(`   💰 Prix: ${product.price}€`);
      console.log(`   🏷️  Catégorie ID: ${product.category}`);
      console.log(`   🏢 Marque ID: ${product.brand}`);
      console.log(`   📦 Stock: ${product.quantity} (${product.sold} vendus)`);
      console.log(`   ⭐ Note: ${product.totalrating || '0'}/5`);
      console.log(`   🎨 Couleurs: ${Array.isArray(product.color) ? product.color.join(', ') : (product.color || 'N/A')}`);
      console.log(`   🏷️  Tags: ${Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || 'N/A')}`);
      console.log('   ───────────────────────────────');
    });

    // Statistiques
    console.log('\n📊 STATISTIQUES:');
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
    const revenueGenerated = products.reduce((sum, p) => sum + (p.price * p.sold), 0);
    
    console.log(`💰 Valeur totale du stock: ${totalValue.toFixed(2)}€`);
    console.log(`📈 Produits vendus: ${totalSold}`);
    console.log(`💵 Chiffre d'affaires généré: ${revenueGenerated.toFixed(2)}€`);

    await sequelize.close();
    console.log('\n✅ Vérification terminée');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

listAllProducts();