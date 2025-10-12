// Script de démarrage robuste pour le backend
console.log('🚀 Démarrage du serveur backend...');

// Import des modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true
}));

// Middleware de base
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Route de test simple
app.get('/api/', (req, res) => {
    console.log('📡 Health check request received');
    res.json({ 
        status: 'OK', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        brands_count: 'Available via /api/brand',
        categories_count: 'Available via /api/category'
    });
});

// Route simple pour les brands
app.get('/api/brand', (req, res) => {
    console.log('🏷️ Brands request received');
    res.json([
        { id: 1, title: 'Nike' },
        { id: 2, title: 'Adidas' },
        { id: 3, title: 'Apple' },
        { id: 4, title: 'Samsung' },
        { id: 5, title: 'Zara' }
    ]);
});

// Route simple pour les categories
app.get('/api/category', (req, res) => {
    console.log('📂 Categories request received');
    res.json([
        { id: 1, title: 'Électronique', slug: 'electronique' },
        { id: 2, title: 'Vêtements', slug: 'vetements' },
        { id: 3, title: 'Sport', slug: 'sport' },
        { id: 4, title: 'Maison', slug: 'maison' },
        { id: 5, title: 'Beauté', slug: 'beaute' }
    ]);
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('❌ Erreur serveur:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage du serveur
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Serveur démarré avec succès!`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🌐 Also: http://127.0.0.1:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/`);
    console.log(`🏷️ Brands: http://localhost:${PORT}/api/brand`);
    console.log(`📂 Categories: http://localhost:${PORT}/api/category`);
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

module.exports = app;