const { Sequelize } = require('sequelize');
const path = require('path');

// Create Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
  define: {
    timestamps: true,
    underscored: false
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database connection established successfully.');
    console.log('Database location:', path.join(__dirname, '..', 'database.sqlite'));
  } catch (error) {
    console.error('❌ Unable to connect to SQLite database:', error);
  }
};

module.exports = { sequelize, Sequelize, testConnection };