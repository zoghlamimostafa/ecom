const { Product, User, Brand, Category } = require('./models');

async function createIndexes() {
  console.log("🗃️ Création des index pour optimiser les performances...");
  
  try {
    // Index pour les produits
    await Product.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_products_title ON "Products" ("title");
      CREATE INDEX IF NOT EXISTS idx_products_price ON "Products" ("price");
      CREATE INDEX IF NOT EXISTS idx_products_category ON "Products" ("category");
      CREATE INDEX IF NOT EXISTS idx_products_brand ON "Products" ("brand");
      CREATE INDEX IF NOT EXISTS idx_products_created_at ON "Products" ("createdAt");
    `);
    
    // Index pour les utilisateurs
    await User.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON "Users" ("email");
      CREATE INDEX IF NOT EXISTS idx_users_role ON "Users" ("role");
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON "Users" ("createdAt");
    `);
    
    console.log("✅ Index créés avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de la création des index:", error.message);
  }
}

createIndexes();