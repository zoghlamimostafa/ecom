// ===== MIGRATION VERS MYSQL/SEQUELIZE =====
const { Product, User, Order } = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const fs = require("fs");
const cloudinaryUploadImg = require("../utils/cloudinary");

// Création d'un produit
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Fonction d'upload d'images
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      console.log(newpath);
      urls.push(newpath);
      fs.unlinkSync(path);
    }

    res.json(urls);
  } catch (error) {
    throw new Error(error);
  }
});

// Mise à jour d'un produit
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    await Product.update(req.body, { where: { id: id } });
    const updatedProduct = await Product.findByPk(id);
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Suppression d'un produit
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Product.destroy({ where: { id: id } });
    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    throw new Error(error);
  }
});

// Récupération d'un produit
const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    let findProduct;
    
    // Check if the id is a valid number (MySQL ID) or a slug
    if (!isNaN(id)) {
      // It's a MySQL ID
      findProduct = await Product.findByPk(id);
    } else {
      // It's a slug
      findProduct = await Product.findOne({ where: { slug: id } });
    }
    
    if (!findProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

// Récupération de tous les produits (OPTIMISÉE)
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Forcer la pagination pour éviter les surcharges
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50); // Max 50 produits
    const offset = (page - 1) * limit;
    
    // Construire les options de requête Sequelize optimisées
    const options = {
      where: {},
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: [
        'id', 'title', 'slug', 'description', 'price', 
        'quantity', 'sold', 'category', 'brand', 'images',
        'createdAt'
      ] // Sélectionner seulement les champs nécessaires
    };

    // Gestion du tri optimisée
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      const orderArray = sortFields.map(field => {
        if (field.startsWith('-')) {
          return [field.substring(1), 'DESC'];
        }
        return [field, 'ASC'];
      });
      options.order = orderArray;
    }

    // Filtrage par prix optimisé
    if (req.query.price) {
      const priceFilter = req.query.price;
      if (priceFilter.gte) options.where.price = { [Op.gte]: parseFloat(priceFilter.gte) };
      if (priceFilter.lte) options.where.price = { ...options.where.price, [Op.lte]: parseFloat(priceFilter.lte) };
    }

    // Recherche textuelle optimisée
    if (req.query.search) {
      options.where[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } }
      ];
    }

    // Filtrage par catégorie
    if (req.query.category) {
      options.where.category = req.query.category;
    }

    // Filtrage par marque
    if (req.query.brand) {
      options.where.brand = req.query.brand;
    }

    // Utiliser findAndCountAll pour avoir le total
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
    console.error('Erreur getAllProduct:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des produits",
      error: error.message
    });
  }
});

// Ajouter à la wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Sequelize utilise 'id' et non '_id'
  const { prodId } = req.body;
  
  try {
    // Import the models here to avoid circular dependency
    const User = require('../models/User');
    const Product = require('../models/Product');
    const Wishlist = require('../models/Wishlist');
    
    // Validate inputs avec logs détaillés
    console.log('🔍 Wishlist Debug:', { userId, prodId, type: typeof prodId });
    
    if (!userId || !prodId) {
      console.log('❌ Validation failed:', { userId, prodId });
      return res.status(400).json({ 
        success: false, 
        message: "ID utilisateur et ID produit requis",
        debug: { userId, prodId, prodIdType: typeof prodId } 
      });
    }

    // Convertir prodId en entier si c'est une string
    const productId = parseInt(prodId);
    if (isNaN(productId)) {
      console.log('❌ Invalid product ID:', prodId);
      return res.status(400).json({ 
        success: false, 
        message: "ID produit invalide - doit être un nombre",
        debug: { prodId, parsedId: productId } 
      });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Utilisateur non trouvé" 
      });
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Produit non trouvé" 
      });
    }

    // Check if product is already in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      where: { 
        userId: userId, 
        productId: productId 
      }
    });

    if (existingWishlistItem) {
      // Remove from wishlist if already exists
      await Wishlist.destroy({
        where: { 
          userId: userId, 
          productId: productId 
        }
      });
      
      console.log('✅ Product removed from wishlist:', { userId, productId });
      return res.json({
        success: true,
        message: "Produit retiré de la wishlist",
        action: "removed"
      });
    } else {
      // Add to wishlist
      await Wishlist.create({
        userId: userId,
        productId: productId
      });
      
      console.log('✅ Product added to wishlist:', { userId, productId });
      return res.json({
        success: true,
        message: "Produit ajouté à la wishlist",
        action: "added"
      });
    }
  } catch (error) {
    console.error("Erreur wishlist:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur interne du serveur",
      error: error.message 
    });
  }
});

// Ajouter une évaluation (Temporairement désactivée)
const rating = asyncHandler(async (req, res) => {
  res.status(501).json({ message: "Fonction rating temporairement désactivée pendant la migration" });
});

module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages
};