// Script de diagnostic et correction du système de traduction
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Client/src/contexts/TranslationContext.js');

console.log('🔍 DIAGNOSTIC SYSTÈME DE TRADUCTION');
console.log('=====================================\n');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Vérification de la structure générale
  console.log('1. 📋 Structure du fichier:');
  console.log(`   • Taille: ${Math.round(content.length / 1024)} KB`);
  console.log(`   • Lignes: ${content.split('\n').length}`);
  
  // 2. Vérification des exports
  const hasUseTranslation = content.includes('export const useTranslation');
  const hasTranslationProvider = content.includes('export const TranslationProvider');
  console.log(`   • useTranslation exporté: ${hasUseTranslation ? '✅' : '❌'}`);
  console.log(`   • TranslationProvider exporté: ${hasTranslationProvider ? '✅' : '❌'}`);
  
  // 3. Vérification des langues
  console.log('\n2. 🌍 Langues disponibles:');
  const hasFrench = content.includes('fr: {');
  const hasEnglish = content.includes('en: {');
  const hasArabic = content.includes('ar: {');
  console.log(`   • Français (fr): ${hasFrench ? '✅' : '❌'}`);
  console.log(`   • Anglais (en): ${hasEnglish ? '✅' : '❌'}`);
  console.log(`   • Arabe (ar): ${hasArabic ? '✅' : '❌'}`);
  
  // 4. Vérification des clés importantes
  console.log('\n3. 🔑 Clés de traduction importantes:');
  const importantKeys = [
    'home', 'products', 'cart', 'contact', 'login', 'register',
    'siteName', 'addToCart', 'removeFromCart', 'wishlist'
  ];
  
  importantKeys.forEach(key => {
    const hasKey = content.includes(`"${key}"`) || content.includes(`${key}:`);
    console.log(`   • ${key}: ${hasKey ? '✅' : '❌'}`);
  });
  
  // 5. Détection des problèmes de syntaxe
  console.log('\n4. 🔧 Problèmes détectés:');
  const issues = [];
  
  // Vérifier les propriétés avec espaces non quotées
  const unquotedProps = content.match(/^\s*[a-zA-Z][a-zA-Z0-9\s]+[^"']:/gm);
  if (unquotedProps) {
    issues.push(`Propriétés non quotées: ${unquotedProps.length}`);
  }
  
  // Vérifier les virgules manquantes
  const missingCommas = content.match(/}\s*\n\s*[a-zA-Z]/g);
  if (missingCommas) {
    issues.push(`Virgules potentiellement manquantes: ${missingCommas.length}`);
  }
  
  // Vérifier les guillemets incohérents
  const inconsistentQuotes = content.match(/[^\\]'/g);
  if (inconsistentQuotes) {
    issues.push(`Guillemets simples détectés: ${inconsistentQuotes.length}`);
  }
  
  if (issues.length === 0) {
    console.log('   ✅ Aucun problème majeur détecté');
  } else {
    issues.forEach(issue => console.log(`   ⚠️  ${issue}`));
  }
  
  // 6. Statistiques des traductions
  console.log('\n5. 📊 Statistiques:');
  const frenchKeys = (content.match(/fr:\s*{[\s\S]*?},\s*en:/s) || [''])[0];
  const englishKeys = (content.match(/en:\s*{[\s\S]*?},\s*ar:/s) || [''])[0];
  const arabicKeys = (content.match(/ar:\s*{[\s\S]*?}\s*};/s) || [''])[0];
  
  const countKeys = (section) => (section.match(/\w+:/g) || []).length;
  
  console.log(`   • Clés françaises: ~${countKeys(frenchKeys)}`);
  console.log(`   • Clés anglaises: ~${countKeys(englishKeys)}`);
  console.log(`   • Clés arabes: ~${countKeys(arabicKeys)}`);
  
  // 7. Suggestions de correction
  console.log('\n6. 💡 Corrections suggérées:');
  
  if (!hasUseTranslation || !hasTranslationProvider) {
    console.log('   🔧 Problèmes d\'export détectés - correction nécessaire');
  }
  
  if (issues.length > 0) {
    console.log('   🔧 Problèmes de syntaxe détectés - nettoyage recommandé');
  }
  
  console.log('   🔧 Recommandation: Nettoyage et restructuration du fichier');
  
} catch (error) {
  console.error('❌ Erreur lors du diagnostic:', error.message);
}

console.log('\n🎯 CONCLUSION:');
console.log('Pour corriger le système de traduction, nous devons:');
console.log('1. Nettoyer la syntaxe JavaScript');
console.log('2. Vérifier la cohérence des clés entre les langues');
console.log('3. S\'assurer que tous les exports sont corrects');
console.log('4. Tester le changement de langue');