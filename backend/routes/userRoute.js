const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getUserProductWishlist, getUserCart } = require('../controller/userCtrl');

// Route: GET /api/user/wishlist
router.get('/wishlist', authMiddleware, getUserProductWishlist);

// Route: GET /api/user/cart
router.get('/cart', authMiddleware, getUserCart);

module.exports = router;
