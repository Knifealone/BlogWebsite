const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organization = sequelize.define(
"Organization",
{
id: {
type: DataTypes.STRING(20),
primaryKey: true,
allowNull: false,
},
name: {
type: DataTypes.STRING,
allowNull: false,
},
phone_no: {
type: DataTypes.STRING,
allowNull: false,
},
email: {
type: DataTypes.STRING,
allowNull: false,
},
payment_type : {
type: DataTypes.STRING,
allowNull: false,
},  
payment_amount: {
type: DataTypes.FLOAT,
allowNull: false,  
}

},
{
timestamps: false,
}
);

module.exports = Organization
