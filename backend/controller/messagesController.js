const Message = require('../models/message');
const { asyncHandler } = require('../utils/asyncHandler');
const { notFound } = require('../utils/httpError');
const { findById } = require('../utils/findById');

// ---- Public ---------------------------------------------------------------

const create = asyncHandler(async (req, res) => {
  const { name, email, message, website } = req.valid.body;

  // Bots fill in the hidden field. Pretend it worked, but store nothing.
  if (website) return res.status(201).json({ ok: true });

  await Message.create({ name, email, message, read: false });
  return res.status(201).json({ ok: true });
});

// ---- Admin ----------------------------------------------------------------

const list = asyncHandler(async (req, res) => {
  const items = await Message.findAll({ order: [['createdAt', 'DESC']] });
  res.json({ items });
});

const setRead = asyncHandler(async (req, res) => {
  const item = await findById(Message, req.params.id);
  if (!item) throw notFound('Message not found');
  await item.update({ read: req.valid.body.read });
  res.json({ item });
});

const remove = asyncHandler(async (req, res) => {
  const item = await findById(Message, req.params.id);
  if (!item) throw notFound('Message not found');
  await item.destroy();
  res.status(204).end();
});

module.exports = { create, list, setRead, remove };
