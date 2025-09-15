const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Shipping = sequelize.define('Shipping', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  prize_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  recipient_name: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tracking_number: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  shipping_status: {
    type: DataTypes.ENUM('pending', 'shipped', 'delivered', 'returned'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'shipping',
  timestamps: false
});

module.exports = Shipping;