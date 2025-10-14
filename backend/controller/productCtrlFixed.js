// ===== CONTRÔLEUR PRODUITS CORRIGÉ =====
const { Product, User, Order, Category, Brand, Color } = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const fs = require("fs");
const cloudinaryUploadImg = require("../utils/cloudinary");

// ===== CRUD OPERATIONS =====

// CREATE - Créer un produit
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { 
      title, 
      description, 
      price, 
      category, 
      subcategory,
      brand, 
      color, 
      tags, 
      quantity, 
      images 
    } = req.body;

    // Validation des champs obligatoires
    if (!title || !description || !price || !category || !brand || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis"
      });
    }

    // Vérifier que la catégorie existe
    const categoryExists = await Category.findByPk(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Catégorie non valide"
      });
    }

    // Vérifier la sous-catégorie si fournie
    if (subcategory) {
      const subcategoryExists = await Category.findByPk(subcategory);
      if (!subcategoryExists || subcategoryExists.parentId !== parseInt(category)) {
        return res.status(400).json({
          success: false,
          message: "Sous-catégorie non valide"
        });
      }
    }

    // Générer le slug
    const slug = slugify(title.toLowerCase());

    // Vérifier que le slug est unique
    const existingProduct = await Product.findOne({ where: { slug: slug } });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Un produit avec ce titre existe déjà"
      });
    }

    // Préparer les données du produit
    const productData = {
      title,
      slug,
      description,
      price: parseFloat(price),
      category: parseInt(category),
      subcategory: subcategory ? parseInt(subcategory) : null,
      brand,
      color: Array.isArray(color) ? JSON.stringify(color) : color,
      tags,
      quantity: parseInt(quantity),
      images: Array.isArray(images) ? JSON.stringify(images) : images
    };

    // Créer le produit
    const newProduct = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du produit",
      error: error.message
    });
  }
});

// READ - Récupérer tous les produits
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      subcategory,
      brand, 
      minPrice, 
      maxPrice, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereClause = {};
    
    // Filtrer par catégorie
    if (category) {
      whereClause.category = category;
    }
    
    // Filtrer par sous-catégorie
    if (subcategory) {
      whereClause.subcategory = subcategory;
    }
    
    // Filtrer par marque
    if (brand) {
      whereClause.brand = brand;
    }
    
    // Filtrer par prix
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }
    
    // Recherche par titre ou description
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { tags: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: Category,
          as: 'categoryInfo',
          attributes: ['id', 'title', 'slug']
        }
      ]
    });

    // Traiter les données pour le frontend
    const products = rows.map(product => {
      const productData = product.toJSON();
      
      // Parser les JSON si nécessaire
      if (productData.color && typeof productData.color === 'string') {
        try {
          productData.color = JSON.parse(productData.color);
        } catch (e) {
          productData.color = [];
        }
      }
      
      if (productData.images && typeof productData.images === 'string') {
        try {
          productData.images = JSON.parse(productData.images);
        } catch (e) {
          productData.images = [];
        }
      }
      
      return productData;
    });

    res.json({
      success: true,
      products: products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des produits",
      error: error.message
    });
  }
});

// READ - Récupérer un produit par ID
const getaProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID produit requis"
      });
    }

    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'categoryInfo',
          attributes: ['id', 'title', 'slug', 'description']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    // Traiter les données JSON
    const productData = product.toJSON();
    
    if (productData.color && typeof productData.color === 'string') {
      try {
        productData.color = JSON.parse(productData.color);
      } catch (e) {
        productData.color = [];
      }
    }
    
    if (productData.images && typeof productData.images === 'string') {
      try {
        productData.images = JSON.parse(productData.images);
      } catch (e) {
        productData.images = [];
      }
    }

    res.json({
      success: true,
      product: productData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du produit",
      error: error.message
    });
  }
});

// UPDATE - Mettre à jour un produit
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID produit requis"
      });
    }

    // Vérifier si le produit existe
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    // Générer un nouveau slug si le titre change
    if (updateData.title && updateData.title !== product.title) {
      updateData.slug = slugify(updateData.title.toLowerCase());
      
      // Vérifier l'unicité du nouveau slug
      const existingProduct = await Product.findOne({ 
        where: { 
          slug: updateData.slug,
          id: { [Op.ne]: id }
        } 
      });
      
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Un produit avec ce titre existe déjà"
        });
      }
    }

    // Valider la catégorie si elle change
    if (updateData.category) {
      const categoryExists = await Category.findByPk(updateData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Catégorie non valide"
        });
      }
    }

    // Valider la sous-catégorie si elle change
    if (updateData.subcategory) {
      const subcategoryExists = await Category.findByPk(updateData.subcategory);
      if (!subcategoryExists) {
        return res.status(400).json({
          success: false,
          message: "Sous-catégorie non valide"
        });
      }
    }

    // Traiter les champs JSON
    if (updateData.color && Array.isArray(updateData.color)) {
      updateData.color = JSON.stringify(updateData.color);
    }
    
    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images = JSON.stringify(updateData.images);
    }

    // Mettre à jour le produit
    await Product.update(updateData, { where: { id: id } });
    
    // Récupérer le produit mis à jour
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'categoryInfo',
          attributes: ['id', 'title', 'slug']
        }
      ]
    });

    res.json({
      success: true,
      message: "Produit mis à jour avec succès",
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du produit",
      error: error.message
    });
  }
});

// DELETE - Supprimer un produit
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID produit requis"
      });
    }

    // Vérifier si le produit existe
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    // Supprimer le produit
    await Product.destroy({ where: { id: id } });

    res.json({
      success: true,
      message: "Produit supprimé avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du produit",
      error: error.message
    });
  }
});

// ===== FONCTIONS SPÉCIALISÉES =====

// Ajouter à la wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  try {
    let { prodId } = req.body;
    const userId = req.user.id;
    
    console.log("📝 Wishlist request body:", JSON.stringify(req.body));
    console.log("📝 Received prodId:", prodId, "Type:", typeof prodId);
    console.log("📝 User ID:", userId);
    
    // Si prodId est un objet, extraire l'ID
    if (typeof prodId === 'object' && prodId !== null) {
      prodId = prodId.id;
      console.log("📝 Extracted ID from object:", prodId);
    }
    
    if (!prodId) {
      console.log("❌ prodId is missing or falsy");
      return res.status(400).json({
        success: false,
        message: "ID produit requis"
      });
    }

    // Vérifier si le produit existe
    const product = await Product.findByPk(prodId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    // Importer le modèle Wishlist
    const { Wishlist } = require('../models');

    // Vérifier si le produit est déjà dans la wishlist
    const existingWishlist = await Wishlist.findOne({
      where: {
        userId: userId,
        productId: prodId
      }
    });

    if (existingWishlist) {
      // Retirer de la wishlist
      await Wishlist.destroy({
        where: {
          userId: userId,
          productId: prodId
        }
      });
      
      res.json({
        success: true,
        message: "Produit retiré de la wishlist",
        action: 'removed'
      });
    } else {
      // Ajouter à la wishlist
      await Wishlist.create({
        userId: userId,
        productId: prodId
      });
      
      res.json({
        success: true,
        message: "Produit ajouté à la wishlist",
        action: 'added'
      });
    }
  } catch (error) {
    console.error("❌❌❌ ERREUR WISHLIST DÉTAILLÉE ❌❌❌");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Name:", error.name);
    console.error("Full error:", JSON.stringify(error, null, 2));
    res.status(500).json({
      success: false,
      message: "Erreur lors de la gestion de la wishlist",
      error: error.message
    });
  }
});

// Noter un produit
const rating = asyncHandler(async (req, res) => {
  try {
    const { star, prodId, comment } = req.body;
    const userId = req.user.id;
    
    if (!star || !prodId) {
      return res.status(400).json({
        success: false,
        message: "Note et ID produit requis"
      });
    }

    const product = await Product.findByPk(prodId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    let alreadyRated = product.ratings.find(
      (rating) => rating.postedby.toString() === userId.toString()
    );

    if (alreadyRated) {
      // Mettre à jour la note existante
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      // Ajouter une nouvelle note
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: userId,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    // Calculer la note moyenne
    const getallratings = await Product.findByPk(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Note ajoutée avec succès",
      product: finalproduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de la note",
      error: error.message
    });
  }
});

// Upload d'images
const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier à uploader"
      });
    }

    for (const file of files) {
      const { path } = file;
      try {
        const newpath = await uploader(path);
        urls.push(newpath);
        fs.unlinkSync(path); // Supprimer le fichier temporaire
      } catch (uploadError) {
        console.error("Erreur upload:", uploadError);
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      }
    }

    res.json({
      success: true,
      message: "Images uploadées avec succès",
      images: urls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload des images",
      error: error.message
    });
  }
});

module.exports = {
  createProduct,
  getAllProduct,
  getaProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  uploadImages,
};