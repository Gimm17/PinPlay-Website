import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { config } from '../config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Showcase — visual preview dari AI features.
 *
 * 3 tabs (Chat / Playlist / Roast), masing-masing dengan mock conversation
 * atau sample output. Tujuannya: kasih visitor "feel" AI features dalam
 * 5 detik tanpa harus invite bot dulu.
 */
export default function Showcase() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('chat');

  useGSAP(() => {
    gsap.from('.showcase-header > *', {
      scrollTrigger: {
        trigger: '.showcase-header',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.showcase-card-wrapper', {
      scrollTrigger: {
        trigger: '.showcase-card-wrapper',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  // Auto-rotate tab every 8s for ambient discoverability
  useEffect(() => {
    const tabs = ['chat', 'playlist', 'roast'];
    const id = setInterval(() => {
      setActiveTab((prev) => tabs[(tabs.indexOf(prev) + 1) % tabs.length]);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: '💬' },
    { id: 'playlist', label: 'AI Playlist', icon: '🎧' },
    { id: 'roast', label: 'AI Roast', icon: '🔥' },
  ];

  return (
    <section id="showcase" className="section showcase-section" ref={containerRef}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header showcase-header">
          <span className="section-subtitle">PREVIEW FITUR AI</span>
          <h2 className="section-title">Lihat AI-nya Beraksi</h2>
          <p className="section-desc">
            Bukan cuma teori — ini contoh real output dari 3 fitur AI andalan PinPlay. Klik tab atau tunggu auto-rotate.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="showcase-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`showcase-tab ${activeTab === t.id ? 'showcase-tab-active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              aria-pressed={activeTab === t.id}
            >
              <span className="showcase-tab-icon">{t.icon}</span>
              <span className="showcase-tab-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Card showcase */}
        <div className="showcase-card-wrapper glass-panel">
          {activeTab === 'chat' && <ChatShowcase />}
          {activeTab === 'playlist' && <PlaylistShowcase />}
          {activeTab === 'roast' && <RoastShowcase />}
        </div>
      </div>

      <style>{`
        .showcase-section {
          background-color: var(--bg-color);
          position: relative;
          overflow: hidden;
        }

        /* Decorative gradient mesh background */
        .showcase-section::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(165, 214, 241, 0.18), transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .showcase-section::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(239, 170, 185, 0.15), transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .showcase-tabs {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          position: relative;
          z-index: 2;
        }

        .showcase-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background-color: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(44, 43, 41, 0.1);
          border-radius: var(--radius-md);
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--spring-transition);
        }

        .showcase-tab:hover {
          color: var(--text-dark);
          background-color: rgba(255, 255, 255, 0.8);
        }

        .showcase-tab-active {
          color: var(--text-dark);
          background-color: var(--white);
          box-shadow: var(--shadow-md);
          border-color: rgba(44, 43, 41, 0.15);
        }

        .showcase-tab-icon {
          font-size: 1.1rem;
        }

        .showcase-card-wrapper {
          max-width: 760px;
          margin: 0 auto;
          padding: 32px;
          background-color: rgba(255, 255, 255, 0.6);
          position: relative;
          z-index: 2;
          min-height: 380px;
        }

        @media (max-width: 640px) {
          .showcase-card-wrapper {
            padding: 20px;
          }
        }
      `}</style>
    </section>
  );
}

/* =============================================================
 *  Tab 1: AI Chat preview
 * ============================================================= */
function ChatShowcase() {
  return (
    <div className="chat-showcase">
      <div className="showcase-meta">
        <span className="showcase-meta-badge">💬 Temen Curhat</span>
        <span className="showcase-meta-label">auto-detect personality</span>
      </div>

      <div className="chat-bubbles">
        <div className="chat-msg chat-msg-user">
          <div className="chat-avatar chat-avatar-user">G</div>
          <div className="chat-bubble">
            gue lagi galau banget nih, doi malah chat doi lain 😩
          </div>
        </div>

        <div className="chat-msg chat-msg-bot">
          <div className="chat-avatar chat-avatar-bot">💬</div>
          <div className="chat-bubble chat-bubble-bot">
            Waduh bro, that's rough. Tapi coba deh liat dari sisi lain — kalau emang dia gampang gonta-ganti perhatian, berarti lo gak rugi, lo justru ke-skip dari drama yang lebih panjang. Move on itu bukan cepet-cepetan, tapi emang gak worth it dikejar kalau yang lari bukan ke lo. Fokus upgrade diri dulu, nanti jodoh yang bener dateng sendiri. 💪
          </div>
        </div>

        <div className="chat-msg chat-msg-user">
          <div className="chat-avatar chat-avatar-user">G</div>
          <div className="chat-bubble">
            tapi gue udah 2 tahun sama dia, gimana dong...
          </div>
        </div>
      </div>

      <div className="showcase-cta">
        <a href={config.defaultInviteLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          <span>Coba /chat di server kamu</span>
        </a>
        <span className="showcase-meta-foot">13 personality • Reply untuk lanjutin • 10 min TTL</span>
      </div>

      <style>{`
        .chat-showcase { display: flex; flex-direction: column; gap: 20px; }

        .showcase-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .showcase-meta-badge {
          background-color: rgba(165, 214, 241, 0.3);
          padding: 4px 10px;
          border-radius: 50px;
          font-weight: 700;
          color: var(--text-dark);
        }

        .chat-bubbles { display: flex; flex-direction: column; gap: 14px; }

        .chat-msg {
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }
        .chat-msg-user { flex-direction: row-reverse; }

        .chat-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem;
          flex-shrink: 0;
        }
        .chat-avatar-user { background-color: var(--secondary); color: var(--text-dark); }
        .chat-avatar-bot { background-color: var(--primary); color: var(--text-dark); }

        .chat-bubble {
          max-width: 75%;
          padding: 12px 16px;
          background-color: var(--white);
          border-radius: 16px;
          font-size: 0.9375rem;
          line-height: 1.5;
          color: var(--text-dark);
          border: 1px solid rgba(44, 43, 41, 0.06);
        }
        .chat-msg-user .chat-bubble {
          background-color: var(--primary);
          border-color: rgba(44, 43, 41, 0.1);
        }
        .chat-bubble-bot {
          background-color: rgba(255, 255, 255, 0.95);
        }

        .showcase-cta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 8px;
          border-top: 1px dashed rgba(44, 43, 41, 0.1);
        }

        .showcase-meta-foot {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-left: auto;
        }
        @media (max-width: 640px) {
          .showcase-meta-foot { margin-left: 0; flex-basis: 100%; }
        }
      `}</style>
    </div>
  );
}

/* =============================================================
 *  Tab 2: AI Playlist preview
 * ============================================================= */
function PlaylistShowcase() {
  const theme = 'lagu galau indo viral';
  const songs = [
    { num: '01', title: 'Pamit', artist: 'Tipe-X', ok: true },
    { num: '02', title: 'Separuh Aku', artist: 'Dewa 19', ok: true },
    { num: '03', title: 'Kangen', artist: 'Dewa 19', ok: true },
    { num: '04', title: 'Cinta Ini Membunuhku', artist: 'Dygta', ok: true },
    { num: '05', title: 'Biar Aku Yang Pergi', artist: 'Pance Pondaag', ok: true },
    { num: '06', title: 'Sampai Jadi Debu', artist: 'Banda Neira', ok: true },
    { num: '07', title: 'Surat Cinta Untuk Starla', artist: 'Vagetoz', ok: true },
    { num: '08', title: 'Jujur', artist: 'Radja', ok: true },
  ];

  return (
    <div className="playlist-showcase">
      <div className="showcase-meta">
        <span className="showcase-meta-badge">🎧 AI Playlist</span>
        <span className="showcase-meta-label">theme: "{theme}"</span>
      </div>

      <div className="playlist-list">
        {songs.map((s) => (
          <div key={s.num} className="playlist-row">
            <span className="playlist-num">{s.num}</span>
            <span className="playlist-mark">{s.ok ? '✅' : '❌'}</span>
            <div className="playlist-info">
              <div className="playlist-title">{s.title}</div>
              <div className="playlist-artist">{s.artist}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="showcase-cta">
        <a href={config.defaultInviteLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          <span>Coba /aiplaylist</span>
        </a>
        <span className="showcase-meta-foot">10-15 lagu • Cache 2 min • Free command</span>
      </div>

      <style>{`
        .playlist-showcase { display: flex; flex-direction: column; gap: 18px; }

        .playlist-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        @media (max-width: 520px) {
          .playlist-list { grid-template-columns: 1fr; }
        }

        .playlist-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background-color: var(--white);
          border: 1px solid rgba(44, 43, 41, 0.06);
          border-radius: var(--radius-sm);
          transition: var(--spring-transition);
        }
        .playlist-row:hover {
          border-color: rgba(165, 214, 241, 0.5);
          transform: translateX(2px);
        }

        .playlist-num {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
          min-width: 22px;
        }
        .playlist-mark { font-size: 0.95rem; }
        .playlist-info { display: flex; flex-direction: column; gap: 0; min-width: 0; }
        .playlist-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-dark);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .playlist-artist {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .btn-sm { padding: 8px 16px; font-size: 0.875rem; }
      `}</style>
    </div>
  );
}

/* =============================================================
 *  Tab 3: AI Roast preview
 * ============================================================= */
function RoastShowcase() {
  return (
    <div className="roast-showcase">
      <div className="showcase-meta">
        <span className="showcase-meta-badge" style={{ backgroundColor: 'rgba(239, 170, 185, 0.4)' }}>🔥 AI Roast</span>
        <span className="showcase-meta-label">lagu: "Separuh Aku" — Dewa 19</span>
      </div>

      <div className="roast-context">
        <div className="roast-song-info">
          <div className="roast-vinyl-mini">
            <div className="roast-vinyl-spin">💿</div>
          </div>
          <div>
            <div className="roast-song-title">Separuh Aku</div>
            <div className="roast-song-artist">Dewa 19</div>
            <div className="roast-song-requester">Requested by: @Lyvn</div>
          </div>
        </div>
      </div>

      <div className="roast-message">
        <div className="roast-bubble">
          <span className="roast-target">&lt;@Lyvn&gt;</span> Lo tuh kayak "Separuh Aku" — ngerasa ngasih separuh diri, padahal yang nunggu lo dari tadi udah nyerah. Lu nanya kenapa doi pergi? Karena lo nahan dia di separuh perhatian, separuh effort, dan separuh hati. Lo mau yang full atau gak? 😹
        </div>
      </div>

      <div className="showcase-cta">
        <a href={config.defaultInviteLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          <span>Coba /roast</span>
        </a>
        <span className="showcase-meta-foot">Gaya bahasa Indonesia gaul • 1 paragraf • Cache 1 jam</span>
      </div>

      <style>{`
        .roast-showcase { display: flex; flex-direction: column; gap: 18px; }

        .roast-context {
          padding: 14px 16px;
          background-color: var(--white);
          border-radius: var(--radius-md);
          border: 1px solid rgba(44, 43, 41, 0.06);
        }
        .roast-song-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .roast-vinyl-mini {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle, #333 30%, #111 70%);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem;
        }
        .roast-vinyl-spin { animation: roast-spin 4s linear infinite; }
        @keyframes roast-spin {
          to { transform: rotate(360deg); }
        }
        .roast-song-title { font-weight: 700; font-size: 0.95rem; color: var(--text-dark); }
        .roast-song-artist { font-size: 0.8rem; color: var(--text-muted); }
        .roast-song-requester {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .roast-message { display: flex; }
        .roast-bubble {
          max-width: 100%;
          padding: 14px 18px;
          background-color: rgba(239, 170, 185, 0.15);
          border-left: 3px solid var(--secondary);
          border-radius: 8px;
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-dark);
        }
        .roast-target {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--secondary);
          background-color: rgba(239, 170, 185, 0.25);
          padding: 1px 6px;
          border-radius: 3px;
          margin-right: 2px;
        }

        .btn-sm { padding: 8px 16px; font-size: 0.875rem; }
      `}</style>
    </div>
  );
}
