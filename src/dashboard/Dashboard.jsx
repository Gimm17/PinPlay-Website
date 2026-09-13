import { useEffect, useRef, useState, useCallback } from 'react';
import {
  getSummary,
  getLogs,
  getPlayersFor,
  playerAction,
  resetUserQuota,
  resetAllQuotas,
  setUserLimit,
  removeUserLimit,
  setUserBonus,
  addUserBonus,
  removeUserBonus,
  addWhitelist,
  removeWhitelist,
  getDiscordId,
  setDiscordId,
  clearToken,
  clearLogs,
  ApiError,
} from './api';

const POLL_MS = 10_000; // whole-dashboard refresh
const LOG_POLL_MS = 5_000; // logs refresh faster (they're the "live" part)
const PLAYER_POLL_MS = 4_000; // transport state changes fastest

function fmtNum(n) {
  if (n == null || !Number.isFinite(Number(n))) return '—';
  return Number(n).toLocaleString('id-ID');
}

function timeAgo(iso) {
  if (!iso) return '—';
  const d = Date.now() - new Date(iso).getTime();
  const s = Math.floor(d / 1000);
  if (s < 60) return `${s}s lalu`;
  if (s < 3600) return `${Math.floor(s / 60)}m lalu`;
  if (s < 86400) return `${Math.floor(s / 3600)}j lalu`;
  return `${Math.floor(s / 86400)}h lalu`;
}

const LEVEL_COLOR = {
  error: '#c2415a',
  warn: '#b4791f',
  info: '#2f6f8f',
  debug: '#7a7a7a',
};

const ID_RE = /^\d{17,20}$/;

function fmtMs(ms) {
  if (!Number.isFinite(ms) || ms < 0) return '0:00';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const STATUS_PILL = {
  'limit-exceeded': 'pill-bad',
  'near-limit': 'pill-warn',
  ok: 'pill-ok',
  bypass: 'pill-ok',
};

export default function Dashboard({ onLogout }) {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [counts, setCounts] = useState(null);
  const [err, setErr] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const logSeq = useRef(0);
  const logBoxRef = useRef(null);
  const logEpoch = useRef(0);
  const logRequest = useRef(null);
  const [clearBusy, setClearBusy] = useState(false);
  const [logsNotice, setLogsNotice] = useState('');
  const [aiDimension, setAiDimension] = useState('sources');
  const [aiHover, setAiHover] = useState(null);

  // Client-side monitoring history. The API deliberately returns live snapshots
  // (not a database time series), so retain the last 10 minutes in this browser
  // session rather than pretending the chart contains historical server data.
  const [healthHistory, setHealthHistory] = useState([]);
  const [chartRange, setChartRange] = useState(30); // samples: 2m / 5m / 10m
  const [chartHover, setChartHover] = useState(null);

  // --- Now playing / controls ---
  const [players, setPlayers] = useState([]);
  const [playersErr, setPlayersErr] = useState('');
  const [busyKey, setBusyKey] = useState('');
  // 1s counter. Progress interpolation adds elapsed ticks to positionMs, which
  // keeps render pure — no Date.now() and no ref reads during render (both are
  // flagged by react-hooks/purity).
  const [tick, setTick] = useState(0);
  // Position snapshot when the players payload landed; set inside effects and
  // handlers only (setFetchedAt wraps the impure Date.now()).
  const [fetchedAt, setFetchedAt] = useState(0);

  // --- AI users table ---
  const [aiBusy, setAiBusy] = useState('');
  const [aiErr, setAiErr] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [newId, setNewId] = useState('');
  const [limitDraft, setLimitDraft] = useState({});
  const [bonusDraft, setBonusDraft] = useState({});

  const fail = useCallback(
    (e) => {
      if (e instanceof ApiError && e.status === 401) {
        clearToken();
        onLogout();
        return;
      }
      setErr(e?.message || 'Gagal memuat data.');
    },
    [onLogout]
  );

  // Full summary poll
  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const data = await getSummary();
        if (!alive) return;
        setSummary(data);
        setErr('');
        setLastUpdate(new Date());
        setHealthHistory((prev) => [
          ...prev,
          {
            at: Date.now(),
            ram: Number(data?.status?.host?.memUsedPct) || 0,
            load: Number(data?.status?.host?.loadAvg?.[0]) || 0,
            ping: Number(data?.status?.bot?.ping) || 0,
          },
        ].slice(-60));
        // Sync the control identity from the server — OWNER_ID in .env is the
        // source of truth; storing it removes a manual data-entry step.
        const oid = data?.status?.bot?.ownerId;
        if (oid && oid !== getDiscordId()) setDiscordId(oid);
      } catch (e) {
        if (alive) fail(e);
      }
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [fail]);

  // Players poll — transport is the fastest-changing thing on the page.
  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const data = await getPlayersFor(getDiscordId() || undefined);
        if (!alive) return;
        setPlayers(data.players || []);
        setPlayersErr('');
        setFetchedAt(Date.now());
      } catch (e) {
        if (alive && !(e instanceof ApiError && e.status === 401)) {
          setPlayersErr(e?.message || 'Gagal memuat player.');
        }
      }
    };
    tick();
    const id = setInterval(tick, PLAYER_POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // 1s local ticker: interpolate progress between polls so the bar moves
  // smoothly without extra requests.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Log poll.
  //
  // Reset and fetch live in ONE effect on purpose. They used to be two effects
  // both keyed on levelFilter, and because effects run in declaration order the
  // poll started BEFORE the reset — so it fetched with the previous filter's
  // cursor (logSeq) and then wrote that stale cursor back after the reset had
  // zeroed it. The poisoned `since` made the API return only lines newer than
  // the old cursor, so switching filters looked stuck on the previous view.
  //
  // The `since` value is a global sequence number, not per-filter, so a filter
  // change must restart from 0 to get that filter's recent lines.
  useEffect(() => {
    let alive = true; // also invalidates a previous filter's in-flight fetch
    logEpoch.current += 1;
    setLogs([]);
    logSeq.current = 0;

    const poll = async () => {
      const epoch = logEpoch.current;
      logRequest.current?.abort();
      const controller = new AbortController();
      logRequest.current = controller;
      try {
        const data = await getLogs({
          limit: 500,
          level: levelFilter || undefined,
          sinceSeq: logSeq.current || undefined,
        }, { signal: controller.signal });
        // A clear/filter-switch can happen while GET /logs is in flight. The
        // epoch makes that old response a no-op instead of resurrecting logs.
        if (!alive || epoch !== logEpoch.current) return;
        if (data.logs?.length) {
          setLogs((prev) => [...prev, ...data.logs].slice(-2000));
        }
        if (typeof data.lastSeq === 'number') logSeq.current = data.lastSeq;
        setCounts(data.counts);
      } catch (e) {
        if (e?.name === 'AbortError') return;
        if (alive && e instanceof ApiError && e.status === 401) fail(e);
      }
    };
    poll();
    const id = setInterval(poll, LOG_POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
      logRequest.current?.abort();
    };
  }, [levelFilter, fail]);

  useEffect(() => {
    if (autoScroll && logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // --- action handlers ---

  const doClearLogs = async () => {
    if (!window.confirm('Kosongkan log dashboard saat ini? Log PM2 dan file server tidak terhapus.')) return;
    setClearBusy(true);
    setLogsNotice('');
    // Kill the in-flight GET first, then invalidate any response already past
    // abort so the cleared feed cannot be repopulated with stale entries.
    logEpoch.current += 1;
    logRequest.current?.abort();
    try {
      const result = await clearLogs();
      setLogs([]);
      logSeq.current = Number.isFinite(result.lastSeq) ? result.lastSeq : logSeq.current;
      setCounts({ debug: 0, info: 0, warn: 0, error: 0 });
      setLogsNotice('Log dashboard dibersihkan. Baris baru akan muncul otomatis.');
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        fail(e);
      } else {
        setLogsNotice(e?.message || 'Gagal membersihkan log.');
      }
    } finally {
      setClearBusy(false);
    }
  };

  const doAction = async (guildId, action, value) => {
    const key = `${guildId}:${action}`;
    setBusyKey(key);
    setPlayersErr('');
    try {
      await playerAction(guildId, action, { userId: getDiscordId(), value });
      // The players poll re-anchors `fetchedAt` within 4s; no need to touch it
      // here (Date.now() in render-adjacent code trips react-hooks/purity).
      const data = await getPlayersFor(getDiscordId() || undefined);
      setPlayers(data.players || []);
    } catch (e) {
      setPlayersErr(e?.message || 'Aksi gagal.');
    } finally {
      setBusyKey('');
    }
  };

  const refreshSummary = useCallback(async () => {
    try {
      const data = await getSummary();
      setSummary(data);
      setAiErr('');
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 401)) setAiErr(e?.message || 'Gagal refresh.');
    }
  }, [fail]);

  const runAi = (key, fn) => async (...args) => {
    setAiBusy(key);
    setAiErr('');
    try {
      await fn(...args);
      await refreshSummary();
    } catch (e) {
      setAiErr(e?.message || 'Aksi gagal.');
    } finally {
      setAiBusy('');
    }
  };

  const doResetUser = runAi('reset', (id) => resetUserQuota(id));
  const doResetAll = runAi('reset-all', () => resetAllQuotas());
  const doSetLimit = runAi('limit', (id) => {
    const v = parseInt(limitDraft[id], 10);
    if (!Number.isFinite(v) || v < 1) throw new Error('Limit harus angka >= 1.');
    return setUserLimit(id, v);
  });
  const doRemoveLimit = runAi('rmlimit', (id) => removeUserLimit(id));
  const doSetBonus = runAi('bonus', (id) => {
    const v = parseInt(bonusDraft[id], 10);
    if (!Number.isFinite(v)) throw new Error('Bonus harus angka (boleh negatif).');
    return setUserBonus(id, v);
  });
  const doAddBonus = runAi('addbonus', (id) => {
    const v = parseInt(bonusDraft[id], 10);
    if (!Number.isFinite(v) || v === 0) throw new Error('Delta harus angka selain 0.');
    return addUserBonus(id, v);
  });
  const doRemoveBonus = runAi('rmbonus', (id) => removeUserBonus(id));
  const doAddWhitelist = runAi('wl-add', async () => {
    if (!ID_RE.test(newId.trim())) throw new Error('ID Discord harus 17-20 digit.');
    await addWhitelist(newId.trim());
    setNewId('');
  });
  const doRemoveWhitelist = runAi('wl-rm', (id) => removeWhitelist(id));

  const s = summary?.status;
  const users = summary?.users;
  const ai = summary?.ai;
  const aiUsers = ai?.users?.users || [];
  const aiUsage = ai?.[aiDimension] || [];
  const myId = getDiscordId();
  const chartData = healthHistory.slice(-chartRange);
  // tick only used to re-render interpolated progress; reference it to satisfy lint
  void tick;

  return (
    <div className="dash-wrap">
      <header className="dash-head">
        <div>
          <h1>Dashboard PinPlay</h1>
          <div className="dash-sub">
            {lastUpdate ? `Diperbarui ${timeAgo(lastUpdate.toISOString())}` : 'Memuat…'}
            {s?.bot?.tag ? ` • ${s.bot.tag}` : ''}
          </div>
        </div>
        <div className="dash-head-actions">
          <span className={`dot ${s?.bot?.online ? 'on' : 'off'}`} />
          <span className="dash-online">{s?.bot?.online ? 'Bot online' : 'Bot offline'}</span>
          <button className="ghost" onClick={onLogout}>Keluar</button>
        </div>
      </header>

      {err && <div className="dash-err" role="alert">{err}</div>}

      {/* --- Health tiles --- */}
      <section className="tiles">
        <Tile label="Server (guild)" value={fmtNum(s?.bot?.guildCount)} hint="tempat bot di-invite" />
        <Tile
          label="Total member"
          value={fmtNum(users?.totalMemberSlots)}
          hint="jumlah member semua server (bisa dobel)"
        />
        <Tile label="Uptime bot" value={s?.bot?.uptime || '—'} hint={`ping ${s?.bot?.ping ?? '—'}ms`} />
        <Tile
          label="Lavalink"
          value={s?.lavalink?.connected ? 'Tersambung' : 'Terputus'}
          hint={s?.lavalink?.nodes?.[0]?.state || '—'}
          bad={!s?.lavalink?.connected}
        />
        <Tile label="CPU host" value={`${s?.host?.cpuCount ?? '—'} core`} hint={`load ${s?.host?.loadAvg?.[0] ?? '—'}`} />
        <Tile
          label="RAM host"
          value={`${s?.host?.memUsedPct ?? '—'}%`}
          hint={`${s?.host?.memFree ?? '—'} bebas dari ${s?.host?.memTotal ?? '—'}`}
        />
        <Tile label="Command" value={fmtNum(s?.bot?.commands)} hint="terdaftar" />
        <Tile
          label="Token AI"
          value={fmtNum(ai?.tokens?.totals?.totalTokens)}
          hint={`${fmtNum(ai?.tokens?.totals?.calls)} panggilan`}
        />
      </section>

      {/* --- Live monitoring, intentionally compact --- */}
      <section className="metrics-section">
        <div className="metrics-head">
          <div>
            <span className="eyebrow">MONITORING LANGSUNG</span>
            <h2>Performa sesi</h2>
          </div>
          <div className="range-control" role="group" aria-label="Rentang grafik">
            {[
              [12, '2m'],
              [30, '5m'],
              [60, '10m'],
            ].map(([value, label]) => (
              <button key={value} className={chartRange === value ? 'active' : ''} onClick={() => setChartRange(value)}>{label}</button>
            ))}
          </div>
        </div>
        <div className="metrics-grid">
          <MiniMetric title="RAM host" unit="%" data={chartData} valueKey="ram" color="#2a78d6" description="Memori VPS" />
          <MiniMetric title="Load CPU" unit="" data={chartData} valueKey="load" color="#1baf7a" description="Load 1 menit" />
          <MiniMetric title="Ping Discord" unit=" ms" data={chartData} valueKey="ping" color="#e34948" description="WebSocket bot" />
        </div>
        <p className="metrics-note">Snapshot tersimpan hanya selama browser ini terbuka.</p>
      </section>

      {/* --- Now playing / controls --- */}
      <section className="card np-card">
        <div className="np-head">
          <h2>Sedang diputar <span className="count">{players.filter((p) => p.current).length}</span></h2>
          {!s?.bot?.ownerId && (
            <div className="np-owner">
              <label htmlFor="np-owner-id">ID Discord kamu</label>
              <input
                id="np-owner-id"
                value={myId}
                placeholder="17-20 digit"
                onChange={(e) => setDiscordId(e.target.value.replace(/\D/g, '').slice(0, 20))}
              />
            </div>
          )}
        </div>
        {playersErr && <div className="np-err">{playersErr}</div>}
        <div className="np-list">
          {players.map((p) => {
            const len = p.current?.lengthMs || 0;
            // Elapsed since snapshot, in seconds, driven by the 1s tick counter.
            // tick resets implicitly every poll because fetchedAt updates then.
            const elapsed = fetchedAt ? tick % 100000 : 0;
            const rawPos = p.playing && !p.paused
              ? p.positionMs + (elapsed * 1000)
              : p.positionMs;
            const pos = Math.min(Math.max(0, rawPos), len || rawPos);
            const pct = len ? Math.min(100, Math.round((pos / len) * 100)) : 0;
            const gate = !p.canControl;
            const reason = p.controlReason || '';
            const btn = (action, label, extra) => (
              <button
                className="btn-xs"
                disabled={gate || busyKey === `${p.guildId}:${action}`}
                title={gate ? reason : ''}
                onClick={() => doAction(p.guildId, action, extra)}
              >
                {label}
              </button>
            );
            return (
              <div className="np-row" key={p.guildId}>
                <div className="np-main">
                  <div className="row-name">
                    {p.guildName || p.guildId}
                    <span className="np-voice"> • 🔊 {p.voiceName || p.voiceId || '—'}</span>
                  </div>
                  {p.current ? (
                    <>
                      <div className="np-track">
                        🎵 {p.current.title || '—'}
                        {p.current.author ? ` — ${p.current.author}` : ''}
                      </div>
                      <div className="np-meta">
                        <span>{fmtMs(pos)} / {fmtMs(len)}</span>
                        <span>🔊 {p.volume ?? '?'}%</span>
                        {p.loop !== 'none' && <span>🔁 {p.loop}</span>}
                        {p.paused && <span>⏸ paused</span>}
                        <span className="np-src">{p.current.sourceName || ''}</span>
                        <span className="np-node">{p.node ? `node: ${p.node}` : ''}</span>
                      </div>
                      <div className="pbar">
                        <div className="pbar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </>
                  ) : (
                    <div className="np-meta">Tidak ada yang diputar (queue {p.upcomingCount})</div>
                  )}
                </div>
                <div className="ctrl-row">
                  {btn(p.paused ? 'resume' : 'pause', p.paused ? '▶' : '⏸')}
                  {btn('skip', '⏭')}
                  {btn('stop', '⏹')}
                  {btn('voldown', '🔉')}
                  {btn('volup', '🔊')}
                </div>
              </div>
            );
          })}
          {!players.length && <div className="empty">Tidak ada player aktif.</div>}
        </div>
      </section>

      <div className="cols">
        {/* --- Guilds --- */}
        <section className="card">
          <h2>Server yang pakai <span className="count">{summary?.guilds?.length ?? 0}</span></h2>
          <div className="list">
            {(summary?.guilds || []).map((g) => (
              <div className="row" key={g.id}>
                <div className="row-main">
                  <span className="row-name">{g.name}</span>
                  <span className="row-meta">
                    {fmtNum(g.memberCount)} member{g.hasPlayer ? ' • 🎵 aktif' : ''}
                  </span>
                </div>
                <span className="row-time">{timeAgo(g.joinedAt)}</span>
              </div>
            ))}
            {!summary?.guilds?.length && <div className="empty">Belum ada server.</div>}
          </div>
        </section>

        {/* --- AI --- */}
        <section className="card">
          <h2>AI &amp; biaya</h2>
          <div className="kv">
            <div><span>Provider</span><b>{ai?.provider || '—'}</b></div>
            <div><span>Model</span><b>{ai?.model || '—'}</b></div>
            <div><span>Limit / user / jam</span><b>{fmtNum(ai?.userHourlyLimit)}</b></div>
            <div><span>Whitelist /chat</span><b>{fmtNum(ai?.whitelistCount)}</b></div>
            <div><span>Fallback</span><b>{ai?.fallbackEnabled ? 'aktif' : 'mati'}</b></div>
            <div><span>Memory</span><b>{ai?.memoryEnabled ? 'aktif' : 'mati'}</b></div>
            <div>
              <span>Estimasi biaya</span>
              <b>${ai?.estimatedCostUsd ?? 0}</b>
            </div>
          </div>

          <h3>Per sumber</h3>
          <div className="list compact">
            {(ai?.sources || []).filter((x) => x.calls > 0).map((x) => (
              <div className="row" key={x.source}>
                <span className="row-name">{x.source}</span>
                <span className="row-meta">{fmtNum(x.totalTokens)} tok • {fmtNum(x.calls)}x</span>
              </div>
            ))}
            {!(ai?.sources || []).some((x) => x.calls > 0) && (
              <div className="empty">Belum ada pemakaian.</div>
            )}
          </div>
        </section>
      </div>

      {/* --- AI aggregate usage --- */}
      <section className="card ai-usage-card">
        <div className="ai-usage-head">
          <div>
            <span className="chart-kicker">AGREGAT ALL-TIME</span>
            <h2>AI usage</h2>
            <p>Sejak bot mulai mencatat. Reset token stats di Discord akan mengosongkan grafik.</p>
          </div>
          <div className="ai-usage-total">
            <strong>{fmtNum(ai?.tokens?.totals?.totalTokens)}</strong>
            <span>token · {fmtNum(ai?.tokens?.totals?.calls)} panggilan</span>
          </div>
        </div>
        <div className="ai-tabs" role="tablist" aria-label="Dimensi AI usage">
          {[
            ['sources', 'Sumber'],
            ['providers', 'Provider'],
            ['models', 'Model'],
          ].map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={aiDimension === key}
              className={aiDimension === key ? 'active' : ''}
              onClick={() => { setAiDimension(key); setAiHover(null); }}
            >
              {label}
            </button>
          ))}
        </div>
        <UsageBars data={aiUsage} dimension={aiDimension} hover={aiHover} onHover={setAiHover} />
      </section>

      {/* --- AI users table --- */}
      <section className="card ai-users-card">
        <div className="ai-users-head">
          <h2>User AI <span className="count">{aiUsers.length}</span></h2>
          <div className="ai-add-row">
            <input
              className="ai-id-input"
              value={newId}
              placeholder="ID Discord (17-20 digit)"
              onChange={(e) => setNewId(e.target.value.replace(/\D/g, '').slice(0, 20))}
            />
            <button
              className="ghost"
              disabled={aiBusy === 'wl-add' || !ID_RE.test(newId.trim())}
              onClick={doAddWhitelist}
            >
              + Whitelist
            </button>
            <button className="ghost danger" disabled={aiBusy === 'reset-all'} onClick={doResetAll}>
              Reset semua kuota
            </button>
          </div>
        </div>
        {aiErr && <div className="np-err">{aiErr}</div>}
        <div className="ai-table-wrap">
          <table className="ai-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Pakai</th>
                <th>Sisa</th>
                <th>Reset</th>
                <th>Limit</th>
                <th>Bonus</th>
                <th>Whitelist</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {aiUsers.map((u) => {
                const open = expandedRow === u.userId;
                return (
                  <tr key={u.userId} className={open ? 'expanded' : ''}>
                    <td className="ai-id" title={u.userId}>
                      {u.userId.slice(0, 6)}…{u.userId.slice(-4)}
                      {u.isOwner && <span className="ai-owner">owner</span>}
                    </td>
                    <td>
                      <span className={`pill ${STATUS_PILL[u.status] || ''}`}>{u.status}</span>
                    </td>
                    <td>{fmtNum(u.count)}</td>
                    <td>{u.remaining == null ? '∞' : fmtNum(u.remaining)}</td>
                    <td>{u.minutesLeft != null ? `${u.minutesLeft}m` : '—'}</td>
                    <td>{u.overrideLimit != null ? fmtNum(u.overrideLimit) : '—'}</td>
                    <td>{u.overrideBonus != null ? fmtNum(u.overrideBonus) : '—'}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={u.whitelisted}
                        disabled={aiBusy.startsWith('wl')}
                        onChange={() =>
                          (u.whitelisted ? doRemoveWhitelist(u.userId) : doAddWhitelist(u.userId))()
                        }
                      />
                    </td>
                    <td className="ai-actions">
                      <button className="btn-xs" disabled={aiBusy === 'reset'} onClick={() => doResetUser(u.userId)}>
                        Reset
                      </button>
                      <button
                        className="btn-xs"
                        onClick={() => setExpandedRow(open ? null : u.userId)}
                        title="Edit limit/bonus"
                      >
                        {open ? '▴' : '▾'}
                      </button>
                      {open && (
                        <div className="ai-editor">
                          <div className="ai-edit-row">
                            <input
                              placeholder="limit"
                              value={limitDraft[u.userId] ?? ''}
                              onChange={(e) =>
                                setLimitDraft((d) => ({ ...d, [u.userId]: e.target.value.replace(/\D/g, '').slice(0, 6) }))
                              }
                            />
                            <button className="btn-xs" disabled={aiBusy === 'limit'} onClick={() => doSetLimit(u.userId)}>Simpan</button>
                            <button className="btn-xs" disabled={aiBusy === 'rmlimit' || u.overrideLimit == null} onClick={() => doRemoveLimit(u.userId)}>Hapus</button>
                          </div>
                          <div className="ai-edit-row">
                            <input
                              placeholder="bonus"
                              value={bonusDraft[u.userId] ?? ''}
                              onChange={(e) =>
                                setBonusDraft((d) => ({
                                  ...d,
                                  [u.userId]: e.target.value.replace(/[^0-9-]/g, '').slice(0, 7),
                                }))
                              }
                            />
                            <button className="btn-xs" disabled={aiBusy === 'bonus'} onClick={() => doSetBonus(u.userId)}>Set</button>
                            <button className="btn-xs" disabled={aiBusy === 'addbonus'} onClick={() => doAddBonus(u.userId)}>+/-</button>
                            <button className="btn-xs" disabled={aiBusy === 'rmbonus' || u.overrideBonus == null} onClick={() => doRemoveBonus(u.userId)}>Hapus</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!aiUsers.length && (
                <tr>
                  <td colSpan={9}>
                    <div className="empty">Belum ada user AI (whitelist kosong).</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Logs --- */}
      <section className="card logs-card">
        <div className="logs-head">
          <h2>Log bot <span className="count">{logs.length}</span></h2>
          <div className="logs-tools">
            <button className="log-clear" disabled={clearBusy} onClick={doClearLogs} title="Hanya menghapus buffer dashboard, bukan PM2">
              {clearBusy ? 'Membersihkan…' : 'Clear log'}
            </button>
            {['', 'error', 'warn', 'info'].map((lv) => (
              <button
                key={lv || 'all'}
                className={`chip ${levelFilter === lv ? 'active' : ''}`}
                onClick={() => setLevelFilter(lv)}
              >
                {lv || 'semua'}
                {counts && lv ? ` (${counts[lv] ?? 0})` : ''}
              </button>
            ))}
            <label className="auto">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
              />
              auto-scroll
            </label>
          </div>
        </div>
        {logsNotice && <div className="logs-notice">{logsNotice}</div>}
        <div className="logbox" ref={logBoxRef}>
          {logs.map((l) => (
            <div className={`logline${l.line.startsWith('[audit]') ? ' audit' : ''}`} key={l.seq}>
              <span className="logts">{new Date(l.ts).toLocaleTimeString('id-ID')}</span>
              <span className="loglv" style={{ color: LEVEL_COLOR[l.level] || '#666' }}>
                {l.level.toUpperCase()}
              </span>
              <span className="logmsg">{l.line}</span>
            </div>
          ))}
          {!logs.length && <div className="empty">Belum ada log pada filter ini.</div>}
        </div>
        <div className="logs-note">
          Token, API key, dan password sudah disamarkan otomatis sebelum dikirim ke browser.
        </div>
      </section>

      <style>{`
        .dash-wrap {
          min-height: 100dvh;
          padding: 28px 24px 60px;
          background: var(--bg-color);
          max-width: 1180px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .dash-head {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; flex-wrap: wrap; margin-bottom: 22px;
        }
        .dash-head h1 { font-size: 24px; color: var(--text-dark); margin: 0; }
        .dash-sub { font-size: 12px; opacity: 0.6; color: var(--text-dark); margin-top: 4px; }
        .dash-head-actions { display: flex; align-items: center; gap: 10px; }
        .dash-online { font-size: 12.5px; color: var(--text-dark); }
        .dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
        .dot.on { background: #3f9d63; box-shadow: 0 0 0 3px rgba(63,157,99,0.18); }
        .dot.off { background: #c2415a; box-shadow: 0 0 0 3px rgba(194,65,90,0.18); }
        .ghost {
          background: transparent; border: 1px solid rgba(44,43,41,0.18);
          color: var(--text-dark); padding: 7px 14px; border-radius: 10px;
          font-size: 12.5px; font-family: inherit; cursor: pointer;
          transition: var(--spring-transition);
        }
        .ghost:hover { background: var(--white); box-shadow: var(--shadow-md); }
        .dash-err {
          background: rgba(239,170,185,0.3); color: #8a2b3f;
          padding: 10px 14px; border-radius: 12px; font-size: 13px; margin-bottom: 16px;
        }

        .tiles {
          display: grid; gap: 12px; margin-bottom: 18px;
          grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
        }
        .tiles > * {
          background: var(--white); border: 1px solid rgba(44,43,41,0.09);
          border-radius: 16px; padding: 14px 16px;
        }
        .tile-label { font-size: 11px; text-transform: uppercase; letter-spacing: .5px; opacity: .55; color: var(--text-dark); }
        .tile-value { font-size: 21px; font-weight: 700; color: var(--text-dark); margin: 6px 0 2px; }
        .tile-value.bad { color: #c2415a; }
        .tile-hint { font-size: 11px; opacity: .6; color: var(--text-dark); }

        .cols { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; margin-bottom: 18px; }
        @media (max-width: 780px) { .cols { grid-template-columns: 1fr; } }

        .card {
          background: var(--white); border: 1px solid rgba(44,43,41,0.09);
          border-radius: 18px; padding: 18px 20px; box-shadow: var(--shadow-sm, none);
        }
        .card h2 { font-size: 15px; color: var(--text-dark); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
        .card h3 { font-size: 12.5px; color: var(--text-dark); opacity: .7; margin: 18px 0 8px; }
        .count {
          font-size: 11px; background: var(--primary); color: var(--text-dark);
          padding: 2px 8px; border-radius: 20px; font-weight: 700;
        }
        .list { display: flex; flex-direction: column; gap: 2px; max-height: 320px; overflow-y: auto; }
        .list.compact { max-height: 180px; }
        .row { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(44,43,41,0.06); }
        .row:last-child { border-bottom: none; }
        .row-main { min-width: 0; }
        .row-name { display: block; font-size: 13.5px; color: var(--text-dark); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .row-meta { display: block; font-size: 11.5px; opacity: .6; color: var(--text-dark); }
        .row-time { font-size: 11px; opacity: .5; white-space: nowrap; color: var(--text-dark); }
        .empty { font-size: 12.5px; opacity: .5; color: var(--text-dark); padding: 10px 0; }

        .kv { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px; }
        .kv > div { display: flex; flex-direction: column; gap: 2px; }
        .kv span { font-size: 11px; opacity: .6; color: var(--text-dark); }
        .kv b { font-size: 13px; color: var(--text-dark); }

        .logs-card { margin-top: 0; }
        .logs-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
        .log-clear { border: 1px solid rgba(194,65,90,.35); background: rgba(239,170,185,.16); color: #8a2b3f; border-radius: 20px; padding: 5px 11px; font: 600 11.5px var(--font-sans); cursor: pointer; }
        .log-clear:hover:not(:disabled) { background: rgba(239,170,185,.30); }
        .log-clear:disabled { opacity: .5; cursor: default; }
        .logs-notice { margin: 0 0 10px; padding: 8px 10px; border-radius: 8px; background: rgba(165,214,241,.22); color: var(--text-dark); font-size: 11.5px; }
        .logs-head h2 { margin: 0; }
        .logs-tools { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .chip {
          background: transparent; border: 1px solid rgba(44,43,41,0.16);
          color: var(--text-dark); padding: 5px 11px; border-radius: 20px;
          font-size: 11.5px; font-family: inherit; cursor: pointer;
          transition: var(--spring-transition);
        }
        .chip.active { background: var(--primary); border-color: var(--primary); font-weight: 700; }
        .auto { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--text-dark); opacity: .75; }

        .logbox {
          background: #26251f; border-radius: 12px; padding: 12px 14px;
          height: 340px; overflow-y: auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11.5px; line-height: 1.65;
        }
        .logline { display: flex; gap: 9px; color: #ded9cb; }
        .logts { opacity: .45; white-space: nowrap; }
        .loglv { font-weight: 700; width: 44px; flex-shrink: 0; }
        .logmsg { word-break: break-word; }
        .logbox .empty { color: #ded9cb; opacity: .5; }
        .logs-note { font-size: 11px; opacity: .5; color: var(--text-dark); margin-top: 9px; }
        .logline.audit .logmsg { color: #ffd9a0; font-weight: 600; }

        /* --- Now playing --- */
        .np-card { margin-bottom: 16px; }
        .np-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .np-owner { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-dark); }
        .np-owner input {
          width: 180px; padding: 6px 10px; border-radius: 10px;
          border: 1px solid rgba(44,43,41,0.18); font-family: inherit; font-size: 12.5px;
        }
        .np-err {
          background: rgba(239,170,185,0.3); color: #8a2b3f;
          padding: 8px 12px; border-radius: 10px; font-size: 12.5px; margin: 10px 0;
        }
        .np-list { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
        .np-row {
          display: flex; justify-content: space-between; align-items: center; gap: 14px;
          padding: 12px 14px; border: 1px solid rgba(44,43,41,0.08); border-radius: 14px;
        }
        .np-main { min-width: 0; flex: 1; }
        .np-voice { font-weight: 400; font-size: 11.5px; opacity: .6; }
        .np-track { font-size: 13px; color: var(--text-dark); margin: 4px 0 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .np-meta { display: flex; gap: 12px; flex-wrap: wrap; font-size: 11px; opacity: .6; color: var(--text-dark); margin-bottom: 6px; }
        .np-src { text-transform: capitalize; }
        .np-node { font-family: ui-monospace, monospace; }
        .pbar { height: 5px; background: rgba(44,43,41,0.08); border-radius: 4px; overflow: hidden; }
        .pbar-fill { height: 100%; background: var(--primary); border-radius: 4px; transition: width 1s linear; }
        .ctrl-row { display: flex; gap: 5px; flex-shrink: 0; }
        .btn-xs {
          background: var(--white); border: 1px solid rgba(44,43,41,0.16);
          color: var(--text-dark); min-width: 32px; padding: 6px 9px; border-radius: 9px;
          font-size: 12px; font-family: inherit; cursor: pointer;
          transition: var(--spring-transition);
        }
        .btn-xs:hover:not(:disabled) { box-shadow: var(--shadow-sm); }
        .btn-xs:disabled { opacity: .38; cursor: not-allowed; }

        /* --- AI users table --- */
        .ai-users-card { margin-bottom: 16px; }
        .ai-users-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
        .ai-users-head h2 { margin: 0; }
        .ai-add-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .ai-id-input {
          width: 210px; padding: 7px 11px; border-radius: 10px;
          border: 1px solid rgba(44,43,41,0.18); font-family: inherit; font-size: 12.5px;
        }
        .ghost.danger { color: #8a2b3f; border-color: rgba(194,65,90,0.35); }
        .ai-table-wrap { overflow-x: auto; }
        .ai-table { width: 100%; border-collapse: collapse; font-size: 12.5px; color: var(--text-dark); }
        .ai-table th {
          text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: .5px;
          opacity: .55; padding: 6px 8px; border-bottom: 1px solid rgba(44,43,41,0.12);
        }
        .ai-table td { padding: 8px; border-bottom: 1px solid rgba(44,43,41,0.06); vertical-align: top; }
        .ai-id { font-family: ui-monospace, monospace; font-size: 11.5px; white-space: nowrap; }
        .ai-owner {
          display: inline-block; margin-left: 6px; font-size: 9.5px; padding: 1px 6px;
          background: var(--secondary); border-radius: 10px; font-weight: 700;
        }
        .pill { font-size: 10.5px; padding: 2px 9px; border-radius: 20px; font-weight: 700; white-space: nowrap; }
        .pill-ok { background: rgba(63,157,99,0.16); color: #2c6e48; }
        .pill-warn { background: rgba(180,121,31,0.16); color: #8a5a13; }
        .pill-bad { background: rgba(194,65,90,0.16); color: #8a2b3f; }
        .ai-actions { position: relative; }
        .ai-editor {
          position: absolute; right: 8px; top: 100%; z-index: 5;
          background: var(--white); border: 1px solid rgba(44,43,41,0.14);
          border-radius: 12px; padding: 10px; box-shadow: var(--shadow-md);
          display: flex; flex-direction: column; gap: 6px; min-width: 230px;
        }
        .ai-edit-row { display: flex; gap: 5px; align-items: center; }
        .ai-edit-row input {
          width: 90px; padding: 5px 8px; border-radius: 8px;
          border: 1px solid rgba(44,43,41,0.18); font-family: inherit; font-size: 12px;
        }

        /* --- AI aggregate usage bars --- */
        .ai-usage-card { margin-bottom: 18px; }
        .ai-usage-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
        .chart-kicker { display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: .12em; color: var(--text-muted); font-weight: 700; }
        .ai-usage-head h2 { font-size: 18px; margin: 2px 0 3px; color: var(--text-dark); }
        .ai-usage-head p { font-size: 11.5px; margin: 0; color: var(--text-muted); }
        .ai-usage-total { text-align: right; }
        .ai-usage-total strong { display: block; font-size: 21px; line-height: 1; color: var(--text-dark); font-variant-numeric: tabular-nums; }
        .ai-usage-total span { display: block; font-size: 10.5px; color: var(--text-muted); margin-top: 4px; }
        .ai-tabs { display: inline-flex; padding: 3px; margin: 16px 0 14px; border: 1px solid rgba(44,43,41,.1); border-radius: 10px; background: rgba(44,43,41,.05); }
        .ai-tabs button { border: 0; background: transparent; border-radius: 7px; padding: 6px 12px; font: 600 11px var(--font-sans); color: var(--text-muted); cursor: pointer; transition: var(--smooth-transition); }
        .ai-tabs button.active { background: var(--white); color: var(--text-dark); box-shadow: var(--shadow-sm); }
        .usage-bars { display: flex; flex-direction: column; gap: 10px; }
        .usage-row { display: grid; grid-template-columns: minmax(74px, 120px) 1fr auto; gap: 10px; align-items: center; }
        .usage-label { font: 600 11.5px var(--font-mono); color: var(--text-dark); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .usage-track { height: 18px; display: block; padding: 0; border: 0; background: rgba(44,43,41,.06); border-radius: 4px; overflow: hidden; cursor: pointer; position: relative; }
        .usage-track:hover, .usage-track:focus { outline: 2px solid rgba(42,120,214,.35); outline-offset: 2px; }
        .usage-fill { height: 100%; min-width: 2px; background: #2a78d6; border-radius: 0 4px 4px 0; transition: width .35s ease; }
        .usage-row.hovered .usage-fill { background: #1d5fae; }
        .usage-value { font: 11px var(--font-mono); color: var(--text-muted); white-space: nowrap; }
        .usage-tooltip { margin: 2px 0 0 130px; padding: 8px 10px; border-radius: 9px; background: var(--bg-offset); border: 1px solid rgba(44,43,41,.1); display: flex; gap: 14px; flex-wrap: wrap; font: 10.5px var(--font-mono); color: var(--text-muted); }
        .usage-tooltip strong { color: var(--text-dark); }
        .usage-empty { padding: 20px 0; text-align: center; font-size: 12px; color: var(--text-muted); }
        .usage-table { margin-top: 14px; font-size: 10.5px; color: var(--text-muted); }
        .usage-table summary { cursor: pointer; width: fit-content; }
        .usage-table table { margin-top: 8px; width: 100%; border-collapse: collapse; }
        .usage-table th, .usage-table td { padding: 5px 3px; border-bottom: 1px solid rgba(44,43,41,.06); text-align: left; }
        .usage-table th:not(:first-child), .usage-table td:not(:first-child) { text-align: right; }

        /* --- Live monitoring charts --- */
        .metrics-section {
          margin: 0 0 18px;
          background: var(--bg-offset);
          border: 1px solid rgba(44,43,41,0.09);
          border-radius: 18px;
          padding: 18px 20px 14px;
          box-shadow: var(--shadow-sm, none);
        }
        .metrics-head {
          display: flex; justify-content: space-between; align-items: center;
          gap: 12px; flex-wrap: wrap; margin-bottom: 14px;
        }
        .metrics-head h2 { font-size: 17px; margin: 2px 0 0; color: var(--text-dark); }
        .eyebrow {
          display: block; font-family: var(--font-mono); font-size: 10px;
          letter-spacing: .12em; color: var(--text-muted); font-weight: 700;
        }
        .range-control {
          display: inline-flex; padding: 3px; border-radius: 10px;
          background: rgba(44,43,41,0.06); border: 1px solid rgba(44,43,41,0.08);
        }
        .range-control button {
          border: 0; background: transparent; color: var(--text-muted); border-radius: 7px;
          font: 600 11px var(--font-mono); padding: 6px 10px; cursor: pointer;
          transition: var(--smooth-transition);
        }
        .range-control button.active { background: var(--white); color: var(--text-dark); box-shadow: var(--shadow-sm); }
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .metric-card {
          min-width: 0; background: var(--white); border: 1px solid rgba(44,43,41,0.08);
          border-radius: 14px; padding: 14px; transition: var(--smooth-transition);
          display: grid; grid-template-columns: 1fr auto; align-items: start; gap: 4px 12px;
          overflow: hidden;
        }
        .metric-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: rgba(44,43,41,.14); }
        .metric-card h3 { margin: 0; font-size: 13px; color: var(--text-dark); }
        .metric-card p { margin: 3px 0 0; font-size: 10.5px; line-height: 1.3; color: var(--text-muted); }
        .metric-reading { text-align: right; }
        .metric-reading strong { display: block; font-size: 19px; line-height: 1; font-variant-numeric: tabular-nums; color: var(--text-dark); }
        .metric-reading strong small { font-size: 10px; color: var(--text-muted); margin-left: 2px; }
        .metric-reading > span { display: inline-block; margin-top: 5px; border-radius: 9px; padding: 1px 6px; background: rgba(44,43,41,.06); color: var(--text-muted); font: 9.5px var(--font-mono); }
        .metric-reading > span.up { color: #a33b3b; background: rgba(227,73,72,.10); }
        .metric-reading > span.down { color: #08734d; background: rgba(27,175,122,.10); }
        .mini-spark { grid-column: 1 / -1; display: block; width: 100%; height: 62px; margin-top: 7px; overflow: hidden; }
        .spark-grid { stroke: rgba(44,43,41,.09); stroke-width: 1; vector-effect: non-scaling-stroke; }
        .metric-footer { grid-column: 1 / -1; display: flex; justify-content: space-between; font: 9.5px var(--font-mono); color: var(--text-muted); }
        .chart-wrap, .line-chart, .chart-grid, .chart-crosshair, .chart-empty, .chart-tooltip, .chart-details { display: none; }
        .metrics-note { margin: 10px 2px 0; font-size: 10.5px; color: var(--text-muted); }
        @media (max-width: 940px) { .metrics-grid { grid-template-columns: 1fr; } }
        @media (max-width: 780px) {
          .np-row { flex-direction: column; align-items: stretch; }
          .ctrl-row { justify-content: flex-end; }
        }
      `}</style>
    </div>
  );
}

function Tile({ label, value, hint, bad }) {
  return (
    <div>
      <div className="tile-label">{label}</div>
      <div className={`tile-value${bad ? ' bad' : ''}`}>{value}</div>
      {hint && <div className="tile-hint">{hint}</div>}
    </div>
  );
}

function UsageBars({ data, dimension, hover, onHover }) {
  const labelKey = dimension === 'sources' ? 'source' : dimension === 'providers' ? 'provider' : 'model';
  const sorted = [...data].filter((row) => Number(row.totalTokens) > 0).sort((a, b) => b.totalTokens - a.totalTokens);
  const max = Math.max(1, ...sorted.map((row) => Number(row.totalTokens) || 0));
  const active = hover?.dimension === dimension ? sorted[hover.index] : null;

  if (!sorted.length) return <div className="usage-empty">Belum ada pemakaian AI pada dimensi ini.</div>;

  return (
    <div>
      <div className="usage-bars" role="list" aria-label={`Token berdasarkan ${dimension}`}>
        {sorted.map((row, index) => {
          const tokens = Number(row.totalTokens) || 0;
          const width = Math.max(2, (tokens / max) * 100);
          const isHovered = active === row;
          return (
            <div key={row[labelKey]} className={`usage-row ${isHovered ? 'hovered' : ''}`} role="listitem">
              <span className="usage-label" title={row[labelKey]}>{row[labelKey]}</span>
              <button
                className="usage-track"
                style={{ '--bar': `${width}%` }}
                onMouseEnter={() => onHover({ dimension, index })}
                onFocus={() => onHover({ dimension, index })}
                onMouseLeave={() => onHover(null)}
                onBlur={() => onHover(null)}
                aria-label={`${row[labelKey]}: ${fmtNum(tokens)} token, ${fmtNum(row.calls)} panggilan`}
              >
                <span className="usage-fill" style={{ width: `${width}%` }} />
              </button>
              <span className="usage-value">{fmtNum(tokens)} · {fmtNum(row.calls)}×</span>
            </div>
          );
        })}
      </div>
      {active && (
        <div className="usage-tooltip" role="status">
          <strong>{active[labelKey]}</strong>
          <span>{fmtNum(active.totalTokens)} token</span>
          <span>{fmtNum(active.calls)} panggilan</span>
          {active.promptTokens != null && <span>prompt {fmtNum(active.promptTokens)}</span>}
          {active.completionTokens != null && <span>output {fmtNum(active.completionTokens)}</span>}
        </div>
      )}
      <details className="usage-table">
        <summary>Lihat data tabel</summary>
        <table>
          <thead><tr><th>Nama</th><th>Token</th><th>Panggilan</th><th>Prompt</th><th>Output</th></tr></thead>
          <tbody>{sorted.map((row) => <tr key={row[labelKey]}><td>{row[labelKey]}</td><td>{fmtNum(row.totalTokens)}</td><td>{fmtNum(row.calls)}</td><td>{row.promptTokens != null ? fmtNum(row.promptTokens) : '—'}</td><td>{row.completionTokens != null ? fmtNum(row.completionTokens) : '—'}</td></tr>)}</tbody>
        </table>
      </details>
    </div>
  );
}

function MiniMetric({ title, unit, data, valueKey, color, description }) {
  const values = data.map((d) => Number(d[valueKey]) || 0);
  const latest = values.at(-1) ?? 0;
  const previous = values.at(-2) ?? latest;
  const delta = latest - previous;
  const max = Math.max(1, ...values) * 1.15;
  const W = 260;
  const H = 62;
  const baseline = H - 5;
  const xy = values.map((value, index) => ({
    x: values.length < 2 ? W / 2 : (index / (values.length - 1)) * W,
    y: H - (value / max) * (H - 12) - 6,
  }));
  const points = xy.map(({ x, y }) => `${x},${y}`).join(' ');
  const area = xy.length > 1
    ? `M ${xy[0].x} ${baseline} L ${xy.map(({ x, y }) => `${x} ${y}`).join(' L ')} L ${xy.at(-1).x} ${baseline} Z`
    : '';
  const gradientId = `metric-${valueKey}`;
  const trend = Math.abs(delta) < 0.01 ? 'stabil' : delta > 0 ? `+${fmtNum(delta)}` : fmtNum(delta);

  return (
    <article className="metric-card">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="metric-reading">
        <strong>{fmtNum(latest)}<small>{unit}</small></strong>
        <span className={delta > 0.01 ? 'up' : delta < -0.01 ? 'down' : ''}>{trend}</span>
      </div>
      <svg className="mini-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`${title}: ${fmtNum(latest)}${unit}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.26" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.33, 0.66].map((line) => <line key={line} x1="0" x2={W} y1={H * line} y2={H * line} className="spark-grid" />)}
        {area && <path d={area} fill={`url(#${gradientId})`} />}
        {xy.length > 1 && <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />}
        {xy.length > 0 && <circle cx={xy.at(-1).x} cy={xy.at(-1).y} r="4" fill={color} stroke="#fff" strokeWidth="2" vectorEffect="non-scaling-stroke" />}
      </svg>
      <div className="metric-footer">
        <span>{values.length ? `${values.length} sample` : 'menunggu data'}</span>
        <span>update 10s</span>
      </div>
    </article>
  );
}
