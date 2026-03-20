/**
 * Spotify Audio Features: pitch class 0–11 (C=0) and mode 0=minor, 1=major.
 * Returns Open Key / Camelot code (e.g. "8B") or empty string if unknown.
 * @see https://developer.spotify.com/documentation/web-api/reference/get-audio-features
 */

const MAJOR = ['8B', '3B', '10B', '5B', '12B', '7B', '2B', '9B', '4B', '11B', '6B', '1B'];
const MINOR = ['5A', '12A', '7A', '2A', '9A', '4A', '11A', '6A', '1A', '8A', '3A', '10A'];

function spotifyKeyToCamelot(key, mode) {
  if (key == null || mode == null || key < 0 || key > 11 || (mode !== 0 && mode !== 1)) {
    return '';
  }
  return mode === 1 ? MAJOR[key] : MINOR[key];
}

module.exports = { spotifyKeyToCamelot };
