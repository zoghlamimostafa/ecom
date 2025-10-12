const fs = require('fs');
const path = require('path');

// Chemin vers le fichier CSS
const cssPath = path.join(__dirname, 'Client', 'src', 'App.css');

// Lire le contenu du fichier
let cssContent = fs.readFileSync(cssPath, 'utf8');

console.log('🔧 Optimisation des breakpoints responsive...');

// Map des remplacements
const breakpointReplacements = [
  { from: '@media (max-width: 991px)', to: '@media (max-width: var(--breakpoint-desktop-sm))' },
  { from: '@media (max-width: 768px)', to: '@media (max-width: var(--breakpoint-tablet))' },
  { from: '@media (max-width: 576px)', to: '@media (max-width: var(--breakpoint-mobile))' },
  { from: '@media (max-width: 480px)', to: '@media (max-width: var(--breakpoint-mobile-sm))' },
];

let totalReplacements = 0;

// Effectuer les remplacements
breakpointReplacements.forEach(replacement => {
  const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const matches = cssContent.match(regex);
  const count = matches ? matches.length : 0;
  
  if (count > 0) {
    cssContent = cssContent.replace(regex, replacement.to);
    console.log(`✅ ${count} instances de "${replacement.from}" remplacées`);
    totalReplacements += count;
  }
});

// Optimisation des tailles fixes vers variables
const sizeReplacements = [
  // Font sizes
  { from: /font-size:\s*3rem/g, to: 'font-size: var(--font-size-4xl)' },
  { from: /font-size:\s*2\.5rem/g, to: 'font-size: var(--font-size-3xl)' },
  { from: /font-size:\s*2rem/g, to: 'font-size: var(--font-size-2xl)' },
  { from: /font-size:\s*1\.5rem/g, to: 'font-size: var(--font-size-xl)' },
  { from: /font-size:\s*1\.25rem/g, to: 'font-size: var(--font-size-lg)' },
  { from: /font-size:\s*1\.2rem/g, to: 'font-size: var(--font-size-lg)' },
  { from: /font-size:\s*1\.1rem/g, to: 'font-size: var(--font-size-base)' },
  { from: /font-size:\s*1rem/g, to: 'font-size: var(--font-size-base)' },
  { from: /font-size:\s*16px/g, to: 'font-size: var(--font-size-base)' },
  { from: /font-size:\s*15px/g, to: 'font-size: var(--font-size-sm)' },
  { from: /font-size:\s*14px/g, to: 'font-size: var(--font-size-sm)' },
  { from: /font-size:\s*13px/g, to: 'font-size: var(--font-size-sm)' },
  { from: /font-size:\s*12px/g, to: 'font-size: var(--font-size-xs)' },
  { from: /font-size:\s*0\.9rem/g, to: 'font-size: var(--font-size-sm)' },
  { from: /font-size:\s*0\.8rem/g, to: 'font-size: var(--font-size-xs)' },
  { from: /font-size:\s*0\.7rem/g, to: 'font-size: var(--font-size-xs)' },
  
  // Icônes et dimensions
  { from: /width:\s*60px/g, to: 'width: var(--icon-2xl)' },
  { from: /height:\s*60px/g, to: 'height: var(--icon-2xl)' },
  { from: /width:\s*48px/g, to: 'width: var(--icon-xl)' },
  { from: /height:\s*48px/g, to: 'height: var(--icon-xl)' },
  { from: /width:\s*32px/g, to: 'width: var(--icon-lg)' },
  { from: /height:\s*32px/g, to: 'height: var(--icon-lg)' },
  { from: /width:\s*24px/g, to: 'width: var(--icon-md)' },
  { from: /height:\s*24px/g, to: 'height: var(--icon-md)' },
  { from: /width:\s*20px/g, to: 'width: var(--icon-md)' },
  { from: /height:\s*20px/g, to: 'height: var(--icon-md)' },
  { from: /width:\s*18px/g, to: 'width: var(--icon-sm)' },
  { from: /height:\s*18px/g, to: 'height: var(--icon-sm)' },
  { from: /width:\s*16px/g, to: 'width: var(--icon-sm)' },
  { from: /height:\s*16px/g, to: 'height: var(--icon-sm)' },
  { from: /width:\s*14px/g, to: 'width: var(--icon-xs)' },
  { from: /height:\s*14px/g, to: 'height: var(--icon-xs)' },
  { from: /width:\s*12px/g, to: 'width: var(--icon-xs)' },
  { from: /height:\s*12px/g, to: 'height: var(--icon-xs)' },
];

console.log('🎨 Optimisation des tailles de police et icônes...');

sizeReplacements.forEach(replacement => {
  const matches = cssContent.match(replacement.from);
  const count = matches ? matches.length : 0;
  
  if (count > 0) {
    cssContent = cssContent.replace(replacement.from, replacement.to);
    console.log(`✅ ${count} instances optimisées pour "${replacement.to}"`);
    totalReplacements += count;
  }
});

// Écrire le fichier optimisé
fs.writeFileSync(cssPath, cssContent);

console.log(`\n🎉 Optimisation terminée !`);
console.log(`📊 Total: ${totalReplacements} remplacements effectués`);
console.log(`📁 Fichier mis à jour: ${cssPath}`);