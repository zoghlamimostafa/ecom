const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database-sqlite');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // Shipping Information
  shippingInfo: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      hasRequiredFields(value) {
        if (!value.firstName || !value.lastName || !value.address || !value.city || !value.state || !value.pincode) {
          throw new Error('Shipping info must include firstName, lastName, address, city, state, and pincode');
        }
      }
    }
  },
  // Payment Information
  paymentInfo: {
    type: DataTypes.JSON,
    allowNull: false
  },
  // Coupon Information (optional)
  couponApplied: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  couponDiscount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Pourcentage de réduction du coupon'
  },
  // Order Status
  orderStatus: {
    type: DataTypes.ENUM('Not Processed', 'Cash on Delivery', 'Processing', 'Dispatched', 'Cancelled', 'Delivered'),
    defaultValue: 'Not Processed'
  },
  // Total Amount
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalPriceAfterDiscount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  // Delivery Date
  paidAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = Order;