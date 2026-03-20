const { handleSpotifyPlaylistRequest } = require('../../lib/handleSpotifyPlaylistRequest');

exports.handler = async (event) => {
  const result = await handleSpotifyPlaylistRequest(
    event.httpMethod,
    event.body || '{}'
  );

  return {
    statusCode: result.statusCode,
    headers: result.headers,
    body: result.body,
  };
};
