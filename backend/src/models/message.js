const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Message = sequelize.define('message', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER },
  title: { type: DataTypes.STRING(64) },
  content: { type: DataTypes.TEXT },
  type: { type: DataTypes.STRING(16), defaultValue: 'marquee' }, // 公告类型
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'message'
});

module.exports = Message;
