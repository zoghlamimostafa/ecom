// ===== CONTRÔLEUR UTILISATEURS CORRIGÉ =====
const { User, Cart, Product, Coupon, Order, OrderItem, Color, Op } = require('../models');
const generateResetToken = require('../config/generateResetToken');
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const sendEmail = require("../controller/emailCtrl");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");
const verifyResetToken = require("../config/verifyResetToken");
const bcrypt = require('bcrypt');
const { normalizeProductData } = require('../utils/imageNormalizer');

// ===== CRUD OPERATIONS =====

// CREATE - Créer un utilisateur
const createUser = asyncHandler(async (req, res) => {
  try {
    const { email, password, firstname, lastname, mobile } = req.body;
    
    // Validation des champs obligatoires
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis"
      });
    }

    // Validation robuste du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 8 caractères"
      });
    }

    // Vérifier complexité du mot de passe (au moins une lettre et un chiffre)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre"
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const findUser = await User.findOne({ where: { email: email } });
    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà"
      });
    }

    // Créer le nouvel utilisateur
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password, // Le mot de passe sera hashé par le hook beforeCreate
      mobile: mobile || null,
      role: "user"
    });

    // Generate tokens for immediate authentication
    const token = generateToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);
    
    // Save refresh token to database
    await User.update(
      { refreshToken: refreshToken }, 
      { where: { id: newUser.id } }
    );

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 3 days
    });

    // Retourner les données sans le mot de passe, avec token
    const { password: pwd, refreshToken: rt, ...userWithoutPassword } = newUser.toJSON();
    
    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    console.error('Erreur createUser:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message
    });
  }
});

// CREATE - Créer un administrateur
const createAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password, firstname, lastname, mobile } = req.body;
    
    // Validation des champs obligatoires
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis"
      });
    }

    // Validation robuste du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 8 caractères"
      });
    }

    // Vérifier complexité du mot de passe (au moins une lettre et un chiffre)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre"
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const findUser = await User.findOne({ where: { email: email } });
    if (findUser) {
      return res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà"
      });
    }

    // Créer le nouvel administrateur
    const newAdmin = await User.create({
      firstname,
      lastname,
      email,
      password,
      mobile: mobile || null,
      role: "admin"
    });

    // Retourner les données sans le mot de passe
    const { password: pwd, ...adminWithoutPassword } = newAdmin.toJSON();
    
    res.status(201).json({
      success: true,
      message: "Administrateur créé avec succès",
      admin: adminWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'administrateur",
      error: error.message
    });
  }
});

// READ - Récupérer tous les utilisateurs
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    // Filtrer par rôle si spécifié
    if (role) {
      whereClause.role = role;
    }
    
    // Recherche par nom ou email
    if (search) {
      whereClause[Op.or] = [
        { firstname: { [Op.like]: `%${search}%` } },
        { lastname: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] }, // Exclure le mot de passe
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      users: rows,
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
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message
    });
  }
});

// READ - Récupérer un utilisateur par ID
const getaUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID utilisateur requis"
      });
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Cart,
          as: 'cart'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message
    });
  }
});

// UPDATE - Mettre à jour un utilisateur
const updatedUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, mobile, role } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID utilisateur requis"
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ 
        where: { 
          email: email,
          id: { [Op.ne]: id }
        } 
      });
      
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé par un autre utilisateur"
        });
      }
    }

    // Mettre à jour les données
    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;
    if (role) updateData.role = role;

    await User.update(updateData, { where: { id: id } });
    
    // Récupérer l'utilisateur mis à jour
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: error.message
    });
  }
});

// UPDATE PROFILE - Mettre à jour le profil de l'utilisateur connecté
const updateProfile = asyncHandler(async (req, res) => {
  try {
    // Get user ID from authenticated user (from authMiddleware)
    // Pour MySQL/Sequelize, c'est 'id' et non '_id' (MongoDB)
    const userId = req.user.id;
    const { firstname, lastname, email, mobile } = req.body;
    
    console.log('📝 Update Profile - User ID:', userId);
    console.log('📝 Update Profile - Data:', { firstname, lastname, email, mobile });

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ 
        where: { 
          email: email,
          id: { [Op.ne]: userId }
        } 
      });
      
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé par un autre utilisateur"
        });
      }
    }

    // Mettre à jour les données
    const updateData = {};
    if (firstname !== undefined) updateData.firstname = firstname;
    if (lastname !== undefined) updateData.lastname = lastname;
    if (email !== undefined) updateData.email = email;
    if (mobile !== undefined) updateData.mobile = mobile;

    await User.update(updateData, { where: { id: userId } });
    
    // Récupérer l'utilisateur mis à jour
    const updatedUserData = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    console.log('✅ Profile updated successfully');

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: updatedUserData
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Erreur lors de la mise à jour du profil"
    });
  }
});

// DELETE - Supprimer un utilisateur
const deleteaUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID utilisateur requis"
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // Supprimer l'utilisateur
    await User.destroy({ where: { id: id } });

    res.json({
      success: true,
      message: "Utilisateur supprimé avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message
    });
  }
});

// ===== FONCTIONS D'AUTHENTIFICATION =====

// Connexion utilisateur
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    // Chercher l'utilisateur avec le mot de passe
    const findUser = await User.findOne({ where: { email: email } });
    
    if (!findUser) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides"
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await findUser.isPasswordMatched(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides"
      });
    }

    // Générer les tokens
    const token = generateToken(findUser.id);
    const refreshToken = generateRefreshToken(findUser.id);
    
    // Sauvegarder le refresh token
    await User.update(
      { refreshToken: refreshToken }, 
      { where: { id: findUser.id } }
    );

    // Configurer le cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 3 jours
    });

    // Retourner les données sans le mot de passe
    const { password: pwd, refreshToken: rt, ...userWithoutSensitiveData } = findUser.toJSON();

    res.json({
      success: true,
      message: "Connexion réussie",
      user: userWithoutSensitiveData,
      token: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message
    });
  }
});

// Connexion admin
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis"
      });
    }

    // Chercher l'admin
    const findAdmin = await User.findOne({ 
      where: { 
        email: email,
        role: "admin"
      } 
    });
    
    if (!findAdmin) {
      return res.status(401).json({
        success: false,
        message: "Accès administrateur non autorisé"
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await findAdmin.isPasswordMatched(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Identifiants invalides"
      });
    }

    // Générer les tokens
    const token = generateToken(findAdmin.id);
    const refreshToken = generateRefreshToken(findAdmin.id);
    
    // Sauvegarder le refresh token
    await User.update(
      { refreshToken: refreshToken }, 
      { where: { id: findAdmin.id } }
    );

    // Configurer le cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000, // 3 jours
    });

    // Retourner les données sans le mot de passe
    const { password: pwd, refreshToken: rt, ...adminWithoutSensitiveData } = findAdmin.toJSON();

    res.json({
      success: true,
      message: "Connexion admin réussie",
      admin: adminWithoutSensitiveData,
      token: token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion admin",
      error: error.message
    });
  }
});

// Déconnexion
const logout = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Aucun refresh token trouvé"
      });
    }

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ where: { refreshToken: refreshToken } });
    
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.status(204).json({
        success: true,
        message: "Déconnexion réussie"
      });
    }

    // Supprimer le refresh token de la base de données
    await User.update(
      { refreshToken: null }, 
      { where: { refreshToken: refreshToken } }
    );
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    
    res.status(204).json({
      success: true,
      message: "Déconnexion réussie"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la déconnexion",
      error: error.message
    });
  }
});

// GET - Wishlist with full product objects (for frontend)
const getUserProductWishlist = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 getUserProductWishlist - userId:", userId);
    
    // Get all wishlist entries for this user
    const wishlistEntries = await require('../models/Wishlist').findAll({
      where: { userId },
    });
    console.log("🔍 Wishlist entries count:", wishlistEntries.length);
    
    const productIds = wishlistEntries.map(w => w.productId);
    // Fetch all products in the wishlist
    const products = await Product.findAll({
      where: { id: productIds },
    });
    console.log("🔍 Products found:", products.length);
    
    // Normaliser tous les produits
    const result = products.map(product => {
      const productJson = product.toJSON();
      console.log("🔍 Product AVANT normalisation:", {
        id: productJson.id,
        title: productJson.title,
        images: productJson.images,
        imagesType: typeof productJson.images
      });
      
      const normalized = normalizeProductData(productJson);
      
      console.log("🔍 Product APRES normalisation:", {
        id: normalized.id,
        title: normalized.title,
        images: normalized.images
      });
      
      return normalized;
    });
    
    console.log("✅ getUserProductWishlist - Returning", result.length, "products");
    res.json(result);
  } catch (error) {
    console.error("❌ getUserProductWishlist error:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la wishlist', error: error.message });
  }
});

// GET - Cart with full product objects (for frontend)
const getUserCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 getUserCart - userId:", userId);
    
    // Get all cart entries for this user
    const cartEntries = await require('../models/Cart').findAll({
      where: { userId },
    });
    console.log("🔍 Cart entries count:", cartEntries.length);
    
    // Fetch all products in the cart
    const productIds = cartEntries.map(c => c.productId);
    const products = await Product.findAll({
      where: { id: productIds },
    });
    console.log("🔍 Products found:", products.length);
    
    // Map productId to product object normalisé
    const productMap = {};
    products.forEach(product => {
      const productJson = product.toJSON();
      console.log("🔍 Cart Product AVANT normalisation:", {
        id: productJson.id,
        title: productJson.title,
        images: productJson.images,
        imagesType: typeof productJson.images
      });
      
      const normalizedProduct = normalizeProductData(productJson);
      
      console.log("🔍 Cart Product APRES normalisation:", {
        id: normalizedProduct.id,
        title: normalizedProduct.title,
        images: normalizedProduct.images
      });
      
      productMap[product.id] = normalizedProduct;
    });
    
    // Build cart response with product details
    const result = cartEntries.map(cartItem => {
      const cartData = cartItem.toJSON();
      const product = productMap[cartItem.productId] || null;
      
      // Ajouter les images normalisées au niveau du cart item pour un accès facile
      if (product && product.images) {
        cartData.images = product.images;
        console.log("✅ Images copiées au niveau racine pour productId:", cartItem.productId);
      }
      
      return {
        ...cartData,
        product,
      };
    });
    
    console.log("✅ getUserCart - Returning", result.length, "cart items");
    res.json(result);
  } catch (error) {
    console.error("❌ getUserCart error:", error);
    res.status(500).json({ message: 'Erreur lors de la récupération du panier', error: error.message });
  }
});

// Autres fonctions existantes maintenues pour compatibilité...
// (handleRefreshToken, updatePassword, forgotPasswordToken, etc.)
// [Le reste du code existant reste inchangé]

module.exports = {
  createUser,
  createAdmin,
  getAllUser,
  getaUser,
  updatedUser,
  updateProfile, // NEW: Profile update for authenticated user
  deleteaUser,
  loginUser,
  loginAdmin,
  logout,
  // Fonctions existantes pour compatibilité
  loginUserCtrl: loginUser,
  getallUser: getAllUser,
  
  // Block user
  blockUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      user.isBlocked = true;
      await user.save();
      
      res.json({
        success: true,
        message: 'Utilisateur bloqué avec succès'
      });
    } catch (error) {
      console.error('Error blocking user:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du blocage de l\'utilisateur'
      });
    }
  }),
  
  // Unblock user
  unblockUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }
      
      user.isBlocked = false;
      await user.save();
      
      res.json({
        success: true,
        message: 'Utilisateur débloqué avec succès'
      });
    } catch (error) {
      console.error('Error unblocking user:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du déblocage de l\'utilisateur'
      });
    }
  }),
  
  // DELETE - Remove product from cart
  removeProductFromCart: asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { cartItemId } = req.body;
      
      console.log("🗑️ removeProductFromCart - userId:", userId, "cartItemId:", cartItemId);
      
      if (!cartItemId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID du produit manquant' 
        });
      }
      
      // Vérifier que l'item existe et appartient à l'utilisateur
      const cartItem = await Cart.findOne({
        where: { 
          id: cartItemId,
          userId: userId 
        }
      });
      
      if (!cartItem) {
        console.log("❌ Cart item not found or doesn't belong to user");
        return res.status(404).json({ 
          success: false,
          message: 'Article non trouvé dans votre panier' 
        });
      }
      
      // Supprimer l'item
      await cartItem.destroy();
      
      console.log("✅ Cart item deleted successfully");
      
      res.json({ 
        success: true,
        message: 'Produit supprimé du panier avec succès' 
      });
    } catch (error) {
      console.error("❌ removeProductFromCart error:", error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la suppression du produit', 
        error: error.message 
      });
    }
  }),
  
  // ===== ORDER MANAGEMENT =====
  
  // Récupérer les commandes de l'utilisateur connecté
  getMyOrders: asyncHandler(async (req, res) => {
    const userId = req.user?.id; // Sequelize utilise 'id', pas '_id'

    if (!userId) {
      console.error('❌ ID utilisateur manquant dans req.user:', req.user);
      return res.status(400).json({ 
        success: false,
        message: "ID utilisateur invalide" 
      });
    }

    console.log('✅ Récupération des commandes pour userId:', userId);

    try {
      const orders = await Order.findAll({
        where: { userId: userId },
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'price', 'images', 'slug']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Normaliser les données des produits
      const normalizedOrders = orders.map(order => {
        const orderData = order.toJSON();
        if (orderData.orderItems) {
          orderData.orderItems = orderData.orderItems.map(item => {
            if (item.product) {
              item.product = normalizeProductData(item.product);
            }
            return item;
          });
        }
        return orderData;
      });

      res.json(normalizedOrders);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des commandes:", error);
      res.status(500).json({ 
        success: false,
        message: "Erreur lors de la récupération des commandes",
        error: error.message 
      });
    }
  }),

  // Créer une commande depuis le panier
  createOrder: asyncHandler(async (req, res) => {
    const userId = req.user?.id; // Sequelize utilise 'id', pas '_id'
    const { shippingInfo, paymentInfo, totalPrice: frontendTotal, shippingCost, subtotal, couponCode } = req.body;

    console.log('📦 Données reçues pour createOrder:', JSON.stringify(req.body, null, 2));
    console.log('📋 shippingInfo:', JSON.stringify(shippingInfo, null, 2));
    console.log('💰 Total frontend (avec livraison):', frontendTotal);
    console.log('🚚 Frais de livraison:', shippingCost);
    console.log('💵 Sous-total:', subtotal);
    console.log('🎫 Code coupon:', couponCode || 'Aucun');

    if (!userId) {
      console.error('❌ ID utilisateur manquant dans req.user');
      return res.status(400).json({
        success: false,
        message: "ID utilisateur invalide"
      });
    }

    try {
      // Validation des données de livraison
      if (!shippingInfo || !shippingInfo.firstName || !shippingInfo.address || !shippingInfo.city) {
        console.error('❌ Validation échouée - shippingInfo incomplet:', shippingInfo);
        return res.status(400).json({
          success: false,
          message: "Informations de livraison incomplètes"
        });
      }

      // Récupérer le panier de l'utilisateur
      const cartItems = await Cart.findAll({
        where: { userId: userId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'title', 'price', 'quantity', 'images']
          }
        ]
      });

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Votre panier est vide"
        });
      }

      // Calculer le total des produits seulement
      let cartTotal = 0;
      const orderItemsData = [];

      for (const item of cartItems) {
        if (!item.product) {
          continue;
        }

        // Vérifier le stock
        if (item.product.quantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Stock insuffisant pour ${item.product.title}`
          });
        }

        const itemTotal = item.price * item.quantity;
        cartTotal += itemTotal;

        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          color: item.color
        });
      }

      // Utiliser le totalPrice du frontend qui inclut déjà la livraison
      let finalTotal = frontendTotal || (cartTotal + (shippingCost || 0));
      let couponApplied = null;
      let couponDiscount = 0;
      let totalAfterDiscount = finalTotal;
      
      // Appliquer le coupon si fourni
      if (couponCode && couponCode.trim() !== '') {
        try {
          const coupon = await Coupon.findOne({ 
            where: { name: couponCode.toUpperCase() } 
          });

          if (coupon && coupon.isActive) {
            const now = new Date();
            const expiryDate = new Date(coupon.expiry);
            
            // Vérifier validité
            if (expiryDate >= now && (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit)) {
              couponDiscount = parseFloat(coupon.discount);
              const discountAmount = (finalTotal * couponDiscount) / 100;
              totalAfterDiscount = finalTotal - discountAmount;
              couponApplied = coupon.name;
              
              // Incrémenter le compteur d'utilisation
              await Coupon.update(
                { usageCount: coupon.usageCount + 1 },
                { where: { id: coupon.id } }
              );
              
              console.log('✅ Coupon appliqué:', {
                code: couponApplied,
                discount: couponDiscount + '%',
                discountAmount: discountAmount.toFixed(2),
                totalBeforeDiscount: finalTotal,
                totalAfterDiscount: totalAfterDiscount.toFixed(2)
              });
            } else {
              console.log('⚠️ Coupon invalide ou expiré:', couponCode);
            }
          } else {
            console.log('⚠️ Coupon non trouvé ou inactif:', couponCode);
          }
        } catch (couponError) {
          console.error('❌ Erreur lors de l\'application du coupon:', couponError);
          // On continue sans coupon en cas d'erreur
        }
      }
      
      console.log('✅ Total panier:', cartTotal);
      console.log('✅ Total final (avec livraison):', finalTotal);
      console.log('✅ Total après réduction:', totalAfterDiscount);

      // Créer la commande
      const order = await Order.create({
        userId: userId,
        shippingInfo,
        paymentInfo: paymentInfo || { method: 'COD' },
        totalPrice: finalTotal,
        totalPriceAfterDiscount: totalAfterDiscount,
        couponApplied: couponApplied,
        couponDiscount: couponDiscount,
        orderStatus: paymentInfo?.method === 'COD' ? 'Cash on Delivery' : 'Not Processed'
      });

      // Créer les OrderItems
      for (const itemData of orderItemsData) {
        await OrderItem.create({
          orderId: order.id,
          ...itemData
        });
      }

      // Mettre à jour le stock des produits
      for (const item of cartItems) {
        if (item.product) {
          await Product.update(
            {
              quantity: item.product.quantity - item.quantity,
              sold: (item.product.sold || 0) + item.quantity
            },
            { where: { id: item.productId } }
          );
        }
      }

      // Vider le panier
      await Cart.destroy({ where: { userId: userId } });

      // Récupérer la commande complète avec les items
      const completeOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'price', 'images', 'slug']
              }
            ]
          }
        ]
      });

      res.json({
        success: true,
        message: "Commande créée avec succès",
        order: completeOrder
      });

    } catch (error) {
      console.error("❌ Erreur lors de la création de la commande:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la commande",
        error: error.message
      });
    }
  }),

  // Récupérer toutes les commandes (admin)
  getAllOrders: asyncHandler(async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstname', 'lastname', 'email', 'mobile']
          },
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'price', 'images', 'slug']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        count: orders.length,
        orders
      });
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de toutes les commandes:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des commandes",
        error: error.message
      });
    }
  }),

  // Récupérer une commande par ID utilisateur (admin)
  getOrderByUserId: asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const orders = await Order.findAll({
        where: { userId: id },
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'price', 'images', 'slug']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        count: orders.length,
        orders
      });
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des commandes:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des commandes",
        error: error.message
      });
    }
  }),

  // Mettre à jour le statut d'une commande (admin)
  updateOrderStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const validStatuses = ['Not Processed', 'Cash on Delivery', 'Processing', 'Dispatched', 'Cancelled', 'Delivered'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Statut invalide"
        });
      }

      const order = await Order.findByPk(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Commande non trouvée"
        });
      }

      await order.update({ orderStatus: status });

      const updatedOrder = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          }
        ]
      });

      res.json({
        success: true,
        message: "Statut de la commande mis à jour",
        order: updatedOrder
      });
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du statut:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du statut",
        error: error.message
      });
    }
  }),

  // Supprimer une commande (admin)
  deleteOrder: asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const order = await Order.findByPk(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Commande non trouvée"
        });
      }

      // Supprimer les OrderItems associés
      await OrderItem.destroy({ where: { orderId: id } });
      
      // Supprimer la commande
      await order.destroy();

      res.json({
        success: true,
        message: "Commande supprimée avec succès"
      });
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de la commande:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de la commande",
        error: error.message
      });
    }
  }),

  // Récupérer une seule commande par son ID (admin)
  getOrderById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      console.log("📋 Admin - Récupération de la commande:", id);
      
      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'title', 'price', 'images', 'slug', 'brandId', 'createdAt']
              }
            ]
          }
        ]
      });

      if (!order) {
        console.log("❌ Commande non trouvée:", id);
        return res.status(404).json({
          success: false,
          message: "Commande non trouvée"
        });
      }

      console.log("✅ Commande récupérée:", {
        orderId: order.id,
        userId: order.userId,
        itemsCount: order.orderItems?.length || 0
      });

      res.json({
        success: true,
        order
      });
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de la commande:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de la commande",
        error: error.message
      });
    }
  }),

  forgotPasswordToken: asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    try {
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Aucun utilisateur trouvé avec cet email'
        });
      }
      
      // Générer un token de réinitialisation sécurisé
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      // Sauvegarder le token hashé et l'expiration (1 heure)
      user.passwordResetToken = hashedToken;
      user.passwordResetExpires = Date.now() + 3600000; // 1 heure
      await user.save();
      
      // URL de réinitialisation
      const resetURL = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
      
      // Contenu de l'email
      const emailContent = {
        to: email,
        subject: '🔐 Réinitialisation de votre mot de passe - Sanny Store',
        text: `Bonjour ${user.firstname},\n\nVous avez demandé une réinitialisation de mot de passe.\n\nCliquez sur ce lien pour réinitialiser votre mot de passe :\n${resetURL}\n\nCe lien expire dans 1 heure.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nCordialement,\nL'équipe Sanny Store`,
        htm: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #FF7A00 0%, #FF9F40 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #FF7A00; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
              .button:hover { background: #FF9F40; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Réinitialisation de mot de passe</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${user.firstname}</strong>,</p>
                <p>Vous avez demandé une réinitialisation de votre mot de passe pour votre compte Sanny Store.</p>
                <p style="text-align: center;">
                  <a href="${resetURL}" class="button">Réinitialiser mon mot de passe</a>
                </p>
                <p><strong>⚠️ Ce lien expire dans 1 heure.</strong></p>
                <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                <p style="word-break: break-all; color: #FF7A00;">${resetURL}</p>
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                  Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email. Votre mot de passe restera inchangé.
                </p>
              </div>
              <div class="footer">
                <p>© 2025 Sanny Store - Tous droits réservés</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      // Envoyer l'email
      await sendEmail(emailContent);
      
      console.log(`✅ Email de réinitialisation envoyé à ${email}`);
      console.log(`🔑 Token (dev uniquement): ${resetToken}`);
      
      res.json({
        success: true,
        message: 'Un email de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception.'
      });
      
    } catch (error) {
      console.error('❌ Erreur forgotPasswordToken:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de réinitialisation. Veuillez réessayer.'
      });
    }
  }),
  
  getUserProductWishlist,
  getUserCart,
};