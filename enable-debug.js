// Script pour activer le mode debug
const fs = require('fs').promises;
const path = require('path');

async function enableDebugMode() {
    const clientPath = 'C:\\xampp\\htdocs\\sanny\\san\\ecomerce_sanny\\Client\\src\\components';
    const originalFile = path.join(clientPath, 'ProductCard.js');
    const debugFile = path.join(clientPath, 'ProductCard-debug.js');
    const backupFile = path.join(clientPath, 'ProductCard-backup.js');
    
    try {
        console.log('🔄 Activation du mode debug...');
        
        // Sauvegarder l'original
        const originalContent = await fs.readFile(originalFile, 'utf8');
        await fs.writeFile(backupFile, originalContent);
        console.log('✅ Sauvegarde créée: ProductCard-backup.js');
        
        // Copier le debug
        const debugContent = await fs.readFile(debugFile, 'utf8');
        await fs.writeFile(originalFile, debugContent);
        console.log('✅ Mode debug activé !');
        
        console.log('\n📋 Instructions:');
        console.log('1. Allez sur http://localhost:3002');
        console.log('2. Connectez-vous avec zoghlamimustapha16@gmail.com');
        console.log('3. Ouvrez les DevTools (F12)');
        console.log('4. Regardez la console pour les logs détaillés');
        console.log('5. Testez les boutons (panier, favoris, voir)');
        console.log('\n🔧 Pour restaurer l\'original :');
        console.log('node disable-debug.js');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

enableDebugMode();