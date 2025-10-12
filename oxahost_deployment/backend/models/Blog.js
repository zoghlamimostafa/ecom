const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numViews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isLiked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isDisliked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: 'Admin'
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (blog) => {
      if (blog.title && !blog.slug) {
        blog.slug = blog.title.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
    }
  }
});

module.exports = Blog;