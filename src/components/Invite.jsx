import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { config } from '../config';

gsap.registerPlugin(ScrollTrigger);

export default function Invite() {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('player'); // 'player' or 'developer'

  useGSAP(() => {
    // Reveal section headers
    gsap.from('.invite-header > *', {
      scrollTrigger: {
        trigger: '.invite-header',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  return (
    <section id="invite" className="section invite-section" ref={containerRef}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header invite-header">
          <span className="section-subtitle">MEMULAI PEMAKAIAN</span>
          <h2 className="section-title">Panduan Mudah Invite & Setup</h2>
          <p className="section-desc">
            Pilih metode panduan di bawah ini untuk menambahkan PinPlay ke server Discord Anda atau mendirikan hosting server Lavalink Anda sendiri.
          </p>
        </div>

        {/* Setup Tab Switcher (Pill Style Segment) */}
        <div className="setup-tab-container">
          <div className="setup-tabs">
            <button 
              className={`setup-tab-btn ${activeTab === 'player' ? 'setup-tab-active' : ''}`}
              onClick={() => setActiveTab('player')}
            >
              <svg className="icon-svg tab-btn-icon" viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Player Quick-Start</span>
            </button>
            <button 
              className={`setup-tab-btn ${activeTab === 'developer' ? 'setup-tab-active' : ''}`}
              onClick={() => setActiveTab('developer')}
            >
              <svg className="icon-svg tab-btn-icon" viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px' }}>
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>Self-Hosting Developer</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Player quickstart */}
        {activeTab === 'player' && (
          <div className="player-setup-content">
            <div className="timeline-wrapper">
              {config.inviteSteps.map((step, idx) => (
                <div key={step.number} className="timeline-node">
                  {/* Circle number */}
                  <div className="node-number-wrapper">
                    <div className="node-number">{step.number}</div>
                    {idx < config.inviteSteps.length - 1 && <div className="node-connector"></div>}
                  </div>
                  {/* Content card */}
                  <div className="node-card glass-panel">
                    <h3 className="node-card-title">{step.title}</h3>
                    <p className="node-card-desc">{step.description}</p>
                    <ul className="node-card-sublist">
                      {step.substeps.map((sub, sIdx) => (
                        <li key={sIdx} className="node-card-subitem">
                          <svg className="icon-svg subitem-check" viewBox="0 0 24 24" width="16" height="16">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                    {idx === 0 && (
                      <a href={config.defaultInviteLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary node-cta-btn">
                        <span>Invite PinPlay Sekarang</span>
                        <svg className="icon-svg" viewBox="0 0 24 24" width="16" height="16" style={{ marginLeft: '6px' }}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m11-3h-6m6 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Developer Self Hosting */}
        {activeTab === 'developer' && (
          <div className="developer-setup-content">
            <div className="dev-steps-grid">
              {config.developerSteps.map((step, idx) => (
                <div key={step.number} className="dev-step-card glass-panel">
                  <div className="dev-step-header">
                    <div className="dev-step-badge">Langkah {step.number}</div>
                    <h3 className="dev-step-title">{step.title}</h3>
                  </div>
                  
                  <p className="dev-step-desc">{step.description}</p>

                  {/* Config code display */}
                  {step.configFile && (
                    <div className="dev-code-container">
                      <div className="dev-code-header">
                        <span>application.yml</span>
                        <span className="file-type-badge">YAML</span>
                      </div>
                      <pre className="dev-code-pre">
                        <code>{step.configFile}</code>
                      </pre>
                    </div>
                  )}

                  {step.envFile && (
                    <div className="dev-code-container">
                      <div className="dev-code-header">
                        <span>.env</span>
                        <span className="file-type-badge">ENV</span>
                      </div>
                      <pre className="dev-code-pre">
                        <code>{step.envFile}</code>
                      </pre>
                    </div>
                  )}

                  {/* Terminal commands display */}
                  {step.commands && step.commands.length > 0 && (
                    <div className="dev-commands-box">
                      <div className="dev-code-header">
                        <span>Terminal Console</span>
                        <span className="file-type-badge">Bash</span>
                      </div>
                      <div className="console-lines">
                        {step.commands.map((cmd, cIdx) => (
                          <div key={cIdx} className="console-line">
                            <span className="console-prompt">$</span>
                            <span className="console-cmd">{cmd}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        .invite-section {
          background-color: var(--bg-offset);
          position: relative;
        }

        .setup-tab-container {
          display: flex;
          justify-content: center;
          margin-bottom: 50px;
        }

        .setup-tabs {
          display: flex;
          background-color: rgba(44, 43, 41, 0.05);
          padding: 6px;
          border-radius: var(--radius-lg);
          gap: 6px;
          border: 1px solid rgba(44, 43, 41, 0.04);
        }

        .setup-tab-btn {
          display: flex;
          align-items: center;
          padding: 12px 28px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--text-muted);
          border-radius: var(--radius-md);
          transition: var(--spring-transition);
        }

        .setup-tab-btn:hover {
          color: var(--text-dark);
        }

        .setup-tab-active {
          background-color: var(--white);
          color: var(--text-dark);
          box-shadow: var(--shadow-sm);
        }

        .tab-btn-icon {
          color: inherit;
        }

        /* Player setup timeline design */
        .player-setup-content {
          max-width: var(--max-width-narrow);
          margin: 0 auto;
        }

        .timeline-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .timeline-node {
          display: grid;
          grid-template-columns: 50px 1fr;
          gap: 24px;
        }

        .node-number-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .node-number {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: var(--primary);
          border: 2px solid var(--text-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.125rem;
          color: var(--text-dark);
          z-index: 5;
          box-shadow: var(--shadow-sm);
        }

        .node-connector {
          width: 2px;
          flex-grow: 1;
          background-color: rgba(44, 43, 41, 0.15);
          margin-top: 8px;
          margin-bottom: -28px;
        }

        .node-card {
          padding: 28px;
          background-color: var(--white);
          border-radius: var(--radius-md);
          border-color: rgba(44, 43, 41, 0.06);
          transition: var(--spring-transition);
        }

        .node-card:hover {
          border-color: rgba(239, 170, 185, 0.5);
          transform: translateX(4px);
        }

        .node-card-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 8px;
        }

        .node-card-desc {
          font-size: 0.9375rem;
          margin-bottom: 16px;
        }

        .node-card-sublist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .node-card-subitem {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .subitem-check {
          color: #38a169;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .node-cta-btn {
          padding: 10px 20px;
          font-size: 0.875rem;
        }

        /* Developer self-hosting styles */
        .developer-setup-content {
          max-width: var(--max-width);
          margin: 0 auto;
        }

        .dev-steps-grid {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .dev-step-card {
          background-color: var(--white);
          border-color: rgba(44, 43, 41, 0.06);
          padding: 32px;
        }

        .dev-step-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        @media (min-width: 768px) {
          .dev-step-header {
            flex-direction: row;
            align-items: center;
            gap: 16px;
          }
        }

        .dev-step-badge {
          align-self: flex-start;
          background-color: var(--secondary);
          color: var(--text-dark);
          font-weight: 700;
          font-size: 0.75rem;
          padding: 4px 12px;
          border-radius: 50px;
          border: 1px solid rgba(44, 43, 41, 0.08);
          font-family: var(--font-mono);
        }

        .dev-step-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-dark);
        }

        .dev-step-desc {
          font-size: 0.9375rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          max-width: 80ch;
        }

        /* Code display containers */
        .dev-code-container, .dev-commands-box {
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid rgba(44, 43, 41, 0.1);
          margin-top: 16px;
        }

        .dev-code-header {
          background-color: rgba(44, 43, 41, 0.04);
          border-bottom: 1px solid rgba(44, 43, 41, 0.08);
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .file-type-badge {
          background-color: rgba(44, 43, 41, 0.06);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .dev-code-pre {
          background-color: var(--text-dark);
          color: #e2e8f0;
          padding: 16px 20px;
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          line-height: 1.5;
        }

        .dev-commands-box {
          background-color: #1a1a1a;
        }

        .console-lines {
          padding: 16px 20px;
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .console-line {
          display: flex;
          gap: 10px;
          line-height: 1.5;
        }

        .console-prompt {
          color: var(--primary);
          user-select: none;
        }

        .console-cmd {
          color: #f7fafc;
        }
      `}</style>
    </section>
  );
}
