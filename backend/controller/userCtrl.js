const User = require('../models/userModels')
const generateResetToken = require('../config/generateResetToken')
const asyncHandler = require("express-async-handler")
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const sendEmail = require("../controller/emailCtrl")
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // Add mongoose import for ObjectId validation
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const Color = require("../models/colorModel"); // Add Color model import
const uniqid = require("uniqid");
const verifyResetToken = require("../config/verifyResetToken")
const createUser = asyncHandler(async (req, res) => {
  /**
   * TODO:Get the email from req.body
   */
  const email = req.body.email;
  /**
   * TODO:With the help of email find the user exists or not
   */
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    /**
     * TODO:if user not found user create a new user
     */
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    /**
     * TODO:if user found then thow an error: User already exists
     */
    throw new Error("User Already Exists");
  }
});

// Create Admin User
const createAdmin = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    // Create new admin user with role set to admin
    const adminData = { ...req.body, role: "admin" };
    const newAdmin = await User.create(adminData);
    res.json({
      success: true,
      message: "Admin user created successfully",
      admin: {
        _id: newAdmin._id,
        firstname: newAdmin.firstname,
        lastname: newAdmin.lastname,
        email: newAdmin.email,
        mobile: newAdmin.mobile,
        role: newAdmin.role
      }
    });
  } else {
    throw new Error("User Already Exists");
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Bonjour, veuillez suivre ce lien pour réinitialiser votre mot de passe. Ce lien est valable jusqu'à 10 minutes. <a href='http://localhost:3000/reset-password/${token}'>Cliquez ici</a>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});


// admin login

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  
  if (!findAdmin) {
    throw new Error("Admin not found with this email");
  }
  
  if (findAdmin.role !== "admin") {
    throw new Error("Not Authorised");
  }
  
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});


  


const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

        
const loginUserCtrl = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password"
      });
    }
    
    if (await findUser.isPasswordMatched(password)) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
      });
    } else {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password"
      });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Login failed",
      error: error.message
    });
  }
});
// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
    throw new Error("No Refresh Token in Cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new Error("No Refresh token present in db or not matched");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});


const logout = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
      throw new Error("No Refresh Token in Cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.status(204).json({ message: "User not found. Already logged out." });
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: "" });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    console.error("An error occurred while logging out:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});


const getMyOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  // Vérifier si l'ID utilisateur est valide
  if (!_id) {
    return res.status(400).json({ status: "fail", message: "Invalid user ID" });
  }

  try {
    // Recherche des commandes associées à l'utilisateur
    const orders = await Order.find({ user: _id }).populate('orderItems.product');

    // Renvoyer les commandes directement (array format expected by frontend)
    res.json(orders);
  } catch (error) {
    console.error("Error while fetching user orders:", error);
    // Renvoyer une erreur en cas de problème avec la recherche des commandes
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});







  const getallUser = asyncHandler(async (req, res) => {
    try {
      const getUsers = await User.find({ role: { $ne: 'admin' } }).select('-password');
      res.json({
        status: 'success',
        count: getUsers.length,
        data: getUsers
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        status: 'fail',
        message: "Error fetching users",
        error: error.message 
      });
    }
  });
  

  const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)

    try {
        const getaUser = await User.findById(id);
        res.json({
          getaUser,
        });
      } catch (error) {
        throw new Error(error);
      }
    });  

    const updatedUser = asyncHandler(async (req, res) => {
      const { _id } = req.user;
      validateMongoDbId(_id)
      try {
        const updatedUser = await User.findByIdAndUpdate(
          _id,
          {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
          },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(updatedUser);
      } catch (error) {
        throw new Error(error);
      }
    });
    
      
const getUserProfile = async (req, res) => {
  try {
    // Récupérez l'ID de l'utilisateur à partir de la requête
    const userId = req.user._id; // Supposons que vous avez un middleware pour extraire l'utilisateur de la requête (par exemple, à partir du token JWT)

    // Recherchez l'utilisateur dans la base de données par son ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retournez les informations de l'utilisateur
    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
      const blockUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)

        try {
          const blockusr = await User.findByIdAndUpdate(
            id,
            {
              isBlocked: true,
            },
            {
              new: true,
            }
          );
          res.json(blockusr);
        } catch (error) {
          throw new Error(error);
        }
      });
      
      const unblockUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)

        try {
          const unblock = await User.findByIdAndUpdate(
            id,
            {
              isBlocked: false,
            },
            {
              new: true,
            }
          );
          res.json({
            message: "User UnBlocked",
          });
        } catch (error) {
          throw new Error(error);
        }
      });
      

    const deleteaUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        console.log("Attempting to delete user with ID:", id);
        
        try {
          validateMongoDbId(id);
          
          const userToDelete = await User.findById(id);
          if (!userToDelete) {
            return res.status(404).json({
              status: 'fail',
              message: 'User not found'
            });
          }
          
          // Prevent deletion of admin users
          if (userToDelete.role === 'admin') {
            return res.status(403).json({
              status: 'fail',
              message: 'Cannot delete admin users'
            });
          }
          
          const deletedUser = await User.findByIdAndDelete(id);
          console.log("User deleted successfully:", deletedUser.email);
          
          res.json({
            status: 'success',
            message: 'User deleted successfully',
            deletedUser: {
              _id: deletedUser._id,
              email: deletedUser.email,
              firstname: deletedUser.firstname,
              lastname: deletedUser.lastname
            }
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          res.status(500).json({
            status: 'fail',
            message: 'Error deleting user',
            error: error.message
          });
        }
      });
      const getWishlist = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        console.log("Getting wishlist for user:", _id);
        try {
          const findUser = await User.findById(_id).populate({
            path: 'wishlist',
            select: 'title price images description category brand'
          });
          if (!findUser) {
            return res.status(404).json({ message: "User not found" });
          }
          
          console.log("Wishlist fetched successfully for user:", _id);
          res.json(findUser.wishlist || []);
        } catch (error) {
          console.error("Error in getWishlist:", error);
          res.status(500).json({ message: "Failed to fetch wishlist" });
        }
      });

      // save user Address

      const saveAddress = async (req, res) => {
        const userId = req.user._id;  // L'ID utilisateur provenant du token JWT
      
        try {
          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { address: req.body.address }, // Mise à jour de l'adresse
            { new: true, runValidators: true }
          );
      
          if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
          }
      
          res.status(200).json({
            message: "Adresse mise à jour avec succès",
            user: updatedUser,  // Retourner l'utilisateur mis à jour avec l'adresse
          });
        } catch (error) {
          res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
        }
      };
      
      
// Backend - userCart
const userCart = asyncHandler(async (req, res) => {
  const { productId, color, quantity, price } = req.body;
  const { _id } = req.user;

  // Add detailed logging for debugging
  console.log("Cart request data:", {
    productId: productId,
    color: color,
    quantity: quantity,
    price: price,
    priceType: typeof price,
    userId: _id
  });

  // Validation des données d'entrée
  if (isNaN(parseFloat(price)) || !isFinite(price)) {
    console.log("Price validation failed:", { price, type: typeof price });
    return res.status(400).json({ message: "Invalid price format" });
  }

  if (!productId || !quantity || isNaN(parseInt(quantity)) || quantity <= 0) {
    console.log("Basic validation failed:", { productId, quantity, quantityType: typeof quantity });
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    // Prepare cart data - only include color if it's a valid ObjectId
    const cartData = {
      userId: _id,
      productId,
      quantity,
      price
    };

    // Handle color: if it's an array, take the first element; if it's a string, use as-is
    let colorToUse = null;
    if (color) {
      if (Array.isArray(color) && color.length > 0) {
        colorToUse = color[0];
      } else if (typeof color === 'string') {
        colorToUse = color;
      }
    }

    // Only add color if it's provided and is a valid ObjectId format
    if (colorToUse && mongoose.Types.ObjectId.isValid(colorToUse) && colorToUse !== "default") {
      cartData.color = colorToUse;
    }

    console.log("Final cart data to save:", cartData);

    // Créer un nouveau panier et l'enregistrer dans la base de données
    let newCart = await new Cart(cartData).save();

    // Renvoyer la réponse avec le nouveau panier créé
    res.json(newCart);
  } catch (error) {
    console.error("Error while saving cart:", error);
    return res.status(500).json({ message: "Failed to add product to cart" });
  }
});

// Backend - getUserCart
const getUserCart = asyncHandler(async (req, res) => {
  console.log("getUserCart called");
  
  if (!req.user) {
    console.log("No user in request");
    return res.status(401).json({ message: "User not authenticated" });
  }
  
  const { _id } = req.user;
  console.log("Fetching cart for user:", _id);

  try {
    // Simple query first to test
    const cartCount = await Cart.countDocuments({ userId: _id });
    console.log("Cart items count:", cartCount);
    
    // Récupérer le panier de l'utilisateur depuis la base de données
    const cart = await Cart.find({ userId: _id }).populate("productId");
    
    console.log("Cart fetched successfully for user:", _id, "Items:", cart.length);
    res.json(cart);
  } catch (error) {
    console.error("Error while fetching user cart:", error);
    return res.status(500).json({ message: "Failed to fetch user cart" });
  }
});



const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  
  try { 
    const user = await User.findOne({ _id });
    
    // Assuming 'Cart' is your Mongoose model for the 'cart' collection
    const cart = await Cart.findOneAndDelete({ orderby: user._id });

    res.json(cart);
  } catch (error) {
    // Handle errors more gracefully
    console.error("Error in emptyCart function:", error);
    res.status(500).json({ status: "fail", message: "Internal Server Error" });
  }
});
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});



const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;

  try {
    // Get user's cart
    const userCart = await Cart.find({ userId: _id }).populate("productId");
    
    if (!userCart || userCart.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Cart is empty"
      });
    }

    // Get user data for shipping info
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({
        status: "fail", 
        message: "User not found"
      });
    }

    // Parse user address if it exists
    let shippingAddress = {};
    if (user.address) {
      try {
        const parsedAddress = typeof user.address === 'string' ? JSON.parse(user.address) : user.address;
        shippingAddress = {
          firstName: user.firstname || "N/A",
          lastName: user.lastname || "N/A", 
          address: parsedAddress.street || parsedAddress.address || "N/A",
          city: parsedAddress.city || "N/A",
          state: parsedAddress.state || "N/A", 
          pincode: parsedAddress.postalCode || parsedAddress.pincode || "N/A",
          country: parsedAddress.country || "N/A"
        };
      } catch (error) {
        console.log("Error parsing address:", error);
        shippingAddress = {
          firstName: user.firstname || "N/A",
          lastName: user.lastname || "N/A", 
          address: "Address not provided",
          city: "N/A",
          state: "N/A",
          pincode: "N/A", 
          country: "N/A"
        };
      }
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Shipping address is required"
      });
    }

    // Get default color for products without specific color
    const Color = require("../models/colorModel");
    let defaultColor = await Color.findOne();
    
    if (!defaultColor) {
      // Create a default color if none exists
      defaultColor = await Color.create({ title: "Default", code: "#000000" });
    }

    // Calculate totals
    let cartTotal = 0;
    const orderItems = [];

    for (const item of userCart) {
      cartTotal += item.price * item.quantity;
      orderItems.push({
        product: item.productId._id,
        quantity: item.quantity, // Use 'quantity' not 'count' to match Order schema
        color: item.color && mongoose.Types.ObjectId.isValid(item.color) 
          ? item.color 
          : defaultColor._id, // Ensure color is valid ObjectId
        price: item.price
      });
    }

    let totalAfterDiscount = cartTotal;

    // Apply coupon if provided
    if (couponApplied) {
      const coupon = await Coupon.findById(couponApplied);
      if (coupon) {
        totalAfterDiscount = (cartTotal - (cartTotal * coupon.discount) / 100).toFixed(2);
      }
    }

    // Create order with proper schema fields
    const order = await Order.create({
      user: _id,
      shippingInfo: shippingAddress,
      orderItems,
      totalPrice: totalAfterDiscount,
      totalPriceAfterDiscount: totalAfterDiscount,
      orderStatus: "Ordered", // Use valid enum value
      paymentInfo: { // Use 'paymentInfo' not 'paymentIntent' to match Order schema
        stripePaymentId: COD ? `cod_payment_${Date.now()}` : `online_payment_${Date.now()}`,
        stripeTransactionId: COD ? `cod_txn_${Date.now()}` : `online_txn_${Date.now()}`
      },
      paidAt: COD ? Date.now() : Date.now()
    });

    // Clear user's cart after successful order creation
    await Cart.deleteMany({ userId: _id });

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      status: "fail",
      message: "Une erreur s'est produite lors de la création de la commande.",
      error: error.message
    });
  }
});



const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    // Si l'utilisateur est authentifié et autorisé, poursuivre avec la récupération des commandes
    const alluserorders = await Order.find()
      .populate("orderItems.product")
      .populate("user")
      .exec();
    res.json({
      status: "success",
      count: alluserorders.length,
      data: alluserorders
    });
  } catch (error) {
    // Gérer les erreurs d'une manière appropriée
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ 
      status: "fail",
      message: "Error fetching orders",
      error: error.message
    });
  }
});const getOrderByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("Getting order details for order ID:", id);
  
  try {
    validateMongoDbId(id);
    
    // Find the specific order by its ID
    const order = await Order.findById(id)
      .populate("user", "firstname lastname email")
      .populate("orderItems.product")
      .populate("orderItems.color")
      .exec();
    
    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }
    
    console.log("Order found:", order._id);
    res.json(order);
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({
      status: 'fail',
      message: 'Error retrieving order',
      error: error.message
    });
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete order function
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("Attempting to delete order with ID:", id);
  
  try {
    validateMongoDbId(id);
    
    const orderToDelete = await Order.findById(id);
    if (!orderToDelete) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }
    
    const deletedOrder = await Order.findByIdAndDelete(id);
    console.log("Order deleted successfully:", deletedOrder._id);
    
    res.json({
      status: 'success',
      message: 'Order deleted successfully',
      deletedOrder: {
        _id: deletedOrder._id,
        totalPrice: deletedOrder.totalPrice,
        orderStatus: deletedOrder.orderStatus,
        user: deletedOrder.user
      }
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      status: 'fail',
      message: 'Error deleting order',
      error: error.message
    });
  }
});


const removeProductFromCart = asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  const {cartItemId} =req.body;
  validateMongoDbId(_id);
  try {
    const deleteProductFromCart = await Cart.deleteOne({ userId:_id,_id:cartItemId})
   
    res.json(deleteProductFromCart);
  } catch (error) {
    throw new Error(error);
  } 
})

const updateProductQuantityFromCart = asyncHandler(async(req,res)=>{
  const { _id } = req.user;
  const { cartItemId, newQuantity } = req.params; // Utilisez req.params pour récupérer les paramètres de l'URL
  validateMongoDbId(_id);
  try {
    const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    cartItem.quantity = newQuantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    console.error(error); // Vous n'avez pas besoin de throw ici, car asyncHandler gère déjà les erreurs
    res.status(500).json({ message: "Internal Server Error" }); // Envoyez une réponse d'erreur appropriée au client
  } 
});





    module.exports = {createUser,createAdmin,getUserCart,removeProductFromCart,
      getOrders,emptyCart,getWishlist,updateProductQuantityFromCart,
      applyCoupon,loginUserCtrl,loginAdmin,getallUser,getaUser,deleteaUser,updatedUser,blockUser,unblockUser,
        handleRefreshToken,logout,userCart,getMyOrders,
        forgotPasswordToken,resetPassword,
        createOrder,getAllOrders,updateOrderStatus,deleteOrder,getOrderByUserId,getUserProfile
      }
