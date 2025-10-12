// Script pour enrichir tous les produits avec images réalistes et noms attractifs
const { Product, Category, Brand } = require('./backend/models');

// Collections d'images réalistes par catégorie
const imageLibrary = {
    "Électronique": {
        "Samsung": [
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=300&fit=crop&crop=center"
        ],
        "Apple": [
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1605236453806-b25e7d3d4c2d?w=400&h=300&fit=crop&crop=center"
        ],
        "default": [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center"
        ]
    },
    "Informatique": {
        "HP": [
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&crop=center"
        ],
        "Dell": [
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop&crop=center"
        ],
        "default": [
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&crop=center"
        ]
    },
    "Mode Femme": {
        "Zara": [
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center"
        ],
        "H&M": [
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=400&h=300&fit=crop&crop=center"
        ],
        "default": [
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop&crop=center"
        ]
    },
    "Sport": {
        "Nike": [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&crop=center"
        ],
        "Adidas": [
            "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&crop=center"
        ],
        "default": [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"
        ]
    },
    "Jouets": {
        "Lego": [
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1594736797933-d0c4341ad617?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop&crop=center"
        ],
        "Fisher-Price": [
            "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop&crop=center"
        ],
        "default": [
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1594736797933-d0c4341ad617?w=400&h=300&fit=crop&crop=center"
        ]
    },
    "Maison": {
        "IKEA": [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop&crop=center"
        ],
        "default": [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center"
        ]
    },
    "Téléphone": {
        "Samsung": [
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center"
        ],
        "Apple": [
            "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1605236453806-b25e7d3d4c2d?w=400&h=300&fit=crop&crop=center"
        ],
        "default": [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=300&fit=crop&crop=center"
        ]
    },
    "Animaux": {
        "default": [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&crop=center",
            "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=300&fit=crop&crop=center"
        ]
    }
};

// Noms attractifs par catégorie
const productNames = {
    "Électronique": [
        "Smartphone Ultra Premium 📱",
        "Tablette Professionnelle Pro Max",
        "Écouteurs Sans Fil Premium",
        "Montre Connectée Élégante",
        "Enceinte Bluetooth Puissante 🔊",
        "Appareil Photo Numérique HD",
        "Console de Jeu Dernière Génération",
        "Télévision Smart 4K Ultra HD"
    ],
    "Informatique": [
        "Ordinateur Portable Gaming Pro 💻",
        "PC Bureau Haute Performance",
        "Clavier Mécanique RGB",
        "Souris Gaming Précise",
        "Écran 4K Professionnel",
        "Disque SSD Ultra Rapide",
        "Carte Graphique Puissante",
        "Webcam HD Professionnelle"
    ],
    "Mode Femme": [
        "Robe Élégante de Soirée ✨",
        "Jupe Tendance Moderne",
        "Blouse Chic et Confortable",
        "Pantalon Femme Stylé",
        "Veste Femme Fashion",
        "Chaussures Talons Élégantes 👠",
        "Sac à Main Luxueux",
        "Bijoux Fantaisie Brillants"
    ],
    "Sport": [
        "Chaussures Running Pro 👟",
        "Tenue de Sport Complète",
        "Équipement Fitness Premium",
        "Sac de Sport Résistant",
        "Montre Sport Connectée ⌚",
        "Bouteille Sport Isotherme",
        "Tapis de Yoga Antidérapant",
        "Haltères Professionnels"
    ],
    "Jouets": [
        "Jouet Éducatif Interactif 🧸",
        "Puzzle Créatif 1000 Pièces",
        "Jeu de Construction Premium",
        "Peluche Douce et Câline",
        "Voiture Télécommandée 🚗",
        "Jeu de Société Familial",
        "Jouet Musical Éveil",
        "Set Créatif Artistique"
    ],
    "Maison": [
        "Canapé Confortable Premium 🛋️",
        "Table Basse Design Moderne",
        "Lampe Décorative LED",
        "Coussin Déco Élégant",
        "Miroir Mural Stylé",
        "Plante Verte Dépolluante 🌱",
        "Cadre Photo Moderne",
        "Bougie Parfumée Relaxante"
    ],
    "Téléphone": [
        "iPhone Dernière Génération 📱",
        "Samsung Galaxy Ultra",
        "Xiaomi Redmi Pro",
        "Google Pixel Premium",
        "OnePlus Flagship",
        "Huawei P-Series",
        "Nokia Résistant",
        "Sony Xperia Pro"
    ],
    "Animaux": [
        "Nourriture Premium Chat 🐱",
        "Jouet Interactif Chien 🐕",
        "Collier LED Sécurité",
        "Panier Confortable",
        "Brosse de Toilettage",
        "Gamelle Inox Design",
        "Laisse Rétractable Premium",
        "Arbre à Chat Multi-Niveaux"
    ]
};

// Fonction pour obtenir des images aléatoirement
function getRandomImages(category, brand) {
    const categoryImages = imageLibrary[category] || imageLibrary["default"] || imageLibrary["Électronique"];
    const brandImages = categoryImages[brand] || categoryImages["default"] || categoryImages[Object.keys(categoryImages)[0]];
    
    // Mélanger et prendre 2-3 images
    const shuffled = [...brandImages].sort(() => 0.5 - Math.random());
    const selectedImages = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);
    
    return selectedImages.map((url, index) => ({
        public_id: `${category.toLowerCase().replace(' ', '_')}_${brand.toLowerCase()}_${index + 1}`,
        url: url
    }));
}

// Fonction pour obtenir un nom attractif
function getRandomName(category) {
    const names = productNames[category] || productNames["Électronique"];
    return names[Math.floor(Math.random() * names.length)];
}

// Descriptions attractives
function generateDescription(productName, category, brand) {
    const descriptions = {
        "Électronique": `Découvrez le ${productName} de la marque ${brand}. Un produit électronique de qualité supérieure avec des fonctionnalités avancées. Design moderne et performances exceptionnelles pour une expérience utilisateur optimale.`,
        "Informatique": `${productName} ${brand} - L'équipement informatique professionnel qu'il vous faut. Performance, fiabilité et innovation réunies dans un seul produit. Parfait pour le travail et les loisirs.`,
        "Mode Femme": `${productName} - L'élégance à l'état pur ! Cette pièce ${brand} sublime votre style avec un design tendance et un confort exceptionnel. Parfaite pour toutes les occasions spéciales.`,
        "Sport": `${productName} ${brand} - Équipement sportif haute performance pour dépasser vos limites. Design ergonomique et matériaux de qualité pour accompagner vos sessions d'entraînement.`,
        "Jouets": `${productName} - Le jouet parfait pour stimuler la créativité et l'imagination ! De la marque ${brand}, ce jouet combine amusement et apprentissage pour des heures de plaisir.`,
        "Maison": `${productName} - Transformez votre intérieur avec ce produit ${brand} au design sophistiqué. Alliant style et fonctionnalité pour un foyer harmonieux et moderne.`,
        "Téléphone": `${productName} ${brand} - La technologie mobile à son apogée. Écran haute résolution, performances ultra-rapides et design premium pour rester connecté avec style.`,
        "Animaux": `${productName} - Pour le bien-être de votre compagnon à quatre pattes. Produit de qualité ${brand} conçu avec amour pour apporter bonheur et confort à votre animal.`
    };
    
    return descriptions[category] || descriptions["Électronique"];
}

async function enrichProducts() {
    console.log('🚀 Démarrage de l\'enrichissement des produits...\n');
    
    try {
        // Récupérer tous les produits
        const products = await Product.findAll();
        console.log(`📦 ${products.length} produits trouvés à enrichir\n`);
        
        let updatedCount = 0;
        
        for (const product of products) {
            try {
                // Générer de nouvelles images
                const newImages = getRandomImages(product.category, product.brand);
                
                // Générer un nouveau nom attractif
                const newName = getRandomName(product.category);
                
                // Générer une nouvelle description
                const newDescription = generateDescription(newName, product.category, product.brand);
                
                // Mettre à jour le produit
                await Product.update({
                    title: newName,
                    description: newDescription,
                    images: JSON.stringify(newImages),
                    tags: JSON.stringify(['featured', 'popular', 'bestseller'])
                }, {
                    where: { id: product.id }
                });
                
                console.log(`✅ Produit ${product.id} enrichi: "${newName}"`);
                console.log(`   📁 Catégorie: ${product.category}`);
                console.log(`   🏷️  Marque: ${product.brand}`);
                console.log(`   🖼️  Images: ${newImages.length} nouvelles images`);
                console.log(`   💰 Prix: ${product.price}€`);
                console.log('');
                
                updatedCount++;
                
            } catch (error) {
                console.error(`❌ Erreur lors de l'enrichissement du produit ${product.id}:`, error.message);
            }
        }
        
        console.log(`\n🎉 ENRICHISSEMENT TERMINÉ !`);
        console.log(`✅ ${updatedCount} produits ont été enrichis avec succès`);
        console.log(`📊 Récapitulatif:`);
        console.log(`   - Nouvelles images réalistes ajoutées`);
        console.log(`   - Noms attractifs générés`);
        console.log(`   - Descriptions détaillées créées`);
        console.log(`   - Tags promotionnels ajoutés`);
        
    } catch (error) {
        console.error('❌ Erreur globale:', error.message);
        console.error(error.stack);
    }
    
    process.exit(0);
}

// Démarrage du script
enrichProducts();