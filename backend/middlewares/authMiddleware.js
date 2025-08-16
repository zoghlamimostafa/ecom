const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    console.log("Auth middleware called");
    console.log("Authorization header:", req.headers.authorization);
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        console.log("Token extracted:", token);
        
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log("Token decoded:", decoded);
                
                const user = await User.findById(decoded.id);
                console.log("User found:", user ? user._id : "No user");
                
                if (user) {
                    req.user = user;
                    console.log("User attached to request:", req.user._id);
                    next();
                } else {
                    console.error("User not found in database");
                    return res.status(401).json({ message: 'User not found in the database' });
                }
            }
        } catch (error) {
            console.error("Token verification error:", error.message);
            return res.status(401).json({ message: 'Token expired or invalid. Please log in again.' });
        }
    } else {
        console.warn("No authorization header or invalid format");
        return res.status(401).json({ message: 'No token provided. Please authenticate.' });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;

    try {
    const adminUser = await User.findOne({ email });
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

