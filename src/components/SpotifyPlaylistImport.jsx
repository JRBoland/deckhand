import React, { useState } from 'react';
import { parseSpotifyPlaylistId } from '../utils/parseSpotifyPlaylistId';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setWarning(null);

    const parsed = parseSpotifyPlaylistId(url);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }

    setLoading(true);
    try {
      const endpoint = getImportEndpoint();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrId: url.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(
            'Spotify import API not found (404). Static hosting only serves the React app — it cannot run /api. Deploy the full project to Vercel (recommended: connect the repo; add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in Project → Settings → Environment Variables), or host the API elsewhere and set REACT_APP_SPOTIFY_IMPORT_URL to its full URL before running npm run build.'
          );
        }
        if (res.status === 403) {
          throw new Error(
            data.error ||
              'Spotify returned 403 (forbidden). If the playlist is private, make it public or use a public playlist link. Otherwise check Spotify’s Web API access for your developer app.'
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
        Paste a public playlist link. BPM and key come from Spotify’s audio features (estimates — not the same as Rekordbox analysis).
      </p>
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
          disabled={loading || !url.trim()}
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
