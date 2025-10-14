import axios from 'axios';

const API_BASE_URL = 'http://74.235.205.26:4000/api';

// Service pour récupérer les catégories depuis l'API
export const categoryService = {
  // Récupérer toutes les catégories
  getAllCategories: async () => {
    try {
      // Demander toutes les catégories avec une limite élevée pour éviter la pagination
      const response = await axios.get(`${API_BASE_URL}/category/?limit=500`);
      // L'API retourne { success, categories, pagination }
      // On retourne juste le tableau de catégories
      return response.data.categories || response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }
  },

  // Mapping intelligent des icônes FontAwesome basé sur des mots-clés
  getCategoryIcon: (title) => {
    if (!title) return 'fas fa-tag';
    
    const titleLower = title.toLowerCase();
    
    // Animaux
    if (titleLower.includes('animaux')) return 'fas fa-paw';
    if (titleLower.includes('chien')) return 'fas fa-dog';
    if (titleLower.includes('chat')) return 'fas fa-cat';
    if (titleLower.includes('oiseau')) return 'fas fa-dove';
    if (titleLower.includes('rongeur') || titleLower.includes('lapin')) return 'fas fa-rabbit';
    if (titleLower.includes('aquario') || titleLower.includes('poisson')) return 'fas fa-fish';
    if (titleLower.includes('collier') || titleLower.includes('laisse')) return 'fas fa-link';
    if (titleLower.includes('litière')) return 'fas fa-box';
    if (titleLower.includes('cage')) return 'fas fa-door-closed';
    
    // Bébé et Puériculture
    if (titleLower.includes('bébé') || titleLower.includes('puériculture')) return 'fas fa-baby';
    if (titleLower.includes('poussette') || titleLower.includes('landau')) return 'fas fa-baby-carriage';
    if (titleLower.includes('siège auto')) return 'fas fa-car-side';
    if (titleLower.includes('biberon')) return 'fas fa-baby-bottle';
    if (titleLower.includes('couche')) return 'fas fa-child';
    if (titleLower.includes('lit') && titleLower.includes('bébé')) return 'fas fa-bed';
    
    // Jeux et Jouets
    if (titleLower.includes('jeux') || titleLower.includes('jouet')) return 'fas fa-gamepad';
    if (titleLower.includes('peluche')) return 'fas fa-teddy-bear';
    if (titleLower.includes('puzzle')) return 'fas fa-puzzle-piece';
    if (titleLower.includes('lego') || titleLower.includes('figurine')) return 'fas fa-cubes';
    if (titleLower.includes('poupée')) return 'fas fa-user-friends';
    if (titleLower.includes('vélo') || titleLower.includes('trottinette')) return 'fas fa-bicycle';
    if (titleLower.includes('playstation') || titleLower.includes('xbox') || titleLower.includes('nintendo')) return 'fas fa-gamepad';
    
    // Livres et Médias
    if (titleLower.includes('livre') || titleLower.includes('roman') || titleLower.includes('bd')) return 'fas fa-book';
    if (titleLower.includes('musique') || titleLower.includes('cd') || titleLower.includes('vinyle')) return 'fas fa-music';
    if (titleLower.includes('instrument')) return 'fas fa-guitar';
    if (titleLower.includes('film') || titleLower.includes('dvd') || titleLower.includes('blu-ray')) return 'fas fa-film';
    
    // Auto & Moto
    if (titleLower.includes('auto') || titleLower.includes('moto') || titleLower.includes('voiture')) return 'fas fa-car';
    if (titleLower.includes('pièce') || titleLower.includes('moteur')) return 'fas fa-cog';
    if (titleLower.includes('freinage') || titleLower.includes('frein')) return 'fas fa-stop-circle';
    if (titleLower.includes('casque') || titleLower.includes('protection')) return 'fas fa-hard-hat';
    if (titleLower.includes('huile') || titleLower.includes('lubrifiant')) return 'fas fa-oil-can';
    
    // Beauté et Bien-être
    if (titleLower.includes('beauté') || titleLower.includes('beauty')) return 'fas fa-spa';
    if (titleLower.includes('maquillage') || titleLower.includes('makeup')) return 'fas fa-palette';
    if (titleLower.includes('parfum')) return 'fas fa-spray-can';
    if (titleLower.includes('soin') && titleLower.includes('visage')) return 'fas fa-hand-sparkles';
    if (titleLower.includes('soin') && titleLower.includes('corps')) return 'fas fa-shower';
    if (titleLower.includes('cheveux') || titleLower.includes('hair')) return 'fas fa-cut';
    if (titleLower.includes('bien-être') || titleLower.includes('relaxation')) return 'fas fa-leaf';
    if (titleLower.includes('dentaire') || titleLower.includes('dent')) return 'fas fa-tooth';
    
    // Bricolage et Jardinage
    if (titleLower.includes('bricolage') || titleLower.includes('outil')) return 'fas fa-tools';
    if (titleLower.includes('jardin') || titleLower.includes('plante')) return 'fas fa-seedling';
    if (titleLower.includes('peinture')) return 'fas fa-paint-roller';
    if (titleLower.includes('électrique') && titleLower.includes('outil')) return 'fas fa-plug';
    if (titleLower.includes('plomberie')) return 'fas fa-wrench';
    if (titleLower.includes('quincaillerie')) return 'fas fa-screwdriver';
    if (titleLower.includes('marteau')) return 'fas fa-hammer';
    if (titleLower.includes('scie')) return 'fas fa-cut';
    
    // Cuisine et Maison
    if (titleLower.includes('cuisine')) return 'fas fa-utensils';
    if (titleLower.includes('maison') || titleLower.includes('home')) return 'fas fa-home';
    if (titleLower.includes('robot') && titleLower.includes('cuisine')) return 'fas fa-blender';
    if (titleLower.includes('four') || titleLower.includes('cuisson')) return 'fas fa-fire';
    if (titleLower.includes('café') || titleLower.includes('cafetière')) return 'fas fa-mug-hot';
    if (titleLower.includes('réfrigérateur') || titleLower.includes('congélateur')) return 'fas fa-snowflake';
    if (titleLower.includes('ustensile')) return 'fas fa-utensil-spoon';
    if (titleLower.includes('électroménager')) return 'fas fa-blender';
    if (titleLower.includes('mobilier') || titleLower.includes('meuble')) return 'fas fa-couch';
    if (titleLower.includes('décoration')) return 'fas fa-palette';
    
    // Epicerie et Alimentation
    if (titleLower.includes('epicerie') || titleLower.includes('alimentation')) return 'fas fa-shopping-basket';
    if (titleLower.includes('fruit') || titleLower.includes('légume')) return 'fas fa-carrot';
    if (titleLower.includes('viande') || titleLower.includes('poisson')) return 'fas fa-drumstick-bite';
    if (titleLower.includes('boisson')) return 'fas fa-glass-whiskey';
    if (titleLower.includes('surgelé')) return 'fas fa-icicles';
    if (titleLower.includes('bio') || titleLower.includes('diététique')) return 'fas fa-leaf';
    if (titleLower.includes('chocolat') || titleLower.includes('confiserie')) return 'fas fa-candy-cane';
    if (titleLower.includes('biscuit') || titleLower.includes('gâteau')) return 'fas fa-cookie';
    
    // Fournitures de Bureau
    if (titleLower.includes('bureau') || titleLower.includes('papeterie')) return 'fas fa-briefcase';
    if (titleLower.includes('stylo') || titleLower.includes('crayon')) return 'fas fa-pen';
    if (titleLower.includes('papier')) return 'fas fa-file';
    if (titleLower.includes('classeur') || titleLower.includes('archive')) return 'fas fa-folder';
    if (titleLower.includes('agenda') || titleLower.includes('calendrier')) return 'fas fa-calendar';
    if (titleLower.includes('chaise') || titleLower.includes('fauteuil')) return 'fas fa-chair';
    if (titleLower.includes('informatique') && titleLower.includes('bureau')) return 'fas fa-desktop';
    
    // High-Tech et Électronique
    if (titleLower.includes('high-tech') || titleLower.includes('tech')) return 'fas fa-microchip';
    if (titleLower.includes('téléphone') || titleLower.includes('smartphone')) return 'fas fa-mobile-alt';
    if (titleLower.includes('ordinateur') || titleLower.includes('pc')) return 'fas fa-laptop';
    if (titleLower.includes('tablette')) return 'fas fa-tablet-alt';
    if (titleLower.includes('photo') || titleLower.includes('caméra')) return 'fas fa-camera';
    if (titleLower.includes('tv') || titleLower.includes('télévision')) return 'fas fa-tv';
    if (titleLower.includes('audio') || titleLower.includes('casque') || titleLower.includes('enceinte')) return 'fas fa-headphones';
    if (titleLower.includes('gaming') || titleLower.includes('jeux') || titleLower.includes('console')) return 'fas fa-gamepad';
    if (titleLower.includes('réseau') || titleLower.includes('routeur')) return 'fas fa-network-wired';
    if (titleLower.includes('connectique') || titleLower.includes('câble')) return 'fas fa-plug';
    
    // Hygiène et Santé
    if (titleLower.includes('hygiène') || titleLower.includes('santé')) return 'fas fa-hand-sparkles';
    if (titleLower.includes('dentifrice') || titleLower.includes('brosse')) return 'fas fa-tooth';
    if (titleLower.includes('déodorant')) return 'fas fa-spray-can';
    if (titleLower.includes('shampooing') || titleLower.includes('gel douche')) return 'fas fa-shower';
    if (titleLower.includes('médical') || titleLower.includes('premiers secours')) return 'fas fa-first-aid';
    if (titleLower.includes('thermomètre') || titleLower.includes('tensiomètre')) return 'fas fa-thermometer';
    
    // Sport
    if (titleLower.includes('sport') || titleLower.includes('fitness')) return 'fas fa-dumbbell';
    if (titleLower.includes('running') || titleLower.includes('course')) return 'fas fa-running';
    if (titleLower.includes('cyclisme') || titleLower.includes('vélo')) return 'fas fa-bicycle';
    if (titleLower.includes('natation') || titleLower.includes('piscine')) return 'fas fa-swimmer';
    if (titleLower.includes('football') || titleLower.includes('basket')) return 'fas fa-basketball-ball';
    
    // Vêtements
    if (titleLower.includes('vêtement') || titleLower.includes('mode')) return 'fas fa-tshirt';
    if (titleLower.includes('homme')) return 'fas fa-male';
    if (titleLower.includes('femme')) return 'fas fa-female';
    if (titleLower.includes('enfant') || titleLower.includes('bébé')) return 'fas fa-child';
    if (titleLower.includes('chaussure')) return 'fas fa-shoe-prints';
    if (titleLower.includes('bijoux')) return 'fas fa-gem';
    if (titleLower.includes('montre')) return 'fas fa-clock';
    if (titleLower.includes('accessoire') && titleLower.includes('mode')) return 'fas fa-glasses';
    
    // Icône par défaut
    return 'fas fa-tag';
  },

  // Organiser les catégories en structure hiérarchique complète (3 niveaux)
  organizeCategoriesWithSubcategories: (categories) => {
    console.log('🔄 organizeCategoriesWithSubcategories - Entrée:', categories.length, 'catégories');
    const mainCategories = categories.filter(cat => cat.parentId === null || cat.level === 0);
    console.log('📊 Catégories principales trouvées:', mainCategories.length);
    console.log('📋 Titres:', mainCategories.map(c => c.title).join(', '));
    
    return mainCategories.map(mainCat => {
      // Récupérer toutes les sous-catégories de niveau 1
      const level1Subcategories = categories.filter(cat => cat.parentId === mainCat.id);
      
      return {
        ...mainCat,
        _id: mainCat.id?.toString() || mainCat.id,
        icon: categoryService.getCategoryIcon(mainCat.title),
        subcategories: level1Subcategories.map(sub1 => {
          // Récupérer toutes les sous-catégories de niveau 2 pour cette sous-catégorie
          const level2Subcategories = categories.filter(cat => cat.parentId === sub1.id);
          
          return {
            ...sub1,
            _id: sub1.id?.toString() || sub1.id,
            icon: categoryService.getCategoryIcon(sub1.title),
            // Ajouter les sous-sous-catégories si elles existent
            subcategories: level2Subcategories.length > 0 ? level2Subcategories.map(sub2 => ({
              ...sub2,
              _id: sub2.id?.toString() || sub2.id,
              icon: categoryService.getCategoryIcon(sub2.title)
            })) : undefined
          };
        })
      };
    });
  },

  // Récupérer et organiser toutes les catégories
  getCategoriesWithSubcategories: async () => {
    try {
      const allCategories = await categoryService.getAllCategories();
      return categoryService.organizeCategoriesWithSubcategories(allCategories);
    } catch (error) {
      console.error('Erreur lors de l\'organisation des catégories:', error);
      return [];
    }
  }
};

export default categoryService;