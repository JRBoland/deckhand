import React from 'react';

// NEW: Helper function to format seconds into MM:SS
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
          className="p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center"
        >
          {/* Main info section */}
          <div
            className="flex-grow cursor-pointer min-w-0"
            onClick={() => onSongSelect(song)}
          >
            <p className="font-bold text-lg text-gray-800 truncate">{song.name}</p>
            <p className="text-gray-600 truncate">{song.artist}</p>
            
            {/* Primary metadata */}
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
          
          {/* "Add" button */}
          <button
            onClick={() => onAddToPlaylist(song)}
            className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 w-full sm:w-auto text-sm font-semibold text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600 flex-shrink-0"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default SongList;