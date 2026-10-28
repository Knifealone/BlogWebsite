const Media = require('../models/media');
const Message = require('../models/message');
const Post = require('../models/post');
const { exportLogs, getStats, latestVisits, queryLogs, recordVisit } = require('../services/analyticsService');
const { asyncHandler } = require('../utils/asyncHandler');
const { toCsv } = require('../utils/csv');

// ---- Public ---------------------------------------------------------------

const track = asyncHandler(async (req, res) => {
  await recordVisit(req, req.valid.body);
  res.status(204).end();
});

// ---- Admin ----------------------------------------------------------------

const stats = asyncHandler(async (req, res) => {
  res.json(await getStats(req.valid.query.days));
});

const logs = asyncHandler(async (req, res) => {
  res.json(await queryLogs(req.valid.query));
});

const EXPORT_COLUMNS = [
  { key: 'ts', label: 'Time (UTC)' },
  { key: 'ip', label: 'Visitor' },
  { key: 'country', label: 'Country' },
  { key: 'path', label: 'Page' },
  { key: 'referrer', label: 'Referrer' },
  { key: 'device', label: 'Device' },
  { key: 'browser', label: 'Browser' },
  { key: 'os', label: 'System' },
];

const exportCsv = asyncHandler(async (req, res) => {
  const rows = await exportLogs(req.valid.query.days);
  const stamp = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="visitor-log-${stamp}.csv"`);
  res.send(toCsv(rows, EXPORT_COLUMNS));
});

/** Everything the dashboard needs in a single request. */
const overview = asyncHandler(async (req, res) => {
  const [published, drafts, media, unreadMessages, recentPosts, weekly, fortnight, recentVisits] = await Promise.all([
    Post.count({ where: { status: 'published' } }),
    Post.count({ where: { status: 'draft' } }),
    Media.count(),
    Message.count({ where: { read: false } }),
    Post.findAll({ order: [['updatedAt', 'DESC']], limit: 4 }),
    getStats(7),
    getStats(14),
    latestVisits(5),
  ]);

  res.json({
    counts: { published, drafts, media, unreadMessages },
    stats: weekly,
    daily: fortnight.daily,
    recentPosts,
    recentVisits,
  });
});

module.exports = { track, stats, logs, exportCsv, overview };
