// ===== ROUTES DE RECHERCHE AVEC AUTO-COMPLETION =====
const express = require('express');
const router = express.Router();

const {
  globalSearch,
  autocompleteProducts,
  autocompleteCategories,
  autocompleteBrands,
  smartSuggestions,
  advancedSearch
} = require('../controller/searchCtrl');

/**
 * 🔍 ROUTES PUBLIQUES DE RECHERCHE
 * Toutes les routes sont accessibles sans authentification
 */

// Recherche globale (produits + catégories + marques)
// GET /api/search?q=cafe&limit=10
router.get('/', globalSearch);

// Auto-completion produits uniquement
// GET /api/search/products?q=tasse&limit=10
router.get('/products', autocompleteProducts);

// Auto-completion catégories uniquement
// GET /api/search/categories?q=cuisine&limit=10
router.get('/categories', autocompleteCategories);

// Auto-completion marques uniquement
// GET /api/search/brands?q=sanny&limit=10
router.get('/brands', autocompleteBrands);

// Suggestions intelligentes (combinées)
// GET /api/search/suggestions?q=cafe&limit=10
router.get('/suggestions', smartSuggestions);

// Recherche avancée avec filtres
// GET /api/search/advanced?q=tasse&category=Cuisine&minPrice=20&maxPrice=100&sortBy=price&order=ASC
router.get('/advanced', advancedSearch);

module.exports = router;
