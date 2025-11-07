// backend/controller/searchSuggestionCtrl.js
const { Product, Category } = require('../models');
const { Op } = require('sequelize');

// Suggestions produits et catégories (titre, image, prix)
const getSuggestions = async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : '';
    if (!q || q.length < 2) {
      return res.json({ products: [], categories: [] });
    }
    // Recherche produits (titre LIKE, limit 8)
    const products = await Product.findAll({
      where: {
        title: { [Op.like]: `%${q}%` }
      },
      attributes: ['id', 'title', 'price', 'images', 'slug'],
      limit: 8
    });
    // Recherche catégories (titre LIKE, limit 5)
    const categories = await Category.findAll({
      where: {
        title: { [Op.like]: `%${q}%` }
      },
      attributes: ['id', 'title', 'slug'],
      limit: 5
    });
    // Normaliser images produits (prendre la première)
    const productSuggestions = products.map(p => {
      let img = null;
      if (Array.isArray(p.images) && p.images.length > 0) img = p.images[0];
      else if (typeof p.images === 'string') {
        try { const arr = JSON.parse(p.images); if (Array.isArray(arr) && arr.length > 0) img = arr[0]; } catch {}
      }
      if (img && typeof img === 'object') img = img.url || img.path || img.public_id || null;
      if (typeof img !== 'string') img = null;
      return {
        id: p.id,
        title: p.title,
        price: p.price,
        slug: p.slug,
        image: img
      };
    });
    res.json({ products: productSuggestions, categories });
  } catch (error) {
    console.error('❌ getSuggestions error:', error);
    res.status(500).json({ message: 'Erreur suggestions', error: error.message });
  }
};

module.exports = { getSuggestions };