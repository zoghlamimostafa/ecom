const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC DU MENU UTILISATEUR');
console.log('=====================================\n');

// Vérifier l'état de l'authentification dans le store Redux
console.log('📋 VÉRIFICATIONS DES COMPOSANTS:');

// 1. Vérifier Header.js
const headerPath = path.join(__dirname, 'Client/src/components/Header.js');
if (fs.existsSync(headerPath)) {
    const headerContent = fs.readFileSync(headerPath, 'utf8');
    
    // Vérifications critiques
    const hasUserMenu = headerContent.includes('user-menu');
    const hasDropdown = headerContent.includes('user-dropdown');
    const hasLogout = headerContent.includes('handleLogout');
    const hasUserState = headerContent.includes('authState?.user');
    const hasNavigation = headerContent.includes('navigate');
    
    console.log(`✅ Header.js - Menu utilisateur: ${hasUserMenu ? 'OUI' : 'NON'}`);
    console.log(`✅ Header.js - Dropdown: ${hasDropdown ? 'OUI' : 'NON'}`);
    console.log(`✅ Header.js - Fonction logout: ${hasLogout ? 'OUI' : 'NON'}`);
    console.log(`✅ Header.js - État utilisateur: ${hasUserState ? 'OUI' : 'NON'}`);
    console.log(`✅ Header.js - Navigation: ${hasNavigation ? 'OUI' : 'NON'}`);
} else {
    console.log('❌ Header.js - Fichier manquant');
}

// 2. Vérifier UserAvatar.js
const avatarPath = path.join(__dirname, 'Client/src/components/UserAvatar.js');
if (fs.existsSync(avatarPath)) {
    console.log('✅ UserAvatar.js - Composant trouvé');
} else {
    console.log('❌ UserAvatar.js - Composant manquant');
}

// 3. Vérifier les styles CSS
const cssPath = path.join(__dirname, 'Client/src/App.css');
if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const hasUserMenuStyles = cssContent.includes('.user-menu');
    const hasDropdownStyles = cssContent.includes('.user-dropdown');
    const hasDropdownLinkStyles = cssContent.includes('.dropdown-link');
    const hasCorrectZIndex = cssContent.includes('z-index: 10001');
    const hasCorrectOpacity = cssContent.includes('opacity: 1');
    
    console.log(`✅ CSS - Styles user-menu: ${hasUserMenuStyles ? 'OUI' : 'NON'}`);
    console.log(`✅ CSS - Styles dropdown: ${hasDropdownStyles ? 'OUI' : 'NON'}`);
    console.log(`✅ CSS - Styles liens: ${hasDropdownLinkStyles ? 'OUI' : 'NON'}`);
    console.log(`✅ CSS - Z-index élevé: ${hasCorrectZIndex ? 'OUI' : 'NON'}`);
    console.log(`✅ CSS - Opacity 1: ${hasCorrectOpacity ? 'OUI' : 'NON'}`);
} else {
    console.log('❌ App.css - Fichier manquant');
}

// 4. Vérifier les routes
const appPath = path.join(__dirname, 'Client/src/App.js');
if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    const hasProfileRoute = appContent.includes('/my-Profile');
    const hasOrdersRoute = appContent.includes('/my-orders');
    const hasProtectedProfile = appContent.includes('<PrivateRoutes><Profile');
    
    console.log(`✅ App.js - Route profil: ${hasProfileRoute ? 'OUI' : 'NON'}`);
    console.log(`✅ App.js - Route commandes: ${hasOrdersRoute ? 'OUI' : 'NON'}`);
    console.log(`✅ App.js - Profil protégé: ${hasProtectedProfile ? 'OUI' : 'NON'}`);
} else {
    console.log('❌ App.js - Fichier manquant');
}

// 5. Vérifier la page de profil
const profilePath = path.join(__dirname, 'Client/src/pages/Profile.js');
if (fs.existsSync(profilePath)) {
    console.log('✅ Profile.js - Page trouvée');
} else {
    console.log('❌ Profile.js - Page manquante');
}

console.log('\n🎯 SOLUTIONS RECOMMANDÉES:');
console.log('1. Vérifier que l\'utilisateur est bien connecté');
console.log('2. Tester avec la page: http://localhost:3000/test-user-menu.html');
console.log('3. Vérifier la console du navigateur pour les erreurs JavaScript');
console.log('4. S\'assurer que le Redux store contient authState.user');

console.log('\n🔧 COMMANDES DE TEST:');
console.log('- Ouvrir DevTools (F12) dans le navigateur');
console.log('- Vérifier l\'onglet Console pour les erreurs');
console.log('- Vérifier l\'onglet Elements pour voir si le dropdown est présent');
console.log('- Tester les clics sur l\'avatar utilisateur');

console.log('\n🚀 DIAGNOSTIC TERMINÉ !');