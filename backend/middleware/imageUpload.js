const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const multer = require('multer');
const { IMAGE_TYPES } = require('../config/constants');
const { env } = require('../config/env');
const { HttpError } = require('../utils/httpError');

fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, env.UPLOAD_DIR),
  // Random name, extension taken from the MIME type: nothing typed by the
  // visitor ends up in the file path.
  filename: (req, file, cb) => cb(null, `${randomUUID()}${IMAGE_TYPES[file.mimetype]}`),
});

/** Admin uploads (field name "files"). Your existing middleware/upload.js is left as it is. */
const imageUpload = multer({
  storage,
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (IMAGE_TYPES[file.mimetype]) return cb(null, true);
    return cb(new HttpError(415, 'Only JPG, PNG, WebP or AVIF images are allowed'));
  },
}).array('files', 10);

module.exports = { imageUpload };
