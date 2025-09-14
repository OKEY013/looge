const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Team = sequelize.define('team', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(32) },
  leader_id: { type: DataTypes.INTEGER },
  level: { type: DataTypes.STRING(8) },
  bonus_rate: { type: DataTypes.DECIMAL(5,2) },
  rebate_level1: { type: DataTypes.DECIMAL(5,2), defaultValue: 0.5 },
  rebate_level2: { type: DataTypes.DECIMAL(5,2), defaultValue: 1.0 },
  rebate_level3: { type: DataTypes.DECIMAL(5,2), defaultValue: 2.0 },
  member_count: { type: DataTypes.INTEGER },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false,
  tableName: 'team'
});

module.exports = Team;
