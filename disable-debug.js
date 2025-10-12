// Script pour désactiver le mode debug
const fs = require('fs').promises;
const path = require('path');

async function disableDebugMode() {
    const clientPath = 'C:\\xampp\\htdocs\\sanny\\san\\ecomerce_sanny\\Client\\src\\components';
    const originalFile = path.join(clientPath, 'ProductCard.js');
    const backupFile = path.join(clientPath, 'ProductCard-backup.js');
    
    try {
        console.log('🔄 Désactivation du mode debug...');
        
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
        
        console.log('✅ Mode debug désactivé, original restauré !');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

disableDebugMode();