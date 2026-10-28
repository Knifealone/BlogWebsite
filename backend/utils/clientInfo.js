const net = require('node:net');

const BOT_PATTERN =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|curl|wget|python-requests|httpclient/i;

function getClientIp(req) {
  return req.ip || req.socket?.remoteAddress || '';
}

/**
 * Hides the part of an IP address that identifies a household or device,
 * so the log is useful for trends without storing personal data.
 */
function maskIp(ip) {
  if (!ip) return 'unknown';
  const clean = ip.startsWith('::ffff:') ? ip.slice(7) : ip;
  const version = net.isIP(clean);
  if (version === 4) {
    const [a, b] = clean.split('.');
    return `${a}.${b}.xxx.xxx`;
  }
  if (version === 6) {
    const groups = clean.split(':').filter(Boolean).slice(0, 2);
    return `${groups.join(':')}::xxxx`;
  }
  return 'unknown';
}

function parseUserAgent(userAgent = '') {
  const ua = String(userAgent);

  let device = 'Desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) device = 'Tablet';
  else if (/mobi|iphone|ipod|android/i.test(ua)) device = 'Mobile';

  let browser = 'Other';
  if (/instagram/i.test(ua)) browser = 'Instagram';
  else if (/fban|fbav/i.test(ua)) browser = 'Facebook';
  else if (/edg(e|a|ios)?\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';

  let os = 'Other';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { device, browser, os, isBot: !ua || BOT_PATTERN.test(ua) };
}

module.exports = { getClientIp, maskIp, parseUserAgent };
