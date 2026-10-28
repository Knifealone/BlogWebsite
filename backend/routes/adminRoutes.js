const express = require('express');
const analytics = require('../controller/analyticsController');
const comments = require('../controller/commentsController');
const media = require('../controller/mediaController');
const messages = require('../controller/messagesController');
const posts = require('../controller/postsController');
const { requireAuth } = require('../middleware/auth');
const { imageUpload } = require('../middleware/imageUpload');
const { validate } = require('../middleware/validate');
const {
  adminPostsQuery,
  exportQuery,
  logsQuery,
  mediaUpdateSchema,
  messageUpdateSchema,
  postSchema,
  statsQuery,
} = require('../validators/schemas');

const router = express.Router();

// Every route below needs a signed-in admin.
router.use(requireAuth);

router.get('/overview', analytics.overview);

// Content
router.get('/posts', validate(adminPostsQuery, 'query'), posts.listAll);
router.post('/posts', validate(postSchema), posts.create);
router.get('/posts/:id', posts.getById);
router.put('/posts/:id', validate(postSchema), posts.update);
router.delete('/posts/:id', posts.remove);

// Comments
router.get('/comments', comments.listAdmin);
router.delete('/comments/:id', comments.removeAdmin);

// Media
router.get('/media', media.list);
router.post('/media', imageUpload, media.upload);
router.patch('/media/:id', validate(mediaUpdateSchema), media.updateAlt);
router.delete('/media/:id', media.remove);

// Visitors
router.get('/stats', validate(statsQuery, 'query'), analytics.stats);
router.get('/logs', validate(logsQuery, 'query'), analytics.logs);
router.get('/logs/export.csv', validate(exportQuery, 'query'), analytics.exportCsv);

// Contact messages
router.get('/messages', messages.list);
router.patch('/messages/:id', validate(messageUpdateSchema), messages.setRead);
router.delete('/messages/:id', messages.remove);

module.exports = router;
