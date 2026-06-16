import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { config } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Commands() {
  const containerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('music');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCommand, setExpandedCommand] = useState(null);

  useGSAP(() => {
    // Reveal commands container elements on scroll
    gsap.from('.commands-header > *', {
      scrollTrigger: {
        trigger: '.commands-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  // Filter commands by active category and search query
  const filteredCommands = config.commands.filter(cmd => {
    const matchesCategory = cmd.category === activeCategory;
    const matchesSearch = 
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.syntax.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleCommandDetails = (name) => {
    if (expandedCommand === name) {
      setExpandedCommand(null);
    } else {
      setExpandedCommand(name);
    }
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'music':
        return (
          <svg className="icon-svg tab-icon" viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px' }}>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        );
      case 'control':
        return (
          <svg className="icon-svg tab-icon" viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px' }}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        );
      case 'setup':
        return (
          <svg className="icon-svg tab-icon" viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px' }}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
      case 'ai':
        return (
          <svg className="icon-svg tab-icon" viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px' }}>
            <rect x="4" y="6" width="16" height="12" rx="3" />
            <circle cx="9" cy="12" r="1.2" />
            <circle cx="15" cy="12" r="1.2" />
            <path d="M12 3v3M8 18v3M16 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="commands" className="section commands-section" ref={containerRef}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header commands-header">
          <span className="section-subtitle">DOKUMENTASI COMMAND</span>
          <h2 className="section-title">Panduan Command Interaktif Lengkap</h2>
          <p className="section-desc">
            Gunakan filter pencarian atau jelajahi kategori command di bawah ini untuk melihat detail parameter, kegunaan, dan hak izin command secara menyeluruh.
          </p>
        </div>

        {/* Dashboard layout */}
        <div className="commands-dashboard glass-panel">
          
          {/* Controls Bar: Search & Category switcher */}
          <div className="commands-controls">
            
            {/* Category Tabs */}
            <div className="category-tabs">
              {config.commandCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`tab-btn ${activeCategory === cat.id ? 'tab-active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setExpandedCommand(null);
                  }}
                >
                  {getCategoryIcon(cat.id)}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Command Search Box */}
            <div className="search-box-wrapper">
              <svg className="icon-svg search-icon" viewBox="0 0 24 24" width="18" height="18">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cari command..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setExpandedCommand(null);
                }}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

          </div>

          {/* Active category explanation */}
          <div className="category-banner">
            <p className="category-banner-text">
              {config.commandCategories.find(c => c.id === activeCategory)?.description}
            </p>
          </div>

          {/* Commands list */}
          <div className="commands-list">
            {filteredCommands.length > 0 ? (
              filteredCommands.map(cmd => {
                const isExpanded = expandedCommand === cmd.name;
                
                return (
                  <div 
                    key={cmd.name} 
                    className={`command-item ${isExpanded ? 'command-expanded' : ''}`}
                  >
                    {/* Row Header Trigger */}
                    <div 
                      className="command-row-header"
                      onClick={() => toggleCommandDetails(cmd.name)}
                    >
                      <div className="command-name-badge">
                        <span className="slash-symbol">/</span>
                        <span className="cmd-name">{cmd.name}</span>
                      </div>
                      <div className="command-short-desc">{cmd.description}</div>
                      <div className="command-arrow-icon">
                        <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18">
                          <polyline points={isExpanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                        </svg>
                      </div>
                    </div>

                    {/* Expanding Details Panel */}
                    <div className="command-details-wrapper">
                      <div className="command-details-inner">
                        
                        {/* 1. Syntax Display */}
                        <div className="detail-split" style={{ marginBottom: '16px' }}>
                          <div className="detail-section">
                            <div className="detail-section-label">Syntax Slash Command</div>
                            <div className="code-block-syntax">
                              <span className="syntax-prefix">slash</span>
                              <code>{cmd.syntax}</code>
                            </div>
                          </div>
                          {cmd.prefix && (
                            <div className="detail-section">
                              <div className="detail-section-label">Syntax Prefix Alias</div>
                              <div className="code-block-syntax" style={{ borderLeft: '3px solid var(--secondary)' }}>
                                <span className="syntax-prefix" style={{ color: 'var(--secondary)' }}>prefix</span>
                                <code>{cmd.prefix}</code>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 2. Command Details Narrative */}
                        <div className="detail-section">
                          <div className="detail-section-label">Detail Cara Kerja</div>
                          <p className="detail-narrative">{cmd.details}</p>
                        </div>

                        {/* 3. Parameter explanation */}
                        {cmd.parameters.length > 0 && (
                          <div className="detail-section">
                            <div className="detail-section-label">Parameter Command</div>
                            <div className="table-responsive">
                              <table className="param-table">
                                <thead>
                                  <tr>
                                    <th>Parameter</th>
                                    <th>Tipe</th>
                                    <th>Sifat</th>
                                    <th>Penjelasan</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cmd.parameters.map(param => (
                                    <tr key={param.name}>
                                      <td className="param-cell-name">{param.name}</td>
                                      <td className="param-cell-type">
                                        <span className="type-badge">{param.type}</span>
                                      </td>
                                      <td>
                                        {param.required ? (
                                          <span className="badge-required">Wajib</span>
                                        ) : (
                                          <span className="badge-optional">Opsional</span>
                                        )}
                                      </td>
                                      <td>{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* 4. Tips & Permissions */}
                        <div className="detail-split">
                          <div className="detail-split-box">
                            <div className="detail-section-label">Tips & Trik</div>
                            <p className="detail-split-text">{cmd.tips}</p>
                          </div>
                          <div className="detail-split-box">
                            <div className="detail-section-label">Hak Izin (Permissions)</div>
                            <p className="detail-split-text">{cmd.permissions}</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="commands-empty-state">
                <svg className="icon-svg empty-state-icon" viewBox="0 0 24 24" width="48" height="48">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
                <div className="empty-title">Command tidak ditemukan</div>
                <p className="empty-desc">Tidak ada command yang cocok dengan kata kunci "{searchQuery}"</p>
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        .commands-section {
          background-color: var(--bg-color);
          position: relative;
        }

        .commands-dashboard {
          max-width: var(--max-width);
          margin: 0 auto;
          background-color: rgba(255, 255, 255, 0.5);
          border: 1px solid var(--glass-border);
          padding: 24px;
        }

        .commands-controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }

        @media (min-width: 992px) {
          .commands-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        /* Tabs styling */
        .category-tabs {
          display: flex;
          background-color: rgba(44, 43, 41, 0.05);
          border-radius: var(--radius-md);
          padding: 6px;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
        }

        .category-tabs::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        .tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          white-space: nowrap;
          transition: var(--spring-transition);
        }

        .tab-btn:hover {
          color: var(--text-dark);
          background-color: rgba(255, 255, 255, 0.4);
        }

        .tab-active {
          color: var(--text-dark);
          background-color: var(--white);
          box-shadow: var(--shadow-sm);
        }

        /* Search input bar */
        .search-box-wrapper {
          position: relative;
          width: 100%;
          max-width: 380px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 46px;
          padding-left: 44px;
          padding-right: 40px;
          font-family: var(--font-sans);
          font-size: 0.9375rem;
          background-color: var(--white);
          border: 1px solid rgba(44, 43, 41, 0.1);
          color: var(--text-dark);
          border-radius: var(--radius-md);
          outline: none;
          transition: var(--spring-transition);
        }

        .search-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(165, 214, 241, 0.25);
        }

        .clear-search-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 50%;
        }

        .clear-search-btn:hover {
          background-color: rgba(44, 43, 41, 0.05);
          color: var(--text-dark);
        }

        /* Banner banner */
        .category-banner {
          background-color: rgba(165, 214, 241, 0.15);
          border-left: 3px solid var(--primary);
          padding: 14px 20px;
          border-radius: 4px var(--radius-sm) var(--radius-sm) 4px;
          margin-bottom: 24px;
        }

        .category-banner-text {
          font-size: 0.875rem;
          color: var(--text-dark);
          font-weight: 500;
        }

        /* Commands list container */
        .commands-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .command-item {
          background-color: var(--white);
          border: 1px solid rgba(44, 43, 41, 0.06);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: var(--spring-transition);
        }

        .command-item:hover {
          border-color: rgba(44, 43, 41, 0.12);
          box-shadow: var(--shadow-sm);
        }

        .command-row-header {
          display: grid;
          grid-template-columns: 140px 1fr 40px;
          align-items: center;
          padding: 18px 24px;
          cursor: pointer;
          gap: 16px;
          user-select: none;
        }

        @media (max-width: 768px) {
          .command-row-header {
            grid-template-columns: 1fr 30px;
            padding: 14px 18px;
            gap: 8px;
          }
          
          .command-short-desc {
            grid-column: span 2;
            font-size: 0.875rem;
          }
        }

        .command-name-badge {
          display: flex;
          align-items: center;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-dark);
        }

        .slash-symbol {
          color: var(--secondary);
          margin-right: 2px;
        }

        .command-short-desc {
          color: var(--text-muted);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .command-arrow-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: var(--spring-transition);
        }

        .command-expanded .command-arrow-icon {
          color: var(--secondary);
        }

        /* Expanding Details panel */
        .command-details-wrapper {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .command-expanded .command-details-wrapper {
          max-height: 1200px; /* Arbitrary high value to allow full expansion */
          border-top: 1px solid rgba(44, 43, 41, 0.05);
        }

        .command-details-inner {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          background-color: var(--bg-offset);
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-section-label {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--secondary);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Code block syntax */
        .code-block-syntax {
          background-color: var(--text-dark);
          color: #f7fafc;
          padding: 12px 18px;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.9375rem;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .syntax-prefix {
          color: var(--primary);
          opacity: 0.7;
          user-select: none;
        }

        .detail-narrative {
          font-size: 0.9375rem;
          line-height: 1.5;
          color: var(--text-muted);
        }

        /* Parameters Table */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(44, 43, 41, 0.08);
        }

        .param-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          background-color: var(--white);
          font-size: 0.875rem;
        }

        .param-table th, .param-table td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(44, 43, 41, 0.05);
        }

        .param-table th {
          background-color: rgba(44, 43, 41, 0.03);
          font-weight: 700;
          color: var(--text-dark);
        }

        .param-table tr:last-child td {
          border-bottom: none;
        }

        .param-cell-name {
          font-family: var(--font-mono);
          font-weight: 700;
          color: var(--text-dark);
        }

        .type-badge {
          background-color: rgba(165, 214, 241, 0.2);
          color: #3182ce;
          font-family: var(--font-mono);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-required {
          background-color: rgba(229, 62, 62, 0.1);
          color: #e53e3e;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .badge-optional {
          background-color: rgba(72, 187, 120, 0.1);
          color: #38a169;
          font-weight: 600;
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* Tips split box */
        .detail-split {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 768px) {
          .detail-split {
            grid-template-columns: 1fr 1fr;
          }
        }

        .detail-split-box {
          background-color: var(--white);
          border: 1px solid rgba(44, 43, 41, 0.06);
          padding: 18px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-split-text {
          font-size: 0.875rem;
          line-height: 1.5;
          color: var(--text-muted);
        }

        /* Empty states */
        .commands-empty-state {
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .empty-state-icon {
          color: var(--text-muted);
          opacity: 0.4;
        }

        .empty-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .empty-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          max-width: 40ch;
        }
      `}</style>
    </section>
  );
}
