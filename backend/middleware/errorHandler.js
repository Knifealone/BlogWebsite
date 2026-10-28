const multer = require('multer');
const { env } = require('../config/env');
const { HttpError } = require('../utils/httpError');

function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Not found' });
}

// Express recognises error middleware by its four arguments.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, fields: err.fields });
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `Images must be smaller than ${env.MAX_UPLOAD_MB} MB`
        : err.code === 'LIMIT_FILE_COUNT'
          ? 'You can upload up to 10 images at a time'
          : 'Upload failed';
    return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ message });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request body is too large' });
  }

  console.error(err);
  return res.status(500).json({ message: env.isProd ? 'Something went wrong' : err.message });
}

module.exports = { notFoundHandler, errorHandler };
