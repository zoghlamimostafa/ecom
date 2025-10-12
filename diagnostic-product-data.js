const axios = require('axios');

async function diagnoseProductData() {
    console.log('🔍 Diagnostic des données produits côté client...');
    
    try {
        // Test 1: Récupérer les produits depuis l'API
        console.log('\n📡 Test 1: Récupération des produits...');
        const response = await axios.get('http://localhost:4000/api/product/');
        const products = response.data;
        
        console.log(`✅ Produits récupérés: ${products.length}`);
        
        // Test 2: Analyser la structure des produits
        console.log('\n🔍 Test 2: Analyse des données produits...');
        
        let problematicProducts = 0;
        let missingId = 0;
        let missingPrice = 0;
        let invalidPrice = 0;
        
        products.forEach((product, index) => {
            const hasId = product._id || product.id;
            const hasPrice = product.price !== undefined && product.price !== null;
            const validPrice = hasPrice && !isNaN(parseFloat(product.price)) && isFinite(product.price);
            
            if (!hasId) {
                missingId++;
                console.log(`❌ Produit ${index + 1}: ID manquant`);
            }
            
            if (!hasPrice) {
                missingPrice++;
                console.log(`❌ Produit ${index + 1} (${product.title}): Prix manquant`);
            } else if (!validPrice) {
                invalidPrice++;
                console.log(`❌ Produit ${index + 1} (${product.title}): Prix invalide (${product.price})`);
            }
            
            if (!hasId || !hasPrice || !validPrice) {
                problematicProducts++;
                console.log(`⚠️ Produit problématique: ${product.title || 'Sans titre'}`);
                console.log(`   ID: ${hasId ? 'OK' : 'MANQUANT'}`);
                console.log(`   Prix: ${hasPrice ? (validPrice ? 'OK' : `INVALIDE (${product.price})`) : 'MANQUANT'}`);
            }
        });
        
        // Test 3: Afficher un échantillon de produits
        console.log('\n📊 Test 3: Échantillon de données...');
        products.slice(0, 3).forEach((product, index) => {
            console.log(`\n📦 Produit ${index + 1}:`);
            console.log(`   ID: ${product._id || product.id || 'MANQUANT'}`);
            console.log(`   Titre: ${product.title || 'MANQUANT'}`);
            console.log(`   Prix: ${product.price || 'MANQUANT'}`);
            console.log(`   Type prix: ${typeof product.price}`);
            console.log(`   Marque: ${product.brand || 'MANQUANT'}`);
            console.log(`   Images: ${Array.isArray(product.images) ? product.images.length : 'INVALIDE'}`);
        });
        
        // Test 4: Résumé
        console.log('\n📈 Résumé du diagnostic:');
        console.log(`   Total produits: ${products.length}`);
        console.log(`   Produits problématiques: ${problematicProducts}`);
        console.log(`   Sans ID: ${missingId}`);
        console.log(`   Sans prix: ${missingPrice}`);
        console.log(`   Prix invalides: ${invalidPrice}`);
        
        if (problematicProducts === 0) {
            console.log('\n✅ Tous les produits ont des données valides !');
        } else {
            console.log('\n⚠️ Des produits ont des données manquantes ou invalides.');
            console.log('\n🔧 Solutions recommandées:');
            
            if (missingId > 0) {
                console.log('   - Vérifier pourquoi certains produits n\'ont pas d\'ID');
            }
            
            if (missingPrice > 0 || invalidPrice > 0) {
                console.log('   - Corriger les prix manquants ou invalides dans la base de données');
                console.log('   - Vérifier le modèle Product et la conversion des types');
            }
        }
        
        // Test 5: Test d'ajout au panier simulé
        console.log('\n🛒 Test 5: Simulation ajout au panier...');
        const firstValidProduct = products.find(p => 
            (p._id || p.id) && 
            p.price !== undefined && 
            !isNaN(parseFloat(p.price))
        );
        
        if (firstValidProduct) {
            console.log('✅ Produit valide trouvé pour test panier:');
            console.log(`   ID: ${firstValidProduct._id || firstValidProduct.id}`);
            console.log(`   Titre: ${firstValidProduct.title}`);
            console.log(`   Prix: ${firstValidProduct.price}`);
            
            // Simuler les données qui seraient envoyées
            const cartData = {
                productId: firstValidProduct._id || firstValidProduct.id,
                quantity: 1,
                price: parseFloat(firstValidProduct.price),
                title: firstValidProduct.title,
                images: firstValidProduct.images
            };
            
            console.log('\n📦 Données qui seraient envoyées au panier:');
            console.log(JSON.stringify(cartData, null, 2));
        } else {
            console.log('❌ Aucun produit valide trouvé pour test panier !');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du diagnostic:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

console.log('🚀 Démarrage du diagnostic des données produits...');
diagnoseProductData()
    .then(() => {
        console.log('\n🎉 Diagnostic terminé');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Erreur fatale:', error);
        process.exit(1);
    });