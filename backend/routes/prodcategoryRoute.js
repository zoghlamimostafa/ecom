const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
  getMainCategories,
  getSubcategories,
} = require("../controller/prodcategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/main", getMainCategories);
router.get("/subcategories/:parentId", getSubcategories);
router.get("/:id", getCategory);
router.get("/", getAllCategory);

module.exports = router;