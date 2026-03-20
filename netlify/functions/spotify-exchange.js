const { handleSpotifyExchangeRequest } = require('../../lib/handleSpotifyExchangeRequest');

exports.handler = async (event) => {
  const result = await handleSpotifyExchangeRequest(
    event.httpMethod,
    event.body || '{}'
  );

  return {
    statusCode: result.statusCode,
    headers: result.headers,
    body: result.body,
  };
};
