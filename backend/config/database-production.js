# Configuration de production pour OxaHost
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Utiliser les variables d'environnement pour la production
const sequelize = new Sequelize(
  process.env.DB_NAME || 'ecomerce_sanny_mysql',
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000,
      acquireTimeout: 60000,
    }
  }
);

// Test de connexion avec gestion d'erreur
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connection established successfully.');
    console.log(`Connected to: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error.message);
    
    // Log détaillé en développement
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    
    // En production, ne pas arrêter le serveur immédiatement
    // Laisser une chance de reconnexion
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️ Database connection failed in production. Retrying...');
      setTimeout(testConnection, 5000); // Retry après 5 secondes
    }
  }
};

module.exports = { sequelize, Sequelize, testConnection };