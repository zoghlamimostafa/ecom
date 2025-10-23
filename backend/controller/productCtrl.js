// ===== CONTRÔLEUR PRODUITS CORRIGÉ =====
const { Product, User, Order, Category, Brand, Color, Cart, Wishlist, ProductRating, OrderItem } = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const fs = require("fs");
const cloudinaryUploadImg = require("../utils/cloudinary");
const { normalizeProductData } = require('../utils/imageNormalizer');

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

    // Validation des champs obligatoires (brand est maintenant optionnel)
    if (!title || !description || !price || !category || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis"
      });
    }

    // ✅ VALIDATION DES IMAGES - Au moins une image requise
    if (!images || (Array.isArray(images) && images.length === 0) || 
        (typeof images === 'string' && (images === '[]' || images === ''))) {
      return res.status(400).json({
        success: false,
        message: "Au moins une image est requise"
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
      // Images: toujours stocker en string JSON, peu importe le format reçu
      images: typeof images === 'string' ? images : JSON.stringify(images || [])
    };

    console.log("📦 Product data à sauvegarder:", {
      title,
      imagesType: typeof images,
      imagesValue: images,
      imagesSaved: productData.images
    });

    // Créer le produit
    const newProduct = await Product.create(productData);
    
    // Retourner le produit avec images normalisées
    const normalizedProduct = normalizeProductData(newProduct);
    
    console.log("✅ Produit créé et normalisé:", {
      id: normalizedProduct.id,
      images: normalizedProduct.images
    });

    res.status(201).json({
      success: true,
      message: "Produit créé avec succès",
      product: normalizedProduct
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
      order: [[sortBy, sortOrder]]
    });

    // Récupérer toutes les catégories pour le mapping
    const categories = await Category.findAll({
      attributes: ['id', 'title', 'slug']
    });
    
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = cat.toJSON();
    });

    // Traiter les données pour le frontend avec normalisation
    const products = rows.map(product => {
      const productJson = product.toJSON();
      let productData = normalizeProductData(productJson);
      
      // Ajouter les informations de catégorie
      if (productData.category && categoryMap[productData.category]) {
        productData.categoryInfo = categoryMap[productData.category];
        productData.categoryName = categoryMap[productData.category].title;
      }
      
      if (productData.subcategory && categoryMap[productData.subcategory]) {
        productData.subcategoryInfo = categoryMap[productData.subcategory];
        productData.subcategoryName = categoryMap[productData.subcategory].title;
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

// READ - Récupérer un produit par ID ou Slug
const getaProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID ou slug produit requis"
      });
    }

    // Chercher par ID ou par slug
    let product;
    
    // Si c'est un nombre, chercher par ID
    if (!isNaN(id)) {
      product = await Product.findByPk(id);
    }
    
    // Si pas trouvé par ID ou si c'est un slug, chercher par slug
    if (!product) {
      product = await Product.findOne({ where: { slug: id } });
    }

    if (!product) {
      console.log('❌ Produit non trouvé pour:', id);
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }
    
    console.log('✅ Produit trouvé:', product.id, '-', product.title);

    // Normaliser les données du produit
    const productJson = product.toJSON();
    let productData = normalizeProductData(productJson);
    
    // Récupérer les informations de catégorie
    if (productData.category) {
      const category = await Category.findByPk(productData.category, {
        attributes: ['id', 'title', 'slug', 'description']
      });
      if (category) {
        productData.categoryInfo = category.toJSON();
        productData.categoryName = category.title;
      }
    }
    
    if (productData.subcategory) {
      const subcategory = await Category.findByPk(productData.subcategory, {
        attributes: ['id', 'title', 'slug', 'description']
      });
      if (subcategory) {
        productData.subcategoryInfo = subcategory.toJSON();
        productData.subcategoryName = subcategory.title;
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
    
    console.log("📝 UPDATE PRODUCT - ID:", id);
    console.log("📝 Update data reçu:", {
      title: updateData.title,
      price: updateData.price,
      images: updateData.images ? (Array.isArray(updateData.images) ? `Array(${updateData.images.length})` : typeof updateData.images) : 'undefined'
    });
    
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

    console.log("📝 Produit actuel:", {
      titre_actuel: product.title,
      prix_actuel: product.price
    });

    // Générer un nouveau slug si le titre change
    if (updateData.title && updateData.title !== product.title) {
      updateData.slug = slugify(updateData.title.toLowerCase());
      console.log("📝 Nouveau slug généré:", updateData.slug);
      
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
    
    // Images: toujours stocker en string JSON
    if (updateData.images) {
      updateData.images = typeof updateData.images === 'string' 
        ? updateData.images 
        : JSON.stringify(updateData.images);
    }
    
    console.log("📦 Update data:", {
      id,
      imagesType: typeof updateData.images,
      imagesValue: updateData.images
    });

    // Mettre à jour le produit
    await Product.update(updateData, { where: { id: id } });
    
    // Récupérer le produit mis à jour et le normaliser
    const updatedProductRaw = await Product.findByPk(id);
    const updatedProduct = normalizeProductData(updatedProductRaw);
    
    console.log("✅ Produit mis à jour et normalisé:", {
      id: updatedProduct.id,
      images: updatedProduct.images
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
    
    console.log(`🗑️ Demande de suppression du produit ID: ${id}`);
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID produit requis"
      });
    }

    // Vérifier si le produit existe
    const product = await Product.findByPk(id);
    if (!product) {
      console.log(`❌ Produit ${id} non trouvé`);
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    console.log(`✅ Produit trouvé: ${product.title}`);

    // Supprimer les relations avant de supprimer le produit (évite les erreurs FK)
    // Les modèles sont déjà importés en haut du fichier
    
    // 1. Supprimer de tous les paniers
    const deletedCarts = await Cart.destroy({ where: { productId: id } });
    console.log(`🛒 Supprimé ${deletedCarts} items de Cart`);
    
    // 2. Supprimer de toutes les wishlists
    const deletedWishlists = await Wishlist.destroy({ where: { productId: id } });
    console.log(`❤️ Supprimé ${deletedWishlists} items de Wishlist`);
    
    // 3. Supprimer tous les ratings/avis
    const deletedRatings = await ProductRating.destroy({ where: { productId: id } });
    console.log(`⭐ Supprimé ${deletedRatings} ratings`);
    
    // 4. Vérifier les commandes existantes avec ce produit
    const orderItems = await OrderItem.findAll({ where: { productId: id } });
    if (orderItems && orderItems.length > 0) {
      console.log(`⚠️ Attention: ${orderItems.length} commandes contiennent ce produit`);
      // On ne supprime PAS les OrderItems pour préserver l'historique des commandes
      // On définit juste le productId à null pour indiquer que le produit n'existe plus
      await OrderItem.update(
        { productId: null },
        { where: { productId: id } }
      );
      console.log(`📦 OrderItems mis à jour (productId = null)`);
    }

    // 5. Enfin, supprimer le produit
    await Product.destroy({ where: { id: id } });
    console.log(`✅ Produit ${id} supprimé avec succès`);

    res.json({
      success: true,
      message: "Produit supprimé avec succès"
    });
  } catch (error) {
    console.error(`❌ Erreur lors de la suppression du produit ${req.params.id}:`, error);
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
      
      console.log("✅ Produit retiré de la wishlist");
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
      
      console.log("✅ Produit ajouté à la wishlist");
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
      // Mettre à jour la note existante avec Sequelize
      const product = await Product.findByPk(prodId);
      const ratings = product.ratings ? JSON.parse(JSON.stringify(product.ratings)) : [];
      
      const ratingIndex = ratings.findIndex(
        (rating) => rating.postedby.toString() === userId.toString()
      );
      
      if (ratingIndex !== -1) {
        ratings[ratingIndex].star = star;
        ratings[ratingIndex].comment = comment;
      }
      
      await Product.update({
        ratings: ratings
      }, {
        where: { id: prodId }
      });
    } else {
      // Ajouter une nouvelle note avec Sequelize
      const product = await Product.findByPk(prodId);
      const ratings = product.ratings ? JSON.parse(JSON.stringify(product.ratings)) : [];
      
      ratings.push({
        star: star,
        comment: comment,
        postedby: userId,
      });
      
      await Product.update({
        ratings: ratings
      }, {
        where: { id: prodId }
      });
    }

    // Calculer la note moyenne
    const getallratings = await Product.findByPk(prodId);
    let totalRating = getallratings.ratings ? getallratings.ratings.length : 0;
    let ratingsum = getallratings.ratings
      ? getallratings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0)
      : 0;
    let actualRating = totalRating > 0 ? Math.round(ratingsum / totalRating) : 0;
    
    await Product.update({
      totalrating: actualRating,
    }, {
      where: { id: prodId }
    });
    
    const finalproduct = await Product.findByPk(prodId);

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