const path = require('node:path');

const ROOT = path.join(__dirname, '..');
// Load .env here too, so this file works no matter which file is required first.
require('dotenv').config({ path: path.join(ROOT, '.env'), quiet: true });

const positive = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const JWT_SECRET = process.env.JWT_SECRET || '';
if (JWT_SECRET.length < 32) {
  console.error(
    '\nJWT_SECRET is missing or too short. Add a line like this to backend/.env:\n' +
      '  JWT_SECRET=<at least 32 random characters>\n' +
      'Generate one with:\n' +
      '  node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"\n',
  );
  process.exit(1);
}

const trustProxyRaw = process.env.TRUST_PROXY ?? '';
const trustProxy = /^\d+$/.test(trustProxyRaw)
  ? Number(trustProxyRaw)
  : trustProxyRaw === 'true';

const env = {
  ROOT,
  isProd: process.env.NODE_ENV === 'production',
  PORT: positive(process.env.PORT, 5000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  JWT_SECRET,
  SESSION_DAYS: positive(process.env.SESSION_DAYS, 7),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
  // Same folder your existing middleware/upload.js writes to.
  UPLOAD_DIR: path.join(ROOT, 'uploads'),
  MAX_UPLOAD_MB: positive(process.env.MAX_UPLOAD_MB, 15),
  TIMEZONE: process.env.TIMEZONE || 'Asia/Kolkata',
  LOG_RETENTION_DAYS: positive(process.env.LOG_RETENTION_DAYS, 90),
  TRUST_PROXY: trustProxy,
};

module.exports = { env };
