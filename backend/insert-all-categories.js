const { Category } = require('./models');
const { sequelize } = require('./config/database-sqlite');

const categories = [
  // Auto & Moto
  {
    title: "Auto & Moto",
    slug: "auto-moto",
    description: "Tout pour votre véhicule",
    parentId: null,
    subcategories: [
      {
        title: "Pièces détachées",
        slug: "pieces-detachees",
        description: "Pièces de rechange",
        subcategories: [
          { title: "Moteur et transmission", slug: "moteur-transmission" },
          { title: "Freinage", slug: "freinage" },
          { title: "Suspension et direction", slug: "suspension-direction" },
          { title: "Échappement", slug: "echappement" },
          { title: "Carrosserie", slug: "carrosserie" }
        ]
      },
      {
        title: "Accessoires",
        slug: "accessoires-auto",
        description: "Accessoires pour véhicules",
        subcategories: [
          { title: "Intérieur (volants, sièges, tapis)", slug: "accessoires-interieur" },
          { title: "Extérieur (ailes, rétroviseurs)", slug: "accessoires-exterieur" },
          { title: "Éclairage (phares, feux)", slug: "eclairage-auto" }
        ]
      },
      {
        title: "Entretien",
        slug: "entretien-auto",
        description: "Produits d'entretien",
        subcategories: [
          { title: "Huiles et lubrifiants", slug: "huiles-lubrifiants" },
          { title: "Liquides (frein, refroidissement)", slug: "liquides-auto" },
          { title: "Nettoyage et carrosserie", slug: "nettoyage-carrosserie" },
          { title: "Outillage spécialisé", slug: "outillage-auto" }
        ]
      },
      {
        title: "Équipement moto",
        slug: "equipement-moto",
        description: "Équipement pour motards",
        subcategories: [
          { title: "Casques et protections", slug: "casques-protections" },
          { title: "Vêtements moto", slug: "vetements-moto" },
          { title: "Accessoires spécifiques", slug: "accessoires-moto" }
        ]
      }
    ]
  },

  // Beauté et Bien-être
  {
    title: "Beauté et Bien-être",
    slug: "beaute-bien-etre",
    description: "Soins et beauté",
    parentId: null,
    subcategories: [
      {
        title: "Soins visage",
        slug: "soins-visage",
        description: "Produits pour le visage",
        subcategories: [
          { title: "Nettoyants et démaquillants", slug: "nettoyants-demaquillants" },
          { title: "Hydratants", slug: "hydratants-visage" },
          { title: "Anti-âge", slug: "anti-age" },
          { title: "Masques", slug: "masques-visage" },
          { title: "Soins spécifiques (yeux, lèvres)", slug: "soins-specifiques-visage" }
        ]
      },
      {
        title: "Soins corps",
        slug: "soins-corps",
        description: "Produits pour le corps",
        subcategories: [
          { title: "Hydratants corporels", slug: "hydratants-corporels" },
          { title: "Gommage et exfoliants", slug: "gommage-exfoliants" },
          { title: "Soins mains et pieds", slug: "soins-mains-pieds" },
          { title: "Produits pour le bain et douche", slug: "bain-douche" }
        ]
      },
      {
        title: "Maquillage",
        slug: "maquillage",
        description: "Produits de maquillage",
        subcategories: [
          { title: "Teint (fond de teint, poudre)", slug: "maquillage-teint" },
          { title: "Yeux (fards à paupières, mascara)", slug: "maquillage-yeux" },
          { title: "Lèvres (rouges à lèvres, gloss)", slug: "maquillage-levres" },
          { title: "Joues (fards à joues)", slug: "maquillage-joues" }
        ]
      },
      {
        title: "Parfums",
        slug: "parfums",
        description: "Fragrances",
        subcategories: [
          { title: "Parfums femmes", slug: "parfums-femmes" },
          { title: "Parfums hommes", slug: "parfums-hommes" },
          { title: "Eaux de toilette", slug: "eaux-toilette" },
          { title: "Eaux de parfum", slug: "eaux-parfum" }
        ]
      },
      {
        title: "Appareils de beauté",
        slug: "appareils-beaute",
        description: "Appareils électriques",
        subcategories: [
          { title: "Épilation électrique", slug: "epilation-electrique" },
          { title: "Soins du visage (nettoyeurs, appareils de massage)", slug: "appareils-soins-visage" },
          { title: "Soins des cheveux (brosses chauffantes)", slug: "appareils-soins-cheveux" }
        ]
      },
      {
        title: "Hygiène dentaire",
        slug: "hygiene-dentaire",
        description: "Soins dentaires",
        subcategories: [
          { title: "Brosses à dents électriques", slug: "brosses-dents-electriques" },
          { title: "Fils dentaires et hydropulseurs", slug: "fils-dentaires" }
        ]
      },
      {
        title: "Bien-être",
        slug: "bien-etre",
        description: "Relaxation et bien-être",
        subcategories: [
          { title: "Diffusion d'huiles essentielles", slug: "huiles-essentielles" },
          { title: "Produits de relaxation", slug: "produits-relaxation" },
          { title: "Soins spa à domicile", slug: "soins-spa" }
        ]
      }
    ]
  },

  // Bricolage
  {
    title: "Bricolage",
    slug: "bricolage",
    description: "Outils et matériaux",
    parentId: null,
    subcategories: [
      {
        title: "Outillage à main",
        slug: "outillage-main",
        description: "Outils manuels",
        subcategories: [
          { title: "Tournevis et clés", slug: "tournevis-cles" },
          { title: "Pinces et tenailles", slug: "pinces-tenailles" },
          { title: "Marteaux et maillets", slug: "marteaux-maillets" },
          { title: "Cutter et outils de coupe", slug: "cutter-outils-coupe" }
        ]
      },
      {
        title: "Outillage électrique",
        slug: "outillage-electrique",
        description: "Outils électriques",
        subcategories: [
          { title: "Perceuses et visseuses", slug: "perceuses-visseuses" },
          { title: "Meuleuses et ponceuses", slug: "meuleuses-ponceuses" },
          { title: "Scies électriques", slug: "scies-electriques" },
          { title: "Outils multifonctions", slug: "outils-multifonctions" }
        ]
      },
      {
        title: "Quincaillerie",
        slug: "quincaillerie",
        description: "Fixations et fermetures",
        subcategories: [
          { title: "Vis, boulons et écrous", slug: "vis-boulons-ecrous" },
          { title: "Chevilles et fixations", slug: "chevilles-fixations" },
          { title: "Charnières et paumelles", slug: "charnieres-paumelles" },
          { title: "Serrures et fermetures", slug: "serrures-fermetures" }
        ]
      },
      {
        title: "Peinture et revêtements",
        slug: "peinture-revetements",
        description: "Décoration murale",
        subcategories: [
          { title: "Peintures (murs, boiseries)", slug: "peintures" },
          { title: "Enduits et mastics", slug: "enduits-mastics" },
          { title: "Papiers peints", slug: "papiers-peints" },
          { title: "Revêtements de sol", slug: "revetements-sol" }
        ]
      },
      {
        title: "Électricité",
        slug: "electricite-bricolage",
        description: "Matériel électrique",
        subcategories: [
          { title: "Câbles et fils électriques", slug: "cables-fils" },
          { title: "Interrupteurs et prises", slug: "interrupteurs-prises" },
          { title: "Disjoncteurs et fusibles", slug: "disjoncteurs-fusibles" },
          { title: "Éclairage (ampoules, spots)", slug: "eclairage-bricolage" }
        ]
      },
      {
        title: "Plomberie",
        slug: "plomberie",
        description: "Matériel de plomberie",
        subcategories: [
          { title: "Tubes et raccords", slug: "tubes-raccords" },
          { title: "Robinetterie", slug: "robinetterie" },
          { title: "Joints et colles", slug: "joints-colles" },
          { title: "Outils de plombier", slug: "outils-plombier" }
        ]
      },
      {
        title: "Jardinage",
        slug: "jardinage",
        description: "Outils de jardin",
        subcategories: [
          { title: "Outils manuels (bêches, râteaux)", slug: "outils-jardin-manuels" },
          { title: "Outils motorisés (tondeuses, taille-haies)", slug: "outils-jardin-motorises" },
          { title: "Arrosage (tuyaux, arroseurs)", slug: "arrosage" }
        ]
      }
    ]
  },

  // Cuisine
  {
    title: "Cuisine",
    slug: "cuisine",
    description: "Électroménager et ustensiles",
    parentId: null,
    subcategories: [
      {
        title: "Robot cuisine",
        slug: "robot-cuisine",
        description: "Robots de cuisine",
        subcategories: [
          { title: "Robot Pétrin", slug: "robot-petrin" },
          { title: "Robot multifonction", slug: "robot-multifonction" },
          { title: "Hachoir", slug: "hachoir" },
          { title: "Mixeur plongeant", slug: "mixeur-plongeant" },
          { title: "Mixeur", slug: "mixeur" },
          { title: "Blender", slug: "blender" },
          { title: "Batteur", slug: "batteur" },
          { title: "Machine de jus", slug: "machine-jus" }
        ]
      },
      {
        title: "Appareils de cuisson",
        slug: "appareils-cuisson",
        description: "Cuisson",
        subcategories: [
          { title: "Four électrique", slug: "four-electrique" },
          { title: "Friteuse sans huile", slug: "friteuse-sans-huile" },
          { title: "Micro onde", slug: "micro-onde" },
          { title: "Grills électriques", slug: "grills-electriques" },
          { title: "Friteuse", slug: "friteuse" },
          { title: "Poêle électrique", slug: "poele-electrique" },
          { title: "Grille pain", slug: "grille-pain" }
        ]
      },
      {
        title: "Café & petit déjeuner",
        slug: "cafe-petit-dejeuner",
        description: "Petit déjeuner",
        subcategories: [
          { title: "Cafetière", slug: "cafetiere" },
          { title: "Bouilloire", slug: "bouilloire" },
          { title: "Moulin café", slug: "moulin-cafe" },
          { title: "Mousseur à lait", slug: "mousseur-lait" },
          { title: "Grille-Pain", slug: "grille-pain-2" }
        ]
      },
      {
        title: "Gros Électroménager",
        slug: "gros-electromenager",
        description: "Électroménager principal",
        subcategories: [
          { title: "Plaque de cuisson", slug: "plaque-cuisson" },
          { title: "Cuisinière", slug: "cuisiniere" },
          { title: "Hotte", slug: "hotte" },
          { title: "Congélateur", slug: "congelateur" },
          { title: "Machine à laver", slug: "machine-laver" },
          { title: "Réfrigérateur", slug: "refrigerateur" },
          { title: "Mini bar", slug: "mini-bar" },
          { title: "Four encastrable", slug: "four-encastrable" },
          { title: "Pièces et accessoires pour réfrigérateur", slug: "pieces-refrigerateur" }
        ]
      },
      {
        title: "Ustensiles de cuisine",
        slug: "ustensiles-cuisine",
        description: "Ustensiles",
        subcategories: [
          { title: "Couteaux et planches à découper", slug: "couteaux-planches" },
          { title: "Casseroles et poêles", slug: "casseroles-poeles" },
          { title: "Ustensiles de cuisson (spatules, louches)", slug: "ustensiles-cuisson" },
          { title: "Vaisselle et arts de la table", slug: "vaisselle-arts-table" }
        ]
      },
      {
        title: "Conservation alimentaire",
        slug: "conservation-alimentaire",
        description: "Conservation",
        subcategories: [
          { title: "Boîtes de conservation", slug: "boites-conservation" },
          { title: "Sacs de congélation", slug: "sacs-congelation" },
          { title: "Films alimentaires", slug: "films-alimentaires" },
          { title: "Sachets de conservation", slug: "sachets-conservation" }
        ]
      }
    ]
  },

  // Epicerie
  {
    title: "Epicerie",
    slug: "epicerie",
    description: "Alimentation",
    parentId: null,
    subcategories: [
      {
        title: "Produits frais",
        slug: "produits-frais",
        description: "Frais du jour",
        subcategories: [
          { title: "Fruits et légumes", slug: "fruits-legumes" },
          { title: "Produits laitiers", slug: "produits-laitiers" },
          { title: "Viandes et volailles", slug: "viandes-volailles" },
          { title: "Poissons et fruits de mer", slug: "poissons-fruits-mer" },
          { title: "Œufs", slug: "oeufs" }
        ]
      },
      {
        title: "Produits secs",
        slug: "produits-secs",
        description: "Épicerie sèche",
        subcategories: [
          { title: "Pâtes, riz et céréales", slug: "pates-riz-cereales" },
          { title: "Farines et levures", slug: "farines-levures" },
          { title: "Légumineuses (lentilles, haricots)", slug: "legumineuses" },
          { title: "Conserves (légumes, fruits, plats préparés)", slug: "conserves" }
        ]
      },
      {
        title: "Boissons",
        slug: "boissons",
        description: "Toutes les boissons",
        subcategories: [
          { title: "Eaux plates et gazeuses", slug: "eaux" },
          { title: "Sodas et jus de fruits", slug: "sodas-jus" },
          { title: "Boissons énergisantes", slug: "boissons-energisantes" },
          { title: "Sirops et concentrés", slug: "sirops-concentres" }
        ]
      },
      {
        title: "Surgelés",
        slug: "surgeles",
        description: "Produits surgelés",
        subcategories: [
          { title: "Légumes surgelés", slug: "legumes-surgeles" },
          { title: "Plats préparés surgelés", slug: "plats-surgeles" },
          { title: "Glaces et sorbets", slug: "glaces-sorbets" },
          { title: "Viandes et poissons surgelés", slug: "viandes-poissons-surgeles" }
        ]
      },
      {
        title: "Épicerie sucrée",
        slug: "epicerie-sucree",
        description: "Produits sucrés",
        subcategories: [
          { title: "Biscuits et gâteaux", slug: "biscuits-gateaux" },
          { title: "Chocolats et confiseries", slug: "chocolats-confiseries" },
          { title: "Confitures et pâtes à tartiner", slug: "confitures-pates-tartiner" },
          { title: "Céréales petit-déjeuner", slug: "cereales-petit-dejeuner" }
        ]
      },
      {
        title: "Épicerie salée",
        slug: "epicerie-salee",
        description: "Produits salés",
        subcategories: [
          { title: "Apéritifs (cacahuètes, chips)", slug: "aperitifs" },
          { title: "Sauces et condiments", slug: "sauces-condiments" },
          { title: "Soupes et bouillons", slug: "soupes-bouillons" },
          { title: "Pain et pâtisseries salées", slug: "pain-patisseries-salees" }
        ]
      },
      {
        title: "Bio et diététique",
        slug: "bio-dietetique",
        description: "Alimentation bio",
        subcategories: [
          { title: "Produits sans gluten", slug: "sans-gluten" },
          { title: "Produits vegan", slug: "produits-vegan" },
          { title: "Compléments alimentaires", slug: "complements-alimentaires" },
          { title: "Produits sans sucre ajouté", slug: "sans-sucre-ajoute" }
        ]
      }
    ]
  },

  // Fournitures de bureau
  {
    title: "Fournitures de bureau",
    slug: "fournitures-bureau",
    description: "Bureau et papeterie",
    parentId: null,
    subcategories: [
      {
        title: "Papeterie",
        slug: "papeterie",
        description: "Articles de papeterie",
        subcategories: [
          { title: "Papier (ramettes, blocs-notes)", slug: "papier" },
          { title: "Enveloppes et pochettes", slug: "enveloppes-pochettes" },
          { title: "Classeurs et chemises", slug: "classeurs-chemises" },
          { title: "Agrafeuses et perforatrices", slug: "agrafeuses-perforatrices" }
        ]
      },
      {
        title: "Écriture",
        slug: "ecriture",
        description: "Instruments d'écriture",
        subcategories: [
          { title: "Stylos (bille, plume, gel)", slug: "stylos" },
          { title: "Crayons (papier, couleur)", slug: "crayons" },
          { title: "Marqueurs et surligneurs", slug: "marqueurs-surligneurs" },
          { title: "Correcteurs et effaceurs", slug: "correcteurs-effaceurs" }
        ]
      },
      {
        title: "Organisation",
        slug: "organisation-bureau",
        description: "Organisation",
        subcategories: [
          { title: "Agenda et calendriers", slug: "agenda-calendriers" },
          { title: "Planning et tableaux", slug: "planning-tableaux" },
          { title: "Range-documents", slug: "range-documents" },
          { title: "Tri et classement", slug: "tri-classement" }
        ]
      },
      {
        title: "Informatique bureau",
        slug: "informatique-bureau",
        description: "Informatique",
        subcategories: [
          { title: "Cartouches d'encre et toners", slug: "cartouches-toners" },
          { title: "Papier photo et spécialisé", slug: "papier-photo" },
          { title: "Clés USB et disques durs", slug: "cles-usb-disques" },
          { title: "Accessoires ordinateur", slug: "accessoires-ordinateur-bureau" }
        ]
      },
      {
        title: "Mobilier de bureau",
        slug: "mobilier-bureau",
        description: "Meubles de bureau",
        subcategories: [
          { title: "Bureaux et tables", slug: "bureaux-tables" },
          { title: "Chaises et fauteuils", slug: "chaises-fauteuils-bureau" },
          { title: "Meubles de classement", slug: "meubles-classement" },
          { title: "Accessoires de bureau", slug: "accessoires-bureau" }
        ]
      },
      {
        title: "Archivage",
        slug: "archivage",
        description: "Archivage documents",
        subcategories: [
          { title: "Boîtes d'archives", slug: "boites-archives" },
          { title: "Chemises et intercalaires", slug: "chemises-intercalaires" },
          { title: "Etiquettes et codes couleurs", slug: "etiquettes-codes-couleurs" },
          { title: "Matériel de reliure", slug: "materiel-reliure" }
        ]
      }
    ]
  },

  // High-Tech
  {
    title: "High-Tech",
    slug: "high-tech",
    description: "Technologies",
    parentId: null,
    subcategories: [
      {
        title: "Téléphonie",
        slug: "telephonie",
        description: "Téléphones et accessoires",
        subcategories: [
          { title: "Smartphones", slug: "smartphones" },
          { title: "Tablettes", slug: "tablettes" },
          { title: "Accessoires (coques, écrans de protection)", slug: "accessoires-telephonie" },
          { title: "Montres connectées", slug: "montres-connectees" }
        ]
      },
      {
        title: "Photo et vidéo",
        slug: "photo-video",
        description: "Appareils photo",
        subcategories: [
          { title: "Appareils photo", slug: "appareils-photo" },
          { title: "Caméras", slug: "cameras" },
          { title: "Objectifs", slug: "objectifs" },
          { title: "Accessoires (trépieds, sacs)", slug: "accessoires-photo" }
        ]
      },
      {
        title: "Audio",
        slug: "audio",
        description: "Audio et son",
        subcategories: [
          { title: "Casques et écouteurs", slug: "casques-ecouteurs" },
          { title: "Enceintes connectées", slug: "enceintes-connectees" },
          { title: "Home cinéma", slug: "home-cinema" },
          { title: "Enceintes portables", slug: "enceintes-portables" }
        ]
      },
      {
        title: "TV et projection",
        slug: "tv-projection",
        description: "Télévisions",
        subcategories: [
          { title: "Téléviseurs", slug: "televiseurs" },
          { title: "Vidéoprojecteurs", slug: "videoprojecteurs" },
          { title: "Accessoires TV (supports, fixations)", slug: "accessoires-tv" },
          { title: "Barres de son", slug: "barres-son" }
        ]
      },
      {
        title: "Gaming",
        slug: "gaming",
        description: "Jeux vidéo",
        subcategories: [
          { title: "Consoles de jeux", slug: "consoles-jeux" },
          { title: "Jeux vidéo", slug: "jeux-video" },
          { title: "Accessoires gaming (manettes, volants)", slug: "accessoires-gaming" },
          { title: "PC gaming", slug: "pc-gaming" }
        ]
      },
      {
        title: "Connectivité",
        slug: "connectivite",
        description: "Réseaux et connexions",
        subcategories: [
          { title: "Câbles et connectiques", slug: "cables-connectiques" },
          { title: "Hubs et adaptateurs", slug: "hubs-adaptateurs" },
          { title: "Réseaux (routeurs, répéteurs)", slug: "reseaux" },
          { title: "Stockage (NAS, disques réseau)", slug: "stockage-reseau" }
        ]
      }
    ]
  },

  // Hygiène et Santé
  {
    title: "Hygiène et Santé",
    slug: "hygiene-sante",
    description: "Hygiène et soins",
    parentId: null,
    subcategories: [
      {
        title: "Hygiène corporelle",
        slug: "hygiene-corporelle",
        description: "Hygiène du corps",
        subcategories: [
          { title: "Gels douche et savons", slug: "gels-douche-savons" },
          { title: "Shampoings et après-shampoings", slug: "shampoings-apres-shampoings" },
          { title: "Déodorants", slug: "deodorants" },
          { title: "Produits intimes", slug: "produits-intimes" }
        ]
      },
      {
        title: "Hygiène bucco-dentaire",
        slug: "hygiene-bucco-dentaire",
        description: "Soins dentaires",
        subcategories: [
          { title: "Brosses à dents", slug: "brosses-dents" },
          { title: "Dentifrices", slug: "dentifrices" },
          { title: "Fils dentaires et brossettes", slug: "fils-dentaires-brossettes" },
          { title: "Bains de bouche", slug: "bains-bouche" }
        ]
      },
      {
        title: "Soins médicaux",
        slug: "soins-medicaux",
        description: "Matériel médical",
        subcategories: [
          { title: "Tensiomètres", slug: "tensiometres" },
          { title: "Thermomètres", slug: "thermometres" },
          { title: "Premiers secours", slug: "premiers-secours" },
          { title: "Orthopédie", slug: "orthopedie" }
        ]
      }
    ]
  }
];

async function insertCategories() {
  try {
    await sequelize.sync();
    
    console.log('🚀 Début de l\'insertion des catégories...\n');
    
    let totalCount = 0;
    
    for (const mainCat of categories) {
      // Insérer la catégorie principale
      const [mainCategory, created] = await Category.findOrCreate({
        where: { slug: mainCat.slug },
        defaults: {
          title: mainCat.title,
          description: mainCat.description,
          parentId: null,
          level: 0
        }
      });
      
      if (created) {
        console.log(`✅ Catégorie principale créée: ${mainCategory.title}`);
        totalCount++;
      } else {
        console.log(`⏭️  Catégorie principale existe déjà: ${mainCategory.title}`);
      }
      
      // Insérer les sous-catégories de niveau 1
      if (mainCat.subcategories) {
        for (const subCat of mainCat.subcategories) {
          const [subCategory, subCreated] = await Category.findOrCreate({
            where: { slug: subCat.slug },
            defaults: {
              title: subCat.title,
              description: subCat.description || '',
              parentId: mainCategory.id,
              level: 1
            }
          });
          
          if (subCreated) {
            console.log(`  ✅ Sous-catégorie créée: ${subCategory.title}`);
            totalCount++;
          } else {
            console.log(`  ⏭️  Sous-catégorie existe déjà: ${subCategory.title}`);
          }
          
          // Insérer les sous-catégories de niveau 2
          if (subCat.subcategories) {
            for (const subSubCat of subCat.subcategories) {
              const [subSubCategory, subSubCreated] = await Category.findOrCreate({
                where: { slug: subSubCat.slug },
                defaults: {
                  title: subSubCat.title,
                  description: subSubCat.description || '',
                  parentId: subCategory.id,
                  level: 2
                }
              });
              
              if (subSubCreated) {
                console.log(`    ✅ Sous-sous-catégorie créée: ${subSubCategory.title}`);
                totalCount++;
              } else {
                console.log(`    ⏭️  Sous-sous-catégorie existe déjà: ${subSubCategory.title}`);
              }
            }
          }
        }
      }
      
      console.log('');
    }
    
    console.log(`\n╔════════════════════════════════════════════════════════╗`);
    console.log(`║  ✅ INSERTION TERMINÉE !                              ║`);
    console.log(`║  ${totalCount} nouvelles catégories créées                      ║`);
    console.log(`╚════════════════════════════════════════════════════════╝\n`);
    
    // Afficher le total
    const total = await Category.count();
    console.log(`📊 Total de catégories dans la base: ${total}\n`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion:', error);
  } finally {
    await sequelize.close();
  }
}

insertCategories();
