const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const InviteCode = sequelize.define('InviteCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(6),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  used_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'invite_code',
  timestamps: false
});

module.exports = InviteCode;