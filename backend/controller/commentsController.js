const Comment = require('../models/comment');
const Post = require('../models/post');
const { asyncHandler } = require('../utils/asyncHandler');
const { notFound } = require('../utils/httpError');
const { findById, UUID } = require('../utils/findById');

async function findPublishedPost(slug) {
  const post = await Post.findOne({ where: { slug, status: 'published' }, attributes: ['id'] });
  if (!post) throw notFound('Post not found');
  return post;
}

const toPublicComment = ({ id, author, text, createdAt }) => ({ id, author, text, createdAt });

// ---- Public ---------------------------------------------------------------

const listForPost = asyncHandler(async (req, res) => {
  const post = await findPublishedPost(req.params.slug);
  const rows = await Comment.findAll({ where: { postId: post.id }, order: [['createdAt', 'ASC']] });
  res.json({ items: rows.map(toPublicComment) });
});

const createForPost = asyncHandler(async (req, res) => {
  const post = await findPublishedPost(req.params.slug);
  const { author, text } = req.valid.body;
  const comment = await Comment.create({ postId: post.id, author, text });
  res.status(201).json({ comment: toPublicComment(comment) });
});

// ---- Admin ----------------------------------------------------------------

const listAdmin = asyncHandler(async (req, res) => {
  const { postId } = req.query;
  const where = {};
  if (postId) {
    if (!UUID.test(String(postId))) return res.json({ items: [] });
    where.postId = postId;
  }
  const items = await Comment.findAll({ where, order: [['createdAt', 'DESC']] });
  return res.json({ items });
});

const removeAdmin = asyncHandler(async (req, res) => {
  const comment = await findById(Comment, req.params.id);
  if (!comment) throw notFound('Comment not found');
  await comment.destroy();
  res.status(204).end();
});

module.exports = { listForPost, createForPost, listAdmin, removeAdmin };
