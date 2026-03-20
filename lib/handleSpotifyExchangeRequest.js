const SPOTIFY_TOKEN = 'https://accounts.spotify.com/api/token';

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
 * Spotify Authorization Code + PKCE token exchange (proxied so browser can avoid CORS on accounts.spotify.com).
 */
async function handleSpotifyExchangeRequest(method, rawBody) {
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

  const { code, redirectUri, codeVerifier } = body;
  if (!code || typeof code !== 'string') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing code.' }),
    };
  }
  if (!redirectUri || typeof redirectUri !== 'string') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing redirectUri.' }),
    };
  }
  if (!codeVerifier || typeof codeVerifier !== 'string') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing codeVerifier.' }),
    };
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server missing SPOTIFY_CLIENT_ID.' }),
    };
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const tokenHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (clientSecret) {
    tokenHeaders.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
  }

  const res = await fetch(SPOTIFY_TOKEN, {
    method: 'POST',
    headers: tokenHeaders,
    body: params.toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: `Spotify token exchange failed (${res.status}): ${text.slice(0, 400)}`,
      }),
    };
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: 'Invalid token response from Spotify.' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      access_token: data.access_token,
      expires_in: data.expires_in,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
    }),
  };
}

module.exports = { handleSpotifyExchangeRequest };
