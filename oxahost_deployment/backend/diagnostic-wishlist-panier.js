// Script de diagnostic pour analyser le problème wishlist/panier

console.log("🔍 DIAGNOSTIC: Problème ajout/suppression simultané");

// 1. Créer un utilisateur de test
function createTestUser() {
    const testUser = {
        email: "test.diagnostic@example.com",
        password: "Test123!",
        firstName: "Test",
        lastName: "Diagnostic"
    };
    
    console.log("👤 Création utilisateur de test:", testUser.email);
    return testUser;
}

// 2. Tester l'ajout au panier
function testAddToCart() {
    const cartData = {
        productId: 22, // MacBook Pro M3
        quantity: 1,
        price: 7635.97, // Prix en TND
    };
    
    console.log("🛒 Test ajout au panier:", cartData);
    
    // Simuler l'action addProdToCart
    console.log("📦 Action: addProdToCart dispatched");
    console.log("✅ Résultat attendu: Produit ajouté au panier SEULEMENT");
}

// 3. Tester l'ajout à la wishlist
function testAddToWishlist() {
    const productId = 22; // MacBook Pro M3
    
    console.log("❤️ Test ajout à la wishlist:", productId);
    
    // Simuler les deux actions possibles
    console.log("📦 Action 1: addToWishlist (productSlice) dispatched");
    console.log("📦 Action 2: toggleProductWishlist (userSlice) dispatched");
    console.log("⚠️ PROBLÈME: Deux actions différentes pour la même fonctionnalité!");
}

// 4. Diagnostiquer le problème
function diagnoseIssue() {
    console.log("\n🚨 DIAGNOSTIC DU PROBLÈME:");
    console.log("1. ❌ Deux actions Redux différentes pour la wishlist:");
    console.log("   - addToWishlist (productSlice)");
    console.log("   - toggleProductWishlist (userSlice)");
    
    console.log("\n2. ❌ Composants utilisant des actions différentes:");
    console.log("   - ProductCard.js → addToWishlist");
    console.log("   - Pages (Homme, Femme, etc.) → toggleProductWishlist");
    
    console.log("\n3. ❌ Actions peuvent entrer en conflit:");
    console.log("   - Une ajoute pendant que l'autre supprime");
    console.log("   - État incohérent entre les slices");
    
    console.log("\n4. ❌ Backend confus:");
    console.log("   - addToWishlist fait un toggle (ajoute OU supprime)");
    console.log("   - Pas de distinction claire ajout/suppression");
}

// 5. Solutions proposées
function proposeSolutions() {
    console.log("\n💡 SOLUTIONS PROPOSÉES:");
    console.log("1. ✅ Unifier les actions Redux:");
    console.log("   - Utiliser uniquement toggleProductWishlist (userSlice)");
    console.log("   - Supprimer addToWishlist (productSlice)");
    
    console.log("\n2. ✅ Corriger tous les composants:");
    console.log("   - ProductCard.js → utiliser toggleProductWishlist");
    console.log("   - Uniformiser l'import dans tous les composants");
    
    console.log("\n3. ✅ Améliorer les messages utilisateur:");
    console.log("   - Messages clairs: 'Ajouté' vs 'Retiré'");
    console.log("   - Feedback visuel cohérent");
    
    console.log("\n4. ✅ Séparer complètement panier et wishlist:");
    console.log("   - Panier → addProdToCart (userSlice)");
    console.log("   - Wishlist → toggleProductWishlist (userSlice)");
    console.log("   - Pas de confusion entre les deux");
}

// Exécuter le diagnostic
createTestUser();
testAddToCart();
testAddToWishlist();
diagnoseIssue();
proposeSolutions();

console.log("\n🎯 PROCHAINES ÉTAPES:");
console.log("1. Corriger ProductCard.js pour utiliser toggleProductWishlist");
console.log("2. Supprimer addToWishlist du productSlice");
console.log("3. Tester le comportement unifié");
console.log("4. Valider que panier et wishlist fonctionnent séparément");