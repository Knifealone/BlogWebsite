const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING(254), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false, defaultValue: '' },
    role: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'admin' },
  },
  { tableName: 'Users' },
);

module.exports = User;
