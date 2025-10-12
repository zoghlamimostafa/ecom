// Générateur de token frais pour les tests
const { User } = require('./models/index');
const { generateToken } = require('./config/jwtToken');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config/config');

async function generateFreshToken() {
    try {
        // Trouver un utilisateur
        const user = await User.findOne();
        if (!user) {
            console.log('❌ Aucun utilisateur trouvé');
            return;
        }
        
        console.log('👤 Utilisateur:', user.id, '-', user.email);
        
        // Générer le token
        const token = generateToken(user.id);
        console.log('🔑 Token généré:', token);
        
        // Vérifier le token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Token valide jusqu\'à:', new Date(decoded.exp * 1000));
        
        // Commande PowerShell
        console.log('\n📋 Commande PowerShell:');
        console.log(`$headers = @{ Authorization = "Bearer ${token}" }`);
        console.log('Invoke-RestMethod -Uri "http://localhost:4000/api/user/cart" -Headers $headers');
        
        // Commande cURL
        console.log('\n📋 Commande cURL:');
        console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:4000/api/user/cart`);
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

generateFreshToken();