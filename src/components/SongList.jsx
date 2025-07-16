// src/components/SongList.jsx
import React from 'react';

const SongList = ({ songs, onSongSelect, onAddToPlaylist }) => { // Add onAddToPlaylist prop
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
            className="flex-grow cursor-pointer  min-w-0"
            onClick={() => onSongSelect(song)}
          >
            <p className="font-bold text-lg text-gray-800 truncate">{song.name}</p>
            <p className="text-gray-600 truncate">{song.artist}</p>
            {/* Details (BPM/Key) now stack on mobile */}
            <div className="flex gap-4 mt-2 sm:mt-1">
              <p className="font-semibold text-sm text-indigo-600">BPM: {song.bpm}</p>
              <p className="font-semibold text-sm text-purple-600">Key: {song.key}</p>
            </div>
          </div>
          {/* "Add" button with mobile margin */}
          <button
            onClick={() => onAddToPlaylist(song)}
            className="mt-4 sm:mt-0 sm:ml-4 px-4 py-2 w-full sm:w-auto text-sm font-semibold text-white bg-emerald-500 rounded-lg shadow-sm hover:bg-emerald-600 flex-shrink-0"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default SongList;