import React, { useRef, useState, useEffect } from 'react';
import { config } from '../config';

export default function About() {
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before entering viewport
    };

    const headerObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHeaderVisible(true);
        headerObserver.unobserve(entry.target);
      }
    }, observerOptions);

    const gridObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setGridVisible(true);
        gridObserver.unobserve(entry.target);
      }
    }, observerOptions);

    if (headerRef.current) headerObserver.observe(headerRef.current);
    if (gridRef.current) gridObserver.observe(gridRef.current);

    return () => {
      headerObserver.disconnect();
      gridObserver.disconnect();
    };
  }, []);

  // Get Custom SVG Icon path based on keyword
  const getIcon = (type) => {
    switch (type) {
      case 'panel':
        return (
          <svg className="icon-svg bento-icon" viewBox="0 0 24 24" width="24" height="24">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18M3 9h18" />
          </svg>
        );
      case 'spotify':
        return (
          <svg className="icon-svg bento-icon spotify-svg" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 11.5c2.5-1 5.5-1 8 0M7 9c3-1.5 7-1.5 10 0M9 14c2-.7 4-.7 6 0" />
          </svg>
        );
      case 'filter':
        return (
          <svg className="icon-svg bento-icon" viewBox="0 0 24 24" width="24" height="24">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="icon-svg bento-icon" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="icon-svg bento-icon" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case 'music-note':
        return (
          <svg className="icon-svg bento-icon" viewBox="0 0 24 24" width="24" height="24">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        );
      default:
        return (
          <svg className="icon-svg bento-icon" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  return (
    <section id="about" className="section about-section">
      <div className="container">
        
        {/* Section Header */}
        <div 
          ref={headerRef} 
          className={`section-header about-header reveal-fade ${headerVisible ? 'reveal-active' : ''}`}
        >
          <span className="section-subtitle">KEUNGGULAN PINPLAY</span>
          <h2 className="section-title">Fitur Premium Khusus Untuk Server Anda</h2>
          <p className="section-desc max-w-7xl mx-auto">
            PinPlay dirancang menggunakan teknologi audio Lavalink v4.0.0 untuk memastikan pemutaran musik yang lancar, hemat CPU, dan responsif.
          </p>
        </div>

        {/* Bento Grid (Bento 2.0 Style) */}
        <div 
          ref={gridRef} 
          className={`bento-grid reveal-fade-cards ${gridVisible ? 'reveal-active' : ''}`}
        >
          {config.features.map((feature, index) => {
            // Give some cards custom sizes to create bento layout dynamics
            const isFeatured = index === 0 || index === 3;
            
            return (
              <div 
                key={feature.id} 
                className={`bento-card ${isFeatured ? 'bento-featured' : ''}`}
                style={{ '--card-index': index }}
              >
                <div className="bento-card-glow"></div>
                <div className="bento-icon-wrapper">
                  {getIcon(feature.icon)}
                </div>
                <div className="bento-card-content">
                  <h3 className="bento-title">{feature.title}</h3>
                  <p className="bento-desc">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .about-section {
          background-color: var(--bg-offset);
          position: relative;
        }

        .text-center {
          text-align: center;
        }

        .about-header {
          /* Inherits from global .section-header */
          gap: 12px;
        }

        /* Bento Grid 2.0 specs */
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .bento-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        .bento-card {
          grid-column: span 1;
          background-color: var(--white);
          border: 1px solid rgba(44, 43, 41, 0.08);
          border-radius: var(--radius-lg);
          padding: 36px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 20px;
          justify-content: space-between;
        }

        @media (min-width: 768px) {
          .bento-card {
            grid-column: span 3;
          }
          
          .bento-featured {
            grid-column: span 3;
          }
          
          .bento-grid > .bento-card:nth-child(1) {
            grid-column: span 4;
          }
          .bento-grid > .bento-card:nth-child(2) {
            grid-column: span 2;
          }
          .bento-grid > .bento-card:nth-child(3) {
            grid-column: span 2;
          }
          .bento-grid > .bento-card:nth-child(4) {
            grid-column: span 4;
          }
          .bento-grid > .bento-card:nth-child(5) {
            grid-column: span 3;
          }
          .bento-grid > .bento-card:nth-child(6) {
            grid-column: span 3;
          }
        }

        /* GPU-Accelerated Reveal transitions */
        .reveal-fade > * {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .reveal-fade.reveal-active > * {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal-fade.reveal-active > .section-subtitle { transition-delay: 0.05s; }
        .reveal-fade.reveal-active > .section-title { transition-delay: 0.15s; }
        .reveal-fade.reveal-active > .section-desc { transition-delay: 0.25s; }

        .reveal-fade-cards .bento-card {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1) calc(var(--card-index) * 100ms),
                      transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) calc(var(--card-index) * 100ms),
                      box-shadow 0.3s ease,
                      border-color 0.3s ease,
                      background-color 0.3s ease;
        }

        .reveal-fade-cards.reveal-active .bento-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* Override transition delay on hover immediately to avoid hover lag */
        .bento-card:hover {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s,
                      box-shadow 0.3s ease 0s,
                      border-color 0.3s ease 0s,
                      background-color 0.3s ease 0s;
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(165, 214, 241, 0.5);
        }

        .bento-card-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at top left, rgba(165, 214, 241, 0.15), transparent 60%);
          pointer-events: none;
          opacity: 0;
          transition: var(--smooth-transition);
        }

        .bento-card:hover .bento-card-glow {
          opacity: 1;
        }

        .bento-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background-color: var(--bg-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dark);
          border: 1px solid rgba(44, 43, 41, 0.05);
          transition: var(--spring-transition);
        }

        .bento-card:hover .bento-icon-wrapper {
          background-color: var(--primary);
          color: var(--text-dark);
          transform: scale(1.08) rotate(5deg);
        }

        .spotify-svg {
          color: #1DB954;
        }

        .bento-card:hover .spotify-svg {
          color: var(--text-dark);
        }

        .bento-card-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bento-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-dark);
          letter-spacing: -0.01em;
        }

        .bento-desc {
          font-size: 0.9375rem;
          line-height: 1.5;
          color: var(--text-muted);
        }
      `}</style>
    </section>
  );
}
