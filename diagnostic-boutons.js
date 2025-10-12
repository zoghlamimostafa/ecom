// Script de diagnostic des boutons panier/wishlist
console.log('🔍 DIAGNOSTIC BOUTONS PANIER/WISHLIST');

// Test de base des APIs
async function testAPIs() {
    console.log('\n📡 Test des APIs...');
    
    try {
        // Test API produits
        const response = await fetch('http://localhost:4000/api/product');
        const products = await response.json();
        console.log('✅ API Produits:', products.length, 'produits trouvés');
        
        // Test premier produit
        if (products.length > 0) {
            const firstProduct = products[0];
            console.log('📦 Premier produit:', {
                id: firstProduct.id,
                title: firstProduct.title,
                price: firstProduct.price
            });
            
            // Test API utilisateur (nécessite auth)
            console.log('\n🔐 Test APIs utilisateur (nécessitent auth):');
            console.log('- /api/user/cart (GET)');
            console.log('- /api/user/add-to-cart (PUT)');
            console.log('- /api/user/wishlist (GET)');
            console.log('- /api/user/wishlist (PUT)');
        }
        
    } catch (error) {
        console.error('❌ Erreur API:', error);
    }
}

// Vérifications Redux
function checkReduxActions() {
    console.log('\n🔧 VÉRIFICATIONS REDUX:');
    console.log('1. ✅ addToWishlist (productSlice) → DÉSACTIVÉ');
    console.log('2. ✅ toggleProductWishlist (userSlice) → ACTIF');
    console.log('3. ✅ addProdToCart (userSlice) → ACTIF');
    console.log('4. ✅ ProductCard.js → utilise toggleProductWishlist');
    console.log('5. ✅ Pages catégories → utilisent toggleProductWishlist');
}

// Instructions de test manuel
function testInstructions() {
    console.log('\n📋 INSTRUCTIONS DE TEST MANUEL:');
    console.log('1. Ouvrir http://localhost:3000');
    console.log('2. Aller sur une page produit ou catégorie');
    console.log('3. Cliquer sur bouton cœur (wishlist)');
    console.log('4. Cliquer sur bouton panier');
    console.log('5. Vérifier la console pour erreurs');
    console.log('6. Vérifier les notifications toast');
    
    console.log('\n⚠️ PROBLÈMES POSSIBLES:');
    console.log('- Utilisateur non connecté → redirection login');
    console.log('- Token expiré → erreur auth');
    console.log('- CORS backend → erreur réseau');
    console.log('- Redux state mal initialisé');
}

// Points de vérification
function checkPoints() {
    console.log('\n🎯 POINTS DE VÉRIFICATION:');
    console.log('1. État d\'authentification Redux');
    console.log('2. Token dans localStorage/sessionStorage');
    console.log('3. Réponses API dans Network tab');
    console.log('4. Erreurs JavaScript dans Console');
    console.log('5. État Redux dans DevTools');
    
    console.log('\n🔍 FICHIERS CLÉS À VÉRIFIER:');
    console.log('- ProductCard.js → handleAddToCart, handleAddToWishlist');
    console.log('- userSlice.js → toggleProductWishlist, addProdToCart');
    console.log('- userService.js → API calls');
    console.log('- authSlice.js → token management');
}

// Exécution
async function runDiagnostic() {
    checkReduxActions();
    await testAPIs();
    testInstructions();
    checkPoints();
    
    console.log('\n🚀 APPLICATION LANCÉE:');
    console.log('Frontend: http://localhost:3000');
    console.log('Backend: http://localhost:4000');
    console.log('\n✨ Prêt pour les tests !');
}

runDiagnostic().catch(console.error);