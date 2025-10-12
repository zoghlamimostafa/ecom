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
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], 
  credentials: true 
}));
app.use(cookieParser());

// Servir les fichiers statiques
app.use(express.static('public'));

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

app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute);
app.use('/api/category', categoryRoute);
app.use('/api/brand', brandRoute);
app.use('/api/color', colorRoute);
app.use('/api/coupon', couponRoute);
app.use('/api/upload', uploadRoute);

// Test route
app.get('/', (req, res) => {
	res.send('API Sanny backend fonctionne !');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: err.message });
});

// Démarrage du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`🚀 Serveur backend lancé sur le port ${PORT}`);
});
