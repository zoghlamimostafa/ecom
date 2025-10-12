// Backend stable pour résoudre Network Error
console.log('🚀 Démarrage du serveur backend stable...');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// Configuration CORS permissive
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Gestion des preflight requests
app.options('*', cors());

// Données statiques pour les tests
const brands = [
    { id: 1, title: 'Nike', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: 'Adidas', createdAt: new Date(), updatedAt: new Date() },
    { id: 3, title: 'Apple', createdAt: new Date(), updatedAt: new Date() },
    { id: 4, title: 'Samsung', createdAt: new Date(), updatedAt: new Date() },
    { id: 5, title: 'Zara', createdAt: new Date(), updatedAt: new Date() }
];

const categories = [
    { id: 1, title: 'Électronique', slug: 'electronique', description: 'Produits électroniques' },
    { id: 2, title: 'Vêtements', slug: 'vetements', description: 'Mode et habillement' },
    { id: 3, title: 'Sport', slug: 'sport', description: 'Articles de sport' },
    { id: 4, title: 'Maison', slug: 'maison', description: 'Articles pour la maison' },
    { id: 5, title: 'Beauté', slug: 'beaute', description: 'Produits de beauté' }
];

// Routes principales
app.get('/api/', (req, res) => {
    console.log('📡 Health check request');
    res.json({ 
        status: 'OK', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.get('/api/brand', (req, res) => {
    console.log('🏷️ Brands request');
    res.json(brands);
});

app.get('/api/category', (req, res) => {
    console.log('📂 Categories request');
    res.json(categories);
});

// Route de connexion admin simplifiée
app.post('/api/user/admin-login', (req, res) => {
    console.log('🔐 Admin login request:', req.body);
    const { email, password } = req.body;
    
    if (email === 'admin@test.com' && password === 'admin123') {
        res.json({
            success: true,
            token: 'fake-jwt-token-for-testing',
            user: {
                id: 1,
                email: 'admin@test.com',
                firstname: 'Admin',
                lastname: 'User',
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

// Route pour les produits
app.get('/api/product', (req, res) => {
    console.log('🛍️ Products request');
    res.json([
        { id: 1, title: 'Produit Test 1', price: 29.99, brand: 'Nike', category: 'Sport' },
        { id: 2, title: 'Produit Test 2', price: 49.99, brand: 'Apple', category: 'Électronique' }
    ]);
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('❌ Erreur serveur:', err);
    res.status(500).json({ 
        error: 'Erreur interne du serveur',
        message: err.message 
    });
});

// Route 404
app.use('*', (req, res) => {
    console.log('❓ Route non trouvée:', req.originalUrl);
    res.status(404).json({ 
        error: 'Route non trouvée',
        path: req.originalUrl 
    });
});

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('✅ Serveur backend stable démarré!');
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🌐 Also: http://127.0.0.1:${PORT}`);
    console.log(`📡 Health: http://127.0.0.1:${PORT}/api/`);
    console.log(`🏷️ Brands: http://127.0.0.1:${PORT}/api/brand`);
    console.log(`📂 Categories: http://127.0.0.1:${PORT}/api/category`);
    console.log('🔐 Admin login: admin@test.com / admin123');
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM reçu, arrêt du serveur...');
    server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT reçu, arrêt du serveur...');
    server.close(() => process.exit(0));
});

console.log('🔄 Serveur en attente de connexions...');