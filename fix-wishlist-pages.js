// Script pour corriger automatiquement les fonctions wishlist dans toutes les pages
// Ce script standardise l'utilisation de toggleProductWishlist de userSlice

const fs = require('fs');
const path = require('path');

// Fonction utilitaire pour corriger une page
function fixWishlistInPage(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        console.log(`🔧 Traitement de ${path.basename(filePath)}...`);
        
        // 1. Vérifier si la page importe addToWishlist de productSlice
        if (content.includes('addToWishlist') && content.includes("features/products/productSlice")) {
            console.log('  ✅ Importation addToWishlist détectée');
            
            // Remplacer l'import
            content = content.replace(
                /import.*{([^}]*),?\s*addToWishlist([^}]*)}.*from.*['"]\.\.\/features\/products\/productSlice['"];?/,
                (match, before, after) => {
                    const beforeClean = before ? before.trim() : '';
                    const afterClean = after ? after.trim() : '';
                    const imports = [beforeClean, afterClean].filter(Boolean).join(', ');
                    return imports ? `import { ${imports} } from '../features/products/productSlice';` : '';
                }
            );
            
            // Ajouter l'import de toggleProductWishlist si pas déjà présent
            if (!content.includes('toggleProductWishlist')) {
                if (content.includes("from '../features/user/userSlice'")) {
                    content = content.replace(
                        /import\s*{([^}]*?)}\s*from\s*['"]\.\.\/features\/user\/userSlice['"];?/,
                        (match, imports) => {
                            const importList = imports.split(',').map(i => i.trim()).filter(Boolean);
                            if (!importList.includes('toggleProductWishlist')) {
                                importList.push('toggleProductWishlist');
                            }
                            return `import { ${importList.join(', ')} } from '../features/user/userSlice';`;
                        }
                    );
                } else {
                    // Ajouter une nouvelle ligne d'import
                    const lastImportMatch = content.match(/import.*from.*['"][^'"]*['"];?\n/g);
                    if (lastImportMatch) {
                        const lastImport = lastImportMatch[lastImportMatch.length - 1];
                        const insertAfter = content.indexOf(lastImport) + lastImport.length;
                        content = content.slice(0, insertAfter) + 
                                 "import { toggleProductWishlist } from '../features/user/userSlice';\n" +
                                 content.slice(insertAfter);
                    }
                }
            }
            
            modified = true;
        }
        
        // 2. Remplacer la fonction addToWish pour utiliser toggleProductWishlist
        if (content.includes('const addToWish = (id) => {')) {
            console.log('  ✅ Fonction addToWish détectée');
            
            content = content.replace(
                /const addToWish = \(id\) => \{\s*dispatch\(addToWishlist\(id\)\);\s*\};?/,
                `const addToWish = async (id) => {
        // Vérifier l'authentification
        if (!authState) {
            toast.error("Veuillez vous connecter pour ajouter à la wishlist");
            navigate('/login');
            return;
        }

        try {
            await dispatch(toggleProductWishlist(id)).unwrap();
            toast.success("Wishlist mise à jour avec succès!");
        } catch (error) {
            console.error("Erreur wishlist:", error);
            toast.error(error.message || "Erreur lors de la modification de la wishlist");
        }
    };`
            );
            
            modified = true;
        }
        
        // 3. Ajouter l'import de toast si manquant
        if (modified && !content.includes("import { toast } from 'react-toastify'")) {
            const lastImportMatch = content.match(/import.*from.*['"][^'"]*['"];?\n/g);
            if (lastImportMatch) {
                const lastImport = lastImportMatch[lastImportMatch.length - 1];
                const insertAfter = content.indexOf(lastImport) + lastImport.length;
                content = content.slice(0, insertAfter) + 
                         "import { toast } from 'react-toastify';\n" +
                         content.slice(insertAfter);
            }
        }
        
        // 4. Sauvegarder si modifié
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('  ✅ Page corrigée avec succès!');
            return true;
        } else {
            console.log('  ⏭️ Aucune modification nécessaire');
            return false;
        }
        
    } catch (error) {
        console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
        return false;
    }
}

// Liste des pages à traiter
const pagesToFix = [
    'Animaux.js', 'Auto.js', 'Bebe.js', 'Electro.js', 'Femme.js', 
    'Homme.js', 'Informatique.js', 'Jardin.js', 'Jeux.js', 'Maison.js', 
    'Other.js', 'Sante.js', 'Sport.js', 'Telephone.js'
];

const pagesDir = 'C:\\xampp\\htdocs\\sanny\\san\\ecomerce_sanny\\Client\\src\\pages';

console.log('🚀 Démarrage de la correction des pages...\n');

let totalFixed = 0;
pagesToFix.forEach(pageFile => {
    const filePath = path.join(pagesDir, pageFile);
    if (fs.existsSync(filePath)) {
        if (fixWishlistInPage(filePath)) {
            totalFixed++;
        }
    } else {
        console.log(`⚠️ Fichier non trouvé: ${pageFile}`);
    }
    console.log('');
});

console.log(`✅ Correction terminée! ${totalFixed} pages ont été modifiées.`);