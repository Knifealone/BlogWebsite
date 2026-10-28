const { QueryTypes } = require("sequelize");
const sequelize = require("../db");


const createOrganization = async (req, res) =>  {
  try {
    const { name, phone_no, email, payment_type, payment_amount } = req.body;
    if (!name || !phone_no || !email) {
      return res.status(400).json({ message: "name, phone number, and email are required" });
    }

    // Generate ID: ORG + YYYYMMDD + 3-digit number
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");

const prefix = `ORG${yyyy}${mm}${dd}`;

const lastOrganization = await sequelize.query(
  `SELECT id FROM organizations
   WHERE id LIKE :prefix    
   ORDER BY id DESC
   LIMIT 1`,
  {
    replacements: { prefix },
    type: QueryTypes.SELECT
  }
);
const nextNumber = lastOrganization.length
  ? Number(lastOrganization[0].id.slice(prefix.length)) + 1
  : 1;
  const id = `${prefix}${String(nextNumber).padStart(3, "0")}`;

    const organization = await sequelize.query(
      `INSERT INTO "Organizations"
       (id, name, phone_no, email, payment_type, payment_amount)
       VALUES (:id, :name, :phone_no, :email, :payment_type, :payment_amount)
       RETURNING *`,
      {
        replacements: {
          id,
          name,
          phone_no,
          email,
          payment_type,
          payment_amount,
        },
        type: QueryTypes.INSERT,
      }
    );
    res.status(201).json({ message: "Organization created successfully", organization });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createOrganization,
};