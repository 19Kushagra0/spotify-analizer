'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from '@/styles/Analytics.module.css';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, CartesianGrid } from 'recharts';
import { getTopTracks, getTopArtists, getRecentlyPlayed } from '@/lib/spotify';
import SpotifyLoginModal from '@/components/SpotifyLoginModal';

const formatGenre = (genre) =>
  genre
    ?.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const MOCK_ARTISTS_POOL = [
  {
    name: "Daft Punk",
    genre: "Electronic",
    img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Harder, Better, Faster",
    description: "The legendary French electronic duo who revolutionized house music and synthpop. They form a critical, highly-ordered pillar of your synthesized rhythm DNA.",
    external_urls: { spotify: "https://open.spotify.com/search/Daft%20Punk" }
  },
  {
    name: "Justice",
    genre: "French House",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Genesis",
    description: "Heavy distorted basslines combined with classical structures. Justice gives your dashboard fingerprint an intense, rock-inspired electronic pulse.",
    external_urls: { spotify: "https://open.spotify.com/search/Justice" }
  },
  {
    name: "Kavinsky",
    genre: "Synthwave",
    img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Nightcall",
    description: "The dark, cinematic neon icon of late-night synthwave. Kavinsky drives your high-tempo nighttime listening spike with retro-futuristic chords.",
    external_urls: { spotify: "https://open.spotify.com/search/Kavinsky" }
  },
  {
    name: "M83",
    genre: "Dream Pop",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Midnight City",
    description: "Cascading walls of ethereal synth chords and grand acoustic dynamics. M83 brings atmospheric depth and nostalgic pop aesthetics to your vibe index.",
    external_urls: { spotify: "https://open.spotify.com/search/m83" }
  },
  {
    name: "The Weeknd",
    genre: "R&B",
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Blinding Lights",
    description: "The chart-topping pioneer of dark synth-R&B. His moody vocals over high-tempo pop rhythms form a highly consistent affinity category in your daily cycles.",
    external_urls: { spotify: "https://open.spotify.com/search/The%20Weeknd" }
  },
  {
    name: "Tame Impala",
    genre: "Psychedelic Rock",
    img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "The Less I Know The Better",
    description: "Kevin Parker's rich studio-driven psychedelic indie project. Dynamic drum grooves and phased guitars give your DNA an incredibly wavy and melodic flow.",
    external_urls: { spotify: "https://open.spotify.com/search/tame%20impala" }
  },
  {
    name: "Jamie xx",
    genre: "Indie Electronica",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Gosh",
    description: "Minimalist, steel-drum fueled UK garage and house rhythms. Perfect for driving your focus levels with atmospheric, club-infused chill beats.",
    external_urls: { spotify: "https://open.spotify.com/search/Jamie%20xx" }
  },
  {
    name: "Grimes",
    genre: "Art Pop",
    img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Genesis",
    description: "Ethereal cyberpunk melodies overlaid with hyperactive DIY pop production. Grimes injects a playful yet intensely electronic texture into your top genres.",
    external_urls: { spotify: "https://open.spotify.com/search/Grimes" }
  },
  {
    name: "Gorillaz",
    genre: "Alternative Hip Hop",
    img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Feel Good Inc.",
    description: "Damon Albarn's genre-fluid animated collective. Melding rap, dub, and alternative rock, Gorillaz represents your eclectic, highly diverse side.",
    external_urls: { spotify: "https://open.spotify.com/search/Gorillaz" }
  },
  {
    name: "Rufus Du Sol",
    genre: "Melodic House",
    img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Innerbloom",
    description: "Deep, sweeping melodic house anthems built on melancholic synth structures. Perfect for keeping you locked in focused concentration loops.",
    external_urls: { spotify: "https://open.spotify.com/search/Rufus%20Du%20Sol" }
  },
  {
    name: "Flume",
    genre: "Future Bass",
    img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Never Be Like You",
    description: "Granular sound synthesis, pitched vocals, and off-kilter beats. Flume gives your music DNA a hyper-modern, avant-garde electronic dimension.",
    external_urls: { spotify: "https://open.spotify.com/search/Flume" }
  },
  {
    name: "Tycho",
    genre: "Ambient Electronic",
    img: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?q=80&w=300&auto=format&fit=crop",
    signatureTrack: "Awake",
    description: "Warm, analog synths and organic guitar hums that simulate clean morning sunlight. Tycho represents your absolute peak state of studying calm.",
    external_urls: { spotify: "https://open.spotify.com/search/Tycho" }
  }
];

export const MOCK_TRACKS_POOL = [
  { name: "Midnight City", artist: "M83", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop" },
  { name: "Nightcall", artist: "Kavinsky", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300&auto=format&fit=crop" },
  { name: "The Less I Know The Better", artist: "Tame Impala", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop" },
  { name: "Blinding Lights", artist: "The Weeknd", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop" },
  { name: "Gosh", artist: "Jamie xx", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop" },
  { name: "Starboy", artist: "The Weeknd", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300&auto=format&fit=crop" },
  { name: "Loud Places", artist: "Jamie xx", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop" },
  { name: "Let It Happen", artist: "Tame Impala", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop" },
  { name: "Harder, Better, Faster", artist: "Daft Punk", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop" },
  { name: "Genesis", artist: "Grimes", img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=300&auto=format&fit=crop" },
  { name: "Feel Good Inc.", artist: "Gorillaz", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop" },
  { name: "On Melancholy Hill", artist: "Gorillaz", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop" },
  { name: "Innerbloom", artist: "Rufus Du Sol", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop" },
  { name: "Never Be Like You", artist: "Flume", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=300&auto=format&fit=crop" },
  { name: "Awake", artist: "Tycho", img: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?q=80&w=300&auto=format&fit=crop" }
];

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

  // Demo States
  const [isDemo, setIsDemo] = useState(false);
  const [demoArtists, setDemoArtists] = useState([]);
  const [demoTracks, setDemoTracks] = useState([]);
  const [demoRadarData, setDemoRadarData] = useState([
    { subject: 'Electronic', value: 95 },
    { subject: 'Synthwave', value: 85 },
    { subject: 'R&B', value: 70 },
    { subject: 'Dream Pop', value: 65 },
    { subject: 'French House', value: 60 },
    { subject: 'Pop', value: 45 }
  ]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const displayRadarData = realRadarData || demoRadarData;

  useEffect(() => {
    const isDemoBypass = typeof window !== 'undefined' && localStorage.getItem('musicdna_demo_mode') === 'true';
    if (isDemoBypass) {
      setIsDemo(true);

      // Select randomized artists and assign random scores & plays
      const shuffledArtists = [...MOCK_ARTISTS_POOL].sort(() => 0.5 - Math.random());
      const selectedArtists = shuffledArtists.slice(0, 6).map((artist, idx) => {
        const randomScore = Math.floor(Math.random() * (98 - 65 + 1)) + 65; // between 65 and 98
        return {
          ...artist,
          score: `${randomScore}%`,
          plays: Math.floor(randomScore / 4) + 6
        };
      }).sort((a, b) => parseInt(b.score) - parseInt(a.score));
      setDemoArtists(selectedArtists);

      // Select randomized tracks and assign random scores
      const shuffledTracks = [...MOCK_TRACKS_POOL].sort(() => 0.5 - Math.random());
      const selectedTracks = shuffledTracks.slice(0, 10).map((track) => {
        const randomScore = Math.floor(Math.random() * (98 - 50 + 1)) + 50; // between 50 and 98
        return {
          ...track,
          score: `${randomScore}%`
        };
      }).sort((a, b) => parseInt(b.score) - parseInt(a.score));
      setDemoTracks(selectedTracks);

      // Randomize Radar values dynamically based on selected genres
      const newRadar = selectedArtists.map((a, idx) => ({
        subject: a.genre,
        value: 95 - (idx * 8) - Math.floor(Math.random() * 5)
      }));
      setDemoRadarData(newRadar);

      setIsLoadingTracks(false);
      setIsLoadingArtists(false);
      setIsLoadingRadar(false);
      setIsLoadingListening(false);
      return;
    }

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
        <p className={styles.pageSubtitle}>Based on your top artists this month</p>
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
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={displayRadarData}>
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
              {displayRadarData && displayRadarData[0]?.subject !== '-' ? (
                <>
                  <span style={{ fontStyle: 'italic', color: '#fff' }}>Your genre profile is heavily anchored by {displayRadarData[0].subject}.</span> The unique distribution across these styles highlights the core aesthetic that defines your current listening habits.
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
            ) : (realTopTracks || demoTracks).length === 0 ? (
              <div style={{ color: '#b3b3b3', padding: '40px 0', fontSize: '14px', width: '100%', textAlign: 'center', fontStyle: 'italic' }}>
                Spend more time on Spotify to get top tracks.
              </div>
            ) : (realTopTracks || demoTracks).slice(0, 10).map((track, i) => {
              const name = track.name;
              const artist = track.artists ? track.artists[0]?.name : track.artist;
              const img = track.album?.images[0]?.url || track.img || "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021";
              const score = track.popularity !== undefined ? `${track.popularity}%` : track.score;
              const spotifyUrl = track.external_urls?.spotify || (track.uri ? `https://open.spotify.com/track/${track.uri.replace('spotify:track:', '')}` : '#');

              return (
                <a 
                  key={i} 
                  href={isDemo ? '#' : spotifyUrl}
                  target={!isDemo && spotifyUrl !== '#' ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (isDemo) {
                      e.preventDefault();
                      setIsLoginModalOpen(true);
                    } else if (spotifyUrl === '#') {
                      e.preventDefault();
                    }
                  }}
                  className={`${styles.trackRow} ${i % 2 === 0 ? styles.rowEven : styles.rowOdd}`} 
                  style={{ transition: 'all 0.2s ease' }} 
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} 
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
                >
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
                </a>
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
          ) : (realTopArtists || demoArtists).length === 0 ? (
            <div style={{ color: '#b3b3b3', padding: '40px 0', fontSize: '14px', width: '100%', textAlign: 'center', fontStyle: 'italic' }}>
              Spend more time on Spotify to get top artists.
            </div>
          ) : (realTopArtists || demoArtists).map((artist, i) => {
            const name = artist.name;
            const img = artist.images?.[0]?.url || artist.img || "https://i.scdn.co/image/ab6761610000e5eb55d39ab9c21d506aa52f7021";
            const rawGenre = artist.genres?.[0] || artist.genre;
            const genre = formatGenre(rawGenre) || "Unknown Genre";
            const spotifyUrl = artist.external_urls?.spotify || (artist.uri ? `https://open.spotify.com/artist/${artist.uri.replace('spotify:artist:', '')}` : '#');
            const score = artist.score || "90%";

            return (
              <a 
                key={artist.id || artist.name || i} 
                href={isDemo ? '#' : spotifyUrl}
                target={!isDemo && spotifyUrl !== '#' ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (isDemo) {
                    e.preventDefault();
                    setSelectedArtist(artist);
                  } else if (spotifyUrl === '#') {
                    e.preventDefault();
                  }
                }}
                className={styles.artistCard}
              >
                <img src={img} alt={name || "Artist"} className={styles.artistImg} />
                <div className={styles.artistName} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{name}</div>
                <div className={styles.artistGenre} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {isDemo ? (
                    <span className={styles.matchBadge}>{score} Affinity</span>
                  ) : (
                    genre
                  )}
                </div>
              </a>
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

      {/* PREMIUM IN-APP ARTIST DETAIL MODAL OVERLAY */}
      {selectedArtist && (
        <div className={styles.modalOverlay} onClick={() => setSelectedArtist(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedArtist(null)}>×</button>
            
            {/* Banner with blur backdrop */}
            <div className={styles.modalBanner}>
              <img src={selectedArtist.img} alt={selectedArtist.name} className={styles.modalBannerImg} />
              <div className={styles.modalBannerOverlay} />
            </div>

            {/* Modal Content container */}
            <div className={styles.modalContent}>
              <div className={styles.modalHeaderInfo}>
                <img src={selectedArtist.img} alt={selectedArtist.name} className={styles.modalAvatar} />
                <div>
                  <h2 className={styles.modalTitle}>{selectedArtist.name}</h2>
                  <p className={styles.modalGenre}>{selectedArtist.genre || "Alternative Electronic"}</p>
                </div>
              </div>

              <div className={styles.modalBody}>
                {/* Affinity DNA Slider */}
                <div className={styles.affinitySection}>
                  <div className={styles.affinityHeader}>
                    <span className={styles.affinityLabel}>DNA AFFINITY</span>
                    <span className={styles.affinityValue}>{selectedArtist.score || "94%"} Match</span>
                  </div>
                  <div className={styles.affinityBarBg}>
                    <div className={styles.affinityBarFill} style={{ width: selectedArtist.score || "94%" }}></div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className={styles.modalStatsGrid}>
                  <div className={styles.modalStatBox}>
                    <span className={styles.modalStatLabel}>PLAYS THIS WEEK</span>
                    <span className={styles.modalStatVal}>{selectedArtist.plays || 18}</span>
                  </div>
                  <div className={styles.modalStatBox}>
                    <span className={styles.modalStatLabel}>DNA VIBE CATEGORY</span>
                    <span className={styles.modalStatValPrimary}>SYNTHESIZED CHILL</span>
                  </div>
                </div>

                {/* Bio Vibe Profile */}
                <div className={styles.bioSection}>
                  <h4 className={styles.bioTitle}>AI Vibe Profile</h4>
                  <p className={styles.bioText}>
                    {selectedArtist.description || `This artist forms a key pillar of your musical footprint. Your listening patterns indicate a strong preference for their rhythmic structures during late-evening wind-downs, generating high focus coherence in your brain wave simulations.`}
                  </p>
                </div>

                {/* Signature track */}
                <div className={styles.signatureTrackSection}>
                  <span className={styles.signatureLabel}>SIGNATURE DNA TRACK</span>
                  <div className={styles.signatureTrackBox}>
                    <span className={styles.sigTrackName}>{selectedArtist.signatureTrack || "Midnight City"}</span>
                    <span className={styles.sigTrackVibe}>Synthesized Vibe</span>
                  </div>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className={styles.modalFooter}>
                <a 
                  href={selectedArtist.external_urls?.spotify || "#"}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.modalSpotifyBtn}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px' }}>
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.077-.337.135-.668.47-.743 3.856-.88 7.15-.502 9.822 1.13.295.18.387.563.205.858zm1.225-2.72c-.228.368-.713.49-1.08.262-2.72-1.67-6.87-2.153-10.076-1.18-.413.125-.85-.107-.973-.52-.125-.413.107-.85.52-.972 3.667-1.11 8.23-.574 11.347 1.34.37.227.492.712.262 1.08zm.106-2.833C14.492 8.878 8.843 8.69 5.568 9.684c-.504.153-1.033-.133-1.186-.637-.153-.504.133-1.033.637-1.186 3.756-1.14 10.02-.924 14.07 1.48.455.27.604.856.334 1.312-.27.455-.857.605-1.313.334z"/>
                  </svg>
                  Open on Spotify
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <SpotifyLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
