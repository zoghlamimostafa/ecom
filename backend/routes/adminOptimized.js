const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const cacheMiddleware = require('../middleware/cacheMiddleware');

// Controllers optimisés
const { 
  getAllProductsOptimized, 
  getProductById, 
  bulkUpdateProducts 
} = require('../controller/productCtrlOptimized');

const { 
  getAllUsersOptimized, 
  bulkBlockUsers 
} = require('../controller/userCtrlOptimized');

// Routes produits optimisées avec cache
router.get('/products', 
  authMiddleware, 
  isAdmin, 
  cacheMiddleware(180), // 3 minutes de cache
  getAllProductsOptimized
);

router.get('/products/:id', 
  authMiddleware, 
  isAdmin, 
  cacheMiddleware(300), // 5 minutes de cache
  getProductById
);

router.put('/products/bulk-update', 
  authMiddleware, 
  isAdmin, 
  bulkUpdateProducts
);

// Routes utilisateurs optimisées
router.get('/users', 
  authMiddleware, 
  isAdmin, 
  cacheMiddleware(120), // 2 minutes de cache
  getAllUsersOptimized
);

router.put('/users/bulk-block', 
  authMiddleware, 
  isAdmin, 
  bulkBlockUsers
);

module.exports = router;