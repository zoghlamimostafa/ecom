const bcrypt = require('bcrypt');
const { sequelize } = require('./models/index');
const User = require('./models/User');

async function fixAdminPassword() {
    try {
        // Synchroniser la base de données
        await sequelize.sync();
        
        console.log('Connexion à la base de données réussie');
        
        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash('admin123', 10);
        console.log('Nouveau hash généré pour admin123');
        
        // Mettre à jour le mot de passe de l'admin
        const result = await User.update(
            { password: hashedPassword },
            { 
                where: { 
                    email: 'admin@sanny.com' 
                } 
            }
        );
        
        if (result[0] > 0) {
            console.log('✅ Mot de passe admin mis à jour avec succès !');
            console.log('Email: admin@sanny.com');
            console.log('Nouveau mot de passe: admin123');
        } else {
            console.log('❌ Aucun admin trouvé avec cet email');
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error.message);
        process.exit(1);
    }
}

fixAdminPassword();