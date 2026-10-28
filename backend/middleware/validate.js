const { badRequest } = require('../utils/httpError');

/**
 * Validates req[source] with a zod schema. The cleaned result is placed on
 * req.valid[source]; handlers should read that, never the raw request.
 */
const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || source;
        if (!fields[key]) fields[key] = issue.message;
      }
      return next(badRequest('Please check the highlighted fields', fields));
    }
    req.valid = { ...req.valid, [source]: result.data };
    return next();
  };

module.exports = { validate };
