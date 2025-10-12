const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Client/src/contexts/TranslationContext.js');

console.log('🧹 Nettoyage complet du fichier de traductions...\n');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Sauvegarde avant nettoyage
  const backupPath = filePath + '.backup-cleanup.' + Date.now();
  fs.writeFileSync(backupPath, content, 'utf8');
  console.log(`💾 Sauvegarde créée: ${backupPath}\n`);
  
  // 1. Identifier et supprimer les duplications
  console.log('🔍 Suppression des duplications...');
  
  const lines = content.split('\n');
  const seenKeys = new Map(); // Utiliser Map pour conserver l'ordre
  const cleanedLines = [];
  let removedCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const keyMatch = line.match(/^\s*([^:]+):/);
    
    if (keyMatch) {
      const key = keyMatch[1].trim().replace(/['"]/g, '');
      
      // Ignorer les lignes de commentaire et de structure
      if (key.includes('//') || key === 'fr' || key === 'en' || key === 'ar' || key === 'seo') {
        cleanedLines.push(line);
        continue;
      }
      
      if (seenKeys.has(key)) {
        console.log(`❌ Suppression duplication: "${key}" (ligne ${i + 1})`);
        removedCount++;
        continue; // Skip cette ligne
      } else {
        seenKeys.set(key, i + 1);
        cleanedLines.push(line);
      }
    } else {
      cleanedLines.push(line);
    }
  }
  
  content = cleanedLines.join('\n');
  
  // 2. Corrections de formatage et d'espacement
  console.log('\n🔧 Corrections de formatage...');
  
  let formatCount = 0;
  
  // Correction des espaces multiples dans les valeurs
  content = content.replace(/:\s*"([^"]*\s{2,}[^"]*)"/g, (match, value) => {
    const cleaned = value.replace(/\s{2,}/g, ' ').trim();
    if (cleaned !== value) {
      console.log(`✅ Espaces nettoyés: "${value}" → "${cleaned}"`);
      formatCount++;
    }
    return `: "${cleaned}"`;
  });
  
  // Correction des guillemets manquants pour les propriétés avec espaces
  content = content.replace(/^(\s*)([a-zA-Z][a-zA-Z0-9]*\s+[a-zA-Z][a-zA-Z0-9\s]*)\s*:/gm, (match, indent, property) => {
    if (!property.includes('"') && !property.includes("'")) {
      console.log(`✅ Propriété corrigée: ${property} → "${property}"`);
      formatCount++;
      return `${indent}"${property}":`;
    }
    return match;
  });
  
  // 3. Corrections spécifiques de traduction
  console.log('\n🌐 Corrections de traduction...');
  
  const translationFixes = [
    // Corrections françaises
    { from: /(\w)([A-Z][a-z])/g, replacement: (match, p1, p2) => {
      // Ne pas séparer les acronymes ou noms propres
      const exceptions = ['iPhone', 'iPad', 'MacBook', 'PlayStation', 'Xbox', 'YouTube', 'Facebook', 'Instagram', 'PayPal'];
      if (exceptions.some(exc => match.includes(exc))) return match;
      
      // Séparer camelCase normal
      return p1 + ' ' + p2.toLowerCase();
    }},
    
    // Corrections de mots spécifiques
    { from: /\beCommerce\b/gi, replacement: 'e-commerce' },
    { from: /\beShop\b/gi, replacement: 'e-shop' },
    { from: /\beStore\b/gi, replacement: 'e-store' },
    { from: /\bcheckOut\b/gi, replacement: 'checkout' },
    { from: /\bwishList\b/gi, replacement: 'liste de souhaits' },
    { from: /\bsmartPhone\b/gi, replacement: 'smartphone' },
    
    // Corrections de formatage
    { from: /\b(\d+)\s*([a-zA-Z]+)\b/g, replacement: '$1 $2' }, // Espaces entre nombres et lettres
    { from: /\b([a-z])([A-Z])/g, replacement: '$1 $2' }, // CamelCase général
  ];
  
  let translationCount = 0;
  
  // Appliquer seulement aux valeurs (pas aux clés)
  content = content.replace(/:\s*"([^"]*)"/g, (match, value) => {
    let newValue = value;
    
    translationFixes.forEach(fix => {
      if (typeof fix.replacement === 'function') {
        const oldValue = newValue;
        newValue = newValue.replace(fix.from, fix.replacement);
        if (oldValue !== newValue) {
          console.log(`✅ Traduction corrigée: "${oldValue}" → "${newValue}"`);
          translationCount++;
        }
      } else {
        const oldValue = newValue;
        newValue = newValue.replace(fix.from, fix.replacement);
        if (oldValue !== newValue) {
          console.log(`✅ Traduction corrigée: "${oldValue}" → "${newValue}"`);
          translationCount++;
        }
      }
    });
    
    return `: "${newValue}"`;
  });
  
  // 4. Validation finale et nettoyage
  console.log('\n🔍 Validation finale...');
  
  // Supprimer les lignes vides multiples
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  // Vérifier la syntaxe de base
  const syntaxErrors = [];
  const contentLines = content.split('\n');
  
  contentLines.forEach((line, index) => {
    // Vérifier les propriétés non quotées avec espaces
    if (line.match(/^\s*[a-zA-Z][a-zA-Z0-9]*\s+[a-zA-Z][a-zA-Z0-9\s]*\s*:/) && !line.includes('"') && !line.includes("'")) {
      syntaxErrors.push(`Ligne ${index + 1}: Propriété avec espaces non quotée`);
    }
    
    // Vérifier les guillemets non fermés
    const quotes = (line.match(/"/g) || []).length;
    if (quotes % 2 !== 0 && line.includes(':')) {
      syntaxErrors.push(`Ligne ${index + 1}: Guillemets non fermés`);
    }
  });
  
  if (syntaxErrors.length > 0) {
    console.log('\n⚠️  Erreurs de syntaxe détectées:');
    syntaxErrors.forEach(error => console.log(`   ${error}`));
  }
  
  // 5. Sauvegarde du fichier nettoyé
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✅ Nettoyage terminé!`);
  console.log(`   - Duplications supprimées: ${removedCount}`);
  console.log(`   - Corrections de formatage: ${formatCount}`);
  console.log(`   - Corrections de traduction: ${translationCount}`);
  console.log(`   - Erreurs de syntaxe: ${syntaxErrors.length}`);
  console.log(`📁 Fichier mis à jour: ${filePath}`);
  console.log(`💾 Sauvegarde disponible: ${backupPath}`);
  
} catch (error) {
  console.error('❌ Erreur lors du nettoyage:', error.message);
  process.exit(1);
}