const axios = require('axios');

const baseUrl = 'http://localhost:4000/api/';

// Test spécifique pour reproduire l'erreur de l'interface admin
async function diagnosticAdminError() {
    console.log('🔍 DIAGNOSTIC DÉTAILLÉ - Interface Admin\n');
    
    try {
        // 1. Test connectivité basique
        console.log('1️⃣ Test connectivité backend...');
        await axios.get(`${baseUrl}category`);
        console.log('✅ Backend accessible\n');
        
        // 2. Test authentification (simulation du login admin)
        console.log('2️⃣ Test authentification admin...');
        const authResponse = await axios.post(`${baseUrl}user/admin-login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });
        
        const token = authResponse.data.token;
        console.log('✅ Authentification réussie');
        console.log('🎫 Token:', token ? 'Présent' : 'Absent');
        console.log('👤 Utilisateur:', authResponse.data.firstname, authResponse.data.lastname);
        console.log('📧 Email:', authResponse.data.email, '\n');
        
        const authConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        
        // 3. Test récupération des données (comme l'interface le fait)
        console.log('3️⃣ Test récupération des données...');
        
        const [categoriesRes, brandsRes, colorsRes] = await Promise.all([
            axios.get(`${baseUrl}category`, authConfig),
            axios.get(`${baseUrl}brand`, authConfig),
            axios.get(`${baseUrl}color`, authConfig)
        ]);
        
        console.log(`✅ Catégories: ${categoriesRes.data.length} trouvées`);
        console.log(`✅ Marques: ${brandsRes.data.length} trouvées`);
        console.log(`✅ Couleurs: ${colorsRes.data.length} trouvées\n`);
        
        // 4. Test création produit avec données exactes de l'interface
        console.log('4️⃣ Test création produit (simulation exacte interface)...');
        
        // Données typiques qu'un utilisateur pourrait saisir
        const productData = {
            title: "Test Interface Admin Diagnostic",
            description: "<p>Description test avec HTML du ReactQuill</p>",
            price: 29.99,
            brand: "Samsung", // Utiliser une marque qui existe
            category: "Smartphones", // Utiliser une catégorie qui existe  
            tags: "featured",
            color: [], // Tableau vide comme dans l'interface
            quantity: 10,
            images: [] // Pas d'images pour simplifier
        };
        
        console.log('📤 Données à envoyer:');
        console.log(JSON.stringify(productData, null, 2));
        console.log();
        
        // Test avec gestion d'erreur détaillée
        try {
            const response = await axios.post(`${baseUrl}product/`, productData, authConfig);
            console.log('✅ SUCCÈS! Produit créé:');
            console.log('🆔 ID:', response.data._id);
            console.log('📝 Titre:', response.data.title);
            console.log('💰 Prix:', response.data.price);
            console.log('🏷️ Marque:', response.data.brand);
            console.log('📂 Catégorie:', response.data.category);
            
        } catch (productError) {
            console.log('❌ ERREUR lors de la création du produit:');
            
            if (productError.response) {
                console.log('📊 Status HTTP:', productError.response.status);
                console.log('📄 Message serveur:', productError.response.data);
                console.log('🔍 Headers:', productError.response.headers);
                
                // Analyser les erreurs spécifiques
                if (productError.response.status === 400) {
                    console.log('\n🔍 ANALYSE: Erreur de validation (400)');
                    console.log('   - Vérifiez que tous les champs requis sont remplis');
                    console.log('   - Vérifiez les types de données (prix = nombre, etc.)');
                } else if (productError.response.status === 401) {
                    console.log('\n🔍 ANALYSE: Token invalide (401)');
                    console.log('   - Le token d\'authentification a expiré');
                    console.log('   - Reconnectez-vous dans l\'interface admin');
                } else if (productError.response.status === 500) {
                    console.log('\n🔍 ANALYSE: Erreur serveur (500)');
                    console.log('   - Problème côté backend/base de données');
                    console.log('   - Vérifiez les logs du serveur backend');
                }
            } else if (productError.code === 'ECONNREFUSED') {
                console.log('\n🔍 ANALYSE: Connexion refusée');
                console.log('   - Le backend n\'est pas accessible');
                console.log('   - Redémarrez le backend');
            } else {
                console.log('\n🔍 ANALYSE: Autre erreur');
                console.log('   - Message:', productError.message);
                console.log('   - Code:', productError.code);
            }
            
            // N'arrêtons pas ici, continuons le diagnostic
        }
        
        // 5. Test des routes spécifiques
        console.log('\n5️⃣ Test des routes individuelles...');
        
        try {
            const productsTest = await axios.get(`${baseUrl}product`, authConfig);
            console.log('✅ Route GET /product OK -', productsTest.data.length, 'produits');
        } catch (e) {
            console.log('❌ Route GET /product échoue:', e.response?.status, e.response?.data);
        }
        
        try {
            const categoriesTest = await axios.get(`${baseUrl}category`, authConfig);
            console.log('✅ Route GET /category OK -', categoriesTest.data.length, 'catégories');
        } catch (e) {
            console.log('❌ Route GET /category échoue:', e.response?.status, e.response?.data);
        }
        
        try {
            const brandsTest = await axios.get(`${baseUrl}brand`, authConfig);
            console.log('✅ Route GET /brand OK -', brandsTest.data.length, 'marques');
        } catch (e) {
            console.log('❌ Route GET /brand échoue:', e.response?.status, e.response?.data);
        }
        
    } catch (error) {
        console.error('\n💥 ERREUR CRITIQUE dans le diagnostic:');
        console.error('Message:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.code === 'ECONNREFUSED') {
            console.error('🔌 Backend non accessible - Vérifiez qu\'il tourne sur le port 4000');
        }
    }
    
    console.log('\n📋 RÉSUMÉ DU DIAGNOSTIC:');
    console.log('─'.repeat(50));
    console.log('Pour corriger "something went wrong" dans l\'interface:');
    console.log('1. Vérifiez la console du navigateur (F12)');
    console.log('2. Regardez l\'onglet Network pour les requêtes qui échouent');
    console.log('3. Assurez-vous que tous les champs sont remplis');
    console.log('4. Reconnectez-vous si nécessaire');
    console.log('5. Redémarrez l\'interface admin si besoin');
}

// Test de validation des données
async function testValidationData() {
    console.log('\n🧪 TEST DE VALIDATION DES DONNÉES\n');
    
    // Test avec données invalides pour voir les erreurs
    const invalidTests = [
        {
            name: 'Prix manquant',
            data: { title: 'Test', description: 'Test', brand: 'Samsung', category: 'Test', quantity: 1 }
        },
        {
            name: 'Titre manquant', 
            data: { description: 'Test', price: 10, brand: 'Samsung', category: 'Test', quantity: 1 }
        },
        {
            name: 'Quantité négative',
            data: { title: 'Test', description: 'Test', price: 10, brand: 'Samsung', category: 'Test', quantity: -1 }
        }
    ];
    
    for (const test of invalidTests) {
        try {
            console.log(`🧪 Test: ${test.name}`);
            // Ce test devrait échouer
            const response = await axios.post('http://localhost:4000/api/product/', test.data, {
                headers: { 'Authorization': 'Bearer fake-token' }
            });
            console.log('⚠️ Test réussi alors qu\'il devrait échouer');
        } catch (error) {
            console.log(`✅ Test échoue comme attendu: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
        }
    }
}

// Exécution
if (require.main === module) {
    const mode = process.argv[2];
    
    if (mode === 'validation') {
        testValidationData();
    } else {
        diagnosticAdminError();
    }
}

module.exports = { diagnosticAdminError, testValidationData };