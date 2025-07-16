import React, { useState } from 'react';

const Instructions = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 mb-6 rounded-r-lg shadow">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 font-bold"
        aria-label="Dismiss instructions"
      >
        &times;
      </button>
      <h4 className="font-bold mb-2">Quick Guide</h4>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li><strong>Find a Song:</strong> Use the search bar or scroll through your library.</li>
        <li><strong>See Compatible Tracks:</strong> Click any song to see tracks that mix well with it.</li>
        <li><strong>Build Your Set:</strong> Click the "Add" button on any song to add it to your Current Setlist.</li>
        <li><strong>Reorder & Refine:</strong> In the setlist on the right, drag songs to reorder them, click to select, or '×' to remove.</li>
      </ul>
    </div>
  );
};

export default Instructions;