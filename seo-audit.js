// Script d'audit SEO pour toutes les pages
const fs = require('fs');
const path = require('path');

const PAGES_DIR = './Client/src/pages';
const IMPORTANT_PAGES = [
    'Home.js', 'About.js', 'Contact.js', 'OurStore.js', 
    'Cart.js', 'Checkout.js', 'Login.js', 'Signup.js',
    'SingleProduct.js', 'CategoryPage.js', 'Blogs.js',
    'PrivacyPolicy.js', 'RefundPolicy.js', 'TermAndConditions.js'
];

function analyzePageSEO(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        const hasSEOEnhancer = content.includes('SEOEnhancer') || content.includes('import SEOEnhancer');
        const hasMeta = content.includes('Meta') || content.includes('import Meta');
        const hasHelmet = content.includes('Helmet') || content.includes('react-helmet');
        
        const seoScore = hasSEOEnhancer ? 100 : (hasMeta ? 60 : (hasHelmet ? 40 : 0));
        
        return {
            file: fileName,
            hasSEOEnhancer,
            hasMeta,
            hasHelmet,
            seoScore,
            status: seoScore >= 100 ? '✅ Parfait' : seoScore >= 60 ? '⚠️ Basique' : '❌ Manque SEO'
        };
    } catch (error) {
        return {
            file: path.basename(filePath),
            error: error.message,
            status: '❌ Erreur'
        };
    }
}

function main() {
    console.log('\n🔍 AUDIT SEO - SANNY STORE\n');
    console.log('='.repeat(60));
    
    const results = [];
    
    // Analyser les pages importantes
    IMPORTANT_PAGES.forEach(pageFile => {
        const filePath = path.join(PAGES_DIR, pageFile);
        if (fs.existsSync(filePath)) {
            const result = analyzePageSEO(filePath);
            results.push(result);
        } else {
            results.push({
                file: pageFile,
                status: '❓ Fichier non trouvé'
            });
        }
    });
    
    // Afficher les résultats
    results.forEach(result => {
        if (result.error) {
            console.log(`${result.status} ${result.file} - ${result.error}`);
        } else {
            console.log(`${result.status} ${result.file} (Score: ${result.seoScore || 'N/A'}/100)`);
        }
    });
    
    // Statistiques
    const validResults = results.filter(r => !r.error && r.seoScore !== undefined);
    const perfectPages = validResults.filter(r => r.seoScore === 100).length;
    const basicPages = validResults.filter(r => r.seoScore >= 60 && r.seoScore < 100).length;
    const poorPages = validResults.filter(r => r.seoScore < 60).length;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ:');
    console.log(`✅ Pages parfaites (SEOEnhancer): ${perfectPages}`);
    console.log(`⚠️ Pages basiques (Meta seulement): ${basicPages}`);
    console.log(`❌ Pages sans SEO: ${poorPages}`);
    console.log(`📈 Score moyen: ${Math.round(validResults.reduce((sum, r) => sum + r.seoScore, 0) / validResults.length)}%`);
    
    // Recommandations
    console.log('\n🎯 RECOMMANDATIONS:');
    const needImprovement = results.filter(r => r.seoScore < 100 && !r.error);
    if (needImprovement.length > 0) {
        console.log('Pages nécessitant SEOEnhancer:');
        needImprovement.forEach(page => {
            console.log(`  - ${page.file}`);
        });
    }
}

if (require.main === module) {
    main();
}

module.exports = { analyzePageSEO };