const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Post = sequelize.define(
  'Post',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    type: { type: DataTypes.STRING(20), allowNull: false }, // story | portfolio | preset
    title: { type: DataTypes.STRING(140), allowNull: false },
    excerpt: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    content: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    category: { type: DataTypes.STRING(30), allowNull: true },
    price: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
    readTime: { type: DataTypes.STRING(30), allowNull: false, defaultValue: '' },
    coverImage: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { camera: '', lens: '', settings: '' },
    },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'draft' },
    publishedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: 'Posts',
    indexes: [{ fields: ['status', 'type'] }, { fields: ['publishedAt'] }],
  },
);

module.exports = Post;
