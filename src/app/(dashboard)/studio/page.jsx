'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Trash2 } from '@/components/Icons';
import styles from '@/styles/Studio.module.css';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import SpotifyLoginModal from '@/components/SpotifyLoginModal';

export default function AIStudioPage() {
  const { data: session } = useSession();
  const [activeMood, setActiveMood] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "", "success", "error"
  const [libraryOnly, setLibraryOnly] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Chat History
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: "Welcome to MusicDNA's AI Studio! Describe a vibe, a specific moment, or select a vibe pill above to generate a custom playlist."
    }
  ]);

  // Generated Playlist State
  const [generatedTracks, setGeneratedTracks] = useState([]);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [recentTags, setRecentTags] = useState(["Workout Flow", "Deep Focus", "Sunday Chill"]);

  const chatEndRef = useRef(null);

  // Auto scroll chat to bottom when history changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // 1. Load chat and playlist history from Firestore on mount/session load
  useEffect(() => {
    if (!session?.user?.email) return;

    async function loadStudioData() {
      try {
        const docRef = doc(db, 'users_studio', session.user.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.chatHistory) setChatHistory(data.chatHistory);
          if (data.generatedTracks) setGeneratedTracks(data.generatedTracks);
          if (data.playlistTitle) setPlaylistTitle(data.playlistTitle);
        }
      } catch (err) {
        console.error("Error loading data from Firestore:", err);
      } finally {
        setHasLoaded(true);
      }
    }

    loadStudioData();
  }, [session]);

  // 2. Save chat and playlist history to Firestore when state changes (safeguarded by hasLoaded)
  useEffect(() => {
    if (!session?.user?.email || !hasLoaded) return;

    async function saveStudioData() {
      try {
        const docRef = doc(db, 'users_studio', session.user.email);
        await setDoc(docRef, {
          chatHistory,
          generatedTracks,
          playlistTitle,
          updatedAt: new Date()
        }, { merge: true });
      } catch (err) {
        console.error("Error saving data to Firestore:", err);
      }
    }

    saveStudioData();
  }, [chatHistory, generatedTracks, playlistTitle, session, hasLoaded]);

  const moodPills = ["Focus", "Heartbreak", "Hype", "Road Trip", "Sleep", "Party"];

  const handleMoodPillClick = async (mood) => {
    setActiveMood(mood);
    const moodPrompts = {
      Focus: "Lofi and chill instrumental music for deep focus and study.",
      Heartbreak: "Melancholic, sad indie and pop songs about heartbreak and longing.",
      Hype: "High energy hip-hop, rap, and electronic music to get hyped up.",
      "Road Trip": "Uplifting indie rock and synthwave classics perfect for driving down an open road.",
      Sleep: "Ambient, soothing, soft music with slow tempos to help drift off to sleep.",
      Party: "Uplifting dance pop and club beats to keep the party vibe alive."
    };
    const correspondingPrompt = moodPrompts[mood] || `${mood} vibe playlist.`;
    await generatePlaylist(correspondingPrompt, mood);
  };

  const generatePlaylist = async (userPrompt, moodContext = "") => {
    if (!userPrompt.trim()) return;
    if (loading) return;

    setLoading(true);
    setPrompt("");
    setSaveStatus("");

    // Add user message to chat
    setChatHistory((prev) => [...prev, { sender: 'user', text: userPrompt }]);

    try {
      const response = await fetch('/api/studio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session?.accessToken ? `Bearer ${session.accessToken}` : ''
        },
        body: JSON.stringify({
          prompt: userPrompt + (libraryOnly ? " (prioritize extremely famous and popular tracks)" : ""),
          mood: moodContext
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate recommendations");
      }

      const data = await response.json();
      
      if (data.tracks && data.tracks.length > 0) {
        setGeneratedTracks(data.tracks);
        setPlaylistTitle(data.playlistName || userPrompt);
        
        // Add AI success bubble
        setChatHistory((prev) => [
          ...prev,
          { 
            sender: 'ai', 
            text: `I've custom-designed a playlist for you: "${data.playlistName || userPrompt}". Review the tracks in the panel on the right!` 
          }
        ]);

        // Add to recent tags
        const shortTag = userPrompt.length > 20 ? `${userPrompt.substring(0, 17)}...` : userPrompt;
        setRecentTags((prev) => {
          if (prev.includes(shortTag)) return prev;
          return [shortTag, ...prev.slice(0, 2)];
        });
      } else {
        throw new Error("No tracks returned");
      }
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: "Sorry, I ran into an error generating that playlist. Please make sure your Spotify login is active and try again!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!prompt.trim()) return;
    generatePlaylist(prompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const saveToSpotify = async () => {
    const isDemoBypass = typeof window !== 'undefined' && localStorage.getItem('musicdna_demo_mode') === 'true';
    if (isDemoBypass || !session?.accessToken) {
      setIsLoginModalOpen(true);
      return;
    }
    if (generatedTracks.length === 0) return;

    setSaving(true);
    setSaveStatus("");

    try {
      // 1. Create the playlist directly for the authenticated user (2026 Endpoint)
      const createPlaylistRes = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `MusicDNA: ${playlistTitle}`,
          description: `AI-generated playlist by MusicDNA based on your mood: "${playlistTitle}"`,
          public: false
        })
      });

      if (!createPlaylistRes.ok) throw new Error("Failed to create Spotify playlist");
      const playlist = await createPlaylistRes.json();

      // 2. Filter tracks that have valid Spotify URIs and add them (2026 Endpoint)
      const uris = generatedTracks.filter(t => t.uri).map(t => t.uri);
      
      if (uris.length > 0) {
        const addTracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/items`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ uris })
        });
        if (!addTracksRes.ok) throw new Error("Failed to add tracks to playlist");
      }

      setSaveStatus("success");
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: `Success! I've saved "${playlist.name}" to your Spotify account. Go check your Spotify app!` }
      ]);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      alert("Failed to save playlist to Spotify. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to delete your chat history and generated playlist?")) {
      setChatHistory([
        {
          sender: 'ai',
          text: "Welcome to MusicDNA's AI Studio! Describe a vibe, a specific moment, or select a vibe pill above to generate a custom playlist."
        }
      ]);
      setGeneratedTracks([]);
      setPlaylistTitle("");
      setActiveMood("");
      setSaveStatus("");

      if (session?.user?.email) {
        try {
          const docRef = doc(db, 'users_studio', session.user.email);
          await deleteDoc(docRef);
        } catch (err) {
          console.error("Error resetting data in Firestore:", err);
        }
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <header className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className={styles.pageTitle}>AI Studio</h1>
          <p className={styles.pageSubtitle}>Describe a moment. Get a custom Spotify playlist.</p>
        </div>
        <button 
          onClick={handleReset}
          title="Reset Studio Session"
          style={{
            background: 'rgba(255, 69, 58, 0.1)',
            color: '#ff453a',
            border: '1px solid rgba(255, 69, 58, 0.2)',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            height: '36px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#ff453a';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 69, 58, 0.1)';
            e.currentTarget.style.color = '#ff453a';
          }}
        >
          <Trash2 size={14} />
          Delete Chat
        </button>
      </header>

      {/* 2 Column Split */}
      <div className={styles.splitLayout}>
        
        {/* LEFT COLUMN — Chat panel */}
        <div className={styles.chatPanel}>
          
          {/* Mood Pills */}
          <div className={styles.moodPills}>
            {moodPills.map((pill, idx) => (
              <button 
                key={idx} 
                className={`${styles.pill} ${pill === activeMood ? styles.pillActive : styles.pillInactive}`}
                onClick={() => handleMoodPillClick(pill)}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className={styles.chatArea}>
            {chatHistory.map((chat, idx) => (
              <div 
                key={idx} 
                className={chat.sender === 'user' ? styles.bubbleUser : styles.bubbleAi}
              >
                {chat.text}
              </div>
            ))}
            {loading && (
              <div className={styles.bubbleAi} style={{ fontStyle: 'italic', color: '#1ed760' }}>
                Curating your custom soundtrack...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={loading ? "Generating playlist..." : "Type a mood or moment..."} 
                disabled={loading}
                className={styles.chatInput} 
              />
              <button onClick={handleSend} disabled={loading || !prompt.trim()} className={styles.sendBtn}>
                <Send size={18} color="#000" />
              </button>
            </div>
            <div className={styles.toggleRow}>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={libraryOnly}
                  onChange={(e) => setLibraryOnly(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={styles.toggleLabel}>Prioritize Famous Hits</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN — Generated Playlist panel */}
        <div className={styles.playlistPanel}>
          
          <div className={styles.playlistCard}>
            {/* Header */}
            <div className={styles.plHeader}>
              <h2 className={styles.plTitle}>Generated Playlist</h2>
              <p className={styles.plSubtitle}>{playlistTitle || "Waiting for your input..."}</p>
            </div>

            {/* Track List */}
            <div className={styles.trackList}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[...Array(8)].map((_, idx) => (
                    <div key={idx} className={`${styles.trackRow} ${idx % 2 === 0 ? styles.bgLevel1 : styles.bgLevel2}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}>
                      <span className={styles.trackNum} style={{ width: '20px', display: 'inline-block' }}>{idx + 1}</span>
                      <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '4px', flexShrink: 0 }} />
                      <div className={styles.trackInfo} style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <div className="skeleton" style={{ width: '120px', height: '14px' }} />
                        <div className="skeleton" style={{ width: '80px', height: '10px' }} />
                      </div>
                      <div className="skeleton" style={{ width: '60px', height: '18px', borderRadius: '9999px' }} />
                    </div>
                  ))}
                </div>
              ) : generatedTracks.length > 0 ? (
                generatedTracks.map((track, idx) => {
                  const isDemoBypass = typeof window !== 'undefined' && localStorage.getItem('musicdna_demo_mode') === 'true';
                  const spotifyUrl = track.uri && !isDemoBypass ? `https://open.spotify.com/track/${track.uri.replace('spotify:track:', '')}` : '#';
                  return (
                    <a 
                      key={idx} 
                      href={spotifyUrl} 
                      target={spotifyUrl !== '#' ? "_blank" : undefined} 
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (spotifyUrl === '#') {
                          e.preventDefault();
                          setIsLoginModalOpen(true);
                        }
                      }}
                      className={`${styles.trackRow} ${idx % 2 === 0 ? styles.bgLevel1 : styles.bgLevel2}`}
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      <span className={styles.trackNum}>{idx + 1}</span>
                      <img src={track.img} alt="Album Art" className={styles.trackImg} />
                      <div className={styles.trackInfo}>
                        <div className={styles.trackName}>{track.name}</div>
                        <div className={styles.trackArtist}>{track.artist}</div>
                      </div>
                      <div className={styles.trackBadge}>{track.badge}</div>
                    </a>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: '#666', padding: '40px 10px', fontSize: '13px' }}>
                  Your generated tracks will appear here. Describe a moment in the chat to begin.
                </div>
              )}
            </div>

            {/* Save Button */}
            {generatedTracks.length > 0 && (
              <button 
                onClick={saveToSpotify} 
                disabled={saving || generatedTracks.length === 0}
                className={styles.saveBtn}
                style={{
                  backgroundColor: saveStatus === 'success' ? '#1ed760' : undefined,
                  color: saveStatus === 'success' ? '#fff' : undefined,
                }}
              >
                {saving ? "Saving to Spotify..." : saveStatus === 'success' ? "✓ Saved to Spotify" : "Save to Spotify"}
              </button>
            )}
          </div>

          {/* Recent Tags */}
          <div className={styles.recentTags}>
            <span className={styles.recentLabel}>Recent:</span>
            {recentTags.map((tag, idx) => (
              <span key={idx} onClick={() => generatePlaylist(tag)} className={styles.recentTag}>{tag}</span>
            ))}
          </div>

        </div>
      </div>
      <SpotifyLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
