import React, { useState, useEffect, useCallback } from 'react';
import { parseSpotifyPlaylistId } from '../utils/parseSpotifyPlaylistId';
import { startSpotifyLogin } from '../utils/spotifyPkce';
import {
  getStoredSpotifyAccessToken,
  clearSpotifySession,
  readSpotifyOAuthError,
  getSpotifyClientIdEndpoint,
} from '../utils/spotifySession';

const defaultEndpoint = '/api/spotify-playlist';

function getImportEndpoint() {
  const fromEnv = process.env.REACT_APP_SPOTIFY_IMPORT_URL;
  if (fromEnv && fromEnv.trim()) {
    return fromEnv.trim();
  }
  return defaultEndpoint;
}

const SpotifyPlaylistImport = ({ onFileUpload }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(() => !!getStoredSpotifyAccessToken());
  const [oauthClientId, setOauthClientId] = useState(null);
  const [clientIdLoading, setClientIdLoading] = useState(true);

  const refreshSignedIn = useCallback(() => {
    setSignedIn(!!getStoredSpotifyAccessToken());
  }, []);

  useEffect(() => {
    const onAuthDone = () => {
      refreshSignedIn();
      const oauthErr = readSpotifyOAuthError();
      if (oauthErr) setError(oauthErr);
    };
    window.addEventListener('deckhand-spotify-auth-done', onAuthDone);
    return () => window.removeEventListener('deckhand-spotify-auth-done', onAuthDone);
  }, [refreshSignedIn]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(getSpotifyClientIdEndpoint());
        const data = await res.json().catch(() => ({}));
        if (!cancelled && data.clientId && typeof data.clientId === 'string') {
          setOauthClientId(data.clientId.trim());
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setClientIdLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignIn = async () => {
    setError(null);
    if (!oauthClientId) {
      setError(
        'Could not load Spotify Client ID from the server. Set SPOTIFY_CLIENT_ID in Netlify (or .env for local dev) and ensure /api/spotify-client-id is deployed.'
      );
      return;
    }
    await startSpotifyLogin(oauthClientId);
  };

  const handleSignOut = () => {
    clearSpotifySession();
    refreshSignedIn();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setWarning(null);

    const parsed = parseSpotifyPlaylistId(url);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    const accessToken = getStoredSpotifyAccessToken();
    if (!accessToken) {
      setError('Sign in with Spotify first (required for playlist import with current Spotify API rules).');
      return;
    }

    setLoading(true);
    try {
      const endpoint = getImportEndpoint();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrId: url.trim(), accessToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(
            'Spotify import API not found (404). Static hosting only serves the React app — it cannot run /api. Deploy the full project to Vercel (recommended: connect the repo; add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Project → Settings → Environment Variables), or host the API elsewhere and set REACT_APP_SPOTIFY_IMPORT_URL to its full URL before running npm run build.'
          );
        }
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      if (!Array.isArray(data.songs) || data.songs.length === 0) {
        throw new Error('No songs returned from Spotify.');
      }
      if (Array.isArray(data.warnings) && data.warnings.length > 0) {
        setWarning(data.warnings.join(' '));
      }
      onFileUpload(data.songs);
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Could not reach the import API. Run `npm run server` in another terminal (with Spotify env vars), or set REACT_APP_SPOTIFY_IMPORT_URL to your deployed API.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-brutal p-4">
      <h2 className="block font-display text-lg font-semibold text-ink mb-2">
        Or load a Spotify playlist
      </h2>
      <p className="text-mute text-sm font-sans mb-3">
        Sign in with Spotify once, then paste a playlist link. (Spotify no longer allows anonymous playlist reads for most new apps.) If import fails with “Forbidden” after an update, use <strong className="text-ink">Sign out</strong> then sign in again so new permissions apply. BPM/key may still be missing depending on your API access.
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {signedIn ? (
          <>
            <span className="text-sm font-sans text-ink font-semibold">Signed in to Spotify</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-sm font-display font-semibold underline text-mute hover:text-ink"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading || clientIdLoading}
            className="font-display font-semibold px-4 py-2 rounded-brutal border-2 border-border bg-[#1DB954] text-white shadow-brutal-sm hover:brightness-95 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-60"
          >
            {clientIdLoading ? 'Loading…' : 'Sign in with Spotify'}
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:items-stretch">
        <input
          type="text"
          name="spotify-playlist"
          autoComplete="off"
          placeholder="https://open.spotify.com/playlist/…"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          className="input-brutal flex-1 min-w-0 font-sans text-sm"
        />
        <button
          type="submit"
          disabled={loading || !url.trim() || !signedIn}
          className="font-display font-semibold px-4 py-2 rounded-brutal border-2 border-border bg-primary text-primary-ink shadow-brutal-sm hover:bg-[#b8e84a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0"
        >
          {loading ? 'Loading…' : 'Load from Spotify'}
        </button>
      </form>
      {warning && (
        <div className="mt-4 bg-amber-50 border-2 border-border border-l-4 border-l-warning rounded-brutal p-3 shadow-brutal-sm">
          <p className="font-display font-bold text-ink">Note</p>
          <p className="text-ink text-sm font-sans">{warning}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-50 border-2 border-border border-l-4 border-l-destructive rounded-brutal p-3 shadow-brutal-sm">
          <p className="font-display font-bold text-destructive">Error</p>
          <p className="text-ink text-sm font-sans">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SpotifyPlaylistImport;
