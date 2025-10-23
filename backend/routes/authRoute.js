const express = require("express");
// ===== MIGRATION VERS MYSQL/SEQUELIZE =====
const { User, Cart, Product } = require("../models");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const { JWT_SECRET } = require('../config/config'); // Import centralized config

// Import functions from userCtrl
const { 
    createUser, 
    createAdmin,
    forgotPasswordToken, 
    loginAdmin, 
    loginUserCtrl,
    logout,
    getallUser,
    getAllOrders,
    getMyOrders,
    createOrder,
    removeProductFromCart,
    blockUser,
    unblockUser,
    deleteaUser,
    updateOrderStatus,
    deleteOrder,
    getOrderByUserId,
    getOrderById,
    updatedUser,
    updateProfile // NEW: Profile update for authenticated user
} = require("../controller/userCtrl");

const router = express.Router();

// Authentication middleware
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, JWT_SECRET); // Use centralized config
                const user = await User.findByPk(decoded.id); // Sequelize method
                if (user) {
                    req.user = user;
                    next();
                } else {
                    return res.status(401).json({ message: 'User not found' });
                }
            }
        } catch (error) {
            return res.status(401).json({ message: 'Token expired or invalid' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
});

// Register route
router.post("/register", createUser);

// Admin register route
router.post("/admin-register", createAdmin);

// Admin login route  
router.post("/admin-login", loginAdmin);

// Forgot password route
router.post("/forgot-password-token", forgotPasswordToken);

// Login route
router.post("/login", loginUserCtrl);

// Logout route
router.get("/logout", logout);

// Cart routes
router.post("/cart", authMiddleware, asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body;
    const userId = req.user.id;

    if (isNaN(parseFloat(price)) || !isFinite(price)) {
        return res.status(400).json({ message: "Invalid price format" });
    }

    if (!productId || !quantity || isNaN(parseInt(quantity)) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid request data" });
    }

    try {
        const cartData = {
            userId,
            productId,
            quantity,
            price
        };

        // Handle color: if it's an array, take the first element
        let colorToUse = null;
        if (color) {
            if (Array.isArray(color) && color.length > 0) {
                colorToUse = color[0];
            } else if (typeof color === 'string') {
                colorToUse = color;
            }
        }

        if (colorToUse && colorToUse !== "default") {
            cartData.color = colorToUse;
        }

        let newCart = await Cart.create(cartData);
        res.json(newCart);
    } catch (error) {
        console.error("Error while saving cart:", error);
        return res.status(500).json({ message: "Failed to add product to cart" });
    }
}));

router.get("/cart", authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    try {
        console.log("Fetching cart for user:", userId);
        
        // First, try to get cart without populate to see if basic retrieval works
        const cartBasic = await Cart.findAll({ where: { userId } }); // Sequelize syntax
        console.log("Cart items found (basic):", cartBasic.length);
        
        if (cartBasic.length === 0) {
            return res.json([]);
        }
        
        // Try with include (Sequelize equivalent of populate)
        const cart = await Cart.findAll({ 
            where: { userId },
            include: [{
                model: Product,
                as: 'product'
            }]
        });
        console.log("Cart items with populated products:", cart.length);
        
        // Log pour debug - voir la structure des données
        if (cart.length > 0) {
            console.log("📸 First cart item structure:", JSON.stringify({
                id: cart[0].id,
                quantity: cart[0].quantity,
                productId: cart[0].productId,
                product: {
                    id: cart[0].product?.id,
                    title: cart[0].product?.title,
                    images: cart[0].product?.images,
                    price: cart[0].product?.price
                }
            }, null, 2));
        }
        
        res.json(cart);
    } catch (error) {
        console.error("Error while fetching user cart:", error);
        
        // If include fails, return basic cart data
        try {
            const cartBasic = await Cart.findAll({ where: { userId } });
            console.log("Returning basic cart data due to include error");
            res.json(cartBasic);
        } catch (basicError) {
            console.error("Even basic cart fetch failed:", basicError);
            return res.status(500).json({ message: "Failed to fetch user cart", error: basicError.message });
        }
    }
}));

// Delete product from cart
router.delete("/delete-product-cart", authMiddleware, removeProductFromCart);

// Update product quantity in cart
router.put("/update-product-cart/:cartId/:newQuantity", authMiddleware, asyncHandler(async (req, res) => {
    const { cartId, newQuantity } = req.params;
    const userId = req.user.id;
    
    console.log("📝 Updating cart item:", { cartId, newQuantity, userId });
    
    try {
        // Vérifier que la quantité est valide
        const quantity = parseInt(newQuantity);
        if (isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ 
                success: false,
                message: "Quantité invalide" 
            });
        }
        
        // Trouver l'item du panier
        const cartItem = await Cart.findOne({
            where: { 
                id: cartId,
                userId: userId 
            }
        });
        
        if (!cartItem) {
            return res.status(404).json({ 
                success: false,
                message: "Article non trouvé dans le panier" 
            });
        }
        
        // Mettre à jour la quantité
        await cartItem.update({ quantity: quantity });
        
        console.log("✅ Cart item updated successfully");
        
        // Retourner le panier mis à jour
        const updatedCart = await Cart.findAll({ 
            where: { userId },
            include: [{
                model: Product,
                as: 'product'
            }]
        });
        
        res.json({
            success: true,
            message: "Quantité mise à jour",
            cart: updatedCart
        });
    } catch (error) {
        console.error("❌ Error updating cart:", error);
        res.status(500).json({ 
            success: false,
            message: "Erreur lors de la mise à jour du panier",
            error: error.message 
        });
    }
}));

router.get("/wishlist", authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    try {
        const Wishlist = require('../models/Wishlist');
        
        // Get wishlist items with product details
        const wishlistItems = await Wishlist.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'title', 'price', 'images', 'description', 'brand', 'category', 'slug']
                }
            ]
        });
        
        // Transform the data to match the expected format
        const formattedWishlist = wishlistItems.map(item => ({
            id: item.productId,
            title: item.product?.title,
            price: item.product?.price,
            images: item.product?.images,
            description: item.product?.description,
            brand: item.product?.brand,
            category: item.product?.category,
            slug: item.product?.slug
        }));
        
        res.json(formattedWishlist);
    } catch (error) {
        console.error("Error in getWishlist:", error);
        res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
    }
}));

// Address route - save user address
router.post("/address", authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user.id;
    try {
        console.log("Saving address for user:", userId);
        console.log("Address data received:", req.body);

        if (!req.body.address) {
            return res.status(400).json({ message: "Adresse manquante dans la requête" });
        }
        
        let addressToSave = req.body.address;
        if (typeof addressToSave === 'object') {
            addressToSave = JSON.stringify(addressToSave);
        }
        
        const updatedUser = await User.update(
            { address: addressToSave },
            { 
                where: { id: userId },
                returning: true
            }
        );

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        console.log("Address saved successfully for user:", userId);
        res.status(200).json({
            message: "Adresse mise à jour avec succès",
            user: user,
        });
    } catch (error) {
        console.error("Error saving address:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement de l'adresse", error: error.message });
    }
}));

// Get all users (customers) route
router.get("/all-users", getallUser);

// Get all orders route (for admin)
router.get("/getallorders", authMiddleware, getAllOrders);

// Get user's own orders
router.get("/getmyorders", authMiddleware, getMyOrders);

// Get specific order by user ID (for admin viewing order details)
router.post("/getorderbyuser/:id", authMiddleware, getOrderByUserId);

// Get specific order by order ID (for admin viewing single order)
router.get("/getorder/:id", authMiddleware, getOrderById);

// Create order from cart
router.post("/cart/create-order", authMiddleware, createOrder);

// Admin routes for order management
router.put("/update-order/:id", authMiddleware, updateOrderStatus);
router.delete("/delete-order/:id", authMiddleware, deleteOrder);

// Admin routes for user management
router.put("/block-user/:id", authMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, unblockUser);
router.delete("/delete-user/:id", authMiddleware, deleteaUser);

// User profile update routes
router.put("/profile", authMiddleware, updateProfile); // For authenticated user (no ID needed)
router.put("/edit-user/:id", authMiddleware, updatedUser); // For admin editing any user

module.exports = router;
