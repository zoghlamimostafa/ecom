const axios = require('axios');

async function diagnoseClientImages() {
    console.log('🖼️ Diagnostic des images côté client...\n');
    
    try {
        // Étape 1: Récupérer les produits de l'API
        console.log('📡 Récupération des produits...');
        const response = await axios.get('http://localhost:4000/api/product/');
        const products = response.data;
        
        console.log(`✅ ${products.length} produits récupérés\n`);
        
        // Étape 2: Analyser la structure des images
        console.log('🔍 Analyse de la structure des images...');
        
        const sampleProducts = products.slice(0, 3);
        
        sampleProducts.forEach((product, index) => {
            console.log(`\n📦 Produit ${index + 1}: ${product.title}`);
            console.log(`   ID: ${product.id || product._id}`);
            console.log(`   Images brutes: ${typeof product.images}`);
            
            if (typeof product.images === 'string') {
                try {
                    const parsedImages = JSON.parse(product.images);
                    console.log(`   ✅ Images parsées: ${Array.isArray(parsedImages) ? parsedImages.length : 'Non-array'} éléments`);
                    
                    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                        console.log(`   🖼️ Première image:`);
                        console.log(`      URL: ${parsedImages[0].url || 'Manquante'}`);
                        console.log(`      Public ID: ${parsedImages[0].public_id || 'Manquant'}`);
                    }
                } catch (e) {
                    console.log(`   ❌ Erreur parsing JSON: ${e.message}`);
                    console.log(`   📄 Contenu brut: ${product.images.substring(0, 100)}...`);
                }
            } else if (Array.isArray(product.images)) {
                console.log(`   ✅ Images déjà array: ${product.images.length} éléments`);
                if (product.images.length > 0) {
                    console.log(`   🖼️ Première image URL: ${product.images[0].url || 'Manquante'}`);
                }
            } else {
                console.log(`   ⚠️ Type inattendu: ${typeof product.images}`);
            }
            
            // Analyser les couleurs aussi
            console.log(`   Couleurs brutes: ${typeof product.color}`);
            if (typeof product.color === 'string' && product.color !== 'null') {
                try {
                    const parsedColors = JSON.parse(product.color);
                    console.log(`   ✅ Couleurs parsées: ${Array.isArray(parsedColors) ? parsedColors.length : 'Non-array'} éléments`);
                } catch (e) {
                    console.log(`   ❌ Erreur parsing couleurs: ${e.message}`);
                }
            }
        });
        
        // Étape 3: Simuler le parsing côté client
        console.log('\n🔧 Simulation du parsing côté client...');
        
        const normalizeProduct = (product) => {
            const normalized = { ...product };
            
            // Normaliser les images
            if (typeof normalized.images === 'string' && normalized.images !== 'null') {
                try {
                    normalized.images = JSON.parse(normalized.images);
                } catch (e) {
                    console.log(`   ⚠️ Erreur parsing images pour ${product.title}: ${e.message}`);
                    normalized.images = [];
                }
            }
            
            if (!Array.isArray(normalized.images)) {
                normalized.images = [];
            }
            
            // Normaliser les couleurs
            if (typeof normalized.color === 'string' && normalized.color !== 'null') {
                try {
                    normalized.color = JSON.parse(normalized.color);
                } catch (e) {
                    normalized.color = [];
                }
            }
            
            if (!Array.isArray(normalized.color)) {
                normalized.color = [];
            }
            
            return normalized;
        };
        
        const normalizedProducts = products.map(normalizeProduct);
        
        const validImageCount = normalizedProducts.filter(p => p.images.length > 0).length;
        const validColorCount = normalizedProducts.filter(p => p.color.length > 0).length;
        
        console.log(`✅ Après normalisation:`);
        console.log(`   Produits avec images valides: ${validImageCount}/${products.length}`);
        console.log(`   Produits avec couleurs valides: ${validColorCount}/${products.length}`);
        
        // Étape 4: Tester l'affichage d'une image
        console.log('\n🌐 Test de validité des URLs d\'images...');
        
        const productWithImage = normalizedProducts.find(p => p.images.length > 0);
        
        if (productWithImage) {
            const imageUrl = productWithImage.images[0].url;
            console.log(`🖼️ Test de l'URL: ${imageUrl}`);
            
            try {
                const imageResponse = await axios.head(imageUrl, { timeout: 5000 });
                console.log(`✅ Image accessible - Status: ${imageResponse.status}`);
                console.log(`   Content-Type: ${imageResponse.headers['content-type']}`);
            } catch (imageError) {
                console.log(`❌ Image non accessible: ${imageError.message}`);
                if (imageError.response) {
                    console.log(`   Status: ${imageError.response.status}`);
                }
            }
        } else {
            console.log('❌ Aucun produit avec images trouvé');
        }
        
        console.log('\n📋 Résumé des problèmes identifiés:');
        const problems = [];
        
        if (validImageCount === 0) {
            problems.push('Aucune image valide trouvée');
        }
        
        if (validImageCount < products.length / 2) {
            problems.push('Beaucoup de produits sans images');
        }
        
        if (problems.length === 0) {
            console.log('✅ Aucun problème majeur détecté');
        } else {
            problems.forEach(problem => console.log(`❌ ${problem}`));
        }
        
        console.log('\n🔧 Solutions recommandées:');
        console.log('1. Ajouter normalisation dans productService.js côté client');
        console.log('2. Mettre à jour ProductCard.js pour gérer les images normalisées');
        console.log('3. Vérifier que les URLs Cloudinary sont valides');
        console.log('4. Ajouter des images par défaut pour les produits sans images');
        
    } catch (error) {
        console.error('❌ Erreur lors du diagnostic:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n🚨 Le serveur backend n\'est pas accessible !');
            console.log('   Vérifiez que le serveur sur le port 4000 fonctionne');
        }
    }
}

console.log('🚀 Démarrage du diagnostic des images client...');
diagnoseClientImages()
    .then(() => {
        console.log('\n🎉 Diagnostic terminé');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Erreur fatale:', error);
        process.exit(1);
    });