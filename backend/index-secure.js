const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const session = require('express-session');
const morgan = require("morgan");
const bodyParser = require('body-parser');

// Import du middleware de sécurité renforcée
const {
    generalLimiter,
    authLimiter,
    uploadLimiter,
    helmetConfig,
    corsSecure,
    sanitizeData,
    securityMiddleware,
    validateInput,
    mongoSanitize,
    xssClean,
    hppProtection,
    compression,
    securityLogger,
    schemas
} = require('./middlewares/security');

// Gestion d'erreur globale pour éviter les crashes
process.on('uncaughtException', (error) => {
    securityLogger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    console.error('❌ Uncaught Exception:', error);
    // Ne pas faire process.exit() pour garder le serveur actif
});

process.on('unhandledRejection', (reason, promise) => {
    securityLogger.error('Unhandled Promise Rejection:', { reason, promise: promise.toString() });
    console.error('❌ Unhandled Promise Rejection at:', promise);
    console.error('Reason:', reason);
});

console.log('🚀 Démarrage du serveur backend sécurisé...');
console.log('🔧 Configuration du serveur...');

// ===========================================
// MIDDLEWARES DE SÉCURITÉ (ORDRE IMPORTANT)
// ===========================================

// 1. Compression (en premier pour optimiser toutes les réponses)
app.use(compression);

// 2. Headers de sécurité avec Helmet
app.use(helmetConfig);

// 3. Logging sécurisé
app.use(morgan('combined', {
    stream: {
        write: (message) => securityLogger.info(message.trim())
    }
}));

// 4. Rate limiting général
app.use(generalLimiter);

// 5. CORS sécurisé
app.use(corsSecure);

// 6. Parsing sécurisé du body - Limites augmentées pour images haute qualité
app.use(bodyParser.json({ 
    limit: '50mb', // Augmenté pour support images haute résolution
    verify: (req, res, buf) => {
        // Vérifier la taille du payload
        if (buf.length > 52428800) { // 50MB (50 * 1024 * 1024)
            securityLogger.warn('Large payload detected', {
                ip: req.ip,
                size: buf.length,
                path: req.path
            });
            throw new Error('Payload trop volumineux');
        }
    }
}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// 7. Cookie parsing sécurisé
app.use(cookieParser());

// 8. Session sécurisée
app.use(session({
    secret: process.env.SESSION_SECRET || 'sanny-ecommerce-secret-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS en production
        httpOnly: true, // Protection XSS
        maxAge: 24 * 60 * 60 * 1000, // 24 heures
        sameSite: 'strict' // Protection CSRF
    },
    name: 'sanny.sid' // Nom de session custom
}));

// 9. Protection contre les attaques NoSQL
app.use(mongoSanitize);

// 10. Protection XSS
app.use(xssClean);

// 11. Protection HTTP Parameter Pollution
app.use(hppProtection);

// 12. Sanitisation des données
app.use(sanitizeData);

// 13. Middleware de sécurité custom
app.use(securityMiddleware);

console.log('🔐 Middlewares de sécurité configurés');

// ===========================================
// ROUTES DE SANTÉ ET STATUS
// ===========================================

// Health check route (sans limitation)
app.get('/api/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Sanny E-commerce API is running securely',
        timestamp: new Date().toISOString(),
        security: '🔒 Enhanced'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Sanny E-commerce Backend',
        version: '2.0.0-secure',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
        security: {
            helmet: '✅',
            rateLimit: '✅',
            cors: '✅',
            xss: '✅',
            validation: '✅'
        }
    });
});

app.get('/api/status', (req, res) => {
    const { sequelize } = require('./config/database-sqlite');
    
    sequelize.authenticate()
        .then(() => {
            res.json({
                server: 'Running securely',
                database: 'Connected',
                environment: process.env.NODE_ENV || 'development',
                port: PORT,
                security: 'Enhanced',
                timestamp: new Date().toISOString()
            });
        })
        .catch(error => {
            securityLogger.error('Database connection failed', { error: error.message });
            res.status(500).json({
                server: 'Running',
                database: 'Disconnected',
                error: 'Database connection failed'
            });
        });
});

// ===========================================
// CONNEXION BASE DE DONNÉES
// ===========================================

console.log('📡 Connexion à la base de données...');

const { sequelize } = require('./config/database-sqlite');

sequelize.authenticate()
    .then(() => {
        console.log('✅ SQLite Database connection established successfully.');
        console.log(`Connected to SQLite database: ${sequelize.options.storage}`);
        securityLogger.info('Database connected successfully');
        
        // Synchroniser les modèles
        return sequelize.sync();
    })
    .then(() => {
        console.log('✅ Model associations defined successfully');
        console.log('✅ Database tables synchronized successfully.');
        console.log('✅ Base de données connectée');
    })
    .catch(error => {
        console.error('❌ Unable to connect to the database:', error);
        securityLogger.error('Database connection failed:', { error: error.message });
    });

// ===========================================
// CHARGEMENT DES ROUTES AVEC SÉCURITÉ
// ===========================================

console.log('📋 Chargement des routes...');

// Routes avec rate limiting spécialisé
app.use('/api/user/register', authLimiter, validateInput(schemas.user));
app.use('/api/user/login', authLimiter, validateInput(schemas.login));
app.use('/api/user/admin-login', authLimiter, validateInput(schemas.login));
app.use('/api/upload', uploadLimiter);

// Import et configuration des routes
try {
    const authRouter = require("./routes/authRoute");
    const productRouter = require("./routes/productRoute");
    const categoryRouter = require("./routes/categoryRoute");
    const brandRouter = require("./routes/brandRoute");
    const blogRouter = require("./routes/blogRoute");
    const blogCategoryRouter = require("./routes/blogCategoryRoute");
    const couponRouter = require("./routes/couponRoute");
    const uploadRouter = require("./routes/uploadRoute");
    const colorRouter = require("./routes/colorRoute");
    const enquiryRouter = require("./routes/enquiryRoute");
    const paymentRouter = require("./routes/paymentRoute");
    const tokenRouter = require("./routes/tokenRoute");

    // Configuration des routes avec logging
    app.use("/api/user", authRouter);
    console.log('✅ Auth: /api/user');
    
    app.use("/api/product", productRouter);
    console.log('✅ Products: /api/product');
    
    app.use("/api/category", categoryRouter);
    console.log('✅ Categories: /api/category');
    
    app.use("/api/brand", brandRouter);
    console.log('✅ Brands: /api/brand');
    
    app.use("/api/blog", blogRouter);
    console.log('✅ Blog: /api/blog');
    
    app.use("/api/blogcategory", blogCategoryRouter);
    console.log('✅ Blog Categories: /api/blogcategory');
    
    app.use("/api/coupon", couponRouter);
    console.log('✅ Coupons: /api/coupon');
    
    app.use("/api/upload", uploadRouter);
    console.log('✅ Upload: /api/upload');
    
    app.use("/api/color", colorRouter);
    console.log('✅ Colors: /api/color');
    
    app.use("/api/enquiry", enquiryRouter);
    console.log('✅ Enquiries: /api/enquiry');
    
    app.use("/api/payment", paymentRouter);
    console.log('✅ Payment: /api/payment');
    
    app.use("/api/token", tokenRouter);
    console.log('✅ Refresh Token: /api/token');

    securityLogger.info('All routes loaded successfully');
    
} catch (error) {
    console.error('❌ Erreur lors du chargement des routes:', error);
    securityLogger.error('Route loading failed:', { error: error.message, stack: error.stack });
}

// ===========================================
// GESTION DES ERREURS SÉCURISÉE
// ===========================================

// Middleware de gestion d'erreurs 404
app.use('*', (req, res) => {
    securityLogger.warn('404 - Route not found', {
        ip: req.ip,
        path: req.originalUrl,
        method: req.method,
        userAgent: req.get('User-Agent')
    });
    
    res.status(404).json({
        error: 'Route non trouvée',
        message: 'L\'endpoint demandé n\'existe pas'
    });
});

// Middleware de gestion d'erreurs global
app.use((error, req, res, next) => {
    securityLogger.error('Application error:', {
        error: error.message,
        stack: error.stack,
        ip: req.ip,
        path: req.originalUrl,
        method: req.method
    });

    // Ne pas exposer les détails d'erreur en production
    const isDev = process.env.NODE_ENV !== 'production';
    
    res.status(error.status || 500).json({
        error: 'Erreur interne du serveur',
        message: isDev ? error.message : 'Une erreur s\'est produite',
        ...(isDev && { stack: error.stack })
    });
});

// ===========================================
// DÉMARRAGE DU SERVEUR
// ===========================================

const server = app.listen(PORT, () => {
    const config = {
        JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
        JWT_SECRET_LENGTH: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
        PORT: PORT,
        NODE_ENV: process.env.NODE_ENV || 'development'
    };
    
    console.log('🔧 Configuration chargée:', config);
    
    console.log('\n🎉 SERVEUR BACKEND DÉMARRÉ AVEC SUCCÈS !');
    console.log('=' .repeat(50));
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log(`📊 Status: http://localhost:${PORT}/api/status`);
    console.log('🔒 Sécurité: RENFORCÉE');
    console.log('💾 Base de données: Connectée ✅');
    console.log('🛡️  Protections actives:');
    console.log('   • Helmet (Headers sécurisés)');
    console.log('   • Rate Limiting (Anti brute force)');
    console.log('   • XSS Protection');
    console.log('   • CORS sécurisé');
    console.log('   • Validation des entrées');
    console.log('   • Logging de sécurité');
    console.log('=' .repeat(50));
    console.log('⚠️  Appuyez sur Ctrl+C pour arrêter le serveur');
    
    securityLogger.info('Secure server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
    });
});

// Gestion d'arrêt propre
const gracefulShutdown = (signal) => {
    console.log(`\n🛑 Signal ${signal} reçu. Arrêt du serveur...`);
    securityLogger.info(`Server shutdown initiated by ${signal}`);
    
    server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        securityLogger.info('Server shutdown completed');
        
        // Fermer la connexion DB
        sequelize.close().then(() => {
            console.log('✅ Base de données déconnectée');
            process.exit(0);
        }).catch(error => {
            console.error('❌ Erreur fermeture DB:', error);
            process.exit(1);
        });
    });
    
    // Force quit après 10 secondes
    setTimeout(() => {
        console.error('❌ Arrêt forcé (timeout)');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;