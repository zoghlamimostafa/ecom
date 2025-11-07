const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    },
    set(value) {
      this.setDataValue('name', value.toUpperCase());
    }
  },
  expiry: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  applicableProducts: {
    type: DataTypes.JSON,
    defaultValue: null,
    comment: 'Liste des IDs de produits sur lesquels le coupon est applicable. Si null, le coupon est global.'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = Coupon;