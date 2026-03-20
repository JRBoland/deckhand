/**
 * Client-side validation helper (mirrors lib/parseSpotifyPlaylistId.js).
 * @param {string} input
 * @returns {{ id: string } | { error: string }}
 */
export function parseSpotifyPlaylistId(input) {
  if (!input || typeof input !== 'string') {
    return { error: 'Paste a Spotify playlist link or ID.' };
  }
  const trimmed = input.trim();

  const uriMatch = trimmed.match(/^spotify:playlist:([a-zA-Z0-9]+)/i);
  if (uriMatch) {
    return { id: uriMatch[1] };
  }

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, '');
    if (!host.includes('spotify.com')) {
      return { error: 'URL must be a Spotify playlist link.' };
    }
    const pathMatch = u.pathname.match(/\/playlist\/([a-zA-Z0-9]+)/);
    if (pathMatch) {
      return { id: pathMatch[1] };
    }
  } catch {
    /* not a valid URL */
  }

  if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
    return { id: trimmed };
  }

  return { error: 'Could not find a playlist ID in that link.' };
}
