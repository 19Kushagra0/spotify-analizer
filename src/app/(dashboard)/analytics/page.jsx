'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@/styles/Analytics.module.css';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, CartesianGrid } from 'recharts';
import { getTopTracks, getTopArtists, getRecentlyPlayed } from '@/lib/spotify';

const formatGenre = (genre) =>
  genre
    ?.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [realTopTracks, setRealTopTracks] = useState(null);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  const [realTopArtists, setRealTopArtists] = useState(null);
  const [isLoadingArtists, setIsLoadingArtists] = useState(true);
  const [realRadarData, setRealRadarData] = useState(null);
  const [isLoadingRadar, setIsLoadingRadar] = useState(true);
  const [radarError, setRadarError] = useState(false);
  const [realListeningBars, setRealListeningBars] = useState(null);
  const [isLoadingListening, setIsLoadingListening] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      async function fetchData() {
        try {
          const results = await Promise.allSettled([
            getTopTracks(session.accessToken, 50),
            getTopArtists(session.accessToken, 50),
            getRecentlyPlayed(session.accessToken)
          ]);

          const tracksData = results[0].status === 'fulfilled' ? results[0].value : null;
          const artistsData = results[1].status === 'fulfilled' ? results[1].value : null;
          const recentlyPlayedData = results[2].status === 'fulfilled' ? results[2].value : null;

          if (tracksData?.items) {
            setRealTopTracks(tracksData.items);
          }
          if (artistsData?.items) {
            setRealTopArtists(artistsData.items);

            const genreCounts = {};
            artistsData.items.forEach(artist => {
              if (artist.genres) {
                artist.genres.forEach(genre => {
                  const formatted = formatGenre(genre);
                  genreCounts[formatted] = (genreCounts[formatted] || 0) + 1;
                });
              }
            });

            const sortedGenres = Object.entries(genreCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6);

            if (sortedGenres.length > 0) {
              const maxCount = sortedGenres[0][1];
              const radarData = sortedGenres.map(([genre, count]) => ({
                subject: genre,
                value: Math.round((count / maxCount) * 100)
              }));

              while (radarData.length < 6) {
                radarData.push({ subject: '-', value: 0 });
              }
              setRealRadarData(radarData);
            } else {
              setRadarError(true);
            }
          }

          if (recentlyPlayedData?.items) {
            const counts = new Array(24).fill(0);
            recentlyPlayedData.items.forEach(item => {
              if (item.played_at) {
                const date = new Date(item.played_at);
                const hour = date.getHours(); // Local hour 0-23
                counts[hour] += 1;
              }
            });

            const maxCount = Math.max(...counts);
            if (maxCount > 0) {
              const scaledBars = counts.map(count =>
                Math.round((count / maxCount) * 100)
              );
              setRealListeningBars(scaledBars);
            }
          }
        } catch (e) {
          console.error("Error fetching data:", e);
        } finally {
          setIsLoadingTracks(false);
          setIsLoadingArtists(false);
          setIsLoadingRadar(false);
          setIsLoadingListening(false);
        }
      }
      fetchData();
    } else if (status !== 'loading') {
      setIsLoadingTracks(false);
      setIsLoadingArtists(false);
      setIsLoadingRadar(false);
      setIsLoadingListening(false);
    }
  }, [session, status]);

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

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${ampm}`;
  };

  const chartData = (realListeningBars || listeningBars).map((height, i) => ({
    hour: formatHour(i),
    value: height
  }));

  return (
    <div className={styles.pageContainer}>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Your Music DNA</h1>
        <p className={styles.pageSubtitle}>Based on your top 50 artists this month</p>
      </header>

      {/* Section 1: 2 Cols */}
      <div className={styles.topGrid}>

        {/* Left Col: Radar Chart */}
        <div className={styles.card}>
          <div className={styles.radarWrapper}>
            <div className={styles.radarContainer}>
              {isLoadingRadar ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '250px', position: 'relative' }}>
                  <div className="skeleton" style={{ width: '180px', height: '180px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.03)' }} />
                    </div>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" aspect={1.2}>
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarError || !realRadarData ? [
                    { subject: 'Genre 1', value: 0 },
                    { subject: 'Genre 2', value: 0 },
                    { subject: 'Genre 3', value: 0 },
                    { subject: 'Genre 4', value: 0 },
                    { subject: 'Genre 5', value: 0 },
                    { subject: 'Genre 6', value: 0 }
                  ] : realRadarData}>
                    <PolarGrid stroke="#4d4d4d" strokeWidth={1} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#b3b3b3', fontSize: 11, fontFamily: 'var(--font-jakarta, "Plus Jakarta Sans", sans-serif)' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#282828', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      itemStyle={{ color: '#1ed760' }}
                    />
                    <Radar
                      name="Music DNA"
                      dataKey="value"
                      stroke="#1ed760"
                      strokeWidth={2}
                      fill="#1ed760"
                      fillOpacity={0.25}
                      activeDot={{ r: 6, fill: '#1ed760', stroke: '#fff', strokeWidth: 2 }}
                      dot={{ r: 4, fill: '#1ed760', strokeWidth: 0 }}
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          <div>
            <div className={styles.aiLabel}>AI INTERPRETATION</div>
            <p className={styles.aiText}>
              {realRadarData && realRadarData[0]?.subject !== 'Genre 1' ? (
                <>
                  <span style={{ fontStyle: 'italic', color: '#fff' }}>Your genre profile is heavily anchored by {realRadarData[0].subject}.</span> The unique distribution across these styles highlights the core aesthetic that defines your current listening habits.
                </>
              ) : (
                <>
                  <span style={{ fontStyle: 'italic', color: '#fff' }}>Your genre profile reflects a unique blend of musical styles.</span> The distribution across these top genres highlights the core aesthetic that defines your current listening habits.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Col: Top Tracks */}
        <div>
          <h2 className={styles.sectionTitle}>Top Tracks</h2>
          <div className={styles.trackList}>
            {isLoadingTracks ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`${styles.trackRow} ${i % 2 === 0 ? styles.rowEven : styles.rowOdd}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px' }}>
                    <div className="skeleton" style={{ width: '20px', height: '14px' }} />
                    <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '4px', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                      <div className="skeleton" style={{ width: '160px', height: '14px' }} />
                      <div className="skeleton" style={{ width: '100px', height: '10px' }} />
                    </div>
                    <div className="skeleton" style={{ width: '80px', height: '10px' }} />
                  </div>
                ))}
              </div>
            ) : (realTopTracks || topTracks).length === 0 ? (
              <div style={{ color: '#b3b3b3', padding: '40px 0', fontSize: '14px', width: '100%', textAlign: 'center', fontStyle: 'italic' }}>
                Spend more time on Spotify to get top tracks.
              </div>
            ) : (realTopTracks || topTracks).slice(0, 10).map((track, i) => {
              const name = track.name;
              const artist = track.artists ? track.artists[0]?.name : track.artist;
              const img = track.album?.images[0]?.url || track.img || "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021";
              const score = track.popularity !== undefined ? `${track.popularity}%` : track.score;

              return (
                <div key={i} className={`${styles.trackRow} ${i % 2 === 0 ? styles.rowEven : styles.rowOdd}`} style={{ transition: 'all 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}>
                  <div className={styles.trackRank}>{i + 1}</div>
                  <img src={img} alt="Album Art" className={styles.trackImg} />
                  <div className={styles.trackInfo} style={{ minWidth: 0, flex: 1, marginRight: '16px' }}>
                    <div className={styles.trackName} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                    <div className={styles.trackArtist} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artist}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={styles.trackBarBg}>
                      <div className={styles.trackBarFill} style={{ width: score }}></div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#b3b3b3', width: '30px', textAlign: 'right', fontWeight: '600' }}>{score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Section 2: Top Artists */}
      <div className={styles.artistsSection}>
        <h2 className={styles.sectionTitle}>Top Artists</h2>
        <div className={styles.artistsScroll}>
          {isLoadingArtists ? (
            <div style={{ display: 'flex', gap: '16px', width: '100%', overflow: 'hidden' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={styles.artistCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                  <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                  <div className="skeleton" style={{ width: '80px', height: '12px' }} />
                  <div className="skeleton" style={{ width: '60px', height: '10px' }} />
                </div>
              ))}
            </div>
          ) : (realTopArtists || topArtists).length === 0 ? (
            <div style={{ color: '#b3b3b3', padding: '40px 0', fontSize: '14px', width: '100%', textAlign: 'center', fontStyle: 'italic' }}>
              Spend more time on Spotify to get top artists.
            </div>
          ) : (realTopArtists || topArtists).slice(0, 10).map((artist, i) => {
            const name = artist.name;
            const img = artist.images?.[0]?.url || artist.img || "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021";
            const rawGenre = artist.genres?.[0] || artist.genre;
            const genre = formatGenre(rawGenre) || "Unknown Genre";

            return (
              <div key={artist.id || i} className={styles.artistCard}>
                <img src={img} alt={name || "Artist"} className={styles.artistImg} />
                <div className={styles.artistName} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{name}</div>
                <div className={styles.artistGenre} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{genre}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Listening Patterns */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>When You Listen Most</h2>
        <div style={{ width: '100%', height: '160px', marginBottom: '16px', position: 'relative' }}>
          {isLoadingListening ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px', width: '100%', padding: '0 20px' }}>
              {[40, 20, 15, 30, 45, 60, 80, 100, 90, 75, 60, 40, 50, 60, 70, 95, 80, 65, 50, 40, 30, 20, 15, 10].map((h, i) => (
                <div key={i} className="skeleton" style={{ width: '3%', height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1ed760" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1db954" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(77, 77, 77, 0.4)' }}
                  tick={{ fill: '#b3b3b3', fontSize: 10, fontFamily: 'var(--font-jakarta, "Plus Jakarta Sans", sans-serif)' }}
                  interval={0}
                  tickFormatter={(tick) => {
                    const targetTicks = ['12 AM', '6 AM', '12 PM', '6 PM', '11 PM'];
                    return targetTicks.includes(tick) ? tick : '';
                  }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: '#282828', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(value) => [`${value}%`, 'Activity']}
                  labelStyle={{ color: '#b3b3b3', fontWeight: 'bold' }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <p className={styles.chartCaption}>
          {(() => {
            if (isLoadingListening) {
              return "Calculating patterns...";
            }
            if (!realListeningBars) {
              return "Your activity spikes sharply during morning commutes and late evening focus sessions.";
            }
            const maxVal = Math.max(...realListeningBars);
            if (maxVal === 0) {
              return "No recently played tracks found to analyze your listening times.";
            }
            const peakHour = realListeningBars.indexOf(maxVal);
            const ampm = peakHour >= 12 ? 'PM' : 'AM';
            const displayHour = peakHour % 12 === 0 ? 12 : peakHour % 12;
            return `Based on your last 50 recently played tracks, your activity peaks around ${displayHour} ${ampm}.`;
          })()}
        </p>
      </div>

    </div>
  );
}
