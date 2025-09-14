const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Prize = sequelize.define('prize', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(64), allowNull: false },
  value: { type: DataTypes.DECIMAL(12,2) },
  recycle_rate: { type: DataTypes.DECIMAL(5,2) },
  product_id: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING(16) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'prize'
});

module.exports = Prize;
