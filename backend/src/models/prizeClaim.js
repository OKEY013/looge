const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const PrizeClaim = sequelize.define('PrizeClaim', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  group_record_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  prize_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  claim_type: {
    type: DataTypes.ENUM('shipping', 'recycle'),
    allowNull: false
  },
  recycle_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  shipping_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'pending'
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
  tableName: 'prize_claim',
  timestamps: false
});

module.exports = PrizeClaim;