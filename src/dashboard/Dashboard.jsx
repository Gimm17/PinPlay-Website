import { useEffect, useRef, useState, useCallback } from 'react';
import { getSummary, getLogs, clearToken, ApiError } from './api';

const POLL_MS = 10_000; // whole-dashboard refresh
const LOG_POLL_MS = 5_000; // logs refresh faster (they're the "live" part)

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

  // Log poll — appends only new lines so the view doesn't jump
  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const data = await getLogs(
          { limit: 200, level: levelFilter || undefined, sinceSeq: logSeq.current || undefined }
        );
        if (!alive) return;
        if (data.logs?.length) {
          setLogs((prev) => [...prev, ...data.logs].slice(-500));
        }
        if (typeof data.lastSeq === 'number') logSeq.current = data.lastSeq;
        setCounts(data.counts);
      } catch (e) {
        if (alive && e instanceof ApiError && e.status === 401) fail(e);
      }
    };
    tick();
    const id = setInterval(tick, LOG_POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [levelFilter, fail]);

  // Reset the log view when the filter changes (seq tracking differs per filter)
  useEffect(() => {
    setLogs([]);
    logSeq.current = 0;
  }, [levelFilter]);

  useEffect(() => {
    if (autoScroll && logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const s = summary?.status;
  const users = summary?.users;
  const ai = summary?.ai;

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

      {/* --- Logs --- */}
      <section className="card logs-card">
        <div className="logs-head">
          <h2>Log bot <span className="count">{logs.length}</span></h2>
          <div className="logs-tools">
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
        <div className="logbox" ref={logBoxRef}>
          {logs.map((l) => (
            <div className="logline" key={l.seq}>
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
