const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const CommissionRecord = sequelize.define('CommissionRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  from_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 3
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  commission_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  source_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  source_type: {
    type: DataTypes.ENUM('group_purchase', 'recharge'),
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
  tableName: 'commission_record',
  timestamps: false
});

module.exports = CommissionRecord;