import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Showcase from './components/Showcase';
import Commands from './components/Commands';
import Changelog from './components/Changelog';
import Invite from './components/Invite';
import Footer from './components/Footer';
import Login from './dashboard/Login';
import Dashboard from './dashboard/Dashboard';
import { getToken, clearToken } from './dashboard/api';

/**
 * Hash-based routing: "#/dashboard" opens the dashboard.
 *
 * Deliberately NOT react-router — the site is a single-page Vercel deploy and a
 * hash route needs no rewrite rules or extra dependency, while still being
 * linkable and surviving a refresh.
 */
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const hash = useHashRoute();
  const isDashboard = hash.startsWith('#/dashboard');

  // Re-read on route change so logging out is reflected immediately
  const [authed, setAuthed] = useState(() => Boolean(getToken()));
  useEffect(() => {
    setAuthed(Boolean(getToken()));
  }, [isDashboard]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    clearToken();
    setAuthed(false);
  };

  if (isDashboard) {
    return authed ? (
      <Dashboard onLogout={logout} />
    ) : (
      <Login onSuccess={() => setAuthed(true)} />
    );
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Showcase />
        <Commands />
        <Changelog />
        <Invite />
      </main>
      <Footer />

      {/* Floating Scroll to Top button */}
      <button 
        className={`scroll-top-btn ${showScrollTop ? 'scroll-btn-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg className="icon-svg" viewBox="0 0 24 24" width="20" height="20">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>

      <style>{`
        .app-wrapper {
          min-height: 100dvh;
          position: relative;
          background-color: var(--bg-color);
        }

        /* Floating scroll-top button */
        .scroll-top-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--white);
          border: 1px solid rgba(44, 43, 41, 0.1);
          color: var(--text-dark);
          box-shadow: var(--shadow-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transform: translateY(15px);
          transition: var(--spring-transition);
          z-index: 900;
        }

        .scroll-top-btn:hover {
          transform: translateY(-4px);
          background-color: var(--primary);
          color: var(--text-dark);
          box-shadow: var(--shadow-lg);
          border-color: rgba(44, 43, 41, 0.15);
        }

        .scroll-top-btn:active {
          transform: scale(0.92) translateY(-2px);
        }

        .scroll-btn-visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
