const { Category } = require('./models');

// 14 Catégories principales standard pour e-commerce complet
const mainCategories = [
    {
        title: 'Électronique',
        slug: 'electronique',
        description: 'Appareils électroniques, TV, audio, vidéo',
        icon: '📱',
        sortOrder: 1
    },
    {
        title: 'Informatique',
        slug: 'informatique',
        description: 'Ordinateurs, accessoires, logiciels',
        icon: '💻',
        sortOrder: 2
    },
    {
        title: 'Téléphones et Tablettes',
        slug: 'telephones-tablettes',
        description: 'Smartphones, tablettes, accessoires',
        icon: '📱',
        sortOrder: 3
    },
    {
        title: 'Mode Homme',
        slug: 'mode-homme',
        description: 'Vêtements, chaussures, accessoires homme',
        icon: '👔',
        sortOrder: 4
    },
    {
        title: 'Mode Femme',
        slug: 'mode-femme',
        description: 'Vêtements, chaussures, accessoires femme',
        icon: '👗',
        sortOrder: 5
    },
    {
        title: 'Bébé et Puériculture',
        slug: 'bebe-puericulture',
        description: 'Tout pour bébé et enfants',
        icon: '👶',
        sortOrder: 6
    },
    {
        title: 'Maison et Bureau',
        slug: 'maison-bureau',
        description: 'Meubles, décoration, fournitures bureau',
        icon: '🏠',
        sortOrder: 7
    },
    {
        title: 'Jardin et Bricolage',
        slug: 'jardin-bricolage',
        description: 'Outils, jardinage, quincaillerie',
        icon: '🔨',
        sortOrder: 8
    },
    {
        title: 'Sport et Fitness',
        slug: 'sport-fitness',
        description: 'Équipements sportifs, fitness, outdoor',
        icon: '⚽',
        sortOrder: 9
    },
    {
        title: 'Automobile',
        slug: 'automobile',
        description: 'Pièces auto, accessoires, entretien',
        icon: '🚗',
        sortOrder: 10
    },
    {
        title: 'Santé et Beauté',
        slug: 'sante-beaute',
        description: 'Cosmétiques, soins, bien-être',
        icon: '💄',
        sortOrder: 11
    },
    {
        title: 'Animaux',
        slug: 'animaux',
        description: 'Accessoires et nourriture pour animaux',
        icon: '🐾',
        sortOrder: 12
    },
    {
        title: 'Jeux et Jouets',
        slug: 'jeux-jouets',
        description: 'Jeux vidéo, jouets, consoles',
        icon: '🎮',
        sortOrder: 13
    },
    {
        title: 'Autres',
        slug: 'autres',
        description: 'Autres produits divers',
        icon: '📦',
        sortOrder: 14
    }
];

async function initializeCategories() {
    try {
        console.log('🚀 Initialisation des catégories principales...\n');
        console.log('='.repeat(70));
        
        let added = 0;
        let updated = 0;
        let skipped = 0;

        for (const catData of mainCategories) {
            // Vérifier si la catégorie existe déjà
            const existing = await Category.findOne({
                where: { slug: catData.slug }
            });

            if (existing) {
                // Mettre à jour si nécessaire
                const needsUpdate = 
                    existing.title !== catData.title ||
                    existing.description !== catData.description ||
                    existing.icon !== catData.icon ||
                    existing.sortOrder !== catData.sortOrder;

                if (needsUpdate) {
                    await existing.update({
                        title: catData.title,
                        description: catData.description,
                        icon: catData.icon,
                        sortOrder: catData.sortOrder,
                        isActive: true
                    });
                    console.log(`🔄 Mise à jour : ${catData.icon} ${catData.title}`);
                    updated++;
                } else {
                    console.log(`✓  Déjà OK    : ${catData.icon} ${catData.title}`);
                    skipped++;
                }
            } else {
                // Créer la nouvelle catégorie
                await Category.create({
                    title: catData.title,
                    slug: catData.slug,
                    description: catData.description,
                    icon: catData.icon,
                    level: 0,
                    parentId: null,
                    sortOrder: catData.sortOrder,
                    isActive: true
                });
                console.log(`✅ NOUVEAU    : ${catData.icon} ${catData.title}`);
                added++;
            }
        }

        // Statistiques finales
        const totalCategories = await Category.count();
        const mainCount = await Category.count({ where: { level: 0 } });
        const subCount = await Category.count({ where: { level: 1 } });
        
        console.log('='.repeat(70));
        console.log('\n📊 RÉSUMÉ DE L\'INITIALISATION');
        console.log('='.repeat(70));
        console.log(`✅ Nouvelles catégories créées : ${added}`);
        console.log(`🔄 Catégories mises à jour      : ${updated}`);
        console.log(`✓  Catégories déjà à jour       : ${skipped}`);
        console.log('─'.repeat(70));
        console.log(`📦 TOTAL dans la base           : ${totalCategories} catégories`);
        console.log(`   ├─ Catégories principales    : ${mainCount}`);
        console.log(`   └─ Sous-catégories           : ${subCount}`);
        console.log('='.repeat(70));
        console.log('\n✨ Initialisation terminée avec succès!\n');

        // Afficher la liste complète des catégories principales
        const allMainCategories = await Category.findAll({
            where: { level: 0 },
            order: [['sortOrder', 'ASC']]
        });

        console.log('\n📋 CATÉGORIES PRINCIPALES DISPONIBLES:');
        console.log('='.repeat(70));
        allMainCategories.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat.icon || '📦'} ${cat.title.padEnd(30)} (${cat.slug})`);
        });
        console.log('='.repeat(70));

        process.exit(0);
    } catch (error) {
        console.error('\n❌ ERREUR lors de l\'initialisation:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Exécuter l'initialisation
console.log('\n' + '='.repeat(70));
console.log('🎯 SCRIPT D\'INITIALISATION DES CATÉGORIES');
console.log('='.repeat(70) + '\n');

initializeCategories();
