const rateLimit = require('express-rate-limit');

const limiter = ({ windowMs, limit, message, ...rest }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
    ...rest,
  });

/** 10 failed sign-ins per 15 minutes per IP. Successful sign-ins do not count. */
const loginLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: 'Too many sign-in attempts. Try again in a few minutes.',
});

const commentLimiter = limiter({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  message: 'You are commenting too quickly. Please wait a few minutes.',
});

const contactLimiter = limiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: 'Too many messages. Please try again later.',
});

const trackLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 120,
  message: 'Too many requests',
});

module.exports = { loginLimiter, commentLimiter, contactLimiter, trackLimiter };
