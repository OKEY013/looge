const { Sequelize } = require('sequelize');

// 强制SQLite配置
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db',
  logging: false,
});

module.exports = { sequelize };
