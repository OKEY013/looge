const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const GroupRecord = sequelize.define('group_record', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  group_id: { type: DataTypes.INTEGER },
  user_id: { type: DataTypes.INTEGER },
  is_winner: { type: DataTypes.BOOLEAN, defaultValue: false },
  amount: { type: DataTypes.DECIMAL(12,2) },
  ad_fee: { type: DataTypes.DECIMAL(12,2) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'group_record'
});

module.exports = GroupRecord;
