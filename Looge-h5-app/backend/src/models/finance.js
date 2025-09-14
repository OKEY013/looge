const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Finance = sequelize.define('finance', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER },
  type: { type: DataTypes.STRING(16) },
  amount: { type: DataTypes.DECIMAL(12,2) },
  status: { type: DataTypes.STRING(16) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'finance'
});

module.exports = Finance;
