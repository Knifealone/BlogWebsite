const express = require("express");
const router = express.Router();

const { createOrganization } = require("../controller/oraganizationController");

// POST route to create a new organization
router.post("/create-organization", createOrganization);

module.exports = router;