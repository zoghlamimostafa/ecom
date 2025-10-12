const { sequelize, Category, Brand, Color } = require('./backend/models');

async function populateBasicData() {
  try {
    await sequelize.sync();
    
    // Créer des catégories
    const categories = [
      'Ordinateurs',
      'Vêtements Homme', 
      'Vêtements Femme',
      'Electronique',
      'Maison',
      'Sport',
      'Beauté',
      'Livres'
    ];

    for (const categoryName of categories) {
      const existingCategory = await Category.findOne({ where: { title: categoryName } });
      if (!existingCategory) {
        await Category.create({
          title: categoryName,
          slug: categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          status: 'Active'
        });
      }
    }

    // Créer des marques
    const brands = [
      'Dell',
      'HP', 
      'Lenovo',
      'Apple',
      'Samsung',
      'Nike',
      'Adidas',
      'Zara'
    ];

    for (const brandName of brands) {
      const existingBrand = await Brand.findOne({ where: { title: brandName } });
      if (!existingBrand) {
        await Brand.create({
          title: brandName,
          slug: brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          status: 'Active'
        });
      }
    }

    // Créer des couleurs
    const colors = [
      'Rouge',
      'Bleu',
      'Vert',
      'Noir',
      'Blanc',
      'Gris',
      'Jaune',
      'Rose'
    ];

    for (const colorName of colors) {
      const existingColor = await Color.findOne({ where: { title: colorName } });
      if (!existingColor) {
        await Color.create({
          title: colorName,
          status: 'Active'
        });
      }
    }

    console.log('✅ Données de base créées:');
    console.log(`📁 ${categories.length} catégories`);
    console.log(`🏷️ ${brands.length} marques`);
    console.log(`🎨 ${colors.length} couleurs`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
  }
}

populateBasicData();