const { Product, Brand, Category, Color, Sequelize } = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require("express-async-handler");

// Get all products with optimized pagination and lazy loading
const getAllProductsOptimized = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Limiter à 20 produits par page
    const offset = (page - 1) * limit;
    
    const options = {
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: [
        'id', 'title', 'slug', 'description', 'price', 
        'quantity', 'sold', 'category', 'brand', 'images'
      ], // Sélectionner seulement les champs nécessaires
    };

    // Recherche optimisée
    if (req.query.search) {
      options.where = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${req.query.search}%` } },
          { description: { [Op.iLike]: `%${req.query.search}%` } }
        ]
      };
    }

    // Filtres price optimisés
    if (req.query.minPrice || req.query.maxPrice) {
      options.where = options.where || {};
      if (req.query.minPrice) {
        options.where.price = { [Op.gte]: parseFloat(req.query.minPrice) };
      }
      if (req.query.maxPrice) {
        options.where.price = { 
          ...options.where.price, 
          [Op.lte]: parseFloat(req.query.maxPrice) 
        };
      }
    }

    // Filtrage par catégorie et marque
    if (req.query.category) options.where = { ...options.where, category: req.query.category };
    if (req.query.brand) options.where = { ...options.where, brand: req.query.brand };

    // Exécution avec count optimisé
    const { count, rows: products } = await Product.findAndCountAll(options);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllProductsOptimized:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération des produits",
      error: error.message 
    });
  }
});

// Get single product with minimal data
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Produit non trouvé" 
      });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération du produit",
      error: error.message 
    });
  }
});

// Bulk operations for admin
const bulkUpdateProducts = asyncHandler(async (req, res) => {
  const { productIds, updateData } = req.body;
  
  try {
    const result = await Product.update(updateData, {
      where: { id: { [Op.in]: productIds } }
    });
    
    res.json({
      success: true,
      message: `${result[0]} produits mis à jour`,
      updated: result[0]
    });
  } catch (error) {
    console.error('Error in bulkUpdateProducts:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la mise à jour en lot",
      error: error.message 
    });
  }
});

module.exports = {
  getAllProductsOptimized,
  getProductById,
  bulkUpdateProducts
};