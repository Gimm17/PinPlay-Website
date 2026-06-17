import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { config } from '../config';

gsap.registerPlugin(ScrollTrigger);

/**
 * Changelog — visual timeline dari versi bot.
 *
 * Tujuan: kasih visitor yang punya bot dari versi lama lihat
 * apa yang baru, dan visitor baru lihat "bot ini mature & aktif".
 */
export default function Changelog() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.changelog-header > *', {
      scrollTrigger: {
        trigger: '.changelog-header',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Stagger reveal for each timeline card
    gsap.utils.toArray('.changelog-card').forEach((card, idx) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        x: idx % 2 === 0 ? -30 : 30,
        duration: 0.8,
        ease: 'power3.out',
      });
    });

    // Animate dots in timeline
    gsap.utils.toArray('.changelog-dot').forEach((dot) => {
      gsap.from(dot, {
        scrollTrigger: {
          trigger: dot,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        scale: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });
    });
  }, { scope: containerRef });

  const getTagColor = (tag) => {
    switch (tag) {
      case 'major': return { bg: 'rgba(239, 170, 185, 0.4)', color: '#a8324a', label: 'MAJOR' };
      case 'minor': return { bg: 'rgba(165, 214, 241, 0.4)', color: '#3182ce', label: 'MINOR' };
      case 'patch': return { bg: 'rgba(72, 187, 120, 0.2)', color: '#38a169', label: 'PATCH' };
      default: return { bg: 'rgba(44, 43, 41, 0.08)', color: 'var(--text-muted)', label: 'UPDATE' };
    }
  };

  return (
    <section id="changelog" className="section changelog-section" ref={containerRef}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header changelog-header">
          <span className="section-subtitle">RIWAYAT UPDATE</span>
          <h2 className="section-title">Apa yang Baru di PinPlay</h2>
          <p className="section-desc">
            Bot ini aktif dikembangkan. Setiap rilis menambahkan fitur, meningkatkan keandalan, atau memperbaiki bug.
          </p>
        </div>

        {/* Timeline */}
        <div className="changelog-timeline">
          {/* Vertical line */}
          <div className="changelog-timeline-line" aria-hidden="true"></div>

          {config.changelog.map((entry, idx) => {
            const tagStyle = getTagColor(entry.tag);
            return (
              <div
                key={entry.version}
                className={`changelog-card ${idx % 2 === 0 ? 'changelog-card-left' : 'changelog-card-right'}`}
              >
                {/* Dot on timeline */}
                <div className="changelog-dot" aria-hidden="true">
                  <div className="changelog-dot-inner"></div>
                </div>

                {/* Card */}
                <div className="changelog-card-inner glass-panel">
                  <div className="changelog-card-header">
                    <div className="changelog-version-group">
                      <span className="changelog-version">v{entry.version}</span>
                      <span
                        className="changelog-tag"
                        style={{ backgroundColor: tagStyle.bg, color: tagStyle.color }}
                      >
                        {tagStyle.label}
                      </span>
                    </div>
                    <span className="changelog-date">{entry.date}</span>
                  </div>

                  <h3 className="changelog-title">{entry.title}</h3>

                  <ul className="changelog-highlights">
                    {entry.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="changelog-highlight">
                        <span className="changelog-bullet">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="changelog-bottom-cta">
          <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
            <span>Lihat full changelog di GitHub</span>
            <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16" style={{ marginLeft: '8px' }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        .changelog-section {
          background-color: var(--bg-offset);
          position: relative;
        }

        .changelog-timeline {
          position: relative;
          max-width: 920px;
          margin: 0 auto;
          padding: 20px 0 40px;
        }

        /* Vertical line — desktop only */
        @media (min-width: 768px) {
          .changelog-timeline-line {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(180deg, transparent, var(--primary) 8%, var(--secondary) 92%, transparent);
            transform: translateX(-50%);
            z-index: 0;
          }
        }

        .changelog-card {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 36px;
          padding: 0 12px;
        }

        @media (min-width: 768px) {
          .changelog-card {
            width: 50%;
          }
          .changelog-card-left { margin-right: auto; padding-right: 56px; justify-content: flex-end; }
          .changelog-card-right { margin-left: auto; padding-left: 56px; }
        }

        /* Dot on timeline (desktop only) */
        .changelog-dot {
          position: absolute;
          top: 24px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: var(--white);
          border: 3px solid var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .changelog-dot-inner {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--primary);
        }

        @media (min-width: 768px) {
          .changelog-card-left .changelog-dot { right: -9px; }
          .changelog-card-right .changelog-dot { left: -9px; }
        }

        @media (max-width: 767px) {
          .changelog-dot { display: none; }
        }

        .changelog-card-inner {
          width: 100%;
          padding: 24px;
          background-color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(44, 43, 41, 0.08);
          border-radius: var(--radius-md);
          transition: var(--spring-transition);
        }

        .changelog-card-inner:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: rgba(165, 214, 241, 0.5);
        }

        .changelog-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .changelog-version-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .changelog-version {
          font-family: var(--font-mono);
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--text-dark);
        }

        .changelog-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .changelog-date {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .changelog-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 14px;
        }

        .changelog-highlights {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .changelog-highlight {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--text-muted);
        }

        .changelog-bullet {
          color: var(--primary);
          font-weight: 700;
          flex-shrink: 0;
        }

        .changelog-bottom-cta {
          text-align: center;
          margin-top: 24px;
        }
      `}</style>
    </section>
  );
}
