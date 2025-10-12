const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');

// Liste des fichiers de modèles à corriger
const modelFiles = [
    'Product.js', 'ProductRating.js', 'Category.js', 'Brand.js', 'Color.js',
    'Coupon.js', 'Cart.js', 'Wishlist.js', 'Order.js', 'OrderItem.js',
    'BlogCategory.js', 'Blog.js', 'BlogLike.js', 'Enquiry.js', 'Payment.js'
];

console.log('🔧 Correction de la configuration de base de données dans les modèles...\n');

modelFiles.forEach(fileName => {
    const filePath = path.join(modelsDir, fileName);
    
    if (fs.existsSync(filePath)) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Remplacer l'ancienne configuration par la nouvelle
            const oldConfig = "require('../config/database')";
            const newConfig = "require('../config/database-sqlite')";
            
            if (content.includes(oldConfig)) {
                content = content.replace(oldConfig, newConfig);
                fs.writeFileSync(filePath, content);
                console.log(`✅ ${fileName} - Configuration corrigée`);
            } else {
                console.log(`ℹ️ ${fileName} - Déjà à jour`);
            }
        } catch (error) {
            console.log(`❌ ${fileName} - Erreur: ${error.message}`);
        }
    } else {
        console.log(`⚠️ ${fileName} - Fichier non trouvé`);
    }
});

console.log('\n🎉 Correction terminée ! Redémarrez le backend pour appliquer les changements.');