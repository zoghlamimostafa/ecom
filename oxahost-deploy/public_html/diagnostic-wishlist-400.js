// 🔧 DIAGNOSTIC ERREUR WISHLIST 400
console.log('🚨 DIAGNOSTIC ERREUR WISHLIST STATUS 400');
console.log('============================================');

// Test de diagnostic pour identifier la cause exacte
async function diagnosticWishlist400() {
    console.log('\n🔍 1. Vérification des prérequis...');
    
    // Vérifier le token d'authentification
    const customer = localStorage.getItem('customer');
    if (!customer) {
        console.log('❌ PROBLÈME: Pas de token d\'authentification');
        console.log('💡 SOLUTION: Connectez-vous d\'abord');
        return;
    }
    
    const parsedCustomer = JSON.parse(customer);
    const token = parsedCustomer.token;
    console.log('✅ Token trouvé:', token ? 'Présent' : 'Absent');
    
    // Vérifier l'utilisateur
    if (parsedCustomer.id) {
        console.log('✅ User ID:', parsedCustomer.id);
    } else {
        console.log('❌ PROBLÈME: Pas d\'ID utilisateur dans le token');
    }
    
    console.log('\n🔍 2. Test de récupération des produits...');
    
    try {
        // Récupérer la liste des produits
        const productsResponse = await fetch('http://localhost:4000/api/product');
        const products = await productsResponse.json();
        
        if (products && products.length > 0) {
            console.log(`✅ ${products.length} produits disponibles`);
            
            const firstProduct = products[0];
            console.log('🎯 Premier produit pour test:');
            console.log('  - ID:', firstProduct.id || firstProduct._id);
            console.log('  - Titre:', firstProduct.title);
            
            const productId = firstProduct.id || firstProduct._id;
            
            console.log('\n🔍 3. Test de l\'API wishlist...');
            
            // Test avec les données exactes
            const wishlistPayload = {
                prodId: productId
            };
            
            console.log('📤 Payload envoyé:', JSON.stringify(wishlistPayload, null, 2));
            console.log('🔑 Headers:');
            console.log('  - Authorization: Bearer ' + token.substring(0, 20) + '...');
            console.log('  - Content-Type: application/json');
            
            const response = await fetch('http://localhost:4000/api/product/wishlist', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(wishlistPayload)
            });
            
            console.log(`\n📨 Réponse du serveur: ${response.status} ${response.statusText}`);
            
            const responseText = await response.text();
            console.log('📄 Contenu de la réponse:');
            
            try {
                const responseJson = JSON.parse(responseText);
                console.log(JSON.stringify(responseJson, null, 2));
                
                if (response.status === 400) {
                    console.log('\n🚨 ANALYSE DE L\'ERREUR 400:');
                    console.log('❌ Bad Request - Données invalides');
                    
                    if (responseJson.message) {
                        console.log('💬 Message d\'erreur:', responseJson.message);
                    }
                    
                    if (responseJson.debug) {
                        console.log('🐛 Debug info:', responseJson.debug);
                    }
                    
                    console.log('\n💡 SOLUTIONS POSSIBLES:');
                    console.log('1. Vérifier que le produit ID est valide');
                    console.log('2. Vérifier que l\'utilisateur ID est correct');
                    console.log('3. Vérifier le format de la requête');
                    console.log('4. Vérifier les modèles de base de données');
                }
                
            } catch (e) {
                console.log('⚠️ Réponse non-JSON:', responseText);
            }
            
        } else {
            console.log('❌ PROBLÈME: Aucun produit disponible pour test');
        }
        
    } catch (error) {
        console.log('❌ ERREUR:', error.message);
    }
}

// Fonction d'aide pour tester différents formats d'ID
async function testDifferentIdFormats() {
    console.log('\n🧪 4. Test avec différents formats d\'ID...');
    
    const customer = JSON.parse(localStorage.getItem('customer'));
    const token = customer.token;
    
    const testIds = [
        22,              // ID numérique simple
        "22",            // ID string
        { prodId: 22 },  // Format objet (incorrect)
        null,            // ID null
        undefined,       // ID undefined
        ""               // ID vide
    ];
    
    for (let i = 0; i < testIds.length; i++) {
        const testId = testIds[i];
        console.log(`\n🧪 Test ${i + 1}: ID = ${JSON.stringify(testId)}`);
        
        try {
            const response = await fetch('http://localhost:4000/api/product/wishlist', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prodId: testId })
            });
            
            console.log(`   Status: ${response.status}`);
            
            if (response.status !== 200) {
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    console.log(`   Erreur: ${errorJson.message}`);
                } catch {
                    console.log(`   Erreur: ${errorText}`);
                }
            } else {
                console.log('   ✅ Succès !');
            }
            
        } catch (error) {
            console.log(`   ❌ Erreur réseau: ${error.message}`);
        }
    }
}

// Fonction pour afficher les instructions
function afficherInstructions() {
    console.log('\n📋 INSTRUCTIONS D\'UTILISATION:');
    console.log('1. Ouvrez la console du navigateur (F12)');
    console.log('2. Naviguez vers http://localhost:3000');
    console.log('3. Connectez-vous avec votre compte');
    console.log('4. Collez ce script et exécutez:');
    console.log('   diagnosticWishlist400()');
    console.log('5. Pour des tests avancés:');
    console.log('   testDifferentIdFormats()');
}

// Auto-exécution si dans le navigateur
if (typeof window !== 'undefined' && window.console) {
    console.log('🔧 Script de diagnostic chargé !');
    afficherInstructions();
    
    // Exécution automatique si connecté
    if (localStorage.getItem('customer')) {
        console.log('\n🚀 Lancement automatique du diagnostic...');
        diagnosticWishlist400().then(() => {
            testDifferentIdFormats();
        });
    }
}

// Exporter pour usage manuel
window.diagnosticWishlist400 = diagnosticWishlist400;
window.testDifferentIdFormats = testDifferentIdFormats;