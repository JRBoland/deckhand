const { handleSpotifyClientIdRequest } = require('../lib/handleSpotifyClientIdRequest');

module.exports = async (req, res) => {
  const result = await handleSpotifyClientIdRequest(req.method);

  Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));

  if (result.statusCode === 204) {
    return res.status(204).end();
  }

  return res.status(result.statusCode).send(result.body);
};
