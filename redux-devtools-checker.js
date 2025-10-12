// Outil de vérification Redux DevTools - À exécuter dans la console du navigateur

console.log("🔧 OUTIL DE VÉRIFICATION REDUX DEVTOOLS");
console.log("=" .repeat(60));

// Vérifier si Redux DevTools est disponible
if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    console.log("✅ Redux DevTools détecté et disponible");
} else {
    console.warn("❌ Redux DevTools non détecté");
    console.log("💡 Installez l'extension Redux DevTools pour Chrome/Firefox");
}

// Vérifier si le store est accessible
if (window.store) {
    console.log("✅ Store Redux accessible via window.store");
    
    // Fonction helper pour vérifier l'état d'upload
    window.checkUploadState = () => {
        const state = window.store.getState();
        console.log("📊 ÉTAT UPLOAD ACTUEL:");
        console.log("=" .repeat(40));
        console.log("🔍 Upload State:", state.upload);
        
        if (state.upload) {
            console.log("📋 Détails:");
            console.log("  • Images:", state.upload.images);
            console.log("  • Nombre d'images:", state.upload.images?.length || 0);
            console.log("  • Is Loading:", state.upload.isLoading);
            console.log("  • Is Success:", state.upload.isSuccess);
            console.log("  • Is Error:", state.upload.isError);
            console.log("  • Message:", state.upload.message);
            
            // Vérifier le format des images
            if (state.upload.images && state.upload.images.length > 0) {
                console.log("📸 Vérification format images:");
                state.upload.images.forEach((img, index) => {
                    console.log(`  Image ${index}:`, {
                        hasUrl: !!img.url,
                        hasPublicId: !!img.public_id,
                        url: img.url?.substring(0, 50) + "...",
                        public_id: img.public_id
                    });
                });
            }
        } else {
            console.warn("❌ state.upload non trouvé");
        }
        
        return state.upload;
    };
    
    console.log("✅ Fonction window.checkUploadState() créée");
    console.log("💡 Tapez 'checkUploadState()' pour vérifier l'état");
    
} else {
    console.warn("❌ Store Redux non accessible via window.store");
    console.log("💡 Vérifiez la configuration du store");
}

// Instructions d'utilisation
console.log("\n📋 INSTRUCTIONS D'UTILISATION:");
console.log("=" .repeat(40));
console.log("1. Ouvrez Redux DevTools (onglet Redux dans F12)");
console.log("2. Uploadez une image dans le formulaire");
console.log("3. Tapez 'checkUploadState()' dans cette console");
console.log("4. Observez les changements dans Redux DevTools");

// Fonction pour surveiller les changements
let previousUploadState = null;

window.monitorUploadChanges = () => {
    if (!window.store) {
        console.error("❌ Store non disponible");
        return;
    }
    
    const currentState = window.store.getState().upload;
    
    if (JSON.stringify(currentState) !== JSON.stringify(previousUploadState)) {
        console.log("🔄 CHANGEMENT DÉTECTÉ dans upload state:");
        console.log("Avant:", previousUploadState);
        console.log("Après:", currentState);
        previousUploadState = { ...currentState };
    }
    
    // Vérifier toutes les 1000ms
    setTimeout(window.monitorUploadChanges, 1000);
};

console.log("✅ Fonction window.monitorUploadChanges() créée");
console.log("💡 Tapez 'monitorUploadChanges()' pour surveiller en continu");

// Test rapide
if (window.store) {
    console.log("\n🧪 TEST RAPIDE:");
    window.checkUploadState();
}
