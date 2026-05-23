import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt, mood } = await req.json();
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    // Call Gemini 2.5 Flash to generate playlist recommendation
    const geminiPrompt = `
You are a expert music curator AI.
Generate a playlist of 8-10 tracks that match this mood/moment description: "${prompt}"${mood ? ` (primary vibe: ${mood})` : ''}.
Return a raw JSON array of objects. Do NOT include markdown styling, no backticks, no "json" tags, no leading or trailing commentary. Just return the valid JSON array.

Each object in the array must contain:
1. "name": The exact name of the track (e.g., "Midnight City")
2. "artist": The primary artist name (e.g., "M83")
3. "badge": A short 1-2 word mood/vibe tag for this track (e.g., "synth mood", "driving bass", "chill vocals")
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', errText);
      return NextResponse.json({ error: 'Failed to generate playlist from Gemini' }, { status: 502 });
    }

    const data = await geminiResponse.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      return NextResponse.json({ error: 'No recommendation returned from Gemini' }, { status: 500 });
    }

    let tracks = [];
    try {
      tracks = JSON.parse(responseText.trim());
    } catch (parseErr) {
      console.error('Failed to parse JSON from Gemini:', responseText, parseErr);
      return NextResponse.json({ error: 'Invalid recommendation format returned from AI' }, { status: 500 });
    }

    // Now, if we have a Spotify accessToken, search Spotify for each track to retrieve real album art and track URIs!
    const enrichedTracks = [];
    
    if (accessToken && Array.isArray(tracks)) {
      // Fetch concurrently to speed up the response
      const searchPromises = tracks.map(async (track) => {
        try {
          const searchQuery = `track:${track.name} artist:${track.artist}`;
          const spotifySearchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=1`;
          
          const searchResponse = await fetch(spotifySearchUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          if (searchResponse.ok) {
            const searchData = await searchResponse.json();
            const spotifyTrack = searchData.tracks?.items?.[0];
            
            if (spotifyTrack) {
              return {
                name: spotifyTrack.name,
                artist: spotifyTrack.artists.map(a => a.name).join(', '),
                img: spotifyTrack.album?.images?.[0]?.url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop',
                uri: spotifyTrack.uri,
                badge: track.badge || 'vibe check',
              };
            }
          }
        } catch (e) {
          console.error(`Error searching Spotify for ${track.name}:`, e);
        }
        
        // Fallback if not found or search failed
        return {
          name: track.name,
          artist: track.artist,
          img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop',
          uri: null,
          badge: track.badge || 'match',
        };
      });

      const results = await Promise.all(searchPromises);
      enrichedTracks.push(...results);
    } else {
      // Fallback if no accessToken
      const results = tracks.map(track => ({
        name: track.name,
        artist: track.artist,
        img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=200&auto=format&fit=crop',
        uri: null,
        badge: track.badge || 'match',
      }));
      enrichedTracks.push(...results);
    }

    return NextResponse.json({
      playlistName: `${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}`,
      tracks: enrichedTracks
    });
    
  } catch (error) {
    console.error('API Studio Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
