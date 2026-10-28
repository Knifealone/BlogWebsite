const { QueryTypes } = require("sequelize");
const sequelize = require("../db");



const createHome = async (req, res) => {
try {
const { title, subtitle, description } = req.body;


if (!req.file) {
  return res.status(400).json({
    error: "Image is required",
  });
}

if (!title || !subtitle || !description) {
  return res.status(400).json({
    error: "Title, subtitle and description are required",
  });
}

// Generate ID: PH + YYYYMMDD + 3-digit number
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");

const prefix = `PH${yyyy}${mm}${dd}`;

const lastHome = await sequelize.query(
  `SELECT id FROM "Homes"
   WHERE id LIKE :prefix
   ORDER BY id DESC
   LIMIT 1;`,
  {
    replacements: { prefix: `${prefix}%` },
    type: QueryTypes.SELECT,
  }
);

const nextNumber = lastHome.length
  ? Number(lastHome[0].id.slice(prefix.length)) + 1
  : 1;

const id = `${prefix}${String(nextNumber).padStart(3, "0")}`;
const image_url = `/uploads/${req.file.filename}`;

const newHome = await sequelize.query(
  `INSERT INTO "Homes"
   (id, title, image_url, subtitle, description)
   VALUES (:id, :title, :image_url, :subtitle, :description)
   RETURNING *;`,
  {
    replacements: {
      id,
      title,
      image_url,
      subtitle,
      description,
    },
    type: QueryTypes.SELECT,
  }
);

return res.status(201).json(newHome[0]);

} catch (error) {
console.error("DATABASE ERROR:", error);
return res.status(500).json({
error: error.message,
});
}
};




const getAllHomes = async (req, res) => {
  try {

    const homes = await sequelize.query(
      `SELECT * FROM "Homes" ORDER BY id DESC;`,
      {
        type: QueryTypes.SELECT
      }
    );

    return res.status(200).json(homes);

  } catch (error) {

    console.error("Error fetching homes:", error);

    return res.status(500).json({
      error: error.message
    });
  }
};

const getHomeById = async (req, res) => {
  try {
    const { id } = req.params;
    const home = await sequelize.query(
      `SELECT * FROM "Homes" WHERE id = :id;`,
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    );

    if (!home[0]) {
      return res.status(404).json({
        error: "Home not found"
      });
    }

    return res.status(200).json(home[0]);

  } catch (error) {
    console.error("Error fetching home:", error);

    return res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
  createHome,
  getAllHomes,
  getHomeById
};
