console.log('🔍 Diagnostic complet de l\'application...\n');

// Test 1: Configuration de base
console.log('1️⃣ Test configuration de base...');
try {
    const dotenv = require('dotenv');
    dotenv.config();
    console.log('✅ Variables d\'environnement chargées');
    console.log('PORT:', process.env.PORT || '4000 (défaut)');
} catch (error) {
    console.log('❌ Erreur variables d\'environnement:', error.message);
}

// Test 2: Modules de base
console.log('\n2️⃣ Test modules de base...');
try {
    const express = require('express');
    const cors = require('cors');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    console.log('✅ Modules Express chargés');
} catch (error) {
    console.log('❌ Erreur modules Express:', error.message);
}

// Test 3: Configuration SQLite
console.log('\n3️⃣ Test configuration SQLite...');
try {
    const { sequelize } = require('./config/database-sqlite');
    console.log('✅ Configuration SQLite chargée');
    console.log('Base de données:', sequelize.config.storage || 'En mémoire');
} catch (error) {
    console.log('❌ Erreur configuration SQLite:', error.message);
}

// Test 4: Modèles individuels
console.log('\n4️⃣ Test modèles individuels...');
const models = ['User', 'Product', 'Category', 'Brand', 'Cart', 'Wishlist', 'Order'];

for (const modelName of models) {
    try {
        const Model = require(`./models/${modelName}`);
        console.log(`✅ Modèle ${modelName} chargé`);
    } catch (error) {
        console.log(`❌ Erreur modèle ${modelName}:`, error.message);
    }
}

// Test 5: Index des modèles
console.log('\n5️⃣ Test index des modèles...');
try {
    const { sequelize, defineAssociations } = require('./models');
    console.log('✅ Index des modèles chargé');
} catch (error) {
    console.log('❌ Erreur index des modèles:', error.message);
}

// Test 6: Routes individuelles
console.log('\n6️⃣ Test routes individuelles...');
const routes = ['authRoute', 'productRoute', 'brandRoute', 'prodcategoryRoute'];

for (const routeName of routes) {
    try {
        const router = require(`./routes/${routeName}`);
        console.log(`✅ Route ${routeName} chargée`);
    } catch (error) {
        console.log(`❌ Erreur route ${routeName}:`, error.message);
    }
}

// Test 7: Middlewares
console.log('\n7️⃣ Test middlewares...');
try {
    const { notFound, errorHandler } = require('./middlewares/errorHandler');
    console.log('✅ Middlewares d\'erreur chargés');
} catch (error) {
    console.log('❌ Erreur middlewares:', error.message);
}

// Test 8: Connexion base de données
console.log('\n8️⃣ Test connexion base de données...');
async function testDatabaseConnection() {
    try {
        const { sequelize, defineAssociations } = require('./models');
        
        await sequelize.authenticate();
        console.log('✅ Connexion à la base réussie');
        
        defineAssociations();
        console.log('✅ Associations définies');
        
        await sequelize.sync({ force: false });
        console.log('✅ Synchronisation réussie');
        
        // Test simple de création/lecture
        const { User } = require('./models');
        const userCount = await User.count();
        console.log(`✅ Nombre d'utilisateurs: ${userCount}`);
        
    } catch (error) {
        console.log('❌ Erreur connexion base:', error.message);
    }
}

testDatabaseConnection();

console.log('\n🔍 Diagnostic terminé.');