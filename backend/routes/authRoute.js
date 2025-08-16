const express = require("express");
const User = require("../models/userModels");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const mongoose = require("mongoose");

// Import functions from userCtrl
const { 
    createUser, 
    forgotPasswordToken, 
    loginAdmin, 
    loginUserCtrl,
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
    getOrderByUserId
} = require("../controller/userCtrl");

const router = express.Router();

// Authentication middleware
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);
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

// Admin login route  
router.post("/admin-login", loginAdmin);

// Forgot password route
router.post("/forgot-password-token", forgotPasswordToken);

// Login route
router.post("/login", loginUserCtrl);

// Cart routes
router.post("/cart", authMiddleware, asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body;
    const { _id } = req.user;

    if (isNaN(parseFloat(price)) || !isFinite(price)) {
        return res.status(400).json({ message: "Invalid price format" });
    }

    if (!productId || !quantity || isNaN(parseInt(quantity)) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid request data" });
    }

    try {
        const cartData = {
            userId: _id,
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

        if (colorToUse && mongoose.Types.ObjectId.isValid(colorToUse) && colorToUse !== "default") {
            cartData.color = colorToUse;
        }

        let newCart = await new Cart(cartData).save();
        res.json(newCart);
    } catch (error) {
        console.error("Error while saving cart:", error);
        return res.status(500).json({ message: "Failed to add product to cart" });
    }
}));

router.get("/cart", authMiddleware, asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        console.log("Fetching cart for user:", _id);
        
        // First, try to get cart without populate to see if basic retrieval works
        const cartBasic = await Cart.find({ userId: _id });
        console.log("Cart items found (basic):", cartBasic.length);
        
        if (cartBasic.length === 0) {
            return res.json([]);
        }
        
        // Try with populate
        const cart = await Cart.find({ userId: _id }).populate("productId");
        console.log("Cart items with populated products:", cart.length);
        res.json(cart);
    } catch (error) {
        console.error("Error while fetching user cart:", error);
        
        // If populate fails, return basic cart data
        try {
            const cartBasic = await Cart.find({ userId: _id });
            console.log("Returning basic cart data due to populate error");
            res.json(cartBasic);
        } catch (basicError) {
            console.error("Even basic cart fetch failed:", basicError);
            return res.status(500).json({ message: "Failed to fetch user cart", error: basicError.message });
        }
    }
}));

// Delete product from cart
router.delete("/delete-product-cart", authMiddleware, removeProductFromCart);

router.get("/wishlist", authMiddleware, asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate({
            path: 'wishlist',
            select: 'title price images description category brand'
        });
        res.json(findUser?.wishlist || []);
    } catch (error) {
        console.error("Error in getWishlist:", error);
        res.status(500).json({ message: "Failed to fetch wishlist" });
    }
}));

// Address route - save user address
router.post("/address", authMiddleware, asyncHandler(async (req, res) => {
    const userId = req.user._id;
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
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { address: addressToSave },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        console.log("Address saved successfully for user:", userId);
        res.status(200).json({
            message: "Adresse mise à jour avec succès",
            user: updatedUser,
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

// Create order from cart
router.post("/cart/create-order", authMiddleware, createOrder);

// Admin routes for order management
router.put("/update-order/:id", authMiddleware, updateOrderStatus);
router.delete("/delete-order/:id", authMiddleware, deleteOrder);

// Admin routes for user management
router.put("/block-user/:id", authMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, unblockUser);
router.delete("/delete-user/:id", authMiddleware, deleteaUser);

module.exports = router;
