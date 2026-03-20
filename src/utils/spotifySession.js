import {
  getSpotifyRedirectUri,
  PKCE_VERIFIER_KEY,
  OAUTH_STATE_KEY,
} from './spotifyPkce';

const ACCESS_TOKEN_KEY = 'deckhand-spotify-access-token';
const TOKEN_EXPIRES_KEY = 'deckhand-spotify-token-expires';

function rewritePlaylistApiPath(playlistUrl, suffix) {
  try {
    const u = new URL(playlistUrl.trim());
    u.pathname = u.pathname.replace(/spotify-playlist\/?$/, suffix);
    return u.toString();
  } catch {
    return null;
  }
}

export function getSpotifyClientIdEndpoint() {
  const playlistUrl = process.env.REACT_APP_SPOTIFY_IMPORT_URL;
  if (playlistUrl && playlistUrl.trim()) {
    const rewritten = rewritePlaylistApiPath(playlistUrl, 'spotify-client-id');
    if (rewritten) return rewritten;
  }
  return '/api/spotify-client-id';
}

function getExchangeEndpoint() {
  const playlistUrl = process.env.REACT_APP_SPOTIFY_IMPORT_URL;
  if (playlistUrl && playlistUrl.trim()) {
    const rewritten = rewritePlaylistApiPath(playlistUrl, 'spotify-exchange');
    if (rewritten) return rewritten;
  }
  return '/api/spotify-exchange';
}

/**
 * After Spotify redirects back with ?code=&state=, exchange for tokens.
 */
export async function finalizeSpotifyOAuthFromUrl(searchParams) {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  if (!code || !state) {
    return { ok: false };
  }

  const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);
  const verifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);
  if (!verifier || state !== expectedState) {
    return {
      ok: false,
      error: 'Sign-in session expired. Please try “Sign in with Spotify” again.',
    };
  }

  const redirectUri = getSpotifyRedirectUri();

  const res = await fetch(getExchangeEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      redirectUri,
      codeVerifier: verifier,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Token exchange failed (${res.status})`);
  }

  sessionStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  if (typeof data.expires_in === 'number') {
    sessionStorage.setItem(
      TOKEN_EXPIRES_KEY,
      String(Date.now() + data.expires_in * 1000)
    );
  }

  sessionStorage.removeItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(PKCE_VERIFIER_KEY);

  return { ok: true };
}

export function getStoredSpotifyAccessToken() {
  const t = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (!t) return null;
  const exp = sessionStorage.getItem(TOKEN_EXPIRES_KEY);
  if (exp && Date.now() > parseInt(exp, 10) - 60_000) {
    return null;
  }
  return t;
}

export function clearSpotifySession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRES_KEY);
  sessionStorage.removeItem(PKCE_VERIFIER_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
}

export function readSpotifyOAuthError() {
  const key = 'deckhand-spotify-oauth-error';
  const msg = sessionStorage.getItem(key);
  if (msg) sessionStorage.removeItem(key);
  return msg;
}

export function setSpotifyOAuthError(message) {
  sessionStorage.setItem('deckhand-spotify-oauth-error', message);
}
