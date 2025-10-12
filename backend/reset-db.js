const { sequelize } = require('./config/database-sqlite');

async function resetDatabase() {
    try {
        console.log('🔄 Réinitialisation de la base de données SQLite...');
        
        // Force sync to recreate all tables
        await sequelize.sync({ force: true });
        
        console.log('✅ Base de données SQLite réinitialisée avec succès');
        console.log('📁 Fichier de base: database.sqlite');
        
        // Test avec création d'un utilisateur simple
        const { User } = require('./models');
        
        const testUser = await User.create({
            firstname: 'Test',
            lastname: 'User',
            email: 'test@test.com',
            mobile: '1234567890',
            password: 'password123'
        });
        
        console.log('✅ Utilisateur de test créé:', testUser.id);
        
        await sequelize.close();
        console.log('🔒 Connexion fermée');
        
    } catch (error) {
        console.error('❌ Erreur lors de la réinitialisation:', error);
    }
}

resetDatabase();