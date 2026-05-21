import styles from '@/styles/Landing.module.css';

export default function LandingPage() {
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
            <button className={styles.loginBtn}>
              CONNECT WITH SPOTIFY
            </button>

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
                  <polygon fill="rgba(30,215,96,0.15)" stroke="#1ed760" strokeWidth="2" points="50,15 85,30 60,70 50,85 15,60 25,20" />
                  {/* Data Points */}
                  <circle cx="50" cy="15" r="2.5" fill="#1ed760" />
                  <circle cx="85" cy="30" r="2.5" fill="#1ed760" />
                  <circle cx="60" cy="70" r="2.5" fill="#1ed760" />
                  <circle cx="50" cy="85" r="2.5" fill="#1ed760" />
                  <circle cx="15" cy="60" r="2.5" fill="#1ed760" />
                  <circle cx="25" cy="20" r="2.5" fill="#1ed760" />
                </svg>
                <div className={styles.radarLabelTop}>Acoustic</div>
                <div className={styles.radarLabelBottom}>Energy</div>
              </div>

              {/* Stat Pills Row */}
              <div className={styles.statPills}>
                <div className={styles.pill}>
                  <span className={styles.pillDotWarning}></span>
                  <span className={styles.pillText}>142 BPM</span>
                </div>
                <div className={styles.pill}>
                  <span className={styles.pillDotAnnounce}></span>
                  <span className={styles.pillText}>Minor</span>
                </div>
                <div className={styles.pill}>
                  <span className={styles.pillDotPrimary}></span>
                  <span className={styles.pillText}>High Vocals</span>
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
