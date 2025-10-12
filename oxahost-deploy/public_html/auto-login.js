// Script pour connecter automatiquement l'utilisateur
// À exécuter dans la console du navigateur pour test rapide

console.log('🚀 CONNEXION AUTOMATIQUE POUR TEST RAPIDE');

const userData = {
    id: 6,
    firstname: "Client",
    lastname: "Test", 
    email: "test@example.com",
    mobile: "12345678",
    role: "user",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzU5MTUwODU4LCJleHAiOjE3NTkyMzcyNTh9.0IZi_F2zY60lUY_QrzlB7ZqEFwf5pZXFmKyIXHd1eX0"
};

// Sauvegarder dans localStorage
localStorage.setItem('customer', JSON.stringify(userData));
localStorage.setItem('accessToken', userData.token);

console.log('✅ Utilisateur connecté automatiquement !');
console.log('📧 Email:', userData.email);
console.log('🔑 Token sauvegardé');

// Recharger la page pour appliquer les changements
setTimeout(() => {
    console.log('🔄 Rechargement pour appliquer la connexion...');
    window.location.reload();
}, 1000);

// Fonction pour test rapide des boutons
window.testFastButtons = function() {
    console.log('🧪 TEST RAPIDE DES BOUTONS');
    
    // Chercher boutons panier
    const cartButtons = document.querySelectorAll('button[class*="cart"], button[class*="Cart"]');
    console.log('🛒 Boutons panier trouvés:', cartButtons.length);
    
    // Chercher boutons wishlist  
    const wishButtons = document.querySelectorAll('button[class*="wish"], button[class*="heart"]');
    console.log('❤️ Boutons wishlist trouvés:', wishButtons.length);
    
    if (cartButtons.length > 0) {
        console.log('✅ Premier bouton panier prêt à tester');
        cartButtons[0].style.border = '3px solid green';
        cartButtons[0].title = 'BOUTON PANIER TEST - CLIQUEZ !';
    }
    
    if (wishButtons.length > 0) {
        console.log('✅ Premier bouton wishlist prêt à tester');
        wishButtons[0].style.border = '3px solid red'; 
        wishButtons[0].title = 'BOUTON WISHLIST TEST - CLIQUEZ !';
    }
};

// Auto-exécution du test après rechargement
if (localStorage.getItem('customer')) {
    setTimeout(() => {
        window.testFastButtons();
    }, 3000);
}