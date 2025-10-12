const fs = require('fs');
const path = require('path');

// Chemins vers les fichiers CSS
const appCssPath = path.join(__dirname, 'Client', 'src', 'App.css');
const styleCssPath = path.join(__dirname, 'Client', 'src', 'style', 'style.css');

console.log('🎨 Optimisation des font-weight pour EB Garamond');

function optimizeFontWeights(filePath, fileName) {
    console.log(`\n📁 Traitement de ${fileName}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Optimisations spécifiques pour EB Garamond
    const optimizations = [
        // Remplacer font-weight: 700 par 600 pour les titres principaux
        {
            from: /font-weight: 700;(\s*.*(?:font-family: 'EB Garamond', serif|font-family: var\(--font-main\)))/g,
            to: 'font-weight: 600;$1',
            description: 'Titres principaux: 700 → 600'
        },
        // Optimiser les sous-titres et éléments moyens
        {
            from: /font-weight: 600;(\s*.*(?:font-size: [0-9.]+rem|font-size: [0-9]+px))/g,
            to: 'font-weight: 500;$1',
            description: 'Sous-titres: 600 → 500'
        },
        // Texte normal optimisé
        {
            from: /font-weight: 400;(\s*.*font-family: 'EB Garamond', serif)/g,
            to: 'font-weight: 400;$1',
            description: 'Texte normal maintenu à 400'
        }
    ];
    
    let changes = 0;
    
    optimizations.forEach(opt => {
        const before = content;
        content = content.replace(opt.from, opt.to);
        const matches = (before.match(opt.from) || []).length;
        if (matches > 0) {
            console.log(`  ✅ ${opt.description}: ${matches} modifications`);
            changes += matches;
        }
    });
    
    // Ajustements spécifiques pour les éléments de header et navigation
    content = content.replace(
        /\.header-nav \.nav-link \{([^}]*font-weight: )500;/g,
        '.header-nav .nav-link {$1400;'
    );
    
    // Ajustements pour les boutons (un peu plus léger)
    content = content.replace(
        /\.btn \{([^}]*font-weight: )500;/g,
        '.btn {$1600;'
    );
    
    // Ajustements pour le hero title (plus lisible)
    content = content.replace(
        /\.hero-content h1 \{([^}]*font-weight: )700;/g,
        '.hero-content h1 {$1600;'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  📊 Total des changements: ${changes}`);
    
    return changes;
}

// Traiter les fichiers
const totalChanges = optimizeFontWeights(appCssPath, 'App.css') + 
                    optimizeFontWeights(styleCssPath, 'style.css');

console.log(`\n🎉 Optimisation terminée!`);
console.log(`📈 Total des optimisations: ${totalChanges}`);
console.log(`\n📋 Recommandations appliquées:`);
console.log(`   • Titres principaux: font-weight: 600 (au lieu de 700)`);
console.log(`   • Sous-titres: font-weight: 500`);
console.log(`   • Texte normal: font-weight: 400`);
console.log(`   • Navigation: font-weight: 400 (plus léger)`);
console.log(`   • Boutons: font-weight: 600 (emphase)`);