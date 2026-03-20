const { handleSpotifyPlaylistRequest } = require('../lib/handleSpotifyPlaylistRequest');

function bodyToString(req) {
  if (req.body == null) return '{}';
  if (typeof req.body === 'string') return req.body;
  return JSON.stringify(req.body);
}

module.exports = async (req, res) => {
  const result = await handleSpotifyPlaylistRequest(req.method, bodyToString(req));

  Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));

  if (result.statusCode === 204) {
    return res.status(204).end();
  }

  return res.status(result.statusCode).send(result.body);
};
