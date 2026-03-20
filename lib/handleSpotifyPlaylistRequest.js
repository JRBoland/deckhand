const { importSpotifyPlaylist } = require('./spotifyPlaylistImport');

function corsHeaders() {
  const allow = process.env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

/**
 * Shared handler for Vercel (req/res) and Netlify (handler event).
 * @param {string} method HTTP method
 * @param {string} rawBody JSON string (use "{}" if empty)
 * @returns {Promise<{ statusCode: number, headers: Record<string, string>, body: string }>}
 */
async function handleSpotifyPlaylistRequest(method, rawBody) {
  const headers = corsHeaders();

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (method !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(rawBody || '{}');
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const urlOrId = body?.urlOrId ?? body?.url ?? body?.playlistUrl;
  if (!urlOrId || typeof urlOrId !== 'string') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing urlOrId (playlist URL or ID).' }),
    };
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const songs = await importSpotifyPlaylist(urlOrId, { clientId, clientSecret });
    return { statusCode: 200, headers, body: JSON.stringify({ songs }) };
  } catch (err) {
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 400;
    return {
      statusCode: status,
      headers,
      body: JSON.stringify({ error: err.message || 'Import failed' }),
    };
  }
}

module.exports = { handleSpotifyPlaylistRequest };
