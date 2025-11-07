const { sequelize } = require('./models');
const Product = require('./models/Product');

async function fixProductTags() {
  try {
    console.log('🔧 Démarrage de la correction des tags produits...\n');

    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données établie\n');

    // Récupérer tous les produits
    const products = await Product.findAll();
    console.log(`📦 ${products.length} produits trouvés\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Mapping des anciens tags vers les nouveaux
    const tagMap = {
      'promo': 'promotion',
      'promotion': 'promotion',
      'new': 'new',
      'nouveau': 'new',
      'bestseller': 'bestseller',
      'best-seller': 'bestseller',
      'featured': 'featured',
      'vedette': 'featured'
    };

    for (const product of products) {
      let needsUpdate = false;
      let newTags = [];

      // Traiter les tags du produit
      if (product.tags) {
        console.log(`\n📝 Produit #${product.id}: ${product.title}`);
        console.log(`   Tags actuels: ${JSON.stringify(product.tags)} (type: ${typeof product.tags})`);

        // Si c'est déjà un tableau valide
        if (Array.isArray(product.tags)) {
          if (product.tags.length > 0) {
            newTags = product.tags;
            console.log(`   ✓ Déjà au bon format (tableau)`);
          } else {
            console.log(`   ⊘ Tableau vide, pas de changement`);
            skippedCount++;
            continue;
          }
        }
        // Si c'est une chaîne
        else if (typeof product.tags === 'string') {
          const cleaned = product.tags.replace(/['"]/g, '').trim();
          
          // Chaîne vide
          if (!cleaned || cleaned === 'null' || cleaned === '[]') {
            console.log(`   ⊘ Chaîne vide, pas de changement`);
            skippedCount++;
            continue;
          }
          
          // Essayer de parser comme JSON
          if (cleaned.startsWith('[') || cleaned.startsWith('{')) {
            try {
              const parsed = JSON.parse(cleaned);
              if (Array.isArray(parsed) && parsed.length > 0) {
                newTags = parsed;
                console.log(`   ✓ Parsé depuis JSON: ${JSON.stringify(newTags)}`);
              }
            } catch (e) {
              console.log(`   ⚠️ Erreur parsing JSON: ${e.message}`);
            }
          }
          
          // Si c'est une chaîne simple
          if (newTags.length === 0) {
            const normalizedTag = cleaned.toLowerCase();
            const mappedTag = tagMap[normalizedTag];
            
            if (mappedTag) {
              newTags = [mappedTag];
              needsUpdate = true;
              console.log(`   🔄 Converti: "${cleaned}" → ["${mappedTag}"]`);
            } else {
              console.log(`   ⚠️ Tag inconnu: "${cleaned}"`);
              skippedCount++;
              continue;
            }
          }
        }

        // Mettre à jour si nécessaire
        if (needsUpdate || (Array.isArray(product.tags) && typeof product.tags === 'string')) {
          await product.update({ tags: newTags });
          updatedCount++;
          console.log(`   ✅ Mis à jour: ${JSON.stringify(newTags)}`);
        } else if (newTags.length > 0) {
          await product.update({ tags: newTags });
          updatedCount++;
          console.log(`   ✅ Normalisé: ${JSON.stringify(newTags)}`);
        }
      } else {
        console.log(`\n📝 Produit #${product.id}: ${product.title}`);
        console.log(`   ⊘ Aucun tag`);
        skippedCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSUMÉ');
    console.log('='.repeat(50));
    console.log(`✅ Produits mis à jour: ${updatedCount}`);
    console.log(`⊘ Produits ignorés: ${skippedCount}`);
    console.log(`📦 Total: ${products.length}`);
    console.log('='.repeat(50) + '\n');

    // Afficher un exemple de produits avec tags
    const productsWithTags = await Product.findAll({
      where: sequelize.where(
        sequelize.fn('json_array_length', sequelize.col('tags')),
        { [sequelize.Op.gt]: 0 }
      ),
      limit: 5
    });

    if (productsWithTags.length > 0) {
      console.log('📋 Exemples de produits avec tags:');
      productsWithTags.forEach(p => {
        console.log(`   • ${p.title}: ${JSON.stringify(p.tags)}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

fixProductTags();
