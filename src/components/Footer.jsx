import React from 'react';
import { config } from '../config';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-area">
      <div className="container footer-grid">
        
        {/* Branding Column */}
        <div className="footer-brand">
          <div className="brand-group">
            <img src="/PinPLay-Logo.png" alt="PinPlay Logo" className="footer-logo-img" />
            <span className="footer-logo-text">{config.botName}</span>
          </div>
          <p className="brand-desc">
            Musik berkualitas tinggi untuk komunitas Discord Anda. Didukung oleh Lavalink v4.0.0.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Navigasi</h4>
          <a href="#hero" className="footer-link-anchor">Home</a>
          <a href="#about" className="footer-link-anchor">Fitur</a>
          <a href="#commands" className="footer-link-anchor">Daftar Command</a>
          <a href="#invite" className="footer-link-anchor">Panduan Setup</a>
        </div>

        {/* Links Column 2 */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Tautan</h4>
          <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" className="footer-link-anchor">
            GitHub Repository
          </a>
          <a href={config.defaultInviteLink} target="_blank" rel="noopener noreferrer" className="footer-link-anchor">
            Invite Bot
          </a>
          <a href={config.lavalinkDocsUrl} target="_blank" rel="noopener noreferrer" className="footer-link-anchor">
            Lavalink Documentation
          </a>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <span className="copyright-text">
            &copy; {currentYear} {config.botName}. All rights reserved.
          </span>
          <span className="creator-text">
            Desain terinspirasi oleh logo PinPlay.
          </span>
        </div>
      </div>

      <style>{`
        .footer-area {
          background-color: var(--text-dark);
          color: rgba(255, 255, 255, 0.7);
          padding-top: 60px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          padding-bottom: 40px;
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr;
          }
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-logo-img {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }

        .footer-logo-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--white);
          letter-spacing: -0.02em;
        }

        .brand-desc {
          font-size: 0.875rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.5);
          max-width: 32ch;
        }

        .footer-links-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-col-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--white);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .footer-link-anchor {
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          font-size: 0.875rem;
          transition: var(--smooth-transition);
          align-self: flex-start;
        }

        .footer-link-anchor:hover {
          color: var(--primary);
          padding-left: 4px;
        }

        /* Bottom copyright */
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 24px 0;
          background-color: #201f1d;
        }

        .footer-bottom-flex {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
        }

        @media (min-width: 768px) {
          .footer-bottom-flex {
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>
    </footer>
  );
}
