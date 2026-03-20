/** @see https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow */

// user-read-private: lets Spotify infer market from the user’s account (avoids some playlist 403s).
export const SPOTIFY_OAUTH_SCOPES =
  'playlist-read-private playlist-read-collaborative user-read-private';

const PKCE_VERIFIER_KEY = 'deckhand-spotify-pkce-verifier';
const OAUTH_STATE_KEY = 'deckhand-spotify-oauth-state';

function randomString(length) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let s = '';
  for (let i = 0; i < length; i += 1) {
    s += chars[arr[i] % chars.length];
  }
  return s;
}

function base64urlFromBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function createPkcePair() {
  const verifier = randomString(64);
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(verifier));
  const challenge = base64urlFromBuffer(digest);
  return { verifier, challenge };
}

/**
 * Must match exactly what you add under Redirect URIs in the Spotify Developer Dashboard.
 */
export function getSpotifyRedirectUri() {
  const override = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  if (override && override.trim()) {
    return override.trim();
  }
  return `${window.location.origin}/`;
}

export async function startSpotifyLogin(clientId) {
  const { verifier, challenge } = await createPkcePair();
  const state = randomString(24);
  sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);
  sessionStorage.setItem(OAUTH_STATE_KEY, state);

  const redirectUri = getSpotifyRedirectUri();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: SPOTIFY_OAUTH_SCOPES,
    redirect_uri: redirectUri,
    state,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    show_dialog: 'false',
  });

  window.location.assign(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

export { PKCE_VERIFIER_KEY, OAUTH_STATE_KEY };
