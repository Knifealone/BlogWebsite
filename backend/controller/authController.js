const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { COOKIE_NAME } = require('../config/constants');
const { env } = require('../config/env');
const User = require('../models/user');
const { asyncHandler } = require('../utils/asyncHandler');
const { HttpError } = require('../utils/httpError');

// Compared against when the email is unknown, so a wrong email and a wrong
// password take the same time and cannot be told apart.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

const cookieOptions = {
  httpOnly: true, // JavaScript on the page can never read the token
  sameSite: 'lax',
  secure: env.isProd,
  path: '/',
};

const toPublicUser = (user) => ({ id: user.id, email: user.email, name: user.name, role: user.role });

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.valid.body;

  const user = await User.findOne({ where: { email } });
  const matches = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);

  if (!user || !matches) {
    console.warn(`Failed admin sign-in for ${email} from ${req.ip}`);
    throw new HttpError(401, 'Invalid email or password');
  }

  const token = jwt.sign({ role: user.role }, env.JWT_SECRET, {
    algorithm: 'HS256',
    subject: user.id,
    expiresIn: `${env.SESSION_DAYS}d`,
  });

  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: env.SESSION_DAYS * 24 * 60 * 60 * 1000 });
  res.json({ user: toPublicUser(user) });
});

const me = (req, res) => {
  res.json({ user: toPublicUser(req.user) });
};

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(204).end();
};

module.exports = { login, me, logout };
