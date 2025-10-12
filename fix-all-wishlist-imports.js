const fs = require('fs').promises;
const path = require('path');

const pages = [
    'Bebe.js',
    'Electro.js', 
    'Informatique.js',
    'Jardin.js',
    'Sante.js',
    'Other.js'
];

async function fixWishlistImports() {
    console.log('🔧 Correction des imports wishlist dans toutes les pages...');
    
    for (const pageName of pages) {
        const pagePath = path.join(__dirname, 'Client', 'src', 'pages', pageName);
        
        try {
            // Lire le fichier
            let content = await fs.readFile(pagePath, 'utf8');
            console.log(`📄 Traitement de ${pageName}...`);
            
            // 1. Ajouter l'import de toggleProductWishlist si pas présent
            if (!content.includes('toggleProductWishlist')) {
                content = content.replace(
                    /import { addProdToCart, getUserCart } from ['"]\.\.\/features\/user\/userSlice['"];/,
                    "import { addProdToCart, getUserCart, toggleProductWishlist } from '../features/user/userSlice';"
                );
                console.log(`  ✅ Import toggleProductWishlist ajouté dans ${pageName}`);
            }
            
            // 2. Remplacer addToWishlist par toggleProductWishlist dans la fonction
            if (content.includes('dispatch(addToWishlist(id))')) {
                content = content.replace(
                    /dispatch\(addToWishlist\(id\)\);/g,
                    'dispatch(toggleProductWishlist(id));'
                );
                console.log(`  ✅ Fonction addToWish corrigée dans ${pageName}`);
            }
            
            // Écrire le fichier modifié
            await fs.writeFile(pagePath, content, 'utf8');
            console.log(`  ✨ ${pageName} corrigé avec succès`);
            
        } catch (error) {
            console.error(`  ❌ Erreur lors du traitement de ${pageName}:`, error.message);
        }
    }
    
    console.log('🎉 Correction terminée pour toutes les pages!');
}

fixWishlistImports().catch(console.error);