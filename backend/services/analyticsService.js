const { createHmac } = require('node:crypto');
const { Op } = require('sequelize');
const { env } = require('../config/env');
const Visit = require('../models/visit');
const { getClientIp, maskIp, parseUserAgent } = require('../utils/clientInfo');

const DAY_MS = 24 * 60 * 60 * 1000;
const ONLINE_WINDOW_MS = 5 * 60 * 1000;
const EXPORT_LIMIT = 50000;

function createDayFormatter(timeZone) {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch {
    console.warn(`Unknown TIMEZONE "${timeZone}", falling back to UTC`);
    return createDayFormatter('UTC');
  }
}
const dayFormatter = createDayFormatter(env.TIMEZONE);

/** "2026-10-24" in the configured time zone. */
const dayKey = (ms) => dayFormatter.format(ms);

function describeReferrer(req, referrer, internal) {
  if (internal) return 'Internal';
  if (!referrer) return 'Direct';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    const ownHost = (req.hostname || '').replace(/^www\./, '');
    const clientHost = new URL(env.CLIENT_ORIGIN).hostname;
    return host === ownHost || host === clientHost ? 'Internal' : host.slice(0, 250);
  } catch {
    return 'Direct';
  }
}

/** Country comes from the CDN header when the site sits behind Cloudflare or Vercel. */
function readCountry(req) {
  const code = req.get('cf-ipcountry') || req.get('x-vercel-ip-country') || '';
  return /^[A-Za-z]{2}$/.test(code) ? code.toUpperCase() : 'Unknown';
}

/** Stores one page view. Returns false when it was ignored (bots, admin pages). */
async function recordVisit(req, { path, referrer, internal }) {
  const cleanPath = path.split('?')[0].split('#')[0];
  if (cleanPath.startsWith('/admin')) return false;

  const userAgent = req.get('user-agent') || '';
  const agent = parseUserAgent(userAgent);
  if (agent.isBot) return false;

  const ip = getClientIp(req);
  const now = Date.now();

  // A one-way hash that changes every day: enough to count unique visitors per
  // day, not enough to follow a person around or recover their address.
  const visitorId = createHmac('sha256', env.JWT_SECRET)
    .update(`${ip}|${userAgent}|${dayKey(now)}`)
    .digest('hex')
    .slice(0, 16);

  await Visit.create({
    ts: new Date(now),
    visitorId,
    ip: maskIp(ip),
    path: cleanPath,
    referrer: describeReferrer(req, referrer, internal),
    device: agent.device,
    browser: agent.browser,
    os: agent.os,
    country: readCountry(req),
  });
  return true;
}

const toRow = (visit) => ({ ...visit, ts: new Date(visit.ts).toISOString() });

function groupByDay(visits) {
  const byDay = new Map();
  for (const visit of visits) {
    const key = dayKey(Date.parse(visit.ts));
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(visit);
  }
  return byDay;
}

function summarise(keys, byDay) {
  let visitors = 0;
  let pageViews = 0;
  const daily = keys.map((date) => {
    const list = byDay.get(date) ?? [];
    const uniques = new Set(list.map((visit) => visit.visitorId)).size;
    visitors += uniques;
    pageViews += list.length;
    return { date, visitors: uniques, pageViews: list.length };
  });
  return { daily, visitors, pageViews };
}

function share(counts, total, limit) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count, percent: total ? Math.round((count / total) * 100) : 0 }));
}

const changePercent = (current, previous) =>
  previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

async function getStats(days) {
  const now = Date.now();
  const keys = Array.from({ length: days }, (_, i) => dayKey(now - (days - 1 - i) * DAY_MS));
  const previousKeys = Array.from({ length: days }, (_, i) => dayKey(now - (2 * days - 1 - i) * DAY_MS));

  const rows = await Visit.findAll({
    where: { ts: { [Op.gte]: new Date(now - (2 * days + 1) * DAY_MS) } },
    attributes: ['ts', 'visitorId', 'path', 'device'],
    raw: true,
  });
  const visits = rows.map(toRow);

  const byDay = groupByDay(visits);
  const current = summarise(keys, byDay);
  const previous = summarise(previousKeys, byDay);

  const currentVisits = keys.flatMap((key) => byDay.get(key) ?? []);
  const pathCounts = new Map();
  const deviceCounts = new Map();
  for (const visit of currentVisits) {
    pathCounts.set(visit.path, (pathCounts.get(visit.path) ?? 0) + 1);
    deviceCounts.set(visit.device, (deviceCounts.get(visit.device) ?? 0) + 1);
  }

  const online = new Set(
    visits.filter((visit) => Date.parse(visit.ts) >= now - ONLINE_WINDOW_MS).map((visit) => visit.visitorId),
  );

  return {
    days,
    totals: {
      visitors: current.visitors,
      pageViews: current.pageViews,
      pagesPerVisit: current.visitors ? Math.round((current.pageViews / current.visitors) * 10) / 10 : 0,
      onlineNow: online.size,
    },
    change: {
      visitors: changePercent(current.visitors, previous.visitors),
      pageViews: changePercent(current.pageViews, previous.pageViews),
    },
    daily: current.daily,
    topPages: share(pathCounts, currentVisits.length, 5).map(({ name, ...rest }) => ({ path: name, ...rest })),
    devices: share(deviceCounts, currentVisits.length, 3),
  };
}

function buildWhere({ days, q, device }) {
  const where = { ts: { [Op.gte]: new Date(Date.now() - days * DAY_MS) } };
  if (device) where.device = device;
  const needle = (q ?? '').trim();
  if (needle) {
    // Escape LIKE wildcards so searching for "%" or "_" matches literally.
    const like = `%${needle.replace(/[\\%_]/g, '\\$&')}%`;
    where[Op.or] = ['path', 'ip', 'country', 'referrer', 'browser', 'os'].map((column) => ({
      [column]: { [Op.iLike]: like },
    }));
  }
  return where;
}

async function queryLogs({ page, limit, days, q, device }) {
  const where = buildWhere({ days, q, device });
  const total = await Visit.count({ where });
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const rows = await Visit.findAll({
    where,
    order: [['ts', 'DESC']],
    limit,
    offset: (safePage - 1) * limit,
    raw: true,
  });
  return { items: rows.map(toRow), total, page: safePage, pages, limit };
}

async function exportLogs(days) {
  const rows = await Visit.findAll({
    where: buildWhere({ days }),
    order: [['ts', 'DESC']],
    limit: EXPORT_LIMIT,
    raw: true,
  });
  return rows.map(toRow);
}

async function latestVisits(count) {
  const rows = await Visit.findAll({ order: [['ts', 'DESC']], limit: count, raw: true });
  return rows.map(toRow);
}

/** Deletes visits older than LOG_RETENTION_DAYS. */
async function pruneVisits() {
  const cutoff = new Date(Date.now() - env.LOG_RETENTION_DAYS * DAY_MS);
  return Visit.destroy({ where: { ts: { [Op.lt]: cutoff } } });
}

module.exports = { recordVisit, getStats, queryLogs, exportLogs, latestVisits, pruneVisits };
