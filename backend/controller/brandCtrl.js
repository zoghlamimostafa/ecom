// ===== CONTRÔLEUR MARQUES CORRIGÉ =====
const { Brand } = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require("express-async-handler");

// ===== CRUD OPERATIONS =====

// CREATE - Créer une marque
const createBrand = asyncHandler(async (req, res) => {
  try {
    const { title, description, image } = req.body;

    // Validation des champs obligatoires
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Le titre de la marque est obligatoire"
      });
    }

    // Vérifier que le titre est unique
    const existingBrand = await Brand.findOne({ 
      where: { title: title.trim() } 
    });
    
    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Une marque avec ce titre existe déjà"
      });
    }

    // Préparer les données de la marque
    const brandData = {
      title: title.trim(),
      description: description ? description.trim() : null,
      image: image || null
    };

    // Créer la marque
    const newBrand = await Brand.create(brandData);

    res.status(201).json({
      success: true,
      message: "Marque créée avec succès",
      brand: newBrand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la marque",
      error: error.message
    });
  }
});

// READ - Récupérer toutes les marques
const getAllBrand = asyncHandler(async (req, res) => {
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
    
    // Recherche par titre ou description
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Brand.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]]
    });

    res.json({
      success: true,
      brands: rows,
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
      message: "Erreur lors de la récupération des marques",
      error: error.message
    });
  }
});

// READ - Récupérer une marque par ID
const getBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID marque requis"
      });
    }

    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Marque non trouvée"
      });
    }

    res.json({
      success: true,
      brand: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la marque",
      error: error.message
    });
  }
});

// UPDATE - Mettre à jour une marque
const updateBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID marque requis"
      });
    }

    // Vérifier si la marque existe
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Marque non trouvée"
      });
    }

    // Vérifier l'unicité du titre si modifié
    if (title && title.trim() !== brand.title) {
      const existingBrand = await Brand.findOne({ 
        where: { 
          title: title.trim(),
          id: { [Op.ne]: id }
        } 
      });
      
      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: "Une marque avec ce titre existe déjà"
        });
      }
    }

    // Préparer les données de mise à jour
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (image !== undefined) updateData.image = image || null;

    // Mettre à jour la marque
    await Brand.update(updateData, { where: { id: id } });
    
    // Récupérer la marque mise à jour
    const updatedBrand = await Brand.findByPk(id);

    res.json({
      success: true,
      message: "Marque mise à jour avec succès",
      brand: updatedBrand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la marque",
      error: error.message
    });
  }
});

// DELETE - Supprimer une marque
const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID marque requis"
      });
    }

    // Vérifier si la marque existe
    const brand = await Brand.findByPk(id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Marque non trouvée"
      });
    }

    // Vérifier si des produits utilisent cette marque
    const { Product } = require('../models');
    const productsWithBrand = await Product.count({ where: { brandId: id } });
    
    if (productsWithBrand > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer cette marque car elle est utilisée par ${productsWithBrand} produit(s)`
      });
    }

    // Supprimer la marque
    await Brand.destroy({ where: { id: id } });

    res.json({
      success: true,
      message: "Marque supprimée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la marque",
      error: error.message
    });
  }
});

module.exports = {
  createBrand,
  getAllBrand,
  getBrand,
  updateBrand,
  deleteBrand,
};