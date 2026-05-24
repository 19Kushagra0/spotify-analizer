# MusicDNA 🧬 
### Spotify Analyzer & AI Playlist Curator

A state-of-the-art Web Application built with **Next.js 16**, **React 19**, **Recharts**, **Firebase Firestore**, **NextAuth.js**, and **Google Gemini 2.5 Flash**. MusicDNA is designed to visualize your musical fingerprint, analyze your hourly listening cycles, and programmatically curate and export customized Spotify playlists using generative AI.

---

## 🚀 Key Features

*   **Interactive Sonic Profiler**: High-fidelity vector SVG-based radar charts tracking 6 core acoustic traits: Acousticness, Danceability, Energy, Instrumentalness, Valence, and Speechiness. Dynamically generated live in sync with mock or real Spotify data.
*   **Weekly DNA Rhythm & Busiest Days**: Interactive bar charts tracking hourly listening density and weekly activity levels using **Recharts** charts. Select any day to highlight a "Daily Spotlight" representing your #1 most played track and its custom AI-curated "mood description".
*   **Affinity DNA Profile**: A scrollable index of top artists with personalized affinity match percentages, deep-dive modal views featuring detailed AI Vibe Profiles, weekly play frequencies, and direct Spotify integration.
*   **Top Tracks Popularity Bar**: Interactive list of top monthly tracks dynamically fetching real popularity scores, custom sound previews, and direct open-to-stream capability.
*   **AI Studio Playlist Curator**:
    *   Powered by the **Gemini 2.5 Flash API**, generating highly tailored 8-10 track playlists from natural language prompts ("lofi study session on a rainy day") or pre-configured vibe pills (Focus, Heartbreak, Hype, Road Trip, Sleep, Party).
    *   Features a custom chat history synced to **Firebase Firestore** so your custom soundtracks and conversations are saved between sessions.
    *   Auto-matches generated titles and artists via Spotify search to retrieve real album art and URIs concurrently.
    *   Allows export and saving of the generated playlist directly to your personal Spotify account with a single click.
*   **Stunning Glassmorphic UI**: Sleek dark mode customized around Spotify's signature neon green, featuring premium micro-animations, shimmer skeletons, high-fidelity responsive styling, and immersive modal windows.
*   **Fully Functional Demo Mode**: Allows immediate access to all interface mockups, randomized mock pools, and playback elements without requiring a Spotify login.

---

## 🛠 Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
*   **Library**: [React 19](https://react.dev/)
*   **Styling**: Modern [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Modules for glassmorphism, responsive grids, and shimmer effects.
*   **Data Visualization**: [Recharts](https://recharts.org/) (Radar, Polar Grid, Bar Charts, Responsive Container, Custom Tooltips)
*   **AI Engine**: [Google Gemini 2.5 Flash API](https://ai.google.dev/) via `@google/generative-ai`
*   **Database**: [Firebase Firestore](https://firebase.google.com/) for user-specific AI Studio sessions & playlist history synchronization.
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Spotify OAuth 2.0 Provider.
*   **External Integration**: [Spotify Web API](https://developer.spotify.com/documentation/web-api) (Search, Profile, Top Tracks/Artists, Recently Played, Audio Features, Playlist Modification).

---

## 📂 Project Architecture

```
spotify-analizer/
├── src/
│   ├── app/
│   │   ├── (dashboard)/            # Dashboard layout containing pages:
│   │   │   ├── analytics/          # Detailed Genre Radar & Hourly Listening Charts
│   │   │   ├── home/               # Weekly overview & Busiest Day Spotlights
│   │   │   └── studio/             # Chat-based AI Playlist Curator
│   │   ├── api/
│   │   │   ├── auth/               # NextAuth setup and Spotify OAuth routes
│   │   │   └── studio/             # Route handler calling Gemini & searching Spotify
│   │   ├── globals.css             # Main theme design system, styling & skeletons
│   │   └── layout.js               # Root layout, Google Font loads & providers
│   ├── components/
│   │   ├── layout/                 # Shared header & sidebar components
│   │   ├── AuthProvider.jsx        # NextAuth Session Provider wrapper
│   │   ├── Icons.jsx               # SVG Lucide React exports
│   │   └── SpotifyLoginModal.jsx   # Premium login wall modal
│   ├── lib/
│   │   ├── firebase.js             # Firestore client connection initializer
│   │   └── spotify.js              # Spotify API Web client helper methods
│   └── styles/                     # CSS modules mapping to specific pages
├── .env.local                      # Private environment configurations (Ignored)
├── next.config.mjs                 # Next.js configurations
└── package.json                    # Configuration list of dependencies
```

---

## ⚙️ Environment Configuration

To run the application locally, you must create a `.env.local` file in the root directory. Populate it with your respective API keys:

```env
# NextAuth Settings
NEXTAUTH_SECRET="your_nextauth_jwt_hash_secret"
NEXTAUTH_URL="http://localhost:3000"

# Spotify API credentials
SPOTIFY_CLIENT_ID="your_spotify_developer_client_id"
SPOTIFY_CLIENT_SECRET="your_spotify_developer_client_secret"

# Google Gemini API key
GEMINI_API_KEY="your_google_gemini_api_key"

# Firebase Client Configuration (Next.js Public)
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
```

> [!NOTE]
> Make sure to configure your **Spotify Developer Dashboard** redirect URI to: `http://localhost:3000/api/auth/callback/spotify`

---

## 🛠 Installation & Local Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/19Kushagra0/spotify-analizer.git
    cd spotify-analizer
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    ```

3.  **Run the local development server:**
    ```bash
    npm run dev
    ```

4.  **Open in your browser:**
    Access [http://localhost:3000](http://localhost:3000) to view the application in action.

---

## 🔒 Security & Scope Authorizations

MusicDNA requests only read-only scopes for analytics:
- `user-read-email`
- `user-top-read`
- `user-read-recently-played`

And write privileges exclusively for the custom playlists you explicitly choose to export:
- `playlist-modify-public`
- `playlist-modify-private`

All calculations (affinity calculations, time peaks) are processed in the user's browser, and no listening details are stored, ensuring absolute privacy.

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.
