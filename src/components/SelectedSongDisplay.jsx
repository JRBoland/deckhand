import React from 'react';

const SelectedSongDisplay = ({ song, onClear, onAddToPlaylist }) => {
  const handleAddClick = () => {
    onAddToPlaylist(song);
  };

  return (
    <div className="relative p-4 mb-6 bg-ink text-surface border-2 border-border rounded-brutal-lg shadow-brutal">
      <p className="font-display text-xs font-bold uppercase tracking-wider text-primary">Filtering by</p>
      <div>
        <h2 className="font-display font-bold text-lg text-surface">{song.name}</h2>
        <p className="font-sans text-surface/90">{song.artist}</p>
        <p className="mt-1 font-sans text-sm text-surface/80">
          BPM: {song.bpm} | Key: {song.key}
        </p>
      </div>

      <button
        onClick={handleAddClick}
        className="btn-primary absolute bottom-4 right-4 px-3 py-2 text-sm"
      >
        Add
      </button>

      <button
        onClick={onClear}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-brutal border-2 border-border bg-surface text-ink font-display font-bold hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-brutal-sm transition-all"
        aria-label="Clear selection"
      >
        &times;
      </button>
    </div>
  );
};

export default SelectedSongDisplay;
