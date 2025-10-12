const axios = require('axios');

async function diagnoseOrdersAuth() {
    console.log('📋 Diagnostic des commandes utilisateur (erreur 401)...\n');
    
    try {
        // Étape 1: Vérifier les endpoints de commandes disponibles
        console.log('🔗 Test 1: Vérification des endpoints...');
        
        const endpoints = [
            'http://localhost:4000/api/user/get-orders',
            'http://localhost:4000/api/user/orders',
            'http://localhost:4000/api/order',
            'http://localhost:4000/api/user/cart'
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(endpoint, { timeout: 3000 });
                console.log(`✅ ${endpoint.split('/').pop()}: Accessible (${response.status})`);
            } catch (error) {
                if (error.response) {
                    const status = error.response.status;
                    if (status === 401) {
                        console.log(`🔐 ${endpoint.split('/').pop()}: Nécessite authentification (${status})`);
                    } else if (status === 404) {
                        console.log(`❌ ${endpoint.split('/').pop()}: Endpoint non trouvé (${status})`);
                    } else {
                        console.log(`⚠️ ${endpoint.split('/').pop()}: Status ${status}`);
                    }
                } else {
                    console.log(`❌ ${endpoint.split('/').pop()}: Erreur réseau`);
                }
            }
        }
        
        // Étape 2: Créer un utilisateur de test et tester les commandes
        console.log('\n👤 Test 2: Création d\'utilisateur et test commandes...');
        
        const testUser = {
            firstname: 'Test',
            lastname: 'Orders',
            email: 'testorders@example.com',
            mobile: '1234567890',
            password: 'Test123!'
        };
        
        // Essayer de créer l'utilisateur
        try {
            await axios.post('http://localhost:4000/api/user/register', testUser);
            console.log('✅ Utilisateur créé avec succès');
        } catch (registerError) {
            if (registerError.response && registerError.response.status === 400) {
                console.log('⚠️ Utilisateur existe déjà, passage à la connexion...');
            } else {
                console.log(`❌ Erreur création: ${registerError.response?.data?.message || registerError.message}`);
                
                // Si l'erreur de register échoue, essayons avec un email différent
                testUser.email = `test${Date.now()}@example.com`;
                try {
                    await axios.post('http://localhost:4000/api/user/register', testUser);
                    console.log('✅ Nouvel utilisateur créé avec succès');
                } catch (secondError) {
                    console.log(`❌ Impossible de créer un utilisateur: ${secondError.message}`);
                    return;
                }
            }
        }
        
        // Connexion de l'utilisateur
        console.log('\n🔑 Test 3: Connexion et récupération du token...');
        
        try {
            const loginResponse = await axios.post('http://localhost:4000/api/user/login', {
                email: testUser.email,
                password: testUser.password
            });
            
            const token = loginResponse.data.token;
            const userId = loginResponse.data._id || loginResponse.data.id;
            
            console.log('✅ Connexion réussie');
            console.log(`   Token: ${token ? 'Présent' : 'Absent'}`);
            console.log(`   User ID: ${userId}`);
            
            if (!token) {
                console.log('❌ Aucun token retourné par l\'API de connexion');
                return;
            }
            
            const authHeaders = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            
            // Étape 4: Tester l'accès aux commandes
            console.log('\n📋 Test 4: Accès aux commandes avec authentification...');
            
            const orderEndpoints = [
                'http://localhost:4000/api/user/get-orders',
                'http://localhost:4000/api/user/orders'
            ];
            
            let ordersAccessible = false;
            let ordersData = null;
            
            for (const orderEndpoint of orderEndpoints) {
                try {
                    console.log(`🔍 Test: ${orderEndpoint}`);
                    const ordersResponse = await axios.get(orderEndpoint, authHeaders);
                    console.log(`✅ Commandes accessibles via ${orderEndpoint.split('/').pop()}`);
                    console.log(`   Status: ${ordersResponse.status}`);
                    console.log(`   Nombre de commandes: ${Array.isArray(ordersResponse.data) ? ordersResponse.data.length : 'Non-array'}`);
                    
                    ordersAccessible = true;
                    ordersData = ordersResponse.data;
                    break;
                } catch (orderError) {
                    if (orderError.response) {
                        console.log(`❌ ${orderEndpoint.split('/').pop()}: Status ${orderError.response.status}`);
                        if (orderError.response.status === 401) {
                            console.log('   🔍 Token invalide ou expiré');
                        } else if (orderError.response.status === 404) {
                            console.log('   🔍 Endpoint non trouvé');
                        }
                        console.log(`   Message: ${orderError.response.data?.message || 'Pas de message'}`);
                    } else {
                        console.log(`❌ ${orderEndpoint.split('/').pop()}: Erreur réseau`);
                    }
                }
            }
            
            // Étape 5: Analyser la structure de la réponse
            if (ordersAccessible && ordersData) {
                console.log('\n📊 Test 5: Analyse des données commandes...');
                
                if (Array.isArray(ordersData)) {
                    console.log(`✅ Structure correcte: Array avec ${ordersData.length} éléments`);
                    
                    if (ordersData.length > 0) {
                        const firstOrder = ordersData[0];
                        console.log('📦 Structure première commande:');
                        console.log(`   ID: ${firstOrder._id || firstOrder.id || 'Manquant'}`);
                        console.log(`   Date: ${firstOrder.createdAt || firstOrder.date || 'Manquante'}`);
                        console.log(`   Status: ${firstOrder.orderStatus || firstOrder.status || 'Manquant'}`);
                        console.log(`   Total: ${firstOrder.totalPrice || firstOrder.total || 'Manquant'}`);
                    } else {
                        console.log('ℹ️ Aucune commande trouvée (normal pour un nouveau compte)');
                    }
                } else {
                    console.log(`⚠️ Structure inattendue: ${typeof ordersData}`);
                    console.log('   Données:', JSON.stringify(ordersData, null, 2));
                }
            }
            
            // Étape 6: Recommandations
            console.log('\n💡 Recommandations pour résoudre l\'erreur 401:');
            
            if (ordersAccessible) {
                console.log('✅ L\'authentification fonctionne côté serveur');
                console.log('🔍 Problème probable côté client:');
                console.log('   1. Vérifier que l\'utilisateur est bien connecté');
                console.log('   2. Vérifier la persistance du token dans localStorage');
                console.log('   3. Vérifier les headers d\'authentification côté client');
                console.log('   4. Vérifier l\'URL utilisée côté client');
            } else {
                console.log('❌ Problème d\'authentification côté serveur:');
                console.log('   1. Vérifier la validation du token');
                console.log('   2. Vérifier les middlewares d\'authentification');
                console.log('   3. Vérifier les routes des commandes');
            }
            
        } catch (loginError) {
            console.log(`❌ Erreur de connexion: ${loginError.response?.data?.message || loginError.message}`);
            
            if (loginError.response && loginError.response.status === 500) {
                console.log('🔍 Erreur serveur lors de la connexion:');
                console.log('   - Vérifier la base de données');
                console.log('   - Vérifier la configuration JWT');
                console.log('   - Vérifier les logs du serveur backend');
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du diagnostic:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n🚨 Le serveur backend n\'est pas accessible !');
            console.log('   Vérifiez que le serveur sur le port 4000 fonctionne');
        }
    }
}

console.log('🚀 Démarrage du diagnostic des commandes (erreur 401)...');
diagnoseOrdersAuth()
    .then(() => {
        console.log('\n🎉 Diagnostic terminé');
        console.log('\n📝 Prochaines étapes:');
        console.log('   1. Vérifier la connexion utilisateur côté client');
        console.log('   2. Vérifier le token dans localStorage du navigateur');
        console.log('   3. Vérifier l\'endpoint utilisé pour récupérer les commandes');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Erreur fatale:', error);
        process.exit(1);
    });