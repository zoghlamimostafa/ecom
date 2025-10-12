const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const BlogCategory = sequelize.define('BlogCategory', {
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
  }
}, {
  timestamps: true
});

module.exports = BlogCategory;