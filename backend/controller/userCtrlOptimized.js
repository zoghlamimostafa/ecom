const { User, Cart, Product, Order } = require('../models');
const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize');

// CRUD Optimisé pour les utilisateurs et admins

// 1. Obtenir tous les utilisateurs avec pagination optimisée
const getAllUsersOptimized = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100
    const offset = (page - 1) * limit;
    
    // Filtres de recherche
    const whereClause = {
      role: { [Op.ne]: 'admin' } // Exclure les admins
    };
    
    // Recherche par nom ou email
    if (req.query.search) {
      whereClause[Op.or] = [
        { firstname: { [Op.like]: `%${req.query.search}%` } },
        { lastname: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } }
      ];
    }
    
    // Filtrer par statut (bloqué/débloqué)
    if (req.query.status) {
      whereClause.isBlocked = req.query.status === 'blocked';
    }
    
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { 
        exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] 
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllUsersOptimized:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message
    });
  }
});

// 2. Obtenir un utilisateur par ID avec ses statistiques
const getUserByIdOptimized = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByPk(id, {
      attributes: { 
        exclude: ['password', 'refreshToken', 'passwordResetToken', 'passwordResetExpires'] 
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }
    
    // Récupérer les statistiques de l'utilisateur
    const [orderCount, cartCount] = await Promise.all([
      Order.count({ where: { userId: id } }),
      Cart.count({ where: { userId: id } })
    ]);
    
    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        stats: {
          totalOrders: orderCount,
          cartItems: cartCount
        }
      }
    });
  } catch (error) {
    console.error('Error in getUserByIdOptimized:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message
    });
  }
});

// 3. Créer un nouvel utilisateur (optimisé)
const createUserOptimized = asyncHandler(async (req, res) => {
  try {
    const { email, firstname, lastname, mobile, role = 'user' } = req.body;
    
    // Vérification rapide de l'existence
    const existingUser = await User.findOne({ 
      where: { email },
      attributes: ['id', 'email'] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà"
      });
    }
    
    // Validation des données
    if (!email || !firstname || !lastname) {
      return res.status(400).json({
        success: false,
        message: "Email, prénom et nom sont requis"
      });
    }
    
    const newUser = await User.create({
      email,
      firstname,
      lastname,
      mobile,
      role,
      password: req.body.password || 'defaultPassword123' // À changer lors du premier login
    });
    
    // Retourner sans le mot de passe
    const { password, ...userWithoutPassword } = newUser.toJSON();
    
    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error in createUserOptimized:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message
    });
  }
});

// 4. Mettre à jour un utilisateur (optimisé)
const updateUserOptimized = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }
    
    // Champs autorisés à la mise à jour
    const allowedFields = ['firstname', 'lastname', 'mobile', 'address', 'isBlocked'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email: req.body.email,
          id: { [Op.ne]: id }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Cet email est déjà utilisé par un autre utilisateur"
        });
      }
      
      updateData.email = req.body.email;
    }
    
    await User.update(updateData, { where: { id } });
    
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    
    res.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      data: updatedUser
    });
  } catch (error) {
    console.error('Error in updateUserOptimized:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: error.message
    });
  }
});

// 5. Supprimer un utilisateur (avec vérifications)
const deleteUserOptimized = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }
    
    // Empêcher la suppression des admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Impossible de supprimer un administrateur"
      });
    }
    
    // Vérifier s'il y a des commandes associées
    const orderCount = await Order.count({ where: { userId: id } });
    
    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer cet utilisateur car il a ${orderCount} commande(s) associée(s)`
      });
    }
    
    // Supprimer le panier de l'utilisateur avant de supprimer l'utilisateur
    await Cart.destroy({ where: { userId: id } });
    
    // Supprimer l'utilisateur
    await User.destroy({ where: { id } });
    
    res.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
      deletedUser: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      }
    });
  } catch (error) {
    console.error('Error in deleteUserOptimized:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message
    });
  }
});

// 6. Bloquer/Débloquer un utilisateur (optimisé)
const toggleUserBlockStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { blocked } = req.body; // true pour bloquer, false pour débloquer
  
  try {
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Impossible de bloquer un administrateur"
      });
    }
    
    await User.update(
      { isBlocked: blocked },
      { where: { id } }
    );
    
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    
    res.json({
      success: true,
      message: `Utilisateur ${blocked ? 'bloqué' : 'débloqué'} avec succès`,
      data: updatedUser
    });
  } catch (error) {
    console.error('Error in toggleUserBlockStatus:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification du statut de l'utilisateur",
      error: error.message
    });
  }
});

// 7. Opération en lot pour les utilisateurs (LEGACY - gardé pour compatibilité)
const bulkBlockUsers = asyncHandler(async (req, res) => {
  const { userIds, isBlocked } = req.body;
  
  try {
    const result = await User.update(
      { isBlocked },
      { where: { id: { [Op.in]: userIds } } }
    );
    
    res.json({
      success: true,
      message: `${result[0]} utilisateurs ${isBlocked ? 'bloqués' : 'débloqués'}`,
      updated: result[0]
    });
  } catch (error) {
    console.error('Error in bulkBlockUsers:', error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'opération en lot",
      error: error.message 
    });
  }
});

// 8. Opération en lot améliorée pour les utilisateurs
const bulkUserOperations = asyncHandler(async (req, res) => {
  const { userIds, operation, data } = req.body;
  
  try {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Liste d'IDs d'utilisateurs requise"
      });
    }
    
    let result;
    
    switch (operation) {
      case 'block':
        result = await User.update(
          { isBlocked: true },
          { where: { id: { [Op.in]: userIds }, role: { [Op.ne]: 'admin' } } }
        );
        break;
        
      case 'unblock':
        result = await User.update(
          { isBlocked: false },
          { where: { id: { [Op.in]: userIds }, role: { [Op.ne]: 'admin' } } }
        );
        break;
        
      case 'delete':
        // Vérifier qu'aucun utilisateur n'a de commandes
        const usersWithOrders = await Order.findAll({
          where: { userId: { [Op.in]: userIds } },
          attributes: ['userId'],
          group: ['userId']
        });
        
        if (usersWithOrders.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Certains utilisateurs ont des commandes et ne peuvent pas être supprimés"
          });
        }
        
        // Supprimer les paniers d'abord
        await Cart.destroy({ where: { userId: { [Op.in]: userIds } } });
        
        // Supprimer les utilisateurs (sauf les admins)
        result = await User.destroy({
          where: { 
            id: { [Op.in]: userIds },
            role: { [Op.ne]: 'admin' }
          }
        });
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: "Opération non supportée"
        });
    }
    
    res.json({
      success: true,
      message: `Opération ${operation} effectuée sur ${result[0] || result} utilisateur(s)`,
      affected: result[0] || result
    });
  } catch (error) {
    console.error('Error in bulkUserOperations:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'opération en lot",
      error: error.message
    });
  }
});

// 9. Statistiques des utilisateurs
const getUserStats = asyncHandler(async (req, res) => {
  try {
    const [
      totalUsers,
      blockedUsers,
      activeUsers,
      recentUsers
    ] = await Promise.all([
      User.count({ where: { role: { [Op.ne]: 'admin' } } }),
      User.count({ where: { role: { [Op.ne]: 'admin' }, isBlocked: true } }),
      User.count({ where: { role: { [Op.ne]: 'admin' }, isBlocked: false } }),
      User.count({ 
        where: { 
          role: { [Op.ne]: 'admin' },
          createdAt: { [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 jours
        }
      })
    ]);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        blockedUsers,
        activeUsers,
        recentUsers: recentUsers,
        blockPercentage: totalUsers > 0 ? ((blockedUsers / totalUsers) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Error in getUserStats:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
      error: error.message
    });
  }
});

module.exports = {
  getAllUsersOptimized,
  getUserByIdOptimized,
  createUserOptimized,
  updateUserOptimized,
  deleteUserOptimized,
  toggleUserBlockStatus,
  bulkBlockUsers, // Legacy
  bulkUserOperations,
  getUserStats
};