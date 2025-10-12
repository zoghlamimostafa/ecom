// Configuration centralisée pour éviter les problèmes de JWT_SECRET
require('dotenv').config();

const config = {
    JWT_SECRET: process.env.JWT_SECRET || 'azertyuiopmlkhgf45633214hgftrdtd',
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development'
};

console.log('🔧 Configuration chargée:', {
    JWT_SECRET_EXISTS: !!config.JWT_SECRET,
    JWT_SECRET_LENGTH: config.JWT_SECRET.length,
    PORT: config.PORT,
    NODE_ENV: config.NODE_ENV
});

module.exports = config;