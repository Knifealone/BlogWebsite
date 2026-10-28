const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Comment = sequelize.define(
  'Comment',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    postId: { type: DataTypes.UUID, allowNull: false },
    author: { type: DataTypes.STRING(60), allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: 'Comments', updatedAt: false, indexes: [{ fields: ['postId'] }] },
);

module.exports = Comment;
