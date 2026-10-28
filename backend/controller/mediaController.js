const fs = require('node:fs/promises');
const path = require('node:path');
const { IMAGE_TYPES } = require('../config/constants');
const { env } = require('../config/env');
const Media = require('../models/media');
const Post = require('../models/post');
const { asyncHandler } = require('../utils/asyncHandler');
const { badRequest, conflict, notFound } = require('../utils/httpError');
const { detectImageType } = require('../utils/fileSignature');
const { findById } = require('../utils/findById');

const removeFile = (filename) =>
  fs.unlink(path.join(env.UPLOAD_DIR, path.basename(filename))).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });

/** Posts that show an image as their cover or inside their text. */
function usageIn(item, posts) {
  return posts
    .filter((post) => post.coverImage === item.url || post.content.includes(item.url))
    .map((post) => ({ id: post.id, title: post.title }));
}

const loadPosts = () => Post.findAll({ attributes: ['id', 'title', 'coverImage', 'content'], raw: true });

/** Reads the first bytes of the saved file and checks they really are an image. */
async function hasValidImageSignature(file) {
  const handle = await fs.open(file.path, 'r');
  try {
    const buffer = Buffer.alloc(16);
    await handle.read(buffer, 0, 16, 0);
    const detected = detectImageType(buffer);
    return detected !== null && detected === file.mimetype;
  } finally {
    await handle.close();
  }
}

const list = asyncHandler(async (req, res) => {
  const [items, posts] = await Promise.all([Media.findAll({ order: [['createdAt', 'DESC']] }), loadPosts()]);
  res.json({ items: items.map((item) => ({ ...item.toJSON(), usedIn: usageIn(item, posts) })) });
});

const upload = asyncHandler(async (req, res) => {
  const files = req.files ?? [];
  if (files.length === 0) throw badRequest('Choose at least one image to upload');

  const saved = [];
  const rejected = [];

  for (const file of files) {
    if (!IMAGE_TYPES[file.mimetype] || !(await hasValidImageSignature(file))) {
      await removeFile(file.filename);
      rejected.push(file.originalname);
      continue;
    }
    const record = await Media.create({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      originalName: path.basename(file.originalname).slice(0, 120),
      mimeType: file.mimetype,
      size: file.size,
      alt: '',
    });
    saved.push({ ...record.toJSON(), usedIn: [] });
  }

  if (saved.length === 0) {
    throw badRequest('None of those files are valid images', { files: rejected.join(', ') });
  }
  res.status(201).json({ items: saved, rejected });
});

const updateAlt = asyncHandler(async (req, res) => {
  const item = await findById(Media, req.params.id);
  if (!item) throw notFound('File not found');
  await item.update({ alt: req.valid.body.alt });
  res.json({ item: { ...item.toJSON(), usedIn: usageIn(item, await loadPosts()) } });
});

const remove = asyncHandler(async (req, res) => {
  const item = await findById(Media, req.params.id);
  if (!item) throw notFound('File not found');

  const usedIn = usageIn(item, await loadPosts());
  if (usedIn.length > 0 && req.query.force !== 'true') {
    throw conflict(`This image is used by: ${usedIn.map((post) => post.title).join(', ')}`);
  }

  await item.destroy();
  await removeFile(item.filename);
  res.status(204).end();
});

module.exports = { list, upload, updateAlt, remove };
