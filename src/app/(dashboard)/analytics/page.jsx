import styles from '@/styles/Analytics.module.css';

export default function AnalyticsPage() {
  // Dummy Data Arrays (Ready for Spotify API later)
  const topTracks = [
    { name: "Midnight City", artist: "M83", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAukpnTOo3C7bUVlsyirPp3DhQ01oHG9vEmvtHK8-tGbB0dlOhQXpbRquYeapUIyUpYfNgcf-9UE4K5pFN7abMSd5VYHpFJAod7E59OdtAtR1ZoB4SR2lD_klPUROM91EvMTtoGYQoY2OezDNkT2_qwksbKZCKcw3Q5Zt-t-7VnsJmsP7Z5EjL5wrXV83xjHnQPRUNz-qRNQEcC-hfDLCsyBGuXDl90TQt0Ja4EpWFOtX_HgataZhMDJjqlq2v12I1Em3K7NwpkOY0s", score: "100%" },
    { name: "Nightcall", artist: "Kavinsky", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDUpXjaZLK4pIn4KumhlbTymgaElzgYMPjGjob267_5zbe1UCs_K9yG5HHq05qfYaD6ctshEw0a8wQK2w0KZEEc9Yiy34askzYkwU2_UGrg4SUv_fkAZncpkSAB8JuTm_3BqB-XVKDQbTldlSdIsuxYna2vXWWob5aEGQM9GcokRn1MN8KrrGTCc3nLtqYvcRxQ6HvQJWca4iDEpEeo-hg0cXTga970EyfOhlu9hB6nuSdD9lnzDac6_eDZITjr7eUuRL9wkz0hep0", score: "85%" },
    { name: "The Less I Know The Better", artist: "Tame Impala", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQK5kadZv5O6CDhM5Dsj_5zj1FS9oulN9CJEcD_rsd5BG7eQBKrcmb9wU_R9P26o9TCNNCcKF1pi_Ni5wNFjyqC4XtQcIsdeuAlvWo1s2K55J7YQi3h40R1HQiTabtGMlqTexl1PFcS7HT-ExANS6XrWA_GuVF7-31SEInFoGbmxShqjppg95b2WzfnohPBF0TutFcIGjGVhGYxbet29Tgt9S2Nw0PWa55Ikyy4ZGUZWZnxnqw2cjn66s0LpAbztFeG5agBfT14cwr", score: "75%" },
    { name: "Blinding Lights", artist: "The Weeknd", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHp38gwC2wx0qtcPt8OxhLxtM_2_LyJk4mmAerPOYm2XhTzrd5XVQx5GA293vMclP0Hs8cTY8Y8h9_BGuHQwa4vbfSi2vgDMFCzN-YjDA8nKHKucbTSn-LleBcGZDQRl6KHQMvB5DhjTZka8Jk1F4az2ksQduSoNAl1HhGZlYln-ApzlXkOfUsOXsOylIyDdWyvlsuoRCMUoFZpEwXxmkW5JN0YzSqwYrqTMQQoYiO8BHzBC1ZVqm3teAQhUqlY14vjs2wx6cWkY_k", score: "60%" },
    { name: "Gosh", artist: "Jamie xx", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtziX7vBawq6GB9QSpltktOH8HH1CfuA4DnQ4iDPwuFrgO7I-YfdwzwDYcAuuwVQK1fAsCfj5TNuKajCyeGuIX69gwuMm32osIpLlbembkS6A5QO3-UEllfyZiLiRttuanhnA71-yN5haNphnnJd3N6we9kmAGIaFyHji-r1iSRn9aS1xalxpVHgoa8g0DY8-zHRSWouAHVPju6lAow-Nq1vH7k7uVfwn6kzRUopgfPyiaYscF7xcRwbwqZEuxDeRCoqFDCHLCKWQW", score: "50%" },
    { name: "Starboy", artist: "The Weeknd", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHp38gwC2wx0qtcPt8OxhLxtM_2_LyJk4mmAerPOYm2XhTzrd5XVQx5GA293vMclP0Hs8cTY8Y8h9_BGuHQwa4vbfSi2vgDMFCzN-YjDA8nKHKucbTSn-LleBcGZDQRl6KHQMvB5DhjTZka8Jk1F4az2ksQduSoNAl1HhGZlYln-ApzlXkOfUsOXsOylIyDdWyvlsuoRCMUoFZpEwXxmkW5JN0YzSqwYrqTMQQoYiO8BHzBC1ZVqm3teAQhUqlY14vjs2wx6cWkY_k", score: "45%" },
    { name: "Loud Places", artist: "Jamie xx", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtziX7vBawq6GB9QSpltktOH8HH1CfuA4DnQ4iDPwuFrgO7I-YfdwzwDYcAuuwVQK1fAsCfj5TNuKajCyeGuIX69gwuMm32osIpLlbembkS6A5QO3-UEllfyZiLiRttuanhnA71-yN5haNphnnJd3N6we9kmAGIaFyHji-r1iSRn9aS1xalxpVHgoa8g0DY8-zHRSWouAHVPju6lAow-Nq1vH7k7uVfwn6kzRUopgfPyiaYscF7xcRwbwqZEuxDeRCoqFDCHLCKWQW", score: "40%" },
    { name: "Let It Happen", artist: "Tame Impala", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQK5kadZv5O6CDhM5Dsj_5zj1FS9oulN9CJEcD_rsd5BG7eQBKrcmb9wU_R9P26o9TCNNCcKF1pi_Ni5wNFjyqC4XtQcIsdeuAlvWo1s2K55J7YQi3h40R1HQiTabtGMlqTexl1PFcS7HT-ExANS6XrWA_GuVF7-31SEInFoGbmxShqjppg95b2WzfnohPBF0TutFcIGjGVhGYxbet29Tgt9S2Nw0PWa55Ikyy4ZGUZWZnxnqw2cjn66s0LpAbztFeG5agBfT14cwr", score: "35%" },
    { name: "Harder, Better, Faster", artist: "Daft Punk", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7FonKW7hUmmlw4ZJk0KW48eGUhD7YShnYKZNOP_VzZCtevhu27dgkcH32UTStO2n0apBaPQcl7wPKUmuzaUPTSetY1hmvAhpLOj2t2oRolUa_6fH3YOECgJ9OS3wLxatUamQzLJrRVgaF7z0vyLBFFSd02Eqi4lkhZTM81EL0KSIrumf2zTKmmhej4pQZcAJTkct0T5rrTpKuBn0GBvPFZNXeInnXqexV8y_lw0d0m7b3ZpfVVxIV5KVfcyHxEVyfPP94tyMumuNb", score: "30%" },
    { name: "Genesis", artist: "Grimes", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAukpnTOo3C7bUVlsyirPp3DhQ01oHG9vEmvtHK8-tGbB0dlOhQXpbRquYeapUIyUpYfNgcf-9UE4K5pFN7abMSd5VYHpFJAod7E59OdtAtR1ZoB4SR2lD_klPUROM91EvMTtoGYQoY2OezDNkT2_qwksbKZCKcw3Q5Zt-t-7VnsJmsP7Z5EjL5wrXV83xjHnQPRUNz-qRNQEcC-hfDLCsyBGuXDl90TQt0Ja4EpWFOtX_HgataZhMDJjqlq2v12I1Em3K7NwpkOY0s", score: "25%" }
  ];

  const topArtists = [
    { name: "Daft Punk", genre: "Electronic", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7FonKW7hUmmlw4ZJk0KW48eGUhD7YShnYKZNOP_VzZCtevhu27dgkcH32UTStO2n0apBaPQcl7wPKUmuzaUPTSetY1hmvAhpLOj2t2oRolUa_6fH3YOECgJ9OS3wLxatUamQzLJrRVgaF7z0vyLBFFSd02Eqi4lkhZTM81EL0KSIrumf2zTKmmhej4pQZcAJTkct0T5rrTpKuBn0GBvPFZNXeInnXqexV8y_lw0d0m7b3ZpfVVxIV5KVfcyHxEVyfPP94tyMumuNb" },
    { name: "Justice", genre: "French House", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq43V7bDQUrBSHvrY1UbUrc4VsaiAGzXJGq_DXYsuatAqBySoMOf1vXVOb2CUezRtU53Rc8DpItWMBzhJTnaA0gDokuR9ldR1fvEnnK70YxPcVG7OdrZR-D9C6XPM5FdYw9GghLZEsVLcGqiw8J98p0wDfNtSAMmDbiUaGEWWuoe-dCl-a30fpCRaeXW8zZPOtmfzDVsCCgtm99Un12mxtGwCanndUhTVea1M340LQO-6colImc_IAlgS4GVgMEFR2brEypSOpqfU5" },
    { name: "Kavinsky", genre: "Synthwave", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu037KVyS27JbkSctGWsG2pQBB867QlZc5spxbbV3cMrsChhppfW6OKp9nzga_TZ3gA2ZKu8dsQ0DUWuENhTHh7NLZo00daWrYxJ67y7yQaMR3dU_1BkczoIGSI9yJmLC9ejc1fxK0BmBHR_3S59rZRcmq3i54xi8E1LAhucpypc7rSNlNwa3Q2zZRph8k29tAR6cQqVXs6gAG6GJKE_AT2sjb7vr9QNsxTs9wU4tlgQm43spvlOUHqVQXOMmLaqPlKNWmz1cbycf8" },
    { name: "M83", genre: "Dream Pop", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvmzs4UDt_YtYV-p87KXF38OFC72qokg_arflFwVBs9U6EdTr0xEmXfVV1qnzljf8f_bAQkrWOYePp9DZksRZMxl8ylXQy7ZPJJIMkT7ED1PBgrR6A7mA6D3ZQXCHKQC7TXAaP6egp2KY1FUUX-60jI75uYpZ4y4Z25j16C0CtlqVOr2GJeYsC0wj-AwMbPg-LRDwhMm_GoFodRLdHQtDqyrUad_DqfsAphSBCTHPRP1Y4x8rD_paDelwtANAc4k4WXQDiya5pBc05" },
    { name: "The Weeknd", genre: "R&B", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAWz_Dq3AzVY-LTei6ktQ-upp_K_PwJGCbxxMYRtV-bUC9UCUid51J8U3onIoiKB6SyN61UxdrbEsY_6BPeLmNP48VhaDa6v0p6BpyLChiVafWsJyxvUnq8bIsHPvp_TGU99RHRJEcZkCPZYrJ7eP3C1LyCTadObn9VO3HuG9eyUXwpoyqdB8DS3hVkmA_HBBZyHYLPELHOKR2KaF5CXWWcD0a6TqpsqPKvHk5MrvwNLhK26hWfVPQGFBMyj7RIy6Lfn_7zNjGHdpB" }
  ];

  const listeningBars = [10, 5, 5, 10, 15, 20, 35, 55, 80, 95, 85, 65, 45, 30, 40, 50, 70, 100, 90, 75, 60, 40, 30, 20];

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Your Music DNA</h1>
        <p className={styles.pageSubtitle}>Based on your top 50 tracks this month</p>
      </header>

      {/* Section 1: 2 Cols */}
      <div className={styles.topGrid}>
        
        {/* Left Col: Radar Chart */}
        <div className={styles.card}>
          <div className={styles.radarWrapper}>
            <div className={styles.radarContainer}>
              <svg className={styles.radarSvg} viewBox="0 0 200 200">
                {/* Background Grid */}
                <polygon fill="none" stroke="#4d4d4d" strokeWidth="1" points="100,20 169.28,60 169.28,140 100,180 30.72,140 30.72,60" />
                <polygon fill="none" stroke="#4d4d4d" strokeWidth="1" points="100,40 151.96,70 151.96,130 100,160 48.04,130 48.04,70" />
                <polygon fill="none" stroke="#4d4d4d" strokeWidth="1" points="100,60 134.64,80 134.64,120 100,140 65.36,120 65.36,80" />
                {/* Axes */}
                <line stroke="#4d4d4d" strokeWidth="1" x1="100" y1="100" x2="100" y2="20" />
                <line stroke="#4d4d4d" strokeWidth="1" x1="100" y1="100" x2="169.28" y2="60" />
                <line stroke="#4d4d4d" strokeWidth="1" x1="100" y1="100" x2="169.28" y2="140" />
                <line stroke="#4d4d4d" strokeWidth="1" x1="100" y1="100" x2="100" y2="180" />
                <line stroke="#4d4d4d" strokeWidth="1" x1="100" y1="100" x2="30.72" y2="140" />
                <line stroke="#4d4d4d" strokeWidth="1" x1="100" y1="100" x2="30.72" y2="60" />
                {/* Data Polygon */}
                <polygon fill="rgba(30, 215, 96, 0.15)" stroke="#1ed760" strokeWidth="2" points="100,30 155,65 140,135 100,150 45,120 60,70" />
                {/* Data Points */}
                <circle cx="100" cy="30" r="3" fill="#1ed760" />
                <circle cx="155" cy="65" r="3" fill="#1ed760" />
                <circle cx="140" cy="135" r="3" fill="#1ed760" />
                <circle cx="100" cy="150" r="3" fill="#1ed760" />
                <circle cx="45" cy="120" r="3" fill="#1ed760" />
                <circle cx="60" cy="70" r="3" fill="#1ed760" />
                {/* Labels */}
                <text x="100" y="10" fill="#b3b3b3" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">Energy</text>
                <text x="180" y="55" fill="#b3b3b3" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">Danceability</text>
                <text x="180" y="150" fill="#b3b3b3" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">Acousticness</text>
                <text x="100" y="195" fill="#b3b3b3" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">Valence</text>
                <text x="20" y="150" fill="#b3b3b3" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">Tempo</text>
                <text x="20" y="55" fill="#b3b3b3" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">Instrumentalness</text>
              </svg>
            </div>
          </div>
          <div>
            <div className={styles.aiLabel}>AI INTERPRETATION</div>
            <p className={styles.aiText}>
              <span style={{ fontStyle: 'italic', color: '#fff' }}>Your recent listening heavily favors high-energy, electronic-driven compositions.</span> There is a distinct lack of acoustic elements, suggesting a preference for synthetic textures. The overall mood tends slightly towards melancholic, despite the upbeat tempos.
            </p>
          </div>
        </div>

        {/* Right Col: Top Tracks */}
        <div>
          <h2 className={styles.sectionTitle}>Top Tracks</h2>
          <div className={styles.trackList}>
            {topTracks.map((track, i) => (
              <div key={i} className={`${styles.trackRow} ${i % 2 === 0 ? styles.rowEven : styles.rowOdd}`}>
                <div className={styles.trackRank}>{i + 1}</div>
                <img src={track.img} alt="Album Art" className={styles.trackImg} />
                <div className={styles.trackInfo}>
                  <div className={styles.trackName}>{track.name}</div>
                  <div className={styles.trackArtist}>{track.artist}</div>
                </div>
                <div className={styles.trackBarBg}>
                  <div className={styles.trackBarFill} style={{ width: track.score }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 2: Top Artists */}
      <div className={styles.artistsSection}>
        <h2 className={styles.sectionTitle}>Top Artists</h2>
        <div className={styles.artistsScroll}>
          {topArtists.map((artist, i) => (
            <div key={i} className={styles.artistCard}>
              <img src={artist.img} alt="Artist" className={styles.artistImg} />
              <div className={styles.artistName}>{artist.name}</div>
              <div className={styles.artistGenre}>{artist.genre}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Listening Patterns */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>When You Listen Most</h2>
        <div className={styles.chartContainer}>
          {listeningBars.map((height, i) => (
            <div 
              key={i} 
              className={styles.chartBar} 
              style={{ height: `${height}%`, opacity: height / 100 + 0.1 }}
            ></div>
          ))}
        </div>
        <div className={styles.chartLabels}>
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
        <p className={styles.chartCaption}>
          Your activity spikes sharply during morning commutes and late evening focus sessions.
        </p>
      </div>

    </div>
  );
}
