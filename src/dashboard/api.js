/**
 * Dashboard API client.
 *
 * The token is kept in localStorage and sent as a Bearer header. That is
 * acceptable here because:
 *   - the API is read-only, so a stolen token cannot change anything;
 *   - the token can be rotated at any time by changing DASHBOARD_TOKEN on the
 *     server, which invalidates every browser at once.
 *
 * It is NOT acceptable for anything with write access — do not reuse this
 * pattern if the API ever gains mutating endpoints.
 */

const TOKEN_KEY = 'pinplay_dashboard_token';

// Prefer an env var so the deployed site and local dev can point at different
// backends. Falls back to the production API.
const API_BASE =
  import.meta.env?.VITE_API_BASE || 'https://172-232-251-131.sslip.io';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function setToken(t) {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* private mode / storage disabled — session just won't persist */
  }
}

export function clearToken() {
  setToken('');
}

/** Thrown for expected failures so the UI can show a clean message. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { token, signal } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token ?? getToken()}` },
    signal,
  });

  if (res.status === 401) throw new ApiError('Token salah atau sudah kedaluwarsa.', 401);
  if (res.status === 429) throw new ApiError('Terlalu banyak permintaan. Tunggu sebentar.', 429);
  if (!res.ok) throw new ApiError(`Server membalas ${res.status}.`, res.status);

  return res.json();
}

/** Verify a candidate token without storing it. */
export async function checkToken(token) {
  await request('/status', { token });
  return true;
}

export const getSummary = (opts) => request('/summary', opts);
export const getStatus = (opts) => request('/status', opts);
export const getGuilds = (opts) => request('/guilds', opts);
export const getUsers = (opts) => request('/users', opts);
export const getAi = (opts) => request('/ai', opts);

/**
 * Log lines newer than `sinceSeq`. Returns { logs, lastSeq }.
 * Pass the previous lastSeq to fetch only new lines.
 */
export function getLogs({ limit = 200, level, sinceSeq } = {}, opts = {}) {
  const p = new URLSearchParams();
  p.set('limit', String(limit));
  if (level) p.set('level', level);
  if (sinceSeq != null) p.set('since', String(sinceSeq));
  return request(`/logs?${p}`, opts);
}

export { API_BASE };
