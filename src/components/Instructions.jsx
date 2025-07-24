import React from 'react';

const Instructions = ({ isVisible, onDismiss }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 mb-6 rounded-r-lg shadow">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 font-bold"
        aria-label="Dismiss instructions"
      >
        &times;
      </button>
      <h4 className="font-bold mb-2">Quick Guide</h4>
      <ul className="list-disc list-inside text-sm space-y-1">
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