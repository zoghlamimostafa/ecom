const axios = require('axios');

// Fonction pour créer un utilisateur admin
async function createAdminUser() {
    try {
        const response = await axios.post('http://localhost:4000/api/user/register', {
            firstname: 'Admin',
            lastname: 'User',
            email: 'admin@test.com',
            mobile: '1234567890',
            password: 'admin123',
            role: 'admin'
        });
        
        console.log('✅ Utilisateur admin créé:', response.data);
        return response.data;
    } catch (error) {
        if (error.response?.data?.message?.includes('already exists')) {
            console.log('⚠️ Utilisateur admin existe déjà');
            
            // Essayer de se connecter
            try {
                const loginResponse = await axios.post('http://localhost:4000/api/user/login', {
                    email: 'admin@test.com',
                    password: 'admin123'
                });
                console.log('✅ Connexion admin réussie');
                return loginResponse.data;
            } catch (loginError) {
                console.log('❌ Erreur de connexion admin:', loginError.response?.data || loginError.message);
                return null;
            }
        } else {
            console.log('❌ Erreur lors de la création admin:', error.response?.data || error.message);
            return null;
        }
    }
}

// Fonction pour créer un utilisateur client
async function createTestUser() {
    try {
        const response = await axios.post('http://localhost:4000/api/user/register', {
            firstname: 'Test',
            lastname: 'User',
            email: 'test@user.com',
            mobile: '0987654321',
            password: 'test123'
        });
        
        console.log('✅ Utilisateur test créé:', response.data);
        return response.data;
    } catch (error) {
        if (error.response?.data?.message?.includes('already exists')) {
            console.log('⚠️ Utilisateur test existe déjà');
            
            // Essayer de se connecter
            try {
                const loginResponse = await axios.post('http://localhost:4000/api/user/login', {
                    email: 'test@user.com',
                    password: 'test123'
                });
                console.log('✅ Connexion test réussie');
                return loginResponse.data;
            } catch (loginError) {
                console.log('❌ Erreur de connexion test:', loginError.response?.data || loginError.message);
                return null;
            }
        } else {
            console.log('❌ Erreur lors de la création test:', error.response?.data || error.message);
            return null;
        }
    }
}

// Fonction pour créer quelques produits de test
async function createTestProducts(adminToken) {
    const products = [
        {
            title: 'iPhone 14 Pro',
            slug: 'iphone-14-pro',
            description: 'Latest iPhone with advanced features',
            price: 999,
            category: 'Electronics',
            brand: 'Apple',
            quantity: 50,
            images: JSON.stringify(['https://example.com/iphone1.jpg', 'https://example.com/iphone2.jpg']),
            color: JSON.stringify(['Space Black', 'Silver', 'Gold'])
        },
        {
            title: 'Samsung Galaxy S23',
            slug: 'samsung-galaxy-s23',
            description: 'Powerful Android smartphone',
            price: 799,
            category: 'Electronics',
            brand: 'Samsung',
            quantity: 30,
            images: JSON.stringify(['https://example.com/galaxy1.jpg', 'https://example.com/galaxy2.jpg']),
            color: JSON.stringify(['Black', 'White', 'Green'])
        }
    ];

    try {
        for (const product of products) {
            const response = await axios.post('http://localhost:4000/api/product', product, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Produit créé:', response.data.title);
        }
    } catch (error) {
        console.log('❌ Erreur lors de la création des produits:', error.response?.data || error.message);
    }
}

// Fonction pour créer une commande de test
async function createTestOrder(userToken) {
    try {
        const orderData = {
            products: [
                {
                    product: '1', // ID du premier produit
                    count: 2,
                    color: 'Space Black'
                }
            ],
            paymentIntent: {
                id: 'pi_test_12345',
                amount: 1998,
                currency: 'usd',
                status: 'succeeded'
            },
            orderStatus: 'Not Processed'
        };

        const response = await axios.post('http://localhost:4000/api/user/cart/create-order', orderData, {
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Commande créée:', response.data);
        return response.data;
    } catch (error) {
        console.log('❌ Erreur lors de la création de la commande:', error.response?.data || error.message);
        return null;
    }
}

// Function pour tester l'endpoint des commandes
async function testGetOrders(userToken) {
    try {
        const response = await axios.get('http://localhost:4000/api/user/getmyorders', {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        
        console.log('✅ Commandes récupérées:', response.data);
        return response.data;
    } catch (error) {
        console.log('❌ Erreur lors de la récupération des commandes:', error.response?.data || error.message);
        return null;
    }
}

// Fonction principale
async function setupTestData() {
    console.log('🔧 Configuration des données de test...\n');
    
    // Attendre que le serveur soit prêt
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Créer les utilisateurs
    const adminUser = await createAdminUser();
    const testUser = await createTestUser();
    
    if (!adminUser || !testUser) {
        console.log('❌ Impossible de créer les utilisateurs');
        return;
    }
    
    // Créer des produits
    await createTestProducts(adminUser.token);
    
    // Attendre un peu
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Créer une commande de test
    await createTestOrder(testUser.token);
    
    // Tester la récupération des commandes
    await testGetOrders(testUser.token);
    
    console.log('\n🎉 Configuration terminée !');
    console.log('📝 Informations de connexion :');
    console.log('Admin - Email: admin@test.com, Password: admin123');
    console.log('Client - Email: test@user.com, Password: test123');
}

setupTestData().catch(console.error);