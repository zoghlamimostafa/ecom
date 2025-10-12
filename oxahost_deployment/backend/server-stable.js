// Backend simple et stable pour résoudre le problème Network Error
console.log('🚀 Démarrage du serveur backend stable...');

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Middleware CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Données statiques pour les tests
const brands = [
    { id: 1, title: 'Nike', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: 'Adidas', createdAt: new Date(), updatedAt: new Date() },
    { id: 3, title: 'Apple', createdAt: new Date(), updatedAt: new Date() },
    { id: 4, title: 'Samsung', createdAt: new Date(), updatedAt: new Date() },
    { id: 5, title: 'Zara', createdAt: new Date(), updatedAt: new Date() }
];

const categories = [
    { id: 1, title: 'Électronique', slug: 'electronique', description: 'Produits électroniques', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, title: 'Vêtements', slug: 'vetements', description: 'Mode et habillement', createdAt: new Date(), updatedAt: new Date() },
    { id: 3, title: 'Sport', slug: 'sport', description: 'Articles de sport', createdAt: new Date(), updatedAt: new Date() },
    { id: 4, title: 'Maison', slug: 'maison', description: 'Articles pour la maison', createdAt: new Date(), updatedAt: new Date() },
    { id: 5, title: 'Beauté', slug: 'beaute', description: 'Produits de beauté', createdAt: new Date(), updatedAt: new Date() }
];

// Route de santé
app.get('/api/', (req, res) => {
    console.log('📡 Health check request');
    res.json({
        status: 'OK',
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Routes brands
app.get('/api/brand', (req, res) => {
    console.log('🏷️ GET /api/brand - Returning brands');
    res.json(brands);
});

app.get('/api/brand/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const brand = brands.find(b => b.id === id);
    if (brand) {
        console.log(`🏷️ GET /api/brand/${id} - Found brand: ${brand.title}`);
        res.json(brand);
    } else {
        console.log(`🏷️ GET /api/brand/${id} - Brand not found`);
        res.status(404).json({ error: 'Brand not found' });
    }
});

// Routes categories
app.get('/api/category', (req, res) => {
    console.log('📂 GET /api/category - Returning categories');
    res.json(categories);
});

app.get('/api/category/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const category = categories.find(c => c.id === id);
    if (category) {
        console.log(`📂 GET /api/category/${id} - Found category: ${category.title}`);
        res.json(category);
    } else {
        console.log(`📂 GET /api/category/${id} - Category not found`);
        res.status(404).json({ error: 'Category not found' });
    }
});

// Route de login admin simple
app.post('/api/user/admin-login', (req, res) => {
    console.log('🔐 POST /api/user/admin-login - Admin login attempt');
    const { email, password } = req.body;
    
    if (email === 'admin@test.com' && password === 'admin123') {
        console.log('✅ Admin login successful');
        res.json({
            success: true,
            token: 'fake-jwt-token-for-testing',
            user: {
                id: 1,
                email: 'admin@test.com',
                role: 'admin'
            }
        });
    } else {
        console.log('❌ Admin login failed');
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Route pour les produits (vide pour l'instant)
app.get('/api/product', (req, res) => {
    console.log('📦 GET /api/product - Returning empty products');
    res.json([]);
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('❌ Erreur serveur:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Route 404
app.use('*', (req, res) => {
    console.log(`❓ Route non trouvée: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Route not found' });
});

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('✅ Serveur backend stable démarré avec succès!');
    console.log(`🌐 URL principale: http://localhost:${PORT}`);
    console.log(`🌐 URL alternative: http://127.0.0.1:${PORT}`);
    console.log(`📡 Health check: http://127.0.0.1:${PORT}/api/`);
    console.log(`🏷️ Brands API: http://127.0.0.1:${PORT}/api/brand`);
    console.log(`📂 Categories API: http://127.0.0.1:${PORT}/api/category`);
    console.log('🎯 Ready to handle admin interface requests!');
});

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
    console.log('🛑 Signal SIGTERM reçu, arrêt du serveur...');
    server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Signal SIGINT reçu, arrêt du serveur...');
    server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
    });
});

console.log('🔄 Serveur en cours d\'exécution...');