#!/usr/bin/env node

const axios = require('axios');

console.log("🔍 ===== DIAGNOSTIC COMPLET SANNY STORE =====\n");
console.log("Date:", new Date().toLocaleString());
console.log("");

async function checkBackend() {
  console.log("🔧 BACKEND:");
  try {
    const healthResponse = await axios.get("http://127.0.0.1:4000/api/health", { timeout: 3000 });
    console.log("   ✅ Backend opérationnel");
    console.log("   URL:", "http://127.0.0.1:4000");
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log("   ❌ Backend ne répond pas sur le port 4000");
    } else if (error.response?.status === 404) {
      console.log("   ⚠️  Backend répond mais route /health non trouvée (normal)");
      console.log("   ✅ Backend probablement opérationnel");
    } else {
      console.log("   ⚠️  Erreur:", error.message);
    }
  }
  console.log("");
}

async function checkProducts() {
  console.log("📦 PRODUITS:");
  try {
    const response = await axios.get("http://127.0.0.1:4000/api/product/", { timeout: 5000 });
    const products = response.data.products || response.data;
    
    console.log(`   ✅ API produits accessible`);
    console.log(`   📊 Total: ${products.length} produits`);
    
    if (products.length > 0) {
      console.log("\n   📋 Liste des produits:");
      products.forEach((p, index) => {
        console.log(`   ${index + 1}. [ID:${p.id}] ${p.title}`);
        console.log(`      Prix: ${p.price} TND | Marque: ${p.brand || 'N/A'}`);
        
        // Analyser les images
        let imagesInfo = "Aucune image";
        if (p.images) {
          try {
            let images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
            if (Array.isArray(images) && images.length > 0) {
              imagesInfo = `${images.length} image(s)`;
              console.log(`      Images: ${imagesInfo}`);
              images.forEach((img, i) => {
                const url = typeof img === 'string' ? img : img.url;
                console.log(`         ${i + 1}. ${url}`);
              });
            } else {
              console.log(`      Images: ${imagesInfo}`);
            }
          } catch (e) {
            console.log(`      Images: Erreur parsing (${typeof p.images})`);
          }
        } else {
          console.log(`      Images: ${imagesInfo}`);
        }
        console.log("");
      });
    } else {
      console.log("   ℹ️  Aucun produit en base de données");
    }
  } catch (error) {
    console.log("   ❌ Erreur récupération produits:", error.message);
  }
  console.log("");
}

async function checkUploadFolder() {
  console.log("📁 DOSSIER UPLOAD:");
  const fs = require('fs');
  const path = require('path');
  const uploadDir = path.join(__dirname, 'backend', 'public', 'images');
  
  try {
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      console.log(`   ✅ Dossier existe: ${uploadDir}`);
      console.log(`   📸 ${files.length} fichier(s) uploadé(s)`);
      
      if (files.length > 0) {
        console.log("\n   Liste des images:");
        files.slice(0, 10).forEach((file, i) => {
          const stats = fs.statSync(path.join(uploadDir, file));
          const sizeKB = (stats.size / 1024).toFixed(2);
          console.log(`      ${i + 1}. ${file} (${sizeKB} KB)`);
        });
        
        if (files.length > 10) {
          console.log(`      ... et ${files.length - 10} autre(s) fichier(s)`);
        }
      }
    } else {
      console.log(`   ❌ Dossier n'existe pas: ${uploadDir}`);
    }
  } catch (error) {
    console.log("   ❌ Erreur lecture dossier:", error.message);
  }
  console.log("");
}

async function checkImageUrls() {
  console.log("🔗 VÉRIFICATION DES URLs D'IMAGES:");
  try {
    const response = await axios.get("http://127.0.0.1:4000/api/product/");
    const products = response.data.products || response.data;
    
    let totalImages = 0;
    let validImages = 0;
    let invalidImages = 0;
    let defaultImages = 0;
    
    for (const product of products) {
      if (product.images) {
        try {
          let images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
          if (Array.isArray(images)) {
            for (const img of images) {
              totalImages++;
              const url = typeof img === 'string' ? img : img.url;
              
              // Vérifier si c'est une image par défaut
              if (url && (url.includes('default') || url.includes('placeholder') || url.includes('no-image'))) {
                defaultImages++;
                console.log(`   ⚠️  Image par défaut détectée: ${url}`);
              }
              
              // Tester l'URL (seulement pour les URLs locales)
              if (url && url.startsWith('http://127.0.0.1:4000')) {
                try {
                  await axios.head(url, { timeout: 2000 });
                  validImages++;
                } catch {
                  invalidImages++;
                  console.log(`   ❌ URL invalide: ${url}`);
                }
              } else {
                validImages++; // Supposer valide si c'est une URL externe
              }
            }
          }
        } catch (e) {
          // Ignorer les erreurs de parsing
        }
      }
    }
    
    console.log(`   📊 Total images: ${totalImages}`);
    console.log(`   ✅ Valides: ${validImages}`);
    console.log(`   ❌ Invalides: ${invalidImages}`);
    console.log(`   ⚠️  Par défaut: ${defaultImages}`);
  } catch (error) {
    console.log("   ❌ Erreur vérification URLs:", error.message);
  }
  console.log("");
}

async function checkProcesses() {
  console.log("⚙️  PROCESSUS PM2:");
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  try {
    const { stdout } = await execPromise('pm2 jlist');
    const processes = JSON.parse(stdout);
    
    const relevantProcesses = processes.filter(p => 
      p.name.includes('backend') || p.name.includes('sanny')
    );
    
    relevantProcesses.forEach(p => {
      const status = p.pm2_env.status;
      const statusIcon = status === 'online' ? '✅' : '❌';
      const restarts = p.pm2_env.restart_time;
      const uptime = Math.floor((Date.now() - p.pm2_env.pm_uptime) / 1000 / 60);
      
      console.log(`   ${statusIcon} ${p.name}:`);
      console.log(`      Status: ${status}`);
      console.log(`      Restarts: ${restarts}`);
      console.log(`      Uptime: ${uptime} minutes`);
      console.log(`      Memory: ${(p.monit.memory / 1024 / 1024).toFixed(2)} MB`);
      console.log("");
    });
  } catch (error) {
    console.log("   ❌ Erreur lecture PM2:", error.message);
  }
}

async function runDiagnostic() {
  await checkBackend();
  await checkProducts();
  await checkUploadFolder();
  await checkImageUrls();
  await checkProcesses();
  
  console.log("🔍 ===== FIN DU DIAGNOSTIC =====");
  console.log("\n📝 PROBLÈMES RAPPORTÉS PAR L'UTILISATEUR:");
  console.log("   1. ❌ Suppression de produit ne fonctionne pas");
  console.log("   2. ❌ Modification produit devient 'Produit Modifié + timestamp'");
  console.log("   3. ❌ Image par défaut s'affiche à l'ajout");
  console.log("   4. ❌ Upload d'images ne fonctionne pas");
  console.log("\n💡 Pour tester avec votre token admin, utilisez:");
  console.log("   node test-product-operations.js");
}

runDiagnostic();
