// Script pour désactiver le design ultra et restaurer la version précédente
const fs = require('fs').promises;
const path = require('path');

async function disableUltraProductPage() {
    const clientPath = 'C:\\xampp\\htdocs\\sanny\\san\\ecomerce_sanny\\Client\\src';
    const originalFile = path.join(clientPath, 'pages', 'SingleProduct.js');
    const backupFile = path.join(clientPath, 'pages', 'SingleProduct-ultra-backup.js');
    
    try {
        console.log('🔄 Désactivation du design ULTRA...');
        
        // Vérifier que la sauvegarde existe
        try {
            await fs.access(backupFile);
        } catch {
            console.log('❌ Aucune sauvegarde ULTRA trouvée !');
            console.log('💡 Utilisez plutôt: node enable-modern-product.js');
            return;
        }
        
        // Restaurer la version précédente
        const backupContent = await fs.readFile(backupFile, 'utf8');
        await fs.writeFile(originalFile, backupContent);
        
        // Supprimer la sauvegarde
        await fs.unlink(backupFile);
        
        console.log('✅ Version précédente restaurée !');
        console.log('\nℹ️ Note: Les styles ultra restent dans App.css');
        console.log('Ils n\'affecteront pas la version restaurée.');
        
        console.log('\n🔄 Options disponibles :');
        console.log('• node enable-ultra-product.js - Réactiver ULTRA');
        console.log('• node enable-modern-product.js - Activer version moderne');
        console.log('• node disable-modern-product.js - Restaurer version basique');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

disableUltraProductPage();