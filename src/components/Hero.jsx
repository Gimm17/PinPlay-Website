import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { config } from '../config';

export default function Hero() {
  const heroRef = useRef(null);
  const cardRef = useRef(null);
  
  // Parallax elements
  const butterfly1Ref = useRef(null);
  const butterfly2Ref = useRef(null);
  const moonRef = useRef(null);
  const waveRef = useRef(null);

// Music Player Audio & Simulation State
  const [isPlaying, setIsPlaying] = useState(false); // Default to false to prevent autoplay policy errors
  const [progress, setProgress] = useState(0); // Percentage
  const [currentTime, setCurrentTime] = useState(0); // seconds
  const [totalDuration, setTotalDuration] = useState(30); // iTunes preview default is 30s
  const [isLoop, setIsLoop] = useState(true); // Default loop to true

  const audioRef = useRef(null);

  // Initialize Audio
  useEffect(() => {
    const audio = new Audio("https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/13/9e/63/139e638f-19da-dcb3-a752-dc12cd2c6179/mzaf_15796905219858257190.plus.aac.p.m4a");
    audio.volume = 0.3; // Safe volume level
    audio.loop = isLoop;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(Math.floor(audio.currentTime));
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setTotalDuration(Math.floor(audio.duration));
    };

    const handleEnded = () => {
      if (!audio.loop) {
        setIsPlaying(false);
        setCurrentTime(0);
        setProgress(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.log("Play prevented by browser autoplay policy:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Sync loop setting
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
    }
  }, [isLoop]);

  // Format seconds to M:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Click on progress bar to seek
  const handleProgressClick = (e) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = clickX / width;
    
    const newTime = clickPercentage * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(Math.floor(newTime));
    setProgress(clickPercentage * 100);
  };

  // Controller functions
  const handleShuffle = () => {
    if (audioRef.current && audioRef.current.duration) {
      const randomTime = Math.random() * audioRef.current.duration;
      audioRef.current.currentTime = randomTime;
      setCurrentTime(Math.floor(randomTime));
      setProgress((randomTime / audioRef.current.duration) * 100);
    }
  };

  const handlePrev = () => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - 5);
      audioRef.current.currentTime = newTime;
      setCurrentTime(Math.floor(newTime));
    }
  };

  const handleNext = () => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
      audioRef.current.currentTime = newTime;
      setCurrentTime(Math.floor(newTime));
    }
  };

  const handleVolumeDown = () => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.1);
    }
  };

  const handleVolumeUp = () => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, audioRef.current.volume + 0.1);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
    setProgress(0);
  };

  const toggleLoop = () => {
    setIsLoop(!isLoop);
  };

  // GSAP Entrance and Mouse Move Parallax Animations
  useGSAP(() => {
    // 1. Entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    tl.from('.hero-badge', { opacity: 0, y: -20, delay: 0.2 })
      .from('.hero-title span', { opacity: 0, y: 40, stagger: 0.15 }, '-=0.8')
      .from('.hero-desc', { opacity: 0, y: 20 }, '-=0.7')
      .from('.hero-ctas', { opacity: 0, y: 20 }, '-=0.7')
      .from(cardRef.current, { opacity: 0, scale: 0.9, rotateY: 15, x: 50 }, '-=0.9')
      .from([butterfly1Ref.current, butterfly2Ref.current, moonRef.current, waveRef.current], {
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        duration: 0.8
      }, '-=0.8');

    // 2. Mouse move parallax handler
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse position from -0.5 to 0.5
      const mouseX = (clientX / innerWidth) - 0.5;
      const mouseY = (clientY / innerHeight) - 0.5;

      // Animate layout elements in opposite directions / speeds
      gsap.to(cardRef.current, {
        rotateY: mouseX * 25,
        rotateX: -mouseY * 25,
        x: mouseX * 20,
        y: mouseY * 20,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.to(butterfly1Ref.current, {
        x: -mouseX * 60,
        y: -mouseY * 60,
        rotate: -mouseX * 15,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.to(butterfly2Ref.current, {
        x: -mouseX * 40,
        y: -mouseY * 40,
        rotate: mouseX * 10,
        duration: 0.9,
        ease: 'power2.out'
      });

      gsap.to(moonRef.current, {
        x: mouseX * 30,
        y: mouseY * 30,
        rotate: mouseX * 5,
        duration: 0.7,
        ease: 'power2.out'
      });

      gsap.to(waveRef.current, {
        x: -mouseX * 50,
        y: -mouseY * 20,
        duration: 0.8,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, { scope: heroRef });

  return (
    <section id="hero" className="hero-section" ref={heroRef}>
      <div className="glow-accent glow-primary"></div>
      <div className="glow-accent glow-secondary"></div>
      
      <div className="container hero-grid">
        {/* Left Side: Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot animate-pulse-slow"></span>
            <span className="badge-text">v4.0.0 Online</span>
          </div>

          <h1 className="hero-title">
            <span>Putar Musik</span>
            <br />
            <span className="accent-text-blue">Kualitas HD</span>
            <br />
            <span>Tanpa Ribet.</span>
          </h1>

          <p className="hero-desc">
            {config.description} Dikonfigurasi menggunakan menu visual interaktif dan setup sekejap.
          </p>

          <div className="hero-ctas">
            <a href={config.defaultInviteLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              <span>Mulai Invite Bot</span>
              <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18" style={{ marginLeft: '8px' }}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </a>
            <a href="#commands" className="btn btn-glass btn-lg">
              <span>Daftar Command</span>
              <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18" style={{ marginLeft: '8px' }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Side: Interactive Mockup Panel */}
        <div className="hero-visual">
          {/* Logo Parallax Background Elements */}
          <div className="parallax-bg-wrapper">
            <div ref={moonRef} className="parallax-moon">
              {/* Crescent Moon Arc Design SVG */}
              <svg viewBox="0 0 200 200" width="160" height="160">
                <path 
                  d="M160,30 A90,90 0 1,0 160,170 A75,75 0 1,1 160,30" 
                  fill="#A5D6F1" 
                  stroke="#2C2B29" 
                  strokeWidth="3" 
                />
              </svg>
            </div>
            
            <div ref={waveRef} className="parallax-wave">
              {/* Waves matching Logo Wave Pattern */}
              <svg viewBox="0 0 200 100" width="180" height="90">
                <path 
                  d="M10,80 Q40,40 80,70 T150,60 T190,80" 
                  fill="none" 
                  stroke="#A5D6F1" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M20,90 Q50,60 90,80 T160,70 T180,90" 
                  fill="none" 
                  stroke="#2C2B29" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>

            <div ref={butterfly1Ref} className="parallax-butterfly-lg">
              {/* Giant Butterfly Vector */}
              <svg viewBox="0 0 120 120" width="100" height="100">
                {/* Left wing (pink) */}
                <path d="M50,60 C40,40 10,20 15,50 C18,65 35,70 50,75 C35,85 18,90 22,100 C27,108 45,95 50,85 Z" fill="#EFAAB9" stroke="#2C2B29" strokeWidth="2.5" />
                {/* Right wing (blue) */}
                <path d="M70,60 C80,40 110,20 105,50 C102,65 85,70 70,75 C85,85 102,90 98,100 C93,108 75,95 70,85 Z" fill="#A5D6F1" stroke="#2C2B29" strokeWidth="2.5" />
                {/* Body */}
                <ellipse cx="60" cy="75" rx="3" ry="20" fill="#2C2B29" />
                {/* Antennae */}
                <path d="M59,55 Q55,40 48,38 M61,55 Q65,40 72,38" fill="none" stroke="#2C2B29" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <div ref={butterfly2Ref} className="parallax-butterfly-sm">
              {/* Secondary Little Butterfly */}
              <svg viewBox="0 0 80 80" width="45" height="45">
                <path d="M35,40 C28,25 5,12 8,32 C10,42 22,46 35,50" fill="#EFAAB9" stroke="#2C2B29" strokeWidth="1.5" />
                <path d="M45,40 C52,25 75,12 72,32 C70,42 58,46 45,50" fill="#A5D6F1" stroke="#2C2B29" strokeWidth="1.5" />
                <ellipse cx="40" cy="48" rx="2" ry="12" fill="#2C2B29" />
                <path d="M39,36 Q36,25 31,23 M41,36 Q44,25 49,23" fill="none" stroke="#2C2B29" strokeWidth="1.2" />
              </svg>
            </div>
          </div>

          {/* Interactive Music Card */}
          <div ref={cardRef} className="glass-panel music-panel-card">
            {/* Discord Header Sim */}
            <div className="card-discord-header">
              <div className="discord-dots">
                <span className="dot-red"></span>
                <span className="dot-yellow"></span>
                <span className="dot-green"></span>
              </div>
              <div className="discord-title"># music-player</div>
            </div>

            {/* Now Playing visual */}
            <div className="now-playing-container">
              <div className="vinyl-disk-wrapper">
                <div className={`vinyl-disk ${isPlaying ? 'vinyl-spin' : ''}`}>
                  <div className="vinyl-center">
                    <img src="/PinPLay-Logo.png" alt="Vinyl logo center" className="vinyl-center-logo" />
                  </div>
                </div>
              </div>
              
              <div className="track-details">
                <div className="now-playing-label">SEDANG DIPUTAR</div>
                <div className="track-title">Butterflies</div>
                <div className="track-artist">by Abe Parker</div>
                <div className="track-requester">Requested by: @Lyvn.</div>
              </div>
            </div>

            {/* Progress Slider */}
            <div className="player-progress-area">
              <div className="progress-bar-container" onClick={handleProgressClick} style={{ cursor: 'pointer' }}>
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                  <span className="progress-thumb"></span>
                </div>
              </div>
              <div className="progress-time-labels">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Simulated discord message buttons layout (2 rows of 5) */}
            <div className="player-controls-grid">
              {/* Row 1 */}
              <button className="control-btn" title="Shuffle" onClick={handleShuffle} aria-label="Shuffle">
                <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18"><path d="M16 3h5v5M4 20l17-17M4 4l5 5M12 12l9 9M16 21h5v-5" /></svg>
              </button>
              <button className="control-btn" title="Previous" onClick={handlePrev} aria-label="Prev">
                <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18"><path d="M19 20L9 12l10-8v16zM5 19V5" /></svg>
              </button>
              <button 
                className="control-btn play-pause-btn btn-active-effect" 
                title={isPlaying ? 'Pause' : 'Resume'} 
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label="Play/Pause"
              >
                {isPlaying ? (
                  <svg className="icon-svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg className="icon-svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ marginLeft: '2px' }}><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <button className="control-btn" title="Next" onClick={handleNext} aria-label="Next">
                <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18"><path d="M5 4l10 8-10 8V4zM19 5v14" /></svg>
              </button>
              <a href="#commands" className="control-btn" title="Daftar Command" aria-label="Daftar Command" style={{ textDecoration: 'none' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
              </a>
              
              {/* Row 2 */}
              <button 
                className="control-btn" 
                title="Loop Mode" 
                onClick={toggleLoop} 
                aria-label="Loop"
                style={isLoop ? { backgroundColor: 'var(--primary)', borderColor: 'rgba(44, 43, 41, 0.2)' } : {}}
              >
                <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18"><path d="M17 1l4 4-4 4M21 5H9a5 5 0 0 0-5 5v3m3 8l-4-4 4-4M3 14h12a5 5 0 0 0 5-5V6" /></svg>
              </button>
              <button className="control-btn" title="Reduce Volume" onClick={handleVolumeDown} aria-label="Vol Down">
                <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              </button>
              <button className="control-btn" title="Increase Volume" onClick={handleVolumeUp} aria-label="Vol Up">
                <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              </button>
              <button className="control-btn stop-btn" title="Stop & Clear" onClick={handleStop} aria-label="Stop">
                <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4 4h16v16H4z" /></svg>
              </button>
              <a href={config.defaultInviteLink} target="_blank" rel="noopener noreferrer" className="control-btn add-btn" title="Invite Bot" aria-label="Invite Bot" style={{ textDecoration: 'none' }}>
                <svg className="icon-svg" viewBox="0 0 24 24" width="18" height="18"><path d="M12 5v14M5 12h14" /></svg>
              </a>
            </div>

            {/* Embed indicator */}
            <div className="active-mode-tag">
              <span className="indicator-pulse"></span>
              <span>Lavalink Node: Local Host</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          min-height: 100dvh; /* Viewport stability check passed */
          padding-top: 150px;
          padding-bottom: 80px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          perspective: 1000px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hero-badge {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(165, 214, 241, 0.25);
          border: 1px solid var(--primary);
          padding: 6px 14px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.8125rem;
          color: var(--text-dark);
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #48bb78;
        }

        .hero-title {
          font-family: var(--font-sans);
          letter-spacing: -0.04em;
        }

        .accent-text-blue {
          color: #7bbce0;
          background: linear-gradient(120deg, #6cadd2, var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          max-width: 54ch;
          font-size: 1.125rem;
          line-height: 1.6;
        }

        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 8px;
        }

        .btn-lg {
          padding: 16px 32px;
          font-size: 1rem;
          border-radius: var(--radius-md);
        }

        /* Right visual card styling */
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          min-height: 400px;
        }

        /* Parallax absolute background elements */
        .parallax-bg-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
        }

        .parallax-moon {
          position: absolute;
          top: -20px;
          left: -10px;
          opacity: 0.75;
          transform: rotate(-15deg);
        }

        .parallax-wave {
          position: absolute;
          bottom: -20px;
          right: -10px;
          opacity: 0.6;
        }

        .parallax-butterfly-lg {
          position: absolute;
          top: 30px;
          right: -20px;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.08));
        }

        .parallax-butterfly-sm {
          position: absolute;
          bottom: 30px;
          left: -20px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.06));
        }

        /* Music panel card styling */
        .music-panel-card {
          width: 100%;
          max-width: 420px;
          padding: 24px;
          border-radius: var(--radius-lg);
          z-index: 2;
          transform-style: preserve-3d;
          transition: transform 0.1s ease-out;
          border: 1px solid rgba(255, 255, 255, 0.7);
        }

        .card-discord-header {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(44, 43, 41, 0.08);
          padding-bottom: 10px;
        }

        .discord-dots {
          display: flex;
          gap: 6px;
          margin-right: 16px;
        }

        .discord-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .dot-red { background-color: #ff5f56; }
        .dot-yellow { background-color: #ffbd2e; }
        .dot-green { background-color: #27c93f; }

        .discord-title {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        /* Now playing container */
        .now-playing-container {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 20px;
        }

        .vinyl-disk-wrapper {
          position: relative;
        }

        .vinyl-disk {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, #333 30%, #111 70%);
          border: 4px solid #1a1a1a;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .vinyl-spin {
          animation: spin 6s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .vinyl-center {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--bg-color);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #000;
        }

        .vinyl-center-logo {
          width: 18px;
          height: 18px;
          object-fit: contain;
        }

        .track-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .now-playing-label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--secondary);
          letter-spacing: 0.1em;
        }

        .track-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-dark);
          line-height: 1.2;
        }

        .track-artist {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .track-requester {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          opacity: 0.8;
          margin-top: 2px;
        }

        /* Player progress */
        .player-progress-area {
          margin-bottom: 24px;
        }

        .progress-bar-container {
          height: 6px;
          background-color: rgba(44, 43, 41, 0.08);
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          overflow: visible;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          border-radius: 10px;
          position: relative;
          transition: width 0.2s ease;
        }

        .progress-thumb {
          position: absolute;
          right: -5px;
          top: -3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--text-dark);
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .progress-time-labels {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 6px;
        }

        /* Controls Grid layout (10 buttons) */
        .player-controls-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }

        .control-btn {
          height: 42px;
          border-radius: var(--radius-sm);
          background-color: rgba(255,255,255,0.8);
          border: 1px solid rgba(44, 43, 41, 0.1);
          color: var(--text-dark);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--spring-transition);
        }

        .control-btn:hover {
          transform: translateY(-2px);
          background-color: #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          border-color: rgba(44, 43, 41, 0.2);
        }

        .control-btn:active {
          transform: scale(0.92);
        }

        .play-pause-btn {
          background-color: var(--primary);
          border-color: rgba(44, 43, 41, 0.15);
        }

        .play-pause-btn:hover {
          background-color: #b7e0f6;
        }

        .stop-btn:hover {
          background-color: #ffdbdb;
          color: #e53e3e;
          border-color: #feb2b2;
        }

        .add-btn:hover {
          background-color: #dbf4ff;
          color: #3182ce;
          border-color: #90cdf4;
        }

        .active-mode-tag {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: rgba(44, 43, 41, 0.05);
          padding: 6px 12px;
          border-radius: var(--radius-sm);
        }

        .indicator-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--primary);
          box-shadow: 0 0 8px var(--primary);
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
