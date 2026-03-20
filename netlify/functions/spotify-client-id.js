const { handleSpotifyClientIdRequest } = require('../../lib/handleSpotifyClientIdRequest');

exports.handler = async (event) => {
  const result = await handleSpotifyClientIdRequest(event.httpMethod);

  return {
    statusCode: result.statusCode,
    headers: result.headers,
    body: result.body,
  };
};
