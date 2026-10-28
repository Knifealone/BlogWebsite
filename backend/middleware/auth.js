const jwt = require('jsonwebtoken');
const { COOKIE_NAME } = require('../config/constants');
const { env } = require('../config/env');
const User = require('../models/user');
const { asyncHandler } = require('../utils/asyncHandler');
const { unauthorized } = require('../utils/httpError');
const { findById } = require('../utils/findById');

/** Blocks the request unless it carries a valid admin session cookie. */
const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) throw unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    throw unauthorized('Your session has expired. Please sign in again.');
  }

  // Look the user up every time so removing an account ends its sessions.
  const user = await findById(User, payload.sub);
  if (!user) throw unauthorized('Account no longer exists');

  req.user = user;
  next();
});

module.exports = { requireAuth };
