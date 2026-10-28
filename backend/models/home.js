const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Home = sequelize.define(
"Home",
{
id: {
type: DataTypes.STRING(20),
primaryKey: true,
allowNull: false,
},


title: {
  type: DataTypes.STRING,
  allowNull: false,
},

description: {
  type: DataTypes.TEXT,
  allowNull: false,
},

image_url: {
  type: DataTypes.TEXT,
  allowNull: false,
},

subtitle: {
  type: DataTypes.TEXT,
  allowNull: false,
},

},
{
timestamps: false,
}
);

module.exports = Home;
