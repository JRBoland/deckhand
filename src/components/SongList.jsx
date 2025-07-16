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
          className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
        >
          <div
            className="flex-grow cursor-pointer"
            onClick={() => onSongSelect(song)}
          >
            <p className="font-bold text-lg text-gray-800">{song.name}</p>
            <p className="text-gray-600">{song.artist}</p>
            <div className="flex gap-4 mt-1">
              <p className="font-semibold text-sm text-indigo-600">BPM: {song.bpm}</p>
              <p className="font-semibold text-sm text-purple-600">Key: {song.key}</p>
            </div>
          </div>
          <button
            onClick={() => onAddToPlaylist(song)}
            className="ml-4 px-3 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg shadow-sm hover:bg-green-600"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default SongList;