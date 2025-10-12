const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  stripePaymentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  stripeTransactionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'usd'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'succeeded', 'failed'),
    defaultValue: 'pending'
  },
  paidAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  metadata: {
    type: DataTypes.JSON
  }
}, {
  timestamps: true
});

module.exports = Payment;
