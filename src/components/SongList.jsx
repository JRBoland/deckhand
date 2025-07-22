import React from 'react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === null) return "N/A";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const SongList = ({ songs, onSongSelect, onAddToPlaylist }) => {
  if (songs.length === 0) {
    return <p className="text-center text-gray-500">No songs to display.</p>;
  }

  return (
    <div className="space-y-3">
      {songs.map((song) => (
        <div
          key={song.id}
          className="p-3 bg-white rounded-lg shadow-md" // Reduced padding
        >
          {/* Top section: Title, Artist, and Add button */}
          <div className="flex justify-between items-start">
            <div
              className="flex-grow cursor-pointer min-w-0"
              onClick={() => onSongSelect(song)}
            >
              <p className="font-bold text-base text-gray-800 truncate">{song.name}</p>
              <p className="text-sm text-gray-600 truncate">{song.artist}</p>
            </div>
            <button
              onClick={() => onAddToPlaylist(song)}
              className="ml-2 px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 flex-shrink-0"
            >
              Add
            </button>
          </div>

          {/* Bottom section: All metadata */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 sm:mt-1">
              <p className="font-semibold text-sm text-indigo-600">BPM: {song.bpm}</p>
              <p className="font-semibold text-sm text-purple-600">Key: {song.key}</p>
            </div>

            {/* NEW: Secondary metadata (Year, Genre, Duration) */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-gray-500 border-t pt-2">
              {song.year && <span>Year: {song.year}</span>}
              {song.genre && <span> Genre: {song.genre}</span>}
              {song.totalTime > 0 && <span> Length: {formatTime(song.totalTime)}</span>}
            </div>
        </div>
      ))}
    </div>
  );
};

export default SongList;