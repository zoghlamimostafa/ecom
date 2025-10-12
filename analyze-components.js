const fs = require('fs');
const path = require('path');

console.log('🔧 ANALYSE ET AMÉLIORATION DES COMPOSANTS');
console.log('='
.repeat(50));

// Fonction pour analyser un fichier React
function analyzeReactFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        console.log(`\n📁 Analyse de ${fileName}:`);
        
        // Vérifications basiques
        const checks = {
            hasUseState: content.includes('useState'),
            hasUseEffect: content.includes('useEffect'),
            hasErrorHandling: content.includes('try') || content.includes('catch'),
            hasLoading: content.includes('loading') || content.includes('Loading'),
            hasValidation: content.includes('validation') || content.includes('validate'),
            hasRedux: content.includes('useDispatch') || content.includes('useSelector'),
            hasFormik: content.includes('Formik') || content.includes('useFormik'),
            hasAntd: content.includes('antd') || content.includes('ant-'),
            hasCSS: content.includes('className') || content.includes('css'),
            hasAccessibility: content.includes('aria-') || content.includes('role='),
            hasComments: content.includes('//') || content.includes('/*'),
            hasTypeScript: content.includes('interface') || content.includes('type ')
        };
        
        Object.entries(checks).forEach(([check, result]) => {
            const icon = result ? '✅' : '❌';
            const description = {
                hasUseState: 'État local avec useState',
                hasUseEffect: 'Effets avec useEffect',
                hasErrorHandling: 'Gestion d\'erreurs',
                hasLoading: 'États de chargement',
                hasValidation: 'Validation des données',
                hasRedux: 'Intégration Redux',
                hasFormik: 'Gestion de formulaires Formik',
                hasAntd: 'Composants Ant Design',
                hasCSS: 'Styles CSS/Classes',
                hasAccessibility: 'Accessibilité',
                hasComments: 'Documentation/Commentaires',
                hasTypeScript: 'Types TypeScript'
            };
            console.log(`  ${icon} ${description[check]}`);
        });
        
        // Analyse de la complexité
        const lines = content.split('\n').length;
        const functions = (content.match(/function|const.*=.*=>/g) || []).length;
        const hooks = (content.match(/use[A-Z][a-zA-Z]*/g) || []).length;
        
        console.log(`\n📊 Métriques:`);
        console.log(`  📏 Lignes de code: ${lines}`);
        console.log(`  🔧 Fonctions: ${functions}`);
        console.log(`  🪝 Hooks React: ${hooks}`);
        
        // Suggestions d'amélioration
        const suggestions = [];
        
        if (!checks.hasErrorHandling) {
            suggestions.push('Ajouter une gestion d\'erreurs avec try/catch');
        }
        if (!checks.hasLoading) {
            suggestions.push('Ajouter des états de chargement');
        }
        if (!checks.hasAccessibility) {
            suggestions.push('Améliorer l\'accessibilité avec aria-labels');
        }
        if (lines > 200) {
            suggestions.push('Considérer diviser en composants plus petits');
        }
        if (!checks.hasComments && lines > 50) {
            suggestions.push('Ajouter de la documentation');
        }
        
        if (suggestions.length > 0) {
            console.log(`\n💡 Suggestions d'amélioration:`);
            suggestions.forEach(suggestion => {
                console.log(`  • ${suggestion}`);
            });
        } else {
            console.log(`\n🎉 Composant bien structuré !`);
        }
        
        return {
            fileName,
            lines,
            functions,
            hooks,
            checks,
            suggestions
        };
        
    } catch (error) {
        console.log(`❌ Erreur lors de l'analyse de ${filePath}: ${error.message}`);
        return null;
    }
}

// Fichiers critiques à analyser
const criticalFiles = [
    'admin-app/src/pages/Login.js',
    'admin-app/src/pages/Addproduct.js',
    'admin-app/src/pages/Dashbord.js',
    'admin-app/src/pages/Orders.js',
    'admin-app/src/pages/Productlist.js',
    'admin-app/src/components/MainLayout.js'
];

console.log('🎯 Analyse des composants critiques...\n');

const results = [];
criticalFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        const result = analyzeReactFile(fullPath);
        if (result) {
            results.push(result);
        }
    } else {
        console.log(`⚠️ Fichier non trouvé: ${file}`);
    }
});

// Résumé global
console.log('\n' + '='.repeat(50));
console.log('📈 RÉSUMÉ GLOBAL');
console.log('='.repeat(50));

const totalLines = results.reduce((sum, r) => sum + r.lines, 0);
const totalFunctions = results.reduce((sum, r) => sum + r.functions, 0);
const totalHooks = results.reduce((sum, r) => sum + r.hooks, 0);

console.log(`📊 Statistiques globales:`);
console.log(`  📏 Total lignes: ${totalLines}`);
console.log(`  🔧 Total fonctions: ${totalFunctions}`);
console.log(`  🪝 Total hooks: ${totalHooks}`);

// Composants nécessitant le plus d'attention
const needsAttention = results
    .filter(r => r.suggestions.length > 2)
    .sort((a, b) => b.suggestions.length - a.suggestions.length);

if (needsAttention.length > 0) {
    console.log(`\n🚨 Composants nécessitant le plus d'attention:`);
    needsAttention.forEach(comp => {
        console.log(`  • ${comp.fileName} (${comp.suggestions.length} suggestions)`);
    });
}

// Recommandations générales
console.log(`\n🎯 RECOMMANDATIONS GÉNÉRALES:`);
console.log(`  1. Implémenter un système de logging centralisé`);
console.log(`  2. Ajouter des tests unitaires pour chaque composant`);
console.log(`  3. Standardiser la gestion d'erreurs`);
console.log(`  4. Optimiser les performances avec React.memo`);
console.log(`  5. Ajouter un système de cache pour les données`);
console.log(`  6. Implémenter une stratégie de lazy loading`);
console.log(`  7. Standardiser les styles avec des design tokens`);
console.log(`  8. Ajouter une documentation complète`);

console.log('\n✅ Analyse terminée !');
