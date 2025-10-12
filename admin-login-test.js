const axios = require('axios');

const adminData = {
    firstname: "Admin",
    lastname: "Sanny",
    email: "admin@sanny.com",
    mobile: "1234567890",
    password: "admin123"
};

async function createAndTestAdmin() {
    console.log('🔍 Test de création et connexion admin...\n');
    
    const baseURL = 'http://localhost:4000/api';
    
    try {
        // 1. Essayer de créer un admin
        console.log('📝 Tentative de création d\'un utilisateur admin...');
        
        const registerResponse = await axios.post(`${baseURL}/user/admin-register`, adminData, {
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`✅ Admin créé avec succès !`);
        console.log(`📧 Email: ${adminData.email}`);
        console.log(`🔑 Mot de passe: ${adminData.password}\n`);
        
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log(`⚠️  Admin existe déjà - c'est normal\n`);
        } else {
            console.log(`❌ Erreur lors de la création: ${error.message}\n`);
        }
    }
    
    try {
        // 2. Tester la connexion
        console.log('🔐 Test de connexion admin...');
        
        const loginResponse = await axios.post(`${baseURL}/user/admin-login`, {
            email: adminData.email,
            password: adminData.password
        }, {
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log(`✅ Connexion réussie !`);
        console.log(`🎫 Token reçu: ${loginResponse.data.token ? 'Oui' : 'Non'}`);
        console.log(`👤 Utilisateur: ${loginResponse.data.firstname} ${loginResponse.data.lastname}`);
        console.log(`🎭 Rôle: ${loginResponse.data.role}\n`);
        
        const token = loginResponse.data.token;
        
        // 3. Tester les endpoints avec le token
        console.log('📊 Test des endpoints avec authentification...');
        
        const authHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        const endpoints = [
            { name: 'Products', url: `${baseURL}/product` },
            { name: 'Brands', url: `${baseURL}/brand` },
            { name: 'Categories', url: `${baseURL}/category` },
            { name: 'Users', url: `${baseURL}/user/all-users` },
            { name: 'Coupons', url: `${baseURL}/coupon` }
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(endpoint.url, {
                    headers: authHeaders,
                    timeout: 5000
                });
                
                console.log(`✅ ${endpoint.name}: OK - ${Array.isArray(response.data) ? response.data.length : 'données'} éléments`);
                
            } catch (error) {
                console.log(`❌ ${endpoint.name}: ${error.response?.status || error.message}`);
            }
        }
        
        console.log('\n🎯 Informations de connexion pour l\'admin:');
        console.log(`📧 Email: ${adminData.email}`);
        console.log(`🔑 Mot de passe: ${adminData.password}`);
        console.log(`🌐 URL Admin: http://localhost:3001`);
        
    } catch (error) {
        console.log(`❌ Erreur de connexion: ${error.response?.data?.message || error.message}`);
        
        if (error.response?.status === 404) {
            console.log(`⚠️  Route admin-login non trouvée. Essayons la route normale...`);
            
            try {
                const normalLoginResponse = await axios.post(`${baseURL}/user/login`, {
                    email: adminData.email,
                    password: adminData.password
                });
                
                console.log(`✅ Connexion réussie avec route normale !`);
                console.log(`👤 Utilisateur: ${normalLoginResponse.data.firstname} ${normalLoginResponse.data.lastname}`);
                
            } catch (normalError) {
                console.log(`❌ Connexion normale échouée: ${normalError.response?.data?.message || normalError.message}`);
            }
        }
    }
}

createAndTestAdmin().catch(console.error);
