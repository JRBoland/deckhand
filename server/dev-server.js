/**
 * Local API for Spotify import. Run: npm run server
 * CRA dev server proxies /api → this server (see src/setupProxy.js).
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { handleSpotifyPlaylistRequest } = require('../lib/handleSpotifyPlaylistRequest');
const { handleSpotifyExchangeRequest } = require('../lib/handleSpotifyExchangeRequest');

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

function sendHandlerResult(res, result) {
  Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));
  if (result.statusCode === 204) {
    return res.status(204).end();
  }
  return res.status(result.statusCode).send(result.body);
}

app.post('/api/spotify-playlist', async (req, res) => {
  const result = await handleSpotifyPlaylistRequest('POST', JSON.stringify(req.body || {}));
  sendHandlerResult(res, result);
});

app.post('/api/spotify-exchange', async (req, res) => {
  const result = await handleSpotifyExchangeRequest('POST', JSON.stringify(req.body || {}));
  sendHandlerResult(res, result);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Spotify import API listening on http://localhost:${PORT}`);
});
