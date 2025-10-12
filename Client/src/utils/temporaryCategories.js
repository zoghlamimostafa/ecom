// Import du nouveau système de traduction des catégories
import { 
  categoryStructure, 
  getTranslatedCategories, 
  getCategoryBySlugTranslated, 
  getAllCategoriesFlatTranslated 
} from './categoryTranslations.js';

// Export de compatibilité avec l'ancienne API
export { categoryStructure };

// Ancien système avec données hardcodées conservé pour compatibilité
// Ces données seront remplacées dynamiquement par le système de traduction
export const temporaryCategories = categoryStructure.map(category => ({
  ...category,
  title: 'À traduire',
  description: 'À traduire',
  subcategories: category.subcategories?.map(sub => ({
    ...sub,
    title: 'À traduire',
    description: 'À traduire'
  }))
}));

// Nouvelles fonctions qui utilisent le système de traduction
export const getAllCategoriesWithSubs = (language = 'fr', translations = null) => {
  return getTranslatedCategories(language, translations);
};

export const getCategoryBySlug = (slug, language = 'fr', translations = null) => {
  return getCategoryBySlugTranslated(slug, language, translations);
};

export const getAllCategoriesFlat = (language = 'fr', translations = null) => {
  return getAllCategoriesFlatTranslated(language, translations);
};
