const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ConnectDatabase = require('./config/dbConnect');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001'], 
  credentials: true 
}));
app.use(cookieParser());

// Connexion MySQL avec Sequelize
ConnectDatabase()
  .then(() => console.log('✅ MySQL Database connected successfully'))
  .catch((err) => console.error('❌ MySQL connection error:', err));

// Import des routes
const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute');
const blogRoute = require('./routes/blogRoute');
const categoryRoute = require('./routes/prodcategoryRoute');
const brandRoute = require('./routes/brandRoute');
const colorRoute = require('./routes/colorRoute');
const couponRoute = require('./routes/couponRoute');
const uploadRoute = require('./routes/uploadRoute');

// Utilisation des routes
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute);
app.use('/api/category', categoryRoute);
app.use('/api/brand', brandRoute);
app.use('/api/color', colorRoute);
app.use('/api/coupon', couponRoute);
app.use('/api/upload', uploadRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;