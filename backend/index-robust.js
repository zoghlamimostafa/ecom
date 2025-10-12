const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const session = require('express-session');
const morgan = require("morgan");
const bodyParser = require('body-parser');

// Gestion d'erreur globale pour éviter les crashes
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    // Ne pas faire process.exit() pour garder le serveur actif
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise Rejection at:', promise);
    console.error('Reason:', reason);
});

console.log('🚀 Démarrage du serveur backend...');

// Configuration de base
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'sanny-ecommerce-secret-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Health check route (toujours disponible)
app.get('/api/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        uptime: process.uptime()
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        database: 'connected',
        services: ['auth', 'products', 'orders'],
        timestamp: new Date().toISOString()
    });
});

// Initialisation de la base de données avec gestion d'erreur
let databaseConnected = false;
async function initDatabase() {
    try {
        console.log('📡 Connexion à la base de données...');
        const ConnectDatabase = require('./config/dbConnect');
        await ConnectDatabase();
        databaseConnected = true;
        console.log('✅ Base de données connectée');
    } catch (error) {
        console.error('❌ Erreur base de données:', error.message);
        console.error('⚠️  Le serveur continuera sans base de données');
        databaseConnected = false;
    }
}

// Chargement des routes avec gestion d'erreur individuelle
function loadRoutes() {
    console.log('📋 Chargement des routes...');
    
    const routes = [
        { path: '/api/user', module: './routes/authRoute', name: 'Auth' },
        { path: '/api/product', module: './routes/productRoute', name: 'Products' },
        { path: '/api/category', module: './routes/prodcategoryRoute', name: 'Categories' },
        { path: '/api/brand', module: './routes/brandRoute', name: 'Brands' },
        { path: '/api/blog', module: './routes/blogRoute', name: 'Blog' },
        { path: '/api/blogcategory', module: './routes/blogCatRoute', name: 'Blog Categories' },
        { path: '/api/coupon', module: './routes/couponRoute', name: 'Coupons' },
        { path: '/api/upload', module: './routes/uploadRoute', name: 'Upload' },
        { path: '/api/color', module: './routes/colorRoute', name: 'Colors' },
        { path: '/api/enquiry', module: './routes/enqRoute', name: 'Enquiries' },
        { path: '/api/payment', module: './routes/paymentRoutes', name: 'Payment' },
        { path: '/api/token', module: './routes/refreshToken', name: 'Refresh Token' }
    ];

    routes.forEach(route => {
        try {
            const router = require(route.module);
            app.use(route.path, router);
            console.log(`✅ ${route.name}: ${route.path}`);
        } catch (error) {
            console.error(`❌ ${route.name} (${route.path}): ${error.message}`);
            
            // Route de fallback pour les routes qui échouent
            app.use(route.path, (req, res) => {
                res.status(503).json({
                    error: `Service ${route.name} temporairement indisponible`,
                    message: 'Veuillez réessayer plus tard',
                    timestamp: new Date().toISOString()
                });
            });
        }
    });
}

// Route de statut pour diagnostic
app.get('/api/status', (req, res) => {
    res.json({
        server: 'active',
        database: databaseConnected ? 'connected' : 'disconnected',
        routes: 'loaded',
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        },
        uptime: Math.round(process.uptime()) + ' seconds',
        timestamp: new Date().toISOString()
    });
});

// Middleware d'erreur global
app.use((err, req, res, next) => {
    console.error('❌ Erreur middleware:', err);
    
    if (res.headersSent) {
        return next(err);
    }
    
    res.status(err.status || 500).json({
        error: 'Erreur serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue',
        timestamp: new Date().toISOString()
    });
});

// Route 404 pour les routes non trouvées
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Démarrage du serveur
async function startServer() {
    try {
        console.log('🔧 Configuration du serveur...');
        
        // Initialiser la base de données
        await initDatabase();
        
        // Charger les routes
        loadRoutes();
        
        // Démarrer le serveur
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log('');
            console.log('🎉 SERVEUR BACKEND DÉMARRÉ AVEC SUCCÈS !');
            console.log('=' .repeat(50));
            console.log(`📡 URL: http://localhost:${PORT}`);
            console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
            console.log(`📊 Status: http://localhost:${PORT}/api/status`);
            console.log(`💾 Base de données: ${databaseConnected ? 'Connectée ✅' : 'Déconnectée ⚠️'}`);
            console.log('=' .repeat(50));
            console.log('⚠️  Appuyez sur Ctrl+C pour arrêter le serveur');
            console.log('');
        });

        // Gestion propre de l'arrêt
        process.on('SIGINT', () => {
            console.log('\n🛑 Arrêt du serveur...');
            server.close(() => {
                console.log('✅ Serveur arrêté proprement');
                process.exit(0);
            });
        });

        process.on('SIGTERM', () => {
            console.log('\n🛑 Arrêt du serveur (SIGTERM)...');
            server.close(() => {
                console.log('✅ Serveur arrêté proprement');
                process.exit(0);
            });
        });

        return server;
        
    } catch (error) {
        console.error('❌ Erreur critique au démarrage:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Lancer le serveur uniquement si ce fichier est exécuté directement
if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };