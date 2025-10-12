const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

async function showProductsAndBlogs() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données établie\n');

        // Afficher les produits avec prix TND
        const [products] = await sequelize.query(`
            SELECT title, price, category, brand 
            FROM Products 
            ORDER BY category, title
        `);
        
        console.log('🛍️ PRODUITS AVEC PRIX EN DINARS TUNISIENS:\n');
        
        let currentCategory = '';
        products.forEach(product => {
            if (product.category !== currentCategory) {
                currentCategory = product.category;
                console.log(`\n📂 ${currentCategory.toUpperCase()}:`);
            }
            console.log(`   • ${product.title} - ${product.price} TND (${product.brand})`);
        });

        // Afficher les blogs
        const [blogs] = await sequelize.query(`
            SELECT title, description, createdAt 
            FROM Blogs 
            ORDER BY createdAt DESC
        `);
        
        console.log(`\n\n📝 ARTICLES DE BLOG DISPONIBLES:\n`);
        blogs.forEach(blog => {
            const date = new Date(blog.createdAt).toLocaleDateString('fr-FR');
            console.log(`📄 ${blog.title}`);
            console.log(`   📅 ${date}`);
            console.log(`   📝 ${blog.description.substring(0, 100)}...\n`);
        });

        console.log(`\n📊 RÉSUMÉ:`);
        console.log(`   📦 ${products.length} produits au total`);
        console.log(`   📝 ${blogs.length} articles de blog`);
        console.log(`   💰 Prix convertis en Dinars Tunisiens (TND)`);
        
        // URLs pour tester
        console.log(`\n🌐 URLS POUR TESTER:`);
        console.log(`   🏠 Accueil: http://localhost:3000`);
        console.log(`   🛍️ Produits: http://localhost:3000/product`);
        console.log(`   📝 Blog: http://localhost:3000/blog`);
        console.log(`   🔧 API Produits: http://localhost:4000/api/product`);
        console.log(`   🔧 API Blog: http://localhost:4000/api/blog`);

        await sequelize.close();
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

showProductsAndBlogs();