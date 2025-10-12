const { sequelize, Product } = require('./models');

const convertEuroToDinar = async () => {
  try {
    console.log('💱 Conversion des prix de EUR vers DT...\n');

    await sequelize.authenticate();
    console.log('✅ Connexion MySQL établie');

    // Taux de change approximatif EUR -> DT (1 EUR ≈ 3.3 DT)
    const exchangeRate = 3.3;

    // Récupérer tous les produits
    const products = await Product.findAll();
    console.log(`📦 ${products.length} produits à convertir\n`);

    let converted = 0;

    for (const product of products) {
      try {
        // Convertir le prix de EUR vers DT
        const newPrice = (product.price * exchangeRate).toFixed(2);
        
        await product.update({
          price: parseFloat(newPrice)
        });

        console.log(`✅ ${product.title}`);
        console.log(`   Ancien prix: ${product.price}€ → Nouveau prix: ${newPrice} DT`);
        console.log('   ───────────────────────────────');
        
        converted++;
      } catch (error) {
        console.error(`❌ Erreur conversion ${product.title}:`, error.message);
      }
    }

    console.log(`\n🎉 ${converted} produits convertis avec succès!`);

    // Afficher quelques statistiques
    const updatedProducts = await Product.findAll();
    const totalValue = updatedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const totalSold = updatedProducts.reduce((sum, p) => sum + p.sold, 0);
    const revenueGenerated = updatedProducts.reduce((sum, p) => sum + (p.price * p.sold), 0);
    
    console.log('\n📊 NOUVELLES STATISTIQUES EN DT:');
    console.log(`💰 Valeur totale du stock: ${totalValue.toFixed(2)} DT`);
    console.log(`📈 Produits vendus: ${totalSold}`);
    console.log(`💵 Chiffre d'affaires généré: ${revenueGenerated.toFixed(2)} DT`);

    await sequelize.close();
    console.log('\n✅ Conversion terminée');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

convertEuroToDinar();