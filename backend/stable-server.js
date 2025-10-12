// Backend stable simplifié pour les tests
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Configuration de base
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de base sans base de données
app.get('/api/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

// Routes mockées pour les tests
app.get('/api/product', (req, res) => {
    res.json([
        { id: 1, title: "Product Test 1", price: 29.99, category: "Electronics" },
        { id: 2, title: "Product Test 2", price: 39.99, category: "Books" },
        { id: 3, title: "Product Test 3", price: 19.99, category: "Clothing" }
    ]);
});

app.get('/api/category', (req, res) => {
    res.json([
        { id: 1, title: "Electronics" },
        { id: 2, title: "Books" },
        { id: 3, title: "Clothing" }
    ]);
});

app.get('/api/brand', (req, res) => {
    res.json([
        { id: 1, title: "Brand A" },
        { id: 2, title: "Brand B" },
        { id: 3, title: "Brand C" }
    ]);
});

// Routes authentifiées mockées
app.get('/api/user/cart', (req, res) => {
    res.json([]);
});

app.get('/api/user/wishlist', (req, res) => {
    res.json([]);
});

app.post('/api/user/cart', (req, res) => {
    res.json({ message: 'Item added to cart', id: Math.floor(Math.random() * 1000) });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Démarrer le serveur
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend stable running on http://localhost:${PORT}`);
    console.log(`✅ API Health: http://localhost:${PORT}/api/`);
    console.log(`📦 Products: http://localhost:${PORT}/api/product`);
    console.log(`📂 Categories: http://localhost:${PORT}/api/category`);
    console.log(`🏷️  Brands: http://localhost:${PORT}/api/brand`);
    console.log(`\n⚠️  Press Ctrl+C to stop`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
});