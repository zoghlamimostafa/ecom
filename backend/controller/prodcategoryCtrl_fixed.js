/**
 * CONTRÔLEUR CATÉGORIES CORRIGÉ - Compatible SQLite Direct
 * Date: 13 Octobre 2025
 * Fix: Problème "Something went wrong" lors de la modification/suppression
 */

const asyncHandler = require("express-async-handler");
const { sequelize } = require('../config/dbConnect');

// Helper pour exécuter des requêtes SQL
const query = async (sql, replacements = []) => {
  try {
    const [results] = await sequelize.query(sql, { replacements });
    return results;
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
};

// CREATE - Créer une catégorie
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { title, description, parentId } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Le titre de la catégorie est obligatoire"
      });
    }

    // Vérifier si le titre existe déjà
    const existing = await query(
      'SELECT id FROM Categories WHERE LOWER(title) = LOWER(?) LIMIT 1',
      [title.trim()]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Une catégorie avec ce titre existe déjà"
      });
    }

    // Créer le slug
    const slug = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Insérer la nouvelle catégorie
    await query(
      `INSERT INTO Categories (title, slug, description, parentId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [title.trim(), slug, description || null, parentId || null]
    );

    // Récupérer la catégorie créée
    const newCategory = await query(
      'SELECT * FROM Categories WHERE slug = ? ORDER BY id DESC LIMIT 1',
      [slug]
    );

    res.status(201).json({
      success: true,
      message: "Catégorie créée avec succès",
      category: newCategory[0]
    });
  } catch (error) {
    console.error('Error createCategory:', error);
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
      limit = 500, 
      search,
      parentId,
      hierarchical = false 
    } = req.query;

    let sql = 'SELECT * FROM Categories';
    let params = [];
    let conditions = [];

    if (parentId !== undefined) {
      if (parentId === 'null' || parentId === '') {
        conditions.push('parentId IS NULL');
      } else {
        conditions.push('parentId = ?');
        params.push(parentId);
      }
    }

    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY title ASC';
    
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const categories = await query(sql, params);

    res.json({
      success: true,
      categories: categories,
      total: categories.length
    });
  } catch (error) {
    console.error('Error getAllCategory:', error);
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

    const categories = await query(
      'SELECT * FROM Categories WHERE id = ? LIMIT 1',
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    res.json({
      success: true,
      category: categories[0]
    });
  } catch (error) {
    console.error('Error getCategory:', error);
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
    
    console.log('📝 UPDATE Category:', { id, title, description, parentId });
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID catégorie requis"
      });
    }

    // Vérifier si la catégorie existe
    const existing = await query(
      'SELECT * FROM Categories WHERE id = ? LIMIT 1',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    // Vérifier l'unicité du titre si modifié
    if (title && title.trim() !== existing[0].title) {
      const duplicate = await query(
        'SELECT id FROM Categories WHERE LOWER(title) = LOWER(?) AND id != ? LIMIT 1',
        [title.trim(), id]
      );
      
      if (duplicate.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Une catégorie avec ce titre existe déjà"
        });
      }
    }

    // Préparer la requête de mise à jour
    let updateFields = [];
    let updateParams = [];

    if (title) {
      updateFields.push('title = ?');
      updateParams.push(title.trim());
      
      // Mettre à jour le slug aussi
      const slug = title.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      updateFields.push('slug = ?');
      updateParams.push(slug);
    }

    if (description !== undefined) {
      updateFields.push('description = ?');
      updateParams.push(description || null);
    }

    if (parentId !== undefined) {
      updateFields.push('parentId = ?');
      updateParams.push(parentId || null);
    }

    updateFields.push("updatedAt = datetime('now')");
    updateParams.push(id);

    const updateSql = `UPDATE Categories SET ${updateFields.join(', ')} WHERE id = ?`;
    
    console.log('🔄 SQL Update:', updateSql, updateParams);
    
    await query(updateSql, updateParams);
    
    // Récupérer la catégorie mise à jour
    const updated = await query(
      'SELECT * FROM Categories WHERE id = ? LIMIT 1',
      [id]
    );

    res.json({
      success: true,
      message: "Catégorie mise à jour avec succès",
      category: updated[0]
    });
  } catch (error) {
    console.error('❌ Error updateCategory:', error);
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
    
    console.log('🗑️ DELETE Category:', id);
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID catégorie requis"
      });
    }

    // Vérifier si la catégorie existe
    const existing = await query(
      'SELECT * FROM Categories WHERE id = ? LIMIT 1',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée"
      });
    }

    // Vérifier si la catégorie a des sous-catégories
    const subcategories = await query(
      'SELECT COUNT(*) as count FROM Categories WHERE parentId = ?',
      [id]
    );
    
    if (subcategories[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer une catégorie qui contient des sous-catégories",
        subcategoriesCount: subcategories[0].count
      });
    }

    // Vérifier si des produits utilisent cette catégorie
    const productsInCategory = await query(
      'SELECT COUNT(*) as count FROM Products WHERE category = ? OR subcategory = ?',
      [id, id]
    );
    
    if (productsInCategory[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer cette catégorie car elle contient ${productsInCategory[0].count} produit(s)`,
        productsCount: productsInCategory[0].count
      });
    }

    // Supprimer la catégorie
    await query('DELETE FROM Categories WHERE id = ?', [id]);

    console.log('✅ Category deleted successfully:', id);

    res.json({
      success: true,
      message: "Catégorie supprimée avec succès"
    });
  } catch (error) {
    console.error('❌ Error deleteCategory:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la catégorie",
      error: error.message
    });
  }
});

// Récupérer les catégories principales
const getMainCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await query(
      'SELECT id, title, slug, description FROM Categories WHERE parentId IS NULL ORDER BY title ASC'
    );

    res.json({
      success: true,
      categories: categories
    });
  } catch (error) {
    console.error('Error getMainCategories:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catégories principales",
      error: error.message
    });
  }
});

// Récupérer les sous-catégories
const getSubcategories = asyncHandler(async (req, res) => {
  try {
    const { parentId } = req.params;
    
    if (!parentId) {
      return res.status(400).json({
        success: false,
        message: "ID catégorie parent requis"
      });
    }

    const subcategories = await query(
      'SELECT id, title, slug, description FROM Categories WHERE parentId = ? ORDER BY title ASC',
      [parentId]
    );

    res.json({
      success: true,
      subcategories: subcategories
    });
  } catch (error) {
    console.error('Error getSubcategories:', error);
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
