// Script pour désactiver le design moderne et restaurer l'original
const fs = require('fs').promises;
const path = require('path');

async function disableModernProductPage() {
    const clientPath = 'C:\\xampp\\htdocs\\sanny\\san\\ecomerce_sanny\\Client\\src';
    const originalFile = path.join(clientPath, 'pages', 'SingleProduct.js');
    const backupFile = path.join(clientPath, 'pages', 'SingleProduct-backup.js');
    
    try {
        console.log('🔄 Désactivation du design moderne...');
        
        // Vérifier que la sauvegarde existe
        try {
            await fs.access(backupFile);
        } catch {
            console.log('❌ Aucune sauvegarde trouvée !');
            return;
        }
        
        // Restaurer l'original
        const backupContent = await fs.readFile(backupFile, 'utf8');
        await fs.writeFile(originalFile, backupContent);
        
        // Supprimer la sauvegarde
        await fs.unlink(backupFile);
        
        console.log('✅ Design original restauré !');
        console.log('\nℹ️ Note: Les styles modernes restent dans App.css');
        console.log('Ils n\'affecteront pas l\'ancien design.');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

disableModernProductPage();