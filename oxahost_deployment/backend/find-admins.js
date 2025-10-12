const { User } = require('./models');

async function findExistingAdmins() {
    try {
        console.log('🔍 Recherche des administrateurs existants...');

        // Chercher tous les utilisateurs avec le rôle admin
        const admins = await User.findAll({
            where: { role: 'admin' },
            attributes: ['id', 'firstname', 'lastname', 'email', 'mobile', 'role']
        });

        if (admins.length === 0) {
            console.log('❌ Aucun administrateur trouvé');
            
            // Essayons de trouver des utilisateurs réguliers qu'on pourrait promouvoir
            const users = await User.findAll({
                limit: 5,
                attributes: ['id', 'firstname', 'lastname', 'email', 'mobile', 'role']
            });
            
            console.log('👥 Utilisateurs trouvés:', users.length);
            users.forEach(user => {
                console.log(`- ${user.firstname} ${user.lastname} (${user.email}) - Role: ${user.role}`);
            });
            
        } else {
            console.log(`✅ ${admins.length} administrateur(s) trouvé(s):`);
            admins.forEach(admin => {
                console.log(`📧 ${admin.firstname} ${admin.lastname}`);
                console.log(`   Email: ${admin.email}`);
                console.log(`   Mobile: ${admin.mobile}`);
                console.log(`   Role: ${admin.role}`);
                console.log('');
            });
        }

        return admins;

    } catch (error) {
        console.error('❌ Erreur lors de la recherche:', error);
        throw error;
    }
}

// Exécuter la recherche
findExistingAdmins()
    .then(() => {
        console.log('🎉 Script terminé avec succès');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Erreur fatale:', error);
        process.exit(1);
    });