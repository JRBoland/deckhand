import { spotifyKeyToCamelot } from './spotifyKeyToCamelot';

describe('spotifyKeyToCamelot', () => {
  it('maps C major to 8B', () => {
    expect(spotifyKeyToCamelot(0, 1)).toBe('8B');
  });
  it('maps A minor to 8A', () => {
    expect(spotifyKeyToCamelot(9, 0)).toBe('8A');
  });
  it('returns empty for unknown key', () => {
    expect(spotifyKeyToCamelot(-1, 1)).toBe('');
  });
});
