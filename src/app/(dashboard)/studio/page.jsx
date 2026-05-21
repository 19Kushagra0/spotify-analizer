'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import styles from '@/styles/Studio.module.css';

export default function AIStudioPage() {
  const [activeMood, setActiveMood] = useState("Focus");
  
  // Dummy Data
  const moodPills = ["Focus", "Heartbreak", "Hype", "Road Trip", "Sleep", "Party"];

  const generatedTracks = [
    { name: "Nightcall", artist: "Kavinsky", badge: "synth mood", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDUu_bhZX6ESQk6uN5Pzik6Fcz6mBndLi0inkW5wrLpjTMHY1_gpjGlEkNTmPeuThPSCY4N9J_ZRYxk56-drwk7VAbIxGJe80mLlV6elfqOf9VemdHQdl1p6TR-fCoe3UDeT2eFm3bugD6swOcVrjAb9Opv5Sstdg12RdvFpzc1K70JgudgJxP0vir2kg3acv5c7vkA09HzDKJJaE-syvrnLtJdb2C-SU2CvzAsSmYwzEUow73Ipw0Yj7xI5DPNrb2BI5Wvs7FCFDI" },
    { name: "A Real Hero", artist: "College, Electric Youth", badge: "tempo match", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq8Wk_B2DTRCwlnuS7-cljy-j1jNxbTiEDBFXl9-8O7bO9kCbELqRGE8EWLlQX-CFkzkJEUbuS8Zg0f_atXel5b_KsdfMMTKeR3lnK9Ivfi9RYbRqocRdsFzvasysMzomjEWiIVlvdQ78R7cWqvnb5APj6O67lyL6xo8ir-GMnt-jlcr1iVWnb4nu_vGp5bTdS9wisH9aiUUwRw1AUJW_2uqkEqLRy4eD9gylD6rQFpr3df0ddrDlYf-eN8B2gux1oBDbkcLxJxBXq" },
    { name: "Resonance", artist: "HOME", badge: "vibe check", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6drVs8M5dNcyoo7_8OxHyqh-Xe8sYI6C4V0Zzcv90EBZgEBLNS8BPnj1TAbPuPBBBp4fB0giFQzWv0n4h1j81IHj3WcL8lsXkb1XhqRLdwO5VDDHtZ4wSoJHVZzTbJAJDdm7DaIUtKGW-a7oY4cRFQEE4btflGBvpOfjqpVwNKWQfvNERJSQOIdtAgbi9zqwPo5X284j_3I-oUz_mB7J5cFLmzNqZEHU0Ut__a6IiGelaYWBb0RNZEzGX2mcpvCBij38ZNUbjS8fz" },
    { name: "Under Your Spell", artist: "Desire", badge: "classic", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1HjQj1jFryzgCO0j_ENE3RTMG354PJlmjKpjHJ_vL_r4Siig3dc5hdI9WK3yf1LV6wLjw3TprISu_sYlcbgqO4P5TC0JkFj5jfZ-_VCgYXZpGckTvqnvsYP3Hkd19dPjwpo8UpJBe5ETYu9-ngcX_Q1xNxVCYrOZBTdvD8JKpcxH66VeJ-kYvbFt-7xRuTiNGi5undB_BdfzbAKNvIvm_PkiYVHr3IXDC6KRbHFLKK1BardEh7QBufE0UCevLkXYhb1ZrD4Sr9c7" },
    { name: "Tick of the Clock", artist: "Chromatics", badge: "driving", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYZ7rJXS1MG8rohs7CpuQ4NOurFNCyv4dptvbYg6kSGgsI3PzHVBIHfnpT9G4sWSsRHmZf_NmZIGGFQe6gdG7rwgkX4JR6_iD28FoMtM_cehNiKNw_yOnddoqKJCsDW2DP4eQ2hpIRpnYao1oRFTFrCwEU1rMtJ843QFWPnnF6j9fXDmur0qMzlGB7s9-fgZsHvsG8gcOH9d9ZTnYYQj3-J-B6FYVhRvbvet2X6joY6pmtNotx2gU-QIl-sSiciTiZC1CnCljhviWA" },
    { name: "Midnight City", artist: "M83", badge: "popular", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZTICSL5Tf1g14nV20lKRyyAtk1SzC59V78jH86ZY18-25qJBppMOuF96VSWe8w3aKlqRP0eSAI8zWqhem3kup6MUaudW2h7UftUCwCG-EkzpO-mD-_QLeUAi9cwyxqrLB1u1zvm0oYbusAPHB5bQoKZGfhR8BQtm1IyRVjUJSvKvKhyBkLNw_YTjYsoqHrFUnRdSk385PiUQH3IMPd_Mro5-MKmsyvZWbNBOlZq8OwCVjyqxPu5PDQ_TIa5TBXLdcAWbv0HbdKTwJ" },
    { name: "After Dark", artist: "Mr. Kitty", badge: "mood", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmUTR3zbSnTY9f2qxM5S0QuT5RGk5SHCT5jtmimpkMBfIUNA8tROp8yP0E10nVqI_mXYn1q8EHGaZiQUjkYWiTDNNdDkZpAfVor73qshbYBqfsk-VQfXzBF68dPzIU8WXVaK9NO5Uqd_xdlGb9vl5PMfvyqOds7Rtsj1hBfRd9V6BrXeU_mMfhqbcE5kDqwBwwnf54Lgqd7hnp8sk7hngic5En5M7DZExy2zYJ_7jCcEvAXHv4hJBtEXf-UBIJ839X4bnZPGApK3zm" },
    { name: "Starboy", artist: "The Weeknd, Daft Punk", badge: "discovery", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6UFlcSyOEze2R7fxeIMKRzLa1laL1kKyKMgY2cbMzKNuRXZjs3d-uShfsy00oCtDivmbMyIbl4qkjQbuEoA59JnSs0VRdNrlmWG6HV3EiZFH5BzzgF49Zs0V4Ms2tQ2tbh2lYPjqFqNAawNl7SHzRshQQcvIfpXPZarybfmCpqOfp9ccZuAfd5KJpgVAh72pmBtRrz-d2dkpYMOVjfGlhkD8Pc9JpAHBW2Ju806WNHhFeoYvXpJbLT63RtaBNzEK2EWQ9ZrWWpQMM" },
    { name: "Odd Look", artist: "Kavinsky, The Weeknd", badge: "similar", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDUu_bhZX6ESQk6uN5Pzik6Fcz6mBndLi0inkW5wrLpjTMHY1_gpjGlEkNTmPeuThPSCY4N9J_ZRYxk56-drwk7VAbIxGJe80mLlV6elfqOf9VemdHQdl1p6TR-fCoe3UDeT2eFm3bugD6swOcVrjAb9Opv5Sstdg12RdvFpzc1K70JgudgJxP0vir2kg3acv5c7vkA09HzDKJJaE-syvrnLtJdb2C-SU2CvzAsSmYwzEUow73Ipw0Yj7xI5DPNrb2BI5Wvs7FCFDI" },
    { name: "Dust", artist: "M-O-O-N", badge: "driving", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6drVs8M5dNcyoo7_8OxHyqh-Xe8sYI6C4V0Zzcv90EBZgEBLNS8BPnj1TAbPuPBBBp4fB0giFQzWv0n4h1j81IHj3WcL8lsXkb1XhqRLdwO5VDDHtZ4wSoJHVZzTbJAJDdm7DaIUtKGW-a7oY4cRFQEE4btflGBvpOfjqpVwNKWQfvNERJSQOIdtAgbi9zqwPo5X284j_3I-oUz_mB7J5cFLmzNqZEHU0Ut__a6IiGelaYWBb0RNZEzGX2mcpvCBij38ZNUbjS8fz" }
  ];

  const recentTags = ["Workout Flow", "Deep Focus", "Sunday Chill"];

  return (
    <div className={styles.pageContainer}>
      
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>AI Studio</h1>
        <p className={styles.pageSubtitle}>Describe a moment. Get a playlist.</p>
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
                onClick={() => setActiveMood(pill)}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className={styles.chatArea}>
            <div className={styles.bubbleUser}>
              Something for a rainy midnight drive through the city.
            </div>
            <div className={styles.bubbleAi}>
              I've curated a selection of atmospheric electronic and synthwave tracks with a melancholic edge. Perfect for urban rain.
            </div>
            <div className={styles.bubbleUser}>
              Can we make it a bit more upbeat? Not too energetic, but something to keep me awake.
            </div>
            <div className={styles.bubbleAi}>
              Absolutely. I've swapped in some driving synthwave with stronger basslines and a slightly faster tempo. It maintains the midnight atmosphere but adds more momentum.
            </div>
            <div className={styles.bubbleUser}>
              Perfect, that's exactly what I needed. Add some Kavinsky if you haven't already.
            </div>
            <div className={styles.bubbleAi}>
              I've added "Nightcall" and "Odd Look" by Kavinsky to the top of your queue.
            </div>
          </div>

          {/* Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              <input 
                type="text" 
                placeholder="Type a mood or moment..." 
                className={styles.chatInput} 
              />
              <button className={styles.sendBtn}>
                <Send size={18} color="#000" />
              </button>
            </div>
            <div className={styles.toggleRow}>
              <label className={styles.switch}>
                <input type="checkbox" />
                <span className={styles.slider}></span>
              </label>
              <span className={styles.toggleLabel}>From Your Library Only</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN — Generated Playlist panel */}
        <div className={styles.playlistPanel}>
          
          <div className={styles.playlistCard}>
            {/* Header */}
            <div className={styles.plHeader}>
              <h2 className={styles.plTitle}>Generated Playlist</h2>
              <p className={styles.plSubtitle}>sad midnight driving</p>
            </div>

            {/* Track List */}
            <div className={styles.trackList}>
              {generatedTracks.map((track, idx) => (
                <div key={idx} className={`${styles.trackRow} ${idx % 2 === 0 ? styles.bgLevel1 : styles.bgLevel2}`}>
                  <span className={styles.trackNum}>{idx + 1}</span>
                  <img src={track.img} alt="Album Art" className={styles.trackImg} />
                  <div className={styles.trackInfo}>
                    <div className={styles.trackName}>{track.name}</div>
                    <div className={styles.trackArtist}>{track.artist}</div>
                  </div>
                  <div className={styles.trackBadge}>{track.badge}</div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <button className={styles.saveBtn}>
              Save to Spotify
            </button>
          </div>

          {/* Recent Tags */}
          <div className={styles.recentTags}>
            <span className={styles.recentLabel}>Recent:</span>
            {recentTags.map((tag, idx) => (
              <span key={idx} className={styles.recentTag}>{tag}</span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
