// Système de traduction pour les catégories
export const getCategoryTranslation = (key, language, translations) => {
  const translationObject = translations?.[language];
  return translationObject?.[key] || key;
};

// Structure des catégories avec clés de traduction
export const categoryStructure = [
  {
    _id: 'temp_1',
    titleKey: 'categoryFashionClothing',
    slug: 'mode-vetements',
    descriptionKey: 'categoryFashionDesc',
    icon: 'fas fa-tshirt',
    level: 0,
    parent: null,
    sortOrder: 1,
    subcategories: [
      {
        _id: 'temp_1_1',
        titleKey: 'categoryWomenFashion',
        slug: 'mode-femme',
        descriptionKey: 'categoryWomenFashionDesc',
        icon: 'fas fa-female',
        level: 1,
        parent: 'temp_1'
      },
      {
        _id: 'temp_1_2',
        titleKey: 'categoryMenFashion',
        slug: 'mode-homme',
        descriptionKey: 'categoryMenFashionDesc',
        icon: 'fas fa-male',
        level: 1,
        parent: 'temp_1'
      },
      {
        _id: 'temp_1_3',
        titleKey: 'categoryWomenShoes',
        slug: 'chaussures-femme',
        descriptionKey: 'categoryWomenShoesDesc',
        icon: 'fas fa-shoe-prints',
        level: 1,
        parent: 'temp_1'
      },
      {
        _id: 'temp_1_4',
        titleKey: 'categoryMenShoes',
        slug: 'chaussures-homme',
        descriptionKey: 'categoryMenShoesDesc',
        icon: 'fas fa-shoe-prints',
        level: 1,
        parent: 'temp_1'
      }
    ]
  },
  {
    _id: 'temp_2',
    titleKey: 'categoryAutoMoto',
    slug: 'auto-moto',
    descriptionKey: 'categoryAutoMotoDesc',
    icon: 'fas fa-car',
    level: 0,
    parent: null,
    sortOrder: 2,
    subcategories: [
      {
        _id: 'temp_2_1',
        titleKey: 'categoryAutoParts',
        slug: 'pieces-auto',
        descriptionKey: 'categoryAutoPartsDesc',
        icon: 'fas fa-cog',
        level: 1,
        parent: 'temp_2'
      },
      {
        _id: 'temp_2_2',
        titleKey: 'categoryAutoAccessories',
        slug: 'accessoires-auto',
        descriptionKey: 'categoryAutoAccessoriesDesc',
        icon: 'fas fa-car-side',
        level: 1,
        parent: 'temp_2'
      },
      {
        _id: 'temp_2_3',
        titleKey: 'categoryTiresWheels',
        slug: 'pneus-jantes',
        descriptionKey: 'categoryTiresWheelsDesc',
        icon: 'fas fa-tire',
        level: 1,
        parent: 'temp_2'
      },
      {
        _id: 'temp_2_4',
        titleKey: 'categoryCarMaintenance',
        slug: 'entretien-auto',
        descriptionKey: 'categoryCarMaintenanceDesc',
        icon: 'fas fa-tools',
        level: 1,
        parent: 'temp_2'
      },
      {
        _id: 'temp_2_5',
        titleKey: 'categoryMotoEquipment',
        slug: 'equipement-moto',
        descriptionKey: 'categoryMotoEquipmentDesc',
        icon: 'fas fa-motorcycle',
        level: 1,
        parent: 'temp_2'
      },
      {
        _id: 'temp_2_6',
        titleKey: 'categoryMotoParts',
        slug: 'pieces-moto',
        descriptionKey: 'categoryMotoPartsDesc',
        icon: 'fas fa-wrench',
        level: 1,
        parent: 'temp_2'
      }
    ]
  },
  {
    _id: 'temp_3',
    titleKey: 'categoryElectronics',
    slug: 'electronique-high-tech',
    descriptionKey: 'categoryElectronicsDesc',
    icon: 'fas fa-laptop',
    level: 0,
    parent: null,
    sortOrder: 3,
    subcategories: [
      {
        _id: 'temp_3_1',
        titleKey: 'categorySmartphones',
        slug: 'smartphones',
        descriptionKey: 'categorySmartphonesDesc',
        icon: 'fas fa-mobile-alt',
        level: 1,
        parent: 'temp_3'
      },
      {
        _id: 'temp_3_2',
        titleKey: 'categoryComputers',
        slug: 'ordinateurs',
        descriptionKey: 'categoryComputersDesc',
        icon: 'fas fa-desktop',
        level: 1,
        parent: 'temp_3'
      },
      {
        _id: 'temp_3_3',
        titleKey: 'categoryTVAudio',
        slug: 'tv-audio',
        descriptionKey: 'categoryTVAudioDesc',
        icon: 'fas fa-tv',
        level: 1,
        parent: 'temp_3'
      },
      {
        _id: 'temp_3_4',
        titleKey: 'categoryTablets',
        slug: 'tablettes',
        descriptionKey: 'categoryTabletsDesc',
        icon: 'fas fa-tablet-alt',
        level: 1,
        parent: 'temp_3'
      },
      {
        _id: 'temp_3_5',
        titleKey: 'categoryGaming',
        slug: 'gaming',
        descriptionKey: 'categoryGamingDesc',
        icon: 'fas fa-gamepad',
        level: 1,
        parent: 'temp_3'
      },
      {
        _id: 'temp_3_6',
        titleKey: 'categoryTechAccessories',
        slug: 'accessoires-tech',
        descriptionKey: 'categoryTechAccessoriesDesc',
        icon: 'fas fa-plug',
        level: 1,
        parent: 'temp_3'
      },
      {
        _id: 'temp_3_7',
        titleKey: 'categoryPhotoVideo',
        slug: 'photo-video',
        descriptionKey: 'categoryPhotoVideoDesc',
        icon: 'fas fa-camera',
        level: 1,
        parent: 'temp_3'
      }
    ]
  },
  {
    _id: 'temp_4',
    titleKey: 'categoryHomeGarden',
    slug: 'maison-jardin',
    descriptionKey: 'categoryHomeGardenDesc',
    icon: 'fas fa-home',
    level: 0,
    parent: null,
    sortOrder: 4,
    subcategories: [
      {
        _id: 'temp_4_1',
        titleKey: 'categoryFurniture',
        slug: 'mobilier',
        descriptionKey: 'categoryFurnitureDesc',
        icon: 'fas fa-couch',
        level: 1,
        parent: 'temp_4'
      },
      {
        _id: 'temp_4_2',
        titleKey: 'categoryGardening',
        slug: 'jardinage',
        descriptionKey: 'categoryGardeningDesc',
        icon: 'fas fa-seedling',
        level: 1,
        parent: 'temp_4'
      },
      {
        _id: 'temp_4_3',
        titleKey: 'categoryDecoration',
        slug: 'decoration',
        descriptionKey: 'categoryDecorationDesc',
        icon: 'fas fa-palette',
        level: 1,
        parent: 'temp_4'
      },
      {
        _id: 'temp_4_4',
        titleKey: 'categoryAppliances',
        slug: 'electromenager',
        descriptionKey: 'categoryAppliancesDesc',
        icon: 'fas fa-blender',
        level: 1,
        parent: 'temp_4'
      },
      {
        _id: 'temp_4_5',
        titleKey: 'categoryBedding',
        slug: 'literie',
        descriptionKey: 'categoryBeddingDesc',
        icon: 'fas fa-bed',
        level: 1,
        parent: 'temp_4'
      },
      {
        _id: 'temp_4_6',
        titleKey: 'categoryLighting',
        slug: 'eclairage',
        descriptionKey: 'categoryLightingDesc',
        icon: 'fas fa-lightbulb',
        level: 1,
        parent: 'temp_4'
      }
    ]
  },
  {
    _id: 'temp_5',
    titleKey: 'categorySportLeisure',
    slug: 'sport-loisirs',
    descriptionKey: 'categorySportLeisureDesc',
    icon: 'fas fa-running',
    level: 0,
    parent: null,
    sortOrder: 5,
    subcategories: [
      {
        _id: 'temp_5_1',
        titleKey: 'categoryFitness',
        slug: 'fitness',
        descriptionKey: 'categoryFitnessDesc',
        icon: 'fas fa-dumbbell',
        level: 1,
        parent: 'temp_5'
      },
      {
        _id: 'temp_5_2',
        titleKey: 'categoryTeamSports',
        slug: 'sports-equipe',
        descriptionKey: 'categoryTeamSportsDesc',
        icon: 'fas fa-futbol',
        level: 1,
        parent: 'temp_5'
      },
      {
        _id: 'temp_5_3',
        titleKey: 'categoryIndividualSports',
        slug: 'sports-individuels',
        descriptionKey: 'categoryIndividualSportsDesc',
        icon: 'fas fa-running',
        level: 1,
        parent: 'temp_5'
      },
      {
        _id: 'temp_5_4',
        titleKey: 'categoryOutdoor',
        slug: 'outdoor',
        descriptionKey: 'categoryOutdoorDesc',
        icon: 'fas fa-mountain',
        level: 1,
        parent: 'temp_5'
      },
      {
        _id: 'temp_5_5',
        titleKey: 'categoryWaterSports',
        slug: 'sports-nautiques',
        descriptionKey: 'categoryWaterSportsDesc',
        icon: 'fas fa-swimmer',
        level: 1,
        parent: 'temp_5'
      },
      {
        _id: 'temp_5_6',
        titleKey: 'categorySportsWear',
        slug: 'vetements-sport',
        descriptionKey: 'categorySportsWearDesc',
        icon: 'fas fa-tshirt',
        level: 1,
        parent: 'temp_5'
      }
    ]
  },
  {
    _id: 'temp_6',
    titleKey: 'categoryHealthBeauty',
    slug: 'sante-beaute',
    descriptionKey: 'categoryHealthBeautyDesc',
    icon: 'fas fa-heart',
    level: 0,
    parent: null,
    sortOrder: 6,
    subcategories: [
      {
        _id: 'temp_6_1',
        titleKey: 'categoryCosmetics',
        slug: 'cosmetiques',
        descriptionKey: 'categoryCosmeticsDesc',
        icon: 'fas fa-magic',
        level: 1,
        parent: 'temp_6'
      },
      {
        _id: 'temp_6_2',
        titleKey: 'categoryFaceCare',
        slug: 'soins-visage',
        descriptionKey: 'categoryFaceCareDesc',
        icon: 'fas fa-spa',
        level: 1,
        parent: 'temp_6'
      },
      {
        _id: 'temp_6_3',
        titleKey: 'categoryPerfumes',
        slug: 'parfums',
        descriptionKey: 'categoryPerfumesDesc',
        icon: 'fas fa-spray-can',
        level: 1,
        parent: 'temp_6'
      },
      {
        _id: 'temp_6_4',
        titleKey: 'categoryBodyCare',
        slug: 'soins-corps',
        descriptionKey: 'categoryBodyCareDesc',
        icon: 'fas fa-hand-holding-water',
        level: 1,
        parent: 'temp_6'
      },
      {
        _id: 'temp_6_5',
        titleKey: 'categoryHealth',
        slug: 'sante',
        descriptionKey: 'categoryHealthDesc',
        icon: 'fas fa-pills',
        level: 1,
        parent: 'temp_6'
      },
      {
        _id: 'temp_6_6',
        titleKey: 'categoryHairCare',
        slug: 'soins-cheveux',
        descriptionKey: 'categoryHairCareDesc',
        icon: 'fas fa-cut',
        level: 1,
        parent: 'temp_6'
      }
    ]
  },
  {
    _id: 'temp_7',
    titleKey: 'categoryKidsBabies',
    slug: 'enfants-bebes',
    descriptionKey: 'categoryKidsBabiesDesc',
    icon: 'fas fa-baby',
    level: 0,
    parent: null,
    sortOrder: 7,
    subcategories: [
      {
        _id: 'temp_7_1',
        titleKey: 'categoryBabyClothes',
        slug: 'vetements-bebe',
        descriptionKey: 'categoryBabyClothesDesc',
        icon: 'fas fa-baby-carriage',
        level: 1,
        parent: 'temp_7'
      },
      {
        _id: 'temp_7_2',
        titleKey: 'categoryToys',
        slug: 'jouets',
        descriptionKey: 'categoryToysDesc',
        icon: 'fas fa-dice',
        level: 1,
        parent: 'temp_7'
      },
      {
        _id: 'temp_7_3',
        titleKey: 'categoryBabyFood',
        slug: 'alimentation-bebe',
        descriptionKey: 'categoryBabyFoodDesc',
        icon: 'fas fa-baby-carriage',
        level: 1,
        parent: 'temp_7'
      },
      {
        _id: 'temp_7_4',
        titleKey: 'categoryKidsFurniture',
        slug: 'mobilier-enfant',
        descriptionKey: 'categoryKidsFurnitureDesc',
        icon: 'fas fa-bed',
        level: 1,
        parent: 'temp_7'
      },
      {
        _id: 'temp_7_5',
        titleKey: 'categoryStrollersSeats',
        slug: 'poussettes-sieges',
        descriptionKey: 'categoryStrollersSeatsDesc',
        icon: 'fas fa-baby-carriage',
        level: 1,
        parent: 'temp_7'
      },
      {
        _id: 'temp_7_6',
        titleKey: 'categoryBabyHygiene',
        slug: 'hygiene-bebe',
        descriptionKey: 'categoryBabyHygieneDesc',
        icon: 'fas fa-hand-holding-water',
        level: 1,
        parent: 'temp_7'
      }
    ]
  },
  {
    _id: 'temp_8',
    titleKey: 'categoryPets',
    slug: 'animaux',
    descriptionKey: 'categoryPetsDesc',
    icon: 'fas fa-paw',
    level: 0,
    parent: null,
    sortOrder: 8,
    subcategories: [
      {
        _id: 'temp_8_1',
        titleKey: 'categoryDogs',
        slug: 'chiens',
        descriptionKey: 'categoryDogsDesc',
        icon: 'fas fa-dog',
        level: 1,
        parent: 'temp_8'
      },
      {
        _id: 'temp_8_2',
        titleKey: 'categoryCats',
        slug: 'chats',
        descriptionKey: 'categoryCatsDesc',
        icon: 'fas fa-cat',
        level: 1,
        parent: 'temp_8'
      },
      {
        _id: 'temp_8_3',
        titleKey: 'categoryBirds',
        slug: 'oiseaux',
        descriptionKey: 'categoryBirdsDesc',
        icon: 'fas fa-dove',
        level: 1,
        parent: 'temp_8'
      }
    ]
  },
  {
    _id: 'temp_9',
    titleKey: 'categoryFood',
    slug: 'alimentation',
    descriptionKey: 'categoryFoodDesc',
    icon: 'fas fa-utensils',
    level: 0,
    parent: null,
    sortOrder: 9,
    subcategories: [
      {
        _id: 'temp_9_1',
        titleKey: 'categoryGrocery',
        slug: 'epicerie',
        descriptionKey: 'categoryGroceryDesc',
        icon: 'fas fa-shopping-basket',
        level: 1,
        parent: 'temp_9'
      },
      {
        _id: 'temp_9_2',
        titleKey: 'categoryOrganic',
        slug: 'bio-naturel',
        descriptionKey: 'categoryOrganicDesc',
        icon: 'fas fa-leaf',
        level: 1,
        parent: 'temp_9'
      },
      {
        _id: 'temp_9_3',
        titleKey: 'categoryBeverages',
        slug: 'boissons',
        descriptionKey: 'categoryBeveragesDesc',
        icon: 'fas fa-wine-bottle',
        level: 1,
        parent: 'temp_9'
      }
    ]
  },
  {
    _id: 'temp_10',
    titleKey: 'categoryBooks',
    slug: 'livres-culture',
    descriptionKey: 'categoryBooksDesc',
    icon: 'fas fa-book',
    level: 0,
    parent: null,
    sortOrder: 10,
    subcategories: [
      {
        _id: 'temp_10_1',
        titleKey: 'categoryBooksOnly',
        slug: 'livres',
        descriptionKey: 'categoryBooksOnlyDesc',
        icon: 'fas fa-book-open',
        level: 1,
        parent: 'temp_10'
      },
      {
        _id: 'temp_10_2',
        titleKey: 'categoryMovies',
        slug: 'films-series',
        descriptionKey: 'categoryMoviesDesc',
        icon: 'fas fa-film',
        level: 1,
        parent: 'temp_10'
      },
      {
        _id: 'temp_10_3',
        titleKey: 'categoryMusic',
        slug: 'musique',
        descriptionKey: 'categoryMusicDesc',
        icon: 'fas fa-music',
        level: 1,
        parent: 'temp_10'
      }
    ]
  },
  {
    _id: 'temp_11',
    titleKey: 'categoryDIY',
    slug: 'bricolage-jardinage',
    descriptionKey: 'categoryDIYDesc',
    icon: 'fas fa-hammer',
    level: 0,
    parent: null,
    sortOrder: 11,
    subcategories: [
      {
        _id: 'temp_11_1',
        titleKey: 'categoryTools',
        slug: 'outillage',
        descriptionKey: 'categoryToolsDesc',
        icon: 'fas fa-tools',
        level: 1,
        parent: 'temp_11'
      },
      {
        _id: 'temp_11_2',
        titleKey: 'categoryMaterials',
        slug: 'materiaux',
        descriptionKey: 'categoryMaterialsDesc',
        icon: 'fas fa-cube',
        level: 1,
        parent: 'temp_11'
      },
      {
        _id: 'temp_11_3',
        titleKey: 'categorySafety',
        slug: 'securite-bricolage',
        descriptionKey: 'categorySafetyDesc',
        icon: 'fas fa-hard-hat',
        level: 1,
        parent: 'temp_11'
      }
    ]
  },
  {
    _id: 'temp_12',
    titleKey: 'categoryOffice',
    slug: 'bureautique',
    descriptionKey: 'categoryOfficeDesc',
    icon: 'fas fa-briefcase',
    level: 0,
    parent: null,
    sortOrder: 12,
    subcategories: [
      {
        _id: 'temp_12_1',
        titleKey: 'categoryOfficeSupplies',
        slug: 'fournitures-bureau',
        descriptionKey: 'categoryOfficeSuppliesDesc',
        icon: 'fas fa-pen',
        level: 1,
        parent: 'temp_12'
      },
      {
        _id: 'temp_12_2',
        titleKey: 'categoryOfficeFurniture',
        slug: 'mobilier-bureau',
        descriptionKey: 'categoryOfficeFurnitureDesc',
        icon: 'fas fa-chair',
        level: 1,
        parent: 'temp_12'
      }
    ]
  }
];

// Fonctions utilitaires qui utilisent les traductions
export const getTranslatedCategories = (language, translations) => {
  return categoryStructure.map(category => ({
    ...category,
    title: getCategoryTranslation(category.titleKey, language, translations),
    description: getCategoryTranslation(category.descriptionKey, language, translations),
    subcategories: category.subcategories?.map(sub => ({
      ...sub,
      title: getCategoryTranslation(sub.titleKey, language, translations),
      description: getCategoryTranslation(sub.descriptionKey, language, translations),
    }))
  }));
};

export const getCategoryBySlugTranslated = (slug, language, translations) => {
  // Chercher dans les catégories principales
  let category = categoryStructure.find(cat => cat.slug === slug);
  
  if (category) {
    return {
      ...category,
      title: getCategoryTranslation(category.titleKey, language, translations),
      description: getCategoryTranslation(category.descriptionKey, language, translations),
      subcategories: category.subcategories?.map(sub => ({
        ...sub,
        title: getCategoryTranslation(sub.titleKey, language, translations),
        description: getCategoryTranslation(sub.descriptionKey, language, translations),
      }))
    };
  }
  
  // Chercher dans les sous-catégories
  for (const mainCat of categoryStructure) {
    if (mainCat.subcategories) {
      const subCat = mainCat.subcategories.find(sub => sub.slug === slug);
      if (subCat) {
        return {
          ...subCat,
          title: getCategoryTranslation(subCat.titleKey, language, translations),
          description: getCategoryTranslation(subCat.descriptionKey, language, translations),
        };
      }
    }
  }
  
  return null;
};

export const getAllCategoriesFlatTranslated = (language, translations) => {
  const flatCategories = [];
  
  categoryStructure.forEach(mainCat => {
    flatCategories.push({
      ...mainCat,
      title: getCategoryTranslation(mainCat.titleKey, language, translations),
      description: getCategoryTranslation(mainCat.descriptionKey, language, translations),
    });
    
    if (mainCat.subcategories) {
      mainCat.subcategories.forEach(sub => {
        flatCategories.push({
          ...sub,
          title: getCategoryTranslation(sub.titleKey, language, translations),
          description: getCategoryTranslation(sub.descriptionKey, language, translations),
        });
      });
    }
  });
  
  return flatCategories;
};