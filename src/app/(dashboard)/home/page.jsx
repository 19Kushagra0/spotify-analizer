'use client'; // We need this because we are fetching data dynamically

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { getTopTracks, getRecentlyPlayed, getTopArtists } from '@/lib/spotify'; // Import our library functions
import styles from '@/styles/Home.module.css';
import { BarChart, Bar, Cell, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Play, Pause } from 'lucide-react';

const demoChampions = {
  mon: {
    name: "Midnight City",
    artists: [{ name: "M83" }],
    plays: 8,
    album: { images: [{ url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop" }] },
    mood: "Your perfect Monday vibe. Energizing electronic beats to kickstart your work week."
  },
  tue: {
    name: "Blinding Lights",
    artists: [{ name: "The Weeknd" }],
    plays: 12,
    album: { images: [{ url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop" }] },
    mood: "Keeping the momentum high on Tuesday with synth-wave goodness."
  },
  wed: {
    name: "Sweater Weather",
    artists: [{ name: "The Neighbourhood" }],
    plays: 10,
    album: { images: [{ url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop" }] },
    mood: "Mid-week indie chill. A nostalgic, cozy soundtrack to conquer Wednesday."
  },
  thu: {
    name: "Starboy",
    artists: [{ name: "The Weeknd" }],
    plays: 9,
    album: { images: [{ url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop" }] },
    mood: "Pre-weekend hype. An absolute pop masterpiece driving you through Thursday."
  },
  fri: {
    name: "Nightcall",
    artists: [{ name: "Kavinsky" }],
    plays: 15,
    album: { images: [{ url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300&auto=format&fit=crop" }] },
    mood: "Friday night drive. Cinematic synth chords to start the weekend in style."
  },
  sat: {
    name: "Do I Wanna Know?",
    artists: [{ name: "Arctic Monkeys" }],
    plays: 18,
    album: { images: [{ url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop" }] },
    mood: "Saturday rock spotlight. Crisp guitar riffs setting a legendary weekend mood."
  },
  sun: {
    name: "Intro",
    artists: [{ name: "The xx" }],
    plays: 6,
    album: { images: [{ url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop" }] },
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
  const [isPlaying, setIsPlaying] = useState(false);

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
    const isDemoBypass = typeof window !== 'undefined' && localStorage.getItem('musicdna_demo_mode') === 'true';
    if (isDemoBypass) {
      setIsDemoData(true);
      setTopTrack('empty');
      return;
    }

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

  // Show a gorgeous shimmer skeleton state until Spotify replies
  if (status === "loading" || (!topTrack && !error)) {
    return (
      <div className={styles.pageContainer}>
        {/* Row 1: Top Track Card Skeleton */}
        <div className={`${styles.card} ${styles.nowPlaying}`} style={{ gap: '20px' }}>
          <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '8px', flexShrink: 0 }} />
          <div className={styles.trackInfo} style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton" style={{ width: '200px', height: '24px' }} />
              <div className="skeleton" style={{ width: '120px', height: '16px' }} />
            </div>
            <div className="skeleton" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '320px', height: '14px' }} />
          </div>
        </div>

        {/* Row 2: Stats Cards Skeletons */}
        <div className={styles.statsGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${styles.card} ${styles.cardLg} ${styles.statCard}`} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px' }}>
              <div className="skeleton" style={{ width: '80px', height: '12px' }} />
              <div className="skeleton" style={{ width: '140px', height: '32px' }} />
            </div>
          ))}
        </div>

        {/* Row 3: Bottom Grid Skeletons */}
        <div className={styles.bottomGrid}>
          {/* Left: Spotlight Card Skeleton */}
          <div className={`${styles.card} ${styles.cardLg}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '220px' }}>
            <div className="skeleton" style={{ width: '120px', height: '12px' }} />
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="skeleton" style={{ width: '70px', height: '70px', borderRadius: '6px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div className="skeleton" style={{ width: '150px', height: '18px' }} />
                <div className="skeleton" style={{ width: '100px', height: '14px' }} />
              </div>
            </div>
            <div className="skeleton" style={{ width: '100%', height: '14px' }} />
            <div className="skeleton" style={{ width: '80%', height: '14px' }} />
          </div>

          {/* Right: Week in Music Chart Skeleton */}
          <div className={`${styles.card} ${styles.cardLg}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="skeleton" style={{ width: '160px', height: '16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', paddingTop: '10px' }}>
              {[60, 80, 40, 95, 70, 50, 30].map((h, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div className="skeleton" style={{ width: '24px', height: `${h}px`, borderRadius: '4px 4px 0 0' }} />
                  <div className="skeleton" style={{ width: '20px', height: '10px' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback track details if user has no data or error occurred
  const displayTrack = topTrack && topTrack !== 'empty' ? topTrack : {
    id: "1eyzFar4H1P381If56UMm2",
    name: "Midnight City",
    artists: [{ name: "M83" }],
    album: {
      images: [{ url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop" }]
    },
    preview_url: "/soothing-preview.mp3"
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
      <div className={`${styles.card} ${styles.nowPlaying}`} style={{ minHeight: '152px', transition: 'all 0.3s ease' }}>
        <div 
          className={styles.albumArtContainer}
          style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}
        >
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
        <div className={styles.trackInfo} style={{ flex: 1, minWidth: 0 }}>
          {isPlaying ? (
            isDemoData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#1ed760', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    PLAYING 30S PREVIEW (NO LOGIN REQUIRED)
                  </span>
                  <button 
                    onClick={() => setIsPlaying(false)}
                    style={{
                      background: 'rgba(255, 69, 58, 0.15)',
                      color: '#ff453a',
                      border: '1px solid rgba(255, 69, 58, 0.25)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      zIndex: 10
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#ff453a';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 69, 58, 0.15)';
                      e.currentTarget.style.color = '#ff453a';
                    }}
                  >
                    Close Player
                  </button>
                </div>
                <audio 
                  src={displayTrack.preview_url}
                  autoPlay
                  controls
                  style={{ width: '100%', borderRadius: '8px', outline: 'none' }}
                />
              </div>
            ) : (
              <div style={{ position: 'relative', width: '100%', height: '80px', marginTop: '12px' }}>
                <iframe 
                  src={`https://open.spotify.com/embed/track/${displayTrack.id}?utm_source=generator&theme=0`} 
                  width="100%" 
                  height="80" 
                  frameBorder="0" 
                  allowFullScreen="" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  style={{ borderRadius: '8px', border: 'none' }}
                ></iframe>
                <button 
                  onClick={() => setIsPlaying(false)}
                  style={{
                    position: 'absolute',
                    top: '-32px',
                    right: '0',
                    background: 'rgba(255, 69, 58, 0.15)',
                    color: '#ff453a',
                    border: '1px solid rgba(255, 69, 58, 0.25)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    zIndex: 10
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#ff453a';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 69, 58, 0.15)';
                    e.currentTarget.style.color = '#ff453a';
                  }}
                >
                  Close Player
                </button>
              </div>
            )
          ) : (
            <>
              <div className={styles.trackHeader}>
                <div>
                  <h2 className={styles.trackTitle}>{displayTrack.name}</h2> {/* REAL SONG NAME! */}
                  <p className={styles.trackArtist}>{displayTrack.artists[0]?.name}</p> {/* REAL ARTIST! */}
                </div>
                {topTrack && topTrack !== 'empty' && (
                  <span className={styles.time}>#1 TOP TRACK</span>
                )}
              </div>
              <div className={styles.progressBarBg} style={{ display: 'none' }}>
                <div className={styles.progressBarFill} style={{ width: "100%" }}></div>
              </div>
              <p className={styles.aiCaption} style={{ marginBottom: '12px' }}>
                {topTrack === 'empty'
                  ? "Default track loaded. Listen to more songs on Spotify to see your DNA!"
                  : "Your #1 most played song this month. Click the button to stream the actual song!"}
              </p>
              <button 
                onClick={() => setIsPlaying(true)}
                style={{
                  background: '#1ed760',
                  color: '#000',
                  border: 'none',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  alignSelf: 'flex-start'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Play size={14} fill="#000" /> Play on Spotify
              </button>
            </>
          )}
        </div>
      </div>

      {/* Row 2: Stat Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.card} ${styles.cardLg} ${styles.statCard}`}>
          <span className={styles.statLabel}>TOP GENRE</span>
          <h3 
            className={styles.statValue}
            style={(!isDemoData && topGenre === 'None yet') ? { fontSize: '14px', fontWeight: '500', color: '#b3b3b3', textTransform: 'none', lineHeight: '1.4' } : {}}
          >
            {isDemoData ? 'Dark Pop' : (topGenre === 'None yet' ? 'Spend some time listening to generate TOP GENRE' : (topGenre || 'Discovering...'))}
          </h3>
        </div>
        <div className={`${styles.card} ${styles.cardLg} ${styles.statCard}`}>
          <span className={styles.statLabel}>CURRENT VIBE</span>
          <h3 
            className={styles.statValuePrimary}
            style={(!isDemoData && currentVibe === 'Waiting for DNA') ? { fontSize: '14px', fontWeight: '500', color: '#b3b3b3', textTransform: 'none', lineHeight: '1.4' } : {}}
          >
            {isDemoData ? 'High Energy' : (currentVibe === 'Waiting for DNA' ? 'Spend some time listening to generate CURRENT VIBE' : (currentVibe || 'Loading...'))}
          </h3>
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
