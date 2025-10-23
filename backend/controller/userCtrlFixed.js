// ===== CONTRÔLEUR UTILISATEURS CORRIGÉ =====
const { User, Cart, Product, Coupon, Order, Color, Op } = require('../models');
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

    // Retourner les données sans le mot de passe
    const { password: pwd, ...userWithoutPassword } = newUser.toJSON();
    
    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword
    });
  } catch (error) {
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
    // Si pas d'ID dans params, utiliser l'ID de l'utilisateur connecté (req.user)
    const id = req.params.id || req.user.id;
    const { firstname, lastname, email, mobile, role } = req.body;
    
    console.log('🔄 Update user - ID:', id, 'User from auth:', req.user?.id);
    console.log('📝 Update data:', { firstname, lastname, email, mobile });
    
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
    if (role && req.user.role === 'admin') updateData.role = role; // Seulement admin peut changer role

    console.log('💾 Update data to save:', updateData);
    
    await User.update(updateData, { where: { id: id } });
    
    // Récupérer l'utilisateur mis à jour
    const updatedUserData = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    console.log('✅ User updated successfully:', updatedUserData.email);

    res.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      ...updatedUserData.toJSON() // Retourner directement les données user
    });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: error.message
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

// Autres fonctions existantes maintenues pour compatibilité...
// (handleRefreshToken, updatePassword, forgotPasswordToken, etc.)
// [Le reste du code existant reste inchangé]

module.exports = {
  createUser,
  createAdmin,
  getAllUser,
  getaUser,
  updatedUser,
  deleteaUser,
  loginUser,
  loginAdmin,
  logout,
  // ... autres exports existants
};