const Comment = require('../models/comment');
const Post = require('../models/post');
const { asyncHandler } = require('../utils/asyncHandler');
const { notFound } = require('../utils/httpError');
const { findById } = require('../utils/findById');
const { estimateReadTime, slugify } = require('../utils/slugify');

/** Applies the rules that depend on the post type. */
function prepare(input, existing) {
  const post = { ...input };

  if (post.type !== 'portfolio') post.category = null;
  if (post.type !== 'preset') post.price = '';
  if (post.type === 'story') {
    if (!post.readTime) post.readTime = estimateReadTime(post.content);
  } else {
    post.readTime = '';
  }

  // Date-only values from the editor ("2026-09-20") become full timestamps.
  post.publishedAt = post.publishedAt
    ? new Date(post.publishedAt)
    : (existing?.publishedAt ?? new Date());

  return post;
}

async function makeSlug(title) {
  const base = slugify(title);
  let slug = base;
  let counter = 2;
  while (await Post.findOne({ where: { slug }, attributes: ['id'] })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

// ---- Public ---------------------------------------------------------------

const listPublished = asyncHandler(async (req, res) => {
  const { type, limit } = req.valid.query;
  const where = { status: 'published' };
  if (type) where.type = type;
  const items = await Post.findAll({ where, order: [['publishedAt', 'DESC']], limit: limit ?? undefined });
  res.json({ items });
});

const getPublishedBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ where: { slug: req.params.slug, status: 'published' } });
  if (!post) throw notFound('Post not found');
  res.json({ post });
});

// ---- Admin ----------------------------------------------------------------

const listAll = asyncHandler(async (req, res) => {
  const { type, status } = req.valid.query;
  const where = {};
  if (type) where.type = type;
  if (status) where.status = status;
  const items = await Post.findAll({ where, order: [['updatedAt', 'DESC']] });
  res.json({ items });
});

const getById = asyncHandler(async (req, res) => {
  const post = await findById(Post, req.params.id);
  if (!post) throw notFound('Post not found');
  res.json({ post });
});

const create = asyncHandler(async (req, res) => {
  const data = prepare(req.valid.body);
  const post = await Post.create({ ...data, slug: await makeSlug(data.title) });
  res.status(201).json({ post });
});

const update = asyncHandler(async (req, res) => {
  const existing = await findById(Post, req.params.id);
  if (!existing) throw notFound('Post not found');

  // The slug is kept on purpose: changing a title must not break shared links.
  await existing.update(prepare(req.valid.body, existing));
  res.json({ post: existing });
});

const remove = asyncHandler(async (req, res) => {
  const post = await findById(Post, req.params.id);
  if (!post) throw notFound('Post not found');
  await Comment.destroy({ where: { postId: post.id } });
  await post.destroy();
  res.status(204).end();
});

module.exports = { listPublished, getPublishedBySlug, listAll, getById, create, update, remove };
