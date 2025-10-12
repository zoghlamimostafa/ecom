const { Category } = require('../models');
;
const asyncHandler = require("express-async-handler");
const createCategory = asyncHandler(async (req, res) => {
  try {
    // If parent is provided, set level to parent's level + 1
    if (req.body.parent) {
      const parentCategory = await Category.findByPk(req.body.parent);
      if (parentCategory) {
        req.body.level = parentCategory.level + 1;
      }
    }
    const newCategory = await Category.create(req.body);
    const populatedCategory = await Category.findByPk(newCategory.id);
    res.json(populatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;try {
    // If parent is being updated, recalculate level
    if (req.body.parent) {
      const parentCategory = await Category.findByPk(req.body.parent);
      if (parentCategory) {
        req.body.level = parentCategory.level + 1;
      }
    } else if (req.body.parent === null) {
      req.body.level = 0;
    }
    
    await Category.update(req.body, { where: { id: id }, 
      new: true,
     });
    const updatedCategory = await Category.findByPk(id)/* TODO: Remplacer par include dans Sequelize */;
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;try {
    // Check if category has subcategories
    const hasSubcategories = await Category.findOne({ where: { parent: id } });
    if (hasSubcategories) {
      throw new Error("Cannot delete category with subcategories. Delete subcategories first.");
    }
    
    const deletedCategory = await Category.destroy({ where: { id: id } });
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;try {
    const getaCategory = await Category.findByPk(id)
      /* TODO: Remplacer par include dans Sequelize */
      /* TODO: Remplacer par include dans Sequelize */;
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getallCategory = asyncHandler(async (req, res) => {
  try {
    const getallCategory = await Category.findAll({
      order: [['title', 'ASC']]
    });
    res.json(getallCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// New function to get main categories with their subcategories
const getCategoriesTree = asyncHandler(async (req, res) => {
  try {
    const mainCategories = await Category.findAll({ 
      where: { level: 0 },
      order: [['title', 'ASC']]
    });
    res.json(mainCategories);
  } catch (error) {
    throw new Error(error);
  }
});

// Get category by slug
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const category = await Category.findOne({ where: { slug } })
      /* TODO: Remplacer par include dans Sequelize */
      /* TODO: Remplacer par include dans Sequelize */;
    if (!category) {
      throw new Error("Category not found");
    }
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getallCategory,
  getCategoriesTree,
  getCategoryBySlug,
};