const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Group = sequelize.define('group', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(32), allowNull: false },
  product_id: { type: DataTypes.INTEGER },
  open_time: { type: DataTypes.DATE },
  group_count: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING(16) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'group'
});

module.exports = Group;
