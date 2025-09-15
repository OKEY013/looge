const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Carousel = sequelize.define('Carousel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(64),
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  link_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'carousel',
  timestamps: false
});

module.exports = Carousel;