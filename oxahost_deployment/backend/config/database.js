const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port || 3306,
    dialect: config.dialect,
    logging: config.logging || false,
    define: config.define || {},
    pool: config.pool || {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error);
  }
};

module.exports = { sequelize, Sequelize, testConnection };