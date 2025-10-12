// Script pour activer le nouveau design de page produit
const fs = require('fs').promises;
const path = require('path');

async function enableModernProductPage() {
    const clientPath = 'C:\\xampp\\htdocs\\sanny\\san\\ecomerce_sanny\\Client\\src';
    const originalFile = path.join(clientPath, 'pages', 'SingleProduct.js');
    const modernFile = path.join(clientPath, 'pages', 'SingleProduct-Modern.js');
    const backupFile = path.join(clientPath, 'pages', 'SingleProduct-backup.js');
    
    // Styles
    const appCssFile = path.join(clientPath, 'App.css');
    const modernCssFile = path.join(clientPath, 'styles', 'SingleProduct-Modern.css');
    
    try {
        console.log('🎨 Activation du nouveau design de page produit...');
        
        // Sauvegarder l'original
        const originalContent = await fs.readFile(originalFile, 'utf8');
        await fs.writeFile(backupFile, originalContent);
        console.log('✅ Sauvegarde créée: SingleProduct-backup.js');
        
        // Remplacer par la version moderne
        const modernContent = await fs.readFile(modernFile, 'utf8');
        await fs.writeFile(originalFile, modernContent);
        console.log('✅ Page produit moderne activée !');
        
        // Ajouter les styles modernes au CSS principal
        try {
            const modernCss = await fs.readFile(modernCssFile, 'utf8');
            const appCss = await fs.readFile(appCssFile, 'utf8');
            
            // Vérifier si les styles ne sont pas déjà présents
            if (!appCss.includes('SINGLE PRODUCT MODERN')) {
                const updatedCss = appCss + '\n\n' + modernCss;
                await fs.writeFile(appCssFile, updatedCss);
                console.log('✅ Styles modernes ajoutés à App.css !');
            } else {
                console.log('ℹ️ Styles modernes déjà présents dans App.css');
            }
        } catch (cssError) {
            console.log('⚠️ Attention: Ajoutez manuellement les styles de SingleProduct-Modern.css à votre App.css');
        }
        
        console.log('\n🎉 Design moderne activé avec succès !');
        console.log('\n📋 Nouvelles fonctionnalités:');
        console.log('• 🖼️ Galerie d\'images avec zoom et thumbnails');
        console.log('• 🏷️ Badges produit (Nouveau, Spécial)');
        console.log('• ❤️ Boutons favoris avec animations');
        console.log('• 📊 Système d\'onglets (Description, Spécifications, Avis, Livraison)');
        console.log('• 📱 Design responsive moderne');
        console.log('• 🎨 Animations et transitions fluides');
        console.log('• 🚚 Informations de livraison détaillées');
        console.log('• 📤 Boutons de partage social');
        console.log('• ⭐ Interface d\'avis améliorée');
        console.log('\n🔧 Pour restaurer l\'ancien design :');
        console.log('node disable-modern-product.js');
        
        console.log('\n🌐 Pour tester :');
        console.log('1. Redémarrez votre serveur React (npm start)');
        console.log('2. Allez sur http://localhost:3002');
        console.log('3. Cliquez sur un produit pour voir le nouveau design');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

enableModernProductPage();