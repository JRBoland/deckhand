/**
 * Local API for Spotify import. Run: npm run server
 * CRA dev server proxies /api → this server (see src/setupProxy.js).
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { importSpotifyPlaylist } = require('../lib/spotifyPlaylistImport');

const app = express();
const PORT = process.env.PORT || 3001;

const allowed = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map((s) => s.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: allowed,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());

app.post('/api/spotify-playlist', async (req, res) => {
  const urlOrId = req.body?.urlOrId ?? req.body?.url ?? req.body?.playlistUrl;
  if (!urlOrId || typeof urlOrId !== 'string') {
    return res.status(400).json({ error: 'Missing urlOrId (playlist URL or ID).' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const songs = await importSpotifyPlaylist(urlOrId, { clientId, clientSecret });
    res.json({ songs });
  } catch (err) {
    const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 400;
    res.status(status).json({ error: err.message || 'Import failed' });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Spotify import API listening on http://localhost:${PORT}`);
});
