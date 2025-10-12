const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Client/src/contexts/TranslationContext.js');

console.log('🔍 Analyse complète du fichier de traductions...\n');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Sauvegarde avant analyse
  const backupPath = filePath + '.backup.' + Date.now();
  fs.writeFileSync(backupPath, content, 'utf8');
  console.log(`💾 Sauvegarde créée: ${backupPath}\n`);
  
  let issues = [];
  let corrections = [];
  
  // 1. Détection des mots collés (camelCase dans les valeurs de texte)
  const camelCaseInValues = content.match(/:\s*"[^"]*[a-z][A-Z][^"]*"/g);
  if (camelCaseInValues) {
    console.log('🔴 Mots collés détectés dans les valeurs:');
    camelCaseInValues.forEach(match => {
      console.log(`   ${match}`);
      issues.push({type: 'camelCase', match});
    });
    console.log('');
  }
  
  // 2. Détection des clés dupliquées
  const lines = content.split('\n');
  const seenKeys = {};
  const duplicates = [];
  
  lines.forEach((line, index) => {
    const keyMatch = line.match(/^\s*([^:]+):/);
    if (keyMatch) {
      const key = keyMatch[1].trim().replace(/['"]/g, '');
      if (seenKeys[key]) {
        duplicates.push({
          key,
          line: index + 1,
          firstOccurrence: seenKeys[key]
        });
      } else {
        seenKeys[key] = index + 1;
      }
    }
  });
  
  if (duplicates.length > 0) {
    console.log('🔴 Clés dupliquées détectées:');
    duplicates.forEach(dup => {
      console.log(`   "${dup.key}" - Ligne ${dup.line} (première occurrence: ligne ${dup.firstOccurrence})`);
    });
    console.log('');
  }
  
  // 3. Détection des mots potentiellement mal séparés
  const potentialIssues = [
    // Mots français collés
    /\b(notre|votre|cette|pour|avec|dans|tous|tout|sans|entre|avant|après|depuis|pendant)([A-Z][a-z]+)/g,
    // Préfixes collés
    /\b(auto|multi|semi|anti|pro|pre|post|sub|super|inter)([A-Z][a-z]+)/g,
    // Mots anglais collés  
    /\b(our|your|this|that|with|from|into|onto|about|under|over|after|before)([A-Z][a-z]+)/g,
    // Nombres collés
    /\b\d+([A-Z][a-z]+)/g
  ];
  
  console.log('🔍 Recherche de mots potentiellement mal séparés...');
  potentialIssues.forEach((regex, index) => {
    const matches = content.match(regex);
    if (matches) {
      console.log(`Pattern ${index + 1}: ${matches.join(', ')}`);
    }
  });
  console.log('');
  
  // 4. Corrections automatiques pour les cas courants
  const autoCorrections = [
    // Corrections françaises
    { from: /\bnotreBoutique\b/g, to: 'notre boutique' },
    { from: /\bvotrePanier\b/g, to: 'votre panier' },
    { from: /\btousLesProduits\b/g, to: 'tous les produits' },
    { from: /\btoutesLesCategories\b/g, to: 'toutes les catégories' },
    { from: /\bsansSucces\b/g, to: 'sans succès' },
    { from: /\bavecSucces\b/g, to: 'avec succès' },
    { from: /\bdansLePanier\b/g, to: 'dans le panier' },
    { from: /\bpourVous\b/g, to: 'pour vous' },
    { from: /\bentreParentheses\b/g, to: 'entre parenthèses' },
    { from: /\bavantTout\b/g, to: 'avant tout' },
    { from: /\bapresVente\b/g, to: 'après-vente' },
    { from: /\bdepuisToujours\b/g, to: 'depuis toujours' },
    { from: /\bpendantLivraison\b/g, to: 'pendant la livraison' },
    
    // Corrections techniques
    { from: /\bautoMoto\b/g, to: 'auto moto' },
    { from: /\bmultiLangue\b/g, to: 'multi langue' },
    { from: /\bsemiAuto\b/g, to: 'semi auto' },
    { from: /\bantiVirus\b/g, to: 'anti virus' },
    { from: /\bproActive\b/g, to: 'pro active' },
    { from: /\bpreCommande\b/g, to: 'pré commande' },
    { from: /\bpostVente\b/g, to: 'post vente' },
    { from: /\bsubCategorie\b/g, to: 'sous catégorie' },
    { from: /\bsuperMarche\b/g, to: 'super marché' },
    { from: /\binterNational\b/g, to: 'international' },
    
    // Corrections anglaises
    { from: /\bourStore\b/g, to: 'our store' },
    { from: /\byourAccount\b/g, to: 'your account' },
    { from: /\bthisProduct\b/g, to: 'this product' },
    { from: /\bthatItem\b/g, to: 'that item' },
    { from: /\bwithSuccess\b/g, to: 'with success' },
    { from: /\bfromCart\b/g, to: 'from cart' },
    { from: /\bintoCart\b/g, to: 'into cart' },
    { from: /\bontoPage\b/g, to: 'onto page' },
    { from: /\baboutUs\b/g, to: 'about us' },
    { from: /\bunderReview\b/g, to: 'under review' },
    { from: /\boverLimit\b/g, to: 'over limit' },
    { from: /\bafterSale\b/g, to: 'after sale' },
    { from: /\bbeforePayment\b/g, to: 'before payment' },
    
    // Corrections de nombres
    { from: /\b7jours\b/g, to: '7 jours' },
    { from: /\b24heures\b/g, to: '24 heures' },
    { from: /\b30jours\b/g, to: '30 jours' },
    { from: /\b365jours\b/g, to: '365 jours' },
    { from: /\b2facteurs\b/g, to: '2 facteurs' },
    { from: /\b3etapes\b/g, to: '3 étapes' },
    { from: /\b5etoiles\b/g, to: '5 étoiles' },
    
    // Corrections de noms composés
    { from: /\beCommerce\b/g, to: 'e-commerce' },
    { from: /\beShop\b/g, to: 'e-shop' },
    { from: /\beStore\b/g, to: 'e-store' },
    { from: /\bePayment\b/g, to: 'e-payment' },
    { from: /\bwishList\b/g, to: 'wish list' },
    { from: /\bcheckOut\b/g, to: 'check out' },
    { from: /\blogIn\b/g, to: 'log in' },
    { from: /\blogOut\b/g, to: 'log out' },
    { from: /\bsignUp\b/g, to: 'sign up' },
    { from: /\bsignIn\b/g, to: 'sign in' },
    { from: /\bcontactUs\b/g, to: 'contact us' },
    { from: /\baboutUs\b/g, to: 'about us' },
    
    // Corrections de termes techniques
    { from: /\bsmartPhone\b/g, to: 'smartphone' },
    { from: /\biPhone\b/g, to: 'iPhone' },
    { from: /\biPad\b/g, to: 'iPad' },
    { from: /\bmacBook\b/g, to: 'MacBook' },
    { from: /\bplayStation\b/g, to: 'PlayStation' },
    { from: /\bxBox\b/g, to: 'Xbox' },
    { from: /\byouTube\b/g, to: 'YouTube' },
    { from: /\bfaceBook\b/g, to: 'Facebook' },
    { from: /\binstagram\b/g, to: 'Instagram' },
    { from: /\btwitterX\b/g, to: 'Twitter/X' },
    
    // Corrections de formats
    { from: /\bpdfFile\b/g, to: 'fichier PDF' },
    { from: /\bjpgImage\b/g, to: 'image JPG' },
    { from: /\bpngImage\b/g, to: 'image PNG' },
    { from: /\bmp4Video\b/g, to: 'vidéo MP4' },
    { from: /\bmp3Audio\b/g, to: 'audio MP3' },
    
    // Corrections de devises et unités
    { from: /\beuroPrix\b/g, to: 'prix en euros' },
    { from: /\bdollarPrix\b/g, to: 'prix en dollars' },
    { from: /\btndPrix\b/g, to: 'prix en TND' },
    { from: /\bkgPoids\b/g, to: 'poids en kg' },
    { from: /\bcmTaille\b/g, to: 'taille en cm' },
    { from: /\bmmTaille\b/g, to: 'taille en mm' },
    
    // Corrections d'actions
    { from: /\bajouterPanier\b/g, to: 'ajouter au panier' },
    { from: /\bretirerPanier\b/g, to: 'retirer du panier' },
    { from: /\bajouterFavoris\b/g, to: 'ajouter aux favoris' },
    { from: /\bretirerFavoris\b/g, to: 'retirer des favoris' },
    { from: /\bvoirDetails\b/g, to: 'voir les détails' },
    { from: /\bacheterMaintenant\b/g, to: 'acheter maintenant' },
    { from: /\bcommander\b/g, to: 'commander' },
    { from: /\blivrerRapide\b/g, to: 'livraison rapide' },
    { from: /\bpayerSecurise\b/g, to: 'paiement sécurisé' },
    { from: /\bretourGratuit\b/g, to: 'retour gratuit' }
  ];
  
  console.log('🔧 Application des corrections automatiques...');
  
  let correctionCount = 0;
  autoCorrections.forEach(correction => {
    const matches = content.match(correction.from);
    if (matches) {
      content = content.replace(correction.from, correction.to);
      correctionCount += matches.length;
      console.log(`✅ ${correction.from.source} → "${correction.to}" (${matches.length} occurrence(s))`);
      corrections.push({
        from: correction.from.source,
        to: correction.to,
        count: matches.length
      });
    }
  });
  
  // 5. Correction des propriétés avec espaces non quotées
  console.log('\n🔧 Correction des propriétés avec espaces...');
  const spacePropertyRegex = /^(\s*)([a-zA-Z][a-zA-Z0-9]*\s+[a-zA-Z][a-zA-Z0-9\s]*)\s*:/gm;
  
  content = content.replace(spacePropertyRegex, (match, indent, property) => {
    if (!property.includes('"') && !property.includes("'")) {
      console.log(`✅ ${property} → "${property}"`);
      correctionCount++;
      return `${indent}"${property}":`;
    }
    return match;
  });
  
  // 6. Nettoyage des espaces multiples dans les valeurs
  console.log('\n🔧 Nettoyage des espaces multiples...');
  const multiSpaceRegex = /:\s*"([^"]*\s{2,}[^"]*)"/g;
  content = content.replace(multiSpaceRegex, (match, value) => {
    const cleaned = value.replace(/\s{2,}/g, ' ').trim();
    if (cleaned !== value) {
      console.log(`✅ Espaces nettoyés: "${value}" → "${cleaned}"`);
      correctionCount++;
    }
    return `: "${cleaned}"`;
  });
  
  // 7. Sauvegarde du fichier corrigé
  if (correctionCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`\n✅ ${correctionCount} corrections appliquées avec succès!`);
    console.log(`📁 Fichier mis à jour: ${filePath}`);
  } else {
    console.log('\n✅ Aucune correction nécessaire. Le fichier est déjà propre!');
  }
  
  // 8. Rapport final
  console.log('\n📊 Rapport d\'analyse:');
  console.log(`   - Issues detectees: ${issues.length}`);
  console.log(`   - Cles dupliquees: ${duplicates.length}`);
  console.log(`   - Corrections appliquees: ${correctionCount}`);
  console.log(`   - Sauvegarde: ${backupPath}`);
  
  if (duplicates.length > 0) {
    console.log('\n⚠️  Cles dupliquees a verifier manuellement:');
    duplicates.forEach(dup => {
      console.log(`   - "${dup.key}" (lignes ${dup.firstOccurrence} et ${dup.line})`);
    });
  }
  
} catch (error) {
  console.error('❌ Erreur lors de l\'analyse:', error.message);
  process.exit(1);
}