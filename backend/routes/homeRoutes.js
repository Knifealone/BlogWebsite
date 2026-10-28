const express = require('express');
const router = express.Router();

const { createHome, getAllHomes, getHomeById } = require('../controller/homeController');
const upload = require('../middleware/upload');
const { requireAuth } = require('../middleware/auth');

// Only a signed-in admin may create slides. Reading them stays public.
router.post('/create-home', requireAuth, upload.single('image'), createHome);

router.get('/homes', getAllHomes);
router.get('/homes/:id', getHomeById);

module.exports = router;
