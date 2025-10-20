const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const paymentRouter = require("./routes/paymentRoutes");
const productRouter = require('./routes/productRoute');
const blogRoute = require('./routes/blogRoute');
const blogcategoryRouter = require('./routes/blogCatRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const colorRouter = require("./routes/colorRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const enqRouter = require("./routes/enqRoute");
const refreshTokenRouter = require("./routes/refreshToken");
const searchRouter = require("./routes/searchRoute");
const session = require('express-session');
// const images = require ("./routes/imageRoutes");             // Temporarily commented

const ConnectDatabase = require('./config/dbConnect');

app.use(session({
    secret: 'secret', // Changez ceci pour un secret plus sécurisé
    resave: false,
    saveUninitialized: true
}));
const morgan = require("morgan");
app.use(morgan("dev"));
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

ConnectDatabase();

// Configure CORS with flexible origin handling
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      /^http:\/\/74\.235\.205\.26:\d+$/,  // Allow external IP with any port
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/,  // Allow local network
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/    // Allow local network
    ];
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Still allow but log for debugging
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use(cookieParser());

// ⚠️ Ne PAS appliquer body-parser aux routes d'upload (multer s'en charge)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/upload')) {
    console.log("⚠️ Skipping body-parser for upload route");
    return next();
  }
  bodyParser.json({ limit: '500mb' })(req, res, next);
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/upload')) {
    return next();
  }
  bodyParser.urlencoded({ extended: false, limit: '500mb' })(req, res, next);
});

// 🖼️ Servir les images statiques
const imagesPath = path.join(__dirname, 'public', 'images');
app.use('/images', express.static(imagesPath));
console.log('📁 Serving static images from:', imagesPath);

// Debug middleware pour traquer les requêtes
app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.originalUrl} - From: ${req.get('User-Agent')?.substring(0, 50)}...`);
    next();
});

// Health check route
app.get('/api/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Sanny Store Backend API',
        version: '1.0.0',
        endpoints: {
            products: '/api/product',
            users: '/api/user',
            admin: '/api/user/admin-login',
            health: '/api/'
        },
        timestamp: new Date().toISOString()
    });
});

// Redirect routes for backward compatibility
app.get('/product', (req, res) => {
    res.redirect(301, '/api/product');
});

app.get('/product/:id', (req, res) => {
    res.redirect(301, `/api/product/${req.params.id}`);
});

// Handle favicon requests gracefully
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
app.use('/api/user', authRoute);
app.use("/api/payment", paymentRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRoute);
app.use('/api/blogcategory', blogcategoryRouter);
app.use('/api/brand', brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/category", categoryRouter);
app.use("/api/search", searchRouter);
// app.use("/api/images", images);        // Temporarily commented
app.use("/api/token", refreshTokenRouter); // Added route for refreshing tokens

app.use(notFound);
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running at http://0.0.0.0:${PORT}`);
        console.log(`Also accessible at http://localhost:${PORT}`);
    });
    
    // Augmenter les timeouts pour les uploads volumineux
    server.timeout = 300000; // 5 minutes
    server.keepAliveTimeout = 65000; // 65 secondes
    server.headersTimeout = 66000; // 66 secondes
    console.log("⏱️ Server timeouts configured for large uploads");
}