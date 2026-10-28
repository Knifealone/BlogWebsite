const express = require('express');
const auth = require('../controller/authController');
const { requireAuth } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiters');
const { validate } = require('../middleware/validate');
const { loginSchema } = require('../validators/schemas');

const router = express.Router();

router.post('/login', loginLimiter, validate(loginSchema), auth.login);
router.post('/logout', auth.logout);
router.get('/me', requireAuth, auth.me);

module.exports = router;
