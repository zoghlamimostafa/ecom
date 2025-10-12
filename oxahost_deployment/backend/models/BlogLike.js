const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const BlogLike = sequelize.define('BlogLike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Blogs',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  isLike: {
    type: DataTypes.BOOLEAN,
    allowNull: false // true for like, false for dislike
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['blogId', 'userId']
    }
  ]
});

module.exports = BlogLike;