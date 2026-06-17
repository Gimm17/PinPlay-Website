import React, { useState, useEffect } from 'react';
import { config } from '../config';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`nav-bar ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#hero" className="nav-logo-group">
          <img src="/PinPLay-Logo.png" alt="PinPlay Logo" className="nav-logo-img" />
          <span className="nav-logo-text">{config.botName}</span>
        </a>

        {/* Desktop Nav Links */}
        <div className="nav-links-desktop">
          <a href="#about" className="nav-link">Fitur</a>
          <a href="#showcase" className="nav-link">Showcase</a>
          <a href="#commands" className="nav-link">Daftar Command</a>
          <a href="#changelog" className="nav-link">Changelog</a>
          <a href="#invite" className="nav-link">Panduan Setup</a>
          <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" className="nav-link-icon" title="GitHub Source Code">
            <svg className="icon-svg" viewBox="0 0 24 24" width="20" height="20">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </div>

        <div className="nav-actions-desktop">
          <a href={config.defaultInviteLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-nav">
            <span>Invite Bot</span>
            <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16" style={{ marginLeft: '6px' }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m11-3h-6m6 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`nav-mobile-toggle ${mobileMenuOpen ? 'toggle-active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`nav-mobile-drawer ${mobileMenuOpen ? 'drawer-open' : ''}`}>
        <div className="mobile-links">
          <a href="#about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Fitur</a>
          <a href="#showcase" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Showcase</a>
          <a href="#commands" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Daftar Command</a>
          <a href="#changelog" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Changelog</a>
          <a href="#invite" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Panduan Setup</a>
          <a href={config.githubUrl} target="_blank" rel="noopener noreferrer" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            GitHub Repository
          </a>
          <a 
            href={config.defaultInviteLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-primary mobile-invite-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            Invite Bot
          </a>
        </div>
      </div>

      <style>{`
        .nav-bar {
          position: fixed;
          top: 24px;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: var(--spring-transition);
          padding: 0 24px;
        }

        .nav-container {
          max-width: var(--max-width);
          margin: 0 auto;
          background-color: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--inner-shadow), var(--shadow-md);
          transition: var(--smooth-transition);
        }

        /* Scrolled navbar state */
        .nav-scrolled {
          top: 12px;
        }

        .nav-scrolled .nav-container {
          background-color: rgba(255, 255, 255, 0.7);
          padding: 10px 24px;
          border-radius: var(--radius-md);
          box-shadow: var(--inner-shadow), var(--shadow-lg);
        }

        .nav-logo-group {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--text-dark);
          transition: var(--smooth-transition);
        }

        .nav-logo-group:hover {
          opacity: 0.8;
          transform: scale(1.02);
        }

        .nav-logo-img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          transition: var(--spring-transition);
        }

        .nav-scrolled .nav-logo-img {
          width: 32px;
          height: 32px;
        }

        .nav-logo-text {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .nav-links-desktop {
          display: none;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          text-decoration: none;
          color: var(--text-dark);
          font-size: 0.9375rem;
          font-weight: 500;
          opacity: 0.8;
          transition: var(--smooth-transition);
          position: relative;
          padding: 6px 0;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--secondary);
          transition: var(--smooth-transition);
          border-radius: 1px;
        }

        .nav-link:hover {
          opacity: 1;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link-icon {
          color: var(--text-dark);
          opacity: 0.7;
          display: inline-flex;
          align-items: center;
          transition: var(--smooth-transition);
        }

        .nav-link-icon:hover {
          opacity: 1;
          transform: translateY(-1px);
        }

        .nav-actions-desktop {
          display: none;
        }

        .btn-nav {
          padding: 8px 18px;
          font-size: 0.875rem;
          border-radius: var(--radius-md);
        }

        /* Mobile Menu Toggle button */
        .nav-mobile-toggle {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 16px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1100;
        }

        .toggle-line {
          width: 100%;
          height: 2px;
          background-color: var(--text-dark);
          transition: var(--spring-transition);
          border-radius: 1px;
        }

        .toggle-active .toggle-line:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .toggle-active .toggle-line:nth-child(2) {
          opacity: 0;
          transform: scale(0);
        }

        .toggle-active .toggle-line:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Mobile drawer drawer */
        .nav-mobile-drawer {
          position: fixed;
          top: 0;
          right: -100%;
          width: 100%;
          max-width: 320px;
          height: 100vh;
          background-color: rgba(244, 240, 228, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-left: 1px solid var(--glass-border);
          box-shadow: var(--shadow-lg);
          z-index: 999;
          transition: var(--spring-transition);
          padding: 120px 40px 40px;
          display: flex;
          flex-direction: column;
        }

        .drawer-open {
          right: 0;
        }

        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mobile-link {
          text-decoration: none;
          color: var(--text-dark);
          font-size: 1.25rem;
          font-weight: 600;
          opacity: 0.85;
          transition: var(--smooth-transition);
        }

        .mobile-link:hover {
          opacity: 1;
          padding-left: 6px;
          color: var(--secondary);
        }

        .mobile-invite-btn {
          margin-top: 16px;
          width: 100%;
          padding: 14px;
        }

        @media (min-width: 768px) {
          .nav-links-desktop {
            display: flex;
          }
          
          .nav-actions-desktop {
            display: block;
          }

          .nav-mobile-toggle {
            display: none;
          }

          .nav-mobile-drawer {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
