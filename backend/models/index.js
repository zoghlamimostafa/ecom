const { sequelize, Sequelize } = require('../config/database-sqlite');

// Import all models
const User = require('./User');
const Product = require('./Product');
const ProductRating = require('./ProductRating');
const Category = require('./Category');
const Brand = require('./Brand');
const Color = require('./Color');
const Coupon = require('./Coupon');
const Cart = require('./Cart');
const Wishlist = require('./Wishlist');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Blog = require('./Blog');
const BlogCategory = require('./BlogCategory');
const BlogLike = require('./BlogLike');
const Enquiry = require('./Enquiry');
const Payment = require('./Payment');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Cart, { foreignKey: 'userId', as: 'cart' });
  User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlist' });
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
  User.hasMany(ProductRating, { foreignKey: 'userId', as: 'ratings' });
  User.hasMany(BlogLike, { foreignKey: 'userId', as: 'blogLikes' });

  // Product associations
  Product.hasMany(Cart, { foreignKey: 'productId', as: 'cartItems' });
  Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlistItems' });
  Product.hasMany(ProductRating, { foreignKey: 'productId', as: 'ratings' });
  // NOTE: category, subcategory et brand sont des strings, pas des foreign keys
  // Les relations sont gérées manuellement dans le controller

  // Cart associations
  Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // Wishlist associations
  Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Order.hasOne(Payment, { foreignKey: 'orderId', as: 'payment' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });

  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // ProductRating associations
  ProductRating.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  ProductRating.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // Category self-association for parent-child relationship
  Category.hasMany(Category, { foreignKey: 'parentId', as: 'subcategories' });
  Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

  // Blog associations
  Blog.hasMany(BlogLike, { foreignKey: 'blogId', as: 'likes' });

  // BlogLike associations
  BlogLike.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });
  BlogLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Payment associations
  Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

  console.log('✅ Model associations defined successfully');
};

// Export all models and functions
module.exports = {
  sequelize,
  defineAssociations,
  User,
  Product,
  ProductRating,
  Category,
  Brand,
  Color,
  Coupon,
  Cart,
  Wishlist,
  Order,
  OrderItem,
  Blog,
  BlogCategory,
  BlogLike,
  Enquiry,
  Payment,
  Op: Sequelize.Op
};
