import React from 'react';

const Instructions = ({ isVisible, onDismiss }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-primary/20 border-2 border-border rounded-brutal-lg p-4 mb-6 shadow-brutal">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-brutal border-2 border-border bg-surface font-display font-bold text-ink hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-brutal-sm transition-all"
        aria-label="Dismiss instructions"
      >
        &times;
      </button>
      <h4 className="font-display font-bold text-ink mb-2">Quick Guide</h4>
      <ul className="list-disc list-inside text-sm space-y-1 text-ink font-sans">
        <li><strong>Select a Song:</strong> Click any song in your library to find compatible tracks.</li>
        <li><strong>Filter Your Results:</strong> Use the Filter Options to enable and adjust filters for BPM, Key, Genre, Year, and Length.</li>
        <li><strong>Build Your Setlist:</strong> Click the "Add" button on any song to add it to your current setlist.</li>
        <li><strong>Reorder & Refine:</strong> In the setlist, drag songs to reorder them (hold & drag on mobile), click to select, or '×' to remove.</li>
        <li><strong>Save & Export:</strong> Save and/or Export your setlist to refer to later when you play out your new mix!</li>
      </ul>
    </div>
  );
};

export default Instructions;
