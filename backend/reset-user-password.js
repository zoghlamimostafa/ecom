const User = require('./models/User');
const bcrypt = require('bcrypt');

async function resetUserPassword() {
    try {
        console.log('Réinitialisation du mot de passe pour test@example.com...');
        
        const user = await User.findOne({ where: { email: 'test@example.com' } });
        
        if (!user) {
            console.log('❌ Utilisateur non trouvé');
            return;
        }
        
        const newPassword = '123456';
        
        // Pas besoin de hasher manuellement, le hook beforeUpdate le fait automatiquement
        await user.update({ password: newPassword });
        
        console.log('✅ Mot de passe mis à jour avec succès !');
        console.log('📋 Identifiants mis à jour:');
        console.log('Email: test@example.com');
        console.log('Nouveau mot de passe: 123456');
        
        // Test de connexion immédiat
        console.log('\n🧪 Test de connexion...');
        const axios = require('axios');
        
        const loginResponse = await axios.post('http://127.0.0.1:4000/api/user/login', {
            email: 'test@example.com',
            password: '123456'
        });
        
        if (loginResponse.data && loginResponse.data.token) {
            console.log('✅ Connexion de test réussie !');
            console.log('Token généré:', loginResponse.data.token.substring(0, 30) + '...');
        } else {
            console.log('❌ Échec de la connexion de test');
            console.log('Réponse:', loginResponse.data);
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    } finally {
        process.exit(0);
    }
}

resetUserPassword();