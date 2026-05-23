"use client";

import styles from '@/styles/Landing.module.css';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [radarValues, setRadarValues] = useState([0.77, 0.77, 0.5, 0.77, 0.77, 0.5]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const featuresList = [
    "Acousticness",
    "Danceability",
    "Energy",
    "Instrumentalness",
    "Valence",
    "Speechiness"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarValues([
        Math.random() * (0.85 - 0.3) + 0.3,
        Math.random() * (0.85 - 0.3) + 0.3,
        Math.random() * (0.85 - 0.3) + 0.3,
        Math.random() * (0.85 - 0.3) + 0.3,
        Math.random() * (0.85 - 0.3) + 0.3,
        Math.random() * (0.85 - 0.3) + 0.3,
      ]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Compute vertices on axes based on scale factors
  const axesEndpoints = [
    { x: 50, y: 5 },   // Top
    { x: 95, y: 25 },  // Top-Right
    { x: 95, y: 75 },  // Bottom-Right
    { x: 50, y: 95 },  // Bottom
    { x: 5, y: 75 },   // Bottom-Left
    { x: 5, y: 25 }    // Top-Left
  ];

  const computedPoints = axesEndpoints.map((end, idx) => {
    const s = radarValues[idx];
    const x = 50 + (end.x - 50) * s;
    const y = 50 + (end.y - 50) * s;
    return { x, y };
  });

  const pointsString = computedPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Compute stats dynamically in sync with the graph
  const dynamicBpm = Math.round(110 + radarValues[1] * 60);
  const dynamicKey = radarValues[2] > 0.55 ? "Major" : "Minor";
  const dynamicVocals = radarValues[4] > 0.65 
    ? "High Vocals" 
    : radarValues[4] > 0.4 
      ? "Mixed Vocals" 
      : "Instrumental";

  // Generates safe bounding placement for tooltips to avoid clipping the card edges
  const getTooltipStyle = (idx) => {
    if (idx === null || idx === undefined) return {};
    const p = computedPoints[idx];
    let transform = 'translate(12px, -50%)';
    if (idx === 0) {
      transform = 'translate(-50%, -125%)';
    } else if (idx === 3) {
      transform = 'translate(-50%, 25%)';
    } else if (idx === 1 || idx === 2) {
      transform = 'translate(-112%, -50%)';
    } else if (idx === 4 || idx === 5) {
      transform = 'translate(12px, -50%)';
    }
    return {
      left: `${p.x.toFixed(1)}%`,
      top: `${p.y.toFixed(1)}%`,
      transform,
    };
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Top Left Wordmark */}
      <div className={styles.wordmark}>
        MusicDNA
      </div>

      {/* Main Layout Container */}
      <main className={styles.mainContent}>
        <div className={styles.layoutGrid}>

          {/* Left Hero Section */}
          <div className={styles.heroSection}>
            <h1 className={styles.title}>
              Discover Your Music <span className={styles.highlight}>DNA.</span>
            </h1>
            <p className={styles.subtitle}>
              AI-powered analytics and playlist generation built on your Spotify data.
            </p>
            <div className={styles.ctaButtonGroup}>
              <button
                className={styles.loginBtn}
                onClick={() => signIn('spotify', { callbackUrl: '/home' })}
              >
                CONNECT WITH SPOTIFY
              </button>
              <button
                className={styles.demoBtn}
                onClick={() => {
                  localStorage.setItem('musicdna_demo_mode', 'true');
                  router.push('/home');
                }}
              >
                TRY DEMO MODE
              </button>
            </div>

            {/* Feature Hints */}
            <div className={styles.featureHints}>
              <div className={styles.hintItem}>
                <span className={styles.hintDot}></span>
                Music Personality Report
              </div>
              <div className={styles.hintItem}>
                <span className={styles.hintDot}></span>
                AI Playlist Studio
              </div>
              <div className={styles.hintItem}>
                <span className={styles.hintDot}></span>
                Real-Time Analytics
              </div>
            </div>
          </div>

          {/* Right Dashboard Mockup Section */}
          <div className={styles.mockupSection}>
            <div className={styles.mockupCard}>

              {/* Header inside mockup */}
              <div className={styles.mockupHeader}>
                <div className={styles.mockupTitle}>Sonic Profile</div>
                <span className="material-symbols-outlined text-muted">more_horiz</span>
              </div>

              {/* Radar Chart Area */}
              <div className={styles.radarArea}>
                <svg className={styles.radarSvg} viewBox="0 0 100 100">
                  {/* Background Web */}
                  <polygon fill="none" stroke="#2e372e" strokeWidth="1" points="50,5 95,25 95,75 50,95 5,75 5,25" />
                  <polygon fill="none" stroke="#2e372e" strokeWidth="1" points="50,20 80,35 80,65 50,80 20,65 20,35" />
                  <polygon fill="none" stroke="#2e372e" strokeWidth="1" points="50,35 65,45 65,55 50,65 35,55 35,45" />
                  {/* Axes */}
                  <line stroke="#2e372e" strokeWidth="1" x1="50" y1="50" x2="50" y2="5" />
                  <line stroke="#2e372e" strokeWidth="1" x1="50" y1="50" x2="95" y2="25" />
                  <line stroke="#2e372e" strokeWidth="1" x1="50" y1="50" x2="95" y2="75" />
                  <line stroke="#2e372e" strokeWidth="1" x1="50" y1="50" x2="50" y2="95" />
                  <line stroke="#2e372e" strokeWidth="1" x1="50" y1="50" x2="5" y2="75" />
                  <line stroke="#2e372e" strokeWidth="1" x1="50" y1="50" x2="5" y2="25" />
                                  {/* Data Polygon */}
                  <polygon 
                    fill="rgba(30,215,96,0.15)" 
                    stroke="#1ed760" 
                    strokeWidth="2" 
                    points={pointsString} 
                    style={{ transition: 'all 2.4s ease-in-out' }}
                  />
                  {/* Highlight line connecting center to active vertex */}
                  {hoveredIndex !== null && (
                    <line 
                      stroke="#ffffff" 
                      strokeWidth="1.5" 
                      x1="50" 
                      y1="50" 
                      x2={computedPoints[hoveredIndex].x.toFixed(1)} 
                      y2={computedPoints[hoveredIndex].y.toFixed(1)}
                      style={{ transition: 'all 0.15s ease-out' }}
                    />
                  )}
                  {/* Data Points */}
                  {computedPoints.map((p, idx) => {
                    const isHovered = hoveredIndex === idx;
                    return (
                      <g key={idx}>
                        {/* Interactive Large Invisible Circle */}
                        <circle 
                          cx={p.x.toFixed(1)} 
                          cy={p.y.toFixed(1)} 
                          r="9" 
                          fill="transparent" 
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                        {/* Visual Dot */}
                        <circle 
                          cx={p.x.toFixed(1)} 
                          cy={p.y.toFixed(1)} 
                          r={isHovered ? "3.5" : "2.2"} 
                          fill="#1ed760" 
                          stroke={isHovered ? "#ffffff" : "none"}
                          strokeWidth={isHovered ? "1.5" : "0"}
                          style={{ 
                            transition: 'cx 2.4s ease-in-out, cy 2.4s ease-in-out, r 0.2s ease-out, stroke 0.2s ease-out', 
                            pointerEvents: 'none' 
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>
                <div className={styles.radarLabelTop}>Acoustic</div>
                <div className={styles.radarLabelBottom}>Energy</div>

                {/* Interactive Tooltip Overlay */}
                {hoveredIndex !== null && (
                  <div 
                    className={styles.radarTooltip}
                    style={getTooltipStyle(hoveredIndex)}
                  >
                    <div className={styles.tooltipTitle}>{featuresList[hoveredIndex]}</div>
                    <div className={styles.tooltipValue}>Music DNA : {Math.round(radarValues[hoveredIndex] * 100)}</div>
                  </div>
                )}
              </div>

              {/* Stat Pills Row */}
              <div className={styles.statPills}>
                <div className={styles.pill}>
                  <span className={styles.pillDotWarning}></span>
                  <span className={styles.pillText}>{dynamicBpm} BPM</span>
                </div>
                <div className={styles.pill}>
                  <span className={styles.pillDotAnnounce}></span>
                  <span className={styles.pillText}>{dynamicKey}</span>
                </div>
                <div className={styles.pill}>
                  <span className={styles.pillDotPrimary}></span>
                  <span className={styles.pillText}>{dynamicVocals}</span>
                </div>
              </div>

              {/* Now Playing Row */}
              <div className={styles.nowPlaying}>
                <div className={styles.npIcon}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--text-muted)' }}>graphic_eq</span>
                </div>
                <div className={styles.npText}>
                  <div className={styles.npTitle}>Midnight City</div>
                  <div className={styles.npArtist}>M83</div>
                </div>
                <div>
                  <span className={`material-symbols-outlined ${styles.playIcon}`}>play_arrow</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
