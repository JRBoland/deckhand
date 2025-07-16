import React from 'react';

const SelectedSongDisplay = ({ song, onClear, onAddToPlaylist }) => {
  // This function now only adds the song to the playlist.
  const handleAddClick = () => {
    onAddToPlaylist(song);
  };

  return (
    <div className="relative p-4 mb-6 bg-slate-600 text-white rounded-lg shadow-lg">
      <p className="font-bold text-sm">FILTERING BY:</p>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-lg">{song.name}</h2>
          <p>{song.artist}</p>
          <p className="mt-1 text-slate-200">
            BPM: {song.bpm} | Key: {song.key}
          </p>
        </div>
        <button
          onClick={handleAddClick} // Use the updated function name here
          className="ml-4 px-3 py-2 text-sm font-semibold text-indigo-700 bg-white rounded-lg shadow-sm hover:bg-gray-200"
        >
          Add
        </button>
      </div>
      <button
        onClick={onClear}
        className="absolute top-2 right-2 text-white bg-slate-500 hover:bg-slate-400 rounded-full h-8 w-8 flex items-center justify-center font-bold"
        aria-label="Clear selection"
      >
        &times;
      </button>
    </div>
  );
};

export default SelectedSongDisplay;