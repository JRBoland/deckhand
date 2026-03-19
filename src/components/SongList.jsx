import React from 'react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return "N/A";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const SongList = ({ songs, onSongSelect, onAddToPlaylist }) => {
  if (songs.length === 0) {
    return <p className="text-center text-mute font-sans py-4">No songs to display.</p>;
  }

  return (
    <div className="space-y-3">
      {songs.map((song) => (
        <div
          key={song.id}
          className="card-brutal p-3"
        >
          <div className="flex justify-between items-start">
            <div
              className="flex-grow cursor-pointer min-w-0"
              onClick={() => onSongSelect(song)}
            >
              <p className="font-display font-bold text-base text-ink truncate">{song.name}</p>
              <p className="text-sm text-mute font-sans truncate">{song.artist}</p>
            </div>
            <button
              onClick={() => onAddToPlaylist(song)}
              className="btn-primary ml-2 px-3 py-1.5 text-sm flex-shrink-0"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 sm:mt-1">
            <p className="font-display font-semibold text-sm text-ink">BPM: {song.bpm}</p>
            <p className="font-display font-semibold text-sm text-ink">Key: {song.key}</p>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-mute font-sans border-t-2 border-border pt-2">
            {song.year && <span>Year: {song.year}</span>}
            {song.genre && <span> Genre: {song.genre}</span>}
            {song.totalTime > 0 && <span> Length: {formatTime(song.totalTime)}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(SongList);
