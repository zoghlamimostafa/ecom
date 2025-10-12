const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Color = sequelize.define('Color', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  code: {
    type: DataTypes.STRING,
    validate: {
      is: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    }
  }
}, {
  timestamps: true
});

module.exports = Color;