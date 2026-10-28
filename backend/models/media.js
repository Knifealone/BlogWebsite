const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Media = sequelize.define(
  'Media',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.TEXT, allowNull: false },
    originalName: { type: DataTypes.STRING(120), allowNull: false },
    mimeType: { type: DataTypes.STRING(50), allowNull: false },
    size: { type: DataTypes.INTEGER, allowNull: false },
    alt: { type: DataTypes.STRING(300), allowNull: false, defaultValue: '' },
  },
  { tableName: 'MediaFiles', updatedAt: false },
);

module.exports = Media;
