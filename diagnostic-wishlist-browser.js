// 🔧 Diagnostic Wishlist - à exécuter dans la console du navigateur
console.log("=== 🔧 DIAGNOSTIC WISHLIST DÉMARRÉ ===");

// Test 1: Vérifier l'état de l'authentification
function checkAuthState() {
    console.log("📋 1. Vérification de l'état d'authentification:");
    
    const customer = localStorage.getItem('customer');
    if (customer) {
        try {
            const parsedCustomer = JSON.parse(customer);
            console.log("✅ Utilisateur connecté:", parsedCustomer.firstname || 'Nom non disponible');
            console.log("🔑 Token présent:", !!parsedCustomer.token);
            console.log("📅 Token longueur:", parsedCustomer.token ? parsedCustomer.token.length : 0);
            return true;
        } catch (e) {
            console.log("❌ Erreur parsing customer data:", e.message);
            return false;
        }
    } else {
        console.log("❌ Aucun utilisateur connecté - localStorage 'customer' vide");
        return false;
    }
}

// Test 2: Vérifier l'état Redux
function checkReduxState() {
    console.log("\n📋 2. Vérification de l'état Redux:");
    
    // Essayer d'accéder au store Redux
    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
        console.log("✅ Redux DevTools disponible");
    }
    
    // Vérifier les éléments DOM Redux
    const reduxStateScript = document.querySelector('[data-redux-state]');
    if (reduxStateScript) {
        console.log("✅ État Redux trouvé dans le DOM");
    }
    
    console.log("💡 Pour voir l'état Redux, ouvrez Redux DevTools ou inspectez window.__STORE__");
}

// Test 3: Test API direct
async function testWishlistAPI() {
    console.log("\n📋 3. Test API Wishlist direct:");
    
    const customer = localStorage.getItem('customer');
    if (!customer) {
        console.log("❌ Impossible de tester l'API - utilisateur non connecté");
        return false;
    }
    
    try {
        const parsedCustomer = JSON.parse(customer);
        const token = parsedCustomer.token;
        
        // Test avec un ID de produit factice
        const testProductId = "507f1f77bcf86cd799439011"; // ID MongoDB factice
        
        const response = await fetch('http://localhost:4000/api/product/wishlist', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ prodId: testProductId })
        });
        
        console.log("🌐 Status de réponse:", response.status);
        console.log("🌐 Headers de réponse:", Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log("✅ Réponse API réussie:", data);
            return true;
        } else {
            const errorData = await response.text();
            console.log("❌ Erreur API:", response.status, errorData);
            return false;
        }
        
    } catch (error) {
        console.log("❌ Erreur réseau:", error.message);
        return false;
    }
}

// Test 4: Vérifier les gestionnaires d'événements
function checkEventHandlers() {
    console.log("\n📋 4. Vérification des boutons wishlist:");
    
    const wishlistButtons = document.querySelectorAll('[class*="wishlist"], [title*="wishlist"], [title*="Favoris"]');
    console.log(`🎯 Trouvé ${wishlistButtons.length} boutons wishlist potentiels`);
    
    wishlistButtons.forEach((button, index) => {
        console.log(`   ${index + 1}. Bouton:`, button.className, button.textContent.trim());
        
        // Vérifier s'il y a des événements attachés
        const events = getEventListeners ? getEventListeners(button) : "Non disponible";
        if (events && events.click) {
            console.log(`      ✅ Gestionnaire click attaché`);
        } else {
            console.log(`      ⚠️ Aucun gestionnaire click trouvé`);
        }
    });
}

// Test 5: Simuler un clic wishlist
function simulateWishlistClick() {
    console.log("\n📋 5. Simulation d'un clic wishlist:");
    
    // Chercher le produit actuel sur la page
    const productElement = document.querySelector('[data-product-id], .product-title, .main-product-details');
    
    if (productElement) {
        console.log("🎯 Élément produit trouvé:", productElement.className);
        
        // Chercher le bouton wishlist le plus proche
        const wishlistButton = productElement.querySelector('[class*="wishlist"], [title*="Favoris"]') || 
                              document.querySelector('button[class*="action-button"][class*="btn-secondary"]');
        
        if (wishlistButton) {
            console.log("🔘 Bouton wishlist trouvé, simulation du clic...");
            
            // Créer un événement click personnalisé
            const clickEvent = new Event('click', { bubbles: true, cancelable: true });
            wishlistButton.dispatchEvent(clickEvent);
            
            console.log("✅ Clic simulé - vérifiez les logs de la console pour les messages de debugging");
        } else {
            console.log("❌ Bouton wishlist non trouvé sur cette page");
        }
    } else {
        console.log("❌ Élément produit non trouvé - assurez-vous d'être sur une page produit");
    }
}

// Fonction principale de diagnostic
async function runWishlistDiagnostic() {
    console.log("🚀 Démarrage du diagnostic complet...\n");
    
    const authOK = checkAuthState();
    checkReduxState();
    
    if (authOK) {
        await testWishlistAPI();
    }
    
    checkEventHandlers();
    
    console.log("\n=== 📊 RÉSUMÉ DU DIAGNOSTIC ===");
    console.log("1. Copiez et collez ce code dans la console du navigateur");
    console.log("2. Exécutez: runWishlistDiagnostic()");
    console.log("3. Si connecté, vous pouvez aussi tester: simulateWishlistClick()");
    console.log("4. Vérifiez les messages d'erreur dans la console");
    console.log("\n💡 INSTRUCTIONS:");
    console.log("- Assurez-vous d'être connecté");
    console.log("- Visitez une page de produit");
    console.log("- Ouvrez F12 > Console");
    console.log("- Collez ce code et exécutez-le");
}

// Auto-exécution si dans un environnement de console
if (typeof window !== 'undefined' && window.console) {
    runWishlistDiagnostic();
    
    // Exposer la fonction de simulation globalement
    window.testWishlist = simulateWishlistClick;
    window.diagWishlist = runWishlistDiagnostic;
    
    console.log("\n🛠️ FONCTIONS DISPONIBLES:");
    console.log("- diagWishlist() : Relancer le diagnostic");
    console.log("- testWishlist() : Simuler un clic wishlist");
}