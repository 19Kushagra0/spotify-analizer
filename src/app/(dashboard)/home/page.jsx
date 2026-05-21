import styles from '@/styles/Home.module.css';

export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      
      {/* Row 1: Now Playing Card */}
      <div className={`${styles.card} ${styles.nowPlaying}`}>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpIbTVVADpAma2ksDjdi4Tdo-Bw5AnuS__b3rQIXguAYPpwkbcKUF6Z8_uzE9VLG9MkIdwZcR7eh_PcI1Eq_BbcBlJOElgBrRcNNcFk0yDBC2QTIN5bxgWlPuLAg0SLXSV4HoNTWttfA8Zgc0abGBjjbFnsESn6279LhjEZs30mBZ1VoIB83sYnI0as0PunCVIl01RJOPU4Lt4ElToOM1G9nwpLUtg2DqndDCvUyNC7bfiVSCvKvizz0CujpzSGEoPn8Bvxeh2DnEf" 
          alt="Album Art" 
          className={styles.albumArt}
        />
        <div className={styles.trackInfo}>
          <div className={styles.trackHeader}>
            <div>
              <h2 className={styles.trackTitle}>Midnight City</h2>
              <p className={styles.trackArtist}>M83</p>
            </div>
            <span className={styles.time}>3:14 / 4:03</span>
          </div>
          <div className={styles.progressBarBg}>
            <div className={styles.progressBarFill}></div>
          </div>
          <p className={styles.aiCaption}>
            Chosen for its melancholic minor key — matches your late-night pattern.
          </p>
        </div>
      </div>

      {/* Row 2: Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.card} ${styles.cardLg} ${styles.statCard}`}>
          <span className={styles.statLabel}>TOP GENRE</span>
          <h3 className={styles.statValue}>Dark Pop</h3>
        </div>
        <div className={`${styles.card} ${styles.cardLg} ${styles.statCard}`}>
          <span className={styles.statLabel}>CURRENT VIBE</span>
          <h3 className={styles.statValuePrimary}>High Energy</h3>
        </div>
        <div className={`${styles.card} ${styles.cardLg} ${styles.statCard}`}>
          <span className={styles.statLabel}>MINUTES THIS WEEK</span>
          <h3 className={styles.statValue}>1,847</h3>
        </div>
      </div>

      {/* Row 3: Two Column Layout */}
      <div className={styles.bottomGrid}>
        
        {/* Left: Mood Snapshot */}
        <div className={`${styles.card} ${styles.cardLg}`}>
          <h3 className={styles.sectionTitle}>Today's Mood Snapshot</h3>
          <p className={styles.moodText}>
            Your listening today suggests a focus-oriented mindset. You've gravitated towards mid-tempo electronic tracks with consistent rhythmic patterns, ideal for deep work sessions.
          </p>
        </div>

        {/* Right: Week in Music Chart */}
        <div className={`${styles.card} ${styles.cardLg}`} style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className={styles.sectionTitle}>Your Week in Music</h3>
          
          <div className={styles.chartArea}>
            {[
              { day: 'M', height: '40%' },
              { day: 'T', height: '65%' },
              { day: 'W', height: '85%' },
              { day: 'T', height: '50%' },
              { day: 'F', height: '90%' },
              { day: 'S', height: '100%', active: true },
              { day: 'S', height: '30%' },
            ].map((col, index) => (
              <div key={index} className={styles.chartColumn}>
                <div 
                  className={col.active ? styles.barActive : styles.barBg} 
                  style={{ height: col.height }}
                ></div>
                <span className={col.active ? styles.dayLabelActive : styles.dayLabel}>
                  {col.day}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
