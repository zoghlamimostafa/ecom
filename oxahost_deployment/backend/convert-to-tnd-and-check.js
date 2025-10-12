const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

async function convertPricesToTND() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion à la base de données établie');

        // Taux de change EUR -> TND (approximatif)
        const EUR_TO_TND = 3.32; // 1 EUR = 3.32 TND (septembre 2025)

        // 1. Vérifier les données actuelles
        const [products] = await sequelize.query('SELECT COUNT(*) as count FROM Products');
        const [blogs] = await sequelize.query('SELECT COUNT(*) as count FROM Blogs');
        
        console.log(`\n📊 ÉTAT ACTUEL :`);
        console.log(`📦 Produits: ${products[0].count}`);
        console.log(`📝 Blogs: ${blogs[0].count}`);

        // 2. Afficher quelques produits avec leurs prix actuels
        const [currentProducts] = await sequelize.query('SELECT title, price FROM Products LIMIT 5');
        console.log(`\n💰 PRIX ACTUELS (EUR):`);
        currentProducts.forEach(p => {
            console.log(`   • ${p.title}: ${p.price}€`);
        });

        // 3. Convertir les prix en TND
        console.log(`\n🔄 CONVERSION EUR → TND (taux: 1€ = ${EUR_TO_TND} TND)...`);
        
        const updateQuery = `UPDATE Products SET price = ROUND(price * ${EUR_TO_TND}, 2)`;
        await sequelize.query(updateQuery);
        
        console.log(`✅ Conversion terminée !`);

        // 4. Afficher les nouveaux prix
        const [updatedProducts] = await sequelize.query('SELECT title, price FROM Products LIMIT 5');
        console.log(`\n💰 PRIX CONVERTIS (TND):`);
        updatedProducts.forEach(p => {
            console.log(`   • ${p.title}: ${p.price} TND`);
        });

        // 5. Vérifier tous les produits par catégorie
        const [productsByCategory] = await sequelize.query(`
            SELECT category, COUNT(*) as count, MIN(price) as min_price, MAX(price) as max_price
            FROM Products 
            GROUP BY category
            ORDER BY category
        `);
        
        console.log(`\n🏷️ PRODUITS PAR CATÉGORIE:`);
        productsByCategory.forEach(cat => {
            console.log(`   📂 ${cat.category}: ${cat.count} produits (${cat.min_price} - ${cat.max_price} TND)`);
        });

        // 6. Vérifier les blogs
        const [blogsList] = await sequelize.query('SELECT title, createdAt FROM Blogs ORDER BY createdAt DESC');
        console.log(`\n📝 BLOGS DISPONIBLES:`);
        if (blogsList.length === 0) {
            console.log(`   ⚠️ Aucun blog trouvé - ils ont peut-être besoin d'être recréés`);
        } else {
            blogsList.forEach(blog => {
                const date = new Date(blog.createdAt).toLocaleDateString('fr-FR');
                console.log(`   • ${blog.title} (${date})`);
            });
        }

        await sequelize.close();
        console.log('\n✅ Vérification terminée');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

convertPricesToTND();