// Script de diagnostic des fonctionnalités panier/wishlist/view
const { exec } = require('child_process');

console.log('🔍 DIAGNOSTIC DES FONCTIONNALITÉS BOUTONS');
console.log('==========================================');

// Test 1: Vérification du backend
console.log('\n1. 📡 Test de connectivité backend...');

const testBackend = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/product');
        if (response.ok) {
            console.log('✅ Backend accessible sur port 4000');
            const data = await response.json();
            console.log(`📦 ${data.length || 0} produits disponibles`);
        } else {
            console.log('❌ Erreur backend:', response.status, response.statusText);
        }
    } catch (error) {
        console.log('❌ Backend non accessible:', error.message);
    }
};

// Test 2: Vérification des endpoints panier/wishlist
const testEndpoints = async () => {
    console.log('\n2. 🛒 Test des endpoints panier/wishlist...');
    
    const endpoints = [
        { name: 'Cart API', url: 'http://localhost:4000/api/user/cart' },
        { name: 'Wishlist API', url: 'http://localhost:4000/api/user/wishlist' },
        { name: 'Product API', url: 'http://localhost:4000/api/product' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint.url, {
                headers: {
                    'Authorization': 'Bearer test-token'
                }
            });
            console.log(`${response.ok ? '✅' : '❌'} ${endpoint.name}: ${response.status}`);
        } catch (error) {
            console.log(`❌ ${endpoint.name}: ${error.message}`);
        }
    }
};

// Test 3: Vérification de l'authentification
const checkAuth = () => {
    console.log('\n3. 🔐 Vérification de l\'authentification...');
    
    // Simuler le localStorage du navigateur
    const mockCustomer = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
        user: {
            id: 1,
            email: 'test@example.com'
        }
    };
    
    console.log('💾 Structure attendue localStorage:');
    console.log('   - customer:', JSON.stringify(mockCustomer, null, 2));
    console.log('   - accessToken: [token]');
    console.log('\n🔧 Vérifications nécessaires:');
    console.log('   1. Utilisateur connecté dans React');
    console.log('   2. Token présent et valide');
    console.log('   3. Headers Authorization correctement configurés');
};

// Test 4: Vérification des erreurs communes
const checkCommonIssues = () => {
    console.log('\n4. 🚨 Erreurs communes identifiées:');
    console.log('   ❌ CORS: Frontend (3002) → Backend (4000)');
    console.log('   ❌ Authentication: Token expired/invalid');
    console.log('   ❌ Product ID: Mismatch _id vs id');
    console.log('   ❌ API Response: Mauvaise structure de données');
    console.log('   ❌ Network: Timeout ou connexion refusée');
};

// Solutions recommandées
const provideSolutions = () => {
    console.log('\n5. 💡 SOLUTIONS RECOMMANDÉES:');
    console.log('==========================================');
    
    console.log('\n🔧 A. Vérification immédiate:');
    console.log('   1. Ouvrir http://localhost:3002 dans le navigateur');
    console.log('   2. Ouvrir DevTools → Console → Network');
    console.log('   3. Cliquer sur un bouton panier/wishlist');
    console.log('   4. Observer les erreurs dans la console');
    
    console.log('\n🔧 B. Tests backend:');
    console.log('   curl -X GET http://localhost:4000/api/product');
    console.log('   curl -X POST http://localhost:4000/api/user/cart \\');
    console.log('        -H "Authorization: Bearer [token]" \\');
    console.log('        -H "Content-Type: application/json" \\');
    console.log('        -d \'{"productId": "test", "quantity": 1}\'');
    
    console.log('\n🔧 C. Vérification authentification:');
    console.log('   1. Se connecter avec: zoghlamimustapha16@gmail.com');
    console.log('   2. Vérifier localStorage.getItem("customer")');
    console.log('   3. Vérifier que le token n\'est pas expiré');
    
    console.log('\n🔧 D. Debug React:');
    console.log('   1. Ajouter console.log dans ProductCard.js');
    console.log('   2. Vérifier authState dans Redux DevTools');
    console.log('   3. Surveiller les actions dispatch');
};

// Test 6: Vérification des fichiers critiques
const checkCriticalFiles = () => {
    console.log('\n6. 📁 Fichiers critiques à vérifier:');
    console.log('   ✅ ProductCard.js - Composant boutons');
    console.log('   ✅ userSlice.js - Actions panier');  
    console.log('   ✅ productSlice.js - Actions wishlist');
    console.log('   ✅ userService.js - API calls');
    console.log('   ✅ baseUrl.js - Configuration API');
};

// Exécuter tous les tests
const runDiagnostic = async () => {
    await testBackend();
    await testEndpoints();
    checkAuth();
    checkCommonIssues();
    provideSolutions();
    checkCriticalFiles();
    
    console.log('\n🎯 PROCHAINES ÉTAPES:');
    console.log('1. Ouvrir http://localhost:3002');
    console.log('2. Se connecter avec le compte test');
    console.log('3. Ouvrir DevTools et surveiller Console/Network');
    console.log('4. Tester les boutons et noter les erreurs');
    console.log('5. Partager les messages d\'erreur exacts');
};

// Démarrer le diagnostic
runDiagnostic().catch(console.error);