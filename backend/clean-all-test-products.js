const express = require('express');
const dbConnect = require('./config/dbConnect');
const Product = require('./models/productModel');
const Category = require('./models/prodcategoryModel');
const Brand = require('./models/brandModel');

// Connexion à la base de données
dbConnect();

const cleanAllTestProducts = async () => {
    try {
        console.log('🧹 Démarrage du nettoyage des produits de test...');
        
        // Critères pour identifier les produits de test
        const testCriteria = [
            { title: { $regex: /test/i } },
            { title: { $regex: /sample/i } },
            { title: { $regex: /demo/i } },
            { title: { $regex: /example/i } },
            { title: { $regex: /fake/i } },
            { title: { $regex: /dummy/i } },
            { title: { $regex: /lorem/i } },
            { description: { $regex: /test/i } },
            { description: { $regex: /sample/i } },
            { description: { $regex: /demo/i } },
            { description: { $regex: /lorem ipsum/i } },
            { slug: { $regex: /test/i } },
            { slug: { $regex: /sample/i } },
            { slug: { $regex: /demo/i } }
        ];

        // Rechercher tous les produits de test
        const testProducts = await Product.find({
            $or: testCriteria
        }).populate('category brand');

        console.log(`📊 ${testProducts.length} produits de test trouvés:`);

        if (testProducts.length === 0) {
            console.log('✅ Aucun produit de test trouvé.');
            return;
        }

        // Afficher les produits trouvés
        testProducts.forEach((product, index) => {
            console.log(`${index + 1}. "${product.title}" (${product.slug})`);
            console.log(`   Catégorie: ${product.category?.title || 'N/A'}`);
            console.log(`   Marque: ${product.brand?.title || 'N/A'}`);
            console.log(`   Prix: ${product.price} DT`);
            console.log(`   Créé: ${product.createdAt}`);
            console.log('   ---');
        });

        // Confirmation avant suppression
        console.log('\n⚠️  Voulez-vous vraiment supprimer ces produits?');
        console.log('   Cette action est irréversible!');
        
        // Supprimer les produits de test
        const deleteResult = await Product.deleteMany({
            $or: testCriteria
        });

        console.log(`\n✅ ${deleteResult.deletedCount} produits de test supprimés avec succès!`);

        // Vérifier s'il reste des produits
        const remainingProducts = await Product.countDocuments();
        console.log(`📊 Produits restants dans la base: ${remainingProducts}`);

        // Afficher quelques produits restants pour vérification
        const sampleProducts = await Product.find()
            .select('title price category brand')
            .populate('category brand', 'title')
            .limit(5);

        if (sampleProducts.length > 0) {
            console.log('\n📋 Échantillon des produits restants:');
            sampleProducts.forEach((product, index) => {
                console.log(`${index + 1}. "${product.title}"`);
                console.log(`   Catégorie: ${product.category?.title || 'N/A'}`);
                console.log(`   Marque: ${product.brand?.title || 'N/A'}`);
                console.log(`   Prix: ${product.price} DT`);
            });
        }

        console.log('\n🎉 Nettoyage terminé avec succès!');

    } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
    } finally {
        process.exit(0);
    }
};

// Exécuter le nettoyage
cleanAllTestProducts();