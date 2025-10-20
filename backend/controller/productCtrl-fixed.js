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
    // Parse images if needed
    let productData = findProduct.toJSON ? findProduct.toJSON() : findProduct;
    if (productData.images && typeof productData.images === 'string') {
      try { productData.images = JSON.parse(productData.images); } catch { productData.images = []; }
    }
    res.json(productData);
  } catch (error) {
    throw new Error(error);
  }
});

// Récupération de tous les produits
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Construire les options de requête Sequelize
    const options = {
      where: {},
      order: [['createdAt', 'DESC']] // Par défaut, trier par date de création décroissante
    };

    // Gestion de la pagination
    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      options.limit = limit;
      options.offset = offset;
    }

    // Gestion du tri
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

    // Filtrage par prix
    if (req.query.price) {
      const priceFilter = req.query.price;
      if (priceFilter.gte) options.where.price = { [Op.gte]: parseFloat(priceFilter.gte) };
      if (priceFilter.lte) options.where.price = { ...options.where.price, [Op.lte]: parseFloat(priceFilter.lte) };
    }

    // Filtrage par catégorie
    if (req.query.category) {
      options.where.category = req.query.category;
    }

    // Filtrage par marque
    if (req.query.brand) {
      options.where.brand = req.query.brand;
    }

    const products = await Product.findAll(options);
    // Parse images for each product
    const parsedProducts = products.map(prod => {
      let data = prod.toJSON ? prod.toJSON() : prod;
      if (data.images && typeof data.images === 'string') {
        try { data.images = JSON.parse(data.images); } catch { data.images = []; }
      }
      return data;
    });
    res.json(parsedProducts);
  } catch (error) {
    throw new Error(error);
  }
});

// Ajouter à la wishlist (Temporairement désactivée)
const addToWishlist = asyncHandler(async (req, res) => {
  res.status(501).json({ message: "Fonction wishlist temporairement désactivée pendant la migration" });
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