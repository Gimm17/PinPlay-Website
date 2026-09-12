import { useState } from 'react';
import { checkToken, setToken, ApiError, API_BASE } from './api';

/**
 * Password gate for the dashboard.
 *
 * The "password" IS the dashboard API token — there is no separate account
 * system, because only the bot owner needs access. The token is verified
 * against the live API before being stored, so a typo fails here rather than
 * producing an empty dashboard.
 */
export default function Login({ onSuccess }) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const token = value.trim();
    if (!token) {
      setError('Isi token dulu.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await checkToken(token);
      setToken(token);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Token salah. Cek kembali nilai DASHBOARD_TOKEN di VPS.');
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Tidak bisa menghubungi API bot. Pastikan VPS dan Nginx hidup.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="login-badge">🔒</div>
        <h1>Dashboard PinPlay</h1>
        <p className="login-sub">
          Masuk pakai dashboard token. Hanya untuk owner bot.
        </p>

        <label htmlFor="tok">Dashboard token</label>
        <input
          id="tok"
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="tempel token di sini"
          autoComplete="current-password"
          autoFocus
          disabled={busy}
        />

        {error && <div className="login-err" role="alert">{error}</div>}

        <button type="submit" disabled={busy}>
          {busy ? 'Memeriksa…' : 'Masuk'}
        </button>

        <div className="login-hint">
          Token ada di <code>.env</code> VPS sebagai <code>DASHBOARD_TOKEN</code>.
          <br />
          API: <code>{API_BASE.replace(/^https?:\/\//, '')}</code>
        </div>
      </form>

      <style>{`
        .login-wrap {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--bg-color);
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          background: var(--white);
          border: 1px solid rgba(44, 43, 41, 0.1);
          border-radius: 20px;
          padding: 32px 28px;
          box-shadow: var(--shadow-lg);
          text-align: center;
        }
        .login-badge {
          font-size: 34px;
          line-height: 1;
          margin-bottom: 12px;
        }
        .login-card h1 {
          font-size: 22px;
          color: var(--text-dark);
          margin: 0 0 6px;
        }
        .login-sub {
          font-size: 13px;
          color: var(--text-dark);
          opacity: 0.65;
          margin: 0 0 22px;
        }
        .login-card label {
          display: block;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 6px;
          opacity: 0.8;
        }
        .login-card input {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(44, 43, 41, 0.18);
          background: var(--bg-color);
          color: var(--text-dark);
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: var(--spring-transition);
        }
        .login-card input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(165, 214, 241, 0.35);
        }
        .login-card button {
          width: 100%;
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 12px;
          border: none;
          background: var(--primary);
          color: var(--text-dark);
          font-size: 14px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: var(--spring-transition);
        }
        .login-card button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .login-card button:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .login-err {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(239, 170, 185, 0.28);
          color: #8a2b3f;
          font-size: 12.5px;
          text-align: left;
        }
        .login-hint {
          margin-top: 18px;
          font-size: 11.5px;
          line-height: 1.6;
          color: var(--text-dark);
          opacity: 0.55;
        }
        .login-hint code {
          font-size: 11px;
          background: rgba(44, 43, 41, 0.07);
          padding: 1px 5px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}
