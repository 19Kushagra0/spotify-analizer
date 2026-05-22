'use client'; // We need this because we are fetching data dynamically

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { getTopTracks, getRecentlyPlayed, getTopArtists } from '@/lib/spotify'; // Import our library functions
import styles from '@/styles/Home.module.css';
import { BarChart, Bar, Cell, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const demoChampions = {
  mon: {
    name: "Midnight City",
    artists: [{ name: "M83" }],
    plays: 8,
    album: { images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021" }] },
    mood: "Your perfect Monday vibe. Energizing electronic beats to kickstart your work week."
  },
  tue: {
    name: "Blinding Lights",
    artists: [{ name: "The Weeknd" }],
    plays: 12,
    album: { images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb4c79a58e0a312a088f1cecc7" }] },
    mood: "Keeping the momentum high on Tuesday with synth-wave goodness."
  },
  wed: {
    name: "Sweater Weather",
    artists: [{ name: "The Neighbourhood" }],
    plays: 10,
    album: { images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb09c15ed96d2994f068307b22" }] },
    mood: "Mid-week indie chill. A nostalgic, cozy soundtrack to conquer Wednesday."
  },
  thu: {
    name: "Starboy",
    artists: [{ name: "The Weeknd" }],
    plays: 9,
    album: { images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb4778150e683a3fcfb65b6eb0" }] },
    mood: "Pre-weekend hype. An absolute pop masterpiece driving you through Thursday."
  },
  fri: {
    name: "Nightcall",
    artists: [{ name: "Kavinsky" }],
    plays: 15,
    album: { images: [{ url: "https://i.scdn.co/image/ab6761610000e5ebc58a666e5f8f8ed9796e6d5e" }] },
    mood: "Friday night drive. Cinematic synth chords to start the weekend in style."
  },
  sat: {
    name: "Do I Wanna Know?",
    artists: [{ name: "Arctic Monkeys" }],
    plays: 18,
    album: { images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb7da39dedae1f5617a20c1505" }] },
    mood: "Saturday rock spotlight. Crisp guitar riffs setting a legendary weekend mood."
  },
  sun: {
    name: "Intro",
    artists: [{ name: "The xx" }],
    plays: 6,
    album: { images: [{ url: "https://i.scdn.co/image/ab6761610000e5eba27d5da966f91d5cb0d0ecbc" }] },
    mood: "Sunday wind-down. Minimalist, soothing melodies to prepare for the week ahead."
  }
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const [topTrack, setTopTrack] = useState(null);
  const [error, setError] = useState(false);
  const [isDemoData, setIsDemoData] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null); // Clickable day selection state
  const [dailyChampions, setDailyChampions] = useState(demoChampions);
  const [topGenre, setTopGenre] = useState(null);
  const [currentVibe, setCurrentVibe] = useState(null);
  const [minutesThisWeek, setMinutesThisWeek] = useState(null);

  // Create state to hold our generated Chart Data (plays = raw count for Recharts)
  const [chartData, setChartData] = useState([
    { day: 'mon', plays: 40, active: false },
    { day: 'tue', plays: 65, active: false },
    { day: 'wed', plays: 85, active: false },
    { day: 'thu', plays: 50, active: false },
    { day: 'fri', plays: 90, active: false },
    { day: 'sat', plays: 100, active: true },
    { day: 'sun', plays: 30, active: false },
  ]);

  // When the page loads, use the token to fetch the music!
  useEffect(() => {
    if (session?.accessToken) {
      async function fetchData() {
        try {
          // Fetch Top Track
          const tracksData = await getTopTracks(session.accessToken, 1); // Get top 1 track
          if (tracksData?.items && tracksData.items.length > 0) {
            setTopTrack(tracksData.items[0]); // Save it to state
          } else {
            setTopTrack('empty'); // Fallback if no tracks available
          }

          // Fetch Top Artists to get Genre & Vibe
          const artistsData = await getTopArtists(session.accessToken, 1);
          if (artistsData?.items && artistsData.items.length > 0) {
            const genres = artistsData.items[0].genres;
            if (genres && genres.length > 0) {
              const genre = genres[0];
              const formattedGenre = genre.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              setTopGenre(formattedGenre);

              const g = genre.toLowerCase();
              if (g.includes('pop') || g.includes('dance')) setCurrentVibe('High Energy');
              else if (g.includes('rock') || g.includes('metal')) setCurrentVibe('Intense');
              else if (g.includes('chill') || g.includes('lo-fi') || g.includes('jazz')) setCurrentVibe('Relaxed');
              else if (g.includes('hip hop') || g.includes('rap')) setCurrentVibe('Groovy');
              else if (g.includes('classical')) setCurrentVibe('Focused');
              else setCurrentVibe('Eclectic');
            } else {
              setTopGenre('Unclassified');
              setCurrentVibe('Mysterious');
            }
          } else {
            setTopGenre('None yet');
            setCurrentVibe('Waiting for DNA');
          }

          // Fetch Recent 50 Songs
          const recentData = await getRecentlyPlayed(session.accessToken);

          if (recentData?.items && recentData.items.length > 0) {
            // --- THE DATA CRUNCHER MATH ---
            // 1. Create buckets for Mon-Sun counts
            const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun

            // 2. Group track details and play counts by day for the daily repeated song analysis
            const dayTrackCounts = [{}, {}, {}, {}, {}, {}, {}]; // [{trackId: count}, ...]
            const dayTrackData = [{}, {}, {}, {}, {}, {}, {}];   // [{trackId: trackObject}, ...]

            let totalMs = 0; // For Minutes This Week

            recentData.items.forEach((item) => {
              const date = new Date(item.played_at);
              // getDay() returns 0 for Sunday, 1 for Monday. We shift it to make Monday = 0
              const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
              dayCounts[dayIndex]++;

              const track = item.track;
              if (track) {
                totalMs += track.duration_ms;
                if (!dayTrackCounts[dayIndex][track.id]) {
                  dayTrackCounts[dayIndex][track.id] = 0;
                  dayTrackData[dayIndex][track.id] = track;
                }
                dayTrackCounts[dayIndex][track.id]++;
              }
            });

            setMinutesThisWeek(Math.round(totalMs / 60000).toLocaleString());

            // 3. Find the busiest day to set as 100%
            const maxPlays = Math.max(...dayCounts);

            // 4. Store raw play counts for Recharts
            const newChartData = dayCounts.map((count, index) => {
              const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
              return {
                day: days[index],
                plays: count,
                active: count === maxPlays && count > 0 // Highlight the busiest day
              };
            });

            setChartData(newChartData);

            // 5. Calculate most repeated track for each day
            const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            const newChampions = {};

            dayTrackCounts.forEach((counts, index) => {
              const trackIds = Object.keys(counts);
              if (trackIds.length > 0) {
                // Find trackId with maximum count
                let bestTrackId = trackIds[0];
                let maxTrackPlays = counts[bestTrackId];

                trackIds.forEach((id) => {
                  if (counts[id] > maxTrackPlays) {
                    bestTrackId = id;
                    maxTrackPlays = counts[id];
                  }
                });

                const track = dayTrackData[index][bestTrackId];
                newChampions[days[index]] = {
                  name: track.name,
                  artists: track.artists,
                  plays: maxTrackPlays,
                  album: track.album,
                  mood: `Your #1 most repeated track on this day. You played this track ${maxTrackPlays} times!`
                };
              } else {
                newChampions[days[index]] = null;
              }
            });

            setDailyChampions(newChampions);
            setIsDemoData(false);
          } else {
            // No recently played songs - show empty chart for real data
            setChartData([
              { day: 'mon', plays: 0, active: false },
              { day: 'tue', plays: 0, active: false },
              { day: 'wed', plays: 0, active: false },
              { day: 'thu', plays: 0, active: false },
              { day: 'fri', plays: 0, active: false },
              { day: 'sat', plays: 0, active: false },
              { day: 'sun', plays: 0, active: false },
            ]);
            setDailyChampions({});
            setMinutesThisWeek("0");
            setIsDemoData(true);
          }
        } catch (err) {
          console.error("Error fetching Spotify data:", err);
          setError(true);
          setIsDemoData(true); // Fallback to gorgeous demo data on error
        }
      }
      fetchData();
    } else {
      setIsDemoData(true);
    }
  }, [session]);

  // Show a loading state until Spotify replies
  if (status === "loading" || (!topTrack && !error)) {
    return (
      <div className={styles.pageContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        Loading your Spotify DNA...
      </div>
    );
  }

  // Fallback track details if user has no data or error occurred
  const displayTrack = topTrack && topTrack !== 'empty' ? topTrack : {
    name: "Midnight City",
    artists: [{ name: "M83" }],
    album: {
      images: [{ url: "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021" }]
    }
  };

  const albumArtUrl = displayTrack.album.images[0]?.url || "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021";
  const getActiveDay = () => {
    if (selectedDay !== null) return selectedDay;
    const busiest = chartData.find(d => d.active);
    return busiest ? busiest.day : 'sat';
  };

  const activeDay = getActiveDay();
  const activeChampion = dailyChampions[activeDay] || null;

  const dayNameMapping = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
  };
  const activeDayName = dayNameMapping[activeDay] || 'Saturday';

  // Determine the time state of the active day
  const daysArray = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const activeDayIndex = daysArray.indexOf(activeDay);
  const currentDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const isFuture = activeDayIndex > currentDayIndex;

  return (
    <div className={styles.pageContainer}>

      {/* Row 1: Now Playing / Top Track Card - WITH REAL DATA! */}
      <div className={`${styles.card} ${styles.nowPlaying}`}>
        <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
          <Image
            src={albumArtUrl} // REAL ALBUM ART!
            alt="Album Art"
            fill
            sizes="120px"
            className={styles.albumArt}
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        </div>
        <div className={styles.trackInfo}>
          <div className={styles.trackHeader}>
            <div>
              <h2 className={styles.trackTitle}>{displayTrack.name}</h2> {/* REAL SONG NAME! */}
              <p className={styles.trackArtist}>{displayTrack.artists[0]?.name}</p> {/* REAL ARTIST! */}
            </div>
            {topTrack && topTrack !== 'empty' && (
              <span className={styles.time}>#1 TOP TRACK</span>
            )}
          </div>
          <div className={styles.progressBarBg}>
            <div className={styles.progressBarFill} style={{ width: "100%" }}></div>
          </div>
          <p className={styles.aiCaption}>
            {topTrack === 'empty'
              ? "Default track loaded. Listen to more songs on Spotify to see your DNA!"
              : "Your #1 most played song this month."}
          </p>
        </div>
      </div>

      {/* Row 2: Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.card} ${styles.cardLg} ${styles.statCard}`}>
          <span className={styles.statLabel}>TOP GENRE</span>
          <h3 className={styles.statValue}>{isDemoData ? 'Dark Pop' : (topGenre || 'Discovering...')}</h3>
        </div>
        <div className={`${styles.card} ${styles.cardLg} ${styles.statCard}`}>
          <span className={styles.statLabel}>CURRENT VIBE</span>
          <h3 className={styles.statValuePrimary}>{isDemoData ? 'High Energy' : (currentVibe || 'Loading...')}</h3>
        </div>
        <div className={`${styles.card} ${styles.cardLg} ${styles.statCard}`}>
          <span className={styles.statLabel}>MINUTES THIS WEEK</span>
          <h3 className={styles.statValue}>{isDemoData ? '1,847' : (minutesThisWeek !== null ? minutesThisWeek : '0')}</h3>
        </div>
      </div>

      {/* Row 3: Two Column Layout */}
      <div className={styles.bottomGrid}>

        {/* Left: Daily DNA Spotlight */}
        <div className={`${styles.card} ${styles.cardLg}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
          <div>
            <h3 className={styles.sectionTitle} style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', color: '#1ed760', margin: '0 0 16px 0' }}>
              {activeDayName} Spotlight
            </h3>

            {isFuture ? (
              <div style={{ textAlign: 'center', color: '#b3b3b3', marginTop: '20px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#4d4d4d', marginBottom: '8px' }}>update</span>
                <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '4px' }}>Can't predict the future!</h4>
                <p style={{ fontSize: '13px' }}>This day hasn't happened yet. Check back later to see your musical DNA unfold.</p>
              </div>
            ) : !activeChampion ? (
              <div style={{ textAlign: 'center', color: '#b3b3b3', marginTop: '20px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#4d4d4d', marginBottom: '8px' }}>headphones_battery</span>
                <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '4px' }}>Silence is golden</h4>
                <p style={{ fontSize: '13px' }}>You took a break from Spotify on this day. Not used!</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <Image
                      src={activeChampion.album.images[0]?.url || "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021"}
                      alt={activeChampion.name}
                      fill
                      sizes="70px"
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                      {activeChampion.name}
                    </h4>
                    <p style={{ color: '#b3b3b3', margin: '0 0 8px 0', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {activeChampion.artists.map(a => a.name).join(', ')}
                    </p>
                    <span style={{ fontSize: '10px', background: 'rgba(30, 215, 96, 0.15)', color: '#1ed760', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                      {activeChampion.plays} PLAYS
                    </span>
                  </div>
                </div>
                <p className={styles.moodText} style={{ marginTop: '20px', fontSize: '13px', borderLeft: '2px solid #1ed760', paddingLeft: '12px', fontStyle: 'italic', color: '#e5e5e5', lineHeight: '1.5' }}>
                  {activeChampion.mood}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right: Week in Music Chart */}
        <div className={`${styles.card} ${styles.cardLg}`} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className={styles.sectionTitle} style={{ margin: 0 }}>Your Week in Music</h3>
            {isDemoData && (
              <span style={{ fontSize: '10px', color: '#1ed760', background: 'rgba(30, 215, 96, 0.1)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                DEMO DATA
              </span>
            )}
          </div>

          <div style={{ flex: 1, minHeight: '180px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData}
                barCategoryGap="25%"
              >
                <XAxis
                  dataKey="day"
                  tick={({ x, y, payload }) => {
                    const day = payload.value;
                    const isActive = selectedDay === day || (selectedDay === null && chartData.find(d => d.day === day)?.active);
                    return (
                      <g
                        transform={`translate(${x},${y + 8})`}
                        className="chart-day-label"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedDay(prev => prev === day ? null : day)}
                      >
                        <circle cx={0} cy={9} r={18} fill={isActive ? 'rgba(255,255,255,0.15)' : undefined} style={{ transition: 'all 0.2s ease' }} />
                        <text
                          x={0} y={13}
                          textAnchor="middle"
                          fill={isActive ? '#fff' : '#b3b3b3'}
                          fontSize={11}
                          fontWeight={isActive ? '700' : '400'}
                          style={{ transition: 'all 0.2s ease' }}
                        >
                          {day}
                        </text>
                      </g>
                    );
                  }}
                  axisLine={false}
                  tickLine={false}
                  height={44}
                />
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div style={{
                          background: '#1a1a1a',
                          border: '1px solid rgba(30,215,96,0.3)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          color: '#fff',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                        }}>
                          <span style={{ color: '#1ed760', fontWeight: 700 }}>{d.plays}</span>
                          <span style={{ color: '#b3b3b3' }}> plays</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="plays"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                  minPointSize={6}
                  cursor="pointer"
                  onClick={(data) => {
                    setSelectedDay(prev => prev === data.day ? null : data.day);
                  }}
                >
                  {chartData.map((entry, index) => {
                    const isActive = selectedDay === entry.day || (selectedDay === null && entry.active);
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isActive ? '#1ed760' : '#2a2a2a'}
                        stroke={isActive ? 'rgba(30,215,96,0.4)' : 'none'}
                        strokeWidth={0}
                        style={{
                          filter: isActive ? 'drop-shadow(0 0 6px rgba(30,215,96,0.5))' : 'none',
                          transition: 'fill 0.2s ease'
                        }}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
