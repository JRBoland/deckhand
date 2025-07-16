// src/components/SavedPlaylists.jsx
import React from 'react';

const SavedPlaylists = ({ savedPlaylists, onLoad, onDelete }) => {
  if (savedPlaylists.length === 0) return null;

  return (
    <div className="bg-gray-200 p-4 rounded-lg mb-6">
      <h3 className="text-xl font-bold mb-3">Saved Playlists</h3>
      <div className="space-y-2">
        {savedPlaylists.map((playlist) => (
          <div key={playlist.id} className="bg-white p-2 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{playlist.name}</p>
              <p className="text-sm text-gray-500">{playlist.songs.length} tracks</p>
            </div>
            <div>
              <button
                onClick={() => onLoad(playlist.songs)}
                className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"
              >
                Load
              </button>
              <button
                onClick={() => onDelete(playlist.id)}
                className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPlaylists;