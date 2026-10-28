const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Visit = sequelize.define(
  'Visit',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ts: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    visitorId: { type: DataTypes.STRING(32), allowNull: false },
    ip: { type: DataTypes.STRING(64), allowNull: false },
    path: { type: DataTypes.STRING(200), allowNull: false },
    referrer: { type: DataTypes.STRING(255), allowNull: false },
    device: { type: DataTypes.STRING(20), allowNull: false },
    browser: { type: DataTypes.STRING(30), allowNull: false },
    os: { type: DataTypes.STRING(30), allowNull: false },
    country: { type: DataTypes.STRING(20), allowNull: false },
  },
  { tableName: 'Visits', timestamps: false, indexes: [{ fields: ['ts'] }] },
);

module.exports = Visit;
