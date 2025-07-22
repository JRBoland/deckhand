import React from 'react';
const SearchBar = React.forwardRef(({ onSearch, isHighlighted }, ref) => {
  const highlightClasses = 'ring-2 ring-purple-500 ring-offset-2 transition-all';

  return (
    <div className="mb-6 scroll-mt-4" ref={ref}>
      <label htmlFor="search" className="sr-only">
        Search Songs
      </label>
      <input
        type="text"
        id="search"
        placeholder="Search for a song or artist..."
        // Conditionally add the highlight classes
        className={`w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm md:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isHighlighted ? highlightClasses : ''}`}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
});

export default SearchBar;