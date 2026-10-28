function slugify(text) {
  const slug = String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
  return slug || 'untitled';
}

/** Appends -2, -3 ... until `exists(slug)` returns false. */
function uniqueSlug(base, exists) {
  let slug = base;
  let counter = 2;
  while (exists(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

function estimateReadTime(text) {
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

module.exports = { slugify, uniqueSlug, estimateReadTime };
