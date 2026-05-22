// src/lib/spotify.js

// 1. Fetch Top Tracks
export async function getTopTracks(accessToken, limit = 5) {
  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch top tracks");
  return response.json();
}

// 2. Fetch Top Artists
export async function getTopArtists(accessToken, limit = 5) {
  const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch top artists");
  return response.json();
}

// 3. Fetch Recently Played Tracks (Max 50)
export async function getRecentlyPlayed(accessToken) {
  const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch recently played");
  return response.json();
}
