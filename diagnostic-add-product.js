const axios = require('axios');

async function testAddProductEndpoints() {
    console.log('🔍 Test des endpoints pour Add Product...');
    
    try {
        // Test 1: Vérifier les catégories
        console.log('\n📂 Test 1: Récupération des catégories...');
        const categoriesResponse = await axios.get('http://localhost:4000/api/category');
        console.log('✅ Catégories disponibles:', categoriesResponse.data.length);
        
        // Test 2: Vérifier les marques
        console.log('\n🏷️ Test 2: Récupération des marques...');
        const brandsResponse = await axios.get('http://localhost:4000/api/brand');
        console.log('✅ Marques disponibles:', brandsResponse.data.length);
        
        // Test 3: Vérifier les couleurs
        console.log('\n🎨 Test 3: Récupération des couleurs...');
        const colorsResponse = await axios.get('http://localhost:4000/api/color');
        console.log('✅ Couleurs disponibles:', colorsResponse.data.length);
        
        // Test 4: Authentification admin
        console.log('\n🔐 Test 4: Authentification admin...');
        const loginData = {
            email: 'admin@sanny.com',
            password: 'admin123'
        };
        
        const authResponse = await axios.post('http://localhost:4000/api/user/admin-login', loginData);
        if (authResponse.data && authResponse.data.token) {
            console.log('✅ Authentification réussie');
            const token = authResponse.data.token;
            
            // Test 5: Test de création de produit simple
            console.log('\n📦 Test 5: Test de création de produit...');
            const productData = {
                title: 'Produit Test Interface',
                description: 'Test depuis l\'interface',
                price: 99.99,
                category: categoriesResponse.data[0]?.title || 'Divers',
                brand: brandsResponse.data[0]?.title || 'Generic',
                quantity: 10,
                tags: 'test,interface',
                color: colorsResponse.data[0]?.title || 'Black'
            };
            
            console.log('📝 Données produit:', productData);
            
            const productResponse = await axios.post(
                'http://localhost:4000/api/product/',
                productData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('✅ Produit créé avec succès:', productResponse.data.id);
            console.log('📄 Réponse:', JSON.stringify(productResponse.data, null, 2));
            
        } else {
            console.log('❌ Échec de l\'authentification');
        }
        
    } catch (error) {
        console.error('❌ Erreur détectée:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        });
        
        if (error.response?.data) {
            console.log('📄 Détails de l\'erreur serveur:', error.response.data);
        }
    }
}

console.log('🚀 Démarrage du diagnostic Add Product...');
testAddProductEndpoints()
    .then(() => {
        console.log('\n🎉 Tests terminés');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Erreur fatale:', error);
        process.exit(1);
    });