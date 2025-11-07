const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  getProductCount,
} = require("../controller/productCtrl");

// Import optimized controllers
const {
  getAllProductsOptimized,
  getProductById,
  bulkUpdateProducts
} = require("../controller/productCtrlOptimized");

const cacheMiddleware = require("../middleware/cacheMiddleware");
const { adminOptimizationMiddleware, performanceLoggerMiddleware } = require("../middleware/adminOptimization");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

// Appliquer le middleware de performance à toutes les routes
router.use(performanceLoggerMiddleware);

// Routes admin optimisées
router.use('/admin/*', adminOptimizationMiddleware);

router.post("/", authMiddleware, isAdmin, createProduct);

// Routes optimisées pour l'admin avec cache
router.get("/admin/all", authMiddleware, isAdmin, cacheMiddleware(60), getAllProductsOptimized);
router.get("/admin/:id", authMiddleware, isAdmin, cacheMiddleware(300), getProductById);
router.put("/admin/bulk-update", authMiddleware, isAdmin, bulkUpdateProducts);

// Routes publiques (utilisées par le frontend client) avec cache plus long
router.get("/", cacheMiddleware(300), getAllProduct);
router.get("/count", cacheMiddleware(300), getProductCount);
router.get("/:id", cacheMiddleware(600), getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);

router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;