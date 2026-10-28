const COOKIE_NAME = 'sl_token';

const POST_TYPES = ['story', 'portfolio', 'preset'];
const POST_STATUSES = ['draft', 'published'];
const PORTFOLIO_CATEGORIES = ['Landscapes', 'Portraits', 'Street'];

/** Allowed upload MIME types and the extension we store them with. */
const IMAGE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
};

const DEVICES = ['Mobile', 'Desktop', 'Tablet'];

module.exports = { COOKIE_NAME, POST_TYPES, POST_STATUSES, PORTFOLIO_CATEGORIES, IMAGE_TYPES, DEVICES };
