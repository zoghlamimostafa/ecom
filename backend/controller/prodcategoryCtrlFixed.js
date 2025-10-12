// ===== CONTRÔLEUR CATÉGORIES CORRIGÉ =====
const { Category } = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// ===== CRUD OPERATIONS =====

// CREATE - Créer une catégorie
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { title, description, parentId } = req.body;

    // Validation des champs obligatoires
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Le titre de la catégorie est obligatoire"
      });
    }

    // Vérifier que le titre est unique
    const existingCategory = await Category.findOne({ 
      where: { title: { [Op.iLike]: title.trim() } } 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Une catégorie avec ce titre existe déjà"
      });
    }

    // Si parentId est fourni, vérifier que la catégorie parent existe
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: "Catégorie parent non trouvée"
        });
      }

      // Vérifier qu'on ne crée pas plus de 2 niveaux de hiérarchie
      if (parentCategory.parentId) {
        return res.status(400).json({
          success: false,
          message: "Impossible de créer plus de 2 niveaux de catégories"
        });
      }
    }

    // Préparer les données de la catégorie
    const categoryData = {
      title: title.trim(),
      description: description ? description.trim() : null,
      parentId: parentId || null
    };

    // Créer la catégorie
    const newCategory = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: "Catégorie créée avec succès",
      category: newCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la catégorie",
      error: error.message
    });
  }
});

// READ - Récupérer toutes les catégories
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search,
      parentId,
      hierarchical = false 
    } = req.query;
    
    const offset = (page - 1) * limit;
    let whereClause = {};
    
    // Filtrer par catégorie parent
    if (parentId !== undefined) {
      whereClause.parentId = parentId === 'null' || parentId === '' ? null : parentId;
    }
    
    // Recherche par titre ou description
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (hierarchical === 'true') {
      // Retourner les catégories avec leurs sous-catégories
      const categories = await Category.findAll({
        where: { parentId: null },
        include: [
          {
            model: Category,
            as: 'subcategories',
            required: false
          }
        ],
        order: [['title', 'ASC'], [{ model: Category, as: 'subcategories' }, 'title', 'ASC']]
      });

      res.json({
        success: true,
        categories: categories,
        total: categories.length
      });
    } else {
      // Retourner toutes les catégories avec pagination
      const { count, rows } = await Category.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['title', 'ASC']],
        include: [
          {
            model: Category,
            as: 'parent',
            attributes: ['id', 'title'],
            required: false
          }
        ]
      });

      res.json({
        success: true,
        categories: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catégories",
      error: error.message
    });
  }
});

// READ - Récupérer une catégorie par ID
const getCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID catégorie requis"
      });
    }

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'title', 'description']
        },
        {
          model: Category,
          as: 'subcategories',
          attributes: ['id', 'title', 'description']
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    res.json({
      success: true,
      category: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la catégorie",
      error: error.message
    });
  }
});

// UPDATE - Mettre à jour une catégorie
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, parentId } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID catégorie requis"
      });
    }

    // Vérifier si la catégorie existe
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    // Vérifier l'unicité du titre si modifié
    if (title && title.trim() !== category.title) {
      const existingCategory = await Category.findOne({ 
        where: { 
          title: { [Op.iLike]: title.trim() },
          id: { [Op.ne]: id }
        } 
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Une catégorie avec ce titre existe déjà"
        });
      }
    }

    // Valider le parentId si modifié
    if (parentId !== undefined && parentId !== category.parentId) {
      if (parentId) {
        // Vérifier que la catégorie parent existe
        const parentCategory = await Category.findByPk(parentId);
        if (!parentCategory) {
          return res.status(400).json({
            success: false,
            message: "Catégorie parent non trouvée"
          });
        }

        // Éviter les références circulaires
        if (parseInt(parentId) === parseInt(id)) {
          return res.status(400).json({
            success: false,
            message: "Une catégorie ne peut pas être son propre parent"
          });
        }

        // Vérifier qu'on ne crée pas plus de 2 niveaux
        if (parentCategory.parentId) {
          return res.status(400).json({
            success: false,
            message: "Impossible de créer plus de 2 niveaux de catégories"
          });
        }

        // Vérifier que cette catégorie n'est pas déjà parent de la catégorie cible
        const childCategories = await Category.findAll({ where: { parentId: id } });
        if (childCategories.some(child => child.id === parseInt(parentId))) {
          return res.status(400).json({
            success: false,
            message: "Référence circulaire détectée"
          });
        }
      }
    }

    // Préparer les données de mise à jour
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (parentId !== undefined) updateData.parentId = parentId || null;

    // Mettre à jour la catégorie
    await Category.update(updateData, { where: { id: id } });
    
    // Récupérer la catégorie mise à jour
    const updatedCategory = await Category.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'title']
        },
        {
          model: Category,
          as: 'subcategories',
          attributes: ['id', 'title']
        }
      ]
    });

    res.json({
      success: true,
      message: "Catégorie mise à jour avec succès",
      category: updatedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la catégorie",
      error: error.message
    });
  }
});

// DELETE - Supprimer une catégorie
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID catégorie requis"
      });
    }

    // Vérifier si la catégorie existe
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    // Vérifier si la catégorie a des sous-catégories
    const subcategories = await Category.findAll({ where: { parentId: id } });
    if (subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer une catégorie qui contient des sous-catégories"
      });
    }

    // Vérifier si des produits utilisent cette catégorie
    const { Product } = require('../models');
    const productsInCategory = await Product.count({ 
      where: { 
        [Op.or]: [
          { category: id },
          { subcategory: id }
        ]
      } 
    });
    
    if (productsInCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer cette catégorie car elle contient ${productsInCategory} produit(s)`
      });
    }

    // Supprimer la catégorie
    await Category.destroy({ where: { id: id } });

    res.json({
      success: true,
      message: "Catégorie supprimée avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la catégorie",
      error: error.message
    });
  }
});

// ===== FONCTIONS UTILITAIRES =====

// Récupérer les catégories principales
const getMainCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { parentId: null },
      order: [['title', 'ASC']],
      attributes: ['id', 'title', 'description']
    });

    res.json({
      success: true,
      categories: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catégories principales",
      error: error.message
    });
  }
});

// Récupérer les sous-catégories d'une catégorie
const getSubcategories = asyncHandler(async (req, res) => {
  try {
    const { parentId } = req.params;
    
    if (!parentId) {
      return res.status(400).json({
        success: false,
        message: "ID catégorie parent requis"
      });
    }

    const subcategories = await Category.findAll({
      where: { parentId: parentId },
      order: [['title', 'ASC']],
      attributes: ['id', 'title', 'description']
    });

    res.json({
      success: true,
      subcategories: subcategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des sous-catégories",
      error: error.message
    });
  }
});

module.exports = {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getMainCategories,
  getSubcategories,
};