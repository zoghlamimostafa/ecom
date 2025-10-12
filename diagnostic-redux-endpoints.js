const axios = require('axios');

async function testReduxEndpoints() {
    console.log('🔍 Test des endpoints Redux utilisés par Add Product...');
    
    const baseURL = 'http://localhost:4000/api';
    
    try {
        // Authentification d'abord
        console.log('\n🔐 Authentification...');
        const loginData = {
            email: 'admin@sanny.com',
            password: 'admin123'
        };
        
        const authResponse = await axios.post(`${baseURL}/user/admin-login`, loginData);
        if (!authResponse.data || !authResponse.data.token) {
            throw new Error('Authentification échouée');
        }
        
        const token = authResponse.data.token;
        console.log('✅ Authentification réussie');
        
        const authHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        // Test des endpoints utilisés par les slices Redux
        
        // 1. Test getBrands (brandSlice)
        console.log('\n🏷️ Test getBrands...');
        try {
            const brandsResponse = await axios.get(`${baseURL}/brand`, { headers: authHeaders });
            console.log('✅ Brands endpoint OK:', brandsResponse.data.length, 'brands');
            if (brandsResponse.data.length > 0) {
                console.log('📋 Premier brand:', brandsResponse.data[0].title);
            }
        } catch (error) {
            console.log('❌ Brands endpoint error:', error.response?.status, error.response?.data);
        }
        
        // 2. Test getCategories (pcategorySlice)
        console.log('\n📂 Test getCategories...');
        try {
            const categoriesResponse = await axios.get(`${baseURL}/category`, { headers: authHeaders });
            console.log('✅ Categories endpoint OK:', categoriesResponse.data.length, 'categories');
            if (categoriesResponse.data.length > 0) {
                console.log('📋 Première category:', categoriesResponse.data[0].title);
            }
        } catch (error) {
            console.log('❌ Categories endpoint error:', error.response?.status, error.response?.data);
        }
        
        // 3. Test getColors (colorSlice)
        console.log('\n🎨 Test getColors...');
        try {
            const colorsResponse = await axios.get(`${baseURL}/color`, { headers: authHeaders });
            console.log('✅ Colors endpoint OK:', colorsResponse.data.length, 'colors');
            if (colorsResponse.data.length > 0) {
                console.log('📋 Première color:', colorsResponse.data[0].title);
            }
        } catch (error) {
            console.log('❌ Colors endpoint error:', error.response?.status, error.response?.data);
        }
        
        // 4. Test upload endpoint (uploadSlice)
        console.log('\n📤 Test Upload endpoint...');
        try {
            // Test simple pour voir si l'endpoint répond
            const uploadResponse = await axios.get(`${baseURL}/upload`, { headers: authHeaders });
            console.log('✅ Upload endpoint accessible');
        } catch (error) {
            if (error.response?.status === 405) {
                console.log('✅ Upload endpoint existe (Method Not Allowed normal pour GET)');
            } else {
                console.log('❌ Upload endpoint error:', error.response?.status, error.response?.data);
            }
        }
        
        // 5. Test create product endpoint (productSlice)
        console.log('\n📦 Test Product creation endpoint...');
        try {
            const testProduct = {
                title: 'Test Diagnostic Product',
                description: 'Produit de test pour diagnostic',
                price: 1.99,
                category: 'Test',
                brand: 'Test Brand',
                quantity: 1,
                tags: 'test,diagnostic',
                color: 'Red'
            };
            
            const productResponse = await axios.post(
                `${baseURL}/product/`,
                testProduct,
                { headers: authHeaders }
            );
            console.log('✅ Product creation OK, ID:', productResponse.data.id);
            
            // Supprimer le produit de test
            try {
                await axios.delete(`${baseURL}/product/${productResponse.data.id}`, { headers: authHeaders });
                console.log('🗑️ Produit de test supprimé');
            } catch (deleteError) {
                console.log('⚠️ Impossible de supprimer le produit de test');
            }
            
        } catch (error) {
            console.log('❌ Product creation error:', error.response?.status, error.response?.data);
        }
        
        console.log('\n🎉 Tests des endpoints Redux terminés avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur générale:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
    }
}

console.log('🚀 Démarrage du diagnostic Redux endpoints...');
testReduxEndpoints()
    .then(() => {
        console.log('\n✅ Diagnostic terminé');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Erreur fatale:', error);
        process.exit(1);
    });