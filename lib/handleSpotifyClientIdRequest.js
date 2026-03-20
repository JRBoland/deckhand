/**
 * Exposes Spotify Client ID to the browser at runtime so it is not baked into the JS bundle.
 * (Netlify secrets scanning fails builds when SPOTIFY_CLIENT_ID's value appears in static output.)
 * The Client ID is public in OAuth; only the Client Secret stays server-only.
 */

function corsHeaders() {
  const allow = process.env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

async function handleSpotifyClientIdRequest(method) {
  const headers = corsHeaders();

  if (method === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (method !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID || '';
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ clientId }),
  };
}

module.exports = { handleSpotifyClientIdRequest };
