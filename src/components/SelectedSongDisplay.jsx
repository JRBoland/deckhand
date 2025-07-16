import React from 'react';

const SelectedSongDisplay = ({ song, onClear, onAddToPlaylist }) => {
  // This function now only adds the song to the playlist.
  const handleAddClick = () => {
    onAddToPlaylist(song);
  };

  return (
    // The parent needs to be 'relative' for absolute positioning to work, which it already is.
    <div className="relative p-4 mb-6 bg-slate-600 text-white rounded-lg shadow-lg">
      <p className="font-bold text-sm">FILTERING BY:</p>
      
      {/* The info div no longer needs to be in a flex container with the button */}
      <div>
        <h2 className="font-bold text-lg">{song.name}</h2>
        <p>{song.artist}</p>
        <p className="mt-1 text-slate-200">
          BPM: {song.bpm} | Key: {song.key}
        </p>
      </div>

      {/* The 'Add' button is now positioned absolutely within the card */}
      <button
        onClick={handleAddClick}
        className="absolute bottom-4 right-4 px-3 py-2 text-sm font-semibold text-indigo-700 bg-white rounded-lg shadow-sm hover:bg-gray-200"
      >
        Add
      </button>

      {/* The clear button remains the same */}
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