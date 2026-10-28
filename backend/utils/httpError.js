/** An error that carries an HTTP status and a message that is safe to show to clients. */
class HttpError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.fields = fields;
  }
}

const badRequest = (message, fields) => new HttpError(400, message, fields);
const unauthorized = (message = 'Authentication required') => new HttpError(401, message);
const notFound = (message = 'Not found') => new HttpError(404, message);
const conflict = (message) => new HttpError(409, message);

module.exports = { HttpError, badRequest, unauthorized, notFound, conflict };
