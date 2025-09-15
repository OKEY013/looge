const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const VipDividend = sequelize.define('VipDividend', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  period: {
    type: DataTypes.STRING(16),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  total_profit: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  vip_count: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid'),
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'vip_dividend',
  timestamps: false
});

module.exports = VipDividend;