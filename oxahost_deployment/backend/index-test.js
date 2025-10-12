const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;

// Simple in-memory storage for testing
const users = [
    {
        email: "admin@sanny.com",
        password: "admin123",
        _id: "1",
        token: "sample-token-123"
    },
    {
        email: "test@test.com", 
        password: "test123",
        _id: "2",
        token: "sample-token-456"
    }
];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Simple login route for testing
app.post('/api/user/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt:', { email, password });
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email ou mot de passe incorrect"
            });
        }
        
        // Return user data
        res.json({
            success: true,
            message: "Connexion réussie",
            user: {
                _id: user._id,
                email: user.email,
                token: user.token
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
});

// Simple register route for testing
app.post('/api/user/register', (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        
        console.log('Register attempt:', { email, firstName, lastName });
        
        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Un utilisateur avec cet email existe déjà"
            });
        }
        
        // Create new user
        const newUser = {
            _id: String(users.length + 1),
            email,
            password,
            firstName,
            lastName,
            token: `token-${Date.now()}`
        };
        
        users.push(newUser);
        
        res.json({
            success: true,
            message: "Inscription réussie",
            user: {
                _id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                token: newUser.token
            }
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
});

// Get user profile route
app.get('/api/user/profile', (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const user = users.find(u => u.token === token);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Token invalide"
            });
        }
        
        res.json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
        
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
});

// Basic products route for testing
app.get('/api/product', (req, res) => {
    res.json({
        success: true,
        products: [
            {
                _id: "1",
                title: "Produit Test 1",
                price: 100,
                brand: "Sanny",
                category: "Test"
            },
            {
                _id: "2", 
                title: "Produit Test 2",
                price: 200,
                brand: "Sanny",
                category: "Test"
            }
        ]
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: "Serveur backend fonctionne correctement",
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: "Erreur serveur interne"
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route non trouvée"
    });
});

app.listen(PORT, () => {
    console.log(`Serveur de test démarré sur le port ${PORT}`);
    console.log(`API disponible sur: http://localhost:${PORT}/api/`);
    console.log('Base de données: En mémoire (pour tests)');
    console.log('\nComptes de test disponibles:');
    console.log('- admin@sanny.com / admin123');
    console.log('- test@test.com / test123');
});
