const fs = require('fs');
const path = require('path');

// Chemin vers le fichier CSS
const cssPath = path.join(__dirname, 'Client', 'src', 'App.css');

// Lire le contenu du fichier
let cssContent = fs.readFileSync(cssPath, 'utf8');

console.log('🎨 Optimisation finale du design avec Montserrat + Roboto...');

// Corrections spécifiques pour assurer Montserrat sur tous les titres
const titleCorrections = [
  // Assurer Montserrat pour tous les types de titres
  { 
    from: /(\.product-title\s*{[^}]*font-family:\s*)var\(--font-body\)/g, 
    to: '$1var(--font-headings)' 
  },
  { 
    from: /(\.section-title\s*{[^}]*font-family:\s*)var\(--font-body\)/g, 
    to: '$1var(--font-headings)' 
  },
  { 
    from: /(\.card-title\s*{[^}]*font-family:\s*)var\(--font-body\)/g, 
    to: '$1var(--font-headings)' 
  },
  { 
    from: /(\.page-title\s*{[^}]*font-family:\s*)var\(--font-body\)/g, 
    to: '$1var(--font-headings)' 
  },
  { 
    from: /(\.modal-title\s*{[^}]*font-family:\s*)var\(--font-body\)/g, 
    to: '$1var(--font-headings)' 
  },
  { 
    from: /(\.modern-product-title\s*{[^}]*font-family:\s*)var\(--font-body\)/g, 
    to: '$1var(--font-headings)' 
  },
  { 
    from: /(\.faq-hero-title\s*{[^}]*font-family:\s*)var\(--font-body\)/g, 
    to: '$1var(--font-headings)' 
  }
];

// Optimisations design spécifiques pour Montserrat/Roboto
const designEnhancements = [
  // Améliorer les contrastes et espacements pour Montserrat
  { 
    from: /letter-spacing:\s*-?0\.5px/g, 
    to: 'letter-spacing: -0.2px' 
  },
  { 
    from: /letter-spacing:\s*-?1px/g, 
    to: 'letter-spacing: -0.3px' 
  },
  
  // Optimiser les font-weight pour Montserrat (plus moderne)
  { 
    from: /(font-family:\s*var\(--font-headings\)[^}]*font-weight:\s*)700/g, 
    to: '$1600' 
  },
  { 
    from: /(font-family:\s*var\(--font-headings\)[^}]*font-weight:\s*)800/g, 
    to: '$1600' 
  },
  
  // Optimiser line-height pour Roboto (meilleure lisibilité)
  { 
    from: /(font-family:\s*var\(--font-body\)[^}]*line-height:\s*)1\.2/g, 
    to: '$11.5' 
  },
  { 
    from: /(font-family:\s*var\(--font-body\)[^}]*line-height:\s*)1\.3/g, 
    to: '$11.6' 
  }
];

let totalOptimizations = 0;

// Appliquer les corrections de titres
console.log('🔧 Correction des titres pour Montserrat...');
titleCorrections.forEach((correction, index) => {
  const matches = cssContent.match(correction.from);
  const count = matches ? matches.length : 0;
  
  if (count > 0) {
    cssContent = cssContent.replace(correction.from, correction.to);
    console.log(`✅ ${count} titres corrigés vers Montserrat`);
    totalOptimizations += count;
  }
});

// Appliquer les améliorations design
console.log('🎨 Améliorations design...');
designEnhancements.forEach(enhancement => {
  const matches = cssContent.match(enhancement.from);
  const count = matches ? matches.length : 0;
  
  if (count > 0) {
    cssContent = cssContent.replace(enhancement.from, enhancement.to);
    console.log(`✅ ${count} améliorations appliquées`);
    totalOptimizations += count;
  }
});

// Ajout de styles optimisés pour les boutons avec nouvelles polices
const buttonOptimizations = `
/* ======================================================
   OPTIMISATIONS BOUTONS AVEC MONTSERRAT
   ====================================================== */
.btn, .button, .modern-overlay-btn, .categories-main-button {
  font-family: var(--font-headings) !important;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.pay-button, .whatsapp-button {
  font-family: var(--font-headings) !important;
  font-weight: 600;
}

/* Amélioration des formulaires avec Roboto */
input, textarea, select, .form-control {
  font-family: var(--font-body) !important;
  line-height: 1.5;
}

label, .form-label {
  font-family: var(--font-headings) !important;
  font-weight: 500;
}
`;

// Vérifier si les optimisations ne sont pas déjà présentes
if (!cssContent.includes('OPTIMISATIONS BOUTONS AVEC MONTSERRAT')) {
  cssContent += buttonOptimizations;
  console.log('✅ Optimisations boutons et formulaires ajoutées');
  totalOptimizations += 1;
}

// Écrire le fichier optimisé
fs.writeFileSync(cssPath, cssContent);

console.log(`\n🎉 Optimisation finale terminée !`);
console.log(`📊 Total: ${totalOptimizations} optimisations appliquées`);
console.log(`\n🎯 Résultat final:`);
console.log(`   • Montserrat: Tous les titres, boutons, labels`);
console.log(`   • Roboto: Corps de texte, formulaires, descriptions`);
console.log(`   • Design optimisé pour la lisibilité et modernité`);
console.log(`📁 Fichier CSS finalisé: ${cssPath}`);