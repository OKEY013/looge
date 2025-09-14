const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(64) },
  image: { type: DataTypes.STRING(128) },
  group_count: { type: DataTypes.INTEGER },
  open_time: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING(16) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'product'
});

module.exports = Product;
