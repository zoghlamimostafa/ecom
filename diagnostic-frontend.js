// Script de diagnostic à exécuter dans la console du navigateur
// Ouvrez http://localhost:3001 et ouvrez la console (F12)
// Puis copiez-collez ce code

console.log('🔍 DIAGNOSTIC FRONTEND - ADD PRODUCT');

// 1. Vérifier l'état de connexion
console.log('\n👤 1. État de connexion:');
const userFromStorage = localStorage.getItem('user');
if (userFromStorage) {
    try {
        const user = JSON.parse(userFromStorage);
        console.log('✅ Utilisateur connecté:', {
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            hasToken: !!user.token,
            tokenLength: user.token ? user.token.length : 0
        });
        
        // Vérifier si le token est encore valide
        const tokenParts = user.token ? user.token.split('.') : [];
        if (tokenParts.length === 3) {
            try {
                const payload = JSON.parse(atob(tokenParts[1]));
                const now = Date.now() / 1000;
                console.log('🔐 Token info:', {
                    expires: new Date(payload.exp * 1000),
                    isExpired: payload.exp < now,
                    timeLeft: payload.exp - now,
                    userId: payload.id
                });
            } catch (e) {
                console.log('❌ Impossible de décoder le token');
            }
        }
    } catch (e) {
        console.log('❌ Erreur parsing user data:', e);
    }
} else {
    console.log('❌ Aucun utilisateur connecté');
}

// 2. Tester la connectivité backend
console.log('\n📡 2. Test connectivité backend:');
fetch('http://localhost:4000/api/')
    .then(response => response.json())
    .then(data => {
        console.log('✅ Backend accessible:', data);
    })
    .catch(error => {
        console.log('❌ Backend inaccessible:', error);
    });

// 3. Tester l'authentification
console.log('\n🔐 3. Test authentification backend:');
if (userFromStorage) {
    const user = JSON.parse(userFromStorage);
    if (user.token) {
        fetch('http://localhost:4000/api/brand', {
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        })
        .then(data => {
            console.log('✅ Authentification valide, brands récupérées:', data.length);
        })
        .catch(error => {
            console.log('❌ Problème d\'authentification:', error);
        });
    }
}

// 4. Vérifier les états Redux (si disponible)
console.log('\n🔄 4. États Redux:');
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.log('✅ Redux DevTools disponible');
} else {
    console.log('⚠️ Redux DevTools non disponible');
}

// 5. Vérifier les erreurs JavaScript
console.log('\n🐛 5. Surveillance des erreurs:');
window.addEventListener('error', (e) => {
    console.log('❌ Erreur JavaScript détectée:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
});

// 6. Vérifier les erreurs React (si disponible)
const originalConsoleError = console.error;
console.error = function(...args) {
    if (args[0] && args[0].includes && args[0].includes('Warning:')) {
        console.log('⚠️ Warning React:', args);
    } else {
        console.log('❌ Erreur console:', args);
    }
    originalConsoleError.apply(console, args);
};

console.log('\n🎯 Diagnostic terminé. Maintenant:');
console.log('1. Allez sur http://localhost:3001/admin/add-product');
console.log('2. Regardez les messages qui apparaissent ici');
console.log('3. Essayez de cliquer sur "Add Product" et observez les erreurs');

console.log('\n💡 Pour tester l\'upload:');
console.log('1. Assurez-vous d\'être connecté');
console.log('2. Remplissez le formulaire');
console.log('3. Ajoutez des images via drag & drop');
console.log('4. Cliquez sur Submit et observez la console');

export default null; // Pour éviter les erreurs de module