const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { JWT_SECRET } = require('../config/config');

const authMiddleware = asyncHandler(async (req, res, next) => {
    console.log("🔐 Auth middleware called");
    console.log("Authorization header:", req.headers.authorization);
    console.log("JWT_SECRET length:", JWT_SECRET.length);
    console.log("JWT_SECRET start:", JWT_SECRET.substring(0, 10));
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        console.log("🔑 Token extracted length:", token.length);
        console.log("🔑 Token start:", token.substring(0, 30) + '...');
        
        try {
            if (token) {
                console.log("🔍 Attempting to verify token...");
                const decoded = jwt.verify(token, JWT_SECRET);
                console.log("✅ Token decoded successfully:", decoded);
                
                const user = await User.findByPk(decoded.id);
                console.log("👤 User lookup for ID:", decoded.id);
                console.log("👤 User found:", user ? `${user.id} - ${user.email}` : "No user");
                
                if (user) {
                    req.user = user;
                    console.log("✅ User attached to request:", req.user.id);
                    next();
                } else {
                    console.error("❌ User not found in database for ID:", decoded.id);
                    return res.status(401).json({ message: 'User not found in the database' });
                }
            }
        } catch (error) {
            console.error("❌ Token verification error:", error.message);
            console.error("❌ Error details:", error);
            return res.status(401).json({ message: 'Token expired or invalid. Please log in again.' });
        }
    } else {
        console.warn("❌ No authorization header or invalid format");
        return res.status(401).json({ message: 'No token provided. Please authenticate.' });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;

    try {
    const adminUser = await User.findOne({ where: { email } });
        if (adminUser && adminUser.role === "admin") {
        next();
        } else {
            console.warn("User is not authorized as an admin:", email);
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    } catch (error) {
        console.error("Error validating admin privileges:", error);
        return res.status(500).json({ message: 'Internal server error during role validation.' });
    }
});

module.exports = { authMiddleware, isAdmin };

