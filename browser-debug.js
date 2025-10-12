// Script pour débugger et résoudre les problèmes de localStorage et d'authentification

// 1. Nettoyer le localStorage
console.log('🧹 Nettoyage du localStorage...');
localStorage.clear();
sessionStorage.clear();

// 2. Créer un token d'authentification valide pour les tests
const mockAdminUser = {
    _id: "admin123",
    firstname: "Admin",
    lastname: "Sanny", 
    email: "admin@sanny.com",
    role: "admin",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluMTIzIiwiaWF0IjoxNjkzMjM0NTY3LCJleHAiOjE2OTU4MjY1Njd9.mocktoken"
};

// 3. Sauvegarder l'utilisateur dans localStorage
localStorage.setItem('user', JSON.stringify(mockAdminUser));

console.log('✅ Utilisateur admin configuré dans localStorage');
console.log('👤 Utilisateur:', mockAdminUser);

// 4. Test de la configuration axios
console.log('🔧 Test de la configuration Axios...');
console.log('Base URL:', 'http://localhost:4000/api/');

// 5. Instructions pour l'utilisateur
console.log(`
🎯 Instructions pour résoudre l'erreur:

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet Console
3. Copiez et collez ce script complet
4. Appuyez sur Entrée pour l'exécuter
5. Actualisez la page (F5)

📝 Si le problème persiste:
- Vérifiez l'onglet Network dans les outils de développement
- Regardez les erreurs de connexion
- Assurez-vous que le backend fonctionne sur http://localhost:4000

🔑 Informations de connexion valides:
Email: admin@sanny.com
Mot de passe: admin123
`);

// 6. Test de connectivité depuis le navigateur
async function testFromBrowser() {
    try {
        const response = await fetch('http://localhost:4000/api/product/');
        const data = await response.json();
        console.log('✅ Backend accessible depuis le navigateur:', data.length, 'produits');
        return true;
    } catch (error) {
        console.error('❌ Backend non accessible depuis le navigateur:', error);
        return false;
    }
}

// Exécuter le test
testFromBrowser();
