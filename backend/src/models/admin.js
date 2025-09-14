const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Admin = sequelize.define('admin', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  account: { type: DataTypes.STRING(32), allowNull: false },
  password: { type: DataTypes.STRING(64), allowNull: false },
  nickname: { type: DataTypes.STRING(32) },
  level: { type: DataTypes.TINYINT, defaultValue: 2 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'admin'
});

module.exports = Admin;
