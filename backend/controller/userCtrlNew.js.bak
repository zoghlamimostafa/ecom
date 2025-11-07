const { User, Cart, Product, Coupon, Order, OrderItem, Color, Wishlist } = require('../models');
const generateResetToken = require('../config/generateResetToken');
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const sendEmail = require("../controller/emailCtrl");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");
const verifyResetToken = require("../config/verifyResetToken");
const { Op } = require('sequelize');

// Helper function to validate ID
const validateId = (id) => {
  if (!id || isNaN(parseInt(id))) {
    throw new Error("Invalid ID provided");
  }
  return parseInt(id);
};

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  
  // Check if user exists
  const findUser = await User.findOne({ where: { email: email } });

  if (!findUser) {
    // Create new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

// Create Admin User
const createAdmin = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ where: { email: email } });

  if (!findUser) {
    // Create new admin user with role set to admin
    const adminData = { ...req.body, role: "admin" };
    const newAdmin = await User.create(adminData);
    res.json({
      success: true,
      message: "Admin user created successfully",
      admin: {
        id: newAdmin.id,
        firstname: newAdmin.firstname,
        lastname: newAdmin.lastname,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } else {
    throw new Error("Admin user already exists");
  }
});

// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Check if user exists
  const findUser = await User.findOne({ where: { email: email } });
  
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser.id);
    
    await User.update(
      { refreshToken: refreshToken },
      { where: { id: findUser.id } }
    );
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    
    res.json({
      id: findUser.id,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
      email: findUser.email,
      mobile: findUser.mobile,
      role: findUser.role,
      token: generateToken(findUser.id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Check if admin exists
  const findAdmin = await User.findOne({ 
    where: { 
      email: email,
      role: 'admin'
    } 
  });
  
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin.id);
    
    await User.update(
      { refreshToken: refreshToken },
      { where: { id: findAdmin.id } }
    );
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    
    res.json({
      id: findAdmin.id,
      firstname: findAdmin.firstname,
      lastname: findAdmin.lastname,
      email: findAdmin.email,
      mobile: findAdmin.mobile,
      role: findAdmin.role,
      token: generateToken(findAdmin.id),
    });
  } else {
    throw new Error("Invalid Admin Credentials");
  }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ where: { refreshToken: refreshToken } });
  
  if (!user) throw new Error("No Refresh token present in db or not matched");
  
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user.id);
    res.json({ accessToken });
  });
});

// Logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ where: { refreshToken: refreshToken } });
  
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  
  await User.update(
    { refreshToken: null },
    { where: { refreshToken: refreshToken } }
  );
  
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  
  res.sendStatus(204); // forbidden
});

// Update a user
const updateaUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  
  try {
    const [updatedRowsCount] = await User.update(req.body, {
      where: { id: id },
      returning: true
    });
    
    if (updatedRowsCount === 0) {
      throw new Error("User not found");
    }
    
    const updatedUser = await User.findByPk(id);
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Save user Address
const saveAddress = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  
  try {
    const [updatedRowsCount] = await User.update(
      { address: req.body.address },
      { where: { id: id } }
    );
    
    if (updatedRowsCount === 0) {
      throw new Error("User not found");
    }
    
    const updatedUser = await User.findByPk(id);
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.findAll({
      attributes: { exclude: ['password', 'refreshToken'] }
    });
    res.json(allUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'refreshToken'] },
      include: [
        { model: Cart, as: 'cart' },
        { model: Wishlist, as: 'wishlist' },
        { model: Order, as: 'orders' }
      ]
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a single user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  
  try {
    const deletedRowsCount = await User.destroy({
      where: { id: id }
    });
    
    if (deletedRowsCount === 0) {
      throw new Error("User not found");
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    throw new Error(error);
  }
});

// Block user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  
  try {
    const [updatedRowsCount] = await User.update(
      { isBlocked: true },
      { where: { id: id } }
    );
    
    if (updatedRowsCount === 0) {
      throw new Error("User not found");
    }
    
    res.json({ message: "User Blocked" });
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  
  try {
    const [updatedRowsCount] = await User.update(
      { isBlocked: false },
      { where: { id: id } }
    );
    
    if (updatedRowsCount === 0) {
      throw new Error("User not found");
    }
    
    res.json({ message: "User UnBlocked" });
  } catch (error) {
    throw new Error(error);
  }
});

// Add to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { prodId } = req.body;
  
  validateId(id);
  validateId(prodId);
  
  try {
    // Check if product is already in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      where: { userId: id, productId: prodId }
    });
    
    if (existingWishlistItem) {
      // Remove from wishlist
      await Wishlist.destroy({
        where: { userId: id, productId: prodId }
      });
      res.json({ message: "Product removed from wishlist" });
    } else {
      // Add to wishlist
      await Wishlist.create({
        userId: id,
        productId: prodId
      });
      res.json({ message: "Product added to wishlist" });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const { id } = req.user;
  validateId(id);
  
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: id },
      include: [
        { 
          model: Product, 
          as: 'product'
        }
      ]
    });
    
    res.json(wishlist);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  createAdmin,
  loginUserCtrl,
  loginAdmin,
  getallUser,
  getaUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  saveAddress,
  addToWishlist,
  getWishlist,
};