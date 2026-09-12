/**
 * Dashboard API client.
 *
 * The token is kept in localStorage and sent as a Bearer header. Since the API
 * gained a write surface (2026-09-13), the token can change bot state — treat
 * it as a password:
 *   - it can be rotated at any time via DASHBOARD_TOKEN on the server, which
 *     invalidates every browser at once;
 *   - localStorage is readable by any script on this site, so an XSS here is
 *     equivalent to full control of the bot API. Never render untrusted HTML
 *     into the dashboard.
 *
 * The music-control endpoints additionally take a Discord user id that the
 * SERVER checks against the bot's current voice channel. That id is a safety
 * guard (buttons stop working when you leave the channel), not a credential.
 */

const TOKEN_KEY = 'pinplay_dashboard_token';
const USER_KEY = 'pinplay_discord_id';

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

export function getDiscordId() {
  try {
    return localStorage.getItem(USER_KEY) || '';
  } catch {
    return '';
  }
}

export function setDiscordId(v) {
  try {
    if (v) localStorage.setItem(USER_KEY, v);
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

/** Thrown for expected failures so the UI can show a clean message. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { token, signal, method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token ?? getToken()}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (res.status === 401) throw new ApiError('Token salah atau sudah kedaluwarsa.', 401);
  if (res.status === 429) throw new ApiError('Terlalu banyak permintaan. Tunggu sebentar.', 429);
  if (!res.ok) {
    // Surface the server's own reason (403 voice guard, 400 validation, 409 no
    // track) — those are the messages the user can act on.
    let serverMsg = '';
    try {
      serverMsg = (await res.json())?.error || '';
    } catch {
      /* non-JSON error page */
    }
    throw new ApiError(serverMsg || `Server membalas ${res.status}.`, res.status);
  }

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

// --- Live players (now playing / controls) ---

export const getPlayersFor = (userId, opts) =>
  request(`/players${userId ? `?user=${encodeURIComponent(userId)}` : ''}`, opts);

export const playerAction = (guildId, action, { userId, value } = {}, opts = {}) =>
  request(`/players/${guildId}/action`, {
    ...opts,
    method: 'POST',
    body: { userId, action, value },
  });

// --- AI users table actions ---

export const resetUserQuota = (userId, opts) =>
  request(`/ai/users/${userId}/reset`, { ...opts, method: 'POST', body: {} });

export const resetAllQuotas = (opts) =>
  request('/ai/users/reset-all', { ...opts, method: 'POST', body: {} });

export const setUserLimit = (userId, value, opts) =>
  request(`/ai/users/${userId}/limit`, { ...opts, method: 'PUT', body: { value } });

export const removeUserLimit = (userId, opts) =>
  request(`/ai/users/${userId}/limit`, { ...opts, method: 'DELETE' });

export const setUserBonus = (userId, value, opts) =>
  request(`/ai/users/${userId}/bonus`, { ...opts, method: 'PUT', body: { value } });

export const addUserBonus = (userId, delta, opts) =>
  request(`/ai/users/${userId}/bonus`, { ...opts, method: 'POST', body: { delta } });

export const removeUserBonus = (userId, opts) =>
  request(`/ai/users/${userId}/bonus`, { ...opts, method: 'DELETE' });

export const addWhitelist = (userId, opts) =>
  request(`/ai/whitelist/${userId}`, { ...opts, method: 'PUT' });

export const removeWhitelist = (userId, opts) =>
  request(`/ai/whitelist/${userId}`, { ...opts, method: 'DELETE' });

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
