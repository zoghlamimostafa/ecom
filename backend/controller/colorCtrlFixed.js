// ===== CONTRÔLEUR COULEURS CORRIGÉ =====
const { Color } = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require("express-async-handler");

// ===== CRUD OPERATIONS =====

// CREATE - Créer une couleur
const createColor = asyncHandler(async (req, res) => {
  try {
    const { title, hexCode, description } = req.body;

    // Validation des champs obligatoires
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Le titre de la couleur est obligatoire"
      });
    }

    // Validation du code hexadécimal si fourni
    if (hexCode && !/^#[0-9A-F]{6}$/i.test(hexCode)) {
      return res.status(400).json({
        success: false,
        message: "Le code hexadécimal doit être au format #RRGGBB"
      });
    }

    // Vérifier que le titre est unique
    const existingColor = await Color.findOne({ 
      where: { title: { [Op.iLike]: title.trim() } } 
    });
    
    if (existingColor) {
      return res.status(400).json({
        success: false,
        message: "Une couleur avec ce titre existe déjà"
      });
    }

    // Vérifier que le code hex est unique si fourni
    if (hexCode) {
      const existingHexColor = await Color.findOne({ 
        where: { hexCode: { [Op.iLike]: hexCode.trim() } } 
      });
      
      if (existingHexColor) {
        return res.status(400).json({
          success: false,
          message: "Une couleur avec ce code hexadécimal existe déjà"
        });
      }
    }

    // Préparer les données de la couleur
    const colorData = {
      title: title.trim(),
      hexCode: hexCode ? hexCode.trim().toUpperCase() : null,
      description: description ? description.trim() : null
    };

    // Créer la couleur
    const newColor = await Color.create(colorData);

    res.status(201).json({
      success: true,
      message: "Couleur créée avec succès",
      color: newColor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la couleur",
      error: error.message
    });
  }
});

// READ - Récupérer toutes les couleurs
const getAllColor = asyncHandler(async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search,
      sortBy = 'title',
      sortOrder = 'ASC'
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereClause = {};
    
    // Recherche par titre, code hex ou description
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { hexCode: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Color.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]]
    });

    res.json({
      success: true,
      colors: rows,
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
      message: "Erreur lors de la récupération des couleurs",
      error: error.message
    });
  }
});

// READ - Récupérer une couleur par ID
const getColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID couleur requis"
      });
    }

    const color = await Color.findByPk(id);

    if (!color) {
      return res.status(404).json({
        success: false,
        message: "Couleur non trouvée"
      });
    }

    res.json({
      success: true,
      color: color
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la couleur",
      error: error.message
    });
  }
});

// UPDATE - Mettre à jour une couleur
const updateColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, hexCode, description } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID couleur requis"
      });
    }

    // Vérifier si la couleur existe
    const color = await Color.findByPk(id);
    if (!color) {
      return res.status(404).json({
        success: false,
        message: "Couleur non trouvée"
      });
    }

    // Validation du code hexadécimal si fourni
    if (hexCode && !/^#[0-9A-F]{6}$/i.test(hexCode)) {
      return res.status(400).json({
        success: false,
        message: "Le code hexadécimal doit être au format #RRGGBB"
      });
    }

    // Vérifier l'unicité du titre si modifié
    if (title && title.trim() !== color.title) {
      const existingColor = await Color.findOne({ 
        where: { 
          title: { [Op.iLike]: title.trim() },
          id: { [Op.ne]: id }
        } 
      });
      
      if (existingColor) {
        return res.status(400).json({
          success: false,
          message: "Une couleur avec ce titre existe déjà"
        });
      }
    }

    // Vérifier l'unicité du code hex si modifié
    if (hexCode && hexCode.trim().toUpperCase() !== color.hexCode) {
      const existingHexColor = await Color.findOne({ 
        where: { 
          hexCode: { [Op.iLike]: hexCode.trim() },
          id: { [Op.ne]: id }
        } 
      });
      
      if (existingHexColor) {
        return res.status(400).json({
          success: false,
          message: "Une couleur avec ce code hexadécimal existe déjà"
        });
      }
    }

    // Préparer les données de mise à jour
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (hexCode !== undefined) updateData.hexCode = hexCode ? hexCode.trim().toUpperCase() : null;
    if (description !== undefined) updateData.description = description ? description.trim() : null;

    // Mettre à jour la couleur
    await Color.update(updateData, { where: { id: id } });
    
    // Récupérer la couleur mise à jour
    const updatedColor = await Color.findByPk(id);

    res.json({
      success: true,
      message: "Couleur mise à jour avec succès",
      color: updatedColor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la couleur",
      error: error.message
    });
  }
});

// DELETE - Supprimer une couleur
const deleteColor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID couleur requis"
      });
    }

    // Vérifier si la couleur existe
    const color = await Color.findByPk(id);
    if (!color) {
      return res.status(404).json({
        success: false,
        message: "Couleur non trouvée"
      });
    }

    // Vérifier si des produits utilisent cette couleur
    const { Product } = require('../models');
    const productsWithColor = await Product.count({ 
      where: { 
        color: { 
          [Op.like]: `%"${color.title}"%` 
        } 
      } 
    });
    
    if (productsWithColor > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer cette couleur car elle est utilisée par ${productsWithColor} produit(s)`
      });
    }

    // Supprimer la couleur
    await Color.destroy({ where: { id: id } });

    res.json({
      success: true,
      message: "Couleur supprimée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la couleur",
      error: error.message
    });
  }
});

module.exports = {
  createColor,
  getAllColor,
  getColor,
  updateColor,
  deleteColor,
};