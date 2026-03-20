const { spotifyKeyToCamelot } = require('./spotifyKeyToCamelot');
const { parseSpotifyPlaylistId } = require('./parseSpotifyPlaylistId');

const SPOTIFY_API = 'https://api.spotify.com/v1';
const MAX_TRACKS = 800;
const AUDIO_FEATURES_BATCH = 100;
const ARTISTS_BATCH = 50;
/** Spotify playlist items max per request is 50 */
const PLAYLIST_PAGE = 50;

function getDefaultMarket() {
  const m = (process.env.SPOTIFY_DEFAULT_MARKET || 'US').trim().toUpperCase();
  return /^[A-Z]{2}$/.test(m) ? m : 'US';
}

/**
 * Playlist pages: force `additional_types=track` so Spotify does not try to return episodes
 * (episode rows often trigger 403 without extra market / scopes). Optionally add `market` for
 * client-credentials-only calls (no user country).
 */
function finalizePlaylistTracksPageUrl(url, { useMarket, market }) {
  try {
    const u = new URL(url);
    if (!u.searchParams.has('additional_types')) {
      u.searchParams.set('additional_types', 'track');
    }
    if (useMarket && !u.searchParams.has('market')) {
      u.searchParams.set('market', market);
    }
    return u.toString();
  } catch {
    return url;
  }
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

async function getClientCredentialsToken(clientId, clientSecret) {
  const body = new URLSearchParams({ grant_type: 'client_credentials' });
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify auth failed (${res.status}). Check SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET. ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

function releaseYear(album) {
  const d = album?.release_date;
  if (!d) return null;
  const y = parseInt(String(d).slice(0, 4), 10);
  return Number.isNaN(y) ? null : y;
}

function artistNames(track) {
  const artists = track?.artists;
  if (!Array.isArray(artists) || artists.length === 0) return 'Unknown';
  return artists.map((a) => a.name).filter(Boolean).join(', ') || 'Unknown';
}

function collectArtistIds(tracks) {
  const ids = new Set();
  for (const t of tracks) {
    const artists = t?.artists;
    if (!Array.isArray(artists)) continue;
    for (const a of artists) {
      if (a?.id) ids.add(a.id);
    }
  }
  return [...ids];
}

/** @returns {{ map: Map, accessDenied: boolean }} */
async function fetchArtistGenresMap(artistIds, token) {
  const map = new Map();
  for (const batch of chunk(artistIds, ARTISTS_BATCH)) {
    const path = `/artists?ids=${encodeURIComponent(batch.join(','))}`;
    const res = await fetch(`${SPOTIFY_API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        return { map, accessDenied: true };
      }
      const text = await res.text();
      let msg = `Spotify artists request failed (${res.status}).`;
      try {
        const j = JSON.parse(text);
        if (j.error?.message) msg = j.error.message;
      } catch {
        if (text) msg = text.slice(0, 200);
      }
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    const data = await res.json();
    const list = data.artists || [];
    for (const a of list) {
      if (a?.id && Array.isArray(a.genres) && a.genres.length > 0) {
        map.set(a.id, a.genres[0]);
      }
    }
    await new Promise((r) => setTimeout(r, 80));
  }
  return { map, accessDenied: false };
}

/**
 * @param {boolean} isUserToken - when true, omit `market` on the first request so Spotify uses the user’s account country.
 */
async function fetchAllPlaylistTracks(playlistId, token, market, isUserToken) {
  const out = [];
  const useMarket = !isUserToken;

  const qp = new URLSearchParams({
    limit: String(PLAYLIST_PAGE),
    offset: '0',
    additional_types: 'track',
  });
  if (useMarket) {
    qp.set('market', market);
  }

  let nextUrl = `${SPOTIFY_API}/playlists/${encodeURIComponent(playlistId)}/tracks?${qp}`;

  while (nextUrl && out.length < MAX_TRACKS) {
    const url = finalizePlaylistTracksPageUrl(nextUrl, { useMarket, market });
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const text = await res.text();
      let msg = `Failed to load playlist (${res.status}).`;
      try {
        const j = JSON.parse(text);
        if (j.error?.message) msg = j.error.message;
      } catch {
        /* ignore */
      }
      if (res.status === 403) {
        msg +=
          ' If you recently updated this app, sign out of Spotify here and sign in again. Otherwise the playlist may include restricted content, or Spotify may be blocking this app’s access.';
      }
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    const data = await res.json();
    for (const item of data.items || []) {
      const track = item?.track;
      if (!track || track.type !== 'track') continue;
      if (track.is_local) continue;
      if (!track.id) continue;
      out.push(track);
      if (out.length >= MAX_TRACKS) break;
    }
    nextUrl = out.length >= MAX_TRACKS ? null : data.next || null;
    if (nextUrl) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  return out;
}

/**
 * Spotify often returns 403 for /audio-features on apps affected by the Nov 2024 Web API policy.
 * We degrade gracefully: still import tracks with bpm/key left empty.
 * @returns {{ map: Map, accessDenied: boolean }}
 */
async function fetchAudioFeaturesForTracks(trackIds, token) {
  const map = new Map();
  for (const batch of chunk(trackIds, AUDIO_FEATURES_BATCH)) {
    const path = `/audio-features?ids=${encodeURIComponent(batch.join(','))}`;
    const res = await fetch(`${SPOTIFY_API}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        return { map: new Map(), accessDenied: true };
      }
      const text = await res.text();
      let msg = `Spotify audio-features failed (${res.status}).`;
      try {
        const j = JSON.parse(text);
        if (j.error?.message) msg = j.error.message;
      } catch {
        if (text) msg = text.slice(0, 200);
      }
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    const data = await res.json();
    const list = data.audio_features || [];
    for (const af of list) {
      if (af?.id) map.set(af.id, af);
    }
    await new Promise((r) => setTimeout(r, 80));
  }
  return { map, accessDenied: false };
}

function mapToSong(track, audioFeatures, genreByArtistId) {
  const af = audioFeatures.get(track.id);
  let key = '';
  let bpm = 0;
  if (af) {
    if (af.key != null && af.mode != null) {
      key = spotifyKeyToCamelot(af.key, af.mode);
    }
    if (typeof af.tempo === 'number' && !Number.isNaN(af.tempo)) {
      bpm = Math.round(af.tempo * 10) / 10;
    }
  }

  let genre = 'Unknown';
  const primaryArtist = track.artists?.[0];
  if (primaryArtist?.id && genreByArtistId.has(primaryArtist.id)) {
    genre = genreByArtistId.get(primaryArtist.id);
  }

  const year = releaseYear(track.album);

  return {
    id: track.id,
    name: track.name || 'Unknown',
    artist: artistNames(track),
    bpm,
    key,
    year,
    genre,
    totalTime: track.duration_ms != null ? Math.round(track.duration_ms / 1000) : 0,
  };
}

/**
 * @param {string} urlOrId
 * @param {{ clientId: string, clientSecret: string, userAccessToken?: string }} creds
 * @returns {Promise<{ songs: object[], warnings: string[] }>}
 */
async function importSpotifyPlaylist(urlOrId, creds) {
  const warnings = [];
  const parsed = parseSpotifyPlaylistId(urlOrId);
  if (parsed.error) {
    throw new Error(parsed.error);
  }
  const { id: playlistId } = parsed;

  const { clientId, clientSecret, userAccessToken } = creds;
  const trimmedUser =
    typeof userAccessToken === 'string' ? userAccessToken.trim() : '';

  let token;
  if (trimmedUser) {
    token = trimmedUser;
  } else {
    if (!clientId || !clientSecret) {
      throw new Error(
        'Server is missing Spotify credentials, or you need to sign in with Spotify first (button above).'
      );
    }
    token = await getClientCredentialsToken(clientId, clientSecret);
  }
  const market = getDefaultMarket();
  const tracks = await fetchAllPlaylistTracks(playlistId, token, market, !!trimmedUser);
  if (tracks.length === 0) {
    throw new Error('No playable tracks found in that playlist (local files and episodes are skipped).');
  }

  const trackIds = tracks.map((t) => t.id);
  const { map: audioFeatures, accessDenied: audioFeaturesDenied } =
    await fetchAudioFeaturesForTracks(trackIds, token);
  if (audioFeaturesDenied) {
    warnings.push(
      'Spotify blocked audio features (BPM/key) for this developer app — common under current Web API rules. Tracks still loaded; turn off BPM/key filters or apply for extended API access on the Spotify Developer Dashboard.'
    );
  }

  const artistIds = collectArtistIds(tracks);
  const { map: genreByArtistId, accessDenied: artistsDenied } =
    await fetchArtistGenresMap(artistIds, token);
  if (artistsDenied && artistIds.length > 0) {
    warnings.push(
      'Spotify blocked artist metadata for this app; genres stay “Unknown”.'
    );
  }

  const songs = tracks.map((t) => mapToSong(t, audioFeatures, genreByArtistId));
  return { songs, warnings };
}

module.exports = {
  importSpotifyPlaylist,
  parseSpotifyPlaylistId,
};
