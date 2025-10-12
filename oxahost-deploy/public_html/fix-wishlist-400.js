// 🔧 FIX ERREUR WISHLIST 400 - DIAGNOSTIC ET CORRECTION

console.log('🚨 CORRECTION DE L\'ERREUR WISHLIST 400');
console.log('==========================================');

// 1. Vérifier le contrôleur backend pour identifier le problème
function analyzeBackendResponse() {
    console.log('\n🔍 1. ANALYSE DU PROBLÈME WISHLIST 400:');
    console.log('Le status 400 (Bad Request) indique généralement:');
    console.log('   ❌ Paramètres manquants ou invalides');
    console.log('   ❌ Format d\'ID incorrect');
    console.log('   ❌ Validation des données échouée');
    console.log('   ❌ Structure de la requête incorrecte');
}

// 2. Test diagnostic pour identifier la cause exacte
async function testWishlistWithDebug() {
    console.log('\n🧪 2. TEST DIAGNOSTIC WISHLIST:');
    
    // Vérifier l'authentification
    const customer = localStorage.getItem('customer');
    if (!customer) {
        console.log('❌ ERREUR: Utilisateur non connecté');
        return false;
    }
    
    const parsedCustomer = JSON.parse(customer);
    const token = parsedCustomer.token;
    console.log('✅ Token présent:', !!token);
    console.log('✅ User ID:', parsedCustomer.id);
    
    // Récupérer un produit pour test
    try {
        const productsResponse = await fetch('http://localhost:4000/api/product');
        const products = await productsResponse.json();
        
        if (products && products.length > 0) {
            const testProduct = products[0];
            const productId = testProduct.id || testProduct._id;
            
            console.log('🎯 Produit de test:', {
                id: productId,
                title: testProduct.title,
                type: typeof productId
            });
            
            // Test avec différents formats
            await testDifferentPayloadFormats(token, productId);
            
        } else {
            console.log('❌ Aucun produit disponible pour test');
        }
    } catch (error) {
        console.error('❌ Erreur récupération produits:', error);
    }
}

// 3. Tester différents formats de payload
async function testDifferentPayloadFormats(token, productId) {
    console.log('\n🧪 3. TEST DIFFÉRENTS FORMATS DE PAYLOAD:');
    
    const testCases = [
        {
            name: 'Format standard',
            payload: { prodId: productId }
        },
        {
            name: 'Format avec productId',
            payload: { productId: productId }
        },
        {
            name: 'Format avec _id',
            payload: { _id: productId }
        },
        {
            name: 'Format avec id string',
            payload: { prodId: String(productId) }
        },
        {
            name: 'Format avec id number',
            payload: { prodId: Number(productId) }
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n🧪 Test: ${testCase.name}`);
        console.log('   Payload:', JSON.stringify(testCase.payload));
        
        try {
            const response = await fetch('http://localhost:4000/api/product/wishlist', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(testCase.payload)
            });
            
            console.log(`   Status: ${response.status} ${response.statusText}`);
            
            const responseText = await response.text();
            
            if (response.ok) {
                console.log('   ✅ Succès!');
                try {
                    const result = JSON.parse(responseText);
                    console.log('   Résultat:', result.message || result);
                } catch (e) {
                    console.log('   Réponse:', responseText);
                }
                return true; // Succès trouvé
            } else {
                try {
                    const error = JSON.parse(responseText);
                    console.log(`   ❌ Erreur: ${error.message || responseText}`);
                    if (error.debug) {
                        console.log('   Debug info:', error.debug);
                    }
                } catch (e) {
                    console.log(`   ❌ Erreur: ${responseText}`);
                }
            }
        } catch (error) {
            console.log(`   ❌ Erreur réseau: ${error.message}`);
        }
    }
    
    return false;
}

// 4. Solution recommandée
function provideSolution() {
    console.log('\n💡 4. SOLUTIONS RECOMMANDÉES:');
    console.log('==========================================');
    
    console.log('🔧 A. Vérifications backend:');
    console.log('   1. Contrôler que le modèle Product existe');
    console.log('   2. Vérifier que l\'ID produit est valide');
    console.log('   3. S\'assurer que l\'utilisateur existe');
    console.log('   4. Contrôler les associations Sequelize');
    
    console.log('\n🔧 B. Vérifications frontend:');
    console.log('   1. Utiliser le bon format d\'ID (id vs _id)');
    console.log('   2. S\'assurer que l\'ID n\'est pas null/undefined');
    console.log('   3. Vérifier le type de l\'ID (string vs number)');
    console.log('   4. Contrôler les headers de la requête');
    
    console.log('\n🔧 C. Actions immédiates:');
    console.log('   1. Ouvrir les DevTools (F12)');
    console.log('   2. Aller à l\'onglet Network');
    console.log('   3. Cliquer sur un bouton wishlist');
    console.log('   4. Examiner la requête PUT /api/product/wishlist');
    console.log('   5. Vérifier le payload envoyé');
}

// 5. Script de correction automatique
async function applyWishlistFix() {
    console.log('\n🛠️ 5. APPLICATION DU FIX:');
    
    // Cette fonction peut être appelée depuis le navigateur
    // pour corriger le problème en temps réel
    
    const customer = localStorage.getItem('customer');
    if (!customer) {
        console.log('❌ Veuillez vous connecter d\'abord');
        return;
    }
    
    console.log('🔄 Tentative de fix automatique...');
    
    // Test avec le premier produit disponible
    try {
        const success = await testWishlistWithDebug();
        if (success) {
            console.log('✅ Fix appliqué avec succès!');
            console.log('💡 Le problème était dans le format des données');
        } else {
            console.log('❌ Fix automatique échoué');
            console.log('💡 Problème plus complexe nécessitant intervention manuelle');
        }
    } catch (error) {
        console.error('❌ Erreur lors du fix:', error);
    }
}

// Auto-exécution
analyzeBackendResponse();
console.log('\n🚀 LANCEMENT DU DIAGNOSTIC...');
testWishlistWithDebug().then(() => {
    provideSolution();
    console.log('\n🔧 Pour appliquer le fix automatique:');
    console.log('applyWishlistFix()');
});

// Exporter pour usage manuel
if (typeof window !== 'undefined') {
    window.testWishlistWithDebug = testWishlistWithDebug;
    window.applyWishlistFix = applyWishlistFix;
}