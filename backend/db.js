// const { Pool } = require("pg");

// const pool = new Pool({
//   host: "localhost",
//   port: 5432,
//   user: "postgres",
//   password: "Postgres",
//   database: "blogdb",
// });

// pool.connect()
//   .then(() => {
//     console.log("PostgreSQL Connected");
//   })
//   .catch((err) => {
//     console.error("PostgreSQL Connection Error:", err);
//   });

// module.exports = {pool};
require('dotenv').config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("blogdb", "postgres", "Postgres", {
  host: "localhost",
  dialect: "postgres",
}); 
module.exports = sequelize;
