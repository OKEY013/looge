const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  account: { type: DataTypes.STRING(32), allowNull: false },
  password: { type: DataTypes.STRING(64), allowNull: false },
  nickname: { type: DataTypes.STRING(32) },
  invite_code: { type: DataTypes.STRING(6), allowNull: false },
  inviter_id: { type: DataTypes.INTEGER },
  team_id: { type: DataTypes.INTEGER },
  balance: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
  is_vip: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'user'
});

module.exports = User;
