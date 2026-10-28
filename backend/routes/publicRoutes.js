const express = require('express');
const analytics = require('../controller/analyticsController');
const comments = require('../controller/commentsController');
const messages = require('../controller/messagesController');
const posts = require('../controller/postsController');
const { commentLimiter, contactLimiter, trackLimiter } = require('../middleware/rateLimiters');
const { validate } = require('../middleware/validate');
const { commentSchema, contactSchema, publicPostsQuery, trackSchema } = require('../validators/schemas');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.get('/posts', validate(publicPostsQuery, 'query'), posts.listPublished);
router.get('/posts/:slug', posts.getPublishedBySlug);

router.get('/posts/:slug/comments', comments.listForPost);
router.post('/posts/:slug/comments', commentLimiter, validate(commentSchema), comments.createForPost);

router.post('/contact', contactLimiter, validate(contactSchema), messages.create);
router.post('/track', trackLimiter, validate(trackSchema), analytics.track);

module.exports = router;
