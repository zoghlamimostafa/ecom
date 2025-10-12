const axios = require('axios');

async function diagnosticAddToCart() {
    console.log('🛒 Diagnostic détaillé de l\'ajout au panier...\n');
    
    try {
        // Étape 1: Vérifier la connexion au backend
        console.log('🔗 Test 1: Connexion au backend...');
        const healthCheck = await axios.get('http://localhost:4000/api/product/', {
            timeout: 5000
        });
        console.log(`✅ Backend accessible - ${healthCheck.data.length} produits disponibles\n`);
        
        // Étape 2: Vérifier la structure d'un produit
        console.log('📦 Test 2: Structure des produits...');
        const product = healthCheck.data[0];
        console.log('Structure du produit:');
        console.log(`   ID: ${product.id || product._id || 'MANQUANT'}`);
        console.log(`   Title: ${product.title || 'MANQUANT'}`);
        console.log(`   Price: ${product.price || 'MANQUANT'} (type: ${typeof product.price})`);
        console.log(`   Brand: ${product.brand || 'MANQUANT'}`);
        console.log(`   Images: ${typeof product.images} (${Array.isArray(product.images) ? 'Array' : 'String'})`);
        
        // Étape 3: Tester l'endpoint du panier (besoin d'authentification)
        console.log('\n🔐 Test 3: Endpoints utilisateur...');
        
        // Test sans authentification (pour voir la réponse)
        try {
            const cartResponse = await axios.post('http://localhost:4000/api/user/cart', {
                productId: product.id || product._id,
                quantity: 1,
                price: parseFloat(product.price)
            });
            console.log('✅ Endpoint panier accessible');
        } catch (cartError) {
            if (cartError.response) {
                console.log(`⚠️ Endpoint panier: ${cartError.response.status} - ${cartError.response.statusText}`);
                console.log(`   Message: ${cartError.response.data?.message || 'Pas de message'}`);
                
                if (cartError.response.status === 401) {
                    console.log('   🔍 Problème d\'authentification détecté');
                } else if (cartError.response.status === 404) {
                    console.log('   🔍 Endpoint non trouvé');
                } else if (cartError.response.status === 500) {
                    console.log('   🔍 Erreur serveur');
                }
            } else {
                console.log(`❌ Erreur réseau: ${cartError.message}`);
            }
        }
        
        // Étape 4: Vérifier les endpoints disponibles
        console.log('\n🛣️ Test 4: Endpoints disponibles...');
        
        const endpoints = [
            'http://localhost:4000/api/user/register',
            'http://localhost:4000/api/user/login',
            'http://localhost:4000/api/user/cart',
            'http://localhost:4000/api/product'
        ];
        
        for (const endpoint of endpoints) {
            try {
                if (endpoint.includes('cart')) {
                    // Test POST pour le panier
                    await axios.post(endpoint, {}, { timeout: 2000 });
                } else if (endpoint.includes('register') || endpoint.includes('login')) {
                    // Test POST pour auth
                    await axios.post(endpoint, {}, { timeout: 2000 });
                } else {
                    // Test GET
                    await axios.get(endpoint, { timeout: 2000 });
                }
                console.log(`✅ ${endpoint.split('/').pop()}: Accessible`);
            } catch (endpointError) {
                if (endpointError.response) {
                    const status = endpointError.response.status;
                    if (status === 401) {
                        console.log(`🔐 ${endpoint.split('/').pop()}: Nécessite authentification`);
                    } else if (status === 400) {
                        console.log(`📝 ${endpoint.split('/').pop()}: Données requises`);
                    } else if (status === 404) {
                        console.log(`❌ ${endpoint.split('/').pop()}: Non trouvé`);
                    } else {
                        console.log(`⚠️ ${endpoint.split('/').pop()}: Status ${status}`);
                    }
                } else {
                    console.log(`❌ ${endpoint.split('/').pop()}: Erreur réseau`);
                }
            }
        }
        
        // Étape 5: Analyser le problème d'authentification
        console.log('\n🔍 Test 5: Analyse d\'authentification...');
        console.log('💡 Problèmes possibles identifiés:');
        console.log('   1. L\'utilisateur n\'est pas connecté');
        console.log('   2. Token d\'authentification expiré');
        console.log('   3. Endpoint du panier mal configuré');
        console.log('   4. Structure des données incompatible');
        
        console.log('\n🔧 Solutions recommandées:');
        console.log('   1. Vérifier que l\'utilisateur est connecté sur l\'interface');
        console.log('   2. Vérifier la console du navigateur pour voir l\'erreur exacte');
        console.log('   3. Tester la connexion/inscription utilisateur');
        console.log('   4. Vérifier les headers d\'authentification');
        
    } catch (error) {
        console.error('❌ Erreur lors du diagnostic:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n🚨 Le serveur backend n\'est pas accessible !');
            console.log('   Vérifiez que le serveur sur le port 4000 fonctionne');
        } else if (error.code === 'ETIMEDOUT') {
            console.log('\n🚨 Timeout de connexion !');
            console.log('   Le serveur met trop de temps à répondre');
        }
    }
}

console.log('🚀 Démarrage du diagnostic d\'ajout au panier...');
diagnosticAddToCart()
    .then(() => {
        console.log('\n🎉 Diagnostic terminé');
        console.log('\n📋 Prochaines étapes:');
        console.log('   1. Ouvrir la console du navigateur (F12)');
        console.log('   2. Essayer d\'ajouter un produit au panier');
        console.log('   3. Noter l\'erreur exacte affichée');
        console.log('   4. Vérifier l\'état de connexion utilisateur');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Erreur fatale:', error);
        process.exit(1);
    });