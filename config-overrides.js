const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Add fallbacks for node core modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "timers": require.resolve("timers-browserify"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
    };
    return config;
  }
);