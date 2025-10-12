const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Enquiry = sequelize.define('Enquiry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Submitted', 'Contacted', 'In Progress', 'Resolved'),
    defaultValue: 'Submitted'
  }
}, {
  timestamps: true
});

module.exports = Enquiry;