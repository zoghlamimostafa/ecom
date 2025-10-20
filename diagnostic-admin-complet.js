#!/usr/bin/env node
/**
 * 🔍 DIAGNOSTIC COMPLET DE L'ADMIN SANNY STORE
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ADMIN_URL = "http://74.235.205.26:3001";
const BACKEND_URL = "http://127.0.0.1:4000/api";

console.log('\n' + '='.repeat(70));
console.log('🔍 DIAGNOSTIC COMPLET - ADMIN SANNY STORE');
console.log('='.repeat(70) + '\n');

// ===== 1. TEST ACCESSIBILITÉ =====
async function testAccessibility() {
  console.log('📡 TEST 1: Accessibilité de l\'admin\n');
  
  try {
    const start = Date.now();
    const response = await axios.get(ADMIN_URL, { timeout: 5000 });
    const time = Date.now() - start;
    
    console.log(`✅ Admin accessible: ${ADMIN_URL}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Temps de réponse: ${time}ms`);
    console.log(`   Taille: ${(response.data.length / 1024).toFixed(2)} KB\n`);
    
    return { success: true, time };
  } catch (error) {
    console.log(`❌ Admin inaccessible`);
    console.log(`   Erreur: ${error.message}\n`);
    return { success: false, error };
  }
}

// ===== 2. VÉRIFICATION DES FICHIERS =====
async function checkFiles() {
  console.log('📁 TEST 2: Vérification des fichiers critiques\n');
  
  const adminRoot = '/home/blackrdp/sanny/san/ecomerce_sanny/admin-app';
  const criticalFiles = [
    'package.json',
    'src/App.js',
    'src/index.js',
    'src/pages/AddproductIntelligent.js',
    'src/pages/Productlist.js',
    'src/features/product/productSlice.js',
    'src/features/product/productService.js',
    'src/features/upload/uploadSlice.js',
    'src/features/upload/uploadService.js',
    'src/utils/axiosConfig.js',
    'src/utils/baseUrl.js'
  ];
  
  let allExist = true;
  let issues = [];
  
  for (const file of criticalFiles) {
    const filePath = path.join(adminRoot, file);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   ✅ ${file} (${sizeKB} KB)`);
    } else {
      console.log(`   ❌ ${file} - MANQUANT`);
      allExist = false;
      issues.push(file);
    }
  }
  
  console.log('');
  return { success: allExist, issues };
}

// ===== 3. VÉRIFICATION DE LA CONFIGURATION =====
async function checkConfiguration() {
  console.log('⚙️  TEST 3: Configuration de l\'admin\n');
  
  const adminRoot = '/home/blackrdp/sanny/san/ecomerce_sanny/admin-app';
  const issues = [];
  
  // Vérifier baseUrl.js
  try {
    const baseUrlPath = path.join(adminRoot, 'src/utils/baseUrl.js');
    const baseUrlContent = fs.readFileSync(baseUrlPath, 'utf8');
    
    if (baseUrlContent.includes('127.0.0.1:4000') || baseUrlContent.includes('localhost:4000')) {
      console.log('   ✅ baseUrl.js: Pointe vers le backend local');
    } else if (baseUrlContent.includes('74.235.205.26:4000')) {
      console.log('   ✅ baseUrl.js: Pointe vers le backend IP publique');
    } else {
      console.log('   ⚠️  baseUrl.js: Configuration URL non standard');
      issues.push('baseUrl configuration');
    }
  } catch (error) {
    console.log('   ❌ Erreur lecture baseUrl.js:', error.message);
    issues.push('baseUrl.js illisible');
  }
  
  // Vérifier package.json
  try {
    const packagePath = path.join(adminRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    console.log(`   ✅ package.json: ${packageJson.name} v${packageJson.version}`);
    
    // Vérifier les dépendances critiques
    const criticalDeps = ['react', 'react-redux', '@reduxjs/toolkit', 'axios', 'formik', 'antd'];
    const missingDeps = criticalDeps.filter(dep => !packageJson.dependencies[dep]);
    
    if (missingDeps.length > 0) {
      console.log('   ⚠️  Dépendances manquantes:', missingDeps.join(', '));
      issues.push('dépendances manquantes');
    } else {
      console.log('   ✅ Toutes les dépendances critiques présentes');
    }
  } catch (error) {
    console.log('   ❌ Erreur lecture package.json:', error.message);
    issues.push('package.json illisible');
  }
  
  console.log('');
  return { success: issues.length === 0, issues };
}

// ===== 4. TEST DES ROUTES BACKEND =====
async function testBackendRoutes() {
  console.log('🔗 TEST 4: Connexion au backend\n');
  
  const routes = [
    { name: 'Produits (liste)', url: `${BACKEND_URL}/product/`, auth: false },
    { name: 'Catégories', url: `${BACKEND_URL}/category/`, auth: false },
    { name: 'Marques', url: `${BACKEND_URL}/brand/`, auth: false },
    { name: 'Couleurs', url: `${BACKEND_URL}/color/`, auth: false },
  ];
  
  let successCount = 0;
  let failCount = 0;
  
  for (const route of routes) {
    try {
      const response = await axios.get(route.url, { timeout: 3000 });
      console.log(`   ✅ ${route.name}: OK (${response.status})`);
      successCount++;
    } catch (error) {
      console.log(`   ❌ ${route.name}: ÉCHEC (${error.message})`);
      failCount++;
    }
  }
  
  console.log(`\n   Résumé: ${successCount} réussies, ${failCount} échouées\n`);
  return { success: failCount === 0, successCount, failCount };
}

// ===== 5. ANALYSE DU CODE SOURCE =====
async function analyzeSourceCode() {
  console.log('🔬 TEST 5: Analyse du code source\n');
  
  const adminRoot = '/home/blackrdp/sanny/san/ecomerce_sanny/admin-app/src';
  const issues = [];
  
  // Analyser AddproductIntelligent.js
  try {
    const addProductPath = path.join(adminRoot, 'pages/AddproductIntelligent.js');
    const content = fs.readFileSync(addProductPath, 'utf8');
    
    // Vérifier les imports critiques
    const criticalImports = [
      'useFormik',
      'useDispatch',
      'useSelector',
      'uploadImg',
      'createProducts',
      'updateProduct',
      'resetState'
    ];
    
    let missingImports = [];
    for (const imp of criticalImports) {
      if (!content.includes(imp)) {
        missingImports.push(imp);
      }
    }
    
    if (missingImports.length > 0) {
      console.log(`   ⚠️  AddproductIntelligent.js: Imports manquants: ${missingImports.join(', ')}`);
      issues.push('imports manquants dans AddproductIntelligent.js');
    } else {
      console.log('   ✅ AddproductIntelligent.js: Tous les imports présents');
    }
    
    // Vérifier la validation des images
    if (content.includes('img.length === 0')) {
      console.log('   ✅ AddproductIntelligent.js: Validation images présente');
    } else {
      console.log('   ⚠️  AddproductIntelligent.js: Pas de validation images détectée');
      issues.push('validation images manquante');
    }
    
    // Vérifier mode="tags" pour brand
    if (content.includes('mode="tags"')) {
      console.log('   ✅ AddproductIntelligent.js: Brand avec saisie manuelle (tags)');
    } else {
      console.log('   ⚠️  AddproductIntelligent.js: Brand sans mode tags');
    }
    
  } catch (error) {
    console.log('   ❌ Erreur analyse AddproductIntelligent.js:', error.message);
    issues.push('fichier illisible');
  }
  
  // Analyser uploadSlice.js
  try {
    const uploadSlicePath = path.join(adminRoot, 'features/upload/uploadSlice.js');
    const content = fs.readFileSync(uploadSlicePath, 'utf8');
    
    if (content.includes('uploadImg.fulfilled')) {
      console.log('   ✅ uploadSlice.js: Gestion upload présente');
    }
    
    if (content.includes('normalizedImages')) {
      console.log('   ✅ uploadSlice.js: Normalisation images présente');
    }
    
  } catch (error) {
    console.log('   ❌ Erreur analyse uploadSlice.js:', error.message);
    issues.push('uploadSlice.js illisible');
  }
  
  console.log('');
  return { success: issues.length === 0, issues };
}

// ===== 6. VÉRIFICATION DE LA BASE DE DONNÉES =====
async function checkDatabase() {
  console.log('💾 TEST 6: Vérification données disponibles\n');
  
  try {
    // Produits
    const products = await axios.get(`${BACKEND_URL}/product/`);
    const productCount = (products.data.products || products.data).length;
    console.log(`   ✅ Produits: ${productCount} disponibles`);
    
    // Catégories
    const categories = await axios.get(`${BACKEND_URL}/category/`);
    const catCount = categories.data.length || 0;
    console.log(`   ✅ Catégories: ${catCount} disponibles`);
    
    // Marques
    const brands = await axios.get(`${BACKEND_URL}/brand/`);
    const brandCount = brands.data.length || 0;
    console.log(`   ✅ Marques: ${brandCount} disponibles`);
    
    // Couleurs
    const colors = await axios.get(`${BACKEND_URL}/color/`);
    const colorCount = colors.data.length || 0;
    console.log(`   ✅ Couleurs: ${colorCount} disponibles`);
    
    console.log('');
    
    if (productCount === 0) {
      console.log('   ⚠️  Aucun produit en base - Admin sera vide');
    }
    if (catCount === 0) {
      console.log('   ⚠️  Aucune catégorie - Impossible de créer des produits');
    }
    
    return { 
      success: catCount > 0, 
      stats: { productCount, catCount, brandCount, colorCount } 
    };
  } catch (error) {
    console.log(`   ❌ Erreur connexion backend: ${error.message}\n`);
    return { success: false, error };
  }
}

// ===== 7. ANALYSE DES LOGS PM2 =====
async function analyzePM2Logs() {
  console.log('📋 TEST 7: Analyse des logs PM2\n');
  
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  try {
    // Récupérer les logs récents
    const { stdout } = await execPromise('pm2 logs sanny-admin --lines 50 --nostream 2>&1');
    
    // Compter les types de messages
    const errors = (stdout.match(/error|ERROR|❌/gi) || []).length;
    const warnings = (stdout.match(/warning|WARNING|⚠️/gi) || []).length;
    const deprecations = (stdout.match(/DeprecationWarning/g) || []).length;
    
    console.log(`   Erreurs détectées: ${errors}`);
    console.log(`   Warnings détectés: ${warnings}`);
    console.log(`   Dépréciations: ${deprecations}`);
    
    if (errors > 0) {
      console.log('\n   ⚠️  Des erreurs ont été détectées dans les logs');
    }
    if (deprecations > 0) {
      console.log('   ℹ️  Dépréciations Webpack détectées (normales, à ignorer)');
    }
    
    console.log('');
    return { success: errors === 0, errors, warnings, deprecations };
  } catch (error) {
    console.log(`   ❌ Impossible de lire les logs PM2: ${error.message}\n`);
    return { success: false, error };
  }
}

// ===== EXÉCUTION =====
async function runDiagnostic() {
  const results = [];
  
  results.push(await testAccessibility());
  results.push(await checkFiles());
  results.push(await checkConfiguration());
  results.push(await testBackendRoutes());
  results.push(await analyzeSourceCode());
  results.push(await checkDatabase());
  results.push(await analyzePM2Logs());
  
  // Résumé
  console.log('='.repeat(70));
  console.log('📊 RÉSUMÉ DU DIAGNOSTIC');
  console.log('='.repeat(70) + '\n');
  
  const successCount = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  console.log(`Tests réussis: ${successCount}/${totalTests}`);
  console.log(`Tests échoués: ${totalTests - successCount}/${totalTests}\n`);
  
  if (successCount === totalTests) {
    console.log('🎉 ✅ ADMIN EN PARFAIT ÉTAT - Aucun problème détecté\n');
  } else {
    console.log('⚠️  Des problèmes ont été détectés:\n');
    
    results.forEach((result, index) => {
      if (!result.success) {
        console.log(`   ${index + 1}. Test ${index + 1} échoué`);
        if (result.issues) {
          result.issues.forEach(issue => console.log(`      - ${issue}`));
        }
      }
    });
    console.log('');
  }
  
  console.log('💡 Recommandations:\n');
  console.log('   1. Vérifiez que le backend tourne sur le port 4000');
  console.log('   2. Reconnectez-vous à l\'admin pour un nouveau token');
  console.log('   3. Testez la création/modification de produits');
  console.log('   4. Vérifiez l\'upload d\'images dans DevTools (F12)\n');
  
  console.log('='.repeat(70) + '\n');
}

runDiagnostic().catch(console.error);
