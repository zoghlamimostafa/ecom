// Script d'initialisation du système multilingue
const path = require('path');
const MultilingualSystem = require('./backend/middlewares/multilingual');

async function initializeTranslationSystem() {
    console.log('🌐 Initialisation du système de traduction...\n');
    
    try {
        // Créer une instance du système multilingue
        const multilingual = new MultilingualSystem();
        
        // Initialiser les traductions par défaut
        multilingual.initializeDefaultTranslations();
        
        // Afficher les statistiques
        const stats = multilingual.getTranslationStats();
        
        console.log('\n📊 Statistiques de traduction:');
        console.log('=====================================');
        Object.entries(stats).forEach(([lang, data]) => {
            const langName = {
                'fr': 'Français',
                'en': 'English',
                'ar': 'العربية'
            }[lang];
            
            console.log(`${langName} (${lang}): ${data.totalKeys} clés, ${data.completeness}% complet`);
        });
        
        console.log('\n✅ Système de traduction initialisé avec succès!');
        
        // Instructions d'utilisation
        console.log('\n📋 Instructions d\'utilisation:');
        console.log('=====================================');
        console.log('1. Dans Express.js:');
        console.log('   const multilingual = new MultilingualSystem();');
        console.log('   app.use(multilingual.middleware());');
        console.log('   multilingual.setupAPI(app);');
        console.log('');
        console.log('2. Dans les templates (EJS/Handlebars):');
        console.log('   <%= t("nav.home") %> ou {{{ t "nav.home" }}}');
        console.log('');
        console.log('3. Dans les routes:');
        console.log('   const message = req.t("message.success");');
        console.log('');
        console.log('4. Changer de langue:');
        console.log('   POST /api/language {"language": "en"}');
        console.log('   GET /products?lang=ar');
        console.log('');
        console.log('5. Directions RTL pour l\'arabe:');
        console.log('   Ajoutez dir="rtl" pour les pages en arabe');
        
        return multilingual;
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        throw error;
    }
}

// Exécuter si ce fichier est lancé directement
if (require.main === module) {
    initializeTranslationSystem()
        .then(() => {
            console.log('\n🎉 Prêt à utiliser le système multilingue!');
        })
        .catch(error => {
            console.error('💥 Échec de l\'initialisation:', error);
            process.exit(1);
        });
}

module.exports = { initializeTranslationSystem, MultilingualSystem };