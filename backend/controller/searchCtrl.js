// ===== CONTRÔLEUR DE RECHERCHE AVEC AUTO-COMPLETION =====
const { Product, Category, Brand, Op } = require('../models');
const asyncHandler = require('express-async-handler');
const { normalizeProductData } = require('../utils/imageNormalizer');

/**
 * 🔍 RECHERCHE GLOBALE AVEC AUTO-COMPLETION
 * Recherche dans: Produits, Catégories, Marques
 * Supporte: recherche partielle, suggestions en temps réel
 */
const globalSearch = asyncHandler(async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        query: q,
        results: {
          products: [],
          categories: [],
          brands: []
        },
        counts: {
          products: 0,
          categories: 0,
          brands: 0,
          total: 0
        }
      });
    }

    const searchTerm = q.trim();
    const searchLimit = Math.min(parseInt(limit), 50);

    // Recherche dans les produits
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
          { category: { [Op.like]: `%${searchTerm}%` } },
          { subcategory: { [Op.like]: `%${searchTerm}%` } },
          { brand: { [Op.like]: `%${searchTerm}%` } },
          { slug: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['id', 'title', 'slug', 'price', 'images', 'category', 'subcategory', 'brand', 'quantity'],
      limit: searchLimit,
      order: [['createdAt', 'DESC']]
    });

    // Normaliser les produits
    const normalizedProducts = products.map(p => normalizeProductData(p.toJSON()));

    // Recherche dans les catégories
    const categories = await Category.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { slug: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['id', 'title', 'slug', 'parentId'],
      limit: searchLimit
    });

    // Recherche dans les marques
    const brands = await Brand.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['id', 'title'],
      limit: searchLimit
    });

    const totalResults = normalizedProducts.length + categories.length + brands.length;

    res.json({
      success: true,
      query: searchTerm,
      results: {
        products: normalizedProducts,
        categories,
        brands
      },
      counts: {
        products: normalizedProducts.length,
        categories: categories.length,
        brands: brands.length,
        total: totalResults
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la recherche globale:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: error.message
    });
  }
});

/**
 * 🔍 AUTO-COMPLETION PRODUITS
 * Suggestions rapides pour les produits
 */
const autocompleteProducts = asyncHandler(async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const searchTerm = q.trim();
    const searchLimit = Math.min(parseInt(limit), 20);

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { category: { [Op.like]: `%${searchTerm}%` } },
          { brand: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      attributes: ['id', 'title', 'slug', 'price', 'images', 'category', 'brand'],
      limit: searchLimit,
      order: [
        ['sold', 'DESC'],  // Produits les plus vendus en premier
        ['createdAt', 'DESC']
      ]
    });

    const suggestions = products.map(p => {
      const product = p.toJSON();
      return {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        category: product.category,
        brand: product.brand,
        image: product.images && product.images.length > 0 ? product.images[0].url : null,
        type: 'product'
      };
    });

    res.json({
      success: true,
      query: searchTerm,
      suggestions
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'auto-completion produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'auto-completion',
      error: error.message
    });
  }
});

/**
 * 🔍 AUTO-COMPLETION CATÉGORIES
 * Suggestions rapides pour les catégories
 */
const autocompleteCategories = asyncHandler(async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const searchTerm = q.trim();
    const searchLimit = Math.min(parseInt(limit), 20);

    const categories = await Category.findAll({
      where: {
        title: { [Op.like]: `%${searchTerm}%` }
      },
      attributes: ['id', 'title', 'slug', 'parentId'],
      limit: searchLimit,
      order: [['title', 'ASC']]
    });

    const suggestions = categories.map(c => {
      const category = c.toJSON();
      return {
        id: category.id,
        title: category.title,
        slug: category.slug,
        isSubcategory: category.parentId !== null,
        parent: category.parentId,
        type: 'category'
      };
    });

    res.json({
      success: true,
      query: searchTerm,
      suggestions
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'auto-completion catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'auto-completion',
      error: error.message
    });
  }
});

/**
 * 🔍 AUTO-COMPLETION MARQUES
 * Suggestions rapides pour les marques
 */
const autocompleteBrands = asyncHandler(async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const searchTerm = q.trim();
    const searchLimit = Math.min(parseInt(limit), 20);

    const brands = await Brand.findAll({
      where: {
        title: { [Op.like]: `%${searchTerm}%` }
      },
      attributes: ['id', 'title'],
      limit: searchLimit,
      order: [['title', 'ASC']]
    });

    const suggestions = brands.map(b => {
      const brand = b.toJSON();
      return {
        id: brand.id,
        title: brand.title,
        slug: brand.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        type: 'brand'
      };
    });

    res.json({
      success: true,
      query: searchTerm,
      suggestions
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'auto-completion marques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'auto-completion',
      error: error.message
    });
  }
});

/**
 * 🔍 SUGGESTIONS INTELLIGENTES
 * Combine produits, catégories et marques pour une recherche unifiée
 */
const smartSuggestions = asyncHandler(async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const searchTerm = q.trim();
    const searchLimit = Math.min(parseInt(limit), 10);

    // Recherche parallèle dans toutes les tables
    const [products, categories, brands] = await Promise.all([
      Product.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${searchTerm}%` } },
            { category: { [Op.like]: `%${searchTerm}%` } }
          ]
        },
        attributes: ['id', 'title', 'slug', 'price', 'images', 'category'],
        limit: searchLimit,
        order: [['sold', 'DESC']]
      }),
      Category.findAll({
        where: { title: { [Op.like]: `%${searchTerm}%` } },
        attributes: ['id', 'title', 'slug'],
        limit: Math.floor(searchLimit / 2)
      }),
      Brand.findAll({
        where: { title: { [Op.like]: `%${searchTerm}%` } },
        attributes: ['id', 'title'],
        limit: Math.floor(searchLimit / 2)
      })
    ]);

    // Formater les suggestions
    const suggestions = [];

    // Ajouter les catégories en premier (priorité haute)
    categories.forEach(c => {
      suggestions.push({
        id: c.id,
        title: c.title,
        slug: c.slug,
        type: 'category',
        icon: '📂',
        label: `Catégorie: ${c.title}`
      });
    });

    // Ajouter les marques
    brands.forEach(b => {
      const brandSlug = b.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      suggestions.push({
        id: b.id,
        title: b.title,
        slug: brandSlug,
        type: 'brand',
        icon: '🏷️',
        label: `Marque: ${b.title}`
      });
    });

    // Ajouter les produits
    products.forEach(p => {
      const product = p.toJSON();
      suggestions.push({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        category: product.category,
        image: product.images && product.images.length > 0 ? product.images[0].url : null,
        type: 'product',
        icon: '🛍️',
        label: product.title
      });
    });

    res.json({
      success: true,
      query: searchTerm,
      suggestions: suggestions.slice(0, searchLimit),
      counts: {
        categories: categories.length,
        brands: brands.length,
        products: products.length
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors des suggestions intelligentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération des suggestions',
      error: error.message
    });
  }
});

/**
 * 🔍 RECHERCHE AVANCÉE PRODUITS
 * Avec filtres: catégorie, prix, marque, disponibilité
 */
const advancedSearch = asyncHandler(async (req, res) => {
  try {
    const {
      q,
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    // Construire les conditions de recherche
    const whereConditions = {};

    // Recherche textuelle
    if (q && q.trim().length >= 2) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${q.trim()}%` } },
        { description: { [Op.like]: `%${q.trim()}%` } }
      ];
    }

    // Filtres spécifiques
    if (category) {
      whereConditions.category = category;
    }
    if (subcategory) {
      whereConditions.subcategory = subcategory;
    }
    if (brand) {
      whereConditions.brand = brand;
    }
    if (minPrice) {
      whereConditions.price = { [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
      if (whereConditions.price) {
        whereConditions.price = {
          ...whereConditions.price,
          [Op.lte]: parseFloat(maxPrice)
        };
      } else {
        whereConditions.price = { [Op.lte]: parseFloat(maxPrice) };
      }
    }
    if (inStock === 'true') {
      whereConditions.quantity = { [Op.gt]: 0 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    // Validation du tri
    const validSortFields = ['title', 'price', 'createdAt', 'sold', 'quantity'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Exécuter la recherche
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereConditions,
      limit: limitNum,
      offset: offset,
      order: [[sortField, sortOrder]]
    });

    // Normaliser les produits
    const normalizedProducts = products.map(p => normalizeProductData(p.toJSON()));

    res.json({
      success: true,
      query: q || '',
      filters: {
        category,
        subcategory,
        brand,
        minPrice,
        maxPrice,
        inStock
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      },
      products: normalizedProducts,
      count: normalizedProducts.length
    });

  } catch (error) {
    console.error('❌ Erreur lors de la recherche avancée:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche avancée',
      error: error.message
    });
  }
});

module.exports = {
  globalSearch,
  autocompleteProducts,
  autocompleteCategories,
  autocompleteBrands,
  smartSuggestions,
  advancedSearch
};
