import { ApiError } from './http.js';

/**
 * The home hero slides come from the existing backend (GET /homes).
 * Set VITE_HOME_API_URL in client/.env, e.g. http://localhost:5000/api
 * Leave it empty to use the built-in slides.
 */
const BASE = (import.meta.env.VITE_HOME_API_URL ?? '').replace(/\/$/, '');

export const homeApiEnabled = BASE !== '';

/** Uploaded images are served by that backend, so prefix its origin. */
function imageUrl(path) {
  if (!path || /^https?:\/\//.test(path)) return path ?? '';
  let origin = '';
  try {
    origin = new URL(BASE, window.location.origin).origin;
  } catch {
    origin = '';
  }
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const homeService = {
  /** Returns [{ id, image, title, subtitle, description }] */
  async list({ signal } = {}) {
    let response;
    try {
      // Public data, so no cookies are sent. This also avoids strict CORS rules.
      response = await fetch(`${BASE}/homes`, { signal, credentials: 'omit' });
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new ApiError(0, 'Cannot reach the server.');
    }
    if (!response.ok) throw new ApiError(response.status, 'Could not load the slides.');
    const rows = await response.json();
    return (Array.isArray(rows) ? rows : []).map((row) => ({
      id: row.id,
      image: imageUrl(row.image_url),
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
    }));
  },
};
